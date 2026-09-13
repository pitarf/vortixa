"use client";

import React, { useRef, useState } from "react";
import { Upload, RefreshCw, X, Image as ImageIcon } from "lucide-react";
import { CreationMode } from "./types";

interface ImageReferenceUploaderProps {
  creationMode: CreationMode;
  referenceImageUrl: string;
  isUploadingRef: boolean;
  onFileUpload: (file: File) => void;
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
  const [isDragging, setIsDragging] = useState(false);

  if (creationMode === "text-to-image") {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#070709] border border-[#1E202E] space-y-3 shadow-inner w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-violet-300 flex items-center gap-1.5 font-mono">
          <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
          <span>
            {creationMode === "image-to-image"
              ? "Imagem Base de Entrada"
              : creationMode === "style-ref"
              ? "Imagem de Estilo / Paleta"
              : "Foto de Preservação Facial (PuLID)"}
          </span>
        </span>
        {referenceImageUrl && (
          <button
            type="button"
            onClick={onRemoveImage}
            className="text-rose-400 hover:text-rose-300 text-xs font-mono cursor-pointer min-h-[44px] min-w-[44px] px-2 py-1 flex items-center justify-end touch-manipulation"
          >
            Remover
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {referenceImageUrl ? (
        <div className="relative h-44 rounded-xl overflow-hidden border border-[#1E202E] bg-black/60 flex items-center justify-center group shadow-md">
          <img src={referenceImageUrl} alt="Referência" className="h-full w-full object-contain p-2" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2.5 px-4 py-2.5 rounded-xl bg-black/85 border border-white/20 text-white text-xs font-semibold hover:bg-black transition-colors min-h-[44px] touch-manipulation cursor-pointer"
          >
            Substituir Foto
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) onFileUpload(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2.5 text-slate-400 hover:text-slate-200 transition-all duration-300 cursor-pointer min-h-[140px] touch-manipulation active:scale-[0.99] ${
            isDragging
              ? "border-violet-500 bg-violet-950/20"
              : "border-[#1E202E] hover:border-violet-500/80 bg-[#0D0E12]/50"
          }`}
        >
          {isUploadingRef ? (
            <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
          ) : (
            <Upload className="w-6 h-6 text-violet-400" />
          )}
          <span className="text-xs font-bold text-slate-200 text-center">
            Clique para carregar ou arraste uma foto
          </span>
          <span className="text-[10px] text-slate-500 font-mono">JPG, PNG, WEBP até 25MB</span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="mt-1 px-4 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600 border border-violet-500/40 text-violet-300 hover:text-white text-xs font-bold min-h-[44px] flex items-center justify-center transition-all touch-manipulation"
          >
            Escolher Arquivo
          </button>
        </div>
      )}
    </div>
  );
}
