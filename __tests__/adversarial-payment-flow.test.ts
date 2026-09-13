import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { POST as handleCheckout } from '@/app/api/payments/checkout/route';
import { GET as handlePaymentStatus } from '@/app/api/payments/status/[paymentId]/route';
import { POST as handlePaymentWebhook } from '@/app/api/webhooks/payment/route';
import { auth } from '@/auth';
import { PaymentStatus, Role } from '@prisma/client';

// Mock do NextAuth para controle determinístico de sessões
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Adversarial Payment Flow & Security Stress Suite (Fase 6 QA)', () => {
  let attackerUser: any;
  let victimUser: any;
  let adminUser: any;
  let activePackage: any;
  let inactivePackage: any;

  beforeAll(async () => {
    // 1. Cria usuários isolados para a suíte adversarial
    attackerUser = await prisma.user.create({
      data: {
        email: `adv_attacker_${Date.now()}@adversary.com`,
        name: 'Attacker Client',
        role: Role.USER,
      },
    });

    victimUser = await prisma.user.create({
      data: {
        email: `adv_victim_${Date.now()}@target.com`,
        name: 'Victim Client',
        role: Role.USER,
      },
    });

    adminUser = await prisma.user.create({
      data: {
        email: `adv_admin_${Date.now()}@security.com`,
        name: 'Admin Client',
        role: Role.ADMIN,
      },
    });

    // 2. Cria saldos iniciais isolados
    await prisma.creditBalance.create({
      data: { userId: attackerUser.id, balance: 0 },
    });

    await prisma.creditBalance.create({
      data: { userId: victimUser.id, balance: 0 },
    });

    // 3. Cria pacotes de teste no catálogo oficial
    activePackage = await prisma.creditPackage.create({
      data: {
        name: 'Pacote Pro Adversarial 500',
        credits: 500,
        priceCents: 8990, // R$ 89,90 oficial
        bonusCredits: 50, // 550 créditos totais
        status: true,
      },
    });

    inactivePackage = await prisma.creditPackage.create({
      data: {
        name: 'Pacote Obsoleto Inativo',
        credits: 100,
        priceCents: 1990,
        bonusCredits: 0,
        status: false,
      },
    });
  });

  afterAll(async () => {
    // Limpeza profunda garantindo isolamento de estado
    const userIds = [attackerUser?.id, victimUser?.id, adminUser?.id].filter(Boolean);
    for (const userId of userIds) {
      await prisma.creditTransaction.deleteMany({ where: { userId } }).catch(() => {});
      await prisma.creditBalance.deleteMany({ where: { userId } }).catch(() => {});
      await prisma.payment.deleteMany({ where: { userId } }).catch(() => {});
      await prisma.order.deleteMany({ where: { userId } }).catch(() => {});
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    }

    if (activePackage) {
      await prisma.creditPackage.delete({ where: { id: activePackage.id } }).catch(() => {});
    }
    if (inactivePackage) {
      await prisma.creditPackage.delete({ where: { id: inactivePackage.id } }).catch(() => {});
    }

    await prisma.paymentWebhook.deleteMany({
      where: { gatewayEventId: { contains: 'adv_' } },
    }).catch(() => {});

    vi.restoreAllMocks();
  });

  const createCheckoutRequest = (body: any) => {
    return new Request('http://localhost:3000/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  const createStatusRequest = (paymentId: string) => {
    return new Request(`http://localhost:3000/api/payments/status/${paymentId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const createWebhookRequest = (body: any, signature = 'valid_mock_signature') => {
    return new Request('http://localhost:3000/api/webhooks/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vorexpay-signature': signature,
      },
      body: JSON.stringify(body),
    });
  };

  // ============================================================================
  // VETOR 1: MANIPULAÇÃO DE PREÇO / MASS ASSIGNMENT
  // ============================================================================
  it('Vetor 1.1: Deve rejeitar valores de preço e créditos manipulados pelo cliente e congelar estritamente o valor do banco de dados (Mass Assignment Prevention)', async () => {
    (auth as any).mockResolvedValue({
      user: { id: attackerUser.id, email: attackerUser.email, role: Role.USER },
    });

    const maliciousBody = {
      packageId: activePackage.id,
      priceCents: 10, // Tentativa de pagar R$ 0,10 ao invés de R$ 89,90
      amountCents: 10,
      credits: 999999, // Tentativa de injetar 1 milhão de créditos
      bonusCredits: 999999,
      status: PaymentStatus.PAID, // Tentativa de forjar status PAID
      discount: 100,
    };

    const res = await handleCheckout(createCheckoutRequest(maliciousBody));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.orderId).toBeDefined();
    expect(json.paymentId).toBeDefined();

    // Validação no Banco de Dados Real (Verdade Absoluta)
    const order = await prisma.order.findUnique({ where: { id: json.orderId } });
    expect(order).toBeDefined();
    expect(order?.amountCents).toBe(8990); // 8990 centavos estritos do banco
    expect(order?.amountCents).not.toBe(10); // Modelo de Falso Positivo
    expect(order?.creditsGranted).toBe(550); // 500 base + 50 bônus do catálogo
    expect(order?.creditsGranted).not.toBe(999999);
    expect(order?.status).toBe(PaymentStatus.PENDING);

    const payment = await prisma.payment.findUnique({ where: { id: json.paymentId } });
    expect(payment).toBeDefined();
    expect(payment?.amountCents).toBe(8990);
    expect(payment?.creditsGranted).toBe(550);
    expect(payment?.status).toBe(PaymentStatus.PENDING);

    // Saldo não pode ser concedido antes do webhook de pagamento
    const balance = await prisma.creditBalance.findUnique({ where: { userId: attackerUser.id } });
    expect(balance?.balance).toBe(0);
  });

  it('Vetor 1.2: Deve rejeitar criação de checkout para pacotes inexistentes no banco', async () => {
    (auth as any).mockResolvedValue({
      user: { id: attackerUser.id, email: attackerUser.email, role: Role.USER },
    });

    const fakePackageId = `fake-pkg-${Date.now()}`;
    const res = await handleCheckout(createCheckoutRequest({ packageId: fakePackageId }));
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe('Pacote de créditos não encontrado.');
  });

  it('Vetor 1.3: Deve rejeitar criação de checkout para pacotes desativados no catálogo', async () => {
    (auth as any).mockResolvedValue({
      user: { id: attackerUser.id, email: attackerUser.email, role: Role.USER },
    });

    const res = await handleCheckout(createCheckoutRequest({ packageId: inactivePackage.id }));
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe('Este pacote está temporariamente desativado.');
  });

  // ============================================================================
  // VETOR 2: RACE CONDITION E DOUBLE-SPENDING NO WEBHOOK
  // ============================================================================
  it('Vetor 2.1: Deve resistir a Race Condition e Double-Spending via 5 chamadas concorrentes simultâneas com Promise.all()', async () => {
    // 1. Cria pagamento de 100 créditos para victimUser
    const racePayment = await prisma.payment.create({
      data: {
        userId: victimUser.id,
        amountCents: 1990,
        creditsGranted: 100,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_adv_race_${Date.now()}`,
      },
    });

    await prisma.creditBalance.update({
      where: { userId: victimUser.id },
      data: { balance: 0 },
    });

    const eventId = `adv_evt_race_${Date.now()}`;
    const payload = {
      eventId,
      paymentId: racePayment.id,
      gatewayTxId: racePayment.gatewayTxId,
      status: 'PAID',
    };

    // 2. Dispara 5 webhooks concorrentes no mesmo milissegundo simulando rajada de rede
    const requests = Array.from({ length: 5 }, () =>
      handlePaymentWebhook(createWebhookRequest(payload))
    );

    const responses = await Promise.all(requests);
    for (const res of responses) {
      expect(res.status).toBe(200);
    }

    // 3. Valida no PostgreSQL que os créditos foram incrementados EXATAMENTE UMA VEZ
    const balance = await prisma.creditBalance.findUnique({ where: { userId: victimUser.id } });
    expect(balance?.balance).toBe(100);
    expect(balance?.balance).not.toBe(500); // Falso Positivo: se race condition existisse, seria 500

    // 4. Valida unicidade no Ledger Imutável
    const txCount = await prisma.creditTransaction.count({
      where: { paymentId: racePayment.id },
    });
    expect(txCount).toBe(1);

    const updatedPayment = await prisma.payment.findUnique({ where: { id: racePayment.id } });
    expect(updatedPayment?.status).toBe(PaymentStatus.PAID);
  });

  // ============================================================================
  // VETOR 3: REPLAY ATTACK DE WEBHOOK
  // ============================================================================
  it('Vetor 3.1: Deve neutralizar Replay Attack em reenvios repetidos do mesmo webhook (Idempotência)', async () => {
    const replayPayment = await prisma.payment.create({
      data: {
        userId: victimUser.id,
        amountCents: 4990,
        creditsGranted: 250,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_adv_replay_${Date.now()}`,
      },
    });

    const initialBalRecord = await prisma.creditBalance.findUnique({ where: { userId: victimUser.id } });
    const initialBal = initialBalRecord?.balance || 0;

    const eventId = `adv_evt_replay_${Date.now()}`;
    const payload = {
      eventId,
      paymentId: replayPayment.id,
      gatewayTxId: replayPayment.gatewayTxId,
      status: 'PAID',
    };

    // 1º Disparo: Processamento genuíno
    const res1 = await handlePaymentWebhook(createWebhookRequest(payload));
    expect(res1.status).toBe(200);

    const balanceAfter1 = await prisma.creditBalance.findUnique({ where: { userId: victimUser.id } });
    expect(balanceAfter1?.balance).toBe(initialBal + 250);

    // 2º Disparo: Replay Attack idêntico
    const res2 = await handlePaymentWebhook(createWebhookRequest(payload));
    expect(res2.status).toBe(200);
    const json2 = await res2.json();
    expect(json2.message).toContain('Evento de pagamento já processado anteriormente');

    // 3º Disparo: Terceiro Replay
    const res3 = await handlePaymentWebhook(createWebhookRequest(payload));
    expect(res3.status).toBe(200);

    // O saldo deve permanecer estritamente inalterado após replays
    const finalBalance = await prisma.creditBalance.findUnique({ where: { userId: victimUser.id } });
    expect(finalBalance?.balance).toBe(initialBal + 250);

    // Deve existir exatamente 1 transação de compra no Ledger
    const txCount = await prisma.creditTransaction.count({
      where: { paymentId: replayPayment.id },
    });
    expect(txCount).toBe(1);
  });

  // ============================================================================
  // VETOR 4: ASSINATURA FALSA / ADULTERADA (HMAC)
  // ============================================================================
  it('Vetor 4.1: Deve rejeitar webhook com assinatura HMAC inválida em modo live (HTTP 401)', async () => {
    process.env.PAYMENT_PROVIDER_MODE = 'live';

    const testPayment = await prisma.payment.create({
      data: {
        userId: victimUser.id,
        amountCents: 1000,
        creditsGranted: 10,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_adv_sig_${Date.now()}`,
      },
    });

    const payload = {
      eventId: `adv_evt_badsig_${Date.now()}`,
      paymentId: testPayment.id,
      gatewayTxId: testPayment.gatewayTxId,
      status: 'PAID',
    };

    // Envio com assinatura declaradamente espúria
    const res = await handlePaymentWebhook(createWebhookRequest(payload, 'invalid_sig'));
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.error).toBe('Assinatura inválida.');

    // Status no banco deve permanecer PENDING
    const payment = await prisma.payment.findUnique({ where: { id: testPayment.id } });
    expect(payment?.status).toBe(PaymentStatus.PENDING);

    // Restaura ambiente
    process.env.PAYMENT_PROVIDER_MODE = 'test';
  });

  it('Vetor 4.2: Deve rejeitar webhook com assinatura HMAC ausente em modo live (HTTP 401)', async () => {
    process.env.PAYMENT_PROVIDER_MODE = 'live';

    const payload = {
      eventId: `adv_evt_nosig_${Date.now()}`,
      paymentId: 'any-id',
      gatewayTxId: 'any-tx',
      status: 'PAID',
    };

    const res = await handlePaymentWebhook(createWebhookRequest(payload, ''));
    expect(res.status).toBe(401);

    process.env.PAYMENT_PROVIDER_MODE = 'test';
  });

  // ============================================================================
  // VETOR 5: IDOR NA CONSULTA DE STATUS (/api/payments/status/[paymentId])
  // ============================================================================
  it('Vetor 5.1: Deve bloquear usuário comum tentando consultar status de pagamento de outro usuário (Anti-IDOR - HTTP 403)', async () => {
    // Pagamento pertencente à vítima
    const victimPayment = await prisma.payment.create({
      data: {
        userId: victimUser.id,
        amountCents: 8990,
        creditsGranted: 500,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_adv_idor_${Date.now()}`,
      },
    });

    // Sessão do atacante (usuário comum não-proprietário)
    (auth as any).mockResolvedValue({
      user: { id: attackerUser.id, email: attackerUser.email, role: Role.USER },
    });

    const req = createStatusRequest(victimPayment.id);
    const res = await handlePaymentStatus(req, {
      params: Promise.resolve({ paymentId: victimPayment.id }),
    });

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toContain('Acesso não autorizado');
    expect(json.payment).toBeUndefined(); // Dados confidenciais protegidos
  });

  it('Vetor 5.2: Deve permitir que o próprio proprietário consulte seu status de pagamento (HTTP 200)', async () => {
    const victimPayment = await prisma.payment.create({
      data: {
        userId: victimUser.id,
        amountCents: 8990,
        creditsGranted: 500,
        status: PaymentStatus.PAID,
        gateway: 'vorexpay',
        gatewayTxId: `tx_adv_owner_${Date.now()}`,
      },
    });

    // Sessão do próprio proprietário legítimo
    (auth as any).mockResolvedValue({
      user: { id: victimUser.id, email: victimUser.email, role: Role.USER },
    });

    const req = createStatusRequest(victimPayment.id);
    const res = await handlePaymentStatus(req, {
      params: Promise.resolve({ paymentId: victimPayment.id }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.payment.id).toBe(victimPayment.id);
    expect(json.payment.status).toBe(PaymentStatus.PAID);
    expect(json.payment.creditsGranted).toBe(500);
  });

  it('Vetor 5.3: Deve permitir que administradores autorizados consultem status de qualquer pagamento (RBAC - HTTP 200)', async () => {
    const victimPayment = await prisma.payment.create({
      data: {
        userId: victimUser.id,
        amountCents: 8990,
        creditsGranted: 500,
        status: PaymentStatus.PENDING,
        gateway: 'vorexpay',
        gatewayTxId: `tx_adv_admin_${Date.now()}`,
      },
    });

    // Sessão de ADMIN
    (auth as any).mockResolvedValue({
      user: { id: adminUser.id, email: adminUser.email, role: Role.ADMIN },
    });

    const req = createStatusRequest(victimPayment.id);
    const res = await handlePaymentStatus(req, {
      params: Promise.resolve({ paymentId: victimPayment.id }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.payment.id).toBe(victimPayment.id);
  });

  it('Vetor 5.4: Deve retornar HTTP 404 ao consultar pagamento com ID inexistente', async () => {
    (auth as any).mockResolvedValue({
      user: { id: victimUser.id, email: victimUser.email, role: Role.USER },
    });

    const fakePaymentId = `fake-payment-id-${Date.now()}`;
    const req = createStatusRequest(fakePaymentId);
    const res = await handlePaymentStatus(req, {
      params: Promise.resolve({ paymentId: fakePaymentId }),
    });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe('Pagamento não encontrado.');
  });

  // ============================================================================
  // VETOR 6: NÃO-AUTENTICADO (UNAUTHENTICATED ACCESS CONTROL)
  // ============================================================================
  it('Vetor 6.1: Deve rejeitar inicialização de checkout sem sessão ativa com HTTP 401', async () => {
    (auth as any).mockResolvedValue(null); // Sem sessão ativa

    const res = await handleCheckout(createCheckoutRequest({ packageId: activePackage.id }));
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.error).toBe('Sessão inválida ou expirada. Faça login para continuar.');
  });

  it('Vetor 6.2: Deve rejeitar consulta de status de pagamento sem sessão ativa com HTTP 401', async () => {
    (auth as any).mockResolvedValue(null); // Sem sessão ativa

    const req = createStatusRequest('any-payment-id');
    const res = await handlePaymentStatus(req, {
      params: Promise.resolve({ paymentId: 'any-payment-id' }),
    });

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Sessão inválida ou expirada. Faça login para continuar.');
  });
});
