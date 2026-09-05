"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Video, Flame, TrendingUp, ShoppingBag } from "lucide-react";

export function ReadyWorkflows() {
  const workflows = [
    {
      title: "Influencer UGC pro TikTok Shop",
      badge: "Viral & Vendas",
      desc: "Gere o avatar, crie o roteiro persuasivo, aplique voz natural e exporte pronto para publicação.",
      videoUrl: "/media/landing/videos/lipsync_avatar.mp4",
      tags: ["Avatar 4K", "Voz PT-BR", "Legendas Automáticas"],
    },
    {
      title: "Anúncios de Alta Conversão para Meta Ads",
      badge: "E-commerce & Dropshipping",
      desc: "Transforme fotos de produtos estáticas em comerciais cinematográficos com efeitos 3D e iluminação de luxo.",
      videoUrl: "/media/landing/videos/commercial_perfume.mp4",
      tags: ["FLUX.1 8K", "Kling Motion", "Upscale 4K"],
    },
    {
      title: "Vídeos Virais para Shorts & Reels",
      badge: "Monetização",
      desc: "Crie conteúdos com danças, animações de alta energia e transições dinâmicas sem gravar uma única cena.",
      videoUrl: "/media/landing/videos/motion_dancer.mp4",
      tags: ["60 FPS", "Motion Transfer", "Efeitos Neon"],
    },
    {
      title: "Trailers & Produção Cinematográfica",
      badge: "Cinema & YouTube",
      desc: "Câmeras orbitais, simulação de clima e iluminação de cinema para vídeos narrativos e trailers.",
      videoUrl: "/media/landing/videos/cinematic_hypercar.mp4",
      tags: ["Física Realista", "Kling AI 1.5", "Cinematic Aspect"],
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold uppercase">
          ✦ Workflows Prontos para Usar
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">
          Comece com um workflow pronto.
        </h2>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed">
          Modelos testados e validados para gerar vendas, seguidores e engajamento sem precisar configurar nada do zero.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {workflows.map((wf, idx) => (
          <div
            key={idx}
            className="bg-[#0D0E12] border border-[#1E202E] hover:border-cyan-500/40 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-black">
              <video
                src={wf.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-transparent opacity-80" />
              <div className="absolute top-3 left-3 bg-[#0D0E12]/90 border border-slate-700 text-cyan-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md">
                {wf.badge}
              </div>
            </div>

            <div className="p-5 space-y-3">
              <h3 className="text-sm font-bold text-white leading-snug">{wf.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{wf.desc}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {wf.tags.map((t, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#13141B] text-slate-300 border border-[#1E202E]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
