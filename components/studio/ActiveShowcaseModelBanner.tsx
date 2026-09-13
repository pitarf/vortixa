"use client";

import React from "react";
import { MarketplaceModelItem, CATEGORY_LABELS } from "@/components/models/types";
import { ExternalLink, X, Sparkles } from "lucide-react";
import Link from "next/link";

interface ActiveShowcaseModelBannerProps {
  model: MarketplaceModelItem;
  onRemove: () => void;
}

export function ActiveShowcaseModelBanner({
  model,
  onRemove,
}: ActiveShowcaseModelBannerProps) {
  const isAi = model.type === "AI";
  const catMeta = CATEGORY_LABELS[model.category] || { label: model.category, icon: "✨" };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 backdrop-blur-xl bg-gradient-to-r from-violet-950/40 via-[#0E1017]/90 to-[#070709] p-3.5 sm:p-4 shadow-[0_0_25px_rgba(139,92,246,0.12)] animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Luz volumétrica de destaque */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-violet-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-cyan-500/10 blur-2xl pointer-events-none" />

      {/* Grid Adaptativo: Pilha no Mobile e Linha no Desktop Sem Cortar Gatilho */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        {/* Identificação & Avatar com Proporção Fixo (Zero CLS) */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative p-[2px] rounded-2xl bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-cyan-400 shadow-md shadow-violet-500/25 shrink-0 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] overflow-hidden bg-black/60 aspect-square">
              <img
                src={model.avatarUrl}
                alt={model.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 aspect-square"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-center text-[8px] font-mono font-extrabold text-violet-200 py-0.5">
                {isAi ? "IA CASTING" : "REAL TALENT"}
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span>Rosto Vinculado</span>
              </span>

              <span className="text-[10px] text-slate-400 inline-flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-full shrink-0">
                <span>{catMeta.icon}</span>
                <span>{catMeta.label}</span>
              </span>

              {model.promptTrigger && (
                <span
                  className="text-[10px] font-mono text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full truncate max-w-[130px] sm:max-w-[200px]"
                  title={`Gatilho: ${model.promptTrigger}`}
                >
                  {model.promptTrigger}
                </span>
              )}
            </div>

            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight truncate flex items-center gap-1.5">
              <span>{model.name}</span>
              <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            </h4>

            <p className="text-[11px] text-slate-400 leading-tight truncate sm:whitespace-normal">
              Consistência facial FLUX PuLID ativa • Gatilho injetado no prompt
            </p>
          </div>
        </div>

        {/* Ações Rápidas: Flexível no Mobile e Compacto no Desktop */}
        <div className="flex items-center justify-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
          <Link
            href={`/dashboard/models`}
            target="_blank"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#13141B]/80 hover:bg-[#1B1D28] border border-white/[0.08] hover:border-violet-500/40 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer min-h-[44px] shadow-sm active:scale-95"
          >
            <span>Ver na Vitrine</span>
            <ExternalLink className="w-3.5 h-3.5 text-violet-400 shrink-0" />
          </Link>

          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-[#13141B]/80 hover:bg-rose-500/15 border border-white/[0.08] hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all cursor-pointer min-h-[44px] min-w-[44px] shadow-sm active:scale-95 shrink-0"
            title="Desvincular modelo da criação"
            aria-label="Desvincular modelo ativo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
