"use client";

import React, { useEffect } from "react";
import { useFlowStore } from "@/stores/flow-store";
import { isSafeMediaUrl } from "@/lib/flow-utils";
import { X, Download } from "lucide-react";

/**
 * Visualizador de Mídia Lightbox de Alta Fidelidade do VORIXA FLOW.
 */
export function MediaLightbox() {
  const { lightboxMedia, setLightboxMedia } = useFlowStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxMedia) {
        setLightboxMedia(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxMedia, setLightboxMedia]);

  if (!lightboxMedia) return null;

  // Sanitização estrita de segurança preventiva contra esquemas perigosos
  if (!isSafeMediaUrl(lightboxMedia.url)) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visualizador de Mídia"
      onClick={() => setLightboxMedia(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[90vh] rounded-3xl bg-slate-950 border border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
      >
        {/* Header do Lightbox */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-100">{lightboxMedia.title || "Visualização de Mídia"}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase">
              {lightboxMedia.type}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={lightboxMedia.url}
              download={`vorixa-${Date.now()}.${lightboxMedia.type === "video" ? "mp4" : "jpg"}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4" /> Download
            </a>
            <button
              onClick={() => setLightboxMedia(null)}
              aria-label="Fechar visualizador"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visualizador da Mídia */}
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
          {lightboxMedia.type === "video" ? (
            <video
              src={lightboxMedia.url}
              controls
              autoPlay
              loop
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
            />
          ) : (
            <img
              src={lightboxMedia.url}
              alt="Mídia Gerada no VORIXA FLOW"
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
            />
          )}
        </div>

        {/* Prompt ou Descrição Associada */}
        {lightboxMedia.prompt && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-300">
            <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px] mb-1">
              Prompt Original
            </span>
            <p className="line-clamp-3 leading-relaxed font-sans">{lightboxMedia.prompt}</p>
          </div>
        )}
      </div>
    </div>
  );
}
