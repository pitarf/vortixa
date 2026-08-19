import prisma from "@/lib/prisma";
import { CreditTransactionType, PaymentStatus } from "@prisma/client";

export class PaymentLedgerService {
  /**
   * Processa a confirmação de um pagamento de forma idempotente e atômica.
   * A concessão de créditos é vinculada atomicamente na mesma transação.
   */
  static async confirmPayment(paymentId: string, gatewayTxId: string, idempotencyKey: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // 1. Lock pessimista para evitar concorrência no pagamento
      const payment = await tx.$queryRaw<any[]>`
        SELECT * FROM "Payment" 
        WHERE "id" = ${paymentId} 
        FOR UPDATE
      `;

      if (!payment || payment.length === 0) {
        throw new Error("Pagamento não encontrado.");
      }

      const currentPayment = payment[0];

      // Validação estrita de gatewayTxId para evitar alteração indevida da identidade da transação externa
      if (currentPayment.gatewayTxId && currentPayment.gatewayTxId !== gatewayTxId) {
        throw new Error("Mismatched gatewayTxId. Transação rejeitada por segurança.");
      }

      // Bloqueio de regressão de estado: Se já estiver pago, ignora com sucesso (idempotência)
      if (currentPayment.status === PaymentStatus.PAID) {
        return;
      }

      // 2. Valida chave de idempotência para evitar processamento duplicado simultâneo
      if (currentPayment.idempotencyKey === idempotencyKey) {
        return; // Idempotente no mesmo pagamento
      }
      const existingKey = await tx.payment.findFirst({
        where: { idempotencyKey },
      });
      if (existingKey) {
        throw new Error("Chave de idempotência já utilizada por outra transação.");
      }

      // 3. Lock pessimista no saldo de créditos do usuário
      await tx.$executeRaw`
        SELECT 1 FROM "CreditBalance" 
        WHERE "userId" = ${currentPayment.userId} 
        FOR UPDATE
      `;

      const balanceRecord = await tx.creditBalance.findUnique({
        where: { userId: currentPayment.userId },
      });

      const currentBalance = balanceRecord?.balance || 0;
      const newBalance = currentBalance + currentPayment.creditsGranted;

      // 4. Atualiza o status do pagamento no DB
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.PAID,
          gatewayTxId,
          idempotencyKey,
        },
      });

      // 5. Atualiza ou cria saldo de créditos
      await tx.creditBalance.upsert({
        where: { userId: currentPayment.userId },
        create: {
          userId: currentPayment.userId,
          balance: newBalance,
        },
        update: {
          balance: newBalance,
        },
      });

      // 6. Grava a movimentação do Ledger (Histórico Imutável)
      await tx.creditTransaction.create({
        data: {
          userId: currentPayment.userId,
          amount: currentPayment.creditsGranted,
          type: "PURCHASE",
          description: `Compra de créditos - Pagamento ID: ${paymentId}`,
          paymentId: paymentId,
        },
      });
    });
  }

  /**
   * Processa o estorno (refund) de um pagamento de forma idempotente e atômica.
   */
  static async refundPayment(paymentId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const payment = await tx.$queryRaw<any[]>`
        SELECT * FROM "Payment" 
        WHERE "id" = ${paymentId} 
        FOR UPDATE
      `;

      if (!payment || payment.length === 0) {
        throw new Error("Pagamento não encontrado.");
      }

      const currentPayment = payment[0];

      // Se já estiver estornado ou não estiver pago, bloqueia regressão/ação inválida
      if (currentPayment.status === PaymentStatus.REFUNDED) {
        throw new Error("Este pagamento já foi estornado.");
      }
      if (currentPayment.status !== PaymentStatus.PAID) {
        throw new Error("Somente pagamentos pagos podem ser estornados.");
      }

      // Lock pessimista no saldo de créditos do usuário
      await tx.$executeRaw`
        SELECT 1 FROM "CreditBalance" 
        WHERE "userId" = ${currentPayment.userId} 
        FOR UPDATE
      `;

      const balanceRecord = await tx.creditBalance.findUnique({
        where: { userId: currentPayment.userId },
      });

      const currentBalance = balanceRecord?.balance || 0;
      // Permite saldo negativo se o usuário já tiver consumido os créditos (ledger mantém a integridade)
      const newBalance = currentBalance - currentPayment.creditsGranted;

      // Atualiza o status do pagamento para REFUNDED
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.REFUNDED,
        },
      });

      // Atualiza o saldo do usuário
      await tx.creditBalance.update({
        where: { userId: currentPayment.userId },
        data: {
          balance: newBalance,
        },
      });

      // Grava movimentação de estorno no Ledger (Histórico Imutável)
      // Como o relacionamento payment -> creditTx possui constraint de unicidade no schema (1-para-1),
      // a transação de estorno (ADMIN_ADJUSTMENT) referencia o pagamento textualmente no campo description
      // para evitar colisão com a transação original de compra (PURCHASE).
      await tx.creditTransaction.create({
        data: {
          userId: currentPayment.userId,
          amount: -currentPayment.creditsGranted,
          type: "ADMIN_ADJUSTMENT",
          description: `Estorno de compra - Pagamento ID: ${paymentId}`,
        },
      });
    });
  }
}
