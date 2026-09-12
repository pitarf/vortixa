"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, Volume2, VolumeX } from "lucide-react";

/**
 * Hero Section Oficial no padrão exato Octuz AI / Higgsfield.
 * Container amplo off-white com glow lateral sutil, tipografia editorial (Sans + Serif Italic),
 * vídeo protagonista centralizado e CTA preto estilizado abaixo do vídeo.
 */
export function HeroCinematic() {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [activeHeroVideo, setActiveHeroVideo] = useState<string>("/uploads/f80d19de-085b-4378-98ea-b7733c8ffdd8.mp4");
  const [activeHeroTag, setActiveHeroTag] = useState<string>("Kling 2.6 Pro + Áudio");

  return (
    <section className="pt-24 pb-8 md:pt-28 md:pb-12 px-3 sm:px-6 max-w-7xl mx-auto relative">
      {/* Glow Difuso Azul / Violeta nas Bordas Externas com Pulsação Suave */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] bg-gradient-to-r from-indigo-500/20 via-sky-400/15 to-violet-500/20 blur-[130px] pointer-events-none -z-10 animate-hero-glow" />

      {/* Card Grande Off-White do Hero com Entrada Suave */}
      <div className="bg-[#F4F4F6] text-slate-900 border border-slate-200/80 rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 md:p-16 shadow-[0_20px_80px_rgba(0,0,0,0.4)] flex flex-col items-center text-center space-y-8 relative overflow-hidden animate-hero-fade-1">
        
        {/* Pílula Superior */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm text-slate-700 text-xs font-medium backdrop-blur-md animate-hero-fade-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Reinvente sua forma de criar</span>
        </div>

        {/* Headline com Tipografia Editorial (Sans + Serif Italic) */}
        <div className="max-w-4xl mx-auto space-y-2 animate-hero-fade-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold text-slate-950 tracking-tight leading-[1.12] font-sans">
            Gere seu <span className="font-serif italic font-normal text-slate-800 text-[1.08em]">Influencer IA</span> ultra realista em{" "}
            <span className="font-serif italic font-normal text-slate-800 text-[1.08em]">1 minuto</span> e faça vendas{" "}
            <span className="font-serif italic font-normal text-slate-800 text-[1.08em]">24/7</span> com vídeos virais
          </h1>
        </div>

        {/* Seletor de Vídeos Reais Gerados */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl animate-hero-fade-3">
          {[
            {
              id: "hero_speech",
              label: "🗣️ Modelo Falando (Kling 2.6)",
              src: "/uploads/f80d19de-085b-4378-98ea-b7733c8ffdd8.mp4",
              tag: "Kling 2.6 Pro + Áudio",
            },
            {
              id: "hero_seedance",
              label: "⚡ Seedance 2.0 (Vídeo & Fala)",
              src: "/uploads/cacdb6d2-4c8a-4f7e-8f14-8e7d7a21f287.mp4",
              tag: "ByteDance Seedance 2.0",
            },
            {
              id: "hero_kling21",
              label: "👗 Moda & Movimento (Kling 2.1)",
              src: "/uploads/bdc1b96b-d7d2-4f55-8f2b-a90631629c00.mp4",
              tag: "Kling 2.1 Pro",
            },
            {
              id: "hero_carnaval",
              label: "🎉 Atuação em Português",
              src: "/uploads/87cf520d-8277-4f00-9644-26f4584735a6.mp4",
              tag: "Seedance 2.0 Native",
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveHeroVideo(item.src);
                setActiveHeroTag(item.tag);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                activeHeroVideo === item.src
                  ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105"
                  : "bg-white/80 hover:bg-white text-slate-700 border-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Video Player Protagonista com Mídia Real */}
        <div className="w-full max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-slate-300/80 shadow-2xl relative aspect-video group transition-all duration-700 hover:shadow-[0_25px_60px_rgba(99,102,241,0.25)] animate-hero-fade-3">
          <video
            key={activeHeroVideo}
            src={activeHeroVideo}
            poster="/uploads/fc5afea8-272c-4afc-8deb-beebfa65a118.jpg"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />

          {/* Badge do Motor Utilizado */}
          <div className="absolute top-4 left-4 bg-black/70 border border-white/20 px-3 py-1 rounded-xl text-[11px] font-mono text-cyan-300 font-bold backdrop-blur-md">
            Gerado com: {activeHeroTag}
          </div>

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
        <div className="max-w-2xl mx-auto space-y-6 pt-2 animate-hero-fade-4">
          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-sans font-normal">
            Copie workflows que funcionam como máquina de conteúdos 24h por dia, 7d por semana, gerando vídeos virais infinitos para TikTok, Reels, Anúncios... sem mostrar o seu rosto!
          </p>

          <div className="flex justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#09090B] hover:bg-[#18181B] text-white text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-slate-800 min-h-[50px] cursor-pointer"
            >
              <Zap className="w-4 h-4 text-violet-300 fill-current" />
              <span>Gerar vídeos com IA</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
