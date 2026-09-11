"use client";

import React, { useState } from "react";
import { ChevronRight, Sparkles, X, Check } from "lucide-react";
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

  const currentToolDef = TOOLS[activeTool];
  const currentModelDef =
    currentToolDef.models.find((m) => m.id === selectedModelId) ||
    currentToolDef.models[0];

  return (
    <>
      <div className="space-y-3">
        {/* Atalho/Seção sutil: Usar Modelo da Vitrine / Casting */}
        {onOpenModelShowcasePicker && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-violet-950/40 to-[#13141B] border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-violet-950/20">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl shrink-0">🎭</span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-bold text-white truncate">
                    {hasActiveShowcaseModel ? "Trocar Modelo da Vitrine" : "Casting & Vitrine de Modelos"}
                  </h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold uppercase">
                    Identidade Fixa
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {hasActiveShowcaseModel
                    ? "Modelo carregado com consistência facial e gatilho ativo."
                    : "Selecione um rosto do catálogo da vitrine para consistência facial."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenModelShowcasePicker}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-200" />
              <span>{hasActiveShowcaseModel ? "Trocar Modelo" : "Escolher da Vitrine"}</span>
            </button>
          </div>
        )}

        {/* Card Compacto Estilo Foto/Vídeo (Otimização de Espaço) */}
        <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-xl">
          {/* Header com Marcador Circular e Título */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#13141B] border border-[#1E202E] flex items-center justify-center text-xs font-bold text-slate-300">
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

            <span className="text-[10px] font-mono text-violet-400 font-semibold px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 shrink-0">
              {currentModelDef.cost} crédito{currentModelDef.cost > 1 ? "s" : ""}
            </span>
          </div>

          {/* Card do Modelo Selecionado com Botão 'Alterar modelo >' */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#070709] border border-violet-500/40 ring-1 ring-violet-500/20 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              {/* Logo Oficial do Motor */}
              <ModelLogo modelId={currentModelDef.id} size="md" />

              <div className="min-w-0">
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
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                  {currentModelDef.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#13141B] hover:bg-[#1a1b24] border border-[#1E202E] hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto shrink-0 shadow-sm"
            >
              <span>Alterar modelo</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
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
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {QUALITY_MODES.map((mode) => {
                const isSelected = qualityMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onSelectQualityMode(mode.id, mode.steps, mode.modelId)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[48px] ${
                      isSelected
                        ? "bg-[#13141B] border-violet-500 shadow-md shadow-violet-500/20 ring-1 ring-violet-500/50"
                        : "bg-[#070709] border-[#1E202E] hover:border-slate-700 opacity-85 hover:opacity-100"
                    }`}
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

      {/* Modal de Troca de Motor de IA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl w-full max-w-xl p-4 sm:p-5 space-y-4 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Header do Modal */}
            <div className="flex items-center justify-between border-b border-[#1E202E] pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Selecione o Motor de IA
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  {activeTool === "image"
                    ? "Cada motor oferece resolução, fidelidade facial e velocidade distintas."
                    : activeTool === "video"
                    ? "Motores com áudio nativo, física cinematográfica e 1-clique com fala."
                    : "Selecione o motor ideal para esta ferramenta."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[#13141B] hover:bg-[#1a1b24] border border-[#1E202E] text-slate-400 hover:text-white cursor-pointer transition-colors"
                aria-label="Fechar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Lista de Modelos com Logos Oficiais e Badges */}
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {currentToolDef.models.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model.id);
                      setIsModalOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#13141B] border-violet-500 shadow-md shadow-violet-500/20 ring-1 ring-violet-500/50"
                        : "bg-[#070709] border-[#1E202E] hover:border-slate-700 hover:bg-[#0c0d12]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ModelLogo modelId={model.id} size="md" />
                      <div className="min-w-0">
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
                        <p className="text-[11px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                          {model.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                          <span>⚡ {model.speed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20 whitespace-nowrap">
                        {model.cost} cr
                      </span>
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-[#1E202E] bg-[#13141B]" />
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
