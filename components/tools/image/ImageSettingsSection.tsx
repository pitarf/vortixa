"use client";

import React, { useState } from "react";
import { Settings2, ChevronDown } from "lucide-react";
import { QualityMode } from "./types";
import { ImageRatioSelector } from "./ImageRatioSelector";

interface ImageSettingsSectionProps {
  aspectRatio: string;
  onChangeAspectRatio: (ratio: string) => void;
  qualityMode: QualityMode;
  onChangeQualityMode: (mode: QualityMode) => void;
  originalDimensions?: { width: number; height: number } | null;
  hasReferenceImage?: boolean;
  seed: string;
  onChangeSeed: (seed: string) => void;
  negativePrompt: string;
  onChangeNegativePrompt: (negative: string) => void;
  inferenceSteps: number;
  onChangeInferenceSteps: (steps: number) => void;
  guidanceScale: number;
  onChangeGuidanceScale: (cfg: number) => void;
}

export function ImageSettingsSection({
  aspectRatio,
  onChangeAspectRatio,
  qualityMode,
  onChangeQualityMode,
  originalDimensions,
  hasReferenceImage,
  seed,
  onChangeSeed,
  negativePrompt,
  onChangeNegativePrompt,
  inferenceSteps,
  onChangeInferenceSteps,
  guidanceScale,
  onChangeGuidanceScale,
}: ImageSettingsSectionProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl w-full">
      {/* 1. Proporção da Imagem Modular com Rolagem Touch Horizontal no Mobile */}
      <ImageRatioSelector
        aspectRatio={aspectRatio}
        originalDimensions={originalDimensions}
        hasReferenceImage={hasReferenceImage}
        onSelectRatio={onChangeAspectRatio}
      />

      {/* 2. Qualidade (Padrão: 1 cr | Alta Definição: 2 cr | Ultra: 4 cr) */}
      <div className="space-y-2 pt-2 border-t border-[#1E202E]/60">
        <label className="text-xs font-bold text-slate-300 block font-mono uppercase tracking-wider">
          Qualidade de Renderização
        </label>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "fast" as QualityMode, label: "Padrão", cost: "1 crédito" },
            { id: "standard" as QualityMode, label: "Alta Definição", cost: "2 créditos" },
            { id: "ultra" as QualityMode, label: "Ultra", cost: "4 créditos" },
          ].map((q) => {
            const isSelected = qualityMode === q.id;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onChangeQualityMode(q.id)}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer min-h-[50px] touch-manipulation select-none active:scale-[0.98] ${
                  isSelected
                    ? "bg-violet-600/20 border-violet-500 text-white shadow-md shadow-violet-500/25 ring-1 ring-violet-500/50"
                    : "bg-[#070709] border-[#1E202E] text-slate-400 hover:text-white"
                }`}
              >
                <span className="text-xs font-bold">{q.label}</span>
                <span className="text-[10px] text-slate-400 font-mono">{q.cost}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Configurações Avançadas com Touch Targets >= 44px */}
      <div className="pt-2 border-t border-[#1E202E]/60">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full min-h-[44px] flex items-center justify-between py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer touch-manipulation"
        >
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-slate-400" />
            <span className="font-semibold">Configurações Avançadas</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="space-y-3 pt-3 pb-1 animate-in fade-in-50 duration-200">
            {/* Prompt Negativo */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400 block font-mono">
                Prompt Negativo
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => onChangeNegativePrompt(e.target.value)}
                placeholder="Ex: borrões, distorções, membros extras, texto indesejado"
                className="w-full min-h-[44px] bg-[#070709] border border-[#1E202E] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500"
              />
            </div>

            {/* Seed */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400 block font-mono">
                Seed (Semente de Reprodutibilidade)
              </label>
              <input
                type="text"
                value={seed}
                onChange={(e) => onChangeSeed(e.target.value)}
                placeholder="Aleatória (deixe em branco se não souber)"
                className="w-full min-h-[44px] bg-[#070709] border border-[#1E202E] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500"
              />
            </div>

            {/* Passos e Guidance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Passos de Inferência</span>
                  <span className="font-mono text-cyan-400 font-bold">{inferenceSteps}</span>
                </div>
                <div className="py-2">
                  <input
                    type="range"
                    min={4}
                    max={50}
                    value={inferenceSteps}
                    onChange={(e) => onChangeInferenceSteps(parseInt(e.target.value, 10))}
                    className="w-full accent-violet-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Guidance Scale (CFG)</span>
                  <span className="font-mono text-cyan-400 font-bold">{guidanceScale}</span>
                </div>
                <div className="py-2">
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={0.5}
                    value={guidanceScale}
                    onChange={(e) => onChangeGuidanceScale(parseFloat(e.target.value))}
                    className="w-full accent-violet-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
