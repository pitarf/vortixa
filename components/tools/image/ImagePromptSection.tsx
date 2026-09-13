"use client";

import React from "react";
import { Wand2, RefreshCw, Lightbulb, Dices, Trash2, Sparkles } from "lucide-react";

interface ImagePromptSectionProps {
  prompt: string;
  isOptimizing: boolean;
  onChangePrompt: (value: string) => void;
  onOptimizePrompt: () => void;
  onInspirationPrompt: () => void;
  onClearPrompt: () => void;
}

const QUICK_STYLE_BADGES = [
  { label: "Cinemático 🎬", tag: ", cinematic lighting, 8k resolution, photorealistic, anamorphic lens flare" },
  { label: "Foto 35mm 📸", tag: ", raw photo, 35mm lens, natural skin pores, soft studio lighting" },
  { label: "Cyberpunk 🌆", tag: ", neon lights, rainy cyberpunk city, volumetric reflections" },
  { label: "Luz Softbox 💡", tag: ", studio lighting, pristine reflections, soft diffuse shadows" },
  { label: "Arte Digital 🎨", tag: ", digital painting, rich brush strokes, fantasy mood, trending on artstation" },
];

export function ImagePromptSection({
  prompt,
  isOptimizing,
  onChangePrompt,
  onOptimizePrompt,
  onInspirationPrompt,
  onClearPrompt,
}: ImagePromptSectionProps) {
  const handleAddStyleTag = (tag: string) => {
    if (!prompt.includes(tag.trim())) {
      onChangePrompt(`${prompt.trim()}${tag}`);
    }
  };

  return (
    <div className="space-y-2.5 w-full">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
          Prompt Criativo
        </label>
        <button
          type="button"
          onClick={onOptimizePrompt}
          disabled={isOptimizing || !prompt.trim()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:opacity-90 disabled:opacity-40 text-white shadow-md shadow-violet-600/20 transition-all active:scale-95 cursor-pointer min-h-[44px] touch-manipulation select-none"
        >
          {isOptimizing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4 text-cyan-200" />
          )}
          <span>Otimizar com IA</span>
        </button>
      </div>

      {/* Caixa de Texto Principal com Foco Suave e sem overflow */}
      <div className="relative rounded-2xl border border-[#1E202E] bg-[#070709] focus-within:border-violet-500/80 transition-all duration-300">
        <textarea
          value={prompt}
          onChange={(e) => onChangePrompt(e.target.value)}
          rows={4}
          placeholder="Descreva a cena, iluminação, personagem ou ambiente com riqueza de detalhes..."
          className="w-full bg-transparent p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed min-h-[110px]"
          maxLength={1500}
        />

        {/* Rodapé com Ações de Toque Confortável (>= 44px) e Contador */}
        <div className="flex flex-wrap items-center justify-between border-t border-[#1E202E] px-3 py-1.5 text-slate-400 text-xs gap-1.5">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={onInspirationPrompt}
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#13141B] hover:text-amber-300 transition-colors text-xs font-semibold cursor-pointer min-h-[44px] touch-manipulation select-none active:scale-95"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Inspirar</span>
            </button>

            <button
              type="button"
              onClick={onInspirationPrompt}
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#13141B] hover:text-cyan-300 transition-colors text-xs font-semibold cursor-pointer min-h-[44px] touch-manipulation select-none active:scale-95"
            >
              <Dices className="w-4 h-4 text-cyan-400" />
              <span>Aleatório</span>
            </button>

            {prompt && (
              <button
                type="button"
                onClick={onClearPrompt}
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#13141B] hover:text-rose-300 transition-colors text-xs font-semibold cursor-pointer min-h-[44px] touch-manipulation select-none active:scale-95"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Limpar</span>
              </button>
            )}
          </div>

          <span className="text-[10px] font-mono text-slate-500 px-1">
            {prompt.length}/1500
          </span>
        </div>
      </div>

      {/* Badges de Estilo Rápidas */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase">
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span>Modificadores de Estilo com 1 Clique</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {QUICK_STYLE_BADGES.map((badge) => (
            <button
              key={badge.label}
              type="button"
              onClick={() => handleAddStyleTag(badge.tag)}
              className="px-3 py-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-violet-500/50 hover:bg-[#13141B] text-slate-400 hover:text-violet-300 text-xs font-medium transition-colors cursor-pointer select-none active:scale-95 min-h-[36px] touch-manipulation"
            >
              {badge.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
