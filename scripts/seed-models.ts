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

export const seedModels: SeedModelData[] = [
  {
    name: "Elena Vance",
    slug: "elena-vance",
    type: ModelType.AI,
    category: ModelCategory.FASHION,
    bio: "Modelo editorial de alta costura com traços escandinavos e presença marcante em passarelas europeias virtuais.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Fashion", "Editorial", "Vogue", "Runway", "Haute Couture"],
    promptTrigger: "elena vance fashion model, striking blue eyes, blonde hair, chic vogue editorial portrait, ultra realistic 8k",
    referenceFaceUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    loraModelId: "lora_elena_vance_v2",
    instagramHandle: "@elenavance.ai",
    location: "Paris, França",
    contactEmail: "booking@elenavance.ai",
    bookingPriceCents: null,
    creditsPricePerGen: 5,
    status: true,
    isFeatured: true,
    isHot18: false,
  },
  {
    name: "Lucas Alencar",
    slug: "lucas-alencar",
    type: ModelType.AI,
    category: ModelCategory.FITNESS,
    bio: "Atleta e modelo fitness focado em campanhas esportivas, suplementos e estilo de vida ativo e saudável.",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Fitness", "Men", "Sports", "Athletic", "Gym"],
    promptTrigger: "lucas alencar athletic male model, defined jawline, athletic physique, gym lighting, high contrast commercial photography",
    referenceFaceUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    loraModelId: "lora_lucas_fit_v1",
    instagramHandle: "@lucas.alencar_fit",
    location: "São Paulo, Brasil",
    contactEmail: "lucas@vorixa.models",
    bookingPriceCents: null,
    creditsPricePerGen: 5,
    status: true,
    isFeatured: true,
    isHot18: false,
  },
  {
    name: "Aria Cyber",
    slug: "aria-cyber",
    type: ModelType.AI,
    category: ModelCategory.GAMES,
    bio: "Visual cyberpunk futurista, ideal para campanhas gamers, sci-fi, interfaces de tecnologia e universo tech.",
    avatarUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Cyberpunk", "Gaming", "Futuristic", "Sci-Fi", "Neon"],
    promptTrigger: "aria cyber futuristic female character, neon reflection, cyberpunk city backdrop, holographic implants, hyper-detailed render",
    referenceFaceUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    loraModelId: "lora_aria_cyber_v3",
    instagramHandle: "@aria.cyber.core",
    location: "Neo Tóquio, Metaverso",
    contactEmail: "aria@neocyber.ai",
    bookingPriceCents: null,
    creditsPricePerGen: 8,
    status: true,
    isFeatured: true,
    isHot18: false,
  },
  {
    name: "Chloe Sweet",
    slug: "chloe-sweet",
    type: ModelType.AI,
    category: ModelCategory.LIFESTYLE,
    bio: "Estilo jovial, natural e caloroso para marcas de moda casual, skincare, café da manhã e rotinas cotidianas.",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Lifestyle", "Natural", "Skincare", "Influencer", "Casual"],
    promptTrigger: "chloe sweet natural smile, warm sunlight, golden hour, casual cozy outfit, portrait photography 35mm lens",
    referenceFaceUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    loraModelId: "lora_chloe_sweet_v1",
    instagramHandle: "@chloesweet.life",
    location: "Florianópolis, Brasil",
    contactEmail: "collab@chloesweet.ai",
    bookingPriceCents: null,
    creditsPricePerGen: 5,
    status: true,
    isFeatured: false,
    isHot18: false,
  },
  {
    name: "Valentina Noir",
    slug: "valentina-noir",
    type: ModelType.AI,
    category: ModelCategory.HOT_18,
    bio: "Sensualidade refinada, glamour noturno e estética noir boudoir. Exclusivo para marcas adultas e campanhas intimistas.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Hot 18+", "Boudoir", "Glamour", "Intimate", "Sensual"],
    promptTrigger: "valentina noir sensual dark portrait, moody dim atmospheric lighting, silky black lingerie, elegant erotic allure, cinematic 8k",
    referenceFaceUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    loraModelId: "lora_valentina_noir_v2",
    instagramHandle: "@valentina.noir.vip",
    location: "Milão, Itália",
    contactEmail: "contact@valentinanoir.com",
    bookingPriceCents: null,
    creditsPricePerGen: 10,
    status: true,
    isFeatured: true,
    isHot18: true,
  },
  {
    name: "Mariana Rios",
    slug: "mariana-rios-real",
    type: ModelType.REAL,
    category: ModelCategory.COMMERCIAL,
    bio: "Modelo e atriz comercial profissional com mais de 8 anos de experiência em gravações de comerciais de TV e campanhas digitais no Brasil.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Comercial", "Atriz", "Publicidade", "TV", "Campanhas"],
    promptTrigger: null,
    referenceFaceUrl: null,
    loraModelId: null,
    instagramHandle: "@marianarios.real",
    location: "São Paulo, SP - Brasil",
    contactEmail: "agenciamento@marianarios.com.br",
    bookingPriceCents: 450000, // R$ 4.500,00 por diária
    creditsPricePerGen: 5,
    status: true,
    isFeatured: true,
    isHot18: false,
  },
  {
    name: "Rodrigo Santoro Fake/Test",
    slug: "rodrigo-santoro-real",
    type: ModelType.REAL,
    category: ModelCategory.FASHION,
    bio: "Modelo masculino sênior para alfaiataria, relógios de luxo, fragrâncias masculinas e campanhas de prestígio internacional.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Moda Masculina", "Luxo", "Suits", "Editorial Masculino", "Internacional"],
    promptTrigger: null,
    referenceFaceUrl: null,
    loraModelId: null,
    instagramHandle: "@rodrigo.model.oficial",
    location: "Rio de Janeiro, RJ - Brasil",
    contactEmail: "contato@rodrigomodel.com",
    bookingPriceCents: 600000, // R$ 6.000,00 por diária
    creditsPricePerGen: 5,
    status: true,
    isFeatured: true,
    isHot18: false,
  },
  {
    name: "Gabriel Ramos",
    slug: "gabriel-ramos",
    type: ModelType.AI,
    category: ModelCategory.CORPORATE,
    bio: "Executivo corporativo moderno, perfil confiável para apresentações de negócios, finanças, startups e tecnologia B2B.",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Corporate", "Executive", "Business", "B2B", "Fintech"],
    promptTrigger: "gabriel ramos corporate executive in sharp navy suit, clean boardroom backdrop, confident professional posture, 8k business portrait",
    referenceFaceUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    loraModelId: "lora_gabriel_corp_v1",
    instagramHandle: "@gabriel.exec.ai",
    location: "Nova York, EUA",
    contactEmail: "gabriel@vorixa.models",
    bookingPriceCents: null,
    creditsPricePerGen: 5,
    status: true,
    isFeatured: false,
    isHot18: false,
  },
  {
    name: "Beatriz Nogueira",
    slug: "beatriz-nogueira-real",
    type: ModelType.REAL,
    category: ModelCategory.LIFESTYLE,
    bio: "Criadora de conteúdo e modelo de lifestyle sustentável, com forte apelo em campanhas ecológicas, cosméticos limpos e viagens.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["Eco-friendly", "Viagens", "Lifestyle", "Influenciadora", "Sustentável"],
    promptTrigger: null,
    referenceFaceUrl: null,
    loraModelId: null,
    instagramHandle: "@bea.nogueira.eco",
    location: "Belo Horizonte, MG - Brasil",
    contactEmail: "assessoria@beatriznogueira.com.br",
    bookingPriceCents: 320000, // R$ 3.200,00 por diária
    creditsPricePerGen: 5,
    status: true,
    isFeatured: false,
    isHot18: false,
  }
];

export async function seedMarketplaceModels() {
  console.log("🚀 Iniciando seed de modelos para o Marketplace VORIXA...");

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

  console.log("✨ Seed de modelos concluído com sucesso!");
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
