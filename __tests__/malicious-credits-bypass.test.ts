import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { POST as handleGenerate } from '@/app/api/tools/generate/route';
import { POST as handleAdjustCredits } from '@/app/api/admin/adjust-credits/route';
import { POST as handleManualApprove } from '@/app/api/admin/payments/manual-approve/route';
import { POST as handlePaymentWebhook } from '@/app/api/webhooks/payment/route';
import { auth } from '@/auth';
import { CreditService } from '@/services/credit.service';
import { TalkingVideoService } from '@/services/talking-video.service';
import { PaymentStatus } from '@prisma/client';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Malicious Attacks & Financial Bypass Protection Suite', () => {
  let regularUser: any;
  let victimUser: any;
  let adminUser: any;
  let blockedAdminUser: any;
  let sampleTool: any;
  let expensiveKlingTool: any;

  beforeAll(async () => {
    // 1. Criar usuários com papéis distintos
    regularUser = await prisma.user.create({
      data: {
        email: `hacker_user_${Date.now()}@attacker.com`,
        name: 'Attacker User',
        role: 'USER',
        isBlocked: false,
      },
    });

    victimUser = await prisma.user.create({
      data: {
        email: `victim_user_${Date.now()}@target.com`,
        name: 'Victim User',
        role: 'USER',
        isBlocked: false,
      },
    });

    adminUser = await prisma.user.create({
      data: {
        email: `admin_sec_${Date.now()}@security.com`,
        name: 'Super Admin',
        role: 'ADMIN',
        isBlocked: false,
      },
    });

    blockedAdminUser = await prisma.user.create({
      data: {
        email: `blocked_admin_${Date.now()}@security.com`,
        name: 'Blocked Admin',
        role: 'ADMIN',
        isBlocked: true,
      },
    });

    // Iniciar saldos
    await prisma.creditBalance.create({
      data: { userId: regularUser.id, balance: 0 },
    });

    await prisma.creditBalance.create({
      data: { userId: victimUser.id, balance: 100 },
    });

    // Encontrar ferramentas de teste
    sampleTool = await prisma.aITool.findFirst({
      where: { status: true },
      include: { model: true },
    });

    expensiveKlingTool = await prisma.aITool.findFirst({
      where: {
        status: true,
        model: { technicalName: { contains: 'kling' } },
      },
      include: { model: true },
    }) || sampleTool;
  });

  afterAll(async () => {
    const ids = [regularUser?.id, victimUser?.id, adminUser?.id, blockedAdminUser?.id].filter(Boolean);
    for (const id of ids) {
      await prisma.user.delete({ where: { id } }).catch(() => {});
    }
    vi.restoreAllMocks();
  });

  // =========================================================================
  // VETOR 1: TENTATIVA DE FORÇAR ADIÇÃO OU MANIPULAÇÃO DE CRÉDITOS SEM SER ADMIN
  // =========================================================================
  it('Ataque 1.1: Usuário comum tentando chamar endpoint de ajuste de créditos deve ser bloqueado com 403', async () => {
    (auth as any).mockResolvedValue({
      user: { id: regularUser.id, email: regularUser.email, role: 'USER' },
    });

    const req = new Request('http://localhost/api/admin/adjust-credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUserId: regularUser.id,
        creditsAmount: 999999,
        reason: 'Exploit self-credit injection',
      }),
    });

    const res = await handleAdjustCredits(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('Acesso não autorizado.');

    // Saldo deve permanecer estritamente 0
    const balance = await CreditService.getBalance(regularUser.id);
    expect(balance).toBe(0);
  });

  it('Ataque 1.2: Admin bloqueado (suspenso) tentando injetar saldo deve receber 403 Forbidden', async () => {
    (auth as any).mockResolvedValue({
      user: { id: blockedAdminUser.id, email: blockedAdminUser.email, role: 'ADMIN' },
    });

    const req = new Request('http://localhost/api/admin/adjust-credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUserId: regularUser.id,
        creditsAmount: 500,
        reason: 'Blocked admin rogue credit grant',
      }),
    });

    const res = await handleAdjustCredits(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toMatch(/Conta administrativa suspensa/);

    const balance = await CreditService.getBalance(regularUser.id);
    expect(balance).toBe(0);
  });

  it('Ataque 1.3: Injeção de valores inválidos (0, float, NaN, strings ou valores não inteiros) deve ser rejeitada com 400', async () => {
    (auth as any).mockResolvedValue({
      user: { id: adminUser.id, email: adminUser.email, role: 'ADMIN' },
    });

    const maliciousInputs = [0, 10.5, -0, NaN, '1000', null, undefined];

    for (const val of maliciousInputs) {
      const req = new Request('http://localhost/api/admin/adjust-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: regularUser.id,
          creditsAmount: val,
          reason: 'Test malicious invalid credit type',
        }),
      });

      const res = await handleAdjustCredits(req);
      expect(res.status).toBe(400);
    }
  });

  // =========================================================================
  // VETOR 2: TENTATIVA DE RODAR JOBS DE IA SEM GASTAR CRÉDITOS (SALDO ZERO OU INSUFICIENTE)
  // =========================================================================
  it('Ataque 2.1: Tentativa de gerar IA com saldo 0 deve ser sumariamente barrada com erro de saldo', async () => {
    (auth as any).mockResolvedValue({
      user: { id: regularUser.id, email: regularUser.email },
    });

    const initialBalance = await CreditService.getBalance(regularUser.id);
    expect(initialBalance).toBe(0);

    const req = new Request('http://localhost/api/tools/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolSlug: sampleTool.slug,
        inputs: { prompt: 'Free generation attempt with 0 balance' },
      }),
    });

    const res = await handleGenerate(req);
    // Deve retornar 400 ou 500 contendo mensagem de saldo insuficiente
    expect(res.status).toBeGreaterThanOrEqual(400);
    const data = await res.json();
    expect(data.error).toMatch(/Saldo insuficiente/);

    // Saldo NÃO pode ficar negativo
    const postBalance = await CreditService.getBalance(regularUser.id);
    expect(postBalance).toBe(0);
  });

  it('Ataque 2.2: Tentativa de forçar valores customizados de custo (ex: credits: 0, cost: -10) no payload é ignorada pelo backend', async () => {
    (auth as any).mockResolvedValue({
      user: { id: regularUser.id, email: regularUser.email },
    });

    const req = new Request('http://localhost/api/tools/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolSlug: sampleTool.slug,
        inputs: { prompt: 'Bypass cost with negative or zero creditCost' },
        creditCost: 0,
        credits: -50,
        cost: 0,
        price: 0,
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBeGreaterThanOrEqual(400);
    const data = await res.json();
    expect(data.error).toMatch(/Saldo insuficiente/);
  });

  // =========================================================================
  // VETOR 3: TENTATIVA DE MANIPULAÇÃO DE MULTIPLICADORES (VÍDEO LONGO OU 4K)
  // =========================================================================
  it('Ataque 3.1: Backend recalcula forçadamente duração e qualidade (impedindo vídeo 10s 4K pelo preço de imagem 5s)', async () => {
    // Vamos dar 10 créditos para o usuário
    await prisma.creditBalance.update({
      where: { userId: regularUser.id },
      data: { balance: 10 },
    });

    (auth as any).mockResolvedValue({
      user: { id: regularUser.id, email: regularUser.email },
    });

    // Tentativa: solicitar Kling 10s em 4K enviando duração "10" e resolução "4K"
    // Com apenas 10 créditos, a geração DEVE ser rejeitada por saldo insuficiente,
    // comprovando que o cliente não consegue fraudar os multiplicadores de preço.
    const req = new Request('http://localhost/api/tools/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolSlug: expensiveKlingTool.slug,
        inputs: {
          prompt: 'Cinematic 4K 10s video',
          duration: '10',
          resolution: '4K',
        },
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBeGreaterThanOrEqual(400);
    const data = await res.json();
    expect(data.error).toMatch(/Saldo insuficiente/);

    // Saldo deve continuar intacto (10 créditos)
    const currentBalance = await CreditService.getBalance(regularUser.id);
    expect(currentBalance).toBe(10);
  });

  // =========================================================================
  // VETOR 4: TENTATIVA DE BURLAR O SERVIÇO DE BUNDLE (TALKING VIDEO SERVICE)
  // =========================================================================
  it('Ataque 4.1: TalkingVideoService barra execução de pacote completo se usuário não tiver saldo para vídeo + áudio + lipsync', async () => {
    // Usuário tem apenas 10 créditos. Um Talking Video completo requer Video (10 a 20) + Áudio e LipSync (9) = min 19 créditos.
    await expect(
      TalkingVideoService.createTalkingVideoJob({
        userId: regularUser.id,
        prompt: 'Talking avatar exploit',
        speechText: 'Texto longo para síntese neural e sincronia labial',
      })
    ).rejects.toThrow(/Saldo insuficiente/);

    const currentBalance = await CreditService.getBalance(regularUser.id);
    expect(currentBalance).toBe(10);
  });

  // =========================================================================
  // VETOR 5: TENTATIVA DE FORJAR WEBHOOK DE PAGAMENTO SEM ASSINATURA VÁLIDA
  // =========================================================================
  it('Ataque 5.1: Webhook forjado com pagamento falso sem registro existente no banco deve retornar 404', async () => {
    const fakeEventId = `fake_evt_${Date.now()}`;
    const fakePaymentId = `fake_pay_${Date.now()}`;

    const fakePayload = {
      id: fakeEventId,
      eventId: fakeEventId,
      paymentId: fakePaymentId,
      status: 'PAID',
      gatewayTxId: `tx_attacker_${Date.now()}`,
    };

    const req = new Request('http://localhost/api/webhooks/payment?provider=stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'invalid_signature_mock',
      },
      body: JSON.stringify(fakePayload),
    });

    const res = await handlePaymentWebhook(req);
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe('Pagamento não localizado.');
  });

  it('Ataque 5.2: Tentativa de Replay de Webhook já processado é reconhecida e não duplica créditos', async () => {
    // 1. Criar um pagamento legítimo pendente no banco para a vítima
    const legitimatePayment = await prisma.payment.create({
      data: {
        userId: victimUser.id,
        amountCents: 5000,
        creditsGranted: 50,
        gateway: 'stripe',
        gatewayTxId: `valid_tx_${Date.now()}`,
        status: PaymentStatus.PENDING,
      },
    });

    const webhookEventId = `legit_evt_${Date.now()}`;
    const webhookPayload = {
      id: webhookEventId,
      eventId: webhookEventId,
      paymentId: legitimatePayment.id,
      status: 'PAID',
      gatewayTxId: legitimatePayment.gatewayTxId,
    };

    // Primeira chamada: aprovação legítima
    const req1 = new Request('http://localhost/api/webhooks/payment?provider=stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    });

    const res1 = await handlePaymentWebhook(req1);
    expect(res1.status).toBe(200);

    const victimBalanceAfter = await CreditService.getBalance(victimUser.id);
    expect(victimBalanceAfter).toBe(150); // 100 iniciais + 50 creditados

    // Segunda chamada maliciosa (Replay Attack): tentar re-enviar o mesmo webhook para dobrar créditos
    const req2 = new Request('http://localhost/api/webhooks/payment?provider=stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    });

    const res2 = await handlePaymentWebhook(req2);
    expect(res2.status).toBe(200);
    const json2 = await res2.json();
    expect(json2.message).toMatch(/já processado/);

    // Saldo NÃO pode duplicar
    const victimBalanceFinal = await CreditService.getBalance(victimUser.id);
    expect(victimBalanceFinal).toBe(150);
  });

  // =========================================================================
  // VETOR 6: TENTATIVA DE APROVAÇÃO MANUAL FRAUDULENTA POR NÃO-ADMIN OU DUPLICADA
  // =========================================================================
  it('Ataque 6.1: Usuário comum tentando chamar rota de aprovação manual recebe 403', async () => {
    (auth as any).mockResolvedValue({
      user: { id: regularUser.id, email: regularUser.email, role: 'USER' },
    });

    const req = new Request('http://localhost/api/admin/payments/manual-approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId: 'any-payment-id',
        reason: 'Hacker manual approval attempt',
      }),
    });

    const res = await handleManualApprove(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toMatch(/Acesso não autorizado/);
  });

  it('Ataque 6.2: Aprovação manual de pagamento inexistente é tratada com 404', async () => {
    (auth as any).mockResolvedValue({
      user: { id: adminUser.id, email: adminUser.email, role: 'ADMIN' },
    });

    const reqInvalido = new Request('http://localhost/api/admin/payments/manual-approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId: 'non-existent-payment-id',
      }),
    });

    const resInvalido = await handleManualApprove(reqInvalido);
    expect(resInvalido.status).toBe(404);
  });
});
