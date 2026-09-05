"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Video, Image, Volume2, Maximize2 } from "lucide-react";

export function PlanCapacityCalculator() {
  const [activePlan, setActivePlan] = useState<number>(1);

  const plans = [
    {
      name: "Start",
      price: "R$ 39",
      credits: "150 Créditos",
      items: [
        { label: "Vídeos em 1080p (Kling AI)", count: "15 vídeos", icon: Video },
        { label: "Imagens 8K (FLUX.1 Schnell)", count: "60 imagens", icon: Image },
        { label: "Lip-Sync & Dublagens", count: "20 falas", icon: Volume2 },
        { label: "Upscale 4K Ultra HD", count: "15 masters", icon: Maximize2 },
      ],
    },
    {
      name: "Pro Creator",
      price: "R$ 99/mês",
      credits: "500 Créditos",
      popular: true,
      items: [
        { label: "Vídeos em 1080p (Kling AI)", count: "50 vídeos", icon: Video },
        { label: "Imagens 8K (FLUX.1 Schnell)", count: "200 imagens", icon: Image },
        { label: "Lip-Sync & Dublagens", count: "70 falas", icon: Volume2 },
        { label: "Upscale 4K Ultra HD", count: "50 masters", icon: Maximize2 },
      ],
    },
    {
      name: "Studio & Agência",
      price: "R$ 249/mês",
      credits: "1.500 Créditos",
      items: [
        { label: "Vídeos em 1080p (Kling AI)", count: "160 vídeos", icon: Video },
        { label: "Imagens 8K (FLUX.1 Schnell)", count: "650 imagens", icon: Image },
        { label: "Lip-Sync & Dublagens", count: "220 falas", icon: Volume2 },
        { label: "Upscale 4K Ultra HD", count: "160 masters", icon: Maximize2 },
      ],
    },
  ];

  const current = plans[activePlan];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase">
          ✦ Poder de Criação
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">
          Veja o que você consegue criar com cada plano
        </h2>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed">
          Sem taxas ocultas ou limites artificiais. Seus créditos rendem produções completas.
        </p>
      </div>

      {/* Plan Selector Buttons */}
      <div className="flex justify-center gap-2">
        {plans.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setActivePlan(idx)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePlan === idx
                ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-600/25"
                : "bg-[#0D0E12] text-slate-400 border border-[#1E202E] hover:text-white"
            }`}
          >
            {p.name} • {p.price}
          </button>
        ))}
      </div>

      {/* Dynamic Visual Capacity Dashboard */}
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E202E]">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase font-bold">Capacidade do Plano {current.name}</div>
            <div className="text-2xl font-black text-white font-heading">{current.credits}</div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400">Investimento:</span>
            <div className="text-xl font-bold text-white">{current.price}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {current.items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-4 rounded-2xl bg-[#070709] border border-[#1E202E] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs text-slate-300">{item.label}</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/register"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 hover:opacity-95 transition-all"
            style={{ minHeight: "48px" }}
          >
            <span>Escolher Plano {current.name}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
