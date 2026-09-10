"use client";

import React, { useState, useEffect } from "react";
import { MarketplaceModelItem, CATEGORY_LABELS } from "@/components/models/types";
import { FALLBACK_MARKETPLACE_MODELS } from "@/lib/marketplace-models";
import { X, Search, Sparkles, User, Check, ExternalLink } from "lucide-react";

interface QuickModelPickerModalProps {
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchModels() {
      try {
        setLoading(true);
        const res = await fetch("/api/models?limit=50");
        if (res.ok) {
          const data = await res.json();
          if (data.models && Array.isArray(data.models) && data.models.length > 0) {
            setModels(data.models);
          }
        }
      } catch (err) {
        console.warn("Usando catálogo de modelos em cache local:", err);
      } finally {
        setLoading(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overscroll-contain animate-in fade-in duration-200">
      <div
        className="relative w-full sm:max-w-3xl h-full sm:h-auto max-h-screen sm:max-h-[90vh] rounded-none sm:rounded-3xl bg-[#0D0E12] border-0 sm:border border-[#1E202E] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow de Fundo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 blur-3xl pointer-events-none" />

        {/* Header do Modal */}
        <div className="p-4 sm:p-5 border-b border-[#1E202E] flex items-center justify-between gap-3 relative z-10 bg-[#0D0E12]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/20 text-lg">
              🎭
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Casting & Vitrine de Modelos</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  {models.length} disponíveis
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Selecione uma identidade ou rosto de referência para aplicar na criação atual.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-400 hover:text-white transition-all cursor-pointer"
            aria-label="Fechar seletor rápido de modelos"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filtros e Barra de Pesquisa */}
        <div className="p-4 border-b border-[#1E202E] bg-[#070709]/60 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, tag ou estilo..."
              className="w-full bg-[#0D0E12] border border-[#1E202E] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500/80 transition-colors"
              style={{ minHeight: "44px" }}
            />
          </div>

          <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setTypeFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[44px] touch-manipulation ${
                typeFilter === "ALL"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "bg-[#0D0E12] border border-[#1E202E] text-slate-400 hover:text-white"
              }`}
            >
              Todos ({models.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("AI")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap min-h-[44px] touch-manipulation ${
                typeFilter === "AI"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "bg-[#0D0E12] border border-[#1E202E] text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-300" />
              <span>Modelos IA</span>
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("REAL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap min-h-[44px] touch-manipulation ${
                typeFilter === "REAL"
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                  : "bg-[#0D0E12] border border-[#1E202E] text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5 text-cyan-300" />
              <span>Modelos Reais</span>
            </button>
          </div>
        </div>

        {/* Grade de Modelos Disponíveis com scroll interno */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 overscroll-contain space-y-3">
          {filteredModels.length === 0 ? (
            <div className="py-12 text-center space-y-2">
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
                    className={`group relative rounded-2xl border p-3 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#13141B] border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/50"
                        : "bg-[#070709] border-[#1E202E] hover:border-slate-700 hover:bg-[#0c0d12]"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Avatar do Modelo */}
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-black/50 border border-[#1E202E]">
                        <img
                          src={model.avatarUrl}
                          alt={model.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {model.isHot18 && (
                          <span className="absolute bottom-1 right-1 px-1 rounded bg-rose-600/90 text-white text-[8px] font-bold">
                            +18
                          </span>
                        )}
                      </div>

                      {/* Informações */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                            {model.name}
                          </h4>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              isAi
                                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                                : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            }`}
                          >
                            {isAi ? "IA" : "REAL"}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {catMeta.icon} {catMeta.label}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                          {model.bio || "Modelo visual disponível para criações digitais."}
                        </p>
                      </div>
                    </div>

                    {/* Rodapé do Card */}
                    <div className="mt-2.5 pt-2 border-t border-[#1E202E]/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{model.tags.slice(0, 2).join(", ")}</span>
                      <span className="text-violet-400 font-semibold group-hover:text-violet-300">
                        {isSelected ? "Ativo no Studio" : "Usar este Rosto →"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé Informativo */}
        <div className="p-3.5 sm:p-4 border-t border-[#1E202E] bg-[#070709] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs">🎭 Preservação facial e prompt trigger serão injetados automaticamente.</span>
          </div>

          <a
            href="/dashboard/models"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 hover:underline font-semibold min-h-[44px] py-1 px-1 touch-manipulation"
          >
            <span>Ver Vitrine Completa</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
