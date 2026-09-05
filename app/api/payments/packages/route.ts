import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
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
