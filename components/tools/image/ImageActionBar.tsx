"use client";

import React from "react";
import { Coins, Wand2, RefreshCw } from "lucide-react";

interface ImageActionBarProps {
  cost: number;
  isGenerating: boolean;
  activeStepText: string;
  onGenerate: () => void;
}

export function ImageActionBar({
  cost,
  isGenerating,
  activeStepText,
  onGenerate,
}: ImageActionBarProps) {
  return (
    <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
      {/* Custo Estimado */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
          <Coins className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">
            Custo estimado
          </span>
          <span className="text-sm font-bold text-white font-mono">
            {cost} crédito{cost > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Botão Gerar Imagem com Gradiente Cyan / Violeta */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-extrabold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 text-white shadow-xl shadow-cyan-500/20 transition-all cursor-pointer"
        style={{ minHeight: "48px" }}
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>{activeStepText || "Gerando Imagem..."}</span>
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 text-cyan-200" />
            <span>Gerar Imagem</span>
          </>
        )}
      </button>
    </div>
  );
}
