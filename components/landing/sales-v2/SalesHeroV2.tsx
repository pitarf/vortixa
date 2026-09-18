"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Zap,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  QrCode,
  Lock,
  Flame,
} from "lucide-react";

/**
 * Hero de Alta Conversão focado em Vendas Diretas — Home V2.
 * Headline direta voltada a negócios/ROI, prova em vídeo imediata,
 * ancoragem de preço (a partir de R$ 9,90) e CTA que leva direto aos planos no topo.
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
    <section className="pt-6 sm:pt-10 md:pt-14 pb-6 sm:pb-10 px-3 sm:px-6 max-w-7xl mx-auto relative w-full overflow-hidden">
      {/* Luz Volumétrica de Foco de Venda */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-5xl h-[70%] bg-gradient-to-r from-emerald-600/15 via-violet-600/20 to-cyan-500/15 blur-[120px] sm:blur-[140px] pointer-events-none -z-10" />

      {/* Card Monumental Dark Obsidian de Conversão */}
      <div className="bg-gradient-to-b from-[#12141F]/95 via-[#0D0E14]/95 to-[#07080B] border border-white/[0.1] rounded-[28px] sm:rounded-[40px] md:rounded-[48px] p-4 sm:p-8 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex flex-col items-center text-center space-y-6 sm:space-y-8 relative overflow-hidden backdrop-blur-2xl">
        {/* Glow Superior */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        {/* Pílula de Oferta / Urgência */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-inner text-emerald-300 text-[10px] sm:text-xs font-mono font-bold backdrop-blur-xl">
          <Flame className="w-3.5 h-3.5 text-emerald-400 fill-current animate-pulse shrink-0" />
          <span className="tracking-wide uppercase">PÁGINA DE VENDAS OFICIAL • PLANOS LIBERADOS</span>
        </div>

        {/* Headline de Choque de Vendas: Modelo Virtual que Vende */}
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 px-1">
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-[62px] font-extrabold text-white tracking-tight leading-[1.12] break-words">
            Crie anúncios e vídeos com{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
              modelos virtuais
            </span>{" "}
            que vendem no automático{" "}
            <span className="font-serif italic font-normal text-white">sem você aparecer</span>.
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Você não precisa de estúdios caros, modelos reais nem câmeras de cinema. Escolha um modelo de IA, digite o que ele deve falar e gere dezenas de criativos em minutos para TikTok, Reels e anúncios.
          </p>
        </div>

        {/* Video Player Protagonista com Áudio em Português */}
        <div className="w-full max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.95)] relative aspect-video group transition-all duration-500 hover:border-emerald-500/40">
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

          {/* HUD Superior Esquerdo */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 pointer-events-none">
            <span className="bg-[#07080B]/90 border border-white/20 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-mono text-emerald-300 font-bold backdrop-blur-md shadow-lg flex items-center gap-1.5 max-w-[270px] sm:max-w-none truncate">
              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">Exemplo Real: Modelo IA falando em Português (PT-BR)</span>
            </span>
          </div>

          {/* Botão de Som */}
          <button
            type="button"
            onClick={toggleAudio}
            className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-xs font-mono font-medium px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer border min-h-[44px] active:scale-95 touch-manipulation select-none ${
              !isMuted
                ? "bg-emerald-500/30 border-emerald-500/60 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-bold"
                : "bg-black/90 hover:bg-black text-white border-white/20"
            }`}
            aria-label={isMuted ? "Ouvir demonstração com som" : "Desativar som"}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-4 w-4 text-slate-300 shrink-0" />
                <span className="font-semibold">Clique para ouvir som</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-emerald-400 animate-pulse shrink-0" />
                <span className="font-bold">Áudio Ativo</span>
              </>
            )}
          </button>
        </div>

        {/* CTAs de Ação Direta para os Planos */}
        <div className="w-full max-w-2xl mx-auto space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
            <a
              href="#planos-topo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 sm:px-9 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-slate-950 text-sm sm:text-base font-extrabold shadow-[0_0_35px_rgba(16,185,129,0.35)] transition-all active:scale-95 min-h-[50px] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current shrink-0" />
              <span>Ver Planos & Começar Agora</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>

            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs sm:text-sm font-semibold border border-white/[0.12] transition-all active:scale-95 min-h-[50px] cursor-pointer"
            >
              <span>Criar Conta Grátis</span>
            </Link>
          </div>

          {/* Micro-Garantias de Venda Imediata */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-400 pt-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Acesso Imediato</span>
            </div>
            <div className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Pix em segundos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-violet-400 shrink-0" />
              <span>Cartão até 12x</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Garantia de 7 dias</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
