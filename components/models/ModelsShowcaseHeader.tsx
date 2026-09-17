"use client";

import React from "react";
import { Sparkles, Bot, UserCheck, ShieldCheck, Search, Flame, X } from "lucide-react";

interface ModelsShowcaseHeaderProps {
  totalCount: number;
  aiCount: number;
  realCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  includeHot18: boolean;
  onToggleHot18: () => void;
}

export function ModelsShowcaseHeader({
  totalCount,
  aiCount,
  realCount,
  searchQuery,
  onSearchChange,
  includeHot18,
  onToggleHot18,
}: ModelsShowcaseHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D0E12] via-[#12131C] to-[#070709] border border-[#1E202E] p-5 sm:p-7 md:p-9 shadow-2xl mb-6 sm:mb-8">
      {/* Luzes Atmosféricas High-End */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
        {/* Título de Editorial, Badges e Pitch */}
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Catálogo de Modelos & Casting</span>
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 font-semibold backdrop-blur-md">
              Fotos Reais & Personagens Digitais
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-heading tracking-tight leading-tight">
            Vitrine de{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300">
              Modelos e Talentos
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Escolha personagens virtuais para usar nas suas criações ou encontre modelos reais para sessões de fotos e vídeos da sua marca.
          </p>

          {/* Ribbon de Métricas com Grid Adaptativo sem Estouro */}
          <div className="pt-2 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-5 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2 p-2.5 sm:p-0 rounded-xl bg-black/25 sm:bg-transparent border border-white/5 sm:border-0">
              <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)] shrink-0" />
              <span className="text-[11px] sm:text-xs">Total Catálogo:</span>
              <strong className="text-white font-bold">{totalCount}</strong>
            </div>
            <div className="flex items-center gap-2 p-2.5 sm:p-0 rounded-xl bg-black/25 sm:bg-transparent border border-white/5 sm:border-0">
              <Bot className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">Personas IA:</span>
              <strong className="text-violet-300 font-bold">{aiCount}</strong>
            </div>
            <div className="flex items-center gap-2 p-2.5 sm:p-0 rounded-xl bg-black/25 sm:bg-transparent border border-white/5 sm:border-0">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">Modelos Reais:</span>
              <strong className="text-cyan-300 font-bold">{realCount}</strong>
            </div>
            <div className="flex items-center gap-2 p-2.5 sm:p-0 rounded-xl bg-black/25 sm:bg-transparent border border-white/5 sm:border-0 text-emerald-400 col-span-2 sm:col-span-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold">100% Verificados</span>
            </div>
          </div>
        </div>

        {/* Controles: Busca Flexível e Toggle +18 Touch-Friendly */}
        <div className="w-full lg:w-88 flex flex-col gap-3 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar modelo, nicho ou estilo..."
              className="w-full bg-[#070709]/85 border border-[#1E202E] focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 text-base sm:text-sm text-white placeholder-slate-500 rounded-2xl pl-10 pr-12 py-3 outline-none transition-all min-h-[44px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-1.5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Limpar termo de busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toggle Modo Adulto (+18 / Hot) */}
          <button
            type="button"
            onClick={onToggleHot18}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-xs font-medium transition-all min-h-[44px] cursor-pointer ${
              includeHot18
                ? "bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                : "bg-[#070709]/70 border-[#1E202E] text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
            aria-pressed={includeHot18}
          >
            <div className="flex items-center gap-2">
              <Flame className={`w-4 h-4 shrink-0 ${includeHot18 ? "text-rose-400 fill-rose-400" : "text-slate-500"}`} />
              <span className="font-semibold">Modo Adulto (+18 / Hot)</span>
            </div>
            <span
              className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase font-bold tracking-wider ${
                includeHot18 ? "bg-rose-600 text-white shadow-sm" : "bg-slate-800 text-slate-400"
              }`}
            >
              {includeHot18 ? "ATIVADO" : "DESLIGADO"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
