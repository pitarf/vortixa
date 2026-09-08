"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, MoreHorizontal, Lightbulb, ArrowLeft } from "lucide-react";
import { RecentCreation } from "./types";

interface ImageHistorySidebarProps {
  historyItems: RecentCreation[];
  onSelectHistoryItem: (item: RecentCreation) => void;
  onReusePrompt: (prompt: string) => void;
}

export function ImageHistorySidebar({
  historyItems,
  onSelectHistoryItem,
  onReusePrompt,
}: ImageHistorySidebarProps) {
  return (
    <div className="space-y-4">
      {/* Card Histórico */}
      <div className="bg-[#0D0E12] border border-[#1E202E] p-4 rounded-2xl shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E202E] pb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Histórico
          </h2>
          <Link
            href="/dashboard/library"
            className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5"
          >
            <span>Ver todos</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#1E202E]">
          {historyItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 space-y-1">
              <p>Nenhuma criação recente.</p>
              <p className="text-[11px] text-slate-600">Suas imagens geradas aparecerão aqui.</p>
            </div>
          ) : (
            historyItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                className="group flex items-center justify-between p-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-violet-500/60 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="relative h-11 w-11 rounded-lg overflow-hidden border border-[#1E202E] flex-shrink-0">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="overflow-hidden text-left">
                    <h3 className="text-xs font-bold text-white truncate max-w-[130px]">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                      <span>{item.resolution}</span>
                      <span>•</span>
                      <span>{item.timeAgo}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReusePrompt(item.prompt);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-[#13141B] transition-colors"
                  title="Reutilizar prompt"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Card Dica de Pro */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-300 dark:border-violet-500/30 bg-gradient-to-br from-violet-50 via-white to-slate-50 dark:from-violet-950/40 dark:via-[#0D0E12] dark:to-[#070709] p-4 shadow-md dark:shadow-xl space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-violet-100 dark:bg-violet-600/20 border border-violet-200 dark:border-violet-500/40 flex items-center justify-center text-violet-600 dark:text-violet-300 shadow-sm">
            <Lightbulb className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white font-heading">
            Dica de Pro
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Use o <span className="text-violet-600 dark:text-violet-400 font-bold">VORIXA FLOW</span> para criar variações, vídeos e até avatares a partir das suas imagens.
        </p>

        <Link
          href="/dashboard/flow"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
        >
          <span>Abrir no Flow</span>
          <ArrowLeft className="w-3 h-3 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
