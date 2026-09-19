import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, error: "Código de cupom ou indicação não fornecido." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Cupons promocionais oficiais de desconto do sistema
    const promoCoupons: Record<string, { discountPercent: number; label: string }> = {
      "VORTIXIA10": { discountPercent: 10, label: "10% de desconto oficial" },
      "PROMO15": { discountPercent: 15, label: "15% de desconto especial" },
      "VIP20": { discountPercent: 20, label: "20% de desconto VIP" },
      "PRIMEIRACOMPRA": { discountPercent: 10, label: "10% de desconto de boas-vindas" },
    };

    if (promoCoupons[cleanCode]) {
      return NextResponse.json({
        valid: true,
        type: "PROMO",
        code: cleanCode,
        discountPercent: promoCoupons[cleanCode].discountPercent,
        label: promoCoupons[cleanCode].label,
        message: `Cupom ${cleanCode} aplicado com sucesso! ${promoCoupons[cleanCode].discountPercent}% de desconto ativado.`,
      });
    }

    // 2. Códigos de indicação / afiliados cadastrados no banco
    const [affiliate, discountSetting] = await Promise.all([
      prisma.affiliateProfile.findFirst({
        where: {
          status: "ACTIVE",
          OR: [
            { code: { equals: cleanCode, mode: "insensitive" } },
            { customCode: { equals: cleanCode, mode: "insensitive" } },
          ],
        },
        select: {
          code: true,
          customCode: true,
        },
      }),
      prisma.systemSetting.findUnique({
        where: { key: "affiliateDefaultDiscountPercent" },
      }),
    ]);

    if (affiliate) {
      const discountPercent = discountSetting ? parseInt(discountSetting.value, 10) || 10 : 10;
      return NextResponse.json({
        valid: true,
        type: "AFFILIATE",
        code: cleanCode,
        discountPercent,
        label: `Cupom de Vendedor Ativo (${discountPercent}% OFF)`,
        message: `Código de vendedor ${cleanCode} validado com sucesso! ${discountPercent}% de desconto aplicado no plano.`,
      });
    }

    return NextResponse.json(
      {
        valid: false,
        error: "Cupom ou código de indicação inválido ou expirado.",
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("[ValidateCoupon] Erro:", error);
    return NextResponse.json(
      { valid: false, error: "Falha ao validar cupom. Tente novamente." },
      { status: 500 }
    );
  }
}
