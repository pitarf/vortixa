import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { AffiliateService } from "@/services/affiliate.service";
import { z } from "zod";

const adminPatchSchema = z.object({
  affiliateId: z.string().uuid("ID de afiliado inválido."),
  commissionRate: z.number().min(0.01).max(0.7).optional(),
  status: z.enum(["ACTIVE", "PAUSED", "BLOCKED"]).optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado. Privilégio de administrador exigido." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    const result = await AffiliateService.adminListAffiliates(search, status, page, limit);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Erro no endpoint GET /api/admin/affiliates:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao listar afiliados no painel administrativo." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado. Privilégio de administrador exigido." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = adminPatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    let updatedAffiliate: any;

    if (parsed.data.commissionRate !== undefined) {
      updatedAffiliate = await AffiliateService.adminUpdateCommissionRate(
        parsed.data.affiliateId,
        parsed.data.commissionRate,
        session.user.id
      );
    }

    if (parsed.data.status !== undefined) {
      updatedAffiliate = await AffiliateService.adminUpdateStatus(
        parsed.data.affiliateId,
        parsed.data.status,
        session.user.id
      );
    }

    return NextResponse.json({
      success: true,
      message: "Afiliado atualizado com sucesso pela administração.",
      affiliate: updatedAffiliate,
    });
  } catch (error: any) {
    console.error("Erro no endpoint PATCH /api/admin/affiliates:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar dados do afiliado." },
      { status: 400 }
    );
  }
}
