import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CurrencyService } from "@/services/currency.service";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado. Apenas administradores." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    const rateData = await CurrencyService.getDollarRateDetails(forceRefresh);

    return NextResponse.json({
      rate: rateData.rate,
      source: rateData.source,
      lastUpdated: rateData.lastUpdated,
      formattedRate: `R$ ${rateData.rate.toFixed(2).replace(".", ",")}`,
    });
  } catch (error: any) {
    console.error("Erro ao obter taxa de câmbio USD/BRL:", error);
    return NextResponse.json(
      { error: "Erro ao consultar cotação do dólar.", rate: 5.60, formattedRate: "R$ 5,60" },
      { status: 500 }
    );
  }
}
