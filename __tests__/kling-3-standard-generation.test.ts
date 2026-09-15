import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { POST as handleGenerate } from '@/app/api/tools/generate/route';
import { AIService } from '@/services/ai/ai.service';
import { FalAIProvider } from '@/services/ai/providers/fal-ai.provider';
import { fal } from '@fal-ai/client';
import { auth } from '@/auth';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Kling 3.0 Standard (fal-ai/kling-video/v3/standard/image-to-video) Generation Suite', () => {
  let testUser: any;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: `kling_std_test_${Date.now()}@vorixa.com`,
        name: 'Kling 3.0 Standard Test User',
      },
    });

    await prisma.creditBalance.create({
      data: { userId: testUser.id, balance: 500 },
    });

    let falProvider = await prisma.aIProvider.findFirst({ where: { name: 'fal.ai' } });
    if (!falProvider) {
      falProvider = await prisma.aIProvider.create({
        data: { name: 'fal.ai', status: true },
      });
    }

    // Garantir que a ferramenta imagem-video exista
    const defaultModel = await prisma.aIModel.findFirst();
    if (defaultModel) {
      await prisma.aITool.upsert({
        where: { slug: 'imagem-video' },
        create: {
          slug: 'imagem-video',
          name: 'Imagem para Vídeo',
          modelId: defaultModel.id,
          status: true,
        },
        update: {},
      });
    }
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    vi.restoreAllMocks();
  });

  it('1. Deve aceitar e processar requisição com Kling 3.0 Standard sem lançar erro de modelo não encontrado', async () => {
    vi.spyOn(fal.queue, 'submit').mockResolvedValue({
      request_id: 'mock-kling-standard-req-123',
    } as any);

    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });

    const req = new Request('http://localhost/api/tools/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolSlug: 'imagem-video',
        modelId: 'fal-ai/kling-video/v3/standard/image-to-video',
        inputs: {
          prompt: 'Cinematic drone shot of a futuristic neon cyber city at night',
          duration: '5',
          resolution: '720p',
        },
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(200);

    const job = await res.json();
    expect(job.id).toBeDefined();
    expect(job.status).toBe('PROCESSING');
    expect(job.creditCost).toBe(15);
  });

  it('2. FalAIProvider deve rotear Kling 3.0 Standard para text-to-video quando não há imagem', async () => {
    const provider = new FalAIProvider();
    const payload = {
      modelTechnicalName: 'fal-ai/kling-video/v3/standard/image-to-video',
      webhookUrl: 'http://localhost:3000/api/webhooks/fal',
      inputs: {
        prompt: 'A sleek cyber car cruising through rainy Tokyo streets',
        duration: '5',
      },
    };

    const submitSpy = vi.spyOn(fal.queue, 'submit').mockResolvedValue({
      request_id: 'mock-text-to-video-123',
    } as any);

    await provider.submitJob(payload as any);

    expect(submitSpy).toHaveBeenCalledWith(
      'fal-ai/kling-video/v3/standard/text-to-video',
      expect.objectContaining({
        input: expect.objectContaining({
          prompt: 'A sleek cyber car cruising through rainy Tokyo streets',
          duration: '5',
        }),
      })
    );
  });

  it('3. FalAIProvider deve manter image-to-video quando uma imagem de referência for enviada', async () => {
    const provider = new FalAIProvider();
    const payload = {
      modelTechnicalName: 'fal-ai/kling-video/v3/standard/image-to-video',
      webhookUrl: 'http://localhost:3000/api/webhooks/fal',
      inputs: {
        prompt: 'Animate this character turning to look at the camera with gentle wind',
        image_url: 'https://vorixa.com/test-character.jpg',
        duration: '5',
      },
    };

    const submitSpy = vi.spyOn(fal.queue, 'submit').mockResolvedValue({
      request_id: 'mock-image-to-video-123',
    } as any);

    await provider.submitJob(payload as any);

    expect(submitSpy).toHaveBeenCalledWith(
      'fal-ai/kling-video/v3/standard/image-to-video',
      expect.objectContaining({
        input: expect.objectContaining({
          prompt: 'Animate this character turning to look at the camera with gentle wind',
          start_image_url: 'https://vorixa.com/test-character.jpg',
          duration: '5',
        }),
      })
    );
  });

  it('4. AIService deve auto-registrar novos modelos fal.ai de forma segura e resiliente', async () => {
    const testDynamicModelId = `fal-ai/kling-video/v3/standard/image-to-video`;

    const job = await AIService.submitJob({
      userId: testUser.id,
      toolSlug: 'imagem-video',
      modelId: testDynamicModelId,
      inputs: { prompt: 'Resilience test' },
    });

    expect(job).toBeDefined();
    expect(job.creditCost).toBe(15);

    const modelRecord = await prisma.aIModel.findFirst({
      where: { technicalName: testDynamicModelId },
    });
    expect(modelRecord).toBeDefined();
    expect(modelRecord?.status).toBe(true);
  });
});
