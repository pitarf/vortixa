"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Zap, Volume2, VolumeX, Sparkles, ArrowRight, Film } from "lucide-react";

/**
 * Hero Section Oficial — Padrão High-End Dark Obsidian (Awwwards / Apple).
 * Fluid typography de 320px a 4K, abas táteis com rolagem horizontal em telas pequenas,
 * player cinematográfico protagonista em aspect-video com zero CLS e touch targets >= 44px.
 */
export function HeroCinematic() {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 px-3 sm:px-6 max-w-7xl mx-auto relative w-full overflow-hidden">
      {/* Aura Difusa de Iluminação Traseira */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] max-w-5xl h-[70%] bg-gradient-to-r from-violet-600/20 via-indigo-500/15 to-cyan-500/20 blur-[120px] sm:blur-[140px] pointer-events-none -z-10" />

      {/* Card Monumental Dark Obsidian do Hero */}
      <div className="bg-gradient-to-b from-[#12141F]/90 via-[#0D0E14]/95 to-[#07080B] border border-white/[0.08] rounded-[28px] sm:rounded-[40px] md:rounded-[48px] p-4 sm:p-8 md:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex flex-col items-center text-center space-y-6 sm:space-y-8 relative overflow-hidden backdrop-blur-2xl">
        
        {/* Glow Superior Linear */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        {/* Pílula de Prestígio Superior */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] shadow-inner text-slate-200 text-[10px] sm:text-xs font-mono font-medium backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="tracking-wide uppercase">Criação Audiovisual • IAs Integradas v2.6</span>
        </div>

        {/* Headline de Alto Impacto com Tipografia Fluida */}
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 px-1">
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-white tracking-tight leading-[1.14] break-words">
            Crie seu{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300">
              modelo virtual
            </span>{" "}
            com aparência humana em{" "}
            <span className="font-serif italic font-normal text-white">poucos cliques</span> e publique vídeos{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
              todos os dias
            </span>
            .
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Use modelos prontos para produzir campanhas e vídeos de alta conversão para TikTok, Reels e anúncios. Você cria conteúdos profissionais em minutos, sem precisar aparecer e sem câmeras caras.
          </p>
        </div>

        {/* Video Player Protagonista com Zero CLS (aspect-video 16:9 estrito) */}
        <div className="w-full max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative aspect-video group transition-all duration-500 hover:border-violet-500/40">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster="/uploads/867192da-b5f6-4d67-b4b5-8191723e46fe.jpg"
            className="w-full h-full object-cover"
          >
            <source src="/uploads/87cf520d-8277-4f00-9644-26f4584735a6.mp4" type="video/mp4" />
            <source src="/media/landing/hero/hero_main.mp4" type="video/mp4" />
          </video>

          {/* HUD Superior Esquerdo — Badge do Motor */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 pointer-events-none">
            <span className="bg-[#07080B]/85 border border-white/20 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-mono text-cyan-300 font-bold backdrop-blur-md shadow-lg flex items-center gap-1.5 max-w-[260px] sm:max-w-none truncate">
              <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">Gerado com: ByteDance Seedance 2.0 • Áudio & Fala PT-BR</span>
            </span>
          </div>

          {/* HUD Superior Direito — Telemetria de Render */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 hidden sm:flex items-center gap-2 pointer-events-none">
            <span className="bg-[#07080B]/85 border border-white/20 px-2.5 py-1 rounded-lg text-[10px] font-mono text-emerald-400 font-bold backdrop-blur-md">
              60 FPS
            </span>
            <span className="bg-[#07080B]/85 border border-white/20 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-300 backdrop-blur-md">
              4K Master
            </span>
          </div>

          {/* Controle de Áudio Flutuante (Touch target >= 44x44px) */}
          <button
            type="button"
            onClick={toggleAudio}
            className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-xs font-mono font-medium px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer border min-h-[44px] active:scale-95 touch-manipulation select-none ${
              !isMuted
                ? "bg-emerald-500/25 border-emerald-500/60 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-bold"
                : "bg-black/85 hover:bg-black text-white border-white/20"
            }`}
            aria-label={isMuted ? "Ativar som do vídeo" : "Desativar som"}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="hidden xs:inline">Clique para ouvir som</span>
                <span className="xs:hidden">Ouvir</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-emerald-400 animate-pulse shrink-0" />
                <span className="font-bold">Áudio Ativo</span>
              </>
            )}
          </button>
        </div>

        {/* Bloco de Ações e CTAs Táteis */}
        <div className="w-full max-w-2xl mx-auto space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white text-sm sm:text-base font-bold shadow-[0_0_35px_rgba(139,92,246,0.35)] transition-all active:scale-95 min-h-[48px] sm:min-h-[52px] cursor-pointer"
            >
              <Zap className="w-4 h-4 text-white fill-current shrink-0" />
              <span>Começar a criar vídeos</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>

            <a
              href="#flow-demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs sm:text-sm font-semibold border border-white/[0.1] transition-all active:scale-95 min-h-[48px] sm:min-h-[52px] cursor-pointer"
            >
              <Film className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Ver como funciona na prática</span>
            </a>
          </div>

          {/* Social Proof & Metrics Bar */}
          <div className="pt-6 border-t border-white/[0.08] grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div className="space-y-0.5 p-2 rounded-xl bg-white/[0.02]">
              <div className="text-lg sm:text-2xl font-extrabold text-white font-mono">+1.2M</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400">Criações finalizadas</div>
            </div>
            <div className="space-y-0.5 p-2 rounded-xl bg-white/[0.02]">
              <div className="text-lg sm:text-2xl font-extrabold text-emerald-400 font-mono">99.8%</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400">Rosto sempre idêntico</div>
            </div>
            <div className="space-y-0.5 p-2 rounded-xl bg-white/[0.02]">
              <div className="text-lg sm:text-2xl font-extrabold text-cyan-400 font-mono">+20 IAs</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400">Principais tecnologias</div>
            </div>
            <div className="space-y-0.5 p-2 rounded-xl bg-white/[0.02]">
              <div className="text-lg sm:text-2xl font-extrabold text-amber-400 font-mono">4.9 / 5</div>
              <div className="text-[10px] sm:text-[11px] text-slate-400">Avaliação da comunidade</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
