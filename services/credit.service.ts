import prisma from "@/lib/prisma";
import { CreditTransactionType } from "@prisma/client";

export class CreditService {
  /**
   * Consulta o saldo atual de créditos do usuário.
   */
  static async getBalance(userId: string): Promise<number> {
    const record = await prisma.creditBalance.findUnique({
      where: { userId },
    });
    return record?.balance || 0;
  }

  /**
   * Verifica se o usuário é ilimitado ou possui saldo suficiente.
   */
  static async hasEnoughCredits(userId: string, cost: number): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isUnlimited: true },
    });

    if (user?.isUnlimited) {
      return true;
    }

    const balance = await this.getBalance(userId);
    return balance >= cost;
  }

  /**
   * Consome créditos do usuário dentro de uma transação PostgreSQL concorrente com bloqueio (FOR UPDATE).
   */
  static async consumeCredits(
    userId: string,
    cost: number,
    toolSlug: string,
    jobId: string
  ): Promise<number> {
    return await prisma.$transaction(async (tx) => {
      // 1. Obter informações de limite do usuário
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { isUnlimited: true },
      });

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      // Se for ilimitado, registramos a transação com custo 0 para fins de auditoria/custo
      if (user.isUnlimited) {
        await tx.creditTransaction.create({
          data: {
            userId,
            amount: 0,
            type: "GENERATION_DEBIT",
            description: `Consumo ilimitado - ferramenta: ${toolSlug}`,
            jobId,
          },
        });
        const currentBal = await tx.creditBalance.findUnique({ where: { userId } });
        return currentBal?.balance || 0;
      }

      // 2. Bloqueio de concorrência na linha de saldo usando raw query
      await tx.$executeRaw`SELECT 1 FROM "CreditBalance" WHERE "userId" = ${userId} FOR UPDATE`;

      const balanceRecord = await tx.creditBalance.findUnique({
        where: { userId },
      });

      const currentBalance = balanceRecord?.balance || 0;

      if (currentBalance < cost) {
        throw new Error("Saldo insuficiente de créditos.");
      }

      // 3. Atualizar saldo
      const newBalance = currentBalance - cost;
      await tx.creditBalance.update({
        where: { userId },
        data: { balance: newBalance },
      });

      // Verificar se jobId fornecido realmente existe na tabela AIJob antes de associar a FK
      let validJobId: string | null = null;
      if (jobId) {
        const jobExists = await tx.aIJob.findUnique({ where: { id: jobId } });
        if (jobExists) {
          validJobId = jobId;
        }
      }

      // 4. Gravar transação de histórico
      await tx.creditTransaction.create({
        data: {
          userId,
          amount: -cost,
          type: "GENERATION_DEBIT",
          description: `Consumo - ferramenta: ${toolSlug}${jobId ? ` (Ref: ${jobId})` : ""}`,
          jobId: validJobId,
        },
      });

      return newBalance;
    });
  }

  /**
   * Reembolsa créditos por falhas em geração de IA.
   */
  static async refundCredits(userId: string, amount: number, jobId: string): Promise<number> {
    return await prisma.$transaction(async (tx) => {
      // Bloqueio de concorrência
      await tx.$executeRaw`SELECT 1 FROM "CreditBalance" WHERE "userId" = ${userId} FOR UPDATE`;

      // Evitar reembolso duplo (Idempotência por jobId contido na descrição)
      const existingRefund = await tx.creditTransaction.findFirst({
        where: { 
          userId,
          type: "GENERATION_REFUND",
          description: { contains: jobId }
        },
      });

      if (existingRefund) {
        const bal = await tx.creditBalance.findUnique({ where: { userId } });
        return bal?.balance || 0;
      }

      const balanceRecord = await tx.creditBalance.findUnique({
        where: { userId },
      });

      const currentBalance = balanceRecord?.balance || 0;
      const newBalance = currentBalance + amount;

      await tx.creditBalance.update({
        where: { userId },
        data: { balance: newBalance },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          amount,
          type: "GENERATION_REFUND",
          description: `Reembolso de créditos por falha no job: ${jobId}`,
        },
      });

      return newBalance;
    });
  }

  /**
   * Adiciona créditos de forma segura com validação de idempotência (por paymentId).
   */
  static async addCredits(
    userId: string,
    amount: number,
    type: CreditTransactionType,
    description: string,
    paymentId?: string
  ): Promise<number> {
    // Validação de Idempotência
    if (paymentId) {
      const existingTx = await prisma.creditTransaction.findUnique({
        where: { paymentId },
      });
      if (existingTx) {
        // Operação repetida de webhook ou compra já processada
        const bal = await prisma.creditBalance.findUnique({ where: { userId } });
        return bal?.balance || 0;
      }
    }

    return await prisma.$transaction(async (tx) => {
      // Tenta bloquear saldo existente
      await tx.$executeRaw`SELECT 1 FROM "CreditBalance" WHERE "userId" = ${userId} FOR UPDATE`;

      const balanceRecord = await tx.creditBalance.findUnique({
        where: { userId },
      });

      const currentBalance = balanceRecord?.balance || 0;
      const newBalance = currentBalance + amount;

      await tx.creditBalance.upsert({
        where: { userId },
        create: {
          userId,
          balance: newBalance,
        },
        update: {
          balance: newBalance,
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          amount,
          type,
          description,
          paymentId,
        },
      });

      return newBalance;
    });
  }

  /**
   * Ajuste manual de créditos feito por um administrador (gera transação e AuditLog).
   */
  static async adjustCredits(
    userId: string,
    amount: number,
    description: string,
    adminId: string
  ): Promise<number> {
    return await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT 1 FROM "CreditBalance" WHERE "userId" = ${userId} FOR UPDATE`;

      const balanceRecord = await tx.creditBalance.findUnique({
        where: { userId },
      });

      const currentBalance = balanceRecord?.balance || 0;
      const newBalance = currentBalance + amount;

      if (newBalance < 0) {
        throw new Error("O ajuste resultará em saldo negativo de créditos.");
      }

      await tx.creditBalance.upsert({
        where: { userId },
        create: {
          userId,
          balance: newBalance,
        },
        update: {
          balance: newBalance,
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          amount,
          type: "ADMIN_ADJUSTMENT",
          description: `Ajuste admin: ${description}`,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: adminId,
          action: "UPDATE_CREDITS",
          details: `Administrador ajustou saldo do usuário ${userId} por ${amount}. Motivo: ${description}`,
        },
      });

      return newBalance;
    });
  }
}
