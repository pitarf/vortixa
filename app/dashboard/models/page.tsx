"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MarketplaceModelItem, ModelCategory } from "@/components/models/types";
import { ModelsShowcaseHeader } from "@/components/models/ModelsShowcaseHeader";
import { ModelFilterPills } from "@/components/models/ModelFilterPills";
import { ModelCard } from "@/components/models/ModelCard";
import { ModelDetailModal } from "@/components/models/ModelDetailModal";
import { ModelBookingModal } from "@/components/models/ModelBookingModal";
import { AlertTriangle, RefreshCw, Layers } from "lucide-react";
import { toast } from "sonner";

// Fallback inicial estático de modelos para carregamento instantâneo offline ou sem banco rodando
const FALLBACK_MODELS: MarketplaceModelItem[] = [
  {
    id: "model_elena_vance",
    name: "Elena Vance",
    slug: "elena-vance",
    type: "AI",
    category: "FASHION",
    bio: "Modelo editorial de alta costura com traços escandinavos e presença marcante em passarelas europeias virtuais.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
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
    _count: { bookings: 28 },
  },
  {
    id: "model_mariana_rios",
    name: "Mariana Rios",
    slug: "mariana-rios-real",
    type: "REAL",
    category: "COMMERCIAL",
    bio: "Modelo e atriz comercial profissional com mais de 8 anos de experiência em gravações de comerciais de TV e campanhas digitais no Brasil.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Comercial", "Atriz", "Publicidade", "TV", "Campanhas"],
    promptTrigger: null,
    referenceFaceUrl: null,
    loraModelId: null,
    instagramHandle: "@marianarios.real",
    location: "São Paulo, SP - Brasil",
    contactEmail: "agenciamento@marianarios.com.br",
    bookingPriceCents: 450000,
    creditsPricePerGen: 5,
    status: true,
    isFeatured: true,
    isHot18: false,
    _count: { bookings: 34 },
  },
  {
    id: "model_lucas_alencar",
    name: "Lucas Alencar",
    slug: "lucas-alencar",
    type: "AI",
    category: "FITNESS",
    bio: "Atleta e modelo fitness focado em campanhas esportivas, suplementos e estilo de vida ativo e saudável.",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
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
    _count: { bookings: 19 },
  },
  {
    id: "model_rodrigo_santoro",
    name: "Rodrigo Santoro",
    slug: "rodrigo-santoro-real",
    type: "REAL",
    category: "FASHION",
    bio: "Modelo masculino sênior para alfaiataria, relógios de luxo, fragrâncias masculinas e campanhas de prestígio internacional.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Moda Masculina", "Luxo", "Suits", "Editorial Masculino"],
    promptTrigger: null,
    referenceFaceUrl: null,
    loraModelId: null,
    instagramHandle: "@rodrigo.model.oficial",
    location: "Rio de Janeiro, RJ - Brasil",
    contactEmail: "contato@rodrigomodel.com",
    bookingPriceCents: 600000,
    creditsPricePerGen: 5,
    status: true,
    isFeatured: true,
    isHot18: false,
    _count: { bookings: 22 },
  },
  {
    id: "model_aria_cyber",
    name: "Aria Cyber",
    slug: "aria-cyber",
    type: "AI",
    category: "GAMES",
    bio: "Visual cyberpunk futurista, ideal para campanhas gamers, sci-fi, interfaces de tecnologia e universo tech.",
    avatarUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
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
    _count: { bookings: 45 },
  },
  {
    id: "model_beatriz_nogueira",
    name: "Beatriz Nogueira",
    slug: "beatriz-nogueira-real",
    type: "REAL",
    category: "LIFESTYLE",
    bio: "Criadora de conteúdo e modelo de lifestyle sustentável, com forte apelo em campanhas ecológicas, cosméticos limpos e viagens.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Eco-friendly", "Viagens", "Lifestyle", "Influenciadora", "Sustentável"],
    promptTrigger: null,
    referenceFaceUrl: null,
    loraModelId: null,
    instagramHandle: "@bea.nogueira.eco",
    location: "Belo Horizonte, MG - Brasil",
    contactEmail: "assessoria@beatriznogueira.com.br",
    bookingPriceCents: 320000,
    creditsPricePerGen: 5,
    status: true,
    isFeatured: false,
    isHot18: false,
    _count: { bookings: 12 },
  },
  {
    id: "model_valentina_noir",
    name: "Valentina Noir",
    slug: "valentina-noir",
    type: "AI",
    category: "HOT_18",
    bio: "Sensualidade refinada, glamour noturno e estética noir boudoir. Exclusivo para marcas adultas e campanhas intimistas.",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    coverUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80",
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
    _count: { bookings: 53 },
  },
];

export default function ModelsMarketplacePage() {
  const [models, setModels] = useState<MarketplaceModelItem[]>(FALLBACK_MODELS);
  const [isLoading, setIsLoading] = useState(false);

  // Filtros
  const [selectedType, setSelectedType] = useState<"ALL" | "AI" | "REAL">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | ModelCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [includeHot18, setIncludeHot18] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "popular" | "price_asc" | "newest">("featured");

  // Confirmação de Idade +18
  const [isAgeVerificationOpen, setIsAgeVerificationOpen] = useState(false);

  // Modais de Detalhes e Reserva
  const [selectedModelForDetails, setSelectedModelForDetails] = useState<MarketplaceModelItem | null>(null);
  const [selectedModelForBooking, setSelectedModelForBooking] = useState<MarketplaceModelItem | null>(null);

  // Carrega modelos da API `/api/models`
  const fetchModels = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedType !== "ALL") params.set("type", selectedType);
      if (selectedCategory !== "ALL") params.set("category", selectedCategory);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (includeHot18) params.set("includeHot18", "true");
      params.set("limit", "50");

      const res = await fetch(`/api/models?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.models && Array.isArray(data.models) && data.models.length > 0) {
          setModels(data.models);
          return;
        }
      }
      // Se não houver retorno do backend, mantém os fallbacks filtrados
    } catch (err) {
      console.warn("Falha ao buscar modelos na API, usando cache local:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [selectedType, selectedCategory, includeHot18]);

  // Handler de Toggle +18 com verificação de idade
  const handleToggleHot18 = () => {
    if (!includeHot18) {
      // Abre modal de confirmação de maioridade
      setIsAgeVerificationOpen(true);
    } else {
      setIncludeHot18(false);
      if (selectedCategory === "HOT_18") {
        setSelectedCategory("ALL");
      }
      toast.info("Conteúdo +18 ocultado com sucesso.");
    }
  };

  const confirmAge = () => {
    setIncludeHot18(true);
    setIsAgeVerificationOpen(false);
    toast.success("Acesso ao catálogo +18 liberado.");
  };

  // Filtragem e ordenação no cliente
  const filteredModels = useMemo(() => {
    let result = [...models];

    // Oculta +18 se desativado
    if (!includeHot18) {
      result = result.filter((m) => !m.isHot18 && m.category !== "HOT_18");
    }

    // Filtro por tipo
    if (selectedType !== "ALL") {
      result = result.filter((m) => m.type === selectedType);
    }

    // Filtro por categoria
    if (selectedCategory !== "ALL") {
      result = result.filter((m) => m.category === selectedCategory);
    }

    // Busca textual por nome, bio ou tags
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.bio && m.bio.toLowerCase().includes(q)) ||
          m.tags.some((t) => t.toLowerCase().includes(q)) ||
          (m.location && m.location.toLowerCase().includes(q))
      );
    }

    // Ordenação
    result.sort((a, b) => {
      if (sortBy === "featured") {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      }
      if (sortBy === "popular") {
        const aBookings = a._count?.bookings || 0;
        const bBookings = b._count?.bookings || 0;
        return bBookings - aBookings;
      }
      if (sortBy === "price_asc") {
        const aVal = a.type === "AI" ? a.creditsPricePerGen : (a.bookingPriceCents || 99999999);
        const bVal = b.type === "AI" ? b.creditsPricePerGen : (b.bookingPriceCents || 99999999);
        return aVal - bVal;
      }
      return 0;
    });

    return result;
  }, [models, includeHot18, selectedType, selectedCategory, searchQuery, sortBy]);

  // Contagens para o cabeçalho
  const totalCount = models.length;
  const aiCount = models.filter((m) => m.type === "AI").length;
  const realCount = models.filter((m) => m.type === "REAL").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Banner Superior com Métricas e Busca */}
      <ModelsShowcaseHeader
        totalCount={totalCount}
        aiCount={aiCount}
        realCount={realCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        includeHot18={includeHot18}
        onToggleHot18={handleToggleHot18}
      />

      {/* Pílulas Deslizantes de Filtro e Ordenação */}
      <ModelFilterPills
        selectedType={selectedType}
        onSelectType={setSelectedType}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        includeHot18={includeHot18}
      />

      {/* Grid de Modelos */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
          <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
          <span>Carregando vitrine de modelos...</span>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0D0E12] border border-[#1E202E] space-y-3">
          <Layers className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum modelo encontrado</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Tente ajustar os filtros, desativar a busca por texto ou alternar entre Modelos de IA e Modelos Reais.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedType("ALL");
              setSelectedCategory("ALL");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onOpenDetails={setSelectedModelForDetails}
              onBookModel={setSelectedModelForBooking}
            />
          ))}
        </div>
      )}

      {/* Modal de Detalhes & Portfólio */}
      <ModelDetailModal
        model={selectedModelForDetails}
        isOpen={!!selectedModelForDetails}
        onClose={() => setSelectedModelForDetails(null)}
        onBookModel={(m) => {
          setSelectedModelForDetails(null);
          setSelectedModelForBooking(m);
        }}
      />

      {/* Modal de Reserva / Proposta */}
      <ModelBookingModal
        model={selectedModelForBooking}
        isOpen={!!selectedModelForBooking}
        onClose={() => setSelectedModelForBooking(null)}
      />

      {/* Modal de Verificação de Idade (+18) */}
      {isAgeVerificationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0D0E12] border border-rose-500/30 p-6 sm:p-7 shadow-2xl shadow-rose-950/50 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white font-heading">
                Confirmação de Maioridade (+18)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Esta seção contém modelos, ensaios boudoir e personagens virtuais destinados exclusivamente a maiores de 18 anos.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/30 text-[11px] text-rose-300 leading-relaxed">
              Ao prosseguir, você declara sob as penas da lei ter 18 anos de idade ou mais e concordar com os Termos de Uso do VORIXA.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsAgeVerificationOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#1E202E] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                style={{ minHeight: "44px" }}
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={confirmAge}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                style={{ minHeight: "44px" }}
              >
                Tenho 18 anos ou mais
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}