"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Sparkles, X, Check, Zap } from "lucide-react";
import { StudioTool, TOOLS, QUALITY_MODES } from "./types";
import { ModelLogo } from "@/components/tools/video/ModelLogo";

interface StudioModelSelectorProps {
  activeTool: StudioTool;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  qualityMode?: string;
  onSelectQualityMode?: (modeId: string, steps: number, modelId: string) => void;
  onOpenModelShowcasePicker?: () => void;
  hasActiveShowcaseModel?: boolean;
}

export function StudioModelSelector({
  activeTool,
  selectedModelId,
  onSelectModel,
  qualityMode,
  onSelectQualityMode,
  onOpenModelShowcasePicker,
  hasActiveShowcaseModel,
}: StudioModelSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Previne rolagem da página ao abrir modal
  useEffect(() => {
    if (isModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isModalOpen]);

  const currentToolDef = TOOLS[activeTool];
  const currentModelDef =
    currentToolDef.models.find((m) => m.id === selectedModelId) ||
    currentToolDef.models[0];

  return (
    <>
      <div className="space-y-3.5">
        {/* Atalho de Alto Luxo: Usar Modelo da Vitrine / Casting */}
        {onOpenModelShowcasePicker && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#13141B] to-[#0E1017] border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600/30 to-fuchsia-600/30 border border-violet-500/40 flex items-center justify-center text-lg shrink-0 shadow-inner">
                🎭
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-bold text-white tracking-tight truncate">
                    {hasActiveShowcaseModel ? "Trocar Modelo da Vitrine" : "Casting & Vitrine de Modelos"}
                  </h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold uppercase tracking-wider shrink-0">
                    Identidade Fixa
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {hasActiveShowcaseModel
                    ? "Modelo vinculado com consistência facial e gatilho ativo."
                    : "Selecione um rosto do catálogo da vitrine para consistência facial."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenModelShowcasePicker}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-violet-600/25 transition-all active:scale-95 cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-200" />
              <span>{hasActiveShowcaseModel ? "Trocar Modelo" : "Escolher da Vitrine"}</span>
            </button>
          </div>
        )}

        {/* Card do Motor de IA com Dark Obsidian e Vidro Translúcido */}
        <div className="backdrop-blur-xl bg-[#0E1017]/85 border border-white/[0.08] rounded-2xl p-3.5 sm:p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#13141B] border border-white/[0.1] flex items-center justify-center text-xs font-bold text-slate-300 font-mono shadow-sm">
                2
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  Motor de IA
                </h2>
                <p className="text-[11px] text-slate-400">
                  {activeTool === "image"
                    ? "Escolha o modelo ideal para a sua imagem"
                    : activeTool === "video"
                    ? "Escolha o modelo ideal para o seu vídeo"
                    : "Escolha o motor de inferência"}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-violet-300 font-bold px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 shrink-0">
              {currentModelDef.cost} crédito{currentModelDef.cost > 1 ? "s" : ""}
            </span>
          </div>

          {/* Card do Modelo Selecionado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gradient-to-r from-violet-950/20 via-[#070709] to-[#0D0E12] border border-violet-500/40 ring-1 ring-violet-500/20 rounded-xl shadow-inner">
            <div className="flex items-center gap-3 min-w-0">
              <ModelLogo modelId={currentModelDef.id} size="md" />

              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-extrabold text-white truncate">
                    {currentModelDef.name}
                  </span>
                  {currentModelDef.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider whitespace-nowrap">
                      {currentModelDef.badge}
                    </span>
                  )}
                  {currentModelDef.requiresReferenceImage && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30 uppercase tracking-wider whitespace-nowrap">
                      📷 Exige Foto
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight line-clamp-1">
                  {currentModelDef.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#13141B] hover:bg-[#1B1D28] border border-white/[0.08] hover:border-violet-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto shrink-0 shadow-sm active:scale-95"
            >
              <span>Alterar modelo</span>
              <ChevronRight className="w-3.5 h-3.5 text-violet-400" />
            </button>
          </div>
        </div>

        {/* Seção Qualidade / Modo (apenas para ferramenta de imagem) */}
        {activeTool === "image" && onSelectQualityMode && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Modo de Qualidade / Passos
              </label>
              <span className="text-[10px] font-mono text-slate-500">Inferência adaptativa</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {QUALITY_MODES.map((mode) => {
                const isSelected = qualityMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onSelectQualityMode(mode.id, mode.steps, mode.modelId)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[48px] ${
                      isSelected
                        ? "bg-gradient-to-b from-[#1E202E] to-[#13141B] border-violet-500 text-white shadow-md shadow-violet-500/20 ring-1 ring-violet-500/50"
                        : "bg-[#070709] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/[0.12]"
                    }`}
                  >
                    <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-300"}`}>
                      {mode.name}
                    </span>
                    <span className="text-[10px] font-mono text-violet-300 font-semibold">
                      {mode.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Adaptativo de Troca de Motor de IA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-end sm:items-center justify-center p-0 sm:p-4 overscroll-contain animate-in fade-in duration-200">
          <div className="bg-[#0E1017] border-t sm:border border-white/[0.1] rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[88dvh] sm:max-h-[85vh] p-4 sm:p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200 flex flex-col pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5 shrink-0">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Selecione o Motor de IA
                </h3>
                <p className="text-xs text-slate-400">
                  {activeTool === "image"
                    ? "Cada motor oferece fidelidade, estilo e velocidade distintos."
                    : activeTool === "video"
                    ? "Motores cinematográficos com física neural e áudio nativo."
                    : "Selecione o motor ideal para esta ferramenta."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[#13141B] hover:bg-[#1B1D28] border border-white/[0.08] text-slate-400 hover:text-white cursor-pointer transition-colors"
                aria-label="Fechar modal de motores"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto overscroll-contain touch-pan-y pr-1 flex-1">
              {currentToolDef.models.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      setIsModalOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 min-h-[48px] ${
                      isSelected
                        ? "bg-gradient-to-r from-violet-950/40 via-[#13141B] to-[#0E1017] border-violet-500 shadow-md shadow-violet-500/20 ring-1 ring-violet-500/50"
                        : "bg-[#070709] border-white/[0.06] hover:border-slate-700 hover:bg-[#0c0d12]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <ModelLogo modelId={model.id} size="md" />
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-white truncate">
                            {model.name}
                          </span>
                          {model.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                              {model.badge}
                            </span>
                          )}
                          {model.requiresReferenceImage && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30 uppercase tracking-wider">
                              📷 Exige Foto
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">
                          {model.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono pt-0.5">
                          <span className="flex items-center gap-1 text-cyan-400">
                            <Zap className="w-3 h-3" /> {model.speed}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/25 whitespace-nowrap">
                        {model.cost} cr
                      </span>
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-600/30">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-white/[0.1] bg-[#13141B]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
