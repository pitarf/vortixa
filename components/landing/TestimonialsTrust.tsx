"use client";

import React from "react";
import { Star, ShieldCheck, Zap, Award, Sparkles } from "lucide-react";

export function TestimonialsTrust() {
  const testimonials = [
    {
      name: "Rodrigo Mendonça",
      role: "Diretor Criativo @ Nexus Studio",
      text: "O VORIXA FLOW mudou nosso pipeline. Conseguimos criar comerciais cinematográficos inteiros com dublagem e render 4K em menos de 10 minutos.",
      rating: 5,
      avatar: "RM",
    },
    {
      name: "Camila Vaz",
      role: "Criadora de Conteúdo & UGC (1.2M)",
      text: "A qualidade do LipSync e a consistência do Kling 1.5 no VORIXA são incomparáveis. Economizo horas de edição manual todos os dias.",
      rating: 5,
      avatar: "CV",
    },
    {
      name: "Lucas Alencar",
      role: "Fundador @ GrowthMedia",
      text: "Centralizar 5 motores de IA em um só saldo de créditos reduziu nossos custos com softwares em quase 70%. É o melhor sistema do mercado.",
      rating: 5,
      avatar: "LA",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono font-bold uppercase">
          ✦ Comunidade & Prova Social
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">
          Aprovado por Criadores e Agências Líderes
        </h2>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed">
          Mais de 10.000 horas de vídeos geradas com consistência cinematográfica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl flex flex-col justify-between hover:border-violet-500/30 transition-all"
          >
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                "{t.text}"
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E202E] flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
                {t.avatar}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{t.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
