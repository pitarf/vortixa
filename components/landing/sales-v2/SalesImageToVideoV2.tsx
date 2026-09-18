"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight, ArrowLeftRight } from "lucide-react";

/**
 * Seção Editorial de Imagem para Vídeo:
 * Demonstração prática do antes (Foto estática de corpo todo) e depois (Vídeo animado com fala em Português).
 * Mídia real gerada no VORIXA com Kling Pro: "Estou pronta para a Festa da Virginia, Você também vai?".
 */
export function SalesImageToVideoV2() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMute = !isMuted;
      videoRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  };

  return (
    <section className="py-12 sm:py-16 px-3 sm:px-6 max-w-7xl mx-auto space-y-10 sm:space-y-12 w-full">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl mx-auto">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-sans tracking-widest text-cyan-400 uppercase font-medium">
            Foto para Vídeo & Fala Nativa
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-tight">
            Dê vida e voz a qualquer{" "}
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              imagem estática
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
            Veja a transformação: uma fotografia estática de corpo todo convertida em um vídeo com caminhada elegante, expressão facial viva e fala natural em português brasileiro.
          </p>
        </div>

        {/* Controles de Reprodução */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] text-xs font-medium text-slate-200 transition-all cursor-pointer min-h-[42px]"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-current" />
            )}
            <span>{isPlaying ? "Pausar" : "Reproduzir"}</span>
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-medium transition-all cursor-pointer min-h-[42px] ${
              !isMuted
                ? "bg-white text-slate-950 font-semibold border-white"
                : "bg-white/[0.04] border-white/[0.1] text-slate-300 hover:text-white"
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Ativar voz PT-BR</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                <span>Com áudio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparativo Lado a Lado: Imagem Estática (Antes) vs Vídeo Falando (Depois) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
        {/* Lado Esquerdo: Imagem Estática Original */}
        <div className="rounded-3xl overflow-hidden bg-[#0C0D12] border border-white/[0.08] flex flex-col justify-between shadow-xl">
          <div className="relative aspect-[9/14] bg-black overflow-hidden flex items-center justify-center">
            <img
              src="/uploads/6ea5aba0-f0a5-4be8-985e-09da93fb0630.jpg"
              alt="Foto estática original de corpo todo"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-3 left-3">
              <span className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs font-sans text-slate-200">
                1. Foto Estática de Corpo Todo
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <div className="px-3.5 py-2 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 text-[11px] text-slate-300">
                Fotografia estática de ensaio em alta resolução
              </div>
            </div>
          </div>
          <div className="p-5 space-y-1.5 bg-[#0C0D12]">
            <h4 className="text-sm font-medium text-white">Imagem de Origem</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Você pode começar com qualquer foto gerada no VORIXA ou enviada do seu acervo.
            </p>
          </div>
        </div>

        {/* Lado Direito: Vídeo Animado com Fala e Movimento */}
        <div className="rounded-3xl overflow-hidden bg-[#0C0D12] border border-cyan-500/30 ring-1 ring-cyan-500/20 flex flex-col justify-between shadow-2xl relative">
          <div className="relative aspect-[9/14] bg-black overflow-hidden">
            <video
              ref={videoRef}
              src="/uploads/7a8abe32-afbb-42f6-9c7a-e77a9aadec60.mp4"
              poster="/uploads/6ea5aba0-f0a5-4be8-985e-09da93fb0630.jpg"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/90 text-slate-950 font-semibold text-xs shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                2. Vídeo Animado com Fala Nativa
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <div className="px-3.5 py-2 rounded-2xl bg-black/80 backdrop-blur-md border border-cyan-500/30 text-[11px] text-slate-200">
                Fala: <span className="text-white italic">&quot;Estou pronta para a Festa da Virginia, Você também vai?&quot;</span>
              </div>
            </div>
          </div>
          <div className="p-5 space-y-1.5 bg-[#0C0D12]">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">Resultado Final Animado</h4>
              <span className="text-[11px] font-mono text-cyan-400 font-medium">Kling 2.6 Pro</span>
            </div>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Movimento contínuo em direção à câmera com sincronia labial e sorriso no final.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
