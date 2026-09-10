"use client";

import React from "react";
import { ASPECT_RATIOS, RESOLUTION_OPTIONS, AspectRatioOption } from "./types";

interface ImageRatioSelectorProps {
  aspectRatio: string;
  resolution: string;
  originalDimensions?: { width: number; height: number } | null;
  hasReferenceImage?: boolean;
  onSelectRatio: (ratioId: string) => void;
  onChangeResolution: (res: string) => void;
  ratios?: AspectRatioOption[];
  resolutionOptions?: Record<string, string[]>;
}

export function ImageRatioSelector({
  aspectRatio,
  resolution,
  originalDimensions,
  hasReferenceImage,
  onSelectRatio,
  onChangeResolution,
  ratios = ASPECT_RATIOS,
  resolutionOptions = RESOLUTION_OPTIONS,
}: ImageRatioSelectorProps) {
  const showOriginalButton = !!(hasReferenceImage || originalDimensions);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Proporção da Imagem
        </label>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400">Tamanho:</span>
          <select
            value={resolution}
            onChange={(e) => onChangeResolution(e.target.value)}
            className="bg-[#070709] border border-[#1E202E] rounded-lg px-2 py-0.5 text-[11px] font-mono text-cyan-400 outline-none cursor-pointer"
          >
            {(resolutionOptions[aspectRatio] || [resolution]).map((res) => (
              <option key={res} value={res} className="bg-[#0D0E12] text-white">
                {res}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className={`grid gap-1.5 sm:gap-2 ${
          showOriginalButton
            ? "grid-cols-3 sm:grid-cols-6"
            : "grid-cols-3 sm:grid-cols-5"
        }`}
      >
        {showOriginalButton && (
          <button
            type="button"
            onClick={() => onSelectRatio("original")}
            className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer min-h-[52px] touch-manipulation select-none active:scale-[0.98] ${
              aspectRatio === "original"
                ? "bg-[#13141B] border-cyan-400 text-white shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                : "bg-[#070709] border-[#1E202E] text-slate-400 hover:text-slate-200"
            }`}
            title="Preserva o tamanho e proporção exatos da foto enviada"
          >
            <div
              className={`border border-current rounded-sm w-4 h-4 flex items-center justify-center text-[10px] ${
                aspectRatio === "original"
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold"
                  : "border-slate-500 text-slate-400"
              }`}
            >
              📷
            </div>
            <span className="text-[11px] font-bold font-mono text-cyan-300">Original</span>
            <span className="text-[9px] text-cyan-400 font-sans truncate max-w-full px-0.5">
              {originalDimensions ? `${originalDimensions.width}x${originalDimensions.height}` : "Nativo"}
            </span>
          </button>
        )}
        {ratios.map((ratio) => {
          const isSelected = aspectRatio === ratio.id;
          return (
            <button
              key={ratio.id}
              type="button"
              onClick={() => onSelectRatio(ratio.id)}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer min-h-[52px] touch-manipulation select-none active:scale-[0.98] ${
                isSelected
                  ? "bg-[#13141B] border-violet-500 text-white shadow-md shadow-violet-500/25 ring-1 ring-violet-500/50"
                  : "bg-[#070709] border-[#1E202E] text-slate-400 hover:text-slate-200"
              }`}
            >
              <div
                className={`border border-current rounded-sm ${ratio.width} ${
                  isSelected ? "border-violet-400 bg-violet-500/20" : "border-slate-500"
                }`}
              />
              <span className="text-[11px] font-bold font-mono">{ratio.label}</span>
              <span className="text-[9px] text-slate-500 font-sans truncate max-w-full px-0.5">{ratio.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
