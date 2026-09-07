"use client";

import React from "react";
import { ChevronDown, ChevronUp, Sliders } from "lucide-react";

interface StudioAdvancedSettingsProps {
  isOpen: boolean;
  onToggle: () => void;
  inferenceSteps: number;
  onInferenceStepsChange: (steps: number) => void;
  guidanceScale: number;
  onGuidanceScaleChange: (scale: number) => void;
  seed: string;
  onSeedChange: (seed: string) => void;
  negativePrompt: string;
  onNegativePromptChange: (prompt: string) => void;
  onRandomSeed: () => void;
}

export function StudioAdvancedSettings({
  isOpen,
  onToggle,
  inferenceSteps,
  onInferenceStepsChange,
  guidanceScale,
  onGuidanceScaleChange,
  seed,
  onSeedChange,
  negativePrompt,
  onNegativePromptChange,
  onRandomSeed,
}: StudioAdvancedSettingsProps) {
  return (
    <div className="border border-[#1E202E] rounded-2xl bg-[#070709] overflow-hidden transition-all">
      {/* Botão de Toggle do Acordeão */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#13141B] transition-colors cursor-pointer"
        style={{ minHeight: "44px" }}
      >
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Configurações Avançadas
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500">
            {isOpen ? "Ocultar" : "Steps, CFG, Seed"}
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Conteúdo Expansível */}
      {isOpen && (
        <div className="p-4 border-t border-[#1E202E] space-y-3.5 text-xs animate-in fade-in-50 duration-200">
          {/* Passos de Inferência (Steps) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-semibold">Passos de Inferência (Steps)</span>
              <span className="font-mono text-cyan-400 font-bold">{inferenceSteps}</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={inferenceSteps}
              onChange={(e) => onInferenceStepsChange(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>1 (Turbo)</span>
              <span>25 (Equilibrado)</span>
              <span>50 (Ultra Detalhe)</span>
            </div>
          </div>

          {/* Guidance Scale (CFG) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-semibold">Fidelidade ao Prompt (Guidance / CFG)</span>
              <span className="font-mono text-cyan-400 font-bold">{guidanceScale}</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={0.5}
              value={guidanceScale}
              onChange={(e) => onGuidanceScaleChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>1.0 (Criativo)</span>
              <span>7.5 (Padrão)</span>
              <span>20.0 (Rígido)</span>
            </div>
          </div>

          {/* Seed Fixa / Aleatória */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-semibold">Semente (Seed)</span>
              <button
                type="button"
                onClick={onRandomSeed}
                className="text-[10px] text-violet-400 hover:text-violet-300 font-mono cursor-pointer"
              >
                Aleatória
              </button>
            </div>
            <input
              type="text"
              value={seed}
              onChange={(e) => onSeedChange(e.target.value)}
              placeholder="Vazio para semente aleatória..."
              className="w-full bg-[#13141B] border border-[#1E202E] rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-violet-500"
            />
          </div>

          {/* Prompt Negativo */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-semibold">Prompt Negativo</span>
              <span className="text-[10px] text-slate-500 font-mono">O que evitar</span>
            </div>
            <textarea
              value={negativePrompt}
              onChange={(e) => onNegativePromptChange(e.target.value)}
              rows={2}
              placeholder="Ex: blurry, deformed anatomy, bad hands, low quality, watermark..."
              className="w-full bg-[#13141B] border border-[#1E202E] rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500 resize-none leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
}
