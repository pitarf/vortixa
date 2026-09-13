"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Workflow } from "lucide-react";

/**
 * Simulador Interativo do VORIXA FLOW (Visual Graph Engine).
 * Abas deslizantes no mobile para navegação fluida em telas ultracompactas (320px).
 * Inspector e tela de render com zero CLS (aspect-video) e touch targets >= 44px.
 */
export function FlowInteractiveDemo() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      id: 0,
      title: "1. Prompt Node",
      type: "Entrada Criativa",
      accent: "border-violet-500 text-violet-400",
      promptText: "Guerreira cibernética com armadura de titânio sob chuva néon em Tóquio 2099, iluminação cinematográfica volumétrica 8k",
      status: "CONCLUÍDO",
      cost: "0 Créditos",
      videoUrl: "/media/landing/videos/flow_demo_video.mp4",
      details: "Configuração de prompt positivo e negativo com presets de estilo cinematográfico e direção de arte.",
      engine: "Neural NLP Parser v2",
    },
    {
      id: 1,
      title: "2. FLUX.1 Schnell",
      type: "Geração de Imagem",
      accent: "border-cyan-500 text-cyan-400",
      promptText: "Inferência rápida (1.2s) • Resolução 1024x1024 • 28 Passos de Difusão • Foco Nítido",
      status: "CONCLUÍDO",
      cost: "1 Crédito",
      videoUrl: "/media/landing/videos/flow_demo_video.mp4",
      details: "Gera quadro estático de altíssima fidelidade com textura de pele real e reflexos volumétricos.",
      engine: "Black Forest Labs FLUX.1",
    },
    {
      id: 2,
      title: "3. Kling AI 1.5",
      type: "Imagem para Vídeo",
      accent: "border-emerald-500 text-emerald-400",
      promptText: "Movimento de câmera orbital lenta • 60 FPS • Simulação de chuva e neblina em alta definição",
      status: "PROCESSANDO",
      cost: "4 Créditos",
      videoUrl: "/media/landing/videos/cinematic_hypercar.mp4",
      details: "Anima a imagem gerada no nó anterior mantendo total consistência anatômica e iluminação original.",
      engine: "Kuaishou Kling 1.5 Pro",
    },
    {
      id: 3,
      title: "4. LivePortrait LipSync",
      type: "Voz e Expressões",
      accent: "border-pink-500 text-pink-400",
      promptText: "Sincronização labial frame a frame sincronizada com áudio de locução em português do Brasil",
      status: "EM ESPERA",
      cost: "3 Créditos",
      videoUrl: "/media/landing/videos/lipsync_avatar.mp4",
      details: "Sincroniza os movimentos labiais, piscadas e microexpressões com o áudio gravado ou sintetizado.",
      engine: "LivePortrait Neural Engine",
    },
    {
      id: 4,
      title: "5. Creative Upscale 4K",
      type: "Masterização Final",
      accent: "border-amber-500 text-amber-400",
      promptText: "Upscale 4K Ultra HD (3840x2160) com refinamento de bordas, texturização de poros e redução de ruído",
      status: "EM ESPERA",
      cost: "2 Créditos",
      videoUrl: "/media/landing/motion/micro_loop_cosmic.mp4",
      details: "Exportação em qualidade cinematográfica com profundidade de cor e nitidez pronta para cinema e publicidade.",
      engine: "VORIXA UltraSharp 4K AI",
    },
  ];

  const current = steps[activeStep];

  return (
    <section id="flow-demo" className="py-12 sm:py-16 md:py-20 px-3 sm:px-6 max-w-7xl mx-auto space-y-10 sm:space-y-12 w-full">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase">
          <Workflow className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>VORIXA FLOW • VISUAL GRAPH ENGINE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Crie pipelines em vez de prompts isolados
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed">
          No VORIXA FLOW, cada modelo alimenta o próximo. Um prompt vira imagem, ganha movimento, recebe voz sincronizada e é masterizado em 4K sem trocar de aba.
        </p>
      </div>

      {/* Simulator Workspace */}
      <div className="bg-[#0D0E14] border border-white/[0.08] rounded-3xl p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 shadow-[0_20px_70px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Node Pipeline Steps Bar (Com rolagem horizontal suave no celular) */}
        <div className="w-full overflow-x-auto no-scrollbar py-1">
          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 min-w-max sm:min-w-0">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer min-h-[48px] min-w-[140px] sm:min-w-0 active:scale-95 ${
                  activeStep === idx
                    ? "bg-[#13141F] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]"
                    : "bg-[#07080B] border-white/[0.06] hover:border-white/20 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-slate-400 font-semibold">Nó 0{idx + 1}</span>
                  <span className="text-cyan-400 font-bold">{s.cost}</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{s.title}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{s.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Step Visualizer & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
          {/* Node Output Screen (Zero CLS com aspect-video estrito) */}
          <div className="lg:col-span-7 bg-[#07080B] border border-white/[0.08] rounded-2xl overflow-hidden aspect-video relative shadow-inner w-full">
            <video
              key={current.videoUrl}
              src={current.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#07080B]/90 border border-white/20 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-mono text-cyan-400 font-bold backdrop-blur-md">
              {current.title}
            </div>
            <div className="absolute bottom-3 right-3 bg-[#07080B]/90 border border-white/20 px-2.5 sm:px-3 py-1 rounded-xl text-[10px] sm:text-[11px] font-mono text-slate-300 backdrop-blur-md flex items-center gap-2">
              <span>Status:</span>
              <span className={`font-bold ${current.status === "CONCLUÍDO" ? "text-emerald-400" : current.status === "PROCESSANDO" ? "text-amber-400" : "text-slate-400"}`}>
                {current.status}
              </span>
            </div>
          </div>

          {/* Node Inspector Simulator */}
          <div className="lg:col-span-5 bg-[#07080B] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Node Inspector</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">{current.engine}</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Parâmetros & Payload</label>
                <div className="text-xs font-mono text-slate-200 bg-[#0D0E14] p-3 rounded-xl border border-white/[0.06] mt-1 leading-relaxed break-words">
                  {current.promptText}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Ação do Grafo</label>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{current.details}</p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                <span>Custo Previsto:</span>
                <span className="text-emerald-400 font-bold">{current.cost}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                className="flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer min-h-[44px] active:scale-95"
              >
                <span>Próximo Passo</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
              <Link
                href="/dashboard/flow"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-xs font-bold text-white shadow-lg shadow-violet-600/30 transition-all cursor-pointer min-h-[44px] flex items-center justify-center active:scale-95"
              >
                Abrir no Studio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
