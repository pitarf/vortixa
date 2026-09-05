"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Check, ArrowRight, Sparkles, Zap, Activity } from "lucide-react";

/**
 * Seção de Recursos e Workflows com Animações e Comportamentos Diferenciados para cada Card.
 */
export function EnginesShowcase() {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase font-semibold block">
          FERRAMENTAS
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          Tudo numa <span className="font-serif italic font-normal text-slate-300">ferramenta só</span>, sem 5 assinaturas diferentes.
        </h2>
      </div>

      {/* Card Amplo de Workflow Automático com Grafo Animado */}
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Lado Esquerdo: Conteúdo */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold block">
                WORKFLOW AUTOMÁTICO
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-snug">
                Conecte +20 IAs em <span className="font-serif italic font-normal text-slate-300">1 workflow</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
                Prompt gera imagem. Imagem vira vídeo. Vídeo recebe upscale. Cada bloco alimenta o próximo automaticamente.
              </p>
            </div>

            {/* Checkmarks */}
            <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-300 font-sans">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Arraste, conecte e rode em segundos</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custo em créditos calculado antes de gerar</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Salve e reuse seus workflows prontos</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all hover:scale-105 min-h-[44px]"
              >
                <span>Experimentar Workflows</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Lado Direito: Preview do Grafo e Mídia com Efeito de Foco Cinematográfico */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-black border border-[#1E202E] aspect-video shadow-2xl flex items-center justify-center group/player">
              <video
                src="/media/landing/videos/flow_demo_video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover/player:scale-103 transition-transform duration-1000"
              />
              <div className="absolute top-3 left-3 bg-[#0D0E12]/90 border border-slate-700/80 px-3 py-1 rounded-lg text-[10px] font-mono text-cyan-400 font-bold backdrop-blur-md">
                FLUX 1.1 ➜ Kling 1.5 ➜ Master 4K
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Inferior: 3 Cards com Animações Distintas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Card 1: Influencer IA (Animação de Foco e Glow com Respiração) */}
        <div className="bg-[#0D0E12] border border-[#1E202E] hover:border-violet-500/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-500">
          <div className="relative aspect-[4/5] overflow-hidden bg-black">
            <video
              src="/media/landing/videos/lipsync_avatar.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-transparent opacity-85" />
            
            {/* Badge com Pulso Violeta */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-violet-950/80 border border-violet-500/40 px-3 py-1 rounded-lg text-[10px] font-mono text-violet-300 font-bold uppercase backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
              <span>Influencers IA</span>
            </div>
          </div>
          <div className="p-6 space-y-2">
            <h4 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
              Avatares Consistentes
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crie personagens com traços faciais humanos perfeitos para veicular campanhas 24h sem você aparecer.
            </p>
          </div>
        </div>

        {/* Card 2: Motion & Dança (Animação de Rastreamento de Movimento e Tilt) */}
        <div className="bg-[#0D0E12] border border-[#1E202E] hover:border-emerald-500/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-500">
          <div className="relative aspect-[4/5] overflow-hidden bg-black">
            <video
              src="/media/landing/videos/motion_dancer.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-transparent opacity-85" />
            
            {/* Badge com Indicador de 60 FPS */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-lg text-[10px] font-mono text-emerald-300 font-bold uppercase backdrop-blur-md">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Motion 60 FPS</span>
            </div>
          </div>
          <div className="p-6 space-y-2">
            <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Transferência de Movimento
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transfira coreografias, gestos e danças virais diretamente para fotos e avatares estáticos em 60 FPS.
            </p>
          </div>
        </div>

        {/* Card 3: Slider Antes & Depois Integrado (Skin Enhancer & Upscale 8K com Scanline) */}
        <div className="bg-[#0D0E12] border border-[#1E202E] hover:border-cyan-500/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-500">
          <div
            ref={sliderRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative aspect-[4/5] overflow-hidden bg-black cursor-ew-resize select-none group"
          >
            {/* Lado Direito (Depois / Com Skin Enhancer Master) */}
            <img
              src="/media/landing/gallery/avatar_presenter.jpg"
              alt="Depois do Skin Enhancer"
              className="w-full h-full object-cover brightness-105 contrast-105"
            />
            <div className="absolute top-3 right-3 bg-[#0D0E12]/90 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md shadow-md backdrop-blur-md">
              DEPOIS (8K)
            </div>

            {/* Lado Esquerdo (Antes / Raw IA com aspecto artificial) */}
            <div
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img
                src="/media/landing/gallery/avatar_presenter.jpg"
                alt="Antes do Skin Enhancer"
                className="w-full h-full object-cover filter blur-[1.5px] saturate-75 brightness-90"
              />
              <div className="absolute top-3 left-3 bg-[#0D0E12]/90 border border-slate-700 text-slate-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md shadow-md backdrop-blur-md">
                ANTES (RAW)
              </div>
            </div>

            {/* Linha Divisória com Handle Interativo */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] z-10 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)] text-[11px] font-bold">
                ⬌
              </div>
            </div>
          </div>

          <div className="p-6 space-y-2">
            <h4 className="text-base font-bold text-white">Skin Enhancer & Textura</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arraste para comparar: remova o aspecto artificial de IA e adicione poros, textura humana e nitidez 8K.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
