"use client";

import React, { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, Video, Music } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
  accept: string;
  maxSizeMB?: number;
  label: string;
  onUploadSuccess: (url: string) => void;
  onClear: () => void;
}

export function FileUploader({
  accept,
  maxSizeMB = 50,
  label,
  onUploadSuccess,
  onClear,
}: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndUpload = async (selectedFile: File) => {
    // Valida tamanho
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      toast.error(`O arquivo excede o limite máximo de ${maxSizeMB}MB.`);
      return;
    }

    // Mapeia preview
    setFile(selectedFile);
    if (selectedFile.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl("");
    }

    setUploading(true);
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setProgress(50);
      const res = await fetch("/api/tools/upload", {
        method: "POST",
        body: formData,
      });

      setProgress(80);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Falha ao enviar arquivo.");
      }

      const data = await res.json();
      setProgress(100);
      onUploadSuccess(data.url);
      toast.success("Arquivo carregado com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro no upload.");
      clearFile();
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl("");
    setProgress(0);
    onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-violet-500 rounded-xl p-6 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center bg-slate-900/50 hover:bg-slate-900 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-violet-500"
          style={{ minHeight: "44px" }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
          <Upload className="h-8 w-8 text-violet-400 mb-2 animate-pulse" />
          <p className="text-sm font-semibold text-slate-200">
            Clique para selecionar ou arraste o arquivo aqui
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Formatos suportados: {accept} (Max {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 relative">
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 p-2 rounded-full text-slate-400 hover:text-white transition-colors"
            style={{ minWidth: "44px", minHeight: "44px" }}
            aria-label="Remover arquivo"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            {file.type.startsWith("image/") ? (
              <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-800 bg-black flex-shrink-0">
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                )}
              </div>
            ) : file.type.startsWith("video/") ? (
              <div className="h-12 w-12 rounded-lg bg-violet-950/40 border border-violet-800/50 flex items-center justify-center text-violet-400 flex-shrink-0">
                <Video className="h-6 w-6" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-lg bg-violet-950/40 border border-violet-800/50 flex items-center justify-center text-violet-400 flex-shrink-0">
                <Music className="h-6 w-6" />
              </div>
            )}

            <div className="overflow-hidden pr-8">
              <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
              <p className="text-xs text-slate-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          {uploading && (
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-violet-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
