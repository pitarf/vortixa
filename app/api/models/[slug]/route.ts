import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/models/[slug]
 * Detalhes completos do modelo especificado pelo slug, portfólio,
 * parâmetros técnicos para integração com o Studio de IA e dados para contratação.
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug do modelo é obrigatório." }, { status: 400 });
    }

    const model = await prisma.marketplaceModel.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!model || !model.status) {
      return NextResponse.json({ error: "Modelo não encontrado ou inativo." }, { status: 404 });
    }

    // Estruturação dos metadados úteis para o Studio de IA
    const studioConfig = model.type === "AI" ? {
      promptTrigger: model.promptTrigger,
      referenceFaceUrl: model.referenceFaceUrl,
      loraModelId: model.loraModelId,
      creditsPerGeneration: model.creditsPricePerGen,
      recommendedAspectRatio: "3:4",
    } : null;

    // Não vazar email pessoal de modelos reais publicamente
    const isOwnerOrAdmin = false;

    return NextResponse.json({
      model: {
        id: model.id,
        name: model.name,
        slug: model.slug,
        type: model.type,
        category: model.category,
        bio: model.bio,
        avatarUrl: model.avatarUrl,
        coverUrl: model.coverUrl,
        gallery: model.gallery,
        tags: model.tags,
        instagramHandle: model.instagramHandle,
        location: model.location,
        contactEmail: isOwnerOrAdmin ? model.contactEmail : null,
        bookingPriceCents: model.bookingPriceCents,
        creditsPricePerGen: model.creditsPricePerGen,
        isFeatured: model.isFeatured,
        isHot18: model.isHot18,
        createdAt: model.createdAt,
        totalBookings: model._count.bookings,
        studioConfig,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar detalhes do modelo:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar busca de detalhes do modelo." },
      { status: 500 }
    );
  }
}
