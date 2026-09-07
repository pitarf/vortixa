"use client";

import React from "react";
import { ASPECT_RATIOS, RESOLUTION_OPTIONS, StudioTool } from "./types";

interface StudioAspectRatioSelectorProps {
  activeTool: StudioTool;
  imageSize: string;
  onSelectImageSize: (ratioId: string) => void;
  resolution: string;
  onSelectResolution: (res: string) => void;
  referenceImageUrl?: string;
  originalDimensions?: { width: number; height: number } | null;
}

export function StudioAspectRatioSelector({
  activeTool,
  imageSize,
  onSelectImageSize,
  resolution,
  onSelectResolution,
  referenceImageUrl,
  originalDimensions,
}: StudioAspectRatioSelectorProps) {
  const showOriginal = Boolean(referenceImageUrl || originalDimensions);

  const handleRatioClick = (ratioId: string) => {
    onSelectImageSize(ratioId);
    if (ratioId === "original") {
      if (originalDimensions) {
        onSelectResolution(`${originalDimensions.width} x ${originalDimensions.height}`);
      }
    } else {
      if (RESOLUTION_OPTIONS[ratioId]?.[0]) {
        onSelectResolution(RESOLUTION_OPTIONS[ratioId][0]);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Proporção da Imagem
        </label>
        {activeTool === "image" && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Tamanho:</span>
            <select
              value={resolution}
              onChange={(e) => onSelectResolution(e.target.value)}
              className="bg-[#070709] border border-[#1E202E] rounded-lg px-2 py-0.5 text-[11px] font-mono text-cyan-400 outline-none cursor-pointer"
            >
              {(RESOLUTION_OPTIONS[imageSize] || [resolution]).map((res) => (
                <option key={res} value={res} className="bg-[#0D0E12] text-white">
                  {res}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={`grid gap-1.5 ${showOriginal ? "grid-cols-6" : "grid-cols-5"}`}>
        {showOriginal && (
          <button
            type="button"
            onClick={() => handleRatioClick("original")}
            className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              imageSize === "original"
                ? "bg-[#13141B] border-cyan-400 text-white shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400"
                : "bg-[#070709] border-[#1E202E] text-slate-400 hover:text-slate-200"
            }`}
            style={{ minHeight: "52px" }}
            title="Preserva o tamanho e proporção exatos da foto anexada"
          >
            <div
              className={`border border-current rounded-sm w-4 h-4 flex items-center justify-center text-[9px] ${
                imageSize === "original"
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                  : "border-slate-500 text-slate-500"
              }`}
            >
              📷
            </div>
            <div className="text-[10px] font-bold font-mono">Original</div>
            <span className="text-[8px] text-cyan-400 font-sans truncate">
              {originalDimensions
                ? `${originalDimensions.width}x${originalDimensions.height}`
                : "Nativo"}
            </span>
          </button>
        )}

        {ASPECT_RATIOS.map((ratio) => {
          const isSelected = imageSize === ratio.id;
          return (
            <button
              key={ratio.id}
              type="button"
              onClick={() => handleRatioClick(ratio.id)}
              className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#13141B] border-violet-500 text-white shadow-md shadow-violet-500/20"
                  : "bg-[#070709] border-[#1E202E] text-slate-400 hover:text-slate-200"
              }`}
              style={{ minHeight: "52px" }}
            >
              <div
                className={`border border-current rounded-sm ${ratio.iconWidth} ${
                  isSelected ? "border-violet-400 bg-violet-500/20" : "border-slate-500"
                }`}
              />
              <div className="text-[10px] font-bold font-mono">{ratio.label}</div>
              <span className="text-[8px] text-slate-500 font-sans truncate">{ratio.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
