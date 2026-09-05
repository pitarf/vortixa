import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { POST as handleGenerate } from '@/app/api/tools/generate/route';
import { GET as handleJobStatus } from '@/app/api/tools/job/[id]/route';
import { POST as handleOptimizePrompt } from '@/app/api/tools/optimize-prompt/route';

// Mock Auth.js session
import { auth } from '@/auth';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Backend de Geração de Imagem & Studio Create (End-to-End)', () => {
  let testUser: any;
  let imageTool: any;

  beforeAll(async () => {
    // Busca a ferramenta gerador-imagem
    imageTool = await prisma.aITool.findUnique({
      where: { slug: 'gerador-imagem' },
      include: { model: true },
    });

    if (!imageTool) {
      throw new Error("Ferramenta gerador-imagem não encontrada no banco de dados.");
    }

    // Cria usuário de teste com saldo abundante
    testUser = await prisma.user.create({
      data: {
        email: `image_test_${Date.now()}@vorixa.ai`,
        name: 'Image Test User',
      },
    });

    await prisma.creditBalance.create({
      data: { userId: testUser.id, balance: 100 },
    });
  });

  afterAll(async () => {
    if (testUser) {
      // Limpeza segura dos dados criados no teste
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    vi.restoreAllMocks();
  });

  it('deve submeter com sucesso uma geração Text-to-Image com modelo especificado (FLUX Schnell)', async () => {
    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });

    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: "gerador-imagem",
        modelId: "fal-ai/flux/schnell",
        inputs: {
          prompt: "Mulher futurista em cidade cyberpunk, iluminação neon, fotografia cinematográfica 8k",
          image_size: "landscape_16_9",
          resolution: "1792 x 1024",
          num_inference_steps: 24,
          guidance_scale: 7.5,
          style: "cinematic",
          mode: "text-to-image",
        },
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(200);

    const job = await res.json();
    expect(job.id).toBeDefined();
    expect(job.status).toBe("PROCESSING");
    expect(job.creditCost).toBe(1); // Custo do FLUX Schnell no banco
    expect(job.modelId).toBe("fal-ai/flux/schnell");

    // Verifica que o saldo foi debitado corretamente (100 - 1 = 99)
    const balance = await prisma.creditBalance.findUnique({ where: { userId: testUser.id } });
    expect(balance?.balance).toBe(99);

    // Consulta status do job gerado
    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });
    const getRes = await handleJobStatus(new Request("http://localhost"), {
      params: Promise.resolve({ id: job.id }),
    });
    expect(getRes.status).toBe(200);
    const fetchedJob = await getRes.json();
    expect(fetchedJob.id).toBe(job.id);
  });

  it('deve submeter com sucesso uma geração usando modelo alternativo de alta fidelidade (Recraft V3)', async () => {
    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });

    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: "gerador-imagem",
        modelId: "fal-ai/recraft-v3",
        inputs: {
          prompt: "Design editorial de revista de moda, tipografia elegante, modelo fotorrealista",
          image_size: "square_hd",
          resolution: "1024 x 1024",
          style: "editorial",
          mode: "text-to-image",
        },
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(200);

    const job = await res.json();
    expect(job.modelId).toBe("fal-ai/recraft-v3");
    expect(job.creditCost).toBe(2); // Custo do Recraft V3 no banco

    // Verifica o saldo debitado (99 - 2 = 97)
    const balance = await prisma.creditBalance.findUnique({ where: { userId: testUser.id } });
    expect(balance?.balance).toBe(97);
  });

  it('deve submeter com sucesso uma geração com modo Image-to-Image (imagem de referência e denoise strength)', async () => {
    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });

    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: "gerador-imagem",
        inputs: {
          prompt: "Transforme a imagem em estilo pintura a óleo barroca, textura rica",
          image_size: "portrait_16_9",
          mode: "image-to-image",
          image_url: "https://vorixa.ai/test-reference.jpg",
          strength: 0.65,
        },
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(200);

    const job = await res.json();
    expect(job.id).toBeDefined();

    // Verifica que os inputs gravados contêm image_url e strength
    const savedInputs = await prisma.aIJobInput.findMany({ where: { jobId: job.id } });
    const inputMap = Object.fromEntries(savedInputs.map(i => [i.key, i.value]));

    expect(inputMap.image_url).toBe("https://vorixa.ai/test-reference.jpg");
    expect(inputMap.strength).toBe("0.65");
  });

  it('deve enriquecer e otimizar prompts com estilos visuais específicos via /api/tools/optimize-prompt', async () => {
    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });

    const req = new Request("http://localhost/api/tools/optimize-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Um guerreiro viking no topo de uma montanha",
        enhanceQuality: true,
        toolType: "image",
        style: "cinematic",
      }),
    });

    const res = await handleOptimizePrompt(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.optimizedPrompt).toBeDefined();
    expect(data.optimizedPrompt.length).toBeGreaterThan(15);
  });

  it('deve rejeitar requisição caso o usuário não possua saldo suficiente', async () => {
    // Cria usuário sem saldo
    const brokeUser = await prisma.user.create({
      data: {
        email: `broke_user_${Date.now()}@vorixa.ai`,
        name: 'Broke User',
      },
    });

    await prisma.creditBalance.create({
      data: { userId: brokeUser.id, balance: 0 },
    });

    (auth as any).mockResolvedValueOnce({ user: { id: brokeUser.id } });

    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: "gerador-imagem",
        inputs: { prompt: "Teste de bloqueio por falta de saldo" },
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(400);

    const err = await res.json();
    expect(err.error).toMatch(/saldo|crédito/i);

    // Limpeza
    await prisma.user.delete({ where: { id: brokeUser.id } }).catch(() => {});
  });
});
