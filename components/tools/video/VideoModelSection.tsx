"use client";

import React, { useState } from "react";
import { ChevronRight, Sparkles, X, Check } from "lucide-react";
import { VIDEO_MODELS, VideoModelDef } from "./types";
import { ModelLogo } from "./ModelLogo";

interface VideoModelSectionProps {
  selectedModel: VideoModelDef;
  onSelectModel: (model: VideoModelDef) => void;
}

export function VideoModelSection({
  selectedModel,
  onSelectModel,
}: VideoModelSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
        {/* Header com Marcador Circular 2 */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#13141B] border border-[#1E202E] flex items-center justify-center text-xs font-bold text-slate-300">
            2
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Motor de IA</h2>
            <p className="text-[11px] text-slate-400">Escolha o modelo ideal para o seu vídeo</p>
          </div>
        </div>

        {/* Card do Modelo Selecionado com Botão 'Alterar modelo >' */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#070709] border border-violet-500/50 ring-1 ring-violet-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            {/* Logo Oficial do Motor de IA */}
            <ModelLogo modelId={selectedModel.id} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white">
                  {selectedModel.name}
                </span>
                {selectedModel.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                    {selectedModel.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                {selectedModel.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#13141B] hover:bg-[#1a1b24] border border-[#1E202E] hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto"
          >
            <span>Alterar modelo</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Modal de Troca de Modelo de IA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl w-full max-w-xl p-5 space-y-4 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#1E202E] pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Selecione o Motor de IA
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cada motor oferece características únicas de movimento, áudio e custos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-[#13141B] hover:bg-[#1a1b24] border border-[#1E202E] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {VIDEO_MODELS.map((model) => {
                const isSelected = selectedModel.id === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model);
                      setIsModalOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-violet-600/15 border-violet-500 ring-1 ring-violet-500/40"
                        : "bg-[#070709] border-[#1E202E] hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Logo Oficial do Motor */}
                      <ModelLogo modelId={model.id} size="md" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {model.name}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                            {model.cost} cr
                          </span>
                          {model.isRecommended && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              RECOMENDADO
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {model.description}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mt-1">
                          <span className="text-cyan-400">{model.badge}</span>
                          <span>{model.speed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-700" />
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
