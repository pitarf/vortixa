import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

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
 * GET /api/admin/models/bookings
 * Lista todas as propostas/reservas de modelos no sistema.
 * Suporte a filtros: status (ALL | PENDING | APPROVED | REJECTED), modelId, search.
 */
export async function GET(req: Request) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.authorized || !adminCheck.user) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") || "ALL").trim().toUpperCase();
    const modelId = searchParams.get("modelId")?.trim();
    const search = searchParams.get("search")?.trim();

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (modelId) {
      where.modelId = modelId;
    }

    if (search) {
      where.OR = [
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          model: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          notes: { contains: search, mode: "insensitive" },
        },
      ];
    }

    const [bookings, totalCount, pendingCount, approvedCount, rejectedCount] = await Promise.all([
      prisma.modelBooking.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          model: {
            select: {
              id: true,
              name: true,
              slug: true,
              type: true,
              category: true,
              avatarUrl: true,
              bookingPriceCents: true,
              contactEmail: true,
              instagramHandle: true,
              location: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.modelBooking.count(),
      prisma.modelBooking.count({ where: { status: "PENDING" } }),
      prisma.modelBooking.count({ where: { status: "APPROVED" } }),
      prisma.modelBooking.count({ where: { status: "REJECTED" } }),
    ]);

    return NextResponse.json({
      bookings,
      counts: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
    });
  } catch (error) {
    console.error("Erro ao listar bookings administrativos:", error);
    return NextResponse.json(
      { error: "Erro interno ao listar propostas de reserva." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/models/bookings
 * Atualiza o status de uma proposta (PENDING, APPROVED, REJECTED)
 */
export async function PATCH(req: Request) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.authorized || !adminCheck.user) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await req.json();
    const { bookingId, status } = body;

    if (!bookingId || typeof bookingId !== "string") {
      return NextResponse.json({ error: "bookingId é obrigatório." }, { status: 400 });
    }

    const allowedStatuses = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"];
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status inválido. Permitidos: ${allowedStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const existingBooking = await prisma.modelBooking.findUnique({
      where: { id: bookingId },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Reserva não encontrada." }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const booking = await tx.modelBooking.update({
        where: { id: bookingId },
        data: { status },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          model: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          userId: adminCheck.user.id,
          action: "UPDATE_MODEL_BOOKING_STATUS",
          details: JSON.stringify({
            bookingId: booking.id,
            newStatus: status,
            modelId: booking.model.id,
            modelName: booking.model.name,
            clientEmail: booking.user.email,
            adminEmail: adminCheck.user.email,
          }),
        },
      });

      return booking;
    });

    return NextResponse.json({
      message: `Status da proposta atualizado para ${status} com sucesso.`,
      booking: updated,
    });
  } catch (error) {
    console.error("Erro ao atualizar booking administrativo:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar reserva." },
      { status: 500 }
    );
  }
}
