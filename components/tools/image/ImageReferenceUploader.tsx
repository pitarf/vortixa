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
    </div>
  );
}
