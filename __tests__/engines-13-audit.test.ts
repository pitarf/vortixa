import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '@/lib/prisma';
import { POST as handleGenerate } from '@/app/api/tools/generate/route';
import { GET as handleConfig } from '@/app/api/tools/config/route';
import { FalAIProvider } from '@/services/ai/providers/fal-ai.provider';
import { fal } from '@fal-ai/client';
import { auth } from '@/auth';
import { vi } from 'vitest';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Audit & Readiness Test: All 17 Generative AI Engines (Latest Versions)', () => {
  let testUser: any;
  const EXPECTED_MODELS = [
    { name: 'FLUX Schnell', slug: 'gerador-imagem', technicalName: 'fal-ai/flux/schnell' },
    { name: 'Kling 2.1 Pro', slug: 'imagem-video', technicalName: 'fal-ai/kling-video/v2.1/pro/image-to-video' },
    { name: 'Luma Ray 2', slug: 'luma-ray-2', technicalName: 'fal-ai/luma-dream-machine/ray-2' },
    { name: 'Wan 2.1 Video', slug: 'wan-video', technicalName: 'fal-ai/wan-i2v' },
    { name: 'Hailuo Minimax 01 Live', slug: 'minimax-live', technicalName: 'fal-ai/minimax/video-01-live' },
    { name: 'Kling Motion Control', slug: 'motion-control', technicalName: 'fal-ai/kling/motion-control' },
    { name: 'LatentSync Pro LipSync', slug: 'lip-sync', technicalName: 'fal-ai/latentsync' },
    { name: 'Creative Video Upscaler', slug: 'upscale', technicalName: 'fal-ai/creative-upscaler' },
    { name: 'FLUX Dev', slug: 'gerador-imagem-dev', technicalName: 'fal-ai/flux/dev' },
    { name: 'Recraft V3', slug: 'gerador-imagem-recraft', technicalName: 'fal-ai/recraft-v3' },
    { name: 'FLUX.1 Pro Ultra', slug: 'gerador-imagem-ultra', technicalName: 'fal-ai/flux-pro/v1.1-ultra' },
    { name: 'Google Imagen 3 (Gemini Pro)', slug: 'gerador-imagem-imagen3', technicalName: 'fal-ai/nano-banana-pro' },
    { name: 'Sync Audio v2', slug: 'sync-v2', technicalName: 'fal-ai/sync-v2' },
  ];

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: `engine_audit_${Date.now()}@vorixa.com`,
        name: 'Engine Audit User',
      },
    });

    await prisma.creditBalance.create({
      data: { userId: testUser.id, balance: 1000 },
    });

    let provider = await prisma.aIProvider.findFirst({ where: { name: 'fal.ai' } });
    if (!provider) {
      provider = await prisma.aIProvider.create({
        data: { name: 'fal.ai', status: true },
      });
    }

    for (const exp of EXPECTED_MODELS) {
      const model = await prisma.aIModel.upsert({
        where: { id: exp.technicalName },
        create: {
          id: exp.technicalName,
          providerId: provider.id,
          name: exp.name,
          technicalName: exp.technicalName,
          creditCost: 10,
          apiUnitCost: 0.1,
          status: true,
        },
        update: {
          name: exp.name,
          status: true,
        },
      });

      await prisma.aITool.upsert({
        where: { slug: exp.slug },
        create: {
          modelId: model.id,
          name: exp.name,
          slug: exp.slug,
          status: true,
        },
        update: {
          modelId: model.id,
          name: exp.name,
          status: true,
        },
      });
    }
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    vi.restoreAllMocks();
  });

  it('1. GET /api/tools/config must return all 13 active models and tools', async () => {
    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });

    const res = await handleConfig();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.tools).toBeDefined();
    expect(data.tools.length).toBeGreaterThanOrEqual(13);

    const returnedSlugs = data.tools.map((t: any) => t.slug);
    const returnedTechnicalNames = data.tools.map((t: any) => t.model?.technicalName);

    for (const exp of EXPECTED_MODELS) {
      expect(returnedSlugs).toContain(exp.slug);
      expect(returnedTechnicalNames).toContain(exp.technicalName);
    }
  });

  it('2. POST /api/tools/generate must be capable of generating jobs for all 13 models', async () => {
    for (const exp of EXPECTED_MODELS) {
      (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });

      const req = new Request('http://localhost/api/tools/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug: exp.slug,
          inputs: {
            prompt: `Audit test for engine ${exp.name}`,
            image_url: 'https://vorixa.com/test-sample.jpg',
            video_url: 'https://vorixa.com/test-sample.mp4',
            audio_url: 'https://vorixa.com/test-sample.mp3',
          },
        }),
      });

      const res = await handleGenerate(req);
      expect(res.status).toBe(200);
      const job = await res.json();
      expect(job.id).toBeDefined();
      expect(job.status).toBe('PROCESSING');
      expect(job.modelId).toBe(exp.technicalName);
      expect(job.creditCost).toBeGreaterThan(0);
    }
  }, 60000);

  it('3. FalAIProvider input normalization & hardening unit tests', async () => {
    const provider = new FalAIProvider();
    const queueSpy = vi.spyOn(fal.queue, 'submit').mockResolvedValue({
      request_id: 'test-req-123',
    } as any);

    // Test Kling Image to Video
    await provider.submitJob({
      jobId: 'fake-job-kling',
      modelTechnicalName: 'fal-ai/kling/video-generation/image-to-video',
      inputs: { image_url: 'https://test.com/char.jpg', duration: 5 },
      webhookUrl: 'https://vorixa.com/webhook',
    });
    expect(queueSpy).toHaveBeenLastCalledWith(
      'fal-ai/kling/video-generation/image-to-video',
      expect.objectContaining({
        input: expect.objectContaining({
          prompt_image_url: 'https://test.com/char.jpg',
          image_url: 'https://test.com/char.jpg',
          duration: '5',
        }),
      })
    );

    // Test LipSync
    await provider.submitJob({
      jobId: 'fake-job-lipsync',
      modelTechnicalName: 'fal-ai/latentsync',
      inputs: { video_url: 'https://test.com/v.mp4', driving_audio_url: 'https://test.com/a.mp3' },
      webhookUrl: 'https://vorixa.com/webhook',
    });
    expect(queueSpy).toHaveBeenLastCalledWith(
      'fal-ai/latentsync',
      expect.objectContaining({
        input: expect.objectContaining({
          video: 'https://test.com/v.mp4',
          audio: 'https://test.com/a.mp3',
          driving_audio_url: 'https://test.com/a.mp3',
        }),
      })
    );

    // Test Motion Control
    await provider.submitJob({
      jobId: 'fake-job-motion',
      modelTechnicalName: 'fal-ai/kling/motion-control',
      inputs: { character_image_url: 'https://test.com/c.png', pose_reference_url: 'https://test.com/pose.mp4' },
      webhookUrl: 'https://vorixa.com/webhook',
    });
    expect(queueSpy).toHaveBeenLastCalledWith(
      'fal-ai/kling/motion-control',
      expect.objectContaining({
        input: expect.objectContaining({
          image_url: 'https://test.com/c.png',
          video_url: 'https://test.com/pose.mp4',
        }),
      })
    );

    // Test Creative Upscaler
    await provider.submitJob({
      jobId: 'fake-job-upscale',
      modelTechnicalName: 'fal-ai/creative-upscaler',
      inputs: { video_url: 'https://test.com/in.mp4', scale_factor: '4' },
      webhookUrl: 'https://vorixa.com/webhook',
    });
    expect(queueSpy).toHaveBeenLastCalledWith(
      'fal-ai/creative-upscaler',
      expect.objectContaining({
        input: expect.objectContaining({
          video: 'https://test.com/in.mp4',
          scale: 4,
        }),
      })
    );

    queueSpy.mockRestore();
  });
});
