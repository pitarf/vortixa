"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  QrCode,
  Sparkles,
} from "lucide-react";

/**
 * Hero Editorial de Luxo (Home V2) — Estilo Octuz AI.
 * Tipografia serifada sofisticada (Instrument Serif), vídeo da mulher do Carnaval em 16:9,
 * copy humana sem jargões de IA futurista e foco em resultados comerciais reais.
 */
export function SalesHeroV2() {
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
    <section className="pt-4 sm:pt-8 md:pt-12 pb-8 sm:pb-12 px-3 sm:px-6 max-w-7xl mx-auto relative w-full overflow-hidden">
      {/* Luz Ambiente Azul Neon e Violeta (Elegância Noturna de Luxo) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-4xl h-[60%] bg-gradient-to-r from-blue-600/15 via-cyan-500/15 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Container Principal Estilo Editorial */}
      <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 max-w-5xl mx-auto">
        
        {/* Pílula de Identidade Discreta e Elegante */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.1] text-slate-300 text-xs font-sans tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span>Estúdio de Criação Audiovisual</span>
        </div>

        {/* Headline Sofisticada: Tipografia Editorial com Serifa Fluida */}
        <div className="space-y-4 max-w-4xl px-2">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal text-white tracking-tight leading-[1.12]">
            Crie seu{" "}
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
              modelo virtual
            </span>{" "}
            ultra-realista em minutos, <br className="hidden sm:inline" />
            e faça ele gravar{" "}
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400">
              seus vídeos virais
            </span>
            .
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans font-light">
            Tenha um rosto exclusivo para a sua marca ou para seus produtos. Escreva o roteiro em português, escolha a expressão e veja o vídeo pronto em alta definição, sem precisar gravar nada pessoalmente.
          </p>
        </div>

        {/* Video Player Protagonista (Mulher do Carnaval com Som em Português) */}
        <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden bg-[#0A0B10] border border-white/[0.12] shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative aspect-video group">
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

          {/* Tag Discreta no Topo */}
          <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 flex items-center gap-2 pointer-events-none">
            <span className="bg-black/80 border border-white/15 px-3 py-1.5 rounded-full text-xs font-sans text-slate-200 backdrop-blur-md flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Exemplo real: Modelo brasileira falando em português</span>
            </span>
          </div>

          {/* Controle de Áudio Elegante */}
          <button
            type="button"
            onClick={toggleAudio}
            className={`absolute bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 text-xs font-sans px-4 py-2.5 rounded-full flex items-center gap-2.5 shadow-2xl backdrop-blur-md transition-all cursor-pointer border min-h-[44px] active:scale-95 touch-manipulation select-none ${
              !isMuted
                ? "bg-white text-slate-950 font-bold border-white"
                : "bg-black/80 hover:bg-black text-white border-white/20"
            }`}
            aria-label={isMuted ? "Ouvir voz da modelo" : "Desativar áudio"}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-4 w-4 text-slate-300 shrink-0" />
                <span>Ouvir com som</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse shrink-0" />
                <span className="font-semibold">Áudio ativo</span>
              </>
            )}
          </button>
        </div>

        {/* Bloco de Ações e Chamada Direta para os Planos */}
        <div className="w-full max-w-xl mx-auto space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <a
              href="#planos-topo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-slate-200 text-slate-950 text-sm sm:text-base font-semibold transition-all active:scale-95 min-h-[50px] cursor-pointer shadow-lg shadow-white/10"
            >
              <span>Conhecer os planos</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>

            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium border border-white/[0.1] transition-all active:scale-95 min-h-[50px] cursor-pointer"
            >
              <span>Criar conta gratuita</span>
            </Link>
          </div>

          {/* Garantias em Linha Limpa */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-slate-400 pt-2 font-sans">
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Acesso imediato</span>
            </div>
            <div className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Pix aprovado na hora</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Cartão em até 12x</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>7 dias de garantia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
