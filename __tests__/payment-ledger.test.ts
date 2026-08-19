import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '@/lib/prisma';
import { PaymentStatus } from '@prisma/client';
import { PaymentLedgerService } from '@/services/payment-ledger.service';

describe('Payment Ledger and Concurrency Security Tests (Fase 6.2)', () => {
  let testUser: any;
  let testOrder: any;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: `ledger_user_${Date.now()}@test.com`,
        name: 'Ledger Test User',
      },
    });

    await prisma.creditBalance.create({
      data: { userId: testUser.id, balance: 10 },
    });
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
  });

  it('should successfully and idempotently confirm a payment and grant credits', async () => {
    // 1. Cria o Order e o Payment pendentes
    testOrder = await prisma.order.create({
      data: {
        userId: testUser.id,
        packageId: 'pack-50',
        amountCents: 4990, // R$ 49,90
        creditsGranted: 50,
      },
    });

    const payment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        orderId: testOrder.id,
        amountCents: 4990,
        creditsGranted: 50,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_legit_${Date.now()}`,
      },
    });

    // 2. Confirmação do pagamento
    const key = `key_idem_${Date.now()}`;
    await PaymentLedgerService.confirmPayment(payment.id, payment.gatewayTxId, key);

    // Saldo inicial era 10 + 50 concedidos = 60
    const balanceAfterConfirm = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    expect(balanceAfterConfirm?.balance).toBe(60);

    const paymentAfter = await prisma.payment.findUnique({
      where: { id: payment.id },
    });
    expect(paymentAfter?.status).toBe(PaymentStatus.PAID);
    expect(paymentAfter?.idempotencyKey).toBe(key);

    // 3. Tenta processar o mesmo webhook/pagamento novamente (Idempotência)
    await PaymentLedgerService.confirmPayment(payment.id, payment.gatewayTxId, key);

    // O saldo deve permanecer 60 (não pode duplicar créditos)
    const balanceAfterDuplicate = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    expect(balanceAfterDuplicate?.balance).toBe(60);
  });

  it('should prevent race condition double-crediting when processing webhooks simultaneously', async () => {
    const payment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 2000,
        creditsGranted: 20,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_concur_${Date.now()}`,
      },
    });

    const key = `key_concur_${Date.now()}`;

    // Dispara dois processos de confirmação simultâneos (Promise.all)
    const runConfirm1 = () => PaymentLedgerService.confirmPayment(payment.id, payment.gatewayTxId, key);
    const runConfirm2 = () => PaymentLedgerService.confirmPayment(payment.id, payment.gatewayTxId, key);
    
    // Devido ao lock pessimista (FOR UPDATE) no banco, a segunda transação aguardará a primeira terminar.
    // Quando a primeira terminar, o status do pagamento já será PAID. A segunda transação lerá status PAID
    // e retornará de forma limpa (idempotente) sem lançar erro e sem duplicar créditos.
    await Promise.all([runConfirm1(), runConfirm2()]);

    // Saldo anterior era 60 + 20 do pagamento único = 80 (não 100)
    const finalBalance = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    expect(finalBalance?.balance).toBe(80);
  });

  it('should process distinct payments for the same user concurrently and independently', async () => {
    const payment1 = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 1000,
        creditsGranted: 10,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_indep1_${Date.now()}`,
      },
    });

    const payment2 = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 1000,
        creditsGranted: 10,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_indep2_${Date.now()}`,
      },
    });

    const key1 = `key_indep1_${Date.now()}`;
    const key2 = `key_indep2_${Date.now()}`;

    // Dois pagamentos válidos e diferentes devem processar sem interferência
    await Promise.all([
      PaymentLedgerService.confirmPayment(payment1.id, payment1.gatewayTxId, key1),
      PaymentLedgerService.confirmPayment(payment2.id, payment2.gatewayTxId, key2),
    ]);

    // Saldo era 80 + 10 + 10 = 100
    const finalBalance = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    expect(finalBalance?.balance).toBe(100);
  });

  it('should process payment refunds idempotently and deduct credits', async () => {
    const payment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 5000,
        creditsGranted: 50,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_refund_${Date.now()}`,
      },
    });

    const key = `key_refund_${Date.now()}`;
    await PaymentLedgerService.confirmPayment(payment.id, payment.gatewayTxId, key);

    // Saldo subiu para 150
    const balanceBeforeRefund = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    expect(balanceBeforeRefund?.balance).toBe(150);

    // Estorna
    await PaymentLedgerService.refundPayment(payment.id);

    // Saldo deve cair para 100
    const balanceAfterRefund = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    expect(balanceAfterRefund?.balance).toBe(100);

    const paymentState = await prisma.payment.findUnique({
      where: { id: payment.id },
    });
    expect(paymentState?.status).toBe(PaymentStatus.REFUNDED);

    // Tenta estornar novamente (Idempotência de estorno)
    await PaymentLedgerService.refundPayment(payment.id);

    // Saldo deve permanecer 100 (não pode debitar novamente)
    const balanceAfterDoubleRefund = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    expect(balanceAfterDoubleRefund?.balance).toBe(100);
  });

  it('should enforce database constraints preventing duplicate gatewayTxId even if service protection fails', async () => {
    // Tenta forçar a criação de dois registros com o mesmo gatewayTxId (constraint UNIQUE do postgres)
    const duplicateTxId = `tx_duplicate_constraint_${Date.now()}`;

    await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 1000,
        creditsGranted: 10,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: duplicateTxId,
      },
    });

    await expect(
      prisma.payment.create({
        data: {
          userId: testUser.id,
          amountCents: 1000,
          creditsGranted: 10,
          status: PaymentStatus.PENDING,
          gateway: 'vorexpay',
          gatewayTxId: duplicateTxId,
        },
      })
    ).rejects.toThrow(); // Prisma deve lançar exceção de violação de Unique constraint (P2002)
  });
});
