"use client";

import React, { useRef } from "react";
import { Upload, RefreshCw } from "lucide-react";
import { CreationMode } from "./types";

interface ImageReferenceUploaderProps {
  creationMode: CreationMode;
  referenceImageUrl: string;
  isUploadingRef: boolean;
  denoiseStrength: number;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onChangeDenoiseStrength: (val: number) => void;
}

export function ImageReferenceUploader({
  creationMode,
  referenceImageUrl,
  isUploadingRef,
  denoiseStrength,
  onFileUpload,
  onRemoveImage,
  onChangeDenoiseStrength,
}: ImageReferenceUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (creationMode === "text-to-image") {
    return null;
  }

  return (
    <div className="p-3 rounded-xl bg-[#070709] border border-violet-500/40 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-violet-300">
          {creationMode === "image-to-image"
            ? "Imagem Base de Entrada"
            : creationMode === "style-ref"
            ? "Imagem de Estilo / Paleta"
            : "Imagem de Referência do Rosto"}
        </span>
        {referenceImageUrl && (
          <button
            type="button"
            onClick={onRemoveImage}
            className="text-red-400 hover:text-red-300 text-[11px] font-mono cursor-pointer"
          >
            Remover
          </button>
        )}
      </div>

      {referenceImageUrl ? (
        <div className="relative h-28 rounded-lg overflow-hidden border border-[#1E202E]">
          <img src={referenceImageUrl} alt="Referência" className="h-full w-full object-cover" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingRef}
          className="w-full border-2 border-dashed border-[#1E202E] hover:border-violet-500/80 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          {isUploadingRef ? (
            <RefreshCw className="w-5 h-5 animate-spin text-violet-400" />
          ) : (
            <Upload className="w-5 h-5 text-violet-400" />
          )}
          <span className="text-xs font-semibold">Clique para carregar imagem</span>
          <span className="text-[10px] text-slate-500 font-mono">PNG, JPG até 50MB</span>
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileUpload}
        className="hidden"
      />

      {creationMode === "image-to-image" && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span>Intensidade de Variação (Denoise)</span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {denoiseStrength <= 0.45 ? "(Preserva Rosto e Traços 👤)" : "(Cria Nova Pessoa ✨)"}
              </span>
            </span>
            <span className="font-mono text-cyan-400 font-bold">{denoiseStrength}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.05}
            value={denoiseStrength}
            onChange={(e) => onChangeDenoiseStrength(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <p className="text-[10px] text-slate-400 leading-tight">
            💡 Para manter a pessoa igual e só mudar o estilo/qualidade 8K, mantenha entre{" "}
            <strong className="text-emerald-400">0.30 e 0.40</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
