require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Sincronizando Modelos do Marketplace com o PostgreSQL ---');
  
  const tsContent = fs.readFileSync(path.join(__dirname, '../lib/marketplace-models.ts'), 'utf-8');
  
  // Extrai o array JSON dentro de FALLBACK_MARKETPLACE_MODELS
  const assignIdx = tsContent.indexOf('= [');
  if (assignIdx === -1) {
    throw new Error('Não foi possível localizar FALLBACK_MARKETPLACE_MODELS em lib/marketplace-models.ts');
  }
  const arrayStart = assignIdx + 2;
  const arrayEnd = tsContent.lastIndexOf(']');
  if (arrayEnd === -1) {
    throw new Error('Não foi possível localizar final do array em lib/marketplace-models.ts');
  }
  
  const jsonStr = tsContent.substring(arrayStart, arrayEnd + 1);
  const models = JSON.parse(jsonStr);
  
  console.log(`Encontrados ${models.length} modelos para sincronização.`);
  
  let synced = 0;
  for (const m of models) {
    await prisma.marketplaceModel.upsert({
      where: { slug: m.slug },
      update: {
        name: m.name,
        type: m.type,
        category: m.category,
        bio: m.bio,
        avatarUrl: m.avatarUrl,
        coverUrl: m.coverUrl,
        gallery: m.gallery || [],
        tags: m.tags || [],
        promptTrigger: m.promptTrigger,
        referenceFaceUrl: m.referenceFaceUrl,
        loraModelId: m.loraModelId,
        instagramHandle: m.instagramHandle,
        location: m.location,
        bookingPriceCents: m.bookingPriceCents || null,
        creditsPricePerGen: m.creditsPricePerGen || 5,
        status: m.status !== false,
        isFeatured: Boolean(m.isFeatured),
        isHot18: Boolean(m.isHot18),
      },
      create: {
        id: m.id,
        name: m.name,
        slug: m.slug,
        type: m.type,
        category: m.category,
        bio: m.bio,
        avatarUrl: m.avatarUrl,
        coverUrl: m.coverUrl,
        gallery: m.gallery || [],
        tags: m.tags || [],
        promptTrigger: m.promptTrigger,
        referenceFaceUrl: m.referenceFaceUrl,
        loraModelId: m.loraModelId,
        instagramHandle: m.instagramHandle,
        location: m.location,
        bookingPriceCents: m.bookingPriceCents || null,
        creditsPricePerGen: m.creditsPricePerGen || 5,
        status: m.status !== false,
        isFeatured: Boolean(m.isFeatured),
        isHot18: Boolean(m.isHot18),
      },
    });
    synced++;
    console.log(`[${synced}/${models.length}] Sincronizado: ${m.name} (${m.slug})`);
  }
  
  const totalInDb = await prisma.marketplaceModel.count();
  console.log(`\nSincronização concluída com sucesso! Total no banco: ${totalInDb} modelos.`);
}

main()
  .catch((err) => {
    console.error('Erro na sincronização:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
