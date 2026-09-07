"use client";

import React from "react";
import { AI_MODELS, AIModelDef } from "./types";

interface ImageModelPickerProps {
  selectedModelId: string;
  onSelectModel: (model: AIModelDef) => void;
  models?: AIModelDef[];
}

export function ImageModelPicker({
  selectedModelId,
  onSelectModel,
  models = AI_MODELS,
}: ImageModelPickerProps) {
  const currentModel = models.find((m) => m.id === selectedModelId) || models[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Qual Inteligência Artificial você quer usar?
          </label>
          <span className="text-[11px] text-slate-400">
            Escolha o motor ideal para o seu objetivo:
          </span>
        </div>
        <span className="text-[10px] font-mono text-violet-400 font-semibold">
          {currentModel.cost} crédito{currentModel.cost > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {models.map((model) => {
          const isSelected = selectedModelId === model.id;
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onSelectModel(model)}
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
  );
}
