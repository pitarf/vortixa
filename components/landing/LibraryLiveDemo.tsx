"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Filter, Play, Download, Layers, Video, Image as ImageIcon } from "lucide-react";

export function LibraryLiveDemo() {
  const [tab, setTab] = useState<"all" | "video" | "image">("all");

  const libraryItems = [
    {
      id: 1,
      type: "video",
      title: "Cyberpunk Rain Samurai",
      engine: "FLUX.1 + Kling 1.5",
      videoUrl: "/media/landing/videos/flow_demo_video.mp4",
      date: "Hoje às 14:32",
    },
    {
      id: 2,
      type: "video",
      title: "Luxury Gold Perfume Ad",
      engine: "FLUX.1 Schnell",
      videoUrl: "/media/landing/videos/commercial_perfume.mp4",
      date: "Hoje às 14:15",
    },
    {
      id: 3,
      type: "video",
      title: "AI Avatar Presenter",
      engine: "LivePortrait LipSync",
      videoUrl: "/media/landing/videos/lipsync_avatar.mp4",
      date: "Hoje às 13:50",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase">
          ✦ Central Asset Library
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">
          Sua Biblioteca Central de Ativos Criativos
        </h2>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed">
          Gerações não se perdem. Todas as imagens, vídeos, animações e outputs de fluxos ficam organizados, indexados e prontos para reuso ou download em alta qualidade.
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
        {/* Mock Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#070709] p-3 rounded-2xl border border-[#1E202E]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                tab === "all" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400"
              }`}
            >
              Todos (138)
            </button>
            <button
              onClick={() => setTab("video")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                tab === "video" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400"
              }`}
            >
              Vídeos (84)
            </button>
            <button
              onClick={() => setTab("image")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                tab === "image" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400"
              }`}
            >
              Imagens (54)
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              readOnly
              value="cyberpunk..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#13141B] border border-[#1E202E] text-xs text-slate-300 font-mono"
            />
          </div>
        </div>

        {/* Mock Grid with Autoplay Videos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {libraryItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#070709] border border-[#1E202E] rounded-2xl overflow-hidden group hover:border-emerald-500/40 transition-all"
            >
              <div className="relative aspect-video bg-black">
                <video
                  src={item.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-[#0D0E12]/90 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400 font-bold uppercase">
                  {item.engine}
                </div>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white truncate">{item.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.date}</div>
                </div>
                <Link
                  href="/dashboard/library"
                  className="p-1.5 rounded-lg bg-[#13141B] text-slate-300 hover:text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
