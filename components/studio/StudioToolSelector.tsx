"use client";

import React from "react";
import { Layers } from "lucide-react";
import { StudioTool, TOOLS } from "./types";

interface StudioToolSelectorProps {
  activeTool: StudioTool;
  onSelectTool: (tool: StudioTool) => void;
}

const PRIMARY_TOOLS: StudioTool[] = ["image", "video", "lipsync", "motion"];

export function StudioToolSelector({
  activeTool,
  onSelectTool,
}: StudioToolSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Tipo de Mídia
        </label>
        <span className="text-[10px] font-mono text-slate-500">Etapa 1 de 4</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5 p-1 bg-[#070709] rounded-2xl border border-[#1E202E]">
        {PRIMARY_TOOLS.map((key) => {
          const t = TOOLS[key];
          const isSelected = activeTool === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectTool(key)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#13141B]"
              }`}
              style={{ minHeight: "44px" }}
            >
              <t.icon className="h-4 w-4 mb-1" />
              <span className="text-[10px] truncate max-w-full">{t.name}</span>
            </button>
          );
        })}

        {/* Botão de expansão [>] - Upscale */}
        <button
          type="button"
          onClick={() => onSelectTool("upscale")}
          className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
            activeTool === "upscale"
              ? "bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#13141B]"
          }`}
          style={{ minHeight: "44px" }}
          title="Ferramentas Extras (Upscale 4K)"
        >
          <Layers className="h-4 w-4 mb-1" />
          <span className="text-[10px]">Mais &gt;</span>
        </button>
      </div>
    </div>
  );
}
