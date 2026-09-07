"use client";

import React from "react";
import { STYLE_PRESETS, StylePreset } from "./types";

interface StudioStyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
}

export function StudioStyleSelector({
  selectedStyle,
  onSelectStyle,
}: StudioStyleSelectorProps) {
  const currentStyle = STYLE_PRESETS.find((s) => s.id === selectedStyle);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Estilo Visual
        </label>
        {selectedStyle && (
          <span className="text-[11px] text-cyan-400 font-mono">
            Ativo ({currentStyle?.name || selectedStyle})
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {STYLE_PRESETS.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col items-center justify-end p-1.5 aspect-square ${
                isSelected
                  ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400"
                  : "border-[#1E202E] hover:border-slate-600 opacity-80 hover:opacity-100"
              }`}
              style={{ minHeight: "56px" }}
              title={style.description}
            >
              <img
                src={style.thumb}
                alt={style.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <span className="relative z-10 text-[9px] font-bold text-white text-center leading-tight truncate w-full">
                {style.name}
              </span>
            </button>
          );
        })}
      </div>

      {selectedStyle && currentStyle && (
        <p className="text-[11px] text-slate-400 leading-snug bg-[#070709] border border-[#1E202E] rounded-xl px-2.5 py-1.5">
          <span className="text-cyan-400 font-semibold font-mono">Diretiva: </span>
          {currentStyle.description}
        </p>
      )}
    </div>
  );
}
