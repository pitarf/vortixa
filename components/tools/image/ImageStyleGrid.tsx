"use client";

import React from "react";
import { STYLE_PRESETS, StylePreset } from "./types";

interface ImageStyleGridProps {
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
  presets?: StylePreset[];
}

export function ImageStyleGrid({
  selectedStyle,
  onSelectStyle,
  presets = STYLE_PRESETS,
}: ImageStyleGridProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Estilo Visual
        </label>
        {selectedStyle && (
          <span className="text-[10px] text-cyan-400 font-mono">
            Ativo ({presets.find((s) => s.id === selectedStyle)?.name})
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6 gap-2">
        {presets.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col items-center justify-end p-1.5 aspect-square ${
                isSelected
                  ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400"
                  : "border-[#1E202E] hover:border-slate-600 opacity-80 hover:opacity-100"
              }`}
              style={{ minHeight: "58px" }}
              title={style.description}
            >
              <img
                src={style.thumb}
                alt={style.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <span className="relative z-10 text-[9px] font-bold text-white text-center leading-tight truncate w-full">
                {style.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
