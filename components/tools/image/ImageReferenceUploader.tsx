"use client";

import React, { useRef } from "react";
import { Upload, RefreshCw } from "lucide-react";
import { CreationMode } from "./types";

interface ImageReferenceUploaderProps {
  creationMode: CreationMode;
  referenceImageUrl: string;
  isUploadingRef: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function ImageReferenceUploader({
  creationMode,
  referenceImageUrl,
  isUploadingRef,
  onFileUpload,
  onRemoveImage,
}: ImageReferenceUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (creationMode === "text-to-image") {
    return null;
  }

  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-[#070709] border border-violet-500/40 space-y-3">
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
            className="text-red-400 hover:text-red-300 text-xs font-mono cursor-pointer min-h-[44px] px-2 py-1 flex items-center touch-manipulation"
          >
            Remover
          </button>
        )}
      </div>

      {referenceImageUrl ? (
        <div className="relative h-36 rounded-xl overflow-hidden border border-[#1E202E] bg-black/60 flex items-center justify-center">
          <img src={referenceImageUrl} alt="Referência" className="h-full w-full object-contain" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingRef}
          className="w-full border-2 border-dashed border-[#1E202E] hover:border-violet-500/80 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer min-h-[110px] touch-manipulation active:scale-[0.99]"
        >
          {isUploadingRef ? (
            <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
          ) : (
            <Upload className="w-6 h-6 text-violet-400" />
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
    </div>
  );
}
