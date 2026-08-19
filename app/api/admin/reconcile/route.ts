import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ReconciliationService } from "@/services/reconciliation.service";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
    }

    const report = await ReconciliationService.runReconciliation();
    return NextResponse.json(report);
  } catch (err: any) {
    console.error("Erro no carregamento do relatório de reconciliação:", err);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
