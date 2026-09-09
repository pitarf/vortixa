import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma, ModelType, ModelCategory } from "@prisma/client";

/**
 * GET /api/models
 * Listagem pública com suporte a query params:
 * - search: busca por nome, bio ou tags
 * - type: filtro por tipo ("AI" | "REAL")
 * - category: filtro por ModelCategory ("FASHION", "COMMERCIAL", etc.)
 * - featured: "true" | "false"
 * - includeHot18: "true" | "false" (default: false - esconde conteúdo adulto a menos que solicitado explicitamente)
 * - page: número da página (default: 1)
 * - limit: registros por página (default: 12)
 *
 * Retorna apenas modelos com status = true.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim();
    const type = (searchParams.get("type") || "").trim().toUpperCase();
    const category = (searchParams.get("category") || "").trim().toUpperCase();
    const featured = (searchParams.get("featured") || "").trim().toLowerCase();
    const includeHot18 = (searchParams.get("includeHot18") || "").trim().toLowerCase() === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.MarketplaceModelWhereInput = {
      status: true,
    };

    // Controle de conteúdo Hot +18: se includeHot18 !== true, nunca exibe modelos isHot18 ou category HOT_18
    if (!includeHot18) {
      where.isHot18 = false;
      where.category = {
        not: ModelCategory.HOT_18,
      };
    }

    if (type && (type === "AI" || type === "REAL")) {
      where.type = type as ModelType;
    }

    if (category && Object.values(ModelCategory).includes(category as ModelCategory)) {
      where.category = category as ModelCategory;
    }

    if (featured === "true") {
      where.isFeatured = true;
    } else if (featured === "false") {
      where.isFeatured = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, models] = await Promise.all([
      prisma.marketplaceModel.count({ where }),
      prisma.marketplaceModel.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          category: true,
          bio: true,
          avatarUrl: true,
          coverUrl: true,
          gallery: true,
          tags: true,
          promptTrigger: true,
          referenceFaceUrl: true,
          loraModelId: true,
          instagramHandle: true,
          location: true,
          bookingPriceCents: true,
          creditsPricePerGen: true,
          status: true,
          isFeatured: true,
          isHot18: true,
          createdAt: true,
          _count: {
            select: { bookings: true },
          },
        },
        orderBy: [
          { isFeatured: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      models,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Erro ao listar modelos do Marketplace:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar listagem de modelos." },
      { status: 500 }
    );
  }
}
