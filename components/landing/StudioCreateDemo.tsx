"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wand2, Play, SlidersHorizontal, ArrowRight, Video, Image, Zap } from "lucide-react";

export function StudioCreateDemo() {
  const [selectedTool, setSelectedTool] = useState<string>("image");
  const [ratio, setRatio] = useState<string>("16:9");
  const [prompt, setPrompt] = useState<string>("Guerreira cibernética em Neo-Tóquio 2099 com iluminação de néon volumétrica");

  return (
    <section id="studio" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono font-bold uppercase">
          Unified Studio CREATE
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">
          Studio CREATE — Geração Rápida e Focada
        </h2>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed">
          Prefere renderizar mídias individuais antes de abrir o Flow? O Studio CREATE reúne todos os controles essenciais em uma interface limpa e veloz.
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl">
        {/* Controls Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Tool Switcher */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "image", label: "FLUX Imagem" },
              { id: "video", label: "Kling Vídeo" },
              { id: "upscale", label: "Upscale 4K" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTool(t.id)}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTool === t.id
                    ? "bg-violet-600 text-white shadow-lg"
                    : "bg-[#13141B] text-slate-400 border border-[#1E202E]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase">Prompt Criativo</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-[#070709] border border-[#1E202E] text-xs text-white font-mono focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase">Proporção da Tela</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {["16:9 Cinema", "1:1 Feed", "9:16 Reels"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRatio(r.split(" ")[0])}
                  className={`py-2 rounded-xl text-xs font-mono font-semibold cursor-pointer ${
                    ratio === r.split(" ")[0]
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "bg-[#070709] text-slate-400 border border-[#1E202E]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/register"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer"
          >
            <Wand2 className="h-4 w-4" />
            <span>Gerar Agora no Studio CREATE</span>
          </Link>
        </div>

        {/* Live Preview with Real Autoplay Video (7 cols) */}
        <div className="lg:col-span-7 bg-[#070709] border border-[#1E202E] rounded-2xl overflow-hidden aspect-video relative shadow-inner">
          <video
            src="/media/landing/videos/flow_demo_video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-[#0D0E12]/90 border border-violet-500/40 px-3.5 py-1.5 rounded-xl text-xs font-mono text-violet-300 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-violet-400" />
            <span>Open in Flow </span>
          </div>
        </div>
      </div>
    </section>
  );
}
