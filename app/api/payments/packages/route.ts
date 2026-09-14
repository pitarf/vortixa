import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Garante que o pacote de teste R$ 9,90 sempre exista no banco
    await prisma.creditPackage.upsert({
      where: { id: "pkg-test" },
      create: {
        id: "pkg-test",
        name: "Plano Teste",
        description: "Pacote promocional para validação rápida de pagamentos e motores de IA.",
        credits: 50,
        priceCents: 990,
        bonusCredits: 0,
        status: true,
        displayOrder: 0,
      },
      update: {
        name: "Plano Teste",
        priceCents: 990,
        credits: 50,
        status: true,
        displayOrder: 0,
      },
    }).catch((e) => {
      console.warn("Aviso ao auto-upsertar pkg-test:", e.message);
    });

    const packages = await prisma.creditPackage.findMany({
      where: { status: true },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        credits: true,
        priceCents: true,
        bonusCredits: true,
        displayOrder: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(packages, { status: 200 });
  } catch (err: any) {
    console.error("Erro no endpoint GET /api/payments/packages:", err);
    return NextResponse.json(
      { error: err.message || "Erro ao listar pacotes de crédito." },
      { status: 500 }
    );
  }
}
