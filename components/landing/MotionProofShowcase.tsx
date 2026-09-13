"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Video,
  User,
  CheckCircle2,
  Flame,
  Activity,
  Zap,
  Cpu,
} from "lucide-react";

/**
 * Seção de Prova Real do VORIXA — Laboratório / Showroom Audiovisual Futurista.
 * PRESERVAÇÃO ESTRITA DOS ARQUIVOS REAIS SOLICITADOS PELO USUÁRIO:
 * 1. Guia TikTok: /videos/dance_ref_camila.mp4 (com fallback para /uploads/danca_tiktok_motion.mp4)
 * 2. Imagem Personagem: /videos/ai_character_ref.png (com fallback para /uploads/motion_personagem_base.png)
 * 3. Vídeo Final VORIXA: /videos/kling_motion_result.mp4 (com fallback para /uploads/motion_gerado_vorixa.mp4)
 *
 * Responsividade: 1 coluna vertical no smartphone e 3 colunas harmoniosas no desktop.
 * Touch targets >= 44px e zero CLS.
 */
export function MotionProofShowcase() {
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
    <section className="py-12 sm:py-16 md:py-24 px-3 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-10 relative w-full">
      {/* Showroom Frame Exterior com Halo Esmeralda */}
      <div className="bg-gradient-to-b from-[#0D0E14] via-[#0A0B10] to-[#07080B] border border-white/[0.08] rounded-[28px] sm:rounded-[36px] md:rounded-[44px] p-4 sm:p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.8)] space-y-8 sm:space-y-10 relative overflow-hidden">
        
        {/* Glow de Laboratório Tecnológico */}
        <div className="absolute -top-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

        {/* Cabeçalho do Showroom */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 relative z-10">
          <div className="space-y-2.5 sm:space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-400 tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
              <span>VORIXA MOTION LAB • BENCHMARK REAL KLING V3</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Da coreografia do TikTok ao personagem IA:{" "}
              <span className="font-serif italic font-normal text-emerald-300">
                transferência cinética sem distorção.
              </span>
            </h2>
            
            <p className="text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed">
              Veja um benchmark executado em nossa infraestrutura oficial: gravamos uma dança real com celular no TikTok,
              combinamos com uma personagem gerada por IA e o motor <strong>Kling Video v3 Motion Control</strong> transferiu
              toda a coreografia com física realista, dinâmica muscular e o áudio da batida original.
            </p>
          </div>

          {/* Console de Controles Táteis do Showroom (Touch target >= 44px) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={togglePlay}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/[0.04] border border-white/[0.12] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 transition-all min-h-[44px] cursor-pointer shadow-lg active:scale-95"
              title={isPlaying ? "Pausar vídeos em sincronia" : "Reproduzir vídeos"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Play className="w-4 h-4 text-emerald-400 fill-current shrink-0" />
              )}
              <span>{isPlaying ? "Pausar Ambos" : "Sincronizar Play"}</span>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border text-xs font-semibold transition-all min-h-[44px] cursor-pointer shadow-lg active:scale-95 ${
                !isMuted
                  ? "bg-emerald-500/25 border-emerald-500/60 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.3)] font-bold"
                  : "bg-white/[0.04] border-white/[0.12] text-slate-400 hover:text-slate-200"
              }`}
              title={isMuted ? "Ouvir áudio da dança" : "Silenciar áudio"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 shrink-0" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
              )}
              <span>{isMuted ? "Ativar Áudio" : "Som Ativo"}</span>
            </button>
          </div>
        </div>

        {/* Grid de 3 Estágios do Laboratório (Empilha em 1 col no mobile e 3 colunas no desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch relative z-10">
          
          {/* ETAPA 1: Vídeo Guia do TikTok (Preservando /videos/dance_ref_camila.mp4 com fallback resiliente) */}
          <div className="lg:col-span-4 bg-[#07080B] border border-pink-500/30 hover:border-pink-500/60 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between group transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-pink-950/80 text-pink-300 border border-pink-500/50 flex items-center gap-1.5">
                  <Video className="w-3 h-3 text-pink-400 shrink-0" />
                  <span>1. Guia TikTok (Dança)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">60 FPS • Mobile</span>
              </div>

              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl w-full">
                <video
                  ref={refVideoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  <source src="/videos/dance_ref_camila.mp4" type="video/mp4" />
                  <source src="/uploads/danca_tiktok_motion.mp4" type="video/mp4" />
                </video>
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-white font-bold">
                  📱 Vídeo Gravado com Celular
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Coreografia Humana Real</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vídeo gravado em ambiente real com movimentação rápida de braços, rotação de quadril e passos rítmicos.
              </p>
            </div>
          </div>

          {/* ETAPA 2: Foto Estática Base da Personagem (Preservando /videos/ai_character_ref.png com fallback) */}
          <div className="lg:col-span-3 bg-[#07080B] border border-cyan-500/30 hover:border-cyan-500/60 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between group transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>2. Personagem IA</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Foto Estática</span>
              </div>

              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl w-full">
                <img
                  src="/videos/ai_character_ref.png"
                  onError={(e) => {
                    e.currentTarget.src = "/uploads/motion_personagem_base.png";
                  }}
                  alt="Personagem estática criada com IA no VORIXA"
                  className="w-full h-full object-cover"
                />
                
                {/* Linha de Scanner Biométrico Laser Animada */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(6,182,212,1)] animate-pulse" style={{ top: "35%" }} />

                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-cyan-300 font-bold">
                  📸 Imagem Base (0% Animação)
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Identidade Preservada</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Foto gerada previamente via FLUX.1. Rosto, roupas, cabelos e anatomia congelados para transferência.
              </p>
            </div>
          </div>

          {/* ETAPA 3: Master Final Sintetizado (Preservando /videos/kling_motion_result.mp4 com fallback) */}
          <div className="md:col-span-2 lg:col-span-5 bg-gradient-to-b from-[#13141F] via-[#0E1017] to-[#07080B] border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.25)] rounded-3xl p-4 sm:p-5 flex flex-col justify-between group transition-all duration-300">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin shrink-0" />
                  <span>3. Master Final VORIXA (Dança)</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Kling v3 Motion</span>
              </div>

              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-emerald-500/40 shadow-2xl w-full">
                <video
                  ref={outVideoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                >
                  <source src="/videos/kling_motion_result.mp4" type="video/mp4" />
                  <source src="/uploads/motion_gerado_vorixa.mp4" type="video/mp4" />
                </video>
                
                <div className="absolute top-3 left-3 bg-emerald-950/90 border border-emerald-500/50 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-lg text-[10px] font-mono text-emerald-300 font-bold shadow-lg">
                  ✨ Dança & Áudio Clonados
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fidelidade Cinética & Ritmo Perfeito</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A modelo virtual executa a mesma coreografia da garota do TikTok, acompanhando a música, o ritmo e o caimento das roupas sem distorcer o rosto.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard/tools/motion"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95 min-h-[44px] cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>Testar Motion Control com Minha Imagem</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Barra de Telemetria e Garantias do Showroom */}
        <div className="pt-5 sm:pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-slate-400 relative z-10">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Motor: <strong className="text-white">kling-video/v3/motion-control</strong></span>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Activity className="w-3.5 h-3.5 shrink-0" /> 100% Nuvem GPU
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-300">Tempo de Render: 5.5 min</span>
          </div>
        </div>

      </div>
    </section>
  );
}
