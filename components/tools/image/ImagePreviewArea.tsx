"use client";

import React from "react";
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
  return (
    <>
      <div className="space-y-4 bg-[#0D0E12] border border-[#1E202E] p-4 sm:p-5 rounded-2xl shadow-xl">
        {/* Header do Preview */}
        <div className="flex items-center justify-between border-b border-[#1E202E] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Preview
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="p-1.5 rounded-lg bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
              title="Tela Cheia"
              style={{ minHeight: "32px" }}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Tela Cheia</span>
            </button>

            <button
              type="button"
              onClick={onCopyPrompt}
              className="p-1.5 rounded-lg bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Copiar Prompt"
              style={{ minHeight: "32px", minWidth: "32px" }}
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Canvas Principal com Imagem Ativa */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1E202E] bg-slate-100/90 dark:bg-black/80 flex items-center justify-center min-h-[380px] max-h-[480px] shadow-sm dark:shadow-2xl">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-0.5 animate-spin">
                <div className="h-full w-full bg-white dark:bg-[#070709] rounded-2xl flex items-center justify-center">
                  <Wand2 className="h-6 w-6 text-cyan-600 dark:text-cyan-300 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-white font-heading">
                  {activeStepText || "Renderizando na GPU..."}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Taxa de amostragem: {inferenceSteps} steps
                </p>
              </div>
            </div>
          ) : activeResultUrl ? (
            <img
              src={activeResultUrl}
              alt="Preview Gerado"
              className="w-full h-full object-contain max-h-[460px] rounded-xl transition-all duration-300 hover:scale-[1.01]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-slate-400 dark:text-slate-500">
              <div className="h-16 w-16 rounded-2xl bg-white dark:bg-[#0D0E12] border border-slate-200 dark:border-[#1E202E] flex items-center justify-center text-slate-400 shadow-sm">
                <Wand2 className="h-7 w-7 text-violet-500 dark:text-violet-400/60" />
              </div>
              <div className="space-y-1 max-w-xs">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Área de Visualização</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
                  Digite seu prompt e clique em <strong>Gerar Imagem</strong> para ver o resultado em tempo real.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Carrossel Inferior com Gerações Recentes Reais do Usuário */}
        {variations.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Gerações Recentes</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onPrevVariation}
                  className="p-1 rounded bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onNextVariation}
                  className="p-1 rounded bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {variations.map((url, idx) => {
                const isActive = activeResultUrl === url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectVariation(url, idx)}
                    className={`relative rounded-xl overflow-hidden border aspect-square cursor-pointer transition-all ${
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
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#1E202E]">
            <button
              type="button"
              onClick={onDownload}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              title="Download em alta resolução"
              style={{ minHeight: "38px" }}
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Baixar</span>
            </button>

            <button
              type="button"
              onClick={onVary}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              title="Gerar variação com mesma seed"
              style={{ minHeight: "38px" }}
            >
              <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
              <span>Variar</span>
            </button>

            <button
              type="button"
              onClick={onUpscale}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              title="Restauração neural em 4K"
              style={{ minHeight: "38px" }}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Upscale 4K</span>
            </button>

            <button
              type="button"
              onClick={onSendToFlow}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              title="Enviar para o VORIXA FLOW"
              style={{ minHeight: "38px" }}
            >
              <Boxes className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate">Usar no Canvas</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de Tela Cheia */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={onDownload}
              className="px-3 py-1.5 rounded-xl bg-[#13141B] border border-[#1E202E] hover:border-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Baixar</span>
            </button>
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="p-2 rounded-xl bg-[#13141B] border border-[#1E202E] hover:border-slate-700 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <img
            src={activeResultUrl}
            alt="Tela Cheia"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
