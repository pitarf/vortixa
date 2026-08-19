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

    const body = await req.json();
    const { targetUserId, creditsAmount, reason } = body;

    if (!targetUserId || creditsAmount === undefined || !reason) {
      return NextResponse.json({ error: "Parâmetros obrigatórios ausentes." }, { status: 400 });
    }

    await ReconciliationService.adjustCreditsManually(admin.id, targetUserId, creditsAmount, reason);

    return NextResponse.json({ message: "Créditos ajustados com sucesso administrativamente." });
  } catch (err: any) {
    console.error("Erro no ajuste manual de créditos:", err);
    return NextResponse.json({ error: err.message || "Erro interno no servidor." }, { status: 500 });
  }
}
