import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { AdminDashboardService, TimePeriod } from "@/services/admin-dashboard.service";
import prisma from "@/lib/prisma";

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
      return NextResponse.json({ error: "Acesso não autorizado. Apenas administradores podem acessar estas métricas." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period") as TimePeriod) || "today";
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const stats = await AdminDashboardService.getExecutiveStats(user.id, period, startDate, endDate);
    return NextResponse.json(stats);
  } catch (err: any) {
    console.error("Erro no carregamento dos dados do admin dashboard:", err);
    return NextResponse.json({ error: "Erro interno ao carregar estatísticas do painel executivo." }, { status: 500 });
  }
}

