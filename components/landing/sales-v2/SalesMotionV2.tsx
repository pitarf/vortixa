"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Video,
  User,
  CheckCircle2,
} from "lucide-react";

/**
 * Seção de Prova Real do Motion Control — Design Editorial de Luxo (Estilo Octuz AI).
 * Comparativo lado a lado sem poluição visual ou estética exagerada de ficção científica:
 * 1. Vídeo de Referência (TikTok gravado com celular).
 * 2. Imagem da Modelo Escolhida.
 * 3. Vídeo Final com a Dança Clonada.
 */
export function SalesMotionV2() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const refVideoRef = useRef<HTMLVideoElement>(null);
  const outVideoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (refVideoRef.current && outVideoRef.current) {
      if (isPlaying) {
        refVideoRef.current.pause();
        outVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        refVideoRef.current.play().catch(() => {});
        outVideoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (outVideoRef.current) {
      const nextMute = !isMuted;
      outVideoRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  };

  return (
    <section id="motion-proof" className="py-12 sm:py-16 px-3 sm:px-6 max-w-7xl mx-auto space-y-10 sm:space-y-12 w-full">
      {/* Cabeçalho da Prova Real */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl mx-auto">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-sans tracking-widest text-cyan-400 uppercase font-medium">
            Tecnologia de Movimento
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-tight">
            Transfira danças e gestos reais para{" "}
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              o seu modelo
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
            Veja a comparação na prática: gravamos um vídeo dançando no TikTok, escolhemos a personagem e o resultado final replica 100% dos passos com física de tecido impecável.
          </p>
        </div>

        {/* Controles de Reprodução Elegantes */}
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
                <span>Ativar som</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                <span>Com som</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid de 3 Cartões de Comparação (Estilo Editorial Limpo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
        {/* Passo 1: Vídeo Guia (TikTok com Celular) */}
        <div className="rounded-3xl overflow-hidden bg-[#0C0D12] border border-white/[0.08] flex flex-col justify-between shadow-xl">
          <div className="relative aspect-[9/14] bg-black overflow-hidden">
            <video
              ref={refVideoRef}
              src="/uploads/danca_tiktok_motion.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-sans text-slate-200">
                1. Vídeo Gravado no Celular
              </span>
            </div>
          </div>
          <div className="p-4 space-y-1 bg-[#0C0D12]">
            <h4 className="text-sm font-medium text-white">Referência do TikTok</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Qualquer vídeo com movimentos de dança ou fala serve como ponto de partida.
            </p>
          </div>
        </div>

        {/* Passo 2: Personagem Escolhido */}
        <div className="rounded-3xl overflow-hidden bg-[#0C0D12] border border-white/[0.08] flex flex-col justify-between shadow-xl">
          <div className="relative aspect-[9/14] bg-black overflow-hidden flex items-center justify-center">
            <img
              src="/uploads/motion_personagem_base.png"
              alt="Personagem Base"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-sans text-slate-200">
                2. Modelo Escolhida
              </span>
            </div>
          </div>
          <div className="p-4 space-y-1 bg-[#0C0D12]">
            <h4 className="text-sm font-medium text-white">Foto da Personagem</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Uma única imagem serve para preservar o rosto, as roupas e o estilo desejado.
            </p>
          </div>
        </div>

        {/* Passo 3: Vídeo Final com a Dança Renderizada */}
        <div className="rounded-3xl overflow-hidden bg-[#0C0D12] border-2 border-cyan-500/50 flex flex-col justify-between shadow-[0_10px_35px_rgba(6,182,212,0.2)] relative">
          <div className="relative aspect-[9/14] bg-black overflow-hidden">
            <video
              ref={outVideoRef}
              src="/uploads/motion_gerado_vorixa.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-full bg-cyan-400 text-slate-950 font-bold text-[10px] font-sans shadow-[0_0_12px_rgba(34,211,238,0.6)]">
                3. Vídeo Final Pronto
              </span>
            </div>
          </div>
          <div className="p-4 space-y-1 bg-[#0C0D12]">
            <h4 className="text-sm font-medium text-white">Resultado Final</h4>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              Movimento clonado com precisão anatômica, preservando ritmo e música.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
