"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Volume2, VolumeX } from "lucide-react";

/**
 * Hero Section Oficial no padrão exato Octuz AI / Higgsfield.
 * Container amplo off-white com glow lateral sutil, tipografia editorial (Sans + Serif Italic),
 * vídeo protagonista centralizado e CTA preto estilizado abaixo do vídeo.
 */
export function HeroCinematic() {
  const [isMuted, setIsMuted] = useState<boolean>(true);

  return (
    <section className="pt-24 pb-8 md:pt-28 md:pb-12 px-3 sm:px-6 max-w-7xl mx-auto relative">
      {/* Glow Difuso Azul / Violeta nas Bordas Externas */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] bg-gradient-to-r from-indigo-500/20 via-sky-400/15 to-violet-500/20 blur-[130px] pointer-events-none -z-10" />

      {/* Card Grande Off-White do Hero */}
      <div className="bg-[#F4F4F6] text-slate-900 border border-slate-200/80 rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 md:p-16 shadow-[0_20px_80px_rgba(0,0,0,0.4)] flex flex-col items-center text-center space-y-8 relative overflow-hidden">
        
        {/* Pílula Superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm text-slate-700 text-xs font-medium backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Reinvente sua forma de criar</span>
        </div>

        {/* Headline com Tipografia Editorial (Sans + Serif Italic) */}
        <div className="max-w-4xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold text-slate-950 tracking-tight leading-[1.12] font-sans">
            Gere seu <span className="font-serif italic font-normal text-slate-800 text-[1.08em]">Influencer IA</span> ultra realista em{" "}
            <span className="font-serif italic font-normal text-slate-800 text-[1.08em]">1 minuto</span> e faça vendas{" "}
            <span className="font-serif italic font-normal text-slate-800 text-[1.08em]">24/7</span> com vídeos virais
          </h1>
        </div>

        {/* Video Player Protagonista (Logo Abaixo do Headline) */}
        <div className="w-full max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-slate-300/80 shadow-2xl relative aspect-video group transition-all duration-700 hover:shadow-[0_25px_60px_rgba(99,102,241,0.25)]">
          <video
            src="/media/landing/hero/hero_main.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Controle de Áudio Flutuante */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-4 right-4 bg-black/80 hover:bg-black text-white text-xs font-mono font-medium px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xl backdrop-blur-md transition-all cursor-pointer hover:scale-105 border border-white/10"
            aria-label={isMuted ? "Ativar som do vídeo" : "Desativar som"}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-4 w-4 text-slate-400" />
                <span>Clique para ouvir som</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-300">Áudio Ativado</span>
              </>
            )}
          </button>
        </div>

        {/* Subheadline e Botão CTA (Abaixo do Vídeo, Dentro da Caixa Clara) */}
        <div className="max-w-2xl mx-auto space-y-6 pt-2">
          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-sans font-normal">
            Copie workflows que funcionam como máquina de conteúdos 24h por dia, 7d por semana, gerando vídeos virais infinitos para TikTok, Reels, Anúncios... sem mostrar o seu rosto!
          </p>

          <div className="flex justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#09090B] hover:bg-[#18181B] text-white text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-slate-800 min-h-[50px] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-violet-300" />
              <span>Gerar vídeos com IA</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
