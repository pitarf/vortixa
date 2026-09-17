import { PrismaClient, ModelType, ModelCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export interface SeedModelData {
  name: string;
  slug: string;
  type: ModelType;
  category: ModelCategory;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  gallery: string[];
  tags: string[];
  promptTrigger?: string | null;
  referenceFaceUrl?: string | null;
  loraModelId?: string | null;
  instagramHandle?: string | null;
  location?: string | null;
  contactEmail?: string | null;
  bookingPriceCents?: number | null;
  creditsPricePerGen: number;
  status: boolean;
  isFeatured: boolean;
  isHot18: boolean;
}

import { FALLBACK_MARKETPLACE_MODELS } from '../lib/marketplace-models';

export const seedModels: SeedModelData[] = FALLBACK_MARKETPLACE_MODELS.map((m) => ({
  name: m.name,
  slug: m.slug,
  type: m.type as ModelType,
  category: m.category as ModelCategory,
  bio: m.bio || '',
  avatarUrl: m.avatarUrl,
  coverUrl: m.coverUrl || m.avatarUrl,
  gallery: m.gallery || [m.coverUrl || m.avatarUrl],
  tags: m.tags,
  promptTrigger: m.promptTrigger || null,
  referenceFaceUrl: m.referenceFaceUrl || null,
  loraModelId: m.loraModelId || null,
  instagramHandle: m.instagramHandle || null,
  location: m.location || null,
  contactEmail: m.contactEmail || null,
  bookingPriceCents: m.bookingPriceCents || null,
  creditsPricePerGen: m.creditsPricePerGen || 5,
  status: m.status ?? true,
  isFeatured: m.isFeatured ?? false,
  isHot18: m.isHot18 ?? false,
}));

export async function seedMarketplaceModels() {
  console.log("🚀 Iniciando seed e sincronização oficial de modelos para o Marketplace VORIXA...");

  for (const m of seedModels) {
    const upserted = await prisma.marketplaceModel.upsert({
      where: { slug: m.slug },
      create: { ...m },
      update: {
        name: m.name,
        type: m.type,
        category: m.category,
        bio: m.bio,
        avatarUrl: m.avatarUrl,
        coverUrl: m.coverUrl,
        gallery: m.gallery,
        tags: m.tags,
        promptTrigger: m.promptTrigger,
        referenceFaceUrl: m.referenceFaceUrl,
        loraModelId: m.loraModelId,
        instagramHandle: m.instagramHandle,
        location: m.location,
        contactEmail: m.contactEmail,
        bookingPriceCents: m.bookingPriceCents,
        creditsPricePerGen: m.creditsPricePerGen,
        status: m.status,
        isFeatured: m.isFeatured,
        isHot18: m.isHot18,
      },
    });
    console.log(`  ✓ Modelo registrado/atualizado: ${upserted.name} (${upserted.type} - ${upserted.category})`);
  }

  // Remove modelos órfãos/antigos que não constam na lista oficial
  const officialSlugs = seedModels.map((s) => s.slug);
  const deleted = await prisma.marketplaceModel.deleteMany({
    where: {
      slug: { notIn: officialSlugs },
    },
  });
  if (deleted.count > 0) {
    console.log(`  🧹 Removidos ${deleted.count} modelos legados/duplicados fora do catálogo oficial.`);
  }

  const total = await prisma.marketplaceModel.count();
  console.log(`✨ Seed concluído com sucesso! Total consolidado no banco: ${total} modelos.`);
}

async function main() {
  await seedMarketplaceModels();
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error("Erro no seed de modelos:", e);
      process.exit(1);
    })
    .finally(async () => {
      await pool.end();
    });
}
