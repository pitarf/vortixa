"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

/**
 * Galeria Editorial Estática e Limpa:
 * - ZERO zoom
 * - ZERO escala
 * - ZERO distorção ou efeito estranho
 * - Reprodução suave e estável dos vídeos originais em alta definição.
 */
export function ResultsMasonryGallery() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const galleryItems = [
    {
      id: 1,
      category: "commercial",
      title: "Comercial de Perfume de Luxo",
      modelTag: "FLUX.1 + Upscale 4K",
      prompt: "Golden luxury perfume bottle floating with suspended water droplets and gold dust particles in 8k cinematic lighting",
      videoUrl: "/media/landing/videos/commercial_perfume.mp4",
      aspectRatio: "col-span-1 md:col-span-2 aspect-video",
      badge: "Comercial 4K",
      accentColor: "border-amber-500/40 text-amber-300 bg-amber-950/60",
    },
    {
      id: 2,
      category: "ugc",
      title: "Apresentadora Virtual UGC",
      modelTag: "LivePortrait LipSync",
      prompt: "Ultra-realistic female creator presenting tech news with natural facial micro-expressions and perfect lip synchronization",
      videoUrl: "/media/landing/videos/lipsync_avatar.mp4",
      aspectRatio: "col-span-1 aspect-square",
      badge: "Influencer IA",
      accentColor: "border-violet-500/40 text-violet-300 bg-violet-950/60",
    },
    {
      id: 3,
      category: "motion",
      title: "Dançarino de Rua & Rastro Néon",
      modelTag: "Kling Motion Control",
      prompt: "Street dancer performing complex acrobatic freeze with glowing volumetric trail energy effects in 60 FPS",
      videoUrl: "/media/landing/videos/motion_dancer.mp4",
      aspectRatio: "col-span-1 aspect-square",
      badge: "Motion 60 FPS",
      accentColor: "border-emerald-500/40 text-emerald-300 bg-emerald-950/60",
    },
    {
      id: 4,
      category: "cinema",
      title: "Hypercarro Cyberpunk em Tóquio",
      modelTag: "Kling AI 1.5",
      prompt: "Sleek flying hypercar accelerating between neo-tokyo skyscrapers with plasma trail at sunset, cinematic camera movement",
      videoUrl: "/media/landing/videos/cinematic_hypercar.mp4",
      aspectRatio: "col-span-1 md:col-span-2 aspect-video",
      badge: "Cinema Sci-Fi",
      accentColor: "border-cyan-500/40 text-cyan-300 bg-cyan-950/60",
    },
    {
      id: 5,
      category: "fashion",
      title: "Moda Editorial Avant-Garde",
      modelTag: "FLUX.1 Schnell",
      prompt: "High-fashion model wearing iridescent chrome liquid dress standing in minimalist dark runway studio, 8k resolution",
      videoUrl: "/media/landing/motion/micro_loop_fashion.mp4",
      aspectRatio: "col-span-1 md:col-span-2 aspect-video",
      badge: "Fashion Loop",
      accentColor: "border-pink-500/40 text-pink-300 bg-pink-950/60",
    },
    {
      id: 6,
      category: "commercial",
      title: "Macro Íris Cósmica",
      modelTag: "Creative Upscale 4K",
      prompt: "Extreme macro shot of human eye iris transforming into swirling cosmic galaxy nebula in extreme 8k detail",
      videoUrl: "/media/landing/motion/micro_loop_cosmic.mp4",
      aspectRatio: "col-span-1 aspect-square",
      badge: "Micro Loop",
      accentColor: "border-indigo-500/40 text-indigo-300 bg-indigo-950/60",
    },
  ];

  const filteredItems =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const handleCopyPrompt = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase font-semibold block">
            GALERIA & PRODUÇÕES REAIS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Criado com <span className="font-serif italic font-normal text-slate-300">VORIXA</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
            Peças audiovisuais geradas por criadores e estúdios com qualidade cinematográfica original.
          </p>
        </div>

        {/* Filtros em Pílulas */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: "Todas as Criações" },
            { key: "commercial", label: "Comerciais & Ads" },
            { key: "ugc", label: "Influencers & UGC" },
            { key: "motion", label: "Motion & Dança" },
            { key: "cinema", label: "Cinema & Sci-Fi" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === f.key
                  ? "bg-white text-slate-950 shadow-lg font-bold"
                  : "bg-[#0D0E12] border border-[#1E202E] text-slate-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Mosaico Limpo — Sem Zoom e Sem Distorções */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`relative rounded-3xl overflow-hidden bg-[#0D0E12] border border-[#1E202E] hover:border-slate-600 shadow-2xl group flex flex-col justify-between ${item.aspectRatio}`}
          >
            {/* Vídeo Estável e Estático — Sem Transform / Scale */}
            <video
              src={item.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay Suave */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/20 pointer-events-none" />

            {/* Badge Superior */}
            <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
              <span className={`px-3 py-1 rounded-lg border text-[10px] font-mono font-bold backdrop-blur-md ${item.accentColor}`}>
                {item.badge}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                {item.modelTag}
              </span>
            </div>

            {/* Detalhes e Ação de Copiar Prompt */}
            <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white tracking-wide">
                  {item.title}
                </h4>
                <button
                  onClick={() => handleCopyPrompt(item.id, item.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
                  title="Copiar prompt de exemplo"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-300" />
                      <span>Copiar Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-mono opacity-80">
                "{item.prompt}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
