"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Zap, ArrowRight, ShieldCheck, XCircle } from "lucide-react";

/**
 * Seção de Preços, Economia e Garantia com Quebra de Ritmo (Fundo Claro / Off-White).
 * Layout editorial com comparativo de economia e 3 opções claras de adesão.
 */
export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-20 px-3 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Container Amplo Off-White de Preços com Quebra Visual */}
      <div className="bg-[#F4F4F6] text-slate-900 border border-slate-200/80 rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 md:p-14 shadow-[0_20px_80px_rgba(0,0,0,0.3)] space-y-12">
        
        {/* Cabeçalho */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
            <span>Planos & Investimento</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-950 tracking-tight leading-tight">
            Tudo o que você precisa em <span className="font-serif italic font-normal text-slate-800">um só plano</span>.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
            Economize centenas de reais por mês centralizando todas as suas ferramentas de criação audiovisual com IA em uma única assinatura.
          </p>
        </div>

        {/* Banner Visual de Economia Comparativa */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Gastando Separado */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-rose-50 border border-rose-200/60 text-xs text-slate-700">
              <div className="flex items-center gap-2 text-rose-700 font-bold font-mono uppercase">
                <XCircle className="w-4 h-4" /> Pagando Separado:
              </div>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between"><span>Midjourney (Imagens)</span><span className="font-mono font-medium">R$ 180/mês</span></div>
                <div className="flex justify-between"><span>Runway Gen-3 (Vídeos)</span><span className="font-mono font-medium">R$ 190/mês</span></div>
                <div className="flex justify-between"><span>Kling AI (Motion & Dança)</span><span className="font-mono font-medium">R$ 160/mês</span></div>
                <div className="flex justify-between"><span>ElevenLabs (Vozes & Áudio)</span><span className="font-mono font-medium">R$ 120/mês</span></div>
                <div className="flex justify-between"><span>Topaz Video (Upscale 4K)</span><span className="font-mono font-medium">R$ 200/mês</span></div>
              </div>
              <div className="pt-2 border-t border-rose-200 flex justify-between font-bold text-rose-900">
                <span>Total Estimado:</span>
                <span className="font-mono text-sm line-through">~R$ 850/mês</span>
              </div>
            </div>

            {/* Com o VORIXA FLOW */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 text-violet-300 font-bold font-mono text-xs uppercase">
                <Zap className="w-4 h-4 text-cyan-400 fill-current" /> Com o VORIXA:
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Todas as IAs integradas com créditos compartilhados e fluxos visuais automáticos.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">A partir de</span>
                  <span className="text-2xl font-bold text-white">R$ 39</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold">
                  Economia &gt; 80%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid com os 3 Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {/* Starter Pack */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-500 uppercase font-bold">Pacote Inicial</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-slate-950">R$ 39</span>
                <span className="text-xs text-slate-500 font-mono">/ avulso</span>
              </div>
              <p className="text-xs text-slate-600">Ideal para testar e criar os primeiros vídeos e avatares.</p>

              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span><strong>150 Créditos</strong> sem validade curta</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Acesso ao VORIXA FLOW (Canvas)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>FLUX.1 Schnell & Kling AI 1.5</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Download em qualidade HD</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-xs text-center transition-all min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              Começar com Starter
            </Link>
          </div>

          {/* Creator Pro (Destaque Protagonista Preto) */}
          <div className="bg-[#09090B] text-white border-2 border-violet-500/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-mono font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
              ✦ Mais Popular
            </div>

            <div className="space-y-4">
              <div className="text-xs font-mono text-violet-400 uppercase font-bold">Creator Pro</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-white">R$ 99</span>
                <span className="text-xs text-slate-400 font-mono">/ mês</span>
              </div>
              <p className="text-xs text-slate-300">Para criadores de conteúdo, afiliados e canais dark.</p>

              <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-200">
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
                  <span>Direito de uso comercial total</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs text-center shadow-lg shadow-violet-600/30 transition-all min-h-[48px] flex items-center justify-center cursor-pointer hover:scale-102"
            >
              Começar com Creator Pro
            </Link>
          </div>

          {/* Studio Agency */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="text-xs font-mono text-cyan-600 uppercase font-bold">Studio & Produtoras</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold text-slate-950">R$ 249</span>
                <span className="text-xs text-slate-500 font-mono">/ mês</span>
              </div>
              <p className="text-xs text-slate-600">Para agências com alto volume de renderização diária.</p>

              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span><strong>1.500 Créditos</strong> mensais</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Renderização ultra-rápida paralela</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Geração em lote (Batch Mode)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Suporte prioritário via WhatsApp</span>
                </div>
              </div>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-xs text-center transition-all min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              Assinar Plano Studio
            </Link>
          </div>
        </div>

        {/* Selo de Garantia de 7 Dias */}
        <div className="p-6 rounded-2xl bg-white border border-emerald-500/40 max-w-2xl mx-auto text-center space-y-2 flex flex-col items-center shadow-sm">
          <ShieldCheck className="w-8 h-8 text-emerald-600 mb-1" />
          <h4 className="text-sm font-bold text-slate-950">Garantia Incondicional de 7 Dias</h4>
          <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
            Experimente o VORIXA sem risco algum. Se por qualquer motivo você não ficar 100% satisfeito com a qualidade dos vídeos e imagens gerados, devolvemos seu dinheiro integralmente.
          </p>
        </div>
      </div>
    </section>
  );
}
