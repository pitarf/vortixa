"use client";

import React from "react";
import { Sparkles, Bot, UserCheck, ShieldCheck, Search, Flame } from "lucide-react";

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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D0E12] via-[#12131C] to-[#070709] border border-[#1E202E] p-5 sm:p-7 md:p-8 shadow-2xl mb-8">
      {/* Luzes de fundo atmosféricas */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Título, Badges e Pitch */}
        <div className="max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Casting & Talent Hub 2026</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 font-semibold">
              Pronto para Studio CREATE & Contratação Real
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-heading tracking-tight leading-tight">
            Vitrine & Marketplace de <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">Modelos de IA & Reais</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Escolha rostos e personagens digitais consistentes para renderizar no Studio CREATE ou contrate modelos e atores reais verificados para produções audiovisuais e publicidade física.
          </p>

          {/* Métricas e Estatísticas Rápidas */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <span>Total no Catálogo:</span>
              <strong className="text-white font-bold">{totalCount}</strong>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="w-3.5 h-3.5 text-violet-400" />
              <span>Avatares IA:</span>
              <strong className="text-violet-300 font-bold">{aiCount}</strong>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Modelos Reais:</span>
              <strong className="text-cyan-300 font-bold">{realCount}</strong>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Verificados</span>
            </div>
          </div>
        </div>

        {/* Campo de Busca Rápida e Toggle +18 */}
        <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nome, tag ou estilo..."
              className="w-full bg-[#070709]/80 border border-[#1E202E] focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 text-xs sm:text-sm text-white placeholder-slate-500 rounded-2xl pl-10 pr-4 py-3 outline-none transition-all"
              style={{ minHeight: "44px" }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Toggle +18 Adult Content */}
          <button
            type="button"
            onClick={onToggleHot18}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-xs font-medium transition-all ${
              includeHot18
                ? "bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                : "bg-[#070709]/60 border-[#1E202E] text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
            style={{ minHeight: "44px" }}
          >
            <div className="flex items-center gap-2">
              <Flame className={`w-4 h-4 ${includeHot18 ? "text-rose-400 fill-rose-400" : "text-slate-500"}`} />
              <span className="font-semibold">Modo Adulto (+18 / Hot)</span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
              includeHot18 ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"
            }`}>
              {includeHot18 ? "ATIVADO" : "DESLIGADO"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}