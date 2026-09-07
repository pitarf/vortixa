"use client";

import React from "react";
import { StudioTool, TOOLS, QUALITY_MODES } from "./types";

interface StudioModelSelectorProps {
  activeTool: StudioTool;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  qualityMode?: string;
  onSelectQualityMode?: (modeId: string, steps: number, modelId: string) => void;
}

export function StudioModelSelector({
  activeTool,
  selectedModelId,
  onSelectModel,
  qualityMode,
  onSelectQualityMode,
}: StudioModelSelectorProps) {
  const currentToolDef = TOOLS[activeTool];
  const currentModelDef =
    currentToolDef.models.find((m) => m.id === selectedModelId) ||
    currentToolDef.models[0];

  return (
    <div className="space-y-4">
      {/* Seção Modelo de IA com Linguagem Amigável para Leigos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Qual Inteligência Artificial você quer usar?
            </label>
            <span className="text-[11px] text-slate-400">
              {activeTool === "image"
                ? "Escolha o motor ideal para o seu tipo de imagem:"
                : "Selecione o motor de inferência:"}
            </span>
          </div>
          <span className="text-[10px] font-mono text-violet-400 font-semibold">
            {currentModelDef.cost} crédito{currentModelDef.cost > 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentToolDef.models.map((model) => {
            const isSelected = selectedModelId === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => onSelectModel(model.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#13141B] border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/50"
                    : "bg-[#070709] border-[#1E202E] hover:border-slate-700 opacity-85 hover:opacity-100"
                }`}
                style={{ minHeight: "82px" }}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-white truncate">
                    {model.name}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 whitespace-nowrap">
                    {model.cost} cr
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight my-1">
                  {model.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-[#1E202E]/60">
                  <span className="text-cyan-400 font-semibold">{model.badge}</span>
                  <span className="text-slate-500">{model.speed}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seção Qualidade / Modo (apenas para a ferramenta de imagem) */}
      {activeTool === "image" && onSelectQualityMode && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Qualidade / Modo
            </label>
            <span className="text-[10px] text-slate-400">Ajuste de velocidade e fidelidade</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUALITY_MODES.map((mode) => {
              const isSelected = qualityMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onSelectQualityMode(mode.id, mode.steps, mode.modelId)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#13141B] border-violet-500 shadow-md shadow-violet-500/20 ring-1 ring-violet-500/50"
                      : "bg-[#070709] border-[#1E202E] hover:border-slate-700 opacity-85 hover:opacity-100"
                  }`}
                  style={{ minHeight: "58px" }}
                >
                  <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-300"}`}>
                    {mode.name}
                  </span>
                  <span className="text-[10px] font-mono text-violet-400 font-semibold">
                    {mode.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
