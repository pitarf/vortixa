import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export type TimePeriod = "today" | "weekly" | "monthly" | "yearly" | "all" | "custom";

export interface ChartDataPoint {
  label: string; // "14:00" ou "08/09" ou "Set/26"
  dateKey: string;
  revenueBrl: number;
  apiCostUsd: number;
  profitBrl: number;
  signups: number;
  generations: number;
}

export interface TopServiceModel {
  modelId: string;
  name: string;
  technicalName: string;
  toolSlug: string;
  toolName: string;
  usageCount: number;
  creditsConsumed: number;
  apiCostUsd: number;
  estimatedRevenueBrl: number;
}

export interface TopUserItem {
  id: string;
  name: string | null;
  email: string;
  balance: number;
  generationsCount: number;
  creditsSpent: number;
  totalPaidBrl: number;
  createdAt: Date;
}

export interface ExecutiveDashboardStats {
  period: TimePeriod;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  revenueCents: number;
  revenueBrl: number;
  apiCostUsd: number;
  profitBrl: number;
  marginPercent: number;
  newSignups: number;
  totalGenerations: number;
  imageGenerations: number;
  videoGenerations: number;
  otherGenerations: number;
  creditsSold: number;
  creditsConsumed: number;
  paymentsCount: {
    PAID: number;
    PENDING: number;
    FAILED: number;
    REFUNDED: number;
  };

  todayStats: {
    revenueBrl: number;
    apiCostUsd: number;
    profitBrl: number;
    signups: number;
    generations: number;
    creditsConsumed: number;
  };

  timeSeries: ChartDataPoint[];
  xAxisType: "hours" | "days" | "months";

  topServices: TopServiceModel[];
  topUsersByBalance: TopUserItem[];
  topUsersByConsumption: TopUserItem[];

  totalUsersCount: number;
  packagesCount: number;
}

export class AdminDashboardService {
  /**
   * Obtém as estatísticas analíticas consolidadas com suporte a períodos e rankings.
   */
  static async getExecutiveStats(
    adminUserId: string,
    period: TimePeriod = "today",
    customStart?: string,
    customEnd?: string
  ): Promise<ExecutiveDashboardStats> {
    // 1. RBAC estrito a nível de backend
    const admin = await prisma.user.findUnique({ where: { id: adminUserId } });
    if (!admin || admin.role !== Role.ADMIN) {
      throw new Error("Acesso não autorizado. Apenas administradores podem visualizar o painel.");
    }

    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    let xAxisType: "hours" | "days" | "months" = "hours";

    switch (period) {
      case "today":
        startDate = todayStart;
        endDate = todayEnd;
        xAxisType = "hours";
        break;
      case "weekly":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        xAxisType = "days";
        break;
      case "monthly":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 29);
        startDate.setHours(0, 0, 0, 0);
        xAxisType = "days";
        break;
      case "yearly":
        startDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
        startDate.setHours(0, 0, 0, 0);
        xAxisType = "months";
        break;
      case "custom":
        if (customStart && customEnd) {
          startDate = new Date(customStart);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(customEnd);
          endDate.setHours(23, 59, 59, 999);
        } else {
          startDate = todayStart;
          endDate = todayEnd;
        }
        const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
          xAxisType = "hours";
        } else if (diffDays <= 60) {
          xAxisType = "days";
        } else {
          xAxisType = "months";
        }
        break;
      case "all":
      default:
        startDate = new Date(2025, 0, 1);
        endDate = now;
        xAxisType = "months";
        break;
    }

    const USD_TO_BRL = 5.5;

    // 2. Consulta de Pagamentos no período
    const paymentsInPeriod = await prisma.payment.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: "PAID",
      },
      select: {
        amountCents: true,
        creditsGranted: true,
        createdAt: true,
      },
    });

    // 3. Consulta de Jobs no período
    const jobsInPeriod = await prisma.aIJob.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        status: true,
        creditCost: true,
        apiUnitCost: true,
        providerCostUsd: true,
        modelId: true,
        toolId: true,
        createdAt: true,
        model: { select: { name: true, technicalName: true } },
        tool: { select: { name: true, slug: true } },
      },
    });

    // 4. Consulta de Novos Cadastros no período
    const usersInPeriod = await prisma.user.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    // 5. Cálculos de Estatísticas de "Hoje"
    const todayPayments = await prisma.payment.aggregate({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        status: "PAID",
      },
      _sum: { amountCents: true },
    });

    const todayJobs = await prisma.aIJob.aggregate({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        status: "COMPLETED",
      },
      _sum: {
        creditCost: true,
        providerCostUsd: true,
      },
      _count: { id: true },
    });

    const todaySignupsCount = await prisma.user.count({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
      },
    });

    const todayRevBrl = (todayPayments._sum.amountCents || 0) / 100;
    const todayApiUsd = todayJobs._sum.providerCostUsd || 0;
    const todayApiBrl = todayApiUsd * USD_TO_BRL;
    const todayProfitBrl = todayRevBrl - todayApiBrl;

    // 6. Agregações no Período Selecionado
    const revenueCents = paymentsInPeriod.reduce((acc, p) => acc + p.amountCents, 0);
    const creditsSold = paymentsInPeriod.reduce((acc, p) => acc + p.creditsGranted, 0);
    const revenueBrl = revenueCents / 100;

    let apiCostUsd = 0;
    let creditsConsumed = 0;
    let completedGenerations = 0;
    let imageGenerations = 0;
    let videoGenerations = 0;
    let otherGenerations = 0;

    const serviceMap = new Map<string, TopServiceModel>();

    for (const job of jobsInPeriod) {
      if (job.status === "COMPLETED") {
        completedGenerations++;
        creditsConsumed += job.creditCost;
        const costUsd = job.providerCostUsd || job.apiUnitCost || 0;
        apiCostUsd += costUsd;

        const toolSlug = job.tool?.slug || "";
        if (toolSlug.includes("image")) imageGenerations++;
        else if (toolSlug.includes("video")) videoGenerations++;
        else otherGenerations++;

        const key = job.modelId || job.model?.technicalName || "unknown";
        const current = serviceMap.get(key) || {
          modelId: job.modelId,
          name: job.model?.name || "Modelo IA",
          technicalName: job.model?.technicalName || key,
          toolSlug: job.tool?.slug || "general",
          toolName: job.tool?.name || "Ferramenta",
          usageCount: 0,
          creditsConsumed: 0,
          apiCostUsd: 0,
          estimatedRevenueBrl: 0,
        };

        current.usageCount += 1;
        current.creditsConsumed += job.creditCost;
        current.apiCostUsd += costUsd;
        current.estimatedRevenueBrl += job.creditCost * 0.15;
        serviceMap.set(key, current);
      }
    }

    const apiCostBrl = apiCostUsd * USD_TO_BRL;
    const profitBrl = revenueBrl - apiCostBrl;
    const marginPercent = revenueBrl > 0 ? Math.max(0, Math.min(100, Math.round((profitBrl / revenueBrl) * 100))) : 0;

    // 7. Construção da Série Temporal (Gráficos)
    const timeSeriesMap = new Map<string, ChartDataPoint>();
    const padZero = (n: number) => n.toString().padStart(2, "0");

    if (xAxisType === "hours") {
      for (let h = 0; h < 24; h++) {
        const label = `${padZero(h)}:00`;
        timeSeriesMap.set(label, {
          label,
          dateKey: label,
          revenueBrl: 0,
          apiCostUsd: 0,
          profitBrl: 0,
          signups: 0,
          generations: 0,
        });
      }

      paymentsInPeriod.forEach((p) => {
        const h = p.createdAt.getHours();
        const label = `${padZero(h)}:00`;
        const pt = timeSeriesMap.get(label);
        if (pt) pt.revenueBrl += p.amountCents / 100;
      });

      jobsInPeriod.forEach((j) => {
        if (j.status === "COMPLETED") {
          const h = j.createdAt.getHours();
          const label = `${padZero(h)}:00`;
          const pt = timeSeriesMap.get(label);
          if (pt) {
            pt.generations += 1;
            pt.apiCostUsd += j.providerCostUsd || j.apiUnitCost || 0;
          }
        }
      });

      usersInPeriod.forEach((u) => {
        const h = u.createdAt.getHours();
        const label = `${padZero(h)}:00`;
        const pt = timeSeriesMap.get(label);
        if (pt) pt.signups += 1;
      });
    } else if (xAxisType === "days") {
      const curr = new Date(startDate);
      while (curr <= endDate) {
        const day = padZero(curr.getDate());
        const month = padZero(curr.getMonth() + 1);
        const label = `${day}/${month}`;
        timeSeriesMap.set(label, {
          label,
          dateKey: label,
          revenueBrl: 0,
          apiCostUsd: 0,
          profitBrl: 0,
          signups: 0,
          generations: 0,
        });
        curr.setDate(curr.getDate() + 1);
      }

      paymentsInPeriod.forEach((p) => {
        const label = `${padZero(p.createdAt.getDate())}/${padZero(p.createdAt.getMonth() + 1)}`;
        const pt = timeSeriesMap.get(label);
        if (pt) pt.revenueBrl += p.amountCents / 100;
      });

      jobsInPeriod.forEach((j) => {
        if (j.status === "COMPLETED") {
          const label = `${padZero(j.createdAt.getDate())}/${padZero(j.createdAt.getMonth() + 1)}`;
          const pt = timeSeriesMap.get(label);
          if (pt) {
            pt.generations += 1;
            pt.apiCostUsd += j.providerCostUsd || j.apiUnitCost || 0;
          }
        }
      });

      usersInPeriod.forEach((u) => {
        const label = `${padZero(u.createdAt.getDate())}/${padZero(u.createdAt.getMonth() + 1)}`;
        const pt = timeSeriesMap.get(label);
        if (pt) pt.signups += 1;
      });
    } else {
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      const curr = new Date(startDate);
      while (curr <= endDate) {
        const label = `${months[curr.getMonth()]}/${curr.getFullYear().toString().slice(2)}`;
        if (!timeSeriesMap.has(label)) {
          timeSeriesMap.set(label, {
            label,
            dateKey: label,
            revenueBrl: 0,
            apiCostUsd: 0,
            profitBrl: 0,
            signups: 0,
            generations: 0,
          });
        }
        curr.setMonth(curr.getMonth() + 1);
      }

      paymentsInPeriod.forEach((p) => {
        const label = `${months[p.createdAt.getMonth()]}/${p.createdAt.getFullYear().toString().slice(2)}`;
        const pt = timeSeriesMap.get(label);
        if (pt) pt.revenueBrl += p.amountCents / 100;
      });

      jobsInPeriod.forEach((j) => {
        if (j.status === "COMPLETED") {
          const label = `${months[j.createdAt.getMonth()]}/${j.createdAt.getFullYear().toString().slice(2)}`;
          const pt = timeSeriesMap.get(label);
          if (pt) {
            pt.generations += 1;
            pt.apiCostUsd += j.providerCostUsd || j.apiUnitCost || 0;
          }
        }
      });

      usersInPeriod.forEach((u) => {
        const label = `${months[u.createdAt.getMonth()]}/${u.createdAt.getFullYear().toString().slice(2)}`;
        const pt = timeSeriesMap.get(label);
        if (pt) pt.signups += 1;
      });
    }

    const timeSeries = Array.from(timeSeriesMap.values()).map((pt) => ({
      ...pt,
      profitBrl: Math.round((pt.revenueBrl - pt.apiCostUsd * USD_TO_BRL) * 100) / 100,
      revenueBrl: Math.round(pt.revenueBrl * 100) / 100,
      apiCostUsd: Math.round(pt.apiCostUsd * 100) / 100,
    }));

    const topServices = Array.from(serviceMap.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 8);

    const usersWithBalance = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        creditBalance: { select: { balance: true } },
        payments: {
          where: { status: "PAID" },
          select: { amountCents: true },
        },
        jobs: {
          where: { status: "COMPLETED" },
          select: { creditCost: true },
        },
      },
    });

    const userSummaryList: TopUserItem[] = usersWithBalance.map((u) => {
      const balance = u.creditBalance?.balance || 0;
      const totalPaidBrl = u.payments.reduce((acc, p) => acc + p.amountCents, 0) / 100;
      const generationsCount = u.jobs.length;
      const creditsSpent = u.jobs.reduce((acc, j) => acc + j.creditCost, 0);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        balance,
        generationsCount,
        creditsSpent,
        totalPaidBrl,
        createdAt: u.createdAt,
      };
    });

    const topUsersByBalance = [...userSummaryList]
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 6);

    const topUsersByConsumption = [...userSummaryList]
      .sort((a, b) => b.creditsSpent - a.creditsSpent)
      .slice(0, 6);

    const totalUsersCount = await prisma.user.count();
    const packagesCount = await prisma.creditPackage.count();

    return {
      period,
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      revenueCents,
      revenueBrl: Math.round(revenueBrl * 100) / 100,
      apiCostUsd: Math.round(apiCostUsd * 100) / 100,
      profitBrl: Math.round(profitBrl * 100) / 100,
      marginPercent,
      newSignups: usersInPeriod.length,
      totalGenerations: completedGenerations,
      imageGenerations,
      videoGenerations,
      otherGenerations,
      creditsSold,
      creditsConsumed,
      paymentsCount: {
        PAID: paymentsInPeriod.length,
        PENDING: 0,
        FAILED: 0,
        REFUNDED: 0,
      },
      todayStats: {
        revenueBrl: Math.round(todayRevBrl * 100) / 100,
        apiCostUsd: Math.round(todayApiUsd * 100) / 100,
        profitBrl: Math.round(todayProfitBrl * 100) / 100,
        signups: todaySignupsCount,
        generations: todayJobs._count.id || 0,
        creditsConsumed: todayJobs._sum.creditCost || 0,
      },
      timeSeries,
      xAxisType,
      topServices,
      topUsersByBalance,
      topUsersByConsumption,
      totalUsersCount,
      packagesCount,
    };
  }

  /**
   * Mantém retrocompatibilidade para testes ou chamadas legadas.
   */
  static async getConsolidatedStats(adminUserId: string) {
    const exec = await this.getExecutiveStats(adminUserId, "all");
    return {
      revenueCents: exec.revenueCents,
      paymentsCount: { PAID: 0, PENDING: 0, FAILED: 0, REFUNDED: 0 },
      creditsSold: exec.creditsSold,
      creditsConsumed: exec.creditsConsumed,
      estimatedIACostUsd: exec.apiCostUsd,
      estimatedMarginPercent: exec.marginPercent,
      packagesCount: exec.packagesCount,
    };
  }
}
