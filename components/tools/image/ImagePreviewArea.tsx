"use client";

import React, { useEffect } from "react";
import {
  Wand2,
  Maximize2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Zap,
  Boxes,
  X,
} from "lucide-react";

interface ImagePreviewAreaProps {
  isGenerating: boolean;
  activeStepText: string;
  activeResultUrl: string;
  inferenceSteps: number;
  variations: string[];
  activeVariationIndex: number;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onCopyPrompt: () => void;
  onSelectVariation: (url: string, index: number) => void;
  onNextVariation: () => void;
  onPrevVariation: () => void;
  onDownload: () => void;
  onVary: () => void;
  onUpscale: () => void;
  onSendToFlow: () => void;
}

export function ImagePreviewArea({
  isGenerating,
  activeStepText,
  activeResultUrl,
  inferenceSteps,
  variations,
  activeVariationIndex,
  isFullscreen,
  onToggleFullscreen,
  onCopyPrompt,
  onSelectVariation,
  onNextVariation,
  onPrevVariation,
  onDownload,
  onVary,
  onUpscale,
  onSendToFlow,
}: ImagePreviewAreaProps) {
  // Trava scroll de fundo quando modal fullscreen estiver ativo
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  return (
    <>
      <div className="space-y-4 bg-[#0D0E12] border border-[#1E202E] p-4 sm:p-5 rounded-3xl shadow-xl w-full">
        {/* Header do Preview */}
        <div className="flex items-center justify-between border-b border-[#1E202E] pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isGenerating ? "bg-amber-400 animate-ping" : activeResultUrl ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Preview em Tempo Real
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleFullscreen}
              disabled={!activeResultUrl}
              className="px-3 py-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 transition-colors text-xs flex items-center gap-1.5 cursor-pointer min-h-[44px] touch-manipulation active:scale-[0.98]"
              title="Tela Cheia"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="text-xs font-semibold hidden sm:inline">Tela Cheia</span>
            </button>

            <button
              type="button"
              onClick={onCopyPrompt}
              className="p-2.5 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation active:scale-[0.98]"
              title="Copiar Prompt"
              aria-label="Copiar prompt"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas Principal com Aspect-Ratio Reservado e Zero CLS */}
        <div className="relative rounded-2xl overflow-hidden border border-[#1E202E] bg-[#070709] flex items-center justify-center w-full aspect-video min-h-[280px] sm:min-h-[380px] max-h-[500px] shadow-2xl">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 animate-spin">
                <div className="h-full w-full bg-[#070709] rounded-2xl flex items-center justify-center">
                  <Wand2 className="h-6 w-6 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white font-heading">
                  {activeStepText || "Renderizando na GPU..."}
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Taxa de amostragem: {inferenceSteps} steps
                </p>
              </div>
            </div>
          ) : activeResultUrl ? (
            <img
              src={activeResultUrl}
              alt="Preview Gerado"
              className="w-full h-full object-contain max-h-[480px] rounded-xl transition-all duration-300 hover:scale-[1.01]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-slate-500">
              <div className="h-16 w-16 rounded-2xl bg-[#0D0E12] border border-[#1E202E] flex items-center justify-center text-slate-400 shadow-sm">
                <Wand2 className="h-7 w-7 text-violet-400/70" />
              </div>
              <div className="space-y-1 max-w-xs">
                <p className="text-sm font-bold text-slate-300 font-heading">Área de Visualização</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Digite seu prompt e clique em <strong>Gerar Imagem</strong> para ver o resultado em tempo real.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Carrossel Inferior com Gerações Recentes e Touch Confortável */}
        {variations.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold font-mono">Gerações Recentes</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrevVariation}
                  className="p-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                  title="Anterior"
                  aria-label="Variação anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onNextVariation}
                  className="p-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                  title="Próxima"
                  aria-label="Próxima variação"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex overflow-x-auto no-scrollbar overscroll-x-contain touch-pan-x gap-2 pb-1">
              {variations.map((url, idx) => {
                const isActive = activeResultUrl === url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectVariation(url, idx)}
                    className={`relative rounded-xl overflow-hidden border aspect-square cursor-pointer transition-all min-h-[56px] min-w-[56px] shrink-0 touch-manipulation active:scale-[0.98] ${
                      isActive
                        ? "border-cyan-400 shadow-md shadow-cyan-400/30 ring-1 ring-cyan-400 scale-[1.02]"
                        : "border-[#1E202E] hover:border-slate-600 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Variação ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Barra de Ações Rápidas abaixo do Preview */}
        {Boolean(activeResultUrl) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1E202E]">
            <button
              type="button"
              onClick={onDownload}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer min-h-[44px] touch-manipulation active:scale-[0.98]"
              title="Download em alta resolução"
            >
              <Download className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Baixar</span>
            </button>

            <button
              type="button"
              onClick={onVary}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer min-h-[44px] touch-manipulation active:scale-[0.98]"
              title="Gerar variação com mesma seed"
            >
              <RefreshCw className="w-4 h-4 text-violet-400 shrink-0" />
              <span>Variar</span>
            </button>

            <button
              type="button"
              onClick={onUpscale}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer min-h-[44px] touch-manipulation active:scale-[0.98]"
              title="Restauração neural em 4K"
            >
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Upscale 4K</span>
            </button>

            <button
              type="button"
              onClick={onSendToFlow}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer min-h-[44px] touch-manipulation active:scale-[0.98]"
              title="Enviar para o VORTIXIA FLOW"
            >
              <Boxes className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">No Flow</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de Tela Cheia com overscroll-contain e trava de scroll de fundo */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-3 sm:p-6 backdrop-blur-md overscroll-contain touch-none"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full flex items-center justify-between pb-3 max-w-6xl">
            <span className="text-xs font-mono text-slate-400">Visualização Completa</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDownload}
                className="px-4 py-2 rounded-xl bg-[#13141B] border border-[#1E202E] hover:border-slate-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer min-h-[44px] touch-manipulation active:scale-[0.98]"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Baixar Imagem</span>
              </button>
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="p-2.5 rounded-xl bg-[#13141B] border border-[#1E202E] hover:border-slate-700 text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation active:scale-[0.98]"
                aria-label="Fechar tela cheia"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full flex items-center justify-center overflow-auto p-2">
            <img
              src={activeResultUrl}
              alt="Tela Cheia"
              className="max-h-[80vh] sm:max-h-[85vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
