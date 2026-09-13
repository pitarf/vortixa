import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { AffiliateService } from "@/services/affiliate.service";
import { z } from "zod";

const processPayoutSchema = z.object({
  payoutId: z.string().uuid("ID de saque inválido."),
  action: z.enum(["APPROVE", "REJECT"]),
  proofUrl: z.string().optional(),
  adminNotes: z.string().max(500).optional(),
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
    const status = searchParams.get("status") || undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    const result = await AffiliateService.adminListPayouts(status, page, limit);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Erro no endpoint GET /api/admin/affiliates/payouts:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao listar solicitações de saque." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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
    const parsed = processPayoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updatedPayout = await AffiliateService.adminProcessPayout(
      parsed.data.payoutId,
      parsed.data.action,
      session.user.id,
      {
        proofUrl: parsed.data.proofUrl,
        adminNotes: parsed.data.adminNotes,
      }
    );

    const actionText = parsed.data.action === "APPROVE" ? "aprovado e liquidado" : "rejeitado e o saldo estornado";

    return NextResponse.json({
      success: true,
      message: `Saque Pix ${actionText} com sucesso!`,
      payout: updatedPayout,
    });
  } catch (error: any) {
    console.error("Erro no endpoint POST /api/admin/affiliates/payouts:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar solicitação de saque." },
      { status: 400 }
    );
  }
}
