import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma, Role } from "@prisma/client";

/**
 * GET /api/admin/users
 * Suporte a busca (?search=), filtro por role (?role=), filtro por status (?status=active|blocked),
 * ordenação por data de cadastro ou saldo (?sortBy=createdAt|balance&sortOrder=asc|desc), paginação (?page=1&limit=20).
 * Retorna total de usuários e lista com ID, nome, email, role, isBlocked, saldo de créditos, total de recargas e data de criação.
 */
export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim();
    const role = (searchParams.get("role") || "").trim().toUpperCase();
    const status = (searchParams.get("status") || "").trim().toLowerCase();
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc").toLowerCase() === "asc" ? "asc" : "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { id: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role === "ADMIN" || role === "USER") {
      where.role = role as Role;
    }

    if (status === "active") {
      where.isBlocked = false;
    } else if (status === "blocked") {
      where.isBlocked = true;
    }

    let orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: sortOrder };

    if (sortBy === "balance") {
      orderBy = {
        creditBalance: {
          balance: sortOrder,
        },
      };
    } else if (sortBy === "name") {
      orderBy = { name: sortOrder };
    } else if (sortBy === "email") {
      orderBy = { email: sortOrder };
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          isBlocked: true,
          isUnlimited: true,
          createdAt: true,
          creditBalance: {
            select: {
              balance: true,
            },
          },
          payments: {
            where: {
              status: "PAID",
            },
            select: {
              amountCents: true,
            },
          },
          _count: {
            select: {
              jobs: true,
              payments: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    const items = users.map((u) => {
      const totalSpentCents = u.payments.reduce((acc, p) => acc + p.amountCents, 0);
      return {
        id: u.id,
        name: u.name || "Sem nome",
        email: u.email,
        image: u.image,
        role: u.role,
        isBlocked: u.isBlocked,
        isUnlimited: u.isUnlimited,
        balance: u.creditBalance?.balance ?? 0,
        totalRechargesBrl: Number((totalSpentCents / 100).toFixed(2)),
        totalRechargesCount: u._count.payments,
        totalJobsCount: u._count.jobs,
        createdAt: u.createdAt,
      };
    });

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error: any) {
    console.error("Erro ao listar usuários administrativos:", error);
    return NextResponse.json(
      { error: "Erro interno ao listar usuários." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Ações em massa:
 * action: "block" | "unblock" | "promote" | "demote" | "delete" | "add_credits"
 * userIds: string[]
 * amount?: number (obrigatório se action === "add_credits")
 * reason?: string
 */
export async function POST(req: Request) {
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

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Payload JSON inválido." }, { status: 400 });
    }

    const { action, userIds, amount, reason } = body;

    if (!action || typeof action !== "string") {
      return NextResponse.json({ error: "O campo 'action' é obrigatório." }, { status: 400 });
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "A lista de 'userIds' deve conter ao menos um identificador." }, { status: 400 });
    }

    const validActions = ["block", "unblock", "promote", "demote", "delete", "add_credits"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Ação inválida. Ações permitidas: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    // Regra de Proteção: O admin logado NÃO pode bloquear, deletar ou rebaixar a si próprio
    if (["block", "demote", "delete"].includes(action) && userIds.includes(admin.id)) {
      return NextResponse.json(
        { error: "Ação proibida: Você não pode bloquear, deletar ou rebaixar sua própria conta de administrador." },
        { status: 400 }
      );
    }

    // Validação de Créditos em Massa
    if (action === "add_credits") {
      if (
        amount === undefined ||
        amount === null ||
        typeof amount !== "number" ||
        !Number.isInteger(amount) ||
        amount === 0
      ) {
        return NextResponse.json(
          { error: "Para adicionar créditos em massa, informe um número inteiro diferente de zero no campo 'amount'." },
          { status: 400 }
        );
      }
    }

    // Filtrar IDs para remover auto-ações perigosas
    const targetUserIds = userIds.filter((id) => typeof id === "string" && id.trim() !== "");

    if (targetUserIds.length === 0) {
      return NextResponse.json({ error: "Nenhum ID de usuário válido fornecido." }, { status: 400 });
    }

    const auditReason = reason && typeof reason === "string" && reason.trim() !== ""
      ? reason.trim()
      : `Ação em massa administrativa: ${action}`;

    let affectedCount = 0;

    // Execução em transação atômica
    await prisma.$transaction(async (tx) => {
      if (action === "block") {
        const res = await tx.user.updateMany({
          where: {
            id: { in: targetUserIds },
            NOT: { id: admin.id },
          },
          data: { isBlocked: true },
        });
        affectedCount = res.count;

        await tx.auditLog.create({
          data: {
            userId: admin.id,
            action: "BATCH_BLOCK_USERS",
            details: `Bloqueados ${affectedCount} usuário(s). IDs: ${targetUserIds.join(", ")}. Motivo: ${auditReason}`,
          },
        });
      } else if (action === "unblock") {
        const res = await tx.user.updateMany({
          where: { id: { in: targetUserIds } },
          data: { isBlocked: false },
        });
        affectedCount = res.count;

        await tx.auditLog.create({
          data: {
            userId: admin.id,
            action: "BATCH_UNBLOCK_USERS",
            details: `Desbloqueados ${affectedCount} usuário(s). IDs: ${targetUserIds.join(", ")}. Motivo: ${auditReason}`,
          },
        });
      } else if (action === "promote") {
        const res = await tx.user.updateMany({
          where: { id: { in: targetUserIds } },
          data: { role: Role.ADMIN },
        });
        affectedCount = res.count;

        await tx.auditLog.create({
          data: {
            userId: admin.id,
            action: "BATCH_PROMOTE_USERS",
            details: `Promovidos a ADMIN ${affectedCount} usuário(s). IDs: ${targetUserIds.join(", ")}. Motivo: ${auditReason}`,
          },
        });
      } else if (action === "demote") {
        const res = await tx.user.updateMany({
          where: {
            id: { in: targetUserIds },
            NOT: { id: admin.id },
          },
          data: { role: Role.USER },
        });
        affectedCount = res.count;

        await tx.auditLog.create({
          data: {
            userId: admin.id,
            action: "BATCH_DEMOTE_USERS",
            details: `Rebaixados a USER ${affectedCount} usuário(s). IDs: ${targetUserIds.join(", ")}. Motivo: ${auditReason}`,
          },
        });
      } else if (action === "delete") {
        // Exclusão segura: User possui relações onDelete: Cascade no schema para creditBalance, accounts, sessions, jobs, payments, orders, files, flows, flowExecutions, auditLogs
        const toDeleteIds = targetUserIds.filter((id) => id !== admin.id);
        const res = await tx.user.deleteMany({
          where: {
            id: { in: toDeleteIds },
          },
        });
        affectedCount = res.count;

        await tx.auditLog.create({
          data: {
            userId: admin.id,
            action: "BATCH_DELETE_USERS",
            details: `Excluídos ${affectedCount} usuário(s). IDs: ${toDeleteIds.join(", ")}. Motivo: ${auditReason}`,
          },
        });
      } else if (action === "add_credits") {
        const creditsAmount = Number(amount);

        for (const targetId of targetUserIds) {
          // Lock pessimista
          await tx.$executeRaw`
            SELECT 1 FROM "CreditBalance" 
            WHERE "userId" = ${targetId} 
            FOR UPDATE
          `;

          const balanceRecord = await tx.creditBalance.findUnique({
            where: { userId: targetId },
          });

          const currentBalance = balanceRecord?.balance || 0;
          const newBalance = currentBalance + creditsAmount;

          await tx.creditBalance.upsert({
            where: { userId: targetId },
            create: { userId: targetId, balance: newBalance },
            update: { balance: newBalance },
          });

          const batchIdempotencyKey = `batch_cred_${targetId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

          await tx.creditTransaction.create({
            data: {
              userId: targetId,
              amount: creditsAmount,
              type: "ADMIN_ADJUSTMENT",
              description: `Ajuste em massa: ${auditReason}`,
              idempotencyKey: batchIdempotencyKey,
            },
          });

          affectedCount++;
        }

        await tx.auditLog.create({
          data: {
            userId: admin.id,
            action: "BATCH_ADD_CREDITS",
            details: `Ajustados ${creditsAmount} créditos para ${affectedCount} usuário(s). IDs: ${targetUserIds.join(", ")}. Motivo: ${auditReason}`,
          },
        });
      }
    });

    const messages: Record<string, string> = {
      block: `${affectedCount} usuário(s) foram bloqueados com sucesso.`,
      unblock: `${affectedCount} usuário(s) foram desbloqueados com sucesso.`,
      promote: `${affectedCount} usuário(s) foram promovidos a Administrador.`,
      demote: `${affectedCount} usuário(s) foram rebaixados para Usuário padrão.`,
      delete: `${affectedCount} usuário(s) foram excluídos permanentemente.`,
      add_credits: `${amount} créditos foram aplicados para ${affectedCount} usuário(s).`,
    };

    return NextResponse.json({
      message: messages[action] || "Ação em massa concluída com sucesso.",
      affectedCount,
    });
  } catch (error: any) {
    console.error("Erro na execução de ação em massa em usuários:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao processar ação em massa." },
      { status: 500 }
    );
  }
}
