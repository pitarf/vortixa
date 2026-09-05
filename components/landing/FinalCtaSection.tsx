"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

/**
 * Banner Final de Conversão Cinematográfico (Fechamento de Campanha).
 * Vídeo de fundo escuro com overlay, tipografia editorial e CTA de alto impacto.
 */
export function FinalCtaSection() {
  return (
    <section className="py-20 px-3 sm:px-6 max-w-7xl mx-auto">
      <div className="relative rounded-[32px] sm:rounded-[44px] overflow-hidden bg-black border border-[#1E202E] shadow-[0_20px_100px_rgba(0,0,0,0.8)] p-8 sm:p-14 md:p-20 text-center flex flex-col items-center space-y-8">
        
        {/* Vídeo de Fundo Cinematográfico */}
        <video
          src="/media/landing/hero/hero_main.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25 scale-105 pointer-events-none"
        />

        {/* Overlays de Profundidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] bg-violet-600/15 blur-[120px] pointer-events-none" />

        {/* Badge Flutuante */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-violet-300" />
          <span>Comece agora com 100 créditos grátis</span>
        </div>

        {/* Grande Headline de Fechamento */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            Transforme qualquer ideia em{" "}
            <span className="font-serif italic font-normal text-slate-200">produção audiovisual</span> real.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Sem câmeras, sem equipes caras e sem 5 assinaturas separadas. Centralize todo o seu poder de criação com as melhores IAs do mundo.
          </p>
        </div>

        {/* Botão de Ação Protagonista */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-sm sm:text-base shadow-2xl transition-all hover:scale-105 min-h-[52px] cursor-pointer"
          >
            <span>Criar minha conta gratuita</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Garantias e Prova em Linha */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-2 font-mono">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100 Créditos Grátis no Cadastro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sem Cartão de Crédito</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Garantia de 7 Dias</span>
          </div>
        </div>
      </div>
    </section>
  );
}
