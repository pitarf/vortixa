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
    const gatewayTxId = testPayment.gatewayTxId; // deve coincidir com o do banco

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
    // 1. Garante que o pagamento testPayment esteja em status PAID
    const checkPaid = await prisma.payment.findUnique({ where: { id: testPayment.id } });
    if (checkPaid?.status !== PaymentStatus.PAID) {
      await prisma.payment.update({
        where: { id: testPayment.id },
        data: { status: PaymentStatus.PAID },
      });
    }

    // 2. Tenta enviar status PENDING de volta para o pagamento já pago (PAID)
    const eventId = `evt_regression_${Date.now()}`;
    const payload = {
      eventId,
      paymentId: testPayment.id,
      gatewayTxId: testPayment.gatewayTxId || 'tx_regress',
      status: 'PENDING', // Status de regressão
    };

    const res = await POST(createMockRequest(payload));
    expect(res.status).toBe(200);

    const payment = await prisma.payment.findUnique({ where: { id: testPayment.id } });
    expect(payment?.status).toBe(PaymentStatus.PAID);
  });

  it('should process payment estorno/refund transationally and idempotently', async () => {
    // Cria um pagamento novo já em status PAID para estornar de forma válida
    const refundPayment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 1000,
        creditsGranted: 10,
        status: PaymentStatus.PAID,
        gateway: 'vorexpay',
        gatewayTxId: `tx_ref_${Date.now()}`,
      },
    });

    // Cria saldo de créditos correspondente
    await prisma.creditBalance.upsert({
      where: { userId: testUser.id },
      create: { userId: testUser.id, balance: 10 },
      update: { balance: 10 },
    });

    const eventId = `evt_refund_${Date.now()}`;
    const payload = {
      eventId,
      paymentId: refundPayment.id,
      gatewayTxId: refundPayment.gatewayTxId,
      status: 'REFUNDED',
    };

    const res1 = await POST(createMockRequest(payload));
    expect(res1.status).toBe(200);

    // Saldo inicial era 10 - 10 = 0
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

  it('should reject webhooks trying to spoof commercial amount and credits', async () => {
    // Zera o saldo do usuário para garantir isolamento e asserção precisa
    await prisma.creditBalance.upsert({
      where: { userId: testUser.id },
      create: { userId: testUser.id, balance: 0 },
      update: { balance: 0 },
    });

    // 1. Cria um pagamento legítimo de R$ 19,90 e 100 créditos no banco
    const spoofPayment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 1990,
        creditsGranted: 100,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_spoof_${Date.now()}`,
      },
    });

    // 2. Envia webhook com valores inflados (1 centavo e 999999 créditos)
    const eventId = `evt_spoof_${Date.now()}`;
    const payload = {
      eventId,
      paymentId: spoofPayment.id,
      gatewayTxId: spoofPayment.gatewayTxId,
      status: 'PAID',
      amountCents: 1,
      creditsGranted: 999999, // payload adulterado
    };

    const res = await POST(createMockRequest(payload));
    expect(res.status).toBe(200);

    // 3. Comprova que os créditos concedidos e saldo final usam a verdade do banco (100) e não o payload
    const paymentRecord = await prisma.payment.findUnique({
      where: { id: spoofPayment.id },
    });
    expect(paymentRecord?.amountCents).toBe(1990);
    expect(paymentRecord?.creditsGranted).toBe(100);

    const balance = await prisma.creditBalance.findUnique({
      where: { userId: testUser.id },
    });
    // O saldo anterior era 0 + 100 da compra legítima = 100
    expect(balance?.balance).toBe(100);
  });

  it('should ignore and fail on unknown or arbitrary status fields', async () => {
    const badStatusPayment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 1000,
        creditsGranted: 10,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_badstatus_${Date.now()}`,
      },
    });

    const badPayload = {
      eventId: `evt_badstatus_${Date.now()}`,
      paymentId: badStatusPayment.id,
      gatewayTxId: badStatusPayment.gatewayTxId,
      status: 'PAID_HACKED',
    };

    const res = await POST(createMockRequest(badPayload));
    expect(res.status).toBe(400); // Bad Request e não atualiza status para PAID_HACKED

    const payment = await prisma.payment.findUnique({
      where: { id: badStatusPayment.id },
    });
    expect(payment?.status).toBe(PaymentStatus.PENDING);
  });

  it('should recover and allow retry of webhooks that failed to process on first attempt', async () => {
    const retryPayment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 1000,
        creditsGranted: 10,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_retry_${Date.now()}`,
      },
    });

    // 1. Simula falha ao processar o webhook (ex: erro inesperado ou status inválido)
    const eventId = `evt_retry_fail_${Date.now()}`;
    const payload = {
      eventId,
      paymentId: retryPayment.id,
      gatewayTxId: retryPayment.gatewayTxId,
      status: 'INVALID_STATUS',
    };

    const res1 = await POST(createMockRequest(payload));
    expect(res1.status).toBe(400);

    // O webhook deve estar salvo na tabela como processed=false
    const webhook = await prisma.paymentWebhook.findUnique({
      where: { gatewayEventId: eventId },
    });
    expect(webhook).toBeDefined();
    expect(webhook?.processed).toBe(false);

    // 2. Simula o retry enviando o mesmo eventId mas com status válido PAID
    const successPayload = {
      ...payload,
      status: 'PAID',
    };

    const res2 = await POST(createMockRequest(successPayload));
    expect(res2.status).toBe(200);

    const updatedWebhook = await prisma.paymentWebhook.findUnique({
      where: { gatewayEventId: eventId },
    });
    expect(updatedWebhook?.processed).toBe(true);
  });

  it('should reject webhooks with mismatched gatewayTxId to prevent session spoofing', async () => {
    const spoofTxPayment = await prisma.payment.create({
      data: {
        userId: testUser.id,
        amountCents: 1000,
        creditsGranted: 10,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_expected_${Date.now()}`,
      },
    });

    const eventId = `evt_tx_mismatch_${Date.now()}`;
    const payload = {
      eventId,
      paymentId: spoofTxPayment.id,
      gatewayTxId: 'tx_fake_unauthorized_id', // mismatch
      status: 'PAID',
    };

    // O webhook deve retornar erro 400 Bad Request por mismatch
    const res = await POST(createMockRequest(payload));
    expect(res.status).toBe(400);

    const payment = await prisma.payment.findUnique({ where: { id: spoofTxPayment.id } });
    expect(payment?.gatewayTxId).not.toBe(payload.gatewayTxId); 
    expect(payment?.status).toBe(PaymentStatus.PENDING); // Permanece PENDING
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

    const initialBalance = await prisma.creditBalance.findUnique({ where: { userId: testUser.id } });
    const initialBalValue = initialBalance?.balance || 0;

    // Dispara dois webhooks idênticos concorrentes (Promise.all)
    const runWebhook = () => POST(createMockRequest(payload));
    
    const results = await Promise.all([runWebhook(), runWebhook()]);

    expect(results[0].status).toBe(200);
    expect(results[1].status).toBe(200);

    // Valida o estado final das entidades no banco
    const webhook = await prisma.paymentWebhook.findUnique({
      where: { gatewayEventId: eventId },
    });
    expect(webhook?.processed).toBe(true);

    const payment = await prisma.payment.findUnique({
      where: { id: concurrentPayment.id },
    });
    expect(payment?.status).toBe(PaymentStatus.PAID);

    // Verifica que o saldo aumentou exatamente uma vez (initialBalValue + 50)
    const finalBalance = await prisma.creditBalance.findUnique({ where: { userId: testUser.id } });
    expect(finalBalance?.balance).toBe(initialBalValue + 50);

    // Verifica que existe apenas 1 transação de Ledger criada para este pagamento no histórico imutável
    const txs = await prisma.creditTransaction.findMany({
      where: { paymentId: concurrentPayment.id },
    });
    expect(txs.length).toBe(1);
  });
});
