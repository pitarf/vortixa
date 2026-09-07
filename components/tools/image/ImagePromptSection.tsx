"use client";

import React from "react";
import { Wand2, RefreshCw, Lightbulb, Dices, Trash2 } from "lucide-react";

interface ImagePromptSectionProps {
  prompt: string;
  isOptimizing: boolean;
  onChangePrompt: (value: string) => void;
  onOptimizePrompt: () => void;
  onInspirationPrompt: () => void;
  onClearPrompt: () => void;
}

export function ImagePromptSection({
  prompt,
  isOptimizing,
  onChangePrompt,
  onOptimizePrompt,
  onInspirationPrompt,
  onClearPrompt,
}: ImagePromptSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Prompt de Criação
        </label>
        <button
          type="button"
          onClick={onOptimizePrompt}
          disabled={isOptimizing || !prompt.trim()}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white shadow-md shadow-violet-600/20 transition-all active:scale-95 cursor-pointer"
          style={{ minHeight: "32px" }}
        >
          {isOptimizing ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Wand2 className="h-3.5 w-3.5 text-cyan-200" />
          )}
          <span>Otimizar com IA</span>
        </button>
      </div>

      <div className="relative rounded-2xl border border-[#1E202E] bg-[#070709] focus-within:border-violet-500/80 transition-all">
        <textarea
          value={prompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          rows={4}
          placeholder="Descreva sua ideia com riqueza de detalhes..."
          className="w-full bg-transparent p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
          maxLength={1500}
        />

        {/* Barra de ações no rodapé do prompt */}
        <div className="flex items-center justify-between border-t border-[#1E202E] px-3 py-2 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onInspirationPrompt}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#13141B] hover:text-amber-300 transition-colors text-[11px] font-semibold cursor-pointer"
            >
              <Lightbulb className="w-3 h-3 text-amber-400" />
              <span>Inspirar</span>
            </button>

            <button
              type="button"
              onClick={onInspirationPrompt}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#13141B] hover:text-cyan-300 transition-colors text-[11px] font-semibold cursor-pointer"
            >
              <Dices className="w-3 h-3 text-cyan-400" />
              <span>Prompt Aleatório</span>
            </button>

            {prompt && (
              <button
                type="button"
                onClick={onClearPrompt}
                className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#13141B] hover:text-rose-300 transition-colors text-[11px] font-semibold cursor-pointer"
              >
                <Trash2 className="w-3 h-3 text-rose-400" />
                <span>Limpar</span>
              </button>
            )}
          </div>

          <span className="text-[10px] font-mono text-slate-500">
            {prompt.length}/1500
          </span>
        </div>
      </div>
    </div>
  );
}
