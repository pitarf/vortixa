import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '@/lib/prisma';
import { POST } from '@/app/api/webhooks/payment/route';
import { PaymentStatus } from '@prisma/client';

describe('Payment Webhooks Adversarial and Security Tests (Fase 6.5)', () => {
  let testUser: any;
  let testOrder: any;
  let testPayment: any;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: `webhook_sec_user_${Date.now()}@test.com`,
        name: 'Webhook Security Client',
      },
    });

    testOrder = await prisma.order.create({
      data: {
        userId: testUser.id,
        packageId: 'pkg-100',
        amountCents: 1990,
        creditsGranted: 100,
        status: PaymentStatus.PENDING,
      },
    });

    testPayment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        orderId: testOrder.id,
        amountCents: 1990,
        creditsGranted: 100,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_sec_init_${Date.now()}`,
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
  });

  const createMockRequest = (body: any, signature = 'valid_signature') => {
    return new Request('http://localhost:3000/api/webhooks/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vorexpay-signature': signature,
      },
      body: JSON.stringify(body),
    });
  };

  it('should reject webhooks with missing mandatory fields', async () => {
    const req = createMockRequest({
      eventId: 'evt_missing',
      // paymentId ausente
      status: 'PAID',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe('Parâmetros obrigatórios ausentes.');
  });

  it('should reject webhook if payment record does not exist', async () => {
    const req = createMockRequest({
      eventId: `evt_notfound_${Date.now()}`,
      paymentId: 'nonexistent-payment-uuid',
      gatewayTxId: 'tx_notfound',
      status: 'PAID',
    });

    const res = await POST(req);
    expect(res.status).toBe(404);

    const json = await res.json();
    expect(json.error).toBe('Pagamento não localizado.');
  });

  it('should confirm payment, grant credits and prevent credit duplication on webhook retry', async () => {
    const eventId = `evt_success_${Date.now()}`;
    const gatewayTxId = `tx_gateway_${Date.now()}`;

    const payload = {
      eventId,
      paymentId: testPayment.id,
      gatewayTxId,
      status: 'PAID',
    };

    // 1. Envia primeiro webhook de confirmação
    const res1 = await POST(createMockRequest(payload));
    expect(res1.status).toBe(200);

    // Saldo do usuário deve ser creditado com os 100 créditos oficiais
    const balanceAfterConfirm = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    expect(balanceAfterConfirm?.balance).toBe(100);

    // 2. Tenta repetir o mesmo evento (Idempotência)
    const res2 = await POST(createMockRequest(payload));
    expect(res2.status).toBe(200);

    // Saldo deve continuar em 100
    const balanceAfterRetry = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    expect(balanceAfterRetry?.balance).toBe(100);
  });

  it('should block invalid status transitions / state regressions in the webhook', async () => {
    // Tenta enviar status PENDING/PROCESSING de volta para um pagamento já pago (PAID)
    const eventId = `evt_regression_${Date.now()}`;
    const payload = {
      eventId,
      paymentId: testPayment.id,
      gatewayTxId: 'tx_regress',
      status: 'PENDING', // Status inválido para transição
    };

    const res = await POST(createMockRequest(payload));
    // Retorna status limpo 200, mas a máquina de estados deve ignorar e não alterar nada
    expect(res.status).toBe(200);

    const payment = await prisma.payment.findUnique({ where: { id: testPayment.id } });
    expect(payment?.status).toBe(PaymentStatus.PAID);
  });

  it('should process payment estorno/refund transationally and idempotently', async () => {
    const eventId = `evt_refund_${Date.now()}`;
    const payload = {
      eventId,
      paymentId: testPayment.id,
      gatewayTxId: 'tx_refund',
      status: 'REFUNDED',
    };

    const res1 = await POST(createMockRequest(payload));
    expect(res1.status).toBe(200);

    // Saldo inicial era 100 - 100 = 0
    const balanceAfterRefund = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    expect(balanceAfterRefund?.balance).toBe(0);

    // Tenta repetir o estorno (Idempotência de estorno)
    const res2 = await POST(createMockRequest(payload));
    expect(res2.status).toBe(200);

    // Saldo deve continuar em 0 (não pode debitar em dobro)
    const balanceAfterDoubleRefund = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    expect(balanceAfterDoubleRefund?.balance).toBe(0);
  });

  it('should reject webhooks with invalid signatures in live mode', async () => {
    // Modifica temporariamente a variável de ambiente para live
    process.env.PAYMENT_PROVIDER_MODE = 'live';

    const eventId = `evt_bad_sig_${Date.now()}`;
    const payload = {
      eventId,
      paymentId: testPayment.id,
      gatewayTxId: 'tx_bad_sig',
      status: 'PAID',
    };

    const res = await POST(createMockRequest(payload, 'invalid_sig'));
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.error).toBe('Assinatura inválida.');

    // Restaura ambiente
    process.env.PAYMENT_PROVIDER_MODE = 'test';
  });

  it('should handle concurrent identical webhooks safely with only one transaction applying', async () => {
    const concurrentPayment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 5000,
        creditsGranted: 50,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_concurrent_${Date.now()}`,
      },
    });

    const eventId = `evt_concur_${Date.now()}`;
    const payload = {
      eventId,
      paymentId: concurrentPayment.id,
      gatewayTxId: concurrentPayment.gatewayTxId,
      status: 'PAID',
    };

    // Dispara dois webhooks idênticos concorrentes (Promise.all)
    const runWebhook = () => POST(createMockRequest(payload));
    
    // Um dos processos deve travar o lock no banco e ser processado com sucesso.
    // O segundo lerá que o webhook ou transação foi processada (idempotência) e retornará com sucesso.
    const results = await Promise.all([runWebhook(), runWebhook()]);

    expect(results[0].status).toBe(200);
    expect(results[1].status).toBe(200);

    // Saldo era 0 + 50 = 50 (nunca 100)
    const finalBalance = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    expect(finalBalance?.balance).toBe(50);
  });
});
