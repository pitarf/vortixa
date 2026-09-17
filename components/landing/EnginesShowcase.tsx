"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Check, ArrowRight, Activity, Layers } from "lucide-react";

/**
 * Seção de Recursos & Workflows — Bento Grid de Elite (Apple / Awwwards).
 * Super Bento Card do VORTIXIA FLOW + 3 Cards de especialidade com slider Antes/Depois em 8K.
 * Suporte completo a gestos touch com touch-none no slider e touch targets >= 44px.
 */
export function EnginesShowcase() {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section id="features" className="py-12 sm:py-16 md:py-24 px-3 sm:px-6 max-w-7xl mx-auto space-y-10 sm:space-y-12">
      {/* Cabeçalho Editorial */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono tracking-widest text-violet-400 uppercase font-bold block">
          SUÍTE INTEGRADA DE CRIAÇÃO
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Tudo numa <span className="font-serif italic font-normal text-slate-300">ferramenta só</span>, sem pagar 5 assinaturas diferentes.
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Substitua Midjourney, Runway, Kling, ElevenLabs e Topaz por uma plataforma unificada que conecta os melhores motores do mundo em segundos.
        </p>
      </div>

      {/* Super Bento Card: VORTIXIA FLOW Engine */}
      <div className="bg-[#0D0E14] border border-white/[0.08] hover:border-white/[0.15] rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden relative group transition-all duration-500">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
          {/* Lado Esquerdo: Conteúdo Editorial & Checkmarks */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="space-y-2.5 sm:space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                <Layers className="w-3 h-3 shrink-0" />
                <span>WORKFLOW AUTOMÁTICO • GRAPH ENGINE</span>
              </div>
              <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Conecte várias IAs em <span className="font-serif italic font-normal text-slate-300">um fluxo único</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
                Você cria a imagem, gera a animação, sincroniza a voz e exporta tudo em alta resolução direto na plataforma. Sem precisar baixar arquivos intermediários ou trocar de tela.
              </p>
            </div>

            {/* Checkmarks de Alto Nível */}
            <div className="space-y-2.5 sm:space-y-3 pt-1 text-xs sm:text-sm text-slate-300 font-sans">
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span>Arraste nós, interligue cabos e execute o pipeline em 1 clique</span>
              </div>
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span>Custo exato em créditos calculado antes do processamento</span>
              </div>
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span>Biblioteca de templates prontos validados para anúncios e viralização</span>
              </div>
            </div>

            <div className="pt-2 sm:pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all active:scale-95 min-h-[44px] shadow-lg shadow-white/10 cursor-pointer"
              >
                <span>Experimentar Workflows no Canvas</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Lado Direito: Preview de Mídia em Moldura de Precisão */}
          <div className="lg:col-span-6 w-full">
            <div className="relative rounded-2xl overflow-hidden bg-black border border-white/[0.1] aspect-video shadow-2xl flex items-center justify-center group/player">
              <video
                src="/media/landing/videos/flow_demo_video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover/player:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-[#07080B]/90 border border-white/20 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[9px] sm:text-[10px] font-mono text-cyan-300 font-bold backdrop-blur-md shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span>FLUX 1.1 ➜ Kling 1.5 ➜ Master 4K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trio Bento Grid Inferior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        
        {/* Card 1: Influencer IA com Vídeo e Fala Real */}
        <div className="bg-[#0D0E14] border border-white/[0.08] hover:border-violet-500/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1">
          <div className="relative aspect-[4/5] overflow-hidden bg-black">
            <video
              src="/uploads/f80d19de-085b-4378-98ea-b7733c8ffdd8.mp4"
              poster="/uploads/fc5afea8-272c-4afc-8deb-beebfa65a118.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E14] via-transparent to-transparent opacity-90" />
            
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-violet-950/90 border border-violet-500/40 px-2.5 py-1 rounded-xl text-[9px] sm:text-[10px] font-mono text-violet-300 font-bold uppercase backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping shrink-0" />
              <span>Kling 2.6 Pro • Áudio Nativo PT-BR</span>
            </div>
          </div>
          <div className="p-5 sm:p-6 space-y-2">
            <h4 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
              Vídeos com Fala & Expressão Humana
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crie comerciais de produtos, reviews e moda com modelos apresentando e falando em português sem você precisar aparecer.
            </p>
          </div>
        </div>

        {/* Card 2: Motion Control & Dança (Transferência de Coreografia Real) */}
        <div className="bg-[#0D0E14] border border-white/[0.08] hover:border-emerald-500/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1">
          <div className="relative aspect-[4/5] overflow-hidden bg-black">
            <video
              src="/uploads/motion_gerado_vorixa.mp4"
              poster="/uploads/motion_personagem_base.png"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E14] via-transparent to-transparent opacity-90" />
            
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-1 rounded-xl text-[9px] sm:text-[10px] font-mono text-emerald-300 font-bold uppercase backdrop-blur-md">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" />
              <span>Kling v3 Motion • Dança & Ritmo</span>
            </div>
          </div>
          <div className="p-5 sm:p-6 space-y-2">
            <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Coreografia & Motion Control
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clone coreografias do TikTok ou qualquer movimento gravado no celular e transfira diretamente para a sua personagem digital.
            </p>
          </div>
        </div>

        {/* Card 3: Slider Antes & Depois Integrado (Skin Enhancer 8K) */}
        <div className="bg-[#0D0E14] border border-white/[0.08] hover:border-cyan-500/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
          <div
            ref={sliderRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative aspect-[4/5] overflow-hidden bg-black cursor-ew-resize select-none touch-none group"
            role="slider"
            aria-label="Controle deslizante de comparação Antes e Depois"
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setSliderPosition((p) => Math.max(0, p - 5));
              if (e.key === "ArrowRight") setSliderPosition((p) => Math.min(100, p + 5));
            }}
          >
            {/* Lado Direito (Depois / 8K Estúdio) */}
            <img
              src="/uploads/fc5afea8-272c-4afc-8deb-beebfa65a118.jpg"
              alt="Depois do Render 8K"
              className="w-full h-full object-cover brightness-105 contrast-105 pointer-events-none"
            />
            <div className="absolute top-3 right-3 bg-[#07080B]/90 border border-cyan-500/50 text-cyan-300 text-[9px] sm:text-[10px] font-mono font-bold px-2 py-1 rounded-lg shadow-md backdrop-blur-md pointer-events-none">
              8K ESTÚDIO
            </div>

            {/* Lado Esquerdo (Antes / Referência) */}
            <div
              className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img
                src="/uploads/ff6bb395-d216-467d-aa57-c3878b973993.jpg"
                alt="Ensaio Fotográfico Base"
                className="w-full h-full object-cover filter blur-[1px] saturate-75 brightness-90 pointer-events-none"
              />
              <div className="absolute top-3 left-3 bg-[#07080B]/90 border border-slate-700 text-slate-400 text-[9px] sm:text-[10px] font-mono font-bold px-2 py-1 rounded-lg shadow-md backdrop-blur-md">
                REFERÊNCIA
              </div>
            </div>

            {/* Linha Divisória de Precisão com Handle Tátil (>= 44x44px touch target) */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(255,255,255,1)] z-10 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.9)] text-xs font-extrabold cursor-grab active:cursor-grabbing">
                ⬌
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-2">
            <h4 className="text-base font-bold text-white">Skin Enhancer & Textura Humana</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arraste para comparar: remova o aspecto plástico de IA e injete poros, micropigmentação e nitidez de lentes 85mm.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
