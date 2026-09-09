import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

/**
 * POST /api/admin/payments/manual-approve
 * Aprovação manual de pagamentos com status PENDING:
 * - Recebe paymentId
 * - Executa em prisma.$transaction
 * - Atualiza status para PAID
 * - Credita o usuário na tabela CreditBalance (com lock pessimista)
 * - Gera registro em CreditTransaction com type: "PURCHASE"
 * - Registra em AuditLog com o ID do administrador autorizador
 * - Garante idempotência estrita
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, role: true, isBlocked: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado. Apenas administradores." }, { status: 403 });
    }

    if (admin.isBlocked) {
      return NextResponse.json({ error: "Conta administrativa suspensa. Entre em contato com o suporte." }, { status: 403 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Payload JSON inválido." }, { status: 400 });
    }

    const { paymentId, reason } = body;

    if (!paymentId || typeof paymentId !== "string" || paymentId.trim() === "") {
      return NextResponse.json({ error: "O campo 'paymentId' é obrigatório." }, { status: 400 });
    }

    const manualApprovalReason = reason && typeof reason === "string" && reason.trim() !== ""
      ? reason.trim()
      : "Aprovação manual autorizada via painel de administração";

    const result = await prisma.$transaction(async (tx) => {
      // 1. Lock pessimista no pagamento
      const paymentRows = await tx.$queryRaw<any[]>`
        SELECT * FROM "Payment"
        WHERE "id" = ${paymentId}
        FOR UPDATE
      `;

      if (!paymentRows || paymentRows.length === 0) {
        const notFoundErr: any = new Error("Pagamento não encontrado no sistema.");
        notFoundErr.statusCode = 404;
        throw notFoundErr;
      }

      const payment = paymentRows[0];

      // Se já estiver pago, retorna de forma idempotente
      if (payment.status === PaymentStatus.PAID) {
        return {
          alreadyPaid: true,
          paymentId: payment.id,
          creditsGranted: payment.creditsGranted,
          message: "Este pagamento já foi aprovado e creditado anteriormente.",
        };
      }

      if (payment.status === PaymentStatus.REFUNDED) {
        const refundedErr: any = new Error("Não é possível aprovar um pagamento que já foi estornado.");
        refundedErr.statusCode = 400;
        throw refundedErr;
      }

      // 2. Lock pessimista no saldo do usuário
      await tx.$executeRaw`
        SELECT 1 FROM "CreditBalance"
        WHERE "userId" = ${payment.userId}
        FOR UPDATE
      `;

      const balanceRecord = await tx.creditBalance.findUnique({
        where: { userId: payment.userId },
      });

      const currentBalance = balanceRecord?.balance || 0;
      const newBalance = currentBalance + payment.creditsGranted;

      // 3. Atualizar status do Pagamento para PAID
      const manualIdempotencyKey = payment.idempotencyKey || `manual_approve_${paymentId}_${Date.now()}`;

      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.PAID,
          idempotencyKey: manualIdempotencyKey,
          updatedAt: new Date(),
        },
      });

      // Se houver pedido vinculado, atualizar status do pedido também
      if (payment.orderId) {
        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            status: PaymentStatus.PAID,
            updatedAt: new Date(),
          },
        });
      }

      // 4. Creditar o saldo do usuário
      await tx.creditBalance.upsert({
        where: { userId: payment.userId },
        create: {
          userId: payment.userId,
          balance: newBalance,
        },
        update: {
          balance: newBalance,
        },
      });

      // 5. Gerar transação no Ledger
      const creditTx = await tx.creditTransaction.create({
        data: {
          userId: payment.userId,
          amount: payment.creditsGranted,
          type: "PURCHASE",
          description: `Recarga aprovada manualmente pelo administrador (Pagamento: ${paymentId}) - ${manualApprovalReason}`,
          paymentId: paymentId,
          idempotencyKey: manualIdempotencyKey,
        },
      });

      // 6. Registrar trilha de auditoria
      await tx.auditLog.create({
        data: {
          userId: admin.id,
          action: "MANUAL_PAYMENT_APPROVAL",
          details: `Pagamento ${paymentId} aprovado manualmente para o usuário ${payment.userId}. Concedidos ${payment.creditsGranted} créditos. Motivo: ${manualApprovalReason}. Saldo anterior: ${currentBalance}, Novo saldo: ${newBalance}.`,
        },
      });

      return {
        alreadyPaid: false,
        paymentId: payment.id,
        creditsGranted: payment.creditsGranted,
        newBalance,
        transactionId: creditTx.id,
        message: `Pagamento aprovado com sucesso! ${payment.creditsGranted} créditos concedidos ao usuário.`,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    if (statusCode >= 500) {
      console.error("Erro na aprovação manual de pagamento:", error);
    }
    return NextResponse.json(
      { error: error.message || "Erro interno ao aprovar pagamento manualmente." },
      { status: statusCode }
    );
  }
}
