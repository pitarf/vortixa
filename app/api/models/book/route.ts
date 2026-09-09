import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/models/book
 * Reserva/solicitação de contratação de modelo (especialmente modelos Reais).
 * Requer autenticação de sessão via auth().
 * Cria registro em ModelBooking com status PENDING.
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado para solicitar a contratação de um modelo." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isBlocked: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não localizado." }, { status: 404 });
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { error: "Sua conta está suspensa. Entre em contato com o suporte." },
        { status: 403 }
      );
    }

    // Rate limiting: máximo de 3 reservas por minuto por usuário
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentBookingsCount = await prisma.modelBooking.count({
      where: {
        userId: user.id,
        createdAt: { gte: oneMinuteAgo },
      },
    });

    if (recentBookingsCount >= 3) {
      return NextResponse.json(
        { error: "Muitas solicitações de reserva em curto período. Por favor, aguarde um instante antes de enviar uma nova proposta." },
        { status: 429 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Payload JSON inválido." }, { status: 400 });
    }

    const { modelId, notes, estimatedBudgetCents } = body || {};

    if (!modelId || typeof modelId !== "string" || !modelId.trim()) {
      return NextResponse.json(
        { error: "O ID do modelo (modelId) é obrigatório." },
        { status: 400 }
      );
    }

    // Validação de notas / briefing
    let sanitizedNotes: string | null = null;
    if (notes !== undefined && notes !== null) {
      if (typeof notes !== "string") {
        return NextResponse.json(
          { error: "O campo de observações/briefing deve ser um texto válido." },
          { status: 400 }
        );
      }
      if (notes.length > 2000) {
        return NextResponse.json(
          { error: "O briefing/observações excede o limite máximo de 2.000 caracteres." },
          { status: 400 }
        );
      }
      // Sanitização contra Stored XSS e injeção de HTML
      sanitizedNotes = notes
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (!sanitizedNotes) sanitizedNotes = null;
    }

    // Validação estrita de estimatedBudgetCents
    let validatedBudget: number | null = null;
    if (estimatedBudgetCents !== undefined && estimatedBudgetCents !== null) {
      if (
        typeof estimatedBudgetCents !== "number" ||
        !Number.isInteger(estimatedBudgetCents) ||
        estimatedBudgetCents <= 0
      ) {
        return NextResponse.json(
          { error: "O valor estimado do orçamento deve ser um número inteiro positivo maior que zero." },
          { status: 400 }
        );
      }
      // Teto máximo razoável de R$ 1.000.000,00 (100.000.000 centavos)
      if (estimatedBudgetCents > 100_000_000) {
        return NextResponse.json(
          { error: "O valor estimado excede o limite máximo permitido." },
          { status: 400 }
        );
      }
      validatedBudget = estimatedBudgetCents;
    }

    const marketplaceModel = await prisma.marketplaceModel.findUnique({
      where: { id: modelId.trim() },
    });

    if (!marketplaceModel) {
      return NextResponse.json({ error: "Modelo não encontrado." }, { status: 404 });
    }

    if (!marketplaceModel.status) {
      return NextResponse.json(
        { error: "Este modelo não está aceitando novas propostas ou contratações no momento." },
        { status: 400 }
      );
    }

    // Calcula valor inicial da proposta (pode usar o orçamento validado ou o bookingPriceCents cadastrado)
    const amountCents = validatedBudget !== null
      ? validatedBudget
      : (marketplaceModel.bookingPriceCents && marketplaceModel.bookingPriceCents > 0
          ? marketplaceModel.bookingPriceCents
          : null);

    const booking = await prisma.modelBooking.create({
      data: {
        userId: user.id,
        modelId: marketplaceModel.id,
        status: "PENDING",
        notes: sanitizedNotes,
        amountCents,
      },
      include: {
        model: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            bookingPriceCents: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Solicitação de reserva registrada com sucesso! Nossa equipe ou assessoria entrará em contato.",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar reserva de modelo:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a solicitação de reserva." },
      { status: 500 }
    );
  }
}
