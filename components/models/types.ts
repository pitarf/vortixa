import { ModelType, ModelCategory } from "@prisma/client";

export type { ModelType, ModelCategory };

export interface MarketplaceModelItem {
  id: string;
  name: string;
  slug: string;
  type: ModelType;
  category: ModelCategory;
  bio?: string | null;
  avatarUrl: string;
  coverUrl?: string | null;
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
  createdAt?: string | Date;
  _count?: {
    bookings: number;
  };
}

export interface ModelFilterState {
  type: "ALL" | "AI" | "REAL";
  category: "ALL" | ModelCategory;
  search: string;
  includeHot18: boolean;
  sortBy: "featured" | "popular" | "price_asc" | "newest";
}

export const CATEGORY_LABELS: Record<ModelCategory, { label: string; icon: string }> = {
  FASHION: { label: "Moda & Editorial", icon: "✨" },
  COMMERCIAL: { label: "Comercial & Ads", icon: "💼" },
  FITNESS: { label: "Fitness & Wellness", icon: "💪" },
  LIFESTYLE: { label: "Lifestyle", icon: "🌿" },
  CORPORATE: { label: "Corporativo & B2B", icon: "👔" },
  AVATAR: { label: "Avatares Digitais", icon: "🎭" },
  GAMES: { label: "Games & Sci-Fi", icon: "🎮" },
  HOT_18: { label: "Conteúdo +18 (Hot)", icon: "🔥" },
};