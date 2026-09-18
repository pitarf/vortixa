"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Zap, XCircle, Sparkles, ShieldCheck } from "lucide-react";

/**
 * Seção de Preços & Economia — Dark Obsidian Premium.
 * Comparativo visual de choque de custos (Ferramentas Separadas vs. VORTIXIA) e 3 planos claros.
 * Touch targets >= 44px e escala fluida para telas de 320px sem degraus.
 */
export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20 px-3 sm:px-6 max-w-7xl mx-auto space-y-10 sm:space-y-12 w-full">
      {/* Container Monumental Dark Obsidian */}
      <div className="bg-gradient-to-b from-[#0D0E14] via-[#0A0B10] to-[#07080B] border border-white/[0.08] rounded-[28px] sm:rounded-[36px] md:rounded-[48px] p-4 sm:p-8 md:p-14 shadow-[0_30px_100px_rgba(0,0,0,0.85)] space-y-10 sm:space-y-12">
        
        {/* Cabeçalho */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span>INVESTIMENTO & PLANOS ACESSÍVEIS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Tudo o que você precisa em <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300">um só plano</span>.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Economize centenas de reais por mês centralizando imagens, vídeos, motion control, dublagem labial e upscale 4K em uma única assinatura com créditos compartilhados.
          </p>

          {/* Toggle de Ciclo de Faturamento (Touch target >= 44px) */}
          <div className="pt-2 flex items-center justify-center gap-2 sm:gap-3 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl transition-all cursor-pointer min-h-[44px] flex items-center justify-center active:scale-95 ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-950 font-bold shadow-md"
                  : "text-slate-400 hover:text-white bg-white/[0.03]"
              }`}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] active:scale-95 ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-600/30"
                  : "text-slate-400 hover:text-white bg-white/[0.03]"
              }`}
            >
              <span>Anual</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Comparador Visual de Gastos: "Pagando Separado vs. VORTIXIA" */}
        <div className="bg-[#07080B] border border-white/[0.08] rounded-3xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-center">
            {/* Gastando Separado */}
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-rose-400 font-bold font-mono uppercase">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Pagando Assinaturas Separadas:</span>
              </div>
              <div className="space-y-1.5 text-slate-400">
                <div className="flex justify-between gap-2"><span>Midjourney (Imagens)</span><span className="font-mono text-slate-300 shrink-0">R$ 180/mês</span></div>
                <div className="flex justify-between gap-2"><span>Runway Gen-3 (Vídeos)</span><span className="font-mono text-slate-300 shrink-0">R$ 190/mês</span></div>
                <div className="flex justify-between gap-2"><span>Kling AI (Motion & Dança)</span><span className="font-mono text-slate-300 shrink-0">R$ 160/mês</span></div>
                <div className="flex justify-between gap-2"><span>ElevenLabs (Vozes & Áudio)</span><span className="font-mono text-slate-300 shrink-0">R$ 120/mês</span></div>
                <div className="flex justify-between gap-2"><span>Topaz Video (Upscale 4K)</span><span className="font-mono text-slate-300 shrink-0">R$ 200/mês</span></div>
              </div>
              <div className="pt-2.5 border-t border-rose-500/20 flex justify-between font-bold text-rose-300">
                <span>Total Estimado:</span>
                <span className="font-mono text-sm line-through text-rose-400">~R$ 850/mês</span>
              </div>
            </div>

            {/* Com o VORTIXIA */}
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#0D0E14] text-white border border-violet-500/40 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="flex items-center gap-2 text-violet-300 font-bold font-mono text-xs uppercase">
                <Zap className="w-4 h-4 text-cyan-400 fill-current shrink-0" />
                <span>Aqui no VORTIXIA:</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Você tem acesso às melhores ferramentas usando créditos que não vencem de surpresa. Paga apenas pelo que produzir, sem mensalidades duplicadas.
              </p>
              <div className="pt-2 border-t border-white/[0.08] flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">A partir de</span>
                  <span className="text-3xl font-extrabold text-white">R$ 39</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold shrink-0">
                  Economia &gt; 80%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid com os 3 Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto items-stretch">
          {/* Starter Pack */}
          <div className="bg-[#07080B] border border-white/[0.08] hover:border-white/20 rounded-3xl p-5 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl transition-all">
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-400 uppercase font-bold">Pacote Inicial</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {billingCycle === "yearly" ? "R$ 31" : "R$ 39"}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ avulso</span>
              </div>
              <p className="text-xs text-slate-400">Ideal para testar e criar os primeiros vídeos e avatares.</p>

              <div className="pt-4 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span><strong>150 Créditos</strong> sem prazo curto</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Acesso completo ao Canvas FLOW</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>FLUX.1 Schnell & Kling AI 1.5</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Download direto em qualidade HD</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-bold text-xs text-center transition-all min-h-[44px] flex items-center justify-center cursor-pointer active:scale-95"
            >
              Começar com Starter
            </Link>
          </div>

          {/* Creator Pro (Plano Protagonista com Destaque Violeta) */}
          <div className="bg-[#12141F] text-white border-2 border-violet-500 rounded-3xl p-5 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_0_40px_rgba(139,92,246,0.35)] relative scale-100 lg:scale-105 z-10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-mono font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
              ✦ MAIS ESCOLHIDO
            </div>

            <div className="space-y-4">
              <div className="text-xs font-mono text-violet-400 uppercase font-bold">Creator Pro</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {billingCycle === "yearly" ? "R$ 79" : "R$ 99"}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ mês</span>
              </div>
              <p className="text-xs text-slate-300">Para criadores de conteúdo, afiliados, agências e canais dark.</p>

              <div className="pt-4 border-t border-white/[0.08] space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span><strong>500 Créditos</strong> renovados todo mês</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Fila de renderização prioritária</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>LipSync fotorrealista e Motion Dança</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Creative Upscale 4K Ultra HD</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Direito de uso comercial irrestrito</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-extrabold text-xs text-center shadow-lg shadow-violet-600/40 transition-all min-h-[48px] flex items-center justify-center cursor-pointer active:scale-95"
            >
              Assinar Plano Creator Pro
            </Link>
          </div>

          {/* Studio Agency */}
          <div className="bg-[#07080B] border border-white/[0.08] hover:border-white/20 rounded-3xl p-5 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl transition-all">
            <div className="space-y-4">
              <div className="text-xs font-mono text-cyan-400 uppercase font-bold">Studio & Produtoras</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {billingCycle === "yearly" ? "R$ 199" : "R$ 249"}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ mês</span>
              </div>
              <p className="text-xs text-slate-400">Para agências com alto volume de renderização paralela diária.</p>

              <div className="pt-4 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span><strong>1.500 Créditos</strong> mensais dedicados</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Renderização paralela de múltiplos nós</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Geração em lote (Batch Mode)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Suporte prioritário via WhatsApp</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-bold text-xs text-center transition-all min-h-[44px] flex items-center justify-center cursor-pointer active:scale-95"
            >
              Assinar Plano Studio
            </Link>
          </div>
        </div>

        {/* Selo de Blindagem & Garantia de 7 Dias */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#07080B] border border-emerald-500/30 max-w-2xl mx-auto text-center space-y-2 flex flex-col items-center shadow-md">
          <ShieldCheck className="w-8 h-8 text-emerald-400 mb-1 shrink-0" />
          <h4 className="text-sm font-bold text-white">Garantia sem complicação de 7 dias</h4>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            Teste a plataforma com tranquilidade. Se achar que não fez sentido para o seu momento, basta nos avisar em até 7 dias que estornamos o valor pago.
          </p>
        </div>
      </div>
    </section>
  );
}
