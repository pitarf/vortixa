import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreditService } from "@/services/credit.service";
import { AffiliateService } from "@/services/affiliate.service";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter no mínimo 2 caracteres").max(60, "O nome deve ter no máximo 60 caracteres").optional(),
  customCode: z.string().trim().min(3, "O código deve ter no mínimo 3 caracteres").max(20, "O código deve ter no máximo 20 caracteres").regex(/^[A-Za-z0-9_-]+$/, "O código deve conter apenas letras, números, hífen e underline").optional(),
});

/**
 * GET /api/user/profile
 * Retorna as informações consolidadas da conta do usuário:
 * - Identidade (Nome, E-mail, Avatar, Cargo, Data de Cadastro)
 * - Saldo em tempo real de créditos
 * - Plano de créditos ativo
 * - Status de credenciais (se possui senha cadastrada)
 * - Dados de afiliado (código, link de indicação, comissão, indicados e saldo em R$)
 */
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Sessão expirada ou não autenticada. Faça login novamente." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 1. Busca dados do usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isUnlimited: true,
        createdAt: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado em nossa base de dados." },
        { status: 404 }
      );
    }

    // 2. Saldo de créditos e Plano ativo
    const balance = await CreditService.getBalance(userId);

    let planName = "Sem Plano (Gratuito)";
    if (user.isUnlimited || user.email?.toLowerCase() === "rfpita.ti@gmail.com") {
      planName = "Acesso Ilimitado";
    } else {
      const paidOrder = await prisma.order.findFirst({
        where: { userId, status: "PAID" },
        orderBy: { createdAt: "desc" },
      });

      if (paidOrder) {
        if (paidOrder.packageId.includes("1000")) {
          planName = "Plano Criador Pro";
        } else if (paidOrder.packageId.includes("500")) {
          planName = "Plano Profissional";
        } else {
          planName = "Plano Iniciante";
        }
      } else {
        planName = "Sem Plano (10 cr bônus)";
      }
    }

    // 3. Dados de Afiliado (Garante perfil de indicação para todo usuário)
    const affiliateStats = await AffiliateService.getAffiliateStats(userId);
    const activeCode = affiliateStats?.profile?.customCode || affiliateStats?.profile?.code || "VORTIXIA";

    // Determina a URL base para o link de indicação
    const urlObj = new URL(req.url);
    const origin = process.env.NEXTAUTH_URL || `${urlObj.protocol}//${urlObj.host}` || "https://vortixia.com.br";
    const referralLink = `${origin}/register?ref=${activeCode}`;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name || "Criador VORTIXIA",
        email: user.email,
        image: user.image,
        role: user.role,
        isUnlimited: user.isUnlimited || user.email?.toLowerCase() === "rfpita.ti@gmail.com",
        createdAt: user.createdAt,
        balance,
        planName,
        hasPassword: Boolean(user.passwordHash),
      },
      affiliate: {
        id: affiliateStats.profile.id,
        code: affiliateStats.profile.code,
        customCode: affiliateStats.profile.customCode,
        activeCode,
        referralLink,
        commissionRate: affiliateStats.profile.commissionRate,
        commissionPercent: Math.round(affiliateStats.profile.commissionRate * 100),
        balanceCents: affiliateStats.profile.balanceCents,
        totalEarningsCents: affiliateStats.profile.totalEarningsCents,
        withdrawnCents: affiliateStats.profile.withdrawnCents,
        pixKey: affiliateStats.profile.pixKey,
        pixKeyType: affiliateStats.profile.pixKeyType,
        totalReferrals: affiliateStats.totalReferrals,
        convertedReferrals: affiliateStats.convertedReferrals,
      },
    });
  } catch (error: any) {
    console.error("Erro ao carregar perfil do usuário:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao obter dados da conta." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/profile
 * Permite atualizar dados da conta (Nome de exibição e/ou código de afiliado customizado).
 */
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Sessão expirada. Faça login novamente." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const rawBody = await req.json();
    const parsed = updateProfileSchema.safeParse(rawBody);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dados enviados inválidos.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, customCode } = parsed.data;

    if (!name && !customCode) {
      return NextResponse.json(
        { error: "Nenhum campo fornecido para atualização." },
        { status: 400 }
      );
    }

    // 1. Atualiza o nome de exibição no banco de dados se fornecido
    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    // 2. Atualiza o código de indicação se fornecido
    if (customCode) {
      await AffiliateService.updateCustomCode(userId, customCode);
    }

    return NextResponse.json({
      success: true,
      message: "Perfil atualizado com sucesso!",
    });
  } catch (error: any) {
    console.error("Erro ao atualizar perfil do usuário:", error);
    return NextResponse.json(
      { error: error.message || "Não foi possível atualizar as informações." },
      { status: 400 }
    );
  }
}
