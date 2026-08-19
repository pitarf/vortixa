import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { AdminDashboardService } from "@/services/admin-dashboard.service";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    // Resolve o usuário da sessão de forma estritamente segura no backend (não confia no payload do client)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
    }

    const stats = await AdminDashboardService.getConsolidatedStats(user.id);
    return NextResponse.json(stats);
  } catch (err: any) {
    console.error("Erro no carregamento dos dados do admin dashboard:", err);
    return NextResponse.json({ error: "Erro interno ao carregar estatísticas." }, { status: 500 });
  }
}
