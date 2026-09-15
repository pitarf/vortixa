"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, Sparkles, X, Check } from "lucide-react";
import { VIDEO_MODELS, VideoModelDef } from "./types";
import { ModelLogo } from "./ModelLogo";
import { toast } from "sonner";

interface VideoModelSectionProps {
  selectedModel: VideoModelDef;
  onSelectModel: (model: VideoModelDef) => void;
}

export function VideoModelSection({
  selectedModel,
  onSelectModel,
}: VideoModelSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Bloqueia rolagem do body e adiciona listener de ESC
  useEffect(() => {
    if (isModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsModalOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isModalOpen]);

  return (
    <>
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
        {/* Header com Marcador Circular 2 */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#13141B] border border-[#1E202E] flex items-center justify-center text-xs font-bold text-slate-300 font-mono">
            2
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Motor de IA</h2>
            <p className="text-[11px] text-slate-400">Escolha o modelo ideal para o seu vídeo</p>
          </div>
        </div>

        {/* Card do Modelo Selecionado com Botão 'Alterar modelo >' */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#070709] border border-violet-500/50 ring-1 ring-violet-500/20 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo Oficial do Motor de IA */}
            <ModelLogo modelId={selectedModel.id} size="md" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold text-white truncate">
                  {selectedModel.name}
                </span>
                {selectedModel.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider whitespace-nowrap">
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
            className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#13141B] hover:bg-[#1a1b24] border border-[#1E202E] hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto shrink-0 active:scale-95"
          >
            <span>Alterar modelo</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Barra de Seleção Rápida de Motor no Celular */}
        <div className="pt-2 border-t border-[#1E202E]/60">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Motores de Vídeo Rápidos:
            </span>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-[10px] text-violet-400 hover:text-violet-300 font-bold cursor-pointer"
            >
              Ver todos ({VIDEO_MODELS.length}) &gt;
            </button>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 touch-pan-x">
            {VIDEO_MODELS.map((m) => {
              const isCurrent = selectedModel.id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onSelectModel(m);
                    toast.success(`Motor "${m.name}" selecionado!`);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer min-h-[38px] active:scale-95 shrink-0 ${
                    isCurrent
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-400 text-white shadow-sm shadow-violet-600/30 ring-1 ring-violet-400/50"
                      : "bg-[#13141B] border-white/[0.08] text-slate-300 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <span>{m.name.split("(")[0].trim()}</span>
                  <span
                    className={`text-[9px] font-mono px-1 py-0.5 rounded ${
                      isCurrent ? "bg-black/30 text-violet-200 font-bold" : "bg-black/40 text-slate-400"
                    }`}
                  >
                    {m.cost}cr
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Troca de Modelo de IA Teletransportado via Portal para document.body */}
      {mounted && isModalOpen && typeof document !== "undefined" && createPortal(
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
          className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overscroll-contain animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0D0E12] border-t sm:border border-[#1E202E] rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[88dvh] sm:max-h-[85vh] p-4 sm:p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200 flex flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6"
          >
            <div className="flex items-center justify-between border-b border-[#1E202E] pb-3 shrink-0">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Selecione o Motor de IA
                </h3>
                <p className="text-xs text-slate-400">
                  Cada motor oferece características únicas de movimento, áudio e custos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[#13141B] hover:bg-[#1a1b24] border border-[#1E202E] text-slate-400 hover:text-white cursor-pointer transition-colors"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto overscroll-contain touch-pan-y pr-1 flex-1">
              {VIDEO_MODELS.map((model) => {
                const isSelected = selectedModel.id === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model);
                      setIsModalOpen(false);
                      toast.success(`Motor "${model.name}" selecionado!`);
                    }}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all min-h-[56px] select-none touch-manipulation active:scale-[0.99] ${
                      isSelected
                        ? "bg-violet-600/15 border-violet-500 ring-1 ring-violet-500/40"
                        : "bg-[#070709] border-[#1E202E] hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Logo Oficial do Motor */}
                      <ModelLogo modelId={model.id} size="md" />
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white truncate">
                            {model.name}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 whitespace-nowrap">
                            {model.cost} cr
                          </span>
                          {model.isRecommended && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider whitespace-nowrap">
                              RECOMENDADO
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {model.description}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-0.5">
                          <span className="text-cyan-400 font-semibold">{model.badge}</span>
                          <span>{model.speed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-600/30">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-700 bg-[#13141B]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
