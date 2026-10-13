import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreditService } from "@/services/credit.service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const balance = await CreditService.getBalance(session.user.id);
    const userRecord = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isUnlimited: true },
    });

    const tools = await prisma.aITool.findMany({
      where: { status: true },
      include: {
        model: true,
      },
    });

    // Modelos de IA ativos com seus nomes customizados e custos para sincronização com o cliente
    const models = await prisma.aIModel.findMany({
      where: { status: true },
      select: {
        id: true,
        name: true,
        technicalName: true,
        creditCost: true,
        status: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      balance,
      creditMode: userRecord?.isUnlimited ? "UNLIMITED" : "LIMITED",
      tools,
      models,
    });
  } catch (err: any) {
    console.error("Erro no endpoint GET /api/tools/config:", err);
    return NextResponse.json({ error: "Ocorreu um erro interno ao carregar as configurações." }, { status: 500 });
  }
}
