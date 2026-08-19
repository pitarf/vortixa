import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '@/lib/prisma';
import { PaymentLedgerService } from '@/services/payment-ledger.service';
import { ReconciliationService } from '@/services/reconciliation.service';
import { PaymentStatus, Role } from '@prisma/client';

describe('Estorno, Cancelamento e Reconciliação (Fase 6.6)', () => {
  let testUser: any;
  let adminUser: any;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: `recon_client_${Date.now()}@test.com`,
        name: 'Recon Client',
        role: Role.USER,
      },
    });

    adminUser = await prisma.user.create({
      data: {
        email: `recon_admin_${Date.now()}@test.com`,
        name: 'Recon Admin',
        role: Role.ADMIN,
      },
    });

    await prisma.creditBalance.create({
      data: { userId: testUser.id, balance: 0 },
    });
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    if (adminUser) {
      await prisma.user.delete({ where: { id: adminUser.id } }).catch(() => {});
    }
  });

  it('should block double refund and concurrent refund on payment records safely', async () => {
    // 1. Prepara pagamento PAID
    const payment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 2000,
        creditsGranted: 20,
        status: PaymentStatus.PAID,
        gateway: 'vorexpay',
        gatewayTxId: `tx_ref_con_${Date.now()}`,
      },
    });

    // Concede créditos iniciais
    await prisma.creditBalance.update({
      where: { userId: testUser.id },
      data: { balance: 20 },
    });

    // 2. Dispara dois estornos concorrentes simultâneos
    const refundTask = () => PaymentLedgerService.refundPayment(payment.id);
    const results = await Promise.allSettled([refundTask(), refundTask()]);

    const fulfilled = results.filter(r => r.status === 'fulfilled');
    const rejected = results.filter(r => r.status === 'rejected');

    // Somente um deve obter sucesso; o outro deve lançar erro porque o status do Payment mudou para REFUNDED
    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);

    // Saldo do usuário deve ter subtraído exatamente uma vez (20 - 20 = 0)
    const balance = await prisma.creditBalance.findUnique({ where: { userId: testUser.id } });
    expect(balance?.balance).toBe(0);

    // Deve possuir exatamente 1 transação de Ledger correspondente ao ajuste negativo de estorno
    const ledgerTx = await prisma.creditTransaction.findMany({
      where: { userId: testUser.id, type: 'ADMIN_ADJUSTMENT', amount: -20 },
    });
    expect(ledgerTx.length).toBe(1);
  });

  it('should allow refund even if credit balance drops below zero (user already consumed credits)', async () => {
    const payment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 1500,
        creditsGranted: 15,
        status: PaymentStatus.PAID,
        gateway: 'vorexpay',
        gatewayTxId: `tx_neg_bal_${Date.now()}`,
      },
    });

    // Saldo atual do usuário é 0. Ele já consumiu tudo.
    await PaymentLedgerService.refundPayment(payment.id);

    // Saldo deve ficar negativo (-15) mantendo a verdade e a integridade financeira do ledger
    const balance = await prisma.creditBalance.findUnique({ where: { userId: testUser.id } });
    expect(balance?.balance).toBe(-15);
  });

  it('should reconcile and detect discrepancies accurately', async () => {
    // 1. Limpa discrepâncias anteriores antes de criar cenário
    // Cria pagamento sem pedido (Payment without Order)
    const p1 = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 1000,
        creditsGranted: 10,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_discrep1_${Date.now()}`,
      },
    });

    // Executa reconciliação
    const result = await ReconciliationService.runReconciliation();
    expect(result.isConsistent).toBe(false);

    const paymentWithoutOrder = result.discrepancies.find(d => d.type === 'PAYMENT_WITHOUT_ORDER' && d.refId === p1.id);
    expect(paymentWithoutOrder).toBeDefined();

    // Limpeza
    await prisma.payment.delete({ where: { id: p1.id } }).catch(() => {});
  });

  it('should block manual credit adjustments if caller is not an administrator', async () => {
    // Tenta usar testUser (que é USER e não ADMIN) para alterar o próprio saldo
    await expect(
      ReconciliationService.adjustCreditsManually(testUser.id, testUser.id, 50, 'Ajuste malicioso')
    ).rejects.toThrow('Apenas administradores podem efetuar ajustes manuais de saldo.');
  });

  it('should perform administrative credit adjustment and create detailed audit log', async () => {
    // ADMIN concede +50 créditos transacionalmente
    await ReconciliationService.adjustCreditsManually(adminUser.id, testUser.id, 50, 'Crédito de cortesia por suporte');

    // Novo saldo deve ser -15 + 50 = 35
    const balance = await prisma.creditBalance.findUnique({ where: { userId: testUser.id } });
    expect(balance?.balance).toBe(35);

    // Verifica se gerou o AuditLog correspondente
    const logs = await prisma.auditLog.findMany({
      where: { userId: adminUser.id, action: 'MANUAL_CREDIT_ADJUSTMENT' },
    });
    expect(logs.length).toBe(1);
    expect(logs[0].details).toContain('Ajuste manual de 50 créditos');
  });
});
