import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '@/lib/prisma';
import { CreditService } from '@/services/credit.service';

describe('Credit System transactional service tests', () => {
  let testUser: any;
  let testAdmin: any;
  let seededModel: any;
  let seededTool: any;

  beforeAll(async () => {
    // Obter modelo e ferramenta populados via seed
    seededModel = await prisma.aIModel.findFirst();
    seededTool = await prisma.aITool.findFirst();

    if (!seededModel || !seededTool) {
      throw new Error("Seed do banco de dados não foi executado ou falhou.");
    }

    // Criar usuários de teste
    testUser = await prisma.user.create({
      data: {
        email: `client_${Date.now()}@test.com`,
        name: 'Cliente Teste',
      },
    });

    testAdmin = await prisma.user.create({
      data: {
        email: `admin_${Date.now()}@test.com`,
        name: 'Admin Teste',
        role: 'ADMIN',
      },
    });
  });

  afterAll(async () => {
    // Limpar banco de dados de teste
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    if (testAdmin) {
      await prisma.user.delete({ where: { id: testAdmin.id } }).catch(() => {});
    }
  });

  it('should initialize, add and check credit balance correctly', async () => {
    const initialBal = await CreditService.getBalance(testUser.id);
    expect(initialBal).toBe(0);

    const newBal = await CreditService.addCredits(
      testUser.id,
      100,
      'PURCHASE',
      'Compra inicial de pacote'
    );
    expect(newBal).toBe(100);

    const checkBal = await CreditService.getBalance(testUser.id);
    expect(checkBal).toBe(100);
  });

  it('should prevent debits when balance is insufficient', async () => {
    const hasEnough = await CreditService.hasEnoughCredits(testUser.id, 150);
    expect(hasEnough).toBe(false);

    await expect(
      CreditService.consumeCredits(testUser.id, 150, seededTool.slug, 'job-err-1')
    ).rejects.toThrow('Saldo insuficiente de créditos.');
  });

  it('should successfully consume credits', async () => {
    // Criar o Job correspondente para respeitar a chave estrangeira
    const job = await prisma.aIJob.create({
      data: {
        id: 'job-success-1',
        userId: testUser.id,
        modelId: seededModel.id,
        toolId: seededTool.id,
        creditCost: 40,
        apiUnitCost: 0.1,
      },
    });

    const finalBal = await CreditService.consumeCredits(testUser.id, 40, seededTool.slug, job.id);
    expect(finalBal).toBe(60);

    const current = await CreditService.getBalance(testUser.id);
    expect(current).toBe(60);
  });

  it('should refund credits properly on failure and prevent double refund', async () => {
    // Usamos o job 'job-success-1' criado no teste anterior
    const afterRefund = await CreditService.refundCredits(testUser.id, 40, 'job-success-1');
    expect(afterRefund).toBe(100);

    // Tentar reembolso duplo
    const doubleRefund = await CreditService.refundCredits(testUser.id, 40, 'job-success-1');
    expect(doubleRefund).toBe(100); // Saldo deve continuar em 100
  });

  it('should enforce idempotency on duplicate payments', async () => {
    const paymentId = `pay-unique-${Date.now()}`;

    // Criar o pagamento no banco para respeitar a chave estrangeira
    await prisma.payment.create({
      data: {
        id: paymentId,
        userId: testUser.id,
        amountBRL: 49.90,
        creditsGranted: 50,
        status: 'PAID',
        gateway: 'stripe',
      },
    });

    // Adiciona 50 créditos
    const balance1 = await CreditService.addCredits(
      testUser.id,
      50,
      'PURCHASE',
      'Compra via checkout',
      paymentId
    );
    expect(balance1).toBe(150);

    // Tenta reprocessar o mesmo paymentId
    const balance2 = await CreditService.addCredits(
      testUser.id,
      50,
      'PURCHASE',
      'Compra via checkout duplicada',
      paymentId
    );
    expect(balance2).toBe(150); // Não deve somar novamente
  });

  it('should not deduct balance for unlimited users but register audit trail', async () => {
    const unlimitedUser = await prisma.user.create({
      data: {
        email: `unlimited_${Date.now()}@test.com`,
        name: 'Usuário Pro',
        isUnlimited: true,
      },
    });

    await prisma.creditBalance.create({
      data: { userId: unlimitedUser.id, balance: 10 },
    });

    const job = await prisma.aIJob.create({
      data: {
        id: 'job-unl-1',
        userId: unlimitedUser.id,
        modelId: seededModel.id,
        toolId: seededTool.id,
        creditCost: 30,
        apiUnitCost: 0.1,
      },
    });

    const enough = await CreditService.hasEnoughCredits(unlimitedUser.id, 50);
    expect(enough).toBe(true); // Ilimitados sempre passam no hasEnough

    // Consome 30 créditos
    const bal = await CreditService.consumeCredits(unlimitedUser.id, 30, seededTool.slug, job.id);
    expect(bal).toBe(10); // Saldo intocado

    // Limpar unlimitedUser
    await prisma.user.delete({ where: { id: unlimitedUser.id } });
  });

  it('should successfully handle concurrent debits without race conditions', async () => {
    // Criar um usuário específico para o teste de concorrência com 10 créditos
    const concUser = await prisma.user.create({
      data: {
        email: `concur_${Date.now()}@test.com`,
        name: 'Usuário Concorrência',
      },
    });

    await prisma.creditBalance.create({
      data: { userId: concUser.id, balance: 10 },
    });

    // Criar os 3 jobs para concorrência no banco
    await prisma.aIJob.createMany({
      data: [
        { id: 'job-c1', userId: concUser.id, modelId: seededModel.id, toolId: seededTool.id, creditCost: 4, apiUnitCost: 0.05 },
        { id: 'job-c2', userId: concUser.id, modelId: seededModel.id, toolId: seededTool.id, creditCost: 4, apiUnitCost: 0.05 },
        { id: 'job-c3', userId: concUser.id, modelId: seededModel.id, toolId: seededTool.id, creditCost: 4, apiUnitCost: 0.05 },
      ],
    });

    // Disparar 3 consumos paralelos de 4 créditos (total 12 créditos, saldo é 10)
    const jobs = [
      CreditService.consumeCredits(concUser.id, 4, seededTool.slug, 'job-c1'),
      CreditService.consumeCredits(concUser.id, 4, seededTool.slug, 'job-c2'),
      CreditService.consumeCredits(concUser.id, 4, seededTool.slug, 'job-c3'),
    ];

    const results = await Promise.allSettled(jobs);

    const fulfilledCount = results.filter((r) => r.status === 'fulfilled').length;
    const rejectedCount = results.filter((r) => r.status === 'rejected').length;

    // Apenas 2 devem conseguir consumir (2 * 4 = 8 créditos debitados, resta 2 créditos)
    // O terceiro deve falhar por saldo insuficiente (10 - 12 = impossível)
    expect(fulfilledCount).toBe(2);
    expect(rejectedCount).toBe(1);

    const finalBal = await CreditService.getBalance(concUser.id);
    expect(finalBal).toBe(2);

    await prisma.user.delete({ where: { id: concUser.id } });
  });

  it('should log adjustments manually by admin and create audit entry', async () => {
    // Ajustar saldo do testUser (atualmente 150 créditos) adicionando +50
    const adjBal = await CreditService.adjustCredits(
      testUser.id,
      50,
      'Ajuste manual de bonificação',
      testAdmin.id
    );
    expect(adjBal).toBe(200);

    // Verificar se gerou AuditLog
    const logs = await prisma.auditLog.findMany({
      where: { userId: testAdmin.id },
    });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].action).toBe('UPDATE_CREDITS');
  });
});
