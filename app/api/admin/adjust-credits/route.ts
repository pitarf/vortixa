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
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Payload JSON inválido." }, { status: 400 });
    }

    const { targetUserId, creditsAmount, reason, idempotencyKey } = body;

    if (!targetUserId || typeof targetUserId !== "string" || targetUserId.trim() === "") {
      return NextResponse.json({ error: "O ID do usuário de destino (targetUserId) é obrigatório." }, { status: 400 });
    }

    if (creditsAmount === undefined || creditsAmount === null) {
      return NextResponse.json({ error: "A quantidade de créditos é obrigatória." }, { status: 400 });
    }

    if (
      typeof creditsAmount !== "number" ||
      !Number.isInteger(creditsAmount) ||
      creditsAmount === 0 ||
      !Number.isFinite(creditsAmount) ||
      Number.isNaN(creditsAmount)
    ) {
      return NextResponse.json(
        { error: "A quantidade de créditos deve ser um número inteiro diferente de zero." },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== "string" || reason.trim() === "") {
      return NextResponse.json({ error: "O motivo do ajuste (reason) é obrigatório." }, { status: 400 });
    }

    const result = await ReconciliationService.adjustCreditsManually(
      admin.id,
      targetUserId,
      creditsAmount,
      reason,
      idempotencyKey
    );

    if (result.alreadyProcessed) {
      return NextResponse.json({ message: "Operação já processada anteriormente (idempotente)." }, { status: 200 });
    }

    return NextResponse.json({ message: "Créditos ajustados com sucesso administrativamente." }, { status: 200 });
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
