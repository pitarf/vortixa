"use client";

import React from "react";
import { ModelCategory, CATEGORY_LABELS } from "./types";
import { SlidersHorizontal } from "lucide-react";

interface ModelFilterPillsProps {
  selectedType: "ALL" | "AI" | "REAL";
  onSelectType: (type: "ALL" | "AI" | "REAL") => void;
  selectedCategory: "ALL" | ModelCategory;
  onSelectCategory: (cat: "ALL" | ModelCategory) => void;
  sortBy: "featured" | "popular" | "price_asc" | "newest";
  onSelectSortBy: (sort: "featured" | "popular" | "price_asc" | "newest") => void;
  includeHot18: boolean;
}

export function ModelFilterPills({
  selectedType,
  onSelectType,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSortBy,
  includeHot18,
}: ModelFilterPillsProps) {
  const categories = (Object.keys(CATEGORY_LABELS) as ModelCategory[]).filter(
    (cat) => cat !== "HOT_18" || includeHot18
  );

  return (
    <div className="space-y-4 mb-6">
      {/* Linha Superior: Segmented Control Adaptativo + Ordenação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Controle Segmentado de Tipos Responsivo */}
        <div
          className="flex items-center gap-1 p-1 rounded-2xl bg-[#0D0E12] border border-[#1E202E] w-full sm:w-auto overflow-x-auto no-scrollbar scrollbar-none"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          role="tablist"
          aria-label="Filtro de Tipo de Modelo"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedType === "ALL"}
            onClick={() => onSelectType("ALL")}
            className={`flex-1 sm:flex-initial text-center justify-center px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap min-h-[44px] ${
              selectedType === "ALL"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedType === "AI"}
            onClick={() => onSelectType("AI")}
            className={`flex-1 sm:flex-initial text-center justify-center px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 min-h-[44px] ${
              selectedType === "AI"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <span>🤖 Modelos IA</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedType === "REAL"}
            onClick={() => onSelectType("REAL")}
            className={`flex-1 sm:flex-initial text-center justify-center px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 min-h-[44px] ${
              selectedType === "REAL"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <span>👤 Modelos Reais</span>
          </button>
        </div>

        {/* Dropdown de Ordenação Editorial com Altura Touch-Friendly */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Ordenar:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSelectSortBy(e.target.value as any)}
            className="flex-1 sm:flex-initial bg-[#0D0E12] border border-[#1E202E] text-sm sm:text-xs text-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-violet-500/50 font-sans cursor-pointer min-h-[44px]"
            aria-label="Critério de ordenação de modelos"
          >
            <option value="featured">⭐ Destaques Editoriais</option>
            <option value="popular">🔥 Mais Requisitados</option>
            <option value="newest">✨ Recém-Chegados</option>
            <option value="price_asc">💰 Menor Custo / Créditos</option>
          </select>
        </div>
      </div>

      {/* Linha Inferior: Pílulas de Nicho Adaptativas (Wrap no Desktop / Scroll Touch Invisível no Mobile) */}
      <div className="w-full">
        <div
          className="flex items-center gap-2 overflow-x-auto sm:flex-wrap no-scrollbar scrollbar-none py-1 w-full"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorX: "contain",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <button
            type="button"
            onClick={() => onSelectCategory("ALL")}
            className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center justify-center ${
              selectedCategory === "ALL"
                ? "bg-slate-100 text-slate-950 font-bold shadow-md shadow-white/10"
                : "bg-[#0D0E12] border border-[#1E202E] text-slate-400 hover:text-white hover:border-slate-700 hover:bg-[#13141B]"
            }`}
          >
            Todas as Categorias
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const meta = CATEGORY_LABELS[cat];
            const isHot = cat === "HOT_18";

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap min-h-[44px] justify-center ${
                  isSelected
                    ? isHot
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                      : "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : isHot
                    ? "bg-rose-950/20 border border-rose-900/40 text-rose-300 hover:border-rose-700"
                    : "bg-[#0D0E12] border border-[#1E202E] text-slate-400 hover:text-white hover:border-slate-700 hover:bg-[#13141B]"
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
