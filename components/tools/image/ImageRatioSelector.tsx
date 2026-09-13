"use client";

import React from "react";
import { ASPECT_RATIOS, AspectRatioOption } from "./types";
import { Camera } from "lucide-react";

interface ImageRatioSelectorProps {
  aspectRatio: string;
  originalDimensions?: { width: number; height: number } | null;
  hasReferenceImage?: boolean;
  onSelectRatio: (ratioId: string) => void;
  ratios?: AspectRatioOption[];
}

export function ImageRatioSelector({
  aspectRatio,
  originalDimensions,
  hasReferenceImage,
  onSelectRatio,
  ratios = ASPECT_RATIOS,
}: ImageRatioSelectorProps) {
  const showOriginalButton = Boolean(hasReferenceImage || originalDimensions);

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
          Proporção da Imagem (Aspect Ratio)
        </label>
        {showOriginalButton && (
          <span className="text-[10px] font-mono text-cyan-400">
            {aspectRatio === "original" ? "Original Ativo" : "Referência Carregada"}
          </span>
        )}
      </div>

      {/* Pílulas de proporção: Rolagem touch horizontal (no-scrollbar) no mobile e grid no desktop */}
      <div
        className={`flex sm:grid overflow-x-auto sm:overflow-x-visible no-scrollbar overscroll-x-contain touch-pan-x gap-2 pb-1.5 sm:pb-0 ${
          showOriginalButton
            ? "sm:grid-cols-6"
            : "sm:grid-cols-5"
        }`}
      >
        {showOriginalButton && (
          <button
            type="button"
            onClick={() => onSelectRatio("original")}
            className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer min-h-[48px] min-w-[78px] sm:min-w-0 touch-manipulation select-none active:scale-[0.98] shrink-0 sm:shrink ${
              aspectRatio === "original"
                ? "bg-[#13141B] border-cyan-400 text-white shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                : "bg-[#070709] border-[#1E202E] text-slate-400 hover:text-slate-200"
            }`}
            title="Preserva a proporção exata da foto original"
          >
            <div
              className={`rounded-sm w-4 h-4 flex items-center justify-center ${
                aspectRatio === "original" ? "text-cyan-300" : "text-slate-400"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold font-mono text-cyan-300">Original</span>
            <span className="text-[9px] text-cyan-400 font-sans truncate max-w-full px-0.5">
              {originalDimensions ? `${originalDimensions.width}x${originalDimensions.height}` : "Nativo"}
            </span>
          </button>
        )}

        {ratios.map((ratio) => {
          const isSelected = aspectRatio === ratio.id;

          // Ícones geométricos fiéis para cada proporção
          const renderGeometricBox = () => {
            switch (ratio.label) {
              case "1:1":
                return <div className="w-4 h-4 border border-current rounded-[2px]" />;
              case "16:9":
                return <div className="w-6 h-3.5 border border-current rounded-[2px]" />;
              case "9:16":
                return <div className="w-3.5 h-6 border border-current rounded-[2px]" />;
              case "4:3":
                return <div className="w-5 h-3.5 border border-current rounded-[2px]" />;
              case "3:2":
                return <div className="w-5.5 h-3.5 border border-current rounded-[2px]" />;
              default:
                return <div className="w-4 h-4 border border-current rounded-[2px]" />;
            }
          };

          return (
            <button
              key={ratio.id}
              type="button"
              onClick={() => onSelectRatio(ratio.id)}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer min-h-[48px] min-w-[78px] sm:min-w-0 touch-manipulation select-none active:scale-[0.98] shrink-0 sm:shrink ${
                isSelected
                  ? "bg-[#13141B] border-violet-500 text-white shadow-md shadow-violet-500/25 ring-1 ring-violet-500/50"
                  : "bg-[#070709] border-[#1E202E] text-slate-400 hover:text-slate-200"
              }`}
            >
              <div
                className={`flex items-center justify-center ${
                  isSelected ? "text-violet-400" : "text-slate-500"
                }`}
              >
                {renderGeometricBox()}
              </div>
              <span className="text-[11px] font-bold font-mono">{ratio.label}</span>
              <span className="text-[9px] text-slate-500 font-sans truncate max-w-full px-0.5">
                {ratio.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
