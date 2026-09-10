"use client";

import React, { useRef } from "react";
import { ModelCategory, CATEGORY_LABELS } from "./types";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const categories = (Object.keys(CATEGORY_LABELS) as ModelCategory[]).filter(
    (cat) => cat !== "HOT_18" || includeHot18
  );

  return (
    <div className="space-y-4 mb-6">
      {/* Linha Superior: Tipos de Modelo + Ordenação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Pílulas de Tipo (Todos / IA / Reais) com rolagem horizontal suave no mobile */}
        <div
          className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0D0E12] border border-[#1E202E] w-full sm:w-fit overflow-x-auto no-scrollbar"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <button
            type="button"
            onClick={() => onSelectType("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              selectedType === "ALL"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
            style={{ minHeight: "44px" }}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => onSelectType("AI")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
              selectedType === "AI"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
            style={{ minHeight: "44px" }}
          >
            <span>🤖 Modelos de IA</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectType("REAL")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
              selectedType === "REAL"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
            style={{ minHeight: "44px" }}
          >
            <span>👤 Modelos Reais</span>
          </button>
        </div>

        {/* Seletor de Ordenação */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Ordenar:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSelectSortBy(e.target.value as any)}
            className="bg-[#0D0E12] border border-[#1E202E] text-xs text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-violet-500/50 font-sans cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <option value="featured">⭐ Destaques Primeiro</option>
            <option value="popular">🔥 Mais Populares (Reservas)</option>
            <option value="newest">✨ Mais Recentes</option>
            <option value="price_asc">💰 Menor Custo / Créditos</option>
          </select>
        </div>
      </div>

      {/* Linha Inferior: Pílulas de Nicho / Categorias com Scroll Deslizante */}
      <div className="relative flex items-center group">
        {/* Botão Scroll Esquerda (Desktop) */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="hidden md:flex absolute -left-3 z-10 p-1.5 rounded-full bg-[#0D0E12]/95 border border-[#1E202E] text-slate-400 hover:text-white hover:border-slate-600 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Rolar filtros para a esquerda"
          style={{ minHeight: "44px", minWidth: "44px", alignItems: "center", justifyContent: "center" }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Container Deslizante com Touch Scroll */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full px-1"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Opção Todas Categorias */}
          <button
            type="button"
            onClick={() => onSelectCategory("ALL")}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === "ALL"
                ? "bg-slate-200 text-slate-900 shadow-sm"
                : "bg-[#0D0E12] border border-[#1E202E] text-slate-400 hover:text-white hover:border-slate-700"
            }`}
            style={{ minHeight: "44px" }}
          >
            Todas as Categorias
          </button>

          {/* Categorias Individuais */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const meta = CATEGORY_LABELS[cat];
            const isHot = cat === "HOT_18";

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? isHot
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                      : "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : isHot
                    ? "bg-rose-950/20 border border-rose-900/40 text-rose-300 hover:border-rose-700"
                    : "bg-[#0D0E12] border border-[#1E202E] text-slate-400 hover:text-white hover:border-slate-700"
                }`}
                style={{ minHeight: "44px" }}
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* Botão Scroll Direita (Desktop) */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className="hidden md:flex absolute -right-3 z-10 p-1.5 rounded-full bg-[#0D0E12]/95 border border-[#1E202E] text-slate-400 hover:text-white hover:border-slate-600 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Rolar filtros para a direita"
          style={{ minHeight: "44px", minWidth: "44px", alignItems: "center", justifyContent: "center" }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}