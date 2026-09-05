"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check, X, ShieldAlert, Sparkles } from "lucide-react";

export function CostComparison() {
  const tools = [
    { name: "ChatGPT Plus / Claude Pro", price: "R$ 130/mês" },
    { name: "Midjourney Pro", price: "R$ 180/mês" },
    { name: "Kling AI Pro (Vídeo)", price: "R$ 240/mês" },
    { name: "ElevenLabs (Voz IA)", price: "R$ 160/mês" },
    { name: "Topaz Video Upscale 4K", price: "R$ 190/mês" },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono font-bold uppercase">
          ✦ Economia Real de Mercado
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight font-heading">
          Quanto você pagaria separado por tudo isso?
        </h2>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed">
          Se você fosse assinar cada ferramenta individualmente para criar o mesmo conteúdo, este seria o seu custo fixo todo mês:
        </p>
      </div>

      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl max-w-3xl mx-auto">
        {/* Tabela de Preços dos Concorrentes Isolados */}
        <div className="divide-y divide-[#1E202E]/60 space-y-1">
          {tools.map((t, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-slate-600" />
                <span>{t.name}</span>
              </div>
              <span className="font-mono text-slate-400">{t.price}</span>
            </div>
          ))}
        </div>

        {/* Totalizador Concorrentes vs VORIXA */}
        <div className="pt-6 border-t border-[#1E202E] flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#070709] p-6 rounded-2xl border border-red-500/20">
          <div className="text-center sm:text-left">
            <div className="text-xs font-mono text-red-400 uppercase font-bold">Total Mensal Separado</div>
            <div className="text-3xl sm:text-4xl font-black text-red-400 line-through font-heading">
              ~R$ 900 /mês
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-xs font-mono text-cyan-400 uppercase font-bold">Com o VORIXA</div>
            <div className="text-3xl sm:text-4xl font-black text-white font-heading">
              A partir de R$ 39
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all"
            style={{ minHeight: "48px" }}
          >
            <span>Centralizar tudo no VORIXA agora</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
