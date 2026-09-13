import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { AffiliateService } from "@/services/affiliate.service";
import { z } from "zod";

const patchSchema = z.object({
  customCode: z.string().min(3).max(20).optional(),
  pixKey: z.string().min(1).max(100).optional(),
  pixKeyType: z.enum(["CPF", "CNPJ", "EMAIL", "PHONE", "RANDOM"]).optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sessão expirada. Faça login novamente." }, { status: 401 });
    }

    const stats = await AffiliateService.getAffiliateStats(session.user.id);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error("Erro ao buscar dados do afiliado:", error);
    return NextResponse.json(
      { error: error.message || "Não foi possível carregar as informações do afiliado." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sessão expirada. Faça login novamente." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    let updatedProfile: any;

    if (parsed.data.customCode) {
      updatedProfile = await AffiliateService.updateCustomCode(session.user.id, parsed.data.customCode);
    }

    if (parsed.data.pixKey && parsed.data.pixKeyType) {
      updatedProfile = await AffiliateService.updatePixKey(
        session.user.id,
        parsed.data.pixKey,
        parsed.data.pixKeyType
      );
    }

    const stats = await AffiliateService.getAffiliateStats(session.user.id);

    return NextResponse.json({
      success: true,
      message: "Dados de afiliado atualizados com sucesso!",
      stats,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar dados do afiliado:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar dados de afiliado." },
      { status: 400 }
    );
  }
}
