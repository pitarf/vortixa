import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

/**
 * GET /api/admin/users/[id]
 * Retorna dados completos do usuário, incluindo:
 * - Informações cadastrais e de conta (id, email, name, role, isBlocked, isUnlimited, createdAt, balance)
 * - Histórico de recargas/pagamentos (id, amountCents, amountBrl, creditsGranted, status, gateway, gatewayTxId, createdAt)
 * - Recargas pendentes destacadas
 * - Histórico de gerações/jobs de IA (id, modelName, toolName, status, creditCost, apiUnitCostUsd, providerCostUsd, error, createdAt)
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado. Apenas administradores." }, { status: 403 });
    }

    const { id: userId } = await context.params;

    if (!userId) {
      return NextResponse.json({ error: "ID do usuário não fornecido." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        creditBalance: {
          select: {
            balance: true,
            updatedAt: true,
          },
        },
        creditTransactions: {
          orderBy: { createdAt: "desc" },
          take: 30,
          select: {
            id: true,
            amount: true,
            type: true,
            description: true,
            createdAt: true,
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 50,
          select: {
            id: true,
            orderId: true,
            amountCents: true,
            creditsGranted: true,
            status: true,
            gateway: true,
            gatewayTxId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        jobs: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: {
            model: {
              select: {
                id: true,
                name: true,
                technicalName: true,
              },
            },
            tool: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            outputs: {
              select: {
                fileUrl: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const paymentsFormatted = user.payments.map((p) => ({
      id: p.id,
      orderId: p.orderId,
      amountCents: p.amountCents,
      amountBrl: (p.amountCents / 100).toFixed(2),
      creditsGranted: p.creditsGranted,
      status: p.status,
      gateway: p.gateway,
      gatewayTxId: p.gatewayTxId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    const pendingPayments = paymentsFormatted.filter((p) => p.status === "PENDING");

    const jobsFormatted = user.jobs.map((job) => ({
      id: job.id,
      modelName: job.model?.name || "Modelo Desconhecido",
      modelTechnicalName: job.model?.technicalName,
      toolName: job.tool?.name || "Ferramenta",
      toolSlug: job.tool?.slug,
      status: job.status,
      creditCost: job.creditCost,
      apiUnitCostUsd: job.apiUnitCost,
      providerCostUsd: job.providerCostUsd,
      creditsCharged: job.creditsCharged,
      creditsRefunded: job.creditsRefunded,
      error: job.error,
      fileUrl: job.outputs[0]?.fileUrl || null,
      createdAt: job.createdAt,
    }));

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name || "Sem nome",
        email: user.email,
        image: user.image,
        role: user.role,
        isBlocked: user.isBlocked,
        isUnlimited: user.isUnlimited,
        balance: user.creditBalance?.balance ?? 0,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      payments: paymentsFormatted,
      pendingPayments,
      jobs: jobsFormatted,
      creditTransactions: user.creditTransactions,
    });
  } catch (error: any) {
    console.error("Erro ao buscar detalhes do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao carregar detalhes do usuário." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Atualizar role, isBlocked, isUnlimited, alterar senha diretamente (passwordHash com bcryptjs)
 * ou registrar solicitação de redefinição de senha.
 */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado. Apenas administradores." }, { status: 403 });
    }

    const { id: userId } = await context.params;

    if (!userId) {
      return NextResponse.json({ error: "ID do usuário não fornecido." }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Usuário alvo não encontrado." }, { status: 404 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Payload JSON inválido." }, { status: 400 });
    }

    const { role, isBlocked, isUnlimited, newPassword, triggerReset } = body;

    // Regras de Proteção: Admin logado não pode bloquear ou rebaixar a si próprio
    if (admin.id === userId) {
      if (isBlocked === true) {
        return NextResponse.json({ error: "Você não pode bloquear sua própria conta de administrador." }, { status: 400 });
      }
      if (role && role !== Role.ADMIN) {
        return NextResponse.json({ error: "Você não pode remover seu próprio privilégio de administrador." }, { status: 400 });
      }
    }

    const updateData: {
      role?: Role;
      isBlocked?: boolean;
      isUnlimited?: boolean;
      passwordHash?: string;
    } = {};

    const auditChanges: string[] = [];

    if (role && (role === "ADMIN" || role === "USER")) {
      updateData.role = role as Role;
      auditChanges.push(`Role alterado para ${role}`);
    }

    if (typeof isBlocked === "boolean") {
      updateData.isBlocked = isBlocked;
      auditChanges.push(isBlocked ? "Usuário bloqueado" : "Usuário desbloqueado");
    }

    if (typeof isUnlimited === "boolean") {
      updateData.isUnlimited = isUnlimited;
      auditChanges.push(isUnlimited ? "Ativado acesso ilimitado" : "Desativado acesso ilimitado");
    }

    if (newPassword && typeof newPassword === "string") {
      if (newPassword.trim().length < 6) {
        return NextResponse.json({ error: "A nova senha deve possuir no mínimo 6 caracteres." }, { status: 400 });
      }
      const passwordHash = await bcrypt.hash(newPassword.trim(), 12);
      updateData.passwordHash = passwordHash;
      auditChanges.push("Senha alterada pelo administrador");
    }

    if (triggerReset) {
      auditChanges.push("Solicitação de reset de senha disparada");
    }

    if (Object.keys(updateData).length === 0 && !triggerReset) {
      return NextResponse.json({ error: "Nenhuma alteração informada." }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      if (Object.keys(updateData).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: updateData,
        });
      }

      await tx.auditLog.create({
        data: {
          userId: admin.id,
          action: "UPDATE_USER_PROFILE",
          details: `Alterações no usuário ${targetUser.email} (ID: ${userId}): ${auditChanges.join("; ")}`,
        },
      });
    });

    return NextResponse.json({
      message: "Usuário atualizado com sucesso!",
      changes: auditChanges,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao atualizar usuário." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Exclusão de usuário com limpeza de relacionamentos em cascata.
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado. Apenas administradores." }, { status: 403 });
    }

    const { id: userId } = await context.params;

    if (!userId) {
      return NextResponse.json({ error: "ID do usuário não fornecido." }, { status: 400 });
    }

    if (userId === admin.id) {
      return NextResponse.json(
        { error: "Operação proibida: Você não pode deletar sua própria conta de administrador." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      // Deletar o usuário (onDelete: Cascade no schema cuidará dos registros filhos como creditBalance, etc)
      await tx.user.delete({
        where: { id: userId },
      });

      await tx.auditLog.create({
        data: {
          userId: admin.id,
          action: "DELETE_USER",
          details: `Exclusão permanente do usuário ${targetUser.email} (Nome: ${targetUser.name}, ID: ${userId})`,
        },
      });
    });

    return NextResponse.json({
      message: `Usuário ${targetUser.email} excluído com sucesso.`,
    });
  } catch (error: any) {
    console.error("Erro ao deletar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao deletar usuário." },
      { status: 500 }
    );
  }
}
