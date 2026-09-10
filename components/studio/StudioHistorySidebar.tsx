"use client";

import React from "react";
import { Clock, Play, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { StudioHistoryItem } from "./types";

interface StudioHistorySidebarProps {
  historyItems: StudioHistoryItem[];
  isLoading: boolean;
  onSelectItem: (item: StudioHistoryItem) => void;
  onCopyPrompt: (prompt: string) => void;
}

export function StudioHistorySidebar({
  historyItems,
  isLoading,
  onSelectItem,
  onCopyPrompt,
}: StudioHistorySidebarProps) {
  const router = useRouter();

  return (
    <div className="space-y-4 bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-4">
      <div className="flex items-center justify-between border-b border-[#1E202E] pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
            Histórico
          </h2>
        </div>
        <button
          type="button"
          onClick={() => router.push("/dashboard/library")}
          className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          Ver todos
        </button>
      </div>

      {/* Lista de Gerações Anteriores */}
      <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
        {isLoading && historyItems.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 font-mono">
            Carregando histórico...
          </div>
        ) : historyItems.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            Nenhuma criação encontrada ainda.
          </div>
        ) : (
          historyItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group p-2.5 rounded-2xl bg-[#070709] border border-[#1E202E] hover:border-violet-500/50 transition-all cursor-pointer flex items-center gap-3 min-h-[44px]"
            >
              {/* Thumbnail */}
              <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-black shrink-0 border border-[#1E202E] aspect-square">
                {item.mediaType === "video" ? (
                  <video src={item.url} className="h-full w-full object-cover" />
                ) : (
                  <img src={item.url} alt="Histórico" className="h-full w-full object-cover" />
                )}
                {item.mediaType === "video" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="h-3.5 w-3.5 text-white fill-white" />
                  </div>
                )}
              </div>

              {/* Detalhes do Item */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="text-violet-400 font-semibold truncate max-w-[90px]">
                    {item.modelName}
                  </span>
                  <span>{item.timeAgo || "recente"}</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5 break-words">
                  {item.prompt || "Criação de estúdio"}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyPrompt(item.prompt || "");
                }}
                className="text-slate-500 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#13141B]"
                title="Copiar prompt"
                aria-label="Copiar prompt"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
