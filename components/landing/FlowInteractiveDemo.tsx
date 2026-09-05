"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Boxes,
  Play,
  ArrowRight,
  Zap,
  SlidersHorizontal,
  Workflow,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export function FlowInteractiveDemo() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      id: 0,
      title: "1. Prompt Node",
      type: "Entrada Criativa",
      color: "from-violet-500 to-indigo-600",
      accent: "border-violet-500/40 text-violet-400",
      promptText: "Guerreira cibernética com armadura de titânio sob chuva néon em Tóquio 2099, iluminação cinematográfica volumétrica 8k",
      status: "COMPLETED",
      cost: "0 Créditos",
      videoUrl: "/media/landing/videos/flow_demo_video.mp4",
      details: "Configuração de prompt positivo e negativo com presets de estilo cinematográfico.",
    },
    {
      id: 1,
      title: "2. FLUX.1 Schnell",
      type: "Geração de Imagem",
      color: "from-cyan-500 to-blue-600",
      accent: "border-cyan-500/40 text-cyan-400",
      promptText: "Inferência rápida (1.2s) • Resolução 1024x1024 • 28 Passos de Difusão",
      status: "COMPLETED",
      cost: "1 Crédito",
      videoUrl: "/media/landing/videos/flow_demo_video.mp4",
      details: "Gera quadro estático de altíssima fidelidade com textura de pele e reflexos realistas.",
    },
    {
      id: 2,
      title: "3. Kling AI 1.5",
      type: "Imagem para Vídeo",
      color: "from-emerald-500 to-teal-600",
      accent: "border-emerald-500/40 text-emerald-400",
      promptText: "Movimento de câmera orbital • 60 FPS • Simulação de chuva volumétrica",
      status: "RUNNING",
      cost: "4 Créditos",
      videoUrl: "/media/landing/videos/cinematic_hypercar.mp4",
      details: "Anima a imagem gerada no passo anterior mantendo total consistência de personagem.",
    },
    {
      id: 3,
      title: "4. LivePortrait LipSync",
      type: "Voz e Expressões",
      color: "from-pink-500 to-rose-600",
      accent: "border-pink-500/40 text-pink-400",
      promptText: "Sincronização labial frame a frame sincronizada com áudio de locução em PT-BR",
      status: "QUEUED",
      cost: "3 Créditos",
      videoUrl: "/media/landing/videos/lipsync_avatar.mp4",
      details: "Sincroniza os lábios e expressões faciais com o arquivo de áudio carregado.",
    },
    {
      id: 4,
      title: "5. Creative Upscale 4K",
      type: "Masterização Final",
      color: "from-amber-500 to-orange-600",
      accent: "border-amber-500/40 text-amber-400",
      promptText: "Upscale 4K Ultra HD (3840x2160) com refinamento de bordas e texturas",
      status: "QUEUED",
      cost: "2 Créditos",
      videoUrl: "/media/landing/motion/micro_loop_cosmic.mp4",
      details: "Exportação em qualidade cinematográfica pronta para exibição em qualquer tela.",
    },
  ];

  const current = steps[activeStep];

  return (
    <section id="flow-demo" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold uppercase">
          ✦ VORIXA FLOW • Visual Graph Engine
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">
          Crie pipelines em vez de prompts isolados
        </h2>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed">
          No VORIXA FLOW, cada modelo alimenta o próximo. Um prompt vira imagem, ganha movimento, recebe voz e vira master 4K em 1 clique.
        </p>
      </div>

      {/* Simulator Workspace */}
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Node Pipeline Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(idx)}
              className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer ${
                activeStep === idx
                  ? "bg-[#13141B] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-102"
                  : "bg-[#070709] border-[#1E202E] hover:border-slate-700 opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-slate-400">Nó {idx + 1}</span>
                <span className="text-cyan-400 font-bold">{s.cost}</span>
              </div>
              <div className="text-xs font-bold text-white truncate">{s.title}</div>
              <div className="text-[10px] text-slate-400 truncate">{s.type}</div>
            </button>
          ))}
        </div>

        {/* Live Step Visualizer & Inspector with Autoplay Video */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Node Output Screen with Real Video (Left 7 cols) */}
          <div className="lg:col-span-7 bg-[#070709] border border-[#1E202E] rounded-2xl overflow-hidden aspect-video relative shadow-inner">
            <video
              key={current.videoUrl}
              src={current.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#0D0E12]/90 border border-slate-700 px-3 py-1 rounded-lg text-xs font-mono text-cyan-400 font-bold">
              {current.title}
            </div>
            <div className="absolute bottom-3 right-3 bg-[#0D0E12]/90 border border-slate-700 px-3 py-1 rounded-lg text-[11px] font-mono text-slate-300">
              Status: <span className="text-emerald-400 font-bold">{current.status}</span>
            </div>
          </div>

          {/* Node Inspector Simulator (Right 5 cols) */}
          <div className="lg:col-span-5 bg-[#13141B] border border-[#1E202E] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E202E]">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white uppercase">Node Inspector</span>
              </div>
              <span className="text-xs font-mono text-slate-400">{current.cost}</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase">Input Payload / Descrição</label>
                <div className="text-xs font-mono text-slate-200 bg-[#070709] p-3 rounded-xl border border-[#1E202E] mt-1 leading-relaxed">
                  {current.promptText}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase">Ação do Pipeline</label>
                <p className="text-xs text-slate-300 mt-1">{current.details}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <span>Próximo Passo do Grafo</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white shadow-lg transition-all cursor-pointer"
              >
                Testar este Flow
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
