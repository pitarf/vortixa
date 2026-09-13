import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { AffiliateService } from "@/services/affiliate.service";
import { z } from "zod";

const payoutSchema = z.object({
  amountCents: z.number().int().min(AffiliateService.MIN_WITHDRAWAL_CENTS, `O valor mínimo para saque é de R$ ${(AffiliateService.MIN_WITHDRAWAL_CENTS / 100).toFixed(2).replace(".", ",")}.`),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sessão expirada. Faça login novamente." }, { status: 401 });
    }

    const payouts = await AffiliateService.getPayoutsHistory(session.user.id);

    return NextResponse.json({
      success: true,
      payouts,
    });
  } catch (error: any) {
    console.error("Erro ao listar histórico de saques:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao consultar histórico de saques." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sessão expirada. Faça login novamente." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = payoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Valor de saque inválido." },
        { status: 400 }
      );
    }

    const payout = await AffiliateService.requestPayout(session.user.id, parsed.data.amountCents);

    return NextResponse.json({
      success: true,
      message: "Solicitação de saque via Pix enviada com sucesso! A administração efetuará a transferência em até 24h úteis.",
      payout,
    });
  } catch (error: any) {
    console.error("Erro ao solicitar saque:", error);
    return NextResponse.json(
      { error: error.message || "Não foi possível processar a solicitação de saque." },
      { status: 400 }
    );
  }
}
