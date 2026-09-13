import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { AffiliateService } from "@/services/affiliate.service";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sessão expirada. Faça login novamente." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    const result = await AffiliateService.getConversionsHistory(session.user.id, page, limit);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Erro ao listar conversões do afiliado:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao consultar histórico de conversões." },
      { status: 500 }
    );
  }
}
