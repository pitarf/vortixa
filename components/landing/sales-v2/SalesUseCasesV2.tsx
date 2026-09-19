"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Play, Search, User, Sliders, CheckCircle2, TrendingUp, Layers } from "lucide-react";

/**
 * Seção de Casos de Uso / Passo a Passo com Estilo Fiel à Referência do Usuário:
 * - 4 Cards em grid 2x2.
 * - Cada card possui:
 *   1. Número grande suave (01, 02, 03, 04) no topo esquerdo.
 *   2. Badge discreta no topo direito (Analytics, Studio AI, Deepfake tech, Auto-Render).
 *   3. Título em negrito e descrição direta e objetiva.
 *   4. Mockup escuro de dashboard interno do VORTIXIA integrado na parte inferior de cada card.
 */
export function SalesUseCasesV2() {
  const steps = [
    {
      num: "01",
      tag: "Analytics & Tendências",
      title: "Mineração e Análise de Conteúdo",
      desc: "Nossa IA mapeia produtos e formatos que estão performando e viralizando em tempo real para você modelar o sucesso.",
      mockupType: "viral_products",
    },
    {
      num: "02",
      tag: "Modelos & Avatares",
      title: "Criação do Avatar e Influenciador",
      desc: "Escolha ou crie um influenciador virtual fotorrealista indistinguível da realidade para representar a sua marca 24 horas por dia.",
      mockupType: "avatar_gallery",
    },
    {
      num: "03",
      tag: "Studio CREATE",
      title: "Personalização de Cena e Cenário",
      desc: "Defina o cenário, iluminação, tom de voz e estilo do vídeo sem precisar de estúdio físico, câmeras ou contratações externas.",
      mockupType: "scene_config",
    },
    {
      num: "04",
      tag: "Render 4K Automático",
      title: "Renderização e Escala de Vendas",
      desc: "Gere centenas de variações de criativos de alta conversão em poucos minutos com sincronia labial impecável e publique.",
      mockupType: "render_engine",
    },
  ];

  return (
    <section className="py-14 sm:py-20 px-3 sm:px-6 max-w-6xl mx-auto space-y-12 sm:space-y-16 w-full">
      {/* Cabeçalho */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-sans tracking-widest text-cyan-400 uppercase font-semibold">
          APLICAÇÕES REAIS
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-tight">
          O que você pode criar{" "}
          <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            na prática
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
          Soluções práticas para quem quer produzir vídeos de alta conversão sem complicação.
        </p>
      </div>

      {/* Grid de 4 Cards com Design Fiel à Referência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="rounded-3xl p-6 sm:p-7 bg-[#0C0D12] border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group"
          >
            {/* Topo: Número de 2 Dígitos e Badge */}
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-700/60 font-mono tracking-tighter select-none">
                {s.num}
              </span>
              <span className="text-[10px] font-mono font-medium px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300">
                {s.tag}
              </span>
            </div>

            {/* Informações de Texto */}
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {s.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
                {s.desc}
              </p>
            </div>

            {/* Mockup do Dashboard do Site na Parte Inferior */}
            <div className="pt-2">
              <div className="rounded-2xl bg-[#06070A] border border-white/[0.08] p-3 sm:p-4 shadow-inner relative overflow-hidden">
                {s.mockupType === "viral_products" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-slate-950">
                          V
                        </div>
                        <span className="text-xs font-bold text-white">Criativos em Alta</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>Score +94%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2 space-y-1">
                        <span className="text-[10px] text-slate-400 block font-medium">Formato</span>
                        <span className="text-xs font-bold text-slate-100 block">Vídeo 9:16</span>
                      </div>
                      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2 space-y-1">
                        <span className="text-[10px] text-slate-400 block font-medium">Retenção</span>
                        <span className="text-xs font-bold text-emerald-400 block">Alta (60s)</span>
                      </div>
                      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2 space-y-1">
                        <span className="text-[10px] text-slate-400 block font-medium">CTR Médio</span>
                        <span className="text-xs font-bold text-cyan-400 block">4.8%</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Search className="w-3 h-3 text-cyan-400" />
                        Varredura de scripts virais concluída
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Pronto</span>
                    </div>
                  </div>
                )}

                {s.mockupType === "avatar_gallery" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">Galeria de Modelos Virtuais</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Hiper-realista
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[
                        { name: "Larissa", role: "Editorial Moda", img: "/uploads/3edfbb77-e69f-4ab7-8298-696549bf49a3.jpg" },
                        { name: "Camila", role: "Influencer Tech", img: "/uploads/36c7aff2-166d-4bdc-a002-032243d98196.jpg" },
                        { name: "Isabela", role: "Comercial TV", img: "/uploads/6ea5aba0-f0a5-4be8-985e-09da93fb0630.jpg" },
                        { name: "Beatriz", role: "Campanha Viral", img: "/uploads/influencer_live_stream.jpg" },
                      ].map((avatar, aIdx) => (
                        <div
                          key={aIdx}
                          className="rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.08] relative aspect-square group/img"
                        >
                          <img
                            src={avatar.img}
                            alt={avatar.name}
                            className="w-full h-full object-cover object-top"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                            <span className="text-[10px] sm:text-xs font-semibold text-white truncate">{avatar.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {s.mockupType === "scene_config" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">Configuração Visual de Cena</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Passo 03 de 04</span>
                    </div>
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[11px]">
                        <span className="text-slate-300">Cenário & Iluminação</span>
                        <span className="text-cyan-400 font-medium">Estúdio Fotográfico 85mm</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[11px]">
                        <span className="text-slate-300">Áudio & Tom de Voz</span>
                        <span className="text-cyan-400 font-medium">Português Brasileiro Natural</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-[11px]">
                        <span className="text-slate-300">Movimento de Câmera</span>
                        <span className="text-cyan-400 font-medium">Smooth Orbit & Zoom Suave</span>
                      </div>
                    </div>
                  </div>
                )}

                {s.mockupType === "render_engine" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">Motor de Renderização 4K</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Render Ativo
                      </span>
                    </div>
                    <div className="py-2.5 px-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-white block">Ajustando iluminação e microporos</span>
                        <span className="text-[10px] text-slate-400 font-mono">Resolução 2160x3840 (4K 60fps)</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-pulse">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="w-full bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-[88%] rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

