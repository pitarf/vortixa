import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { JobStatus, PaymentStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await auth();

    // 1. RBAC estrito: sessão válida e role ADMIN
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado. Apenas administradores podem visualizar os logs." }, { status: 403 });
    }

    // 2. Extração de Query Params
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get("type") || "payments").toLowerCase(); // "payments" | "jobs" | "audit"
    const status = (searchParams.get("status") || "ALL").toUpperCase(); // "ALL" | "SUCCESS" | "FAILED" | "PENDING"
    const search = (searchParams.get("search") || "").trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    // 3. Consulta de acordo com a aba selecionada
    if (type === "payments") {
      // Map de status amigável para PaymentStatus
      const paymentWhere: any = {};

      if (status === "SUCCESS") {
        paymentWhere.status = PaymentStatus.PAID;
      } else if (status === "FAILED") {
        paymentWhere.status = { in: [PaymentStatus.FAILED, PaymentStatus.REFUNDED] };
      } else if (status === "PENDING") {
        paymentWhere.status = PaymentStatus.PENDING;
      }

      if (search) {
        paymentWhere.OR = [
          { id: { contains: search, mode: "insensitive" } },
          { gatewayTxId: { contains: search, mode: "insensitive" } },
          { userId: { contains: search, mode: "insensitive" } },
          { user: { email: { contains: search, mode: "insensitive" } } },
          { user: { name: { contains: search, mode: "insensitive" } } },
          { gateway: { contains: search, mode: "insensitive" } },
        ];
      }

      const [total, payments] = await Promise.all([
        prisma.payment.count({ where: paymentWhere }),
        prisma.payment.findMany({
          where: paymentWhere,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            creditTx: {
              select: {
                id: true,
                amount: true,
                type: true,
                createdAt: true,
              },
            },
            order: {
              select: {
                id: true,
                packageId: true,
                amountCents: true,
                creditsGranted: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
      ]);

      const items = payments.map((p) => {
        // Cálculo de valor em Reais
        const amountBRL = (p.amountCents / 100).toFixed(2);
        const isRefunded = p.status === PaymentStatus.REFUNDED;

        return {
          id: p.id,
          type: "PAYMENT",
          amountCents: p.amountCents,
          amountBRL: `R$ ${amountBRL}`,
          creditsGranted: p.creditsGranted,
          gateway: p.gateway,
          gatewayTxId: p.gatewayTxId,
          idempotencyKey: p.idempotencyKey,
          status: p.status,
          isRefunded,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          user: p.user,
          order: p.order,
          creditTx: p.creditTx,
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
    }

    if (type === "jobs") {
      const jobWhere: any = {};

      if (status === "SUCCESS") {
        jobWhere.status = JobStatus.COMPLETED;
      } else if (status === "FAILED") {
        jobWhere.status = { in: [JobStatus.FAILED, JobStatus.CANCELLED] };
      } else if (status === "PENDING") {
        jobWhere.status = { in: [JobStatus.PENDING, JobStatus.PROCESSING] };
      }

      if (search) {
        jobWhere.OR = [
          { id: { contains: search, mode: "insensitive" } },
          { providerJobId: { contains: search, mode: "insensitive" } },
          { userId: { contains: search, mode: "insensitive" } },
          { user: { email: { contains: search, mode: "insensitive" } } },
          { user: { name: { contains: search, mode: "insensitive" } } },
          { model: { name: { contains: search, mode: "insensitive" } } },
          { model: { technicalName: { contains: search, mode: "insensitive" } } },
          { tool: { name: { contains: search, mode: "insensitive" } } },
          { tool: { slug: { contains: search, mode: "insensitive" } } },
          { error: { contains: search, mode: "insensitive" } },
        ];
      }

      const [total, jobs] = await Promise.all([
        prisma.aIJob.count({ where: jobWhere }),
        prisma.aIJob.findMany({
          where: jobWhere,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            model: {
              select: {
                id: true,
                name: true,
                technicalName: true,
                provider: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            tool: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            inputs: {
              select: {
                key: true,
                value: true,
              },
            },
            outputs: {
              select: {
                id: true,
                fileUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
      ]);

      const items = jobs.map((job: any) => {
        // Cálculo de tempo de resposta em segundos se concluído
        const durationSeconds = job.updatedAt && job.createdAt
          ? Math.max(0, Math.round((job.updatedAt.getTime() - job.createdAt.getTime()) / 1000))
          : null;

        // Análise de categoria do erro para exibição destacada
        let errorCategory = "GENERIC_ERROR";
        if (job.error) {
          const errLower = job.error.toLowerCase();
          if (errLower.includes("timeout") || errLower.includes("timed out")) {
            errorCategory = "TIMEOUT";
          } else if (errLower.includes("nsfw") || errLower.includes("censor") || errLower.includes("content_filter") || errLower.includes("safety")) {
            errorCategory = "CONTENT_FILTER";
          } else if (errLower.includes("parameter") || errLower.includes("invalid") || errLower.includes("schema")) {
            errorCategory = "INVALID_PARAM";
          } else if (errLower.includes("quota") || errLower.includes("rate limit") || errLower.includes("balance")) {
            errorCategory = "PROVIDER_LIMIT";
          }
        }

        return {
          id: job.id,
          type: "JOB",
          status: job.status,
          providerJobId: job.providerJobId,
          creditCost: job.creditCost,
          apiUnitCostUsd: job.apiUnitCost,
          providerCostUsd: job.providerCostUsd,
          creditsReserved: job.creditsReserved,
          creditsCharged: job.creditsCharged,
          creditsRefunded: job.creditsRefunded,
          error: job.error,
          errorCategory,
          durationSeconds,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
          user: job.user,
          model: job.model,
          tool: job.tool,
          inputs: job.inputs,
          outputs: job.outputs,
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
    }

    if (type === "audit") {
      const auditWhere: any = {};

      if (search) {
        auditWhere.OR = [
          { id: { contains: search, mode: "insensitive" } },
          { action: { contains: search, mode: "insensitive" } },
          { details: { contains: search, mode: "insensitive" } },
          { userId: { contains: search, mode: "insensitive" } },
          { user: { email: { contains: search, mode: "insensitive" } } },
          { user: { name: { contains: search, mode: "insensitive" } } },
        ];
      }

      const [total, auditLogs] = await Promise.all([
        prisma.auditLog.count({ where: auditWhere }),
        prisma.auditLog.findMany({
          where: auditWhere,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
      ]);

      const items = auditLogs.map((log) => ({
        id: log.id,
        type: "AUDIT",
        action: log.action,
        details: log.details,
        createdAt: log.createdAt,
        adminUser: log.user,
      }));

      return NextResponse.json({
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    }

    return NextResponse.json(
      { error: "Tipo de log inválido. Utilize: 'payments', 'jobs' ou 'audit'." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Erro ao buscar logs administrativos:", err);
    return NextResponse.json(
      { error: err.message || "Erro interno ao processar a consulta de logs." },
      { status: 500 }
    );
  }
}
