"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Play, Zap, Terminal } from "lucide-react";

/**
 * Seção "✦ Build with AI" — Demonstração da fala ao pipeline visual.
 * Permite ao usuário digitar ou clicar em presets e ver o grafo sendo sintetizado com nós e outputs.
 */
export function BuildWithAiVisual() {
  const [selectedPrompt, setSelectedPrompt] = useState<string>(
    "Crie um anúncio de perfume de luxo com modelo realista e movimentos lentos de câmera"
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(3);

  const presets = [
    "Anúncio de perfume de luxo com modelo realista e câmera lenta",
    "Trailer de ficção científica com guerreira cyberpunk e dublagem PT-BR",
    "Dançarino de rua executando acrobacias com efeitos de rastro néon",
  ];

  const pipelineNodes = [
    {
      id: "node-1",
      name: "Prompt NLP",
      type: "Entrada de Texto",
      status: "COMPLETED",
      color: "border-violet-500 text-violet-400 bg-violet-950/30",
      desc: "Interpretação semântica e geração de prompt positivo/negativo",
    },
    {
      id: "node-2",
      name: "FLUX.1 Schnell",
      type: "Imagem 8K",
      status: "COMPLETED",
      color: "border-cyan-500 text-cyan-400 bg-cyan-950/30",
      desc: "Geração do quadro estático com iluminação de estúdio",
    },
    {
      id: "node-3",
      name: "Kling AI 1.5",
      type: "Vídeo 60 FPS",
      status: "COMPLETED",
      color: "border-emerald-500 text-emerald-400 bg-emerald-950/30",
      desc: "Movimento de câmera e física fluida de partículas",
    },
    {
      id: "node-4",
      name: "Master Upscale 4K",
      type: "Render Final",
      status: "COMPLETED",
      color: "border-amber-500 text-amber-400 bg-amber-950/30",
      desc: "Textura de pele humana e nitidez cinematográfica",
    },
  ];

  const handleSimulate = (prompt: string) => {
    setSelectedPrompt(prompt);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setActiveStepIndex(3);
    }, 500);
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase font-semibold block">
          ✦ BUILD WITH AI
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          Da ideia em texto ao <span className="font-serif italic font-normal text-slate-300">workflow completo</span> em 1 clique.
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
          Digite o que deseja em linguagem natural. A IA do VORIXA interpreta o objetivo, posiciona os nós, conecta os handles e entrega o pipeline pronto para rodar.
        </p>
      </div>

      {/* Box Interativo do Simulador */}
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 md:p-10 shadow-2xl space-y-8">
        {/* Presets Chips */}
        <div className="flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSimulate(p)}
              className="text-xs px-4 py-2 rounded-full bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-slate-300 hover:text-white transition-all text-left cursor-pointer truncate max-w-md"
            >
              ✦ {p}
            </button>
          ))}
        </div>

        {/* Barra de Entrada de Prompt */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={selectedPrompt}
              onChange={(e) => setSelectedPrompt(e.target.value)}
              placeholder="Descreva o que deseja criar (ex: comercial de perfume com modelo realista)..."
              className="w-full h-13 pl-4 pr-10 rounded-2xl bg-[#070709] border border-[#1E202E] text-xs sm:text-sm text-white focus:outline-none focus:border-violet-500 font-sans"
            />
          </div>
          <button
            onClick={() => handleSimulate(selectedPrompt)}
            disabled={isGenerating}
            className="h-13 px-8 rounded-2xl bg-white hover:bg-slate-200 text-slate-950 text-xs sm:text-sm font-bold shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>{isGenerating ? "Sintetizando Grafo..." : "Sintetizar Pipeline ✦"}</span>
          </button>
        </div>

        {/* Grafo de Nós Gerado + Vídeo Resultante */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          {/* Lado Esquerdo: 4 Nós Encadeados */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center justify-between pb-1">
              <span>Pipeline Visual Gerado</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Grafo Válido (0 Ciclos)
              </span>
            </div>

            <div className="space-y-2.5">
              {pipelineNodes.map((node, idx) => (
                <div
                  key={node.id}
                  className={`p-3.5 rounded-2xl border ${node.color} flex items-center justify-between transition-all`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{node.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({node.type})</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{node.desc}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    Pronto
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lado Direito: Preview Audiovisual do Pipeline Rodando */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-black border border-[#1E202E] aspect-video shadow-2xl flex items-center justify-center group">
              <video
                src="/media/landing/videos/commercial_perfume.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#0D0E12]/90 border border-slate-700 px-3 py-1 rounded-lg text-[10px] font-mono text-cyan-400 font-bold">
                Resultado Master • 4K 60 FPS
              </div>
              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[10px] text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Tempo de Geração: <strong>14.2s</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
