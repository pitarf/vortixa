import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function queryOutputs() {
  const jobs = await prisma.aIJob.findMany({
    where: {
      status: 'COMPLETED',
      tool: {
        slug: {
          notIn: ['hot-generator', 'hot', 'hot-video']
        }
      }
    },
    include: {
      tool: true,
      model: true,
      outputs: true,
      inputs: true
    },
    orderBy: { createdAt: 'desc' },
    take: 40
  });

  console.log('JOBS_FOUND:', jobs.length);
  const mediaList = [];

  for (const j of jobs) {
    // Filtrar se o prompt contiver termos do nicho hot
    const promptInput = j.inputs.find(i => i.key === 'prompt');
    const prompt = promptInput?.value || '';
    const lowerPrompt = prompt.toLowerCase();
    const isHot = lowerPrompt.includes('hot') || lowerPrompt.includes('sensual') || lowerPrompt.includes('bikini') || lowerPrompt.includes('lingerie') || lowerPrompt.includes('erotic') || lowerPrompt.includes('nude');
    
    if (isHot) continue;

    for (const out of j.outputs) {
      const isVideo = out.fileUrl.endsWith('.mp4') || out.fileUrl.endsWith('.webm');
      mediaList.push({
        id: j.id,
        toolSlug: j.tool.slug,
        toolName: j.tool.name,
        modelName: j.model.name,
        prompt: prompt.slice(0, 150),
        url: out.fileUrl,
        type: isVideo ? 'video' : 'image',
        createdAt: j.createdAt
      });
    }
  }

  console.log('CLEAN_MEDIA_COUNT:', mediaList.length);
  console.log(JSON.stringify(mediaList.slice(0, 15), null, 2));
}

queryOutputs()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
