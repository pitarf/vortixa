"use client";

import React, { useRef } from "react";
import { Sparkles, Dices, Trash2, Upload, X, RefreshCw, MessageSquareQuote } from "lucide-react";
import { VideoCreationMode } from "./types";

interface VideoInputSectionProps {
  creationMode: VideoCreationMode;
  onSelectMode: (mode: VideoCreationMode) => void;
  prompt: string;
  onChangePrompt: (prompt: string) => void;
  referenceImageUrl: string;
  onRemoveReferenceImage: () => void;
  onUploadImage: (file: File) => void;
  isUploadingRef: boolean;
  onInspirationPrompt: () => void;
  onClearPrompt: () => void;
  onOptimizePrompt: () => void;
  isOptimizing: boolean;
}

export function VideoInputSection({
  creationMode,
  onSelectMode,
  prompt,
  onChangePrompt,
  referenceImageUrl,
  onRemoveReferenceImage,
  onUploadImage,
  isUploadingRef,
  onInspirationPrompt,
  onClearPrompt,
  onOptimizePrompt,
  isOptimizing,
}: VideoInputSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  return (
    <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* 1. Header do Bloco com Marcador Circular */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-[#13141B] border border-[#1E202E] flex items-center justify-center text-xs font-bold text-slate-300">
          1
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">Entrada</h2>
          <p className="text-[11px] text-slate-400">Envie uma imagem ou descreva sua ideia</p>
        </div>
      </div>

      {/* Seletor de Modo: Texto para Vídeo | Imagem para Vídeo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 bg-[#070709] border border-[#1E202E] rounded-xl">
        <button
          type="button"
          onClick={() => onSelectMode("text-to-video")}
          className={`min-h-[44px] py-2.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center ${
            creationMode === "text-to-video"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Texto para Vídeo
        </button>
        <button
          type="button"
          onClick={() => onSelectMode("image-to-video")}
          className={`min-h-[44px] py-2.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center ${
            creationMode === "image-to-video"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Imagem para Vídeo
        </button>
      </div>

      {/* Dica para Vídeo com Fala Nativa */}
      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-violet-950/30 border border-violet-500/30 text-violet-200 text-[11px] leading-relaxed">
        <MessageSquareQuote className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-violet-300 font-semibold">Dica de Fala em Português:</strong> Para a modelo falar em português, coloque o diálogo obrigatoriamente <strong className="text-amber-300 underline underline-offset-2 font-bold">entre aspas</strong> (ex: <em className="text-white">"Gostou? Compre no link oficial!"</em>). Sem aspas, a instrução será interpretada como ação de cena e traduzida para o inglês.
        </span>
      </div>

      {/* Caixa de Texto do Prompt com Borda Arredondada e Contador */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => onChangePrompt(e.target.value)}
            rows={3}
            maxLength={1500}
            placeholder={
              creationMode === "image-to-video"
                ? 'Descreva a movimentação ou fala... Ex: A moça sorri para a câmera e diz "Essa coleção está incrível!", zoom cinematográfico suave'
                : 'Uma mulher elegante em estúdio, olhando para a câmera e dizendo "Sejam todos muito bem-vindos ao Vorixa!", iluminação suave 8k.'
            }
            className="w-full bg-[#070709] border border-[#1E202E] rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500/80 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Botões de Ação do Prompt: Inspirar, Prompt Aleatório, Limpar e Contador */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={onOptimizePrompt}
              disabled={isOptimizing || !prompt.trim()}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#13141B] border border-[#1E202E] hover:border-violet-500/50 text-slate-300 hover:text-white text-[11px] font-medium transition-all disabled:opacity-40 cursor-pointer"
            >
              {isOptimizing ? (
                <RefreshCw className="w-3.5 h-3.5 text-violet-400 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              )}
              <span>Inspirar</span>
            </button>

            <button
              type="button"
              onClick={onInspirationPrompt}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#13141B] border border-[#1E202E] hover:border-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-all cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5 text-cyan-400" />
              <span>Prompt Aleatório</span>
            </button>

            <button
              type="button"
              onClick={onClearPrompt}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#13141B] border border-[#1E202E] hover:border-slate-700 text-slate-400 hover:text-rose-400 text-[11px] font-medium transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            {prompt.length}/1500
          </span>
        </div>
      </div>

      {/* Seletor / Upload de Imagem de Referência */}
      <div className="space-y-2 pt-1 border-t border-[#1E202E]/60">
        <label className="text-[11px] font-medium text-slate-400 block">
          Ou use uma imagem de referência <span className="text-slate-500">(opcional)</span>
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
          {/* Caixa de Drop / Upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#1E202E] hover:border-violet-500/60 rounded-xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#070709]/60 hover:bg-[#070709]"
            style={{ minHeight: "100px" }}
          >
            {isUploadingRef ? (
              <div className="flex flex-col items-center gap-1.5">
                <RefreshCw className="w-5 h-5 text-violet-400 animate-spin" />
                <span className="text-[11px] text-slate-400">Enviando imagem...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-300">
                  Clique para enviar uma imagem
                </span>
                <span className="text-[10px] text-slate-500">ou arraste aqui</span>
                <span className="text-[9px] text-slate-600 font-mono">JPG, PNG, WEBP (máx. 10MB)</span>
              </div>
            )}
          </div>

          {/* Miniatura da Imagem Atual com botão de Trocar e Fechar */}
          <div className="relative rounded-xl overflow-hidden border border-[#1E202E] bg-[#070709] flex flex-col items-center justify-center min-h-[110px] w-full">
            {referenceImageUrl ? (
              <>
                <img
                  src={referenceImageUrl}
                  alt="Referência"
                  className="w-full h-full object-cover max-h-[130px]"
                />
                <button
                  type="button"
                  onClick={onRemoveReferenceImage}
                  className="absolute top-1.5 right-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                  title="Remover imagem"
                  aria-label="Remover imagem de referência"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[44px] px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-[11px] font-bold text-white border border-white/20 backdrop-blur-sm cursor-pointer flex items-center justify-center"
                  >
                    Trocar imagem
                  </button>
                </div>
              </>
            ) : (
              <div className="p-3 text-center text-slate-600 text-[11px]">
                Nenhuma imagem anexada
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
