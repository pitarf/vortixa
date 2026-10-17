import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/users/lookup?q=...
 * Busca rápida de usuário por ID ou E-mail para preview no card de ajuste administrativo e modais de suporte.
 */
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, isBlocked: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
    }

    if (admin.isBlocked) {
      return NextResponse.json({ error: "Conta administrativa suspensa." }, { status: 403 });
    }

    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ found: false, user: null, message: "Digite ao menos 2 caracteres." }, { status: 200 });
    }

    // Normaliza hifens unicode se colado de apps mobile
    const normalizedQ = q.replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, "-").trim();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: normalizedQ },
          { email: { equals: normalizedQ.toLowerCase(), mode: "insensitive" } },
          { email: { contains: normalizedQ.toLowerCase(), mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        isUnlimited: true,
        createdAt: true,
        creditBalance: {
          select: {
            balance: true,
          },
        },
        payments: {
          where: {
            status: "PAID",
          },
          select: {
            amountCents: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ found: false, user: null, message: "Nenhum usuário encontrado." }, { status: 200 });
    }

    const totalSpentBrl = user.payments.reduce((acc, p) => acc + (p.amountCents / 100), 0);

    return NextResponse.json({
      found: true,
      user: {
        id: user.id,
        name: user.name || "Sem nome",
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        isUnlimited: user.isUnlimited,
        balance: user.creditBalance?.balance || 0,
        totalSpentBrl: Number(totalSpentBrl.toFixed(2)),
        totalPaidCount: user.payments.length,
        createdAt: user.createdAt,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error("Erro na busca de usuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar usuário." },
      { status: 500 }
    );
  }
}
