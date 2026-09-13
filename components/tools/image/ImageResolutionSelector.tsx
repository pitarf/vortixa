"use client";

import React from "react";
import { Sparkles, Monitor } from "lucide-react";
import { RESOLUTION_OPTIONS } from "./types";

interface ImageResolutionSelectorProps {
  aspectRatio: string;
  selectedResolution: string;
  onChangeResolution: (res: string) => void;
}

export function ImageResolutionSelector({
  aspectRatio,
  selectedResolution,
  onChangeResolution,
}: ImageResolutionSelectorProps) {
  const options = RESOLUTION_OPTIONS[aspectRatio] || ["1024 x 1024", "1536 x 1536", "1792 x 1024"];

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
          Fidelidade & Resolução
        </label>
        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
          <Monitor className="w-3 h-3 text-cyan-400" />
          <span>Matriz de Pixels</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((res, index) => {
          const isSelected = selectedResolution === res || (!selectedResolution && index === 0);
          const isHigh = res.includes("1792") || res.includes("1536") || res.includes("1920");

          return (
            <button
              key={res}
              type="button"
              onClick={() => onChangeResolution(res)}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-300 cursor-pointer min-h-[48px] touch-manipulation select-none active:scale-[0.98] ${
                isSelected
                  ? "bg-[#13141B] border-cyan-400 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/40"
                  : "bg-[#070709] border-[#1E202E] text-slate-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-mono">{res}</span>
                {isHigh && (
                  <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                )}
              </div>
              <span className="text-[9px] font-mono text-slate-500">
                {isHigh ? "Ultra Definição" : "Padrão HD"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
