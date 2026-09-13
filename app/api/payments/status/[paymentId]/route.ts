import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(
  req: Request,
  context: { params: Promise<{ paymentId: string }> | { paymentId: string } }
) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Sessão inválida ou expirada. Faça login para continuar." },
        { status: 401 }
      );
    }

    const resolvedParams = await context.params;
    const paymentId = resolvedParams?.paymentId;

    if (!paymentId || typeof paymentId !== "string") {
      return NextResponse.json(
        { error: "Identificador do pagamento não fornecido." },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          select: {
            packageId: true,
            status: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Pagamento não encontrado." },
        { status: 404 }
      );
    }

    // Proteção Anti-IDOR: o pagamento deve pertencer ao usuário autenticado ou a um ADMIN
    const isOwner = payment.userId === session.user.id;
    const isAdmin = (session.user as any).role === Role.ADMIN || (session.user as any).role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Acesso não autorizado. Você não tem permissão para consultar este pagamento." },
        { status: 403 }
      );
    }

    // Busca o saldo atual consolidado do usuário titular
    const balanceRecord = await prisma.creditBalance.findUnique({
      where: { userId: payment.userId },
      select: { balance: true },
    });

    return NextResponse.json({
      success: true,
      id: payment.id,
      paymentId: payment.id,
      orderId: payment.orderId,
      packageId: payment.order?.packageId,
      status: payment.status,
      amountCents: payment.amountCents,
      creditsGranted: payment.creditsGranted,
      gateway: payment.gateway,
      createdAt: payment.createdAt,
      currentBalance: balanceRecord?.balance ?? 0,
      payment: {
        id: payment.id,
        orderId: payment.orderId,
        packageId: payment.order?.packageId,
        status: payment.status,
        amountCents: payment.amountCents,
        creditsGranted: payment.creditsGranted,
        gateway: payment.gateway,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Erro na consulta de status do pagamento:", error);
    return NextResponse.json(
      { error: "Erro interno ao consultar status do pagamento." },
      { status: 500 }
    );
  }
}
