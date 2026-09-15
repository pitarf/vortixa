"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MarketplaceModelItem, ModelCategory } from "@/components/models/types";
import { ModelsShowcaseHeader } from "@/components/models/ModelsShowcaseHeader";
import { ModelFilterPills } from "@/components/models/ModelFilterPills";
import { ModelCard } from "@/components/models/ModelCard";
import { ModelDetailModal } from "@/components/models/ModelDetailModal";
import { ModelBookingModal } from "@/components/models/ModelBookingModal";
import { FALLBACK_MARKETPLACE_MODELS } from "@/lib/marketplace-models";
import { AlertTriangle, Layers, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ModelsMarketplacePage() {
  const [models, setModels] = useState<MarketplaceModelItem[]>(FALLBACK_MARKETPLACE_MODELS);
  const [isLoading, setIsLoading] = useState(false);

  // Filtros
  const [selectedType, setSelectedType] = useState<"ALL" | "AI" | "REAL">("ALL");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | ModelCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [includeHot18, setIncludeHot18] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "popular" | "price_asc" | "newest">("featured");

  // Confirmação de Idade (+18)
  const [isAgeVerificationOpen, setIsAgeVerificationOpen] = useState(false);

  // Modais de Detalhe e Proposta de Reserva
  const [selectedModelForDetails, setSelectedModelForDetails] = useState<MarketplaceModelItem | null>(null);
  const [selectedModelForBooking, setSelectedModelForBooking] = useState<MarketplaceModelItem | null>(null);

  // Trava de Scroll do Body quando modal +18 estiver aberto
  useEffect(() => {
    if (isAgeVerificationOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAgeVerificationOpen]);

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
    } catch (err) {
      console.warn("API de modelos offline ou com lentidão, mantendo catálogo local:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [selectedType, selectedCategory, includeHot18]);

  const handleToggleHot18 = () => {
    if (!includeHot18) {
      setIsAgeVerificationOpen(true);
    } else {
      setIncludeHot18(false);
      if (selectedCategory === "HOT_18") {
        setSelectedCategory("ALL");
      }
      toast.info("Conteúdo restrito +18 ocultado com sucesso.");
    }
  };

  const confirmAge = () => {
    setIncludeHot18(true);
    setIsAgeVerificationOpen(false);
    toast.success("Acesso ao casting adulto +18 liberado.");
  };

  // Filtragem e Ordenação no Cliente
  const filteredModels = useMemo(() => {
    let result = [...models];

    if (!includeHot18) {
      result = result.filter((m) => !m.isHot18 && m.category !== "HOT_18");
    }

    if (selectedType !== "ALL") {
      result = result.filter((m) => m.type === selectedType);
    }

    if (selectedCategory !== "ALL") {
      result = result.filter((m) => m.category === selectedCategory);
    }

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

  const totalCount = models.length;
  const aiCount = models.filter((m) => m.type === "AI").length;
  const realCount = models.filter((m) => m.type === "REAL").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-16 px-2 sm:px-4 md:px-6">
      {/* Header Showcase de Alto Padrão */}
      <ModelsShowcaseHeader
        totalCount={totalCount}
        aiCount={aiCount}
        realCount={realCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        includeHot18={includeHot18}
        onToggleHot18={handleToggleHot18}
      />

      {/* Pílulas Deslizantes de Filtros e Categorias */}
      <ModelFilterPills
        selectedType={selectedType}
        onSelectType={setSelectedType}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        includeHot18={includeHot18}
      />

      {/* Grid de Modelos Adaptativo (1 coluna em mobile, 2-3 em tablet, 4-5 em telas ultrawide) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-[#0D0E12] border border-[#1E202E] overflow-hidden animate-pulse flex flex-col"
            >
              <div className="aspect-[3/4] w-full bg-slate-900/60" />
              <div className="p-4 sm:p-5 space-y-3">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800/60 rounded w-full" />
                <div className="h-3 bg-slate-800/40 rounded w-1/2" />
                <div className="h-10 bg-slate-800/80 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#0D0E12] border border-[#1E202E] space-y-4 max-w-xl mx-auto shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-[#1E202E] flex items-center justify-center mx-auto text-slate-500">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">Nenhum modelo encontrado</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Não encontramos talentos correspondentes aos filtros selecionados. Tente ajustar os termos de busca ou alternar a categoria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedType("ALL");
              setSelectedCategory("ALL");
              setSearchQuery("");
            }}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white transition-all shadow-md min-h-[44px] cursor-pointer"
          >
            Limpar Todos os Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
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

      {/* Modal Lookbook de Detalhes do Modelo */}
      <ModelDetailModal
        model={selectedModelForDetails}
        isOpen={!!selectedModelForDetails}
        onClose={() => setSelectedModelForDetails(null)}
        onBookModel={(m) => {
          setSelectedModelForDetails(null);
          setSelectedModelForBooking(m);
        }}
      />

      {/* Modal de Proposta de Contratação / Reserva */}
      <ModelBookingModal
        model={selectedModelForBooking}
        isOpen={!!selectedModelForBooking}
        onClose={() => setSelectedModelForBooking(null)}
      />

      {/* Modal de Confirmação Legal de Maioridade (+18) */}
      {isAgeVerificationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overscroll-contain">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0D0E12] border border-rose-500/30 p-6 sm:p-7 shadow-2xl shadow-rose-950/50 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-white font-heading">
                Confirmação de Maioridade (+18)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Esta seção contém ensaios fotográficos boudoir e personas virtuais destinadas exclusivamente a maiores de 18 anos.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/30 text-[11px] text-rose-300 leading-relaxed">
              Ao prosseguir, você declara sob as penas da lei possuir 18 anos de idade ou mais e concordar com as diretrizes de conteúdo do VORTIXIA.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAgeVerificationOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-[#1E202E] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer min-h-[44px]"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={confirmAge}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer min-h-[44px]"
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
