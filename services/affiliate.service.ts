import prisma from "@/lib/prisma";
import crypto from "crypto";

export interface AffiliateStats {
  profile: {
    id: string;
    code: string;
    customCode: string | null;
    commissionRate: number;
    status: string;
    balanceCents: number;
    totalEarningsCents: number;
    withdrawnCents: number;
    pixKey: string | null;
    pixKeyType: string | null;
  };
  totalReferrals: number;
  convertedReferrals: number;
  totalCommissionsCount: number;
  totalCommissionsAmountCents: number;
}

export class AffiliateService {
  /**
   * Valor mínimo padrão para saque: R$ 50,00 (5000 centavos)
   */
  static readonly MIN_WITHDRAWAL_CENTS = 5000;

  /**
   * Gera um código de indicação único e aleatório no formato VORIXA-XXXXX
   */
  private static generateUniqueCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "VORIXA-";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(crypto.randomInt(0, chars.length));
    }
    return code;
  }

  /**
   * Obtém ou cria automaticamente o perfil de afiliado de um usuário
   */
  static async getOrCreateAffiliateProfile(userId: string) {
    let profile = await prisma.affiliateProfile.findUnique({
      where: { userId },
    });

    if (profile) {
      return profile;
    }

    // Gera um código único garantido contra colisões
    let uniqueCode = this.generateUniqueCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.affiliateProfile.findFirst({
        where: {
          OR: [{ code: uniqueCode }, { customCode: uniqueCode }],
        },
      });
      if (!existing) break;
      uniqueCode = this.generateUniqueCode();
      attempts++;
    }

    profile = await prisma.affiliateProfile.create({
      data: {
        userId,
        code: uniqueCode,
        commissionRate: 0.15, // 15% de comissão padrão
        status: "ACTIVE",
      },
    });

    return profile;
  }

  /**
   * Atualiza o código customizado do afiliado com validação de unicidade
   */
  static async updateCustomCode(userId: string, newCustomCode: string) {
    const cleanCode = newCustomCode.trim().toUpperCase();

    // Validação de formato alfanumérico seguro (3 a 20 caracteres)
    if (!/^[A-Z0-9_-]{3,20}$/.test(cleanCode)) {
      throw new Error("O código personalizado deve conter entre 3 e 20 caracteres alfanuméricos (letras, números, hífen ou underline).");
    }

    // Verifica se já está em uso por outro afiliado
    const existing = await prisma.affiliateProfile.findFirst({
      where: {
        AND: [
          { userId: { not: userId } },
          {
            OR: [
              { code: { equals: cleanCode, mode: "insensitive" } },
              { customCode: { equals: cleanCode, mode: "insensitive" } },
            ],
          },
        ],
      },
    });

    if (existing) {
      throw new Error("Este código de indicação já está sendo utilizado por outro afiliado.");
    }

    const profile = await this.getOrCreateAffiliateProfile(userId);

    return await prisma.affiliateProfile.update({
      where: { id: profile.id },
      data: { customCode: cleanCode },
    });
  }

  /**
   * Atualiza a chave Pix para recebimento de comissões
   */
  static async updatePixKey(userId: string, pixKey: string, pixKeyType: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM") {
    const validTypes = ["CPF", "CNPJ", "EMAIL", "PHONE", "RANDOM"];
    if (!validTypes.includes(pixKeyType)) {
      throw new Error("Tipo de chave Pix inválido.");
    }

    const cleanKey = pixKey.trim();
    if (!cleanKey) {
      throw new Error("A chave Pix não pode estar vazia.");
    }

    const profile = await this.getOrCreateAffiliateProfile(userId);

    return await prisma.affiliateProfile.update({
      where: { id: profile.id },
      data: {
        pixKey: cleanKey,
        pixKeyType,
      },
    });
  }

  /**
   * Obtém métricas e estatísticas consolidadas do afiliado
   */
  static async getAffiliateStats(userId: string): Promise<AffiliateStats> {
    const profile = await this.getOrCreateAffiliateProfile(userId);

    // Total de usuários cadastrados pelo link
    const totalReferrals = await prisma.referral.count({
      where: { affiliateId: profile.id },
    });

    // Total de comissões aprovadas
    const commissionsAgg = await prisma.affiliateCommission.aggregate({
      where: {
        affiliateId: profile.id,
        status: "APPROVED",
      },
      _count: { id: true },
      _sum: { commissionAmountCents: true },
    });

    // Usuários únicos que realizaram pelo menos 1 compra
    const convertedUsers = await prisma.affiliateCommission.groupBy({
      by: ["referredUserId"],
      where: {
        affiliateId: profile.id,
        status: "APPROVED",
      },
    });

    return {
      profile: {
        id: profile.id,
        code: profile.code,
        customCode: profile.customCode,
        commissionRate: profile.commissionRate,
        status: profile.status,
        balanceCents: profile.balanceCents,
        totalEarningsCents: profile.totalEarningsCents,
        withdrawnCents: profile.withdrawnCents,
        pixKey: profile.pixKey,
        pixKeyType: profile.pixKeyType,
      },
      totalReferrals,
      convertedReferrals: convertedUsers.length,
      totalCommissionsCount: commissionsAgg._count.id || 0,
      totalCommissionsAmountCents: commissionsAgg._sum.commissionAmountCents || 0,
    };
  }

  /**
   * Processa o vínculo de indicação no momento do cadastro do novo usuário
   */
  static async processReferralRegistration(referredUserId: string, referralCode?: string | null): Promise<boolean> {
    if (!referralCode || typeof referralCode !== "string") {
      return false;
    }

    const cleanCode = referralCode.trim().toUpperCase();
    if (!cleanCode) return false;

    // Localiza o afiliado correspondente pelo código padrão ou customizado
    const affiliate = await prisma.affiliateProfile.findFirst({
      where: {
        OR: [
          { code: { equals: cleanCode, mode: "insensitive" } },
          { customCode: { equals: cleanCode, mode: "insensitive" } },
        ],
      },
    });

    if (!affiliate) {
      return false; // Código não encontrado
    }

    // Regra de Integridade: Proibido auto-indicação (usuário indicando a si mesmo)
    if (affiliate.userId === referredUserId) {
      return false;
    }

    // Se o afiliado estiver bloqueado ou pausado, não vincula
    if (affiliate.status !== "ACTIVE") {
      return false;
    }

    // Verifica se este usuário já possui indicação registrada (1 por usuário)
    const existingReferral = await prisma.referral.findUnique({
      where: { referredUserId },
    });

    if (existingReferral) {
      return false;
    }

    await prisma.referral.create({
      data: {
        affiliateId: affiliate.id,
        referredUserId,
        codeUsed: cleanCode,
      },
    });

    return true;
  }

  /**
   * Processa o crédito de comissão dentro da transação atômica do pagamento aprovado.
   * Deve ser chamado exclusivamente dentro de prisma.$transaction no PaymentLedgerService.
   */
  static async processPaymentCommission(tx: any, payment: {
    id: string;
    userId: string;
    amountCents: number;
    orderId?: string | null;
  }) {
    // 1. Verifica se o comprador possui vínculo com algum afiliado
    const referral = await tx.referral.findUnique({
      where: { referredUserId: payment.userId },
      include: {
        affiliate: true,
      },
    });

    if (!referral || !referral.affiliate) {
      return null;
    }

    const affiliate = referral.affiliate;

    // Prevenção de Auto-Indicação no pagamento
    if (affiliate.userId === payment.userId) {
      return null;
    }

    // Afiliado precisa estar ativo
    if (affiliate.status !== "ACTIVE") {
      return null;
    }

    // 2. Idempotência estrita: Verifica se já existe comissão para este pagamento
    const existingCommission = await tx.affiliateCommission.findUnique({
      where: { paymentId: payment.id },
    });

    if (existingCommission) {
      return existingCommission; // Já processado anteriormente
    }

    // 3. Lock pessimista no perfil do afiliado para garantir atomicidade financeira
    await tx.$executeRaw`
      SELECT 1 FROM "AffiliateProfile"
      WHERE "id" = ${affiliate.id}
      FOR UPDATE
    `;

    // 4. Calcula a comissão com a porcentagem configurada para o afiliado
    const commissionAmountCents = Math.round(payment.amountCents * affiliate.commissionRate);

    if (commissionAmountCents <= 0) {
      return null;
    }

    // 5. Cria o registro imutável no ledger de comissões
    const commission = await tx.affiliateCommission.create({
      data: {
        affiliateId: affiliate.id,
        paymentId: payment.id,
        orderId: payment.orderId || null,
        referredUserId: payment.userId,
        purchaseAmountCents: payment.amountCents,
        commissionRate: affiliate.commissionRate,
        commissionAmountCents,
        status: "APPROVED",
      },
    });

    // 6. Credita o saldo disponível e o acumulador histórico do afiliado
    await tx.affiliateProfile.update({
      where: { id: affiliate.id },
      data: {
        balanceCents: { increment: commissionAmountCents },
        totalEarningsCents: { increment: commissionAmountCents },
      },
    });

    return commission;
  }

  /**
   * Processa o estorno da comissão caso o pagamento seja estornado (refund)
   */
  static async processPaymentRefundCommission(tx: any, paymentId: string) {
    const commission = await tx.affiliateCommission.findUnique({
      where: { paymentId },
    });

    if (!commission || commission.status === "REFUNDED") {
      return null;
    }

    // Lock pessimista no afiliado
    await tx.$executeRaw`
      SELECT 1 FROM "AffiliateProfile"
      WHERE "id" = ${commission.affiliateId}
      FOR UPDATE
    `;

    // Marca a comissão como estornada
    await tx.affiliateCommission.update({
      where: { id: commission.id },
      data: { status: "REFUNDED" },
    });

    // Debita o saldo do afiliado
    await tx.affiliateProfile.update({
      where: { id: commission.affiliateId },
      data: {
        balanceCents: { decrement: commission.commissionAmountCents },
        totalEarningsCents: { decrement: commission.commissionAmountCents },
      },
    });

    return commission;
  }

  /**
   * Solicita resgate/saque via Pix com lock pessimista
   */
  static async requestPayout(userId: string, amountCents: number) {
    if (!Number.isInteger(amountCents) || amountCents <= 0) {
      throw new Error("O valor de saque deve ser um número inteiro positivo em centavos.");
    }

    if (amountCents < this.MIN_WITHDRAWAL_CENTS) {
      throw new Error(`O valor mínimo para solicitação de saque é de R$ ${(this.MIN_WITHDRAWAL_CENTS / 100).toFixed(2).replace(".", ",")}.`);
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Lock pessimista no saldo do afiliado
      const rawProfile = await tx.$queryRaw<any[]>`
        SELECT * FROM "AffiliateProfile"
        WHERE "userId" = ${userId}
        FOR UPDATE
      `;

      if (!rawProfile || rawProfile.length === 0) {
        throw new Error("Perfil de afiliado não encontrado.");
      }

      const profile = rawProfile[0];

      if (profile.status !== "ACTIVE") {
        throw new Error("Sua conta de afiliado está temporariamente suspensa.");
      }

      if (!profile.pixKey || !profile.pixKeyType) {
        throw new Error("Cadastre sua chave Pix antes de solicitar um saque.");
      }

      // Verifica se já existe um saque pendente para evitar enfileiramento caótico
      const pendingPayout = await tx.affiliatePayout.findFirst({
        where: {
          affiliateId: profile.id,
          status: { in: ["PENDING", "PROCESSING"] },
        },
      });

      if (pendingPayout) {
        throw new Error("Você já possui uma solicitação de saque em análise. Aguarde a conclusão antes de solicitar outro.");
      }

      if (profile.balanceCents < amountCents) {
        throw new Error(`Saldo insuficiente. Seu saldo disponível é de R$ ${(profile.balanceCents / 100).toFixed(2).replace(".", ",")}.`);
      }

      // 2. Debita do saldo disponível imediatamente
      await tx.affiliateProfile.update({
        where: { id: profile.id },
        data: {
          balanceCents: { decrement: amountCents },
        },
      });

      // 3. Cria a solicitação de saque
      const payout = await tx.affiliatePayout.create({
        data: {
          affiliateId: profile.id,
          amountCents,
          pixKey: profile.pixKey,
          pixKeyType: profile.pixKeyType,
          status: "PENDING",
        },
      });

      return payout;
    });
  }

  /**
   * Lista histórico de saques do afiliado
   */
  static async getPayoutsHistory(userId: string) {
    const profile = await this.getOrCreateAffiliateProfile(userId);

    return await prisma.affiliatePayout.findMany({
      where: { affiliateId: profile.id },
      orderBy: { requestedAt: "desc" },
    });
  }

  /**
   * Lista conversões e indicações do afiliado com paginação
   */
  static async getConversionsHistory(userId: string, page = 1, limit = 20) {
    const profile = await this.getOrCreateAffiliateProfile(userId);
    const skip = (page - 1) * limit;

    const [commissions, total] = await Promise.all([
      prisma.affiliateCommission.findMany({
        where: { affiliateId: profile.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.affiliateCommission.count({
        where: { affiliateId: profile.id },
      }),
    ]);

    return {
      commissions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * [ADMIN] Lista todos os afiliados com métricas
   */
  static async adminListAffiliates(search?: string, status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { customCode: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [affiliates, total] = await Promise.all([
      prisma.affiliateProfile.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, createdAt: true },
          },
          _count: {
            select: { referrals: true, commissions: true },
          },
        },
        orderBy: { totalEarningsCents: "desc" },
        skip,
        take: limit,
      }),
      prisma.affiliateProfile.count({ where }),
    ]);

    return {
      affiliates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * [ADMIN] Lista solicitações de saque para aprovação
   */
  static async adminListPayouts(status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const [payouts, total] = await Promise.all([
      prisma.affiliatePayout.findMany({
        where,
        include: {
          affiliate: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
        orderBy: { requestedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.affiliatePayout.count({ where }),
    ]);

    return {
      payouts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * [ADMIN] Processa a aprovação ou rejeição de um saque Pix
   */
  static async adminProcessPayout(
    payoutId: string,
    action: "APPROVE" | "REJECT",
    adminUserId: string,
    options: { proofUrl?: string; adminNotes?: string } = {}
  ) {
    return await prisma.$transaction(async (tx) => {
      const payout = await tx.affiliatePayout.findUnique({
        where: { id: payoutId },
        include: { affiliate: true },
      });

      if (!payout) {
        throw new Error("Solicitação de saque não encontrada.");
      }

      if (payout.status !== "PENDING" && payout.status !== "PROCESSING") {
        throw new Error(`Este saque já foi processado anteriormente (Status: ${payout.status}).`);
      }

      if (action === "APPROVE") {
        // Marca como pago e incrementa total sacado
        const updatedPayout = await tx.affiliatePayout.update({
          where: { id: payoutId },
          data: {
            status: "PAID",
            proofUrl: options.proofUrl || null,
            adminNotes: options.adminNotes || "Saque Pix aprovado e liquidado pela administração.",
            processedAt: new Date(),
          },
        });

        await tx.affiliateProfile.update({
          where: { id: payout.affiliateId },
          data: {
            withdrawnCents: { increment: payout.amountCents },
          },
        });

        await tx.auditLog.create({
          data: {
            userId: adminUserId,
            action: "AFFILIATE_PAYOUT_APPROVED",
            details: `Saque ID ${payoutId} de R$ ${(payout.amountCents / 100).toFixed(2)} aprovado para o afiliado ${payout.affiliate.code}`,
          },
        });

        return updatedPayout;
      } else {
        // Rejeição: Devolve o saldo debitado de volta para o afiliado
        const updatedPayout = await tx.affiliatePayout.update({
          where: { id: payoutId },
          data: {
            status: "REJECTED",
            adminNotes: options.adminNotes || "Solicitação de saque recusada pela administração.",
            processedAt: new Date(),
          },
        });

        await tx.affiliateProfile.update({
          where: { id: payout.affiliateId },
          data: {
            balanceCents: { increment: payout.amountCents },
          },
        });

        await tx.auditLog.create({
          data: {
            userId: adminUserId,
            action: "AFFILIATE_PAYOUT_REJECTED",
            details: `Saque ID ${payoutId} de R$ ${(payout.amountCents / 100).toFixed(2)} rejeitado. Saldo estornado. Motivo: ${options.adminNotes || "Não informado"}`,
          },
        });

        return updatedPayout;
      }
    });
  }

  /**
   * [ADMIN] Atualiza a taxa de comissão individual de um afiliado VIP
   */
  static async adminUpdateCommissionRate(affiliateId: string, newRate: number, adminUserId: string) {
    if (typeof newRate !== "number" || newRate <= 0 || newRate > 0.7) {
      throw new Error("A taxa de comissão deve ser um número entre 0.01 (1%) e 0.70 (70%).");
    }

    const updated = await prisma.affiliateProfile.update({
      where: { id: affiliateId },
      data: { commissionRate: newRate },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: "AFFILIATE_RATE_UPDATED",
        details: `Taxa do afiliado ${updated.code} alterada para ${(newRate * 100).toFixed(1)}%`,
      },
    });

    return updated;
  }

  /**
   * [ADMIN] Atualiza o status do afiliado (ACTIVE / PAUSED / BLOCKED)
   */
  static async adminUpdateStatus(affiliateId: string, status: "ACTIVE" | "PAUSED" | "BLOCKED", adminUserId: string) {
    const valid = ["ACTIVE", "PAUSED", "BLOCKED"];
    if (!valid.includes(status)) {
      throw new Error("Status de afiliado inválido.");
    }

    const updated = await prisma.affiliateProfile.update({
      where: { id: affiliateId },
      data: { status },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: "AFFILIATE_STATUS_UPDATED",
        details: `Status do afiliado ${updated.code} alterado para ${status}`,
      },
    });

    return updated;
  }
}
