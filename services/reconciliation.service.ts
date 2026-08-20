import prisma from "@/lib/prisma";

export interface ReconcileResult {
  discrepancies: {
    type: "PAYMENT_WITHOUT_ORDER" | "ORDER_WITHOUT_PAYMENT" | "PAID_WITHOUT_CREDITS" | "CREDITS_WITHOUT_PAYMENT" | "VALUE_MISMATCH";
    description: string;
    refId: string; // paymentId, orderId ou transactionId
  }[];
  isConsistent: boolean;
}

export class ReconciliationService {
  /**
   * Compara pagamentos externos/internos, pedidos e créditos concedidos para auditoria financeira.
   */
  static async runReconciliation(): Promise<ReconcileResult> {
    const discrepancies: ReconcileResult["discrepancies"] = [];

    // 1. Busca todos os pagamentos com seus pedidos e transações de créditos associadas
    const payments = await prisma.payment.findMany({
      include: {
        order: true,
        creditTx: true,
      },
    });

    for (const p of payments) {
      // Divergência 1: Pagamento sem pedido associado
      if (!p.orderId) {
        discrepancies.push({
          type: "PAYMENT_WITHOUT_ORDER",
          description: `Pagamento ID: ${p.id} não possui pedido (orderId) associado.`,
          refId: p.id,
        });
      }

      // Divergência 2: Divergência de valor comercial entre Order e Payment
      if (p.order && p.amountCents !== p.order.amountCents) {
        discrepancies.push({
          type: "VALUE_MISMATCH",
          description: `Divergência de valor: Order (${p.order.amountCents} cents) vs Payment (${p.amountCents} cents).`,
          refId: p.id,
        });
      }

      // Divergência 3: Pagamento confirmado (PAID), mas sem transação de crédito correspondente
      if (p.status === "PAID" && !p.creditTx) {
        discrepancies.push({
          type: "PAID_WITHOUT_CREDITS",
          description: `Pagamento confirmado ID: ${p.id} não possui transação de crédito correspondente.`,
          refId: p.id,
        });
      }
    }

    // 2. Busca todos os pedidos
    const orders = await prisma.order.findMany({
      include: {
        payments: true,
      },
    });

    for (const o of orders) {
      // Divergência 4: Pedidos sem nenhum registro de pagamento associado
      if (o.payments.length === 0) {
        discrepancies.push({
          type: "ORDER_WITHOUT_PAYMENT",
          description: `Pedido ID: ${o.id} não possui nenhum registro de pagamento.`,
          refId: o.id,
        });
      }
    }

    // 3. Busca transações de créditos de tipo PURCHASE que não possuem paymentId correspondente no banco
    const creditTxs = await prisma.creditTransaction.findMany({
      where: { type: "PURCHASE" },
    });

    for (const tx of creditTxs) {
      if (!tx.paymentId) {
        discrepancies.push({
          type: "CREDITS_WITHOUT_PAYMENT",
          description: `Crédito de compra ID: ${tx.id} concedido sem paymentId de referência.`,
          refId: tx.id,
        });
      } else {
        // Verifica se o pagamento referenciado existe
        const linkedPayment = payments.find(p => p.id === tx.paymentId);
        if (!linkedPayment) {
          discrepancies.push({
            type: "CREDITS_WITHOUT_PAYMENT",
            description: `Crédito de compra ID: ${tx.id} aponta para pagamento inexistente ID: ${tx.paymentId}.`,
            refId: tx.id,
          });
        }
      }
    }

    return {
      discrepancies,
      isConsistent: discrepancies.length === 0,
    };
  }

  /**
   * Executa ajustes manuais administrativos auditáveis, gravando o motivo na tabela AuditLog
   * e garantindo idempotência estrita via constraint única no banco de dados.
   */
  static async adjustCreditsManually(
    adminUserId: string,
    targetUserId: string,
    creditsAmount: number,
    reason: string,
    idempotencyKey?: string
  ): Promise<{ alreadyProcessed: boolean }> {
    if (!adminUserId || !targetUserId || !creditsAmount || !reason) {
      throw new Error("Parâmetros obrigatórios ausentes para o ajuste administrativo.");
    }

    // Valida se quem está solicitando o ajuste é um administrador
    const admin = await prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== "ADMIN") {
      throw new Error("Apenas administradores podem efetuar ajustes manuais de saldo.");
    }

    // 1. Se uma chave de idempotência foi fornecida, verifica se a operação já foi concluída anteriormente
    if (idempotencyKey) {
      const existingTx = await prisma.creditTransaction.findUnique({
        where: { idempotencyKey },
      });
      if (existingTx) {
        // Retorno idempotente e seguro: a operação já foi realizada e não gera novo crédito ou log
        return { alreadyProcessed: true };
      }
    }

    try {
      return await prisma.$transaction(async (tx) => {
        // 2. Lock pessimista do saldo de créditos
        await tx.$executeRaw`
          SELECT 1 FROM "CreditBalance" 
          WHERE "userId" = ${targetUserId} 
          FOR UPDATE
        `;

        // Verifica novamente dentro do lock se a chave já foi gravada por transação concorrente
        if (idempotencyKey) {
          const inTxExisting = await tx.creditTransaction.findUnique({
            where: { idempotencyKey },
          });
          if (inTxExisting) {
            return { alreadyProcessed: true };
          }
        }

        const balanceRecord = await tx.creditBalance.findUnique({
          where: { userId: targetUserId },
        });

        const currentBalance = balanceRecord?.balance || 0;
        const newBalance = currentBalance + creditsAmount;

        // 3. Atualiza saldo de forma atômica
        await tx.creditBalance.upsert({
          where: { userId: targetUserId },
          create: { userId: targetUserId, balance: newBalance },
          update: { balance: newBalance },
        });

        // 4. Grava transação do Ledger vinculando a chave de idempotência com constraint única
        await tx.creditTransaction.create({
          data: {
            userId: targetUserId,
            amount: creditsAmount,
            type: "ADMIN_ADJUSTMENT",
            description: `Ajuste manual administrativo: ${reason}`,
            idempotencyKey: idempotencyKey || undefined,
          },
        });

        // 5. Registra a ação de auditoria administrativa com autoria garantida pelo servidor
        await tx.auditLog.create({
          data: {
            userId: adminUserId,
            action: "MANUAL_CREDIT_ADJUSTMENT",
            details: `Ajuste manual de ${creditsAmount} créditos para o usuário ${targetUserId}. Motivo: ${reason}. Saldo anterior: ${currentBalance}, Novo saldo: ${newBalance}`,
          },
        });

        return { alreadyProcessed: false };
      });
    } catch (err: any) {
      // Se duas requisições simultâneas disputarem a mesma idempotencyKey ao mesmo tempo e violarem a constraint P2002
      if (err.code === "P2002" && idempotencyKey) {
        return { alreadyProcessed: true };
      }
      throw err;
    }
  }
}
