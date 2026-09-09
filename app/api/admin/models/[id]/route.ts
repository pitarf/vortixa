import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma, ModelType, ModelCategory } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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
 * PATCH /api/admin/models/[id]
 * Atualiza campos cadastrais, galeria de fotos/vídeos, preço em créditos por geração,
 * valor de contratação diária e status de ativação do modelo.
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.authorized || !adminCheck.user) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID do modelo é obrigatório." }, { status: 400 });
    }

    const existingModel = await prisma.marketplaceModel.findUnique({
      where: { id },
    });

    if (!existingModel) {
      return NextResponse.json({ error: "Modelo não encontrado." }, { status: 404 });
    }

    const body = await req.json();
    const updateData: Prisma.MarketplaceModelUpdateInput = {};

    if (body.name !== undefined) {
      if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json({ error: "Nome não pode ser vazio." }, { status: 400 });
      }
      updateData.name = body.name.trim();
    }

    if (body.slug !== undefined) {
      const sanitizedSlug = String(body.slug)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      if (!sanitizedSlug) {
        return NextResponse.json({ error: "Slug inválido." }, { status: 400 });
      }

      if (sanitizedSlug !== existingModel.slug) {
        const slugExists = await prisma.marketplaceModel.findUnique({
          where: { slug: sanitizedSlug },
        });
        if (slugExists) {
          return NextResponse.json(
            { error: `O slug "${sanitizedSlug}" já está em uso por outro modelo.` },
            { status: 409 }
          );
        }
        updateData.slug = sanitizedSlug;
      }
    }

    if (body.type !== undefined) {
      if (body.type === "AI" || body.type === "REAL") {
        updateData.type = body.type as ModelType;
      }
    }

    if (body.category !== undefined) {
      if (Object.values(ModelCategory).includes(body.category as ModelCategory)) {
        updateData.category = body.category as ModelCategory;
      }
    }

    if (body.bio !== undefined) updateData.bio = body.bio ? String(body.bio).trim() : null;
    if (body.avatarUrl !== undefined) {
      if (!body.avatarUrl || typeof body.avatarUrl !== "string") {
        return NextResponse.json({ error: "Avatar URL não pode ser vazio." }, { status: 400 });
      }
      updateData.avatarUrl = body.avatarUrl.trim();
    }
    if (body.coverUrl !== undefined) updateData.coverUrl = body.coverUrl ? String(body.coverUrl).trim() : null;
    if (body.gallery !== undefined) {
      updateData.gallery = Array.isArray(body.gallery) ? body.gallery.map(String) : [];
    }
    if (body.tags !== undefined) {
      updateData.tags = Array.isArray(body.tags) ? body.tags.map((t: unknown) => String(t).trim()) : [];
    }
    if (body.promptTrigger !== undefined) updateData.promptTrigger = body.promptTrigger ? String(body.promptTrigger).trim() : null;
    if (body.referenceFaceUrl !== undefined) updateData.referenceFaceUrl = body.referenceFaceUrl ? String(body.referenceFaceUrl).trim() : null;
    if (body.loraModelId !== undefined) updateData.loraModelId = body.loraModelId ? String(body.loraModelId).trim() : null;
    if (body.instagramHandle !== undefined) updateData.instagramHandle = body.instagramHandle ? String(body.instagramHandle).trim() : null;
    if (body.location !== undefined) updateData.location = body.location ? String(body.location).trim() : null;
    if (body.contactEmail !== undefined) updateData.contactEmail = body.contactEmail ? String(body.contactEmail).trim() : null;

    if (body.bookingPriceCents !== undefined) {
      if (body.bookingPriceCents === null) {
        updateData.bookingPriceCents = null;
      } else {
        const parsedPrice = parseInt(String(body.bookingPriceCents), 10);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
          return NextResponse.json(
            { error: "O preço de reserva (bookingPriceCents) deve ser um valor inteiro positivo ou zero." },
            { status: 400 }
          );
        }
        updateData.bookingPriceCents = parsedPrice;
      }
    }

    if (body.creditsPricePerGen !== undefined) {
      const parsedCredits = parseInt(String(body.creditsPricePerGen), 10);
      if (isNaN(parsedCredits) || parsedCredits < 1) {
        return NextResponse.json(
          { error: "O valor de créditos por geração deve ser no mínimo 1." },
          { status: 400 }
        );
      }
      updateData.creditsPricePerGen = parsedCredits;
    }

    if (body.status !== undefined) updateData.status = Boolean(body.status);
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
    if (body.isHot18 !== undefined) updateData.isHot18 = Boolean(body.isHot18);

    const updated = await prisma.$transaction(async (tx) => {
      const model = await tx.marketplaceModel.update({
        where: { id },
        data: updateData,
      });

      await tx.auditLog.create({
        data: {
          userId: adminCheck.user.id,
          action: "UPDATE_MARKETPLACE_MODEL",
          details: JSON.stringify({
            modelId: model.id,
            slug: model.slug,
            changes: Object.keys(updateData),
            adminEmail: adminCheck.user.email,
          }),
        },
      });

      return model;
    });

    return NextResponse.json({
      message: "Modelo atualizado com sucesso.",
      model: updated,
    });
  } catch (error) {
    console.error("Erro ao atualizar modelo pelo admin:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar modelo." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/models/[id]
 * Exclusão de modelo com cascata segura de reservas e registro em AuditLog.
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.authorized || !adminCheck.user) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID do modelo é obrigatório." }, { status: 400 });
    }

    const existingModel = await prisma.marketplaceModel.findUnique({
      where: { id },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!existingModel) {
      return NextResponse.json({ error: "Modelo não encontrado." }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      // ModelBooking tem onDelete: Cascade no schema, mas garantimos em transação
      await tx.marketplaceModel.delete({
        where: { id },
      });

      await tx.auditLog.create({
        data: {
          userId: adminCheck.user.id,
          action: "DELETE_MARKETPLACE_MODEL",
          details: JSON.stringify({
            modelId: existingModel.id,
            name: existingModel.name,
            slug: existingModel.slug,
            deletedBookingsCount: existingModel._count.bookings,
            adminEmail: adminCheck.user.email,
          }),
        },
      });
    });

    return NextResponse.json({
      message: `Modelo "${existingModel.name}" excluído com sucesso.`,
    });
  } catch (error) {
    console.error("Erro ao excluir modelo pelo admin:", error);
    return NextResponse.json(
      { error: "Erro interno ao excluir modelo." },
      { status: 500 }
    );
  }
}
