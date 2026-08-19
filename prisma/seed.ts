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
      name: 'Kling Image to Video',
      technicalName: 'fal-ai/kling/video-generation/image-to-video',
      creditCost: 10,
      apiUnitCost: 0.15,
      toolSlug: 'imagem-video',
      toolName: 'Imagem para Vídeo',
      toolDesc: 'Transforme qualquer imagem em vídeo dinâmico.',
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
