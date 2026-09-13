"use client";

import React, { useState, useEffect } from "react";
import { MarketplaceModelItem, CATEGORY_LABELS } from "@/components/models/types";
import { FALLBACK_MARKETPLACE_MODELS } from "@/lib/marketplace-models";
import { X, Search, Sparkles, User, ExternalLink } from "lucide-react";

export interface QuickModelPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (model: MarketplaceModelItem) => void;
  activeModelId?: string | null;
}

export function QuickModelPickerModal({
  isOpen,
  onClose,
  onSelectModel,
  activeModelId,
}: QuickModelPickerModalProps) {
  const [models, setModels] = useState<MarketplaceModelItem[]>(FALLBACK_MARKETPLACE_MODELS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "AI" | "REAL">("ALL");

  // Bloqueio do Scroll de Fundo ao Abrir o Modal
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchModels() {
      try {
        const res = await fetch("/api/models?limit=50");
        if (res.ok) {
          const data = await res.json();
          if (data.models && Array.isArray(data.models) && data.models.length > 0) {
            setModels(data.models);
          }
        }
      } catch (err) {
        console.warn("Usando catálogo de modelos em cache local:", err);
      }
    }

    fetchModels();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredModels = models.filter((m) => {
    if (typeFilter !== "ALL" && m.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchBio = m.bio?.toLowerCase().includes(q);
      const matchTags = m.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl overscroll-contain animate-in fade-in duration-200">
      <div
        className="relative w-full sm:max-w-4xl h-[100dvh] sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-3xl bg-[#0E1017] border-0 sm:border border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Glows Decorativos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Header do Modal com Suporte a Safe-Area do Topo */}
        <div className="p-3.5 sm:p-5 border-b border-white/[0.08] flex items-center justify-between gap-3 relative z-10 bg-[#0E1017]/95 shrink-0 pt-[max(0.875rem,env(safe-area-inset-top))] sm:pt-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/25 text-xl shrink-0">
              🎭
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 tracking-tight">
                <span>Casting & Vitrine de Modelos</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25 shrink-0">
                  {models.length} disponíveis
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Selecione uma identidade fixa para injetar consistência facial na sua criação atual.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-[#13141B] border border-white/[0.08] hover:border-slate-500 text-slate-400 hover:text-white transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            aria-label="Fechar seletor rápido de modelos"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filtros e Barra de Pesquisa */}
        <div className="p-3 sm:p-4 border-b border-white/[0.08] bg-[#070709]/70 flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-center justify-between shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, categoria ou estilo..."
              className="w-full bg-[#0E1017] border border-white/[0.08] rounded-xl pl-10 pr-8 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500/80 transition-colors min-h-[44px]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar touch-pan-x pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setTypeFilter("ALL")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
                typeFilter === "ALL"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                  : "bg-[#0E1017] border border-white/[0.08] text-slate-400 hover:text-white"
              }`}
            >
              Todos ({models.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("AI")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap min-h-[44px] ${
                typeFilter === "AI"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                  : "bg-[#0E1017] border border-white/[0.08] text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-200" />
              <span>Modelos IA</span>
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("REAL")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap min-h-[44px] ${
                typeFilter === "REAL"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/25"
                  : "bg-[#0E1017] border border-white/[0.08] text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5 text-cyan-200" />
              <span>Modelos Reais</span>
            </button>
          </div>
        </div>

        {/* Grade Bento Fotográfica com Scroll Suave e Overscroll Contain */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 overscroll-contain touch-pan-y space-y-3">
          {filteredModels.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-300">
                Nenhum modelo encontrado para sua busca.
              </p>
              <p className="text-xs text-slate-500">
                Tente buscar com outros termos ou alterne os filtros de categoria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredModels.map((model) => {
                const isSelected = activeModelId === model.id || activeModelId === model.slug;
                const isAi = model.type === "AI";
                const catMeta = CATEGORY_LABELS[model.category] || { label: model.category, icon: "✨" };

                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model);
                      onClose();
                    }}
                    className={`group relative rounded-2xl border p-3.5 cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[44px] ${
                      isSelected
                        ? "bg-[#13141B] border-violet-500 shadow-[0_0_25px_rgba(139,92,246,0.3)] ring-1 ring-violet-500/60"
                        : "bg-[#070709] border-white/[0.06] hover:border-slate-700 hover:bg-[#0c0d12]"
                    }`}
                  >
                    <div className="flex gap-3.5">
                      {/* Avatar do Modelo com Aspect Ratio Travado (Zero CLS) */}
                      <div className="relative w-18 h-24 rounded-xl overflow-hidden shrink-0 bg-black/60 border border-white/[0.08] aspect-[3/4]">
                        <img
                          src={model.avatarUrl}
                          alt={model.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 aspect-[3/4]"
                        />
                        {model.isHot18 && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-rose-600/90 text-white text-[8px] font-bold shadow-sm">
                            +18
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                            {model.name}
                          </h4>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white shrink-0 shadow-sm text-xs">
                              ✓
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              isAi
                                ? "bg-violet-500/15 text-violet-300 border border-violet-500/25"
                                : "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25"
                            }`}
                          >
                            {isAi ? "IA" : "REAL"}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {catMeta.icon} {catMeta.label}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {model.bio || "Modelo visual de alta fidelidade para produções digitais."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span className="truncate max-w-[130px]">{model.tags.slice(0, 2).join(", ")}</span>
                      <span className="text-violet-400 font-bold group-hover:text-violet-300">
                        {isSelected ? "Ativo no Studio" : "Usar este Rosto →"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé Informativo com Suporte a Safe-Area no Mobile */}
        <div className="p-3 sm:p-4 border-t border-white/[0.08] bg-[#070709] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-4">
          <div className="flex items-center gap-2">
            <span>🎭 Preservação facial e gatilho de prompt serão aplicados automaticamente.</span>
          </div>

          <a
            href="/dashboard/models"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 hover:underline font-semibold min-h-[44px] py-1 px-2"
          >
            <span>Ver Vitrine Completa</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
