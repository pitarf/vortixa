import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export interface DashboardStats {
  revenueCents: number;
  paymentsCount: {
    PAID: number;
    PENDING: number;
    FAILED: number;
    REFUNDED: number;
  };
  creditsSold: number;
  creditsConsumed: number;
  estimatedIACostUsd: number;
  estimatedMarginPercent: number;
  packagesCount: number;
}

export class AdminDashboardService {
  /**
   * Obtém as estatísticas financeiras consolidadas para o painel administrativo.
   */
  static async getConsolidatedStats(adminUserId: string): Promise<DashboardStats> {
    // 1. RBAC estrito a nível de backend
    const admin = await prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== Role.ADMIN) {
      throw new Error("Acesso não autorizado.");
    }

    // 2. Agregações financeiras de pagamentos
    const paymentsGroup = await prisma.payment.groupBy({
      by: ["status"],
      _sum: {
        amountCents: true,
        creditsGranted: true,
      },
      _count: {
        id: true,
      },
    });

    const stats: DashboardStats = {
      revenueCents: 0,
      paymentsCount: { PAID: 0, PENDING: 0, FAILED: 0, REFUNDED: 0 },
      creditsSold: 0,
      creditsConsumed: 0,
      estimatedIACostUsd: 0,
      estimatedMarginPercent: 100,
      packagesCount: 0,
    };

    for (const group of paymentsGroup) {
      const status = group.status;
      const count = group._count.id;
      if (status === "PAID") {
        stats.paymentsCount.PAID = count;
        stats.revenueCents = group._sum.amountCents || 0;
        stats.creditsSold = group._sum.creditsGranted || 0;
      } else if (status === "PENDING") {
        stats.paymentsCount.PENDING = count;
      } else if (status === "FAILED") {
        stats.paymentsCount.FAILED = count;
      } else if (status === "REFUNDED") {
        stats.paymentsCount.REFUNDED = count;
      }
    }

    // 3. Consumo de créditos por Jobs concluídos
    const jobsAggregation = await prisma.aIJob.aggregate({
      where: { status: "COMPLETED" },
      _sum: {
        creditCost: true,
        providerCostUsd: true,
      },
    });

    stats.creditsConsumed = jobsAggregation._sum.creditCost || 0;
    stats.estimatedIACostUsd = jobsAggregation._sum.providerCostUsd || 0;

    // 4. Margem Estimada
    // Custo estimado do crédito vendido (R$ 0,20 por crédito de cortesia ou pacote de referência, ou $0.15/job)
    // Para simplificar a margem comercial: Receita Líquida em USD (ou BRL fictício) vs Custo Estimado
    // Convertemos receita para dólares fictícios ($1 = R$ 5) para calcular a margem contra o custo da fal.ai
    const revenueUsd = (stats.revenueCents / 100) / 5;
    if (revenueUsd > 0) {
      const profitUsd = revenueUsd - stats.estimatedIACostUsd;
      stats.estimatedMarginPercent = Math.max(0, Math.min(100, Math.round((profitUsd / revenueUsd) * 100)));
    } else {
      stats.estimatedMarginPercent = 0;
    }

    // 5. Contagem de pacotes cadastrados
    stats.packagesCount = await prisma.creditPackage.count();

    return stats;
  }
}
