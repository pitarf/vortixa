"use client";

import React from "react";
import Link from "next/link";
import {
  Wand2,
  Boxes,
  Sparkles,
  Film,
  ArrowRight,
  Zap,
  Layers,
  Video,
  Image as ImageIcon,
  Navigation,
} from "lucide-react";

export function DashboardCreationCards() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white font-heading">
            Estúdios de Criação
          </h2>
          <p className="text-xs text-slate-400">
            Selecione uma das experiências criativas para materializar seus projetos com IA.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* ================= CARD 1: STUDIO CREATE ================= */}
        <div className="group relative rounded-3xl bg-[#0D0E12] border border-[#1E202E] hover:border-violet-500/50 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-violet-600/10 overflow-hidden">
          <div className="space-y-3">
            {/* Topo do Card com Ícone e Badges */}
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Wand2 className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-violet-500/10 border border-violet-500/20 text-violet-300 uppercase">
                Direct Render
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white font-heading group-hover:text-violet-300 transition-colors">
                Studio CREATE
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Geração rápida e intuitiva com presets profissionais.
              </p>
            </div>

            {/* Thumbnail Preview Visual */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-[#1E202E]">
              <img
                src="/media/landing/gallery/editorial_fashion.jpg"
                alt="Studio CREATE Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-mono text-slate-300 font-bold">
                  Preset Cinematográfico 8K
                </span>
              </div>
            </div>

            {/* Tags dos Motores Integrados */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Imagem", "Vídeo", "LipSync", "Upscale"].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-[#13141B] border border-[#1E202E] text-[10px] font-mono text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard/create"
            className="mt-5 flex items-center justify-between px-4 py-2.5 rounded-xl bg-violet-600/10 hover:bg-violet-600 border border-violet-500/20 hover:border-violet-500 text-xs font-bold text-violet-300 hover:text-white transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <span>Abrir Studio</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ================= CARD 2: VORIXA FLOW ================= */}
        <div className="group relative rounded-3xl bg-[#0D0E12] border border-[#1E202E] hover:border-cyan-500/50 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-600/10 overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                <Boxes className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 uppercase">
                Visual Graph
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
                VORIXA FLOW
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Workflows visuais ilimitados encadeando múltiplos modelos de IA.
              </p>
            </div>

            {/* Mini Representação dos Nós Conectados */}
            <div className="p-3 rounded-2xl bg-[#070709] border border-[#1E202E] space-y-2">
              <div className="text-[9px] font-mono text-slate-400 uppercase font-bold">
                Pipeline DAG Conectado
              </div>
              <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-1 text-[9px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Prompt
                </span>
                <span className="text-slate-400">→</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  FLUX
                </span>
                <span className="text-slate-400">→</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Kling
                </span>
                <span className="text-slate-400">→</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  4K
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Arraste conexões, controle latências e orquestre produções em escala.
            </p>
          </div>

          <Link
            href="/dashboard/flow"
            className="mt-5 flex items-center justify-between px-4 py-2.5 rounded-xl bg-cyan-600/10 hover:bg-cyan-600 border border-cyan-500/20 hover:border-cyan-500 text-xs font-bold text-cyan-300 hover:text-white transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <span>Abrir Canvas</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ================= CARD 3: BUILD WITH AI ================= */}
        <div className="group relative rounded-3xl bg-[#0D0E12] border border-[#1E202E] hover:border-pink-500/50 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-pink-600/10 overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-pink-500/10 border border-pink-500/20 text-pink-300 uppercase">
                Autônomo
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white font-heading group-hover:text-pink-300 transition-colors">
                Build with AI
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Descreva sua ideia. A inteligência artificial constrói o fluxo.
              </p>
            </div>

            {/* Simulação de Caixa de Prompt */}
            <div className="p-3 rounded-2xl bg-[#070709] border border-[#1E202E] space-y-1.5">
              <div className="text-[9px] font-mono text-pink-400 font-bold">
                Exemplo de Prompt:
              </div>
              <p className="text-[11px] text-slate-300 italic line-clamp-3 leading-relaxed">
                “Crie um comercial cinematográfico para perfume com avatar realista e iluminação 4K volumétrica...”
              </p>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              O assistente seleciona os nós ideais e os conecta sem esforço manual.
            </p>
          </div>

          <Link
            href="/dashboard/flow?mode=ai"
            className="mt-5 flex items-center justify-between px-4 py-2.5 rounded-xl bg-pink-600/10 hover:bg-pink-600 border border-pink-500/20 hover:border-pink-500 text-xs font-bold text-pink-300 hover:text-white transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <span>Experimentar</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ================= CARD 4: BIBLIOTECA ================= */}
        <div className="group relative rounded-3xl bg-[#0D0E12] border border-[#1E202E] hover:border-emerald-500/50 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-600/10 overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                <Film className="h-5 w-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 uppercase">
                Storage
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white font-heading group-hover:text-emerald-300 transition-colors">
                Biblioteca
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Todos os seus ativos e mídias renderizadas em um só lugar.
              </p>
            </div>

            {/* Mini Grid 2x2 com Previews */}
            <div className="grid grid-cols-2 gap-1.5 aspect-video rounded-2xl overflow-hidden p-1 bg-black/60 border border-[#1E202E]">
              <div className="rounded-lg overflow-hidden bg-[#13141B]">
                <img
                  src="/media/landing/gallery/hypercar_cyberpunk.jpg"
                  alt="Ativo 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="rounded-lg overflow-hidden bg-[#13141B]">
                <img
                  src="/media/landing/gallery/perfume_commercial.jpg"
                  alt="Ativo 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="rounded-lg overflow-hidden bg-[#13141B]">
                <img
                  src="/media/landing/gallery/avatar_presenter.jpg"
                  alt="Ativo 3"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="rounded-lg overflow-hidden bg-[#13141B]">
                <img
                  src="/media/landing/gallery/street_dancer.jpg"
                  alt="Ativo 4"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Exportação em alta resolução, reabertura no Canvas e gerenciamento.
            </p>
          </div>

          <Link
            href="/dashboard/library"
            className="mt-5 flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500 text-xs font-bold text-emerald-300 hover:text-white transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <span>Ver Biblioteca</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}