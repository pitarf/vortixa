import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Provedor de IA
  const provider = await prisma.aIProvider.upsert({
    where: { name: 'fal.ai' },
    update: {},
    create: {
      name: 'fal.ai',
      status: true,
    },
  });

  // 2. Modelos e Ferramentas
  const models = [
    {
      name: 'FLUX Schnell',
      technicalName: 'fal-ai/flux/schnell',
      creditCost: 1,
      apiUnitCost: 0.003,
      toolSlug: 'gerador-imagem',
      toolName: 'Gerador de Imagens',
      toolDesc: 'Geração rápida de imagens realistas via prompt.',
    },
    {
      name: 'Kling 2.1 Pro',
      technicalName: 'fal-ai/kling-video/v2.1/pro/image-to-video',
      creditCost: 15,
      apiUnitCost: 0.20,
      toolSlug: 'imagem-video',
      toolName: 'Imagem para Vídeo (Kling 2.1 Pro)',
      toolDesc: 'Última versão Kling com física realista, fidelidade de movimento e consistência temporal.',
    },
    {
      name: 'Luma Ray 2',
      technicalName: 'fal-ai/luma-dream-machine/ray-2',
      creditCost: 12,
      apiUnitCost: 0.18,
      toolSlug: 'luma-ray-2',
      toolName: 'Luma Ray 2',
      toolDesc: 'Nova geração Luma Ray 2 de alta coerência dinâmica e controle de câmera 3D.',
    },
    {
      name: 'Wan 2.1 High-Motion',
      technicalName: 'fal-ai/wan-i2v',
      creditCost: 10,
      apiUnitCost: 0.12,
      toolSlug: 'wan-video',
      toolName: 'Wan 2.1 Video',
      toolDesc: 'Modelo Wan 2.1 de altíssima fluidez de movimento corporal e grande estabilidade visual.',
    },
    {
      name: 'Hailuo Minimax 01 Live',
      technicalName: 'fal-ai/minimax/video-01-live',
      creditCost: 12,
      apiUnitCost: 0.15,
      toolSlug: 'minimax-live',
      toolName: 'Hailuo Minimax 01 Live',
      toolDesc: 'Versão Live de ponta com expressões humanas ultrarrealistas e sem artefatos.',
    },
    {
      name: 'Kling Image to Video',
      technicalName: 'fal-ai/kling/video-generation/image-to-video',
      creditCost: 10,
      apiUnitCost: 0.15,
      toolSlug: 'kling-v1-video',
      toolName: 'Imagem para Vídeo Kling v1.5',
      toolDesc: 'Geração ágil de vídeo dinâmico a partir de imagens.',
    },
    {
      name: 'Kling Motion Control',
      technicalName: 'fal-ai/kling/motion-control',
      creditCost: 15,
      apiUnitCost: 0.25,
      toolSlug: 'motion-control',
      toolName: 'Motion Control',
      toolDesc: 'Controle de movimento de personagem via vídeo de referência.',
    },
    {
      name: 'Sync Lip Sync',
      technicalName: 'fal-ai/sync',
      creditCost: 8,
      apiUnitCost: 0.08,
      toolSlug: 'lip-sync',
      toolName: 'Sincronização Labial',
      toolDesc: 'Sincronização de fala e lábios perfeita a partir de áudio.',
    },
    {
      name: 'Creative Video Upscaler',
      technicalName: 'fal-ai/creative-upscaler',
      creditCost: 5,
      apiUnitCost: 0.05,
      toolSlug: 'upscale',
      toolName: 'Upscale de Vídeo',
      toolDesc: 'Aumente a resolução de seus vídeos criados.',
    },
    {
      name: 'FLUX Dev',
      technicalName: 'fal-ai/flux/dev',
      creditCost: 2,
      apiUnitCost: 0.025,
      toolSlug: 'gerador-imagem-dev',
      toolName: 'Gerador de Imagens Dev',
      toolDesc: 'Geração de alta precisão e detalhamento com FLUX Dev.',
    },
    {
      name: 'Recraft V3',
      technicalName: 'fal-ai/recraft-v3',
      creditCost: 2,
      apiUnitCost: 0.04,
      toolSlug: 'gerador-imagem-recraft',
      toolName: 'Recraft V3 Design',
      toolDesc: 'Design vetorial, ilustrações e imagens de marca de alta fidelidade.',
    },
    {
      name: 'FLUX.1 Pro Ultra',
      technicalName: 'fal-ai/flux-pro/v1.1-ultra',
      creditCost: 4,
      apiUnitCost: 0.06,
      toolSlug: 'gerador-imagem-ultra',
      toolName: 'FLUX.1 Pro Ultra',
      toolDesc: 'Qualidade fotográfica máxima de cinema até resolução 4K.',
    },
    {
      name: 'Google Imagen 3 (Gemini Pro)',
      technicalName: 'fal-ai/nano-banana-pro',
      creditCost: 3,
      apiUnitCost: 0.04,
      toolSlug: 'gerador-imagem-imagen3',
      toolName: 'Google Imagen 3',
      toolDesc: 'Fotorrealismo humano extremo, cenografia urbana rica e tipografia nítida.',
    },
    {
      name: 'Kling 1.5 Pro',
      technicalName: 'fal-ai/kling/video-generation/v1-5/pro',
      creditCost: 15,
      apiUnitCost: 0.20,
      toolSlug: 'kling-pro-video',
      toolName: 'Kling 1.5 Pro',
      toolDesc: 'Geração de vídeo de altíssima definição com física realista.',
    },
    {
      name: 'Luma Dream Machine',
      technicalName: 'fal-ai/luma-dream-machine',
      creditCost: 12,
      apiUnitCost: 0.18,
      toolSlug: 'luma-dream-machine',
      toolName: 'Luma Dream Machine',
      toolDesc: 'Dinâmicas de câmera 3D com transições fluidas.',
    },
    {
      name: 'Hailuo Minimax Video',
      technicalName: 'fal-ai/minimax-video',
      creditCost: 10,
      apiUnitCost: 0.15,
      toolSlug: 'minimax-video',
      toolName: 'Hailuo Minimax Video',
      toolDesc: 'Expressões faciais vivas e movimentos humanos realistas.',
    },
    {
      name: 'Sync Audio v2',
      technicalName: 'fal-ai/sync-v2',
      creditCost: 8,
      apiUnitCost: 0.08,
      toolSlug: 'sync-v2',
      toolName: 'Sync Audio v2',
      toolDesc: 'Sincronização fonética precisa de múltiplos idiomas.',
    },
  ];

  for (const m of models) {
    const model = await prisma.aIModel.upsert({
      where: { id: m.technicalName },
      create: {
        id: m.technicalName,
        providerId: provider.id,
        name: m.name,
        technicalName: m.technicalName,
        creditCost: m.creditCost,
        apiUnitCost: m.apiUnitCost,
        status: true,
      },
      update: {
        creditCost: m.creditCost,
        apiUnitCost: m.apiUnitCost,
      },
    });

    await prisma.aITool.upsert({
      where: { slug: m.toolSlug },
      create: {
        modelId: model.id,
        name: m.toolName,
        description: m.toolDesc,
        slug: m.toolSlug,
        status: true,
      },
      update: {
        modelId: model.id,
        name: m.toolName,
      },
    });
  }

  // 3. Pacotes de Créditos
  const packages = [
    { id: 'pkg-100', name: 'Iniciante', description: 'Ideal para testes rápidos.', credits: 100, priceCents: 1990, bonus: 0, order: 1 },
    { id: 'pkg-500', name: 'Profissional', description: 'Nosso pacote mais vendido.', credits: 500, priceCents: 7990, bonus: 50, order: 2 },
    { id: 'pkg-1000', name: 'Criador', description: 'Para quem precisa de alta escala.', credits: 1000, priceCents: 14990, bonus: 150, order: 3 },
  ];

  for (const p of packages) {
    await prisma.creditPackage.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        name: p.name,
        description: p.description,
        credits: p.credits,
        priceCents: p.priceCents,
        bonusCredits: p.bonus,
        status: true,
        displayOrder: p.order,
      },
      update: {
        name: p.name,
        credits: p.credits,
        priceCents: p.priceCents,
        bonusCredits: p.bonus,
      },
    });
  }

  console.log('Seed do banco executado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
