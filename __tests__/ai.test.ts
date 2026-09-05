import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { AIService } from '@/services/ai/ai.service';
import { CreditService } from '@/services/credit.service';
import { POST as handleFalWebhook } from '@/app/api/webhooks/fal/route';

vi.mock('@/services/storage.service', () => ({
  StorageService: {
    uploadFromUrl: vi.fn().mockImplementation(() => Promise.resolve(`/uploads/mocked-image-${Math.random()}.png`))
  }
}));

describe('AI Engine and fal.ai mock adapter tests', () => {
  let testUser: any;
  let seededModel: any;
  let seededTool: any;

  beforeAll(async () => {
    seededTool = await prisma.aITool.findFirst({ include: { model: true } });
    seededModel = seededTool?.model;

    if (!seededModel || !seededTool) {
      throw new Error("Seed do banco de dados não foi executado.");
    }

    // Garante que todas as ferramentas e modelos estejam ativos
    await prisma.aITool.updateMany({ data: { status: true } });
    await prisma.aIModel.updateMany({ data: { status: true } });

    testUser = await prisma.user.create({
      data: {
        email: `ai_client_${Date.now()}@test.com`,
        name: 'AI Cliente Teste',
      },
    });

    await prisma.creditBalance.create({
      data: { userId: testUser.id, balance: 200 },
    });
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
  });

  it('should block job creation if credits are insufficient', async () => {
    await prisma.creditBalance.update({
      where: { userId: testUser.id },
      data: { balance: 0 },
    });

    await expect(
      AIService.submitJob({
        userId: testUser.id,
        toolSlug: seededTool.slug,
        inputs: { prompt: "Teste de erro" },
      })
    ).rejects.toThrow("Saldo insuficiente de créditos.");
  });

  it('should successfully submit job and deduct credits', async () => {
    await prisma.creditBalance.update({
      where: { userId: testUser.id },
      data: { balance: 200 },
    });

    const job = await AIService.submitJob({
      userId: testUser.id,
      toolSlug: seededTool.slug,
      inputs: { prompt: "Cachorro fofo realista" },
      idempotencyKey: `idemp-job-1-${Date.now()}`,
    });

    expect(job).toBeDefined();
    expect(job.status).toBe("PROCESSING");
    expect(job.providerJobId).toBeDefined();

    const cost = seededModel.creditCost;
    const finalBal = await CreditService.getBalance(testUser.id);
    expect(finalBal).toBe(200 - cost);
  });

  it('should enforce idempotency and return the existing job on duplicate submit', async () => {
    const key = `unique-key-${Date.now()}`;

    const job1 = await AIService.submitJob({
      userId: testUser.id,
      toolSlug: seededTool.slug,
      inputs: { prompt: "Idempotency test" },
      idempotencyKey: key,
    });

    const job2 = await AIService.submitJob({
      userId: testUser.id,
      toolSlug: seededTool.slug,
      inputs: { prompt: "Idempotency test" },
      idempotencyKey: key,
    });

    expect(job1.id).toBe(job2.id);
  });

  it('should process completed webhook, download file, update status to COMPLETED', async () => {
    const key = `completed-key-${Date.now()}`;
    const job = await AIService.submitJob({
      userId: testUser.id,
      toolSlug: seededTool.slug,
      inputs: { prompt: "Completed Webhook test" },
      idempotencyKey: key,
    });

    const req = new Request("http://localhost/api/webhooks/fal", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-fal-signature": "mock-sig" },
      body: JSON.stringify({
        request_id: job.providerJobId,
        status: "COMPLETED",
        payload: {
          images: [{ url: "https://picsum.photos/200" }],
        },
      }),
    });

    const response = await handleFalWebhook(req);
    expect(response.status).toBe(200);

    const updatedJob = await prisma.aIJob.findUnique({
      where: { id: job.id },
      include: { outputs: true },
    });

    expect(updatedJob?.status).toBe("COMPLETED");
    expect(updatedJob?.outputs.length).toBeGreaterThan(0);
  });

  it('should process failed webhook and refund user balance', async () => {
    const balanceBefore = await CreditService.getBalance(testUser.id);

    const key = `failed-key-${Date.now()}`;
    const job = await AIService.submitJob({
      userId: testUser.id,
      toolSlug: seededTool.slug,
      inputs: { prompt: "Failed Webhook test" },
      idempotencyKey: key,
    });

    const req = new Request("http://localhost/api/webhooks/fal", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-fal-signature": "mock-sig" },
      body: JSON.stringify({
        request_id: job.providerJobId,
        status: "FAILED",
        error: "Timeout error during rendering.",
      }),
    });

    const response = await handleFalWebhook(req);
    expect(response.status).toBe(200);

    const updatedJob = await prisma.aIJob.findUnique({
      where: { id: job.id },
    });

    expect(updatedJob?.status).toBe("FAILED");
    expect(updatedJob?.error).toBe("Timeout error during rendering.");

    const balanceAfter = await CreditService.getBalance(testUser.id);
    expect(balanceAfter).toBe(balanceBefore);
  });

  it('should reject webhooks without signature in live mode', async () => {
    const originalMode = process.env.AI_PROVIDER_MODE;
    process.env.AI_PROVIDER_MODE = 'live';

    const req = new Request("http://localhost/api/webhooks/fal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: "some-job-id",
        status: "COMPLETED",
      }),
    });

    const response = await handleFalWebhook(req);
    expect(response.status).toBe(401);

    // Restaurar modo original
    process.env.AI_PROVIDER_MODE = originalMode;
  });

  it('should handle duplicate webhook COMPLETED calls idempotently without duplicate outputs', async () => {
    const key = `dup-webhook-key-${Date.now()}`;
    const job = await AIService.submitJob({
      userId: testUser.id,
      toolSlug: seededTool.slug,
      inputs: { prompt: "Duplicate completed webhook test" },
      idempotencyKey: key,
    });

    const req1 = new Request("http://localhost/api/webhooks/fal", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-fal-signature": "mock-sig" },
      body: JSON.stringify({
        request_id: job.providerJobId,
        status: "COMPLETED",
        payload: { images: [{ url: "https://picsum.photos/200" }] },
      }),
    });
    await handleFalWebhook(req1);

    // Segunda chamada
    const req2 = new Request("http://localhost/api/webhooks/fal", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-fal-signature": "mock-sig" },
      body: JSON.stringify({
        request_id: job.providerJobId,
        status: "COMPLETED",
        payload: { images: [{ url: "https://picsum.photos/200" }] },
      }),
    });
    const response = await handleFalWebhook(req2);
    if (response.status !== 200) {
      console.error(await response.text());
    }
    expect(response.status).toBe(200);

    const checkJob = await prisma.aIJob.findUnique({
      where: { id: job.id },
      include: { outputs: true },
    });
    expect(checkJob?.outputs.length).toBe(1); // Somente 1 output
  });

  it('should prevent state regression on webhook out of order events', async () => {
    const key = `ooo-key-${Date.now()}`;
    const job = await AIService.submitJob({
      userId: testUser.id,
      toolSlug: seededTool.slug,
      inputs: { prompt: "Out of order webhook test" },
      idempotencyKey: key,
    });

    // COMPLETED primeiro
    const req1 = new Request("http://localhost/api/webhooks/fal", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-fal-signature": "mock-sig" },
      body: JSON.stringify({
        request_id: job.providerJobId,
        status: "COMPLETED",
        payload: { images: [{ url: "https://picsum.photos/200" }] },
      }),
    });
    await handleFalWebhook(req1);

    // PROCESSING depois (evento atrasado)
    const req2 = new Request("http://localhost/api/webhooks/fal", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-fal-signature": "mock-sig" },
      body: JSON.stringify({
        request_id: job.providerJobId,
        status: "PROCESSING",
      }),
    });
    const response = await handleFalWebhook(req2);
    expect(response.status).toBe(200);

    const checkJob = await prisma.aIJob.findUnique({
      where: { id: job.id },
    });
    expect(checkJob?.status).toBe("COMPLETED"); // Status não regrediu para PROCESSING
  });

  it('should handle duplicate webhook FAILED calls idempotently without duplicate refunds', async () => {
    const balanceBefore = await CreditService.getBalance(testUser.id);

    const key = `failed-dup-key-${Date.now()}`;
    const job = await AIService.submitJob({
      userId: testUser.id,
      toolSlug: seededTool.slug,
      inputs: { prompt: "Duplicate failed webhook test" },
      idempotencyKey: key,
    });

    const balanceAfterSubmit = await CreditService.getBalance(testUser.id);

    // Primeira falha (estorna créditos)
    const req1 = new Request("http://localhost/api/webhooks/fal", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-fal-signature": "mock-sig" },
      body: JSON.stringify({
        request_id: job.providerJobId,
        status: "FAILED",
        error: "Render timeout",
      }),
    });
    await handleFalWebhook(req1);

    const balanceAfterRefund1 = await CreditService.getBalance(testUser.id);
    expect(balanceAfterRefund1).toBe(balanceBefore);

    // Segunda falha (não deve estornar novamente!)
    const req2 = new Request("http://localhost/api/webhooks/fal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: job.providerJobId,
        status: "FAILED",
        error: "Render timeout",
      }),
    });
    await handleFalWebhook(req2);

    const balanceAfterRefund2 = await CreditService.getBalance(testUser.id);
    expect(balanceAfterRefund2).toBe(balanceBefore); // Permanece igual, sem duplicar o estorno
  });
});
