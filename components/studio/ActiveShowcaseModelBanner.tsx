"use client";

import React from "react";
import { MarketplaceModelItem, CATEGORY_LABELS } from "@/components/models/types";
import { ExternalLink, X, CheckCircle2 } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/40 bg-gradient-to-r from-violet-950/40 via-[#13141B] to-[#0D0E12] p-3 sm:p-3.5 shadow-lg shadow-violet-900/10 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Luz ambiente de destaque */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-600/20 blur-2xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Esquerda: Foto + Identificação */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-violet-500/50 shadow-md shadow-violet-600/20 aspect-square">
            <img
              src={model.avatarUrl}
              alt={model.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-center text-[8px] font-mono font-bold text-violet-300">
              {isAi ? "IA" : "REAL"}
            </div>
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-violet-400" />
                <span>Modelo Ativo</span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                {catMeta.icon} {catMeta.label}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
              <span>{model.name}</span>
            </h4>

            <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-sm break-words">
              Preservação facial ativada • Gatilho injetado no prompt
            </p>
          </div>
        </div>

        {/* Direita: Ações (Ver na Vitrine / Remover) */}
        <div className="flex items-center justify-end gap-2 shrink-0 self-end sm:self-center">
          <Link
            href={`/dashboard/models`}
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-violet-500/50 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer min-h-[44px]"
          >
            <span>Ver na Vitrine</span>
            <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
          </Link>

          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-rose-500/50 text-slate-400 hover:text-rose-300 transition-all cursor-pointer min-h-[44px] min-w-[44px]"
            title="Remover modelo ativo da vitrine"
            aria-label="Remover modelo ativo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
