"use client";

import React, { useState, useRef } from "react";
import { SlidersHorizontal, Wand2, Film, Zap, ArrowLeftRight } from "lucide-react";

export function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [activeTab, setActiveTab] = useState<"image" | "upscale">("upscale");
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    {
      id: "upscale",
      title: "Resolução 480p → Creative Upscale 4K",
      labelBefore: "Raw 480p Ruidoso",
      labelAfter: "Master 4K Ultra HD",
      mediaBefore: "/media/landing/before-after/cosmic_eye_before.jpg",
      mediaAfter: "/media/landing/before-after/cosmic_eye_after.jpg",
      desc: "Multiplica a nitidez eliminando ruídos e reconstruindo texturas finas em 8K de detalhe.",
    },
    {
      id: "image",
      title: "Prompt Textual → Render FLUX.1 8K",
      labelBefore: "Renderização Inicial",
      labelAfter: "FLUX.1 Final Master",
      mediaBefore: "/media/landing/flow/flow_cyberpunk_step.jpg",
      mediaAfter: "/media/landing/hero/hero_studio_master.jpg",
      desc: "Converte ideias textuais em imagens ultra-detalhadas com iluminação volumétrica e realismo de estúdio.",
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono font-bold uppercase">
          ✦ Visual Evolution Slider
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">
          Veja a transformação diante dos seus olhos
        </h2>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed">
          Arraste o divisor interativo e compare a evolução de cada estágio gerativo.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                : "bg-[#0D0E12] text-slate-400 hover:text-white border border-[#1E202E]"
            }`}
            style={{ minHeight: "44px" }}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Interactive Before/After Split Viewer */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative max-w-4xl mx-auto aspect-square md:aspect-video rounded-3xl overflow-hidden border border-[#1E202E] bg-[#070709] shadow-2xl cursor-ew-resize select-none"
      >
        {/* Right Side (After / Processed) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            key={`after-${activeTab}`}
            src={currentTab.mediaAfter}
            alt={currentTab.labelAfter}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-[#0D0E12]/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold px-3 py-1.5 rounded-lg shadow-lg">
            {currentTab.labelAfter}
          </div>
        </div>

        {/* Left Side (Before / Original) with Clip Path */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <img
            key={`before-${activeTab}`}
            src={currentTab.mediaBefore}
            alt={currentTab.labelBefore}
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute top-4 left-4 bg-[#0D0E12]/90 border border-slate-700 text-slate-300 text-xs font-mono font-bold px-3 py-1.5 rounded-lg shadow-lg">
            {currentTab.labelBefore}
          </div>
        </div>

        {/* Vertical Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
        </div>
      </div>
      <p className="text-xs text-center text-slate-500 font-mono">
        Arraste para os lados para comparar os resultados em tempo real.
      </p>
    </section>
  );
}
