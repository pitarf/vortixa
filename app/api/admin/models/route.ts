import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma, ModelType, ModelCategory } from "@prisma/client";

/**
 * Helper para validar se o usuário é ADMIN
 */
async function checkAdmin() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return { authorized: false, status: 401, error: "Sessão inválida ou expirada." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, name: true, email: true, isBlocked: true },
  });

  if (!user || user.role !== "ADMIN") {
    return { authorized: false, status: 403, error: "Acesso não autorizado. Apenas administradores." };
  }

  if (user.isBlocked) {
    return { authorized: false, status: 403, error: "Conta administrativa suspensa. Entre em contato com o suporte." };
  }

  return { authorized: true, user };
}

/**
 * GET /api/admin/models
 * Listagem administrativa com métricas consolidadas (total de bookings, status ativos/inativos, etc.)
 * Suporte a query params: search, type, category, status (all|active|inactive), page, limit.
 */
export async function GET(req: Request) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.authorized || !adminCheck.user) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim();
    const type = (searchParams.get("type") || "").trim().toUpperCase();
    const category = (searchParams.get("category") || "").trim().toUpperCase();
    const status = (searchParams.get("status") || "all").trim().toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.MarketplaceModelWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    if (type && (type === "AI" || type === "REAL")) {
      where.type = type as ModelType;
    }

    if (category && Object.values(ModelCategory).includes(category as ModelCategory)) {
      where.category = category as ModelCategory;
    }

    if (status === "active") {
      where.status = true;
    } else if (status === "inactive") {
      where.status = false;
    }

    // Métricas gerais para o Dashboard Administrativo de Modelos
    const [
      totalModels,
      activeCount,
      aiCount,
      realCount,
      totalBookings,
      models,
    ] = await Promise.all([
      prisma.marketplaceModel.count(),
      prisma.marketplaceModel.count({ where: { status: true } }),
      prisma.marketplaceModel.count({ where: { type: ModelType.AI } }),
      prisma.marketplaceModel.count({ where: { type: ModelType.REAL } }),
      prisma.modelBooking.count(),
      prisma.marketplaceModel.findMany({
        where,
        include: {
          _count: {
            select: { bookings: true },
          },
        },
        orderBy: [
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
    ]);

    const filteredTotal = await prisma.marketplaceModel.count({ where });
    const totalPages = Math.ceil(filteredTotal / limit);

    return NextResponse.json({
      metrics: {
        totalModels,
        activeCount,
        inactiveCount: totalModels - activeCount,
        aiCount,
        realCount,
        totalBookings,
      },
      models: models.map((m) => ({
        ...m,
        totalBookings: m._count.bookings,
      })),
      pagination: {
        total: filteredTotal,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Erro ao listar modelos administrativos:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar listagem administrativa de modelos." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/models
 * Cadastro de novos modelos pelo administrador com validações estritas e geração de AuditLog.
 */
export async function POST(req: Request) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.authorized || !adminCheck.user) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await req.json();
    const {
      name,
      slug,
      type,
      category,
      bio,
      avatarUrl,
      coverUrl,
      gallery,
      tags,
      promptTrigger,
      referenceFaceUrl,
      loraModelId,
      instagramHandle,
      location,
      contactEmail,
      bookingPriceCents,
      creditsPricePerGen,
      status,
      isFeatured,
      isHot18,
    } = body;

    // Validações básicas obrigatórias
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "O nome do modelo é obrigatório." }, { status: 400 });
    }

    if (!avatarUrl || typeof avatarUrl !== "string" || !avatarUrl.trim()) {
      return NextResponse.json({ error: "A URL do avatar é obrigatória." }, { status: 400 });
    }

    // Gerar ou sanitizar slug
    const generatedSlug = (slug || name)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!generatedSlug) {
      return NextResponse.json({ error: "Slug inválido ou impossível de gerar." }, { status: 400 });
    }

    // Verificar se slug já está em uso
    const existingSlug = await prisma.marketplaceModel.findUnique({
      where: { slug: generatedSlug },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: `Já existe um modelo com o identificador/slug "${generatedSlug}".` },
        { status: 409 }
      );
    }

    // Validação estrita de bookingPriceCents
    let validatedBookingPriceCents: number | null = null;
    if (bookingPriceCents !== undefined && bookingPriceCents !== null) {
      const parsedPrice = parseInt(String(bookingPriceCents), 10);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return NextResponse.json(
          { error: "O preço de reserva (bookingPriceCents) deve ser um valor inteiro positivo ou zero." },
          { status: 400 }
        );
      }
      validatedBookingPriceCents = parsedPrice;
    }

    // Validação estrita de creditsPricePerGen
    let validatedCreditsPrice = 5;
    if (creditsPricePerGen !== undefined && creditsPricePerGen !== null) {
      const parsedCredits = parseInt(String(creditsPricePerGen), 10);
      if (isNaN(parsedCredits) || parsedCredits < 1) {
        return NextResponse.json(
          { error: "O valor de créditos por geração (creditsPricePerGen) deve ser no mínimo 1." },
          { status: 400 }
        );
      }
      validatedCreditsPrice = parsedCredits;
    }

    const modelType = (type && (type === "AI" || type === "REAL")) ? (type as ModelType) : ModelType.AI;
    const modelCategory = (category && Object.values(ModelCategory).includes(category as ModelCategory))
      ? (category as ModelCategory)
      : ModelCategory.FASHION;

    const newModel = await prisma.$transaction(async (tx) => {
      const created = await tx.marketplaceModel.create({
        data: {
          name: name.trim(),
          slug: generatedSlug,
          type: modelType,
          category: modelCategory,
          bio: bio ? String(bio).trim() : null,
          avatarUrl: avatarUrl.trim(),
          coverUrl: coverUrl ? String(coverUrl).trim() : null,
          gallery: Array.isArray(gallery) ? gallery.map(String) : [],
          tags: Array.isArray(tags) ? tags.map((t) => String(t).trim()) : [],
          promptTrigger: promptTrigger ? String(promptTrigger).trim() : null,
          referenceFaceUrl: referenceFaceUrl ? String(referenceFaceUrl).trim() : null,
          loraModelId: loraModelId ? String(loraModelId).trim() : null,
          instagramHandle: instagramHandle ? String(instagramHandle).trim() : null,
          location: location ? String(location).trim() : null,
          contactEmail: contactEmail ? String(contactEmail).trim() : null,
          bookingPriceCents: validatedBookingPriceCents,
          creditsPricePerGen: validatedCreditsPrice,
          status: status !== undefined ? Boolean(status) : true,
          isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
          isHot18: isHot18 !== undefined ? Boolean(isHot18) : (modelCategory === ModelCategory.HOT_18),
        },
      });

      // Registro no log de auditoria
      await tx.auditLog.create({
        data: {
          userId: adminCheck.user.id,
          action: "CREATE_MARKETPLACE_MODEL",
          details: JSON.stringify({
            modelId: created.id,
            name: created.name,
            slug: created.slug,
            type: created.type,
            category: created.category,
            adminEmail: adminCheck.user.email,
          }),
        },
      });

      return created;
    });

    return NextResponse.json(
      {
        message: "Modelo criado com sucesso!",
        model: newModel,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar modelo pelo admin:", error);
    return NextResponse.json(
      { error: "Erro interno ao cadastrar modelo." },
      { status: 500 }
    );
  }
}
