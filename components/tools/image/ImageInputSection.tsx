"use client";

import React, { useRef, useState } from "react";
import { Sparkles, Dices, Trash2, Upload, X, RefreshCw } from "lucide-react";
import { CreationMode } from "./types";

interface ImageInputSectionProps {
  creationMode: CreationMode;
  onSelectMode: (mode: CreationMode) => void;
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
  onOpenModelPicker?: () => void;
  activeModelName?: string | null;
}

export function ImageInputSection({
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
  onOpenModelPicker,
  activeModelName,
}: ImageInputSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  return (
    <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Abas Superiores de Fluxo com Scroll Horizontal Ergonômico Touch-Friendly */}
      <div className="flex items-center gap-1.5 p-1 bg-[#070709] border border-[#1E202E] rounded-xl overflow-x-auto scrollbar-none overscroll-x-contain touch-pan-x">
        <button
          type="button"
          onClick={() => onSelectMode("text-to-image")}
          className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap text-center min-h-[44px] flex items-center justify-center touch-manipulation select-none active:scale-[0.98] ${
            creationMode === "text-to-image"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-slate-400 hover:text-white hover:bg-[#13141B]"
          }`}
        >
          Texto para Imagem
        </button>
        <button
          type="button"
          onClick={() => onSelectMode("image-to-image")}
          className={`flex-1 min-w-[150px] sm:min-w-0 py-2.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap text-center min-h-[44px] flex items-center justify-center touch-manipulation select-none active:scale-[0.98] ${
            creationMode === "image-to-image"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-slate-400 hover:text-white hover:bg-[#13141B]"
          }`}
        >
          Imagem de Referência
        </button>
        <button
          type="button"
          onClick={() => onSelectMode("character")}
          className={`flex-1 min-w-[140px] sm:min-w-0 py-2.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap text-center min-h-[44px] flex items-center justify-center touch-manipulation select-none active:scale-[0.98] ${
            creationMode === "character"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-slate-400 hover:text-white hover:bg-[#13141B]"
          }`}
        >
          Mesmo Personagem
        </button>
      </div>

      {/* Caixa de Texto do Prompt */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => onChangePrompt(e.target.value)}
            rows={3}
            maxLength={1500}
            placeholder={
              creationMode === "image-to-image"
                ? "Descreva as alterações ou nova ambientação mantendo a composição original..."
                : "Uma mulher futurista em uma cidade cyberpunk, chuva neon, olhando para a câmera, ultra realista, cinematográfico, 8k"
            }
            className="w-full bg-[#070709] border border-[#1E202E] rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500/80 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Botões de Ação do Prompt: Inspirar, Prompt Aleatório, Limpar e Contador */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onOptimizePrompt}
              disabled={isOptimizing || !prompt.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#13141B] border border-[#1E202E] hover:border-violet-500/50 text-slate-300 hover:text-white text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer min-h-[40px] touch-manipulation active:scale-[0.98]"
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
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#13141B] border border-[#1E202E] hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer min-h-[40px] touch-manipulation active:scale-[0.98]"
            >
              <Dices className="w-3.5 h-3.5 text-cyan-400" />
              <span>Prompt Aleatório</span>
            </button>

            {prompt && (
              <button
                type="button"
                onClick={onClearPrompt}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#13141B] border border-[#1E202E] hover:border-slate-700 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all cursor-pointer min-h-[40px] touch-manipulation active:scale-[0.98]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            )}
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            {prompt.length}/1500
          </span>
        </div>
      </div>

      {/* Upload de Imagem de Referência quando ativado */}
      {(creationMode === "image-to-image" || creationMode === "character" || referenceImageUrl) && (
        <div className="space-y-2 pt-1 border-t border-[#1E202E]/60 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-medium text-slate-300 block">
              {creationMode === "character" ? "Foto do Personagem / Preservação Facial (PuLID)" : "Imagem de Referência"}
            </label>

            {onOpenModelPicker && (
              <button
                type="button"
                onClick={onOpenModelPicker}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#13141B] hover:bg-violet-600/20 border border-[#1E202E] hover:border-violet-500/50 text-slate-300 hover:text-violet-300 text-xs font-semibold transition-all cursor-pointer min-h-[44px] touch-manipulation active:scale-[0.98]"
              >
                <span className="text-sm">🎭</span>
                <span>{activeModelName ? `Modelo: ${activeModelName}` : "Escolher da Vitrine"}</span>
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#1E202E] hover:border-violet-500/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#070709]/60 hover:bg-[#070709] min-h-[100px] touch-manipulation"
            >
              {isUploadingRef ? (
                <div className="flex flex-col items-center gap-1.5">
                  <RefreshCw className="w-5 h-5 text-violet-400 animate-spin" />
                  <span className="text-xs text-slate-400">Enviando imagem...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-300">
                    Clique para enviar ou arraste
                  </span>
                  <span className="text-[10px] text-slate-500">JPG, PNG, WEBP (máx. 10MB)</span>
                </div>
              )}
            </div>

            <div className="relative rounded-xl overflow-hidden border border-[#1E202E] bg-[#070709] flex flex-col items-center justify-center min-h-[100px] aspect-[16/9] sm:aspect-auto">
              {referenceImageUrl ? (
                <>
                  <img
                    src={referenceImageUrl}
                    alt="Referência"
                    className="w-full h-full object-contain max-h-[140px]"
                  />
                  <button
                    type="button"
                    onClick={onRemoveReferenceImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-rose-600 text-white transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center touch-manipulation"
                    title="Remover imagem de referência"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 px-3 py-1 rounded-lg bg-black/85 text-xs font-bold text-white border border-white/25 hover:bg-black touch-manipulation"
                  >
                    Trocar Imagem
                  </button>
                </>
              ) : (
                <div className="p-3 text-center text-slate-600 text-xs">
                  Nenhuma imagem carregada
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
