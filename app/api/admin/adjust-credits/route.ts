import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ReconciliationService } from "@/services/reconciliation.service";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isBlocked: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
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

    const { targetUserId, creditsAmount, reason, idempotencyKey, action, isBlocked } = body;

    if (!targetUserId || typeof targetUserId !== "string" || targetUserId.trim() === "") {
      return NextResponse.json({ error: "O ID ou e-mail do usuário de destino é obrigatório." }, { status: 400 });
    }

    const normalizedTarget = targetUserId
      .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, "-")
      .trim();

    // Localiza o usuário de destino para validar existência e saldo atual
    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: normalizedTarget },
          { email: { equals: normalizedTarget.toLowerCase(), mode: "insensitive" } },
        ],
      },
      include: {
        creditBalance: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Usuário alvo não encontrado." }, { status: 404 });
    }

    // Se a intenção for apenas alterar o bloqueio da IA (isBlocked) sem mexer em créditos
    if (isBlocked !== undefined && (creditsAmount === undefined || creditsAmount === null || creditsAmount === 0) && action !== "ZERO") {
      if (admin.id === targetUser.id && isBlocked === true) {
        return NextResponse.json({ error: "Você não pode bloquear sua própria conta de administrador." }, { status: 400 });
      }

      await prisma.user.update({
        where: { id: targetUser.id },
        data: { isBlocked },
      });

      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: isBlocked ? "USER_BLOCKED" : "USER_UNBLOCKED",
          details: `Administrador ${admin.role} ${isBlocked ? "bloqueou" : "desbloqueou"} o acesso à IA do usuário ${targetUser.email} (${targetUser.id}).`,
        },
      });

      return NextResponse.json({
        message: isBlocked ? "Usuário banido/bloqueado da IA com sucesso!" : "Acesso do usuário à IA liberado com sucesso!",
        user: {
          id: targetUser.id,
          email: targetUser.email,
          name: targetUser.name,
          isBlocked,
        },
      }, { status: 200 });
    }

    let calculatedAmount = creditsAmount;
    const currentBalance = targetUser.creditBalance?.balance || 0;

    // Ação especial: Zerar Saldo
    if (action === "ZERO") {
      if (currentBalance <= 0) {
        // Se também veio alteração de bloqueio
        if (isBlocked !== undefined && admin.id !== targetUser.id) {
          await prisma.user.update({
            where: { id: targetUser.id },
            data: { isBlocked },
          });
        }
        return NextResponse.json({
          message: "O saldo deste usuário já está zerado (0 créditos).",
          newBalance: 0,
          user: {
            id: targetUser.id,
            email: targetUser.email,
            name: targetUser.name,
            isBlocked: isBlocked !== undefined ? isBlocked : targetUser.isBlocked,
          },
        }, { status: 200 });
      }
      calculatedAmount = -currentBalance;
    }

    if (calculatedAmount === undefined || calculatedAmount === null) {
      return NextResponse.json({ error: "A quantidade de créditos é obrigatória." }, { status: 400 });
    }

    if (
      typeof calculatedAmount !== "number" ||
      !Number.isInteger(calculatedAmount) ||
      calculatedAmount === 0 ||
      !Number.isFinite(calculatedAmount) ||
      Number.isNaN(calculatedAmount)
    ) {
      return NextResponse.json(
        { error: "A quantidade de créditos deve ser um número inteiro diferente de zero." },
        { status: 400 }
      );
    }

    // Fallback inteligente para motivo caso o administrador não preencha no mobile
    const finalReason =
      reason && typeof reason === "string" && reason.trim() !== ""
        ? reason.trim()
        : action === "ZERO"
        ? "Zerar saldo de créditos administrativamente"
        : calculatedAmount < 0
        ? `Dedução administrativa de ${Math.abs(calculatedAmount)} créditos`
        : `Acréscimo administrativo de ${calculatedAmount} créditos`;

    const result = await ReconciliationService.adjustCreditsManually(
      admin.id,
      targetUser.id,
      calculatedAmount,
      finalReason,
      idempotencyKey
    );

    // Atualiza status de bloqueio da IA se solicitado conjuntamente
    let updatedIsBlocked = targetUser.isBlocked;
    if (isBlocked !== undefined && admin.id !== targetUser.id && isBlocked !== targetUser.isBlocked) {
      await prisma.user.update({
        where: { id: targetUser.id },
        data: { isBlocked },
      });
      updatedIsBlocked = isBlocked;
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: isBlocked ? "USER_BLOCKED" : "USER_UNBLOCKED",
          details: `Administrador ${admin.role} ${isBlocked ? "bloqueou" : "desbloqueou"} o acesso à IA do usuário ${targetUser.email} (${targetUser.id}) durante ajuste de créditos.`,
        },
      });
    }

    // Busca saldo atualizado
    const updatedBalanceRec = await prisma.creditBalance.findUnique({
      where: { userId: targetUser.id },
    });
    const newBalance = updatedBalanceRec?.balance ?? Math.max(0, currentBalance + calculatedAmount);

    if (result.alreadyProcessed) {
      return NextResponse.json({
        message: "Operação já processada anteriormente (idempotente).",
        newBalance,
        user: {
          id: targetUser.id,
          email: targetUser.email,
          name: targetUser.name,
          isBlocked: updatedIsBlocked,
        },
      }, { status: 200 });
    }

    const actionText =
      action === "ZERO"
        ? "Saldo zerado com sucesso!"
        : calculatedAmount < 0
        ? `${Math.abs(calculatedAmount)} créditos deduzidos com sucesso!`
        : `${calculatedAmount} créditos adicionados com sucesso!`;

    return NextResponse.json({
      message: actionText,
      newBalance,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        isBlocked: updatedIsBlocked,
      },
    }, { status: 200 });
  } catch (err: any) {
    const statusCode =
      err.statusCode ||
      (err.code === "IDEMPOTENCY_CONFLICT"
        ? 409
        : err.code === "USER_NOT_FOUND" || err.code === "P2025"
        ? 404
        : err.code === "INVALID_CREDITS_AMOUNT" ||
          err.code === "INVALID_TARGET_USER" ||
          err.code === "INVALID_REASON"
        ? 400
        : err.code === "FORBIDDEN"
        ? 403
        : 500);

    if (statusCode >= 500) {
      console.error("Erro no ajuste manual de créditos:", err);
    }

    return NextResponse.json(
      { error: err.message || "Erro interno no servidor." },
      { status: statusCode }
    );
  }
}
