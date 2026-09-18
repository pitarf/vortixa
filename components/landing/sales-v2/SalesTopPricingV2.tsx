"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Zap, XCircle, Sparkles, ShieldCheck, Flame, ArrowRight, QrCode, Lock } from "lucide-react";

/**
 * Seção de Preços & Oferta Principal — Posicionada no TOPO da Home V2.
 * Dá resposta imediata ao desejo do dono: apresentar a oferta comercial logo após o Hero.
 * Inclui:
 * 1. Choque de Economia (R$ 850/mês separado vs. a partir de R$ 9,90 / R$ 39 no VORIXA).
 * 2. Toggle Mensal/Anual e Pacotes Avulsos rápidos.
 * 3. 3 Planos Estratégicos com destaque para o Plano Creator Pro.
 * 4. Garantia Incondicional de 7 dias e selos de segurança.
 */
export function SalesTopPricingV2() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [pricingTab, setPricingTab] = useState<"subscription" | "credits">("subscription");

  return (
    <section id="planos-topo" className="py-8 sm:py-12 md:py-16 px-3 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-10 w-full scroll-mt-32">
      {/* Container Monumental Dark Obsidian de Oferta */}
      <div className="bg-gradient-to-b from-[#0F111A] via-[#0A0B10] to-[#07080B] border-2 border-emerald-500/30 rounded-[28px] sm:rounded-[40px] md:rounded-[48px] p-4 sm:p-8 md:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.9)] space-y-8 sm:space-y-10 relative overflow-hidden">
        
        {/* Glow Superior de Atração */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Cabeçalho da Oferta */}
        <div className="text-center space-y-3 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
            <Flame className="w-3.5 h-3.5 text-emerald-400 fill-current animate-pulse shrink-0" />
            <span>ESCOLHA SEU PLANO E COMECE A PRODUZIR HOJE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Tudo o que você precisa em <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">um só plano acessível</span>.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Tenha acesso instantâneo a todos os modelos de IA, geração de vídeos, sincronização labial, clonagem de movimentos e upscale 4K sem pagar 5 ferramentas separadas.
          </p>

          {/* Abas: Assinatura Mensal vs Pacotes de Créditos Sem Mensalidade */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setPricingTab("subscription")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2 ${
                pricingTab === "subscription"
                  ? "bg-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/30"
                  : "bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.08]"
              }`}
            >
              <Zap className="w-4 h-4 fill-current shrink-0" />
              <span>Planos Mensais Recorrentes</span>
            </button>

            <button
              type="button"
              onClick={() => setPricingTab("credits")}
              className={`px-4 sm:px-5 py-2.5 rounded-xl transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2 ${
                pricingTab === "credits"
                  ? "bg-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/30"
                  : "bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.08]"
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Pacotes Avulsos (Sem Assinatura)</span>
            </button>
          </div>

          {/* Toggle de Ciclo de Faturamento para Assinaturas */}
          {pricingTab === "subscription" && (
            <div className="pt-1 flex items-center justify-center gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer min-h-[40px] flex items-center justify-center active:scale-95 ${
                  billingCycle === "monthly"
                    ? "bg-white text-slate-950 font-bold shadow-md"
                    : "text-slate-400 hover:text-white bg-white/[0.03]"
                }`}
              >
                Cobrança Mensal
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[40px] active:scale-95 ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/30"
                    : "text-slate-400 hover:text-white bg-white/[0.03]"
                }`}
              >
                <span>Cobrança Anual</span>
                <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
                  20% OFF
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Comparador de Choque de Gastos (Direct Response / Vendas) */}
        <div className="bg-[#07080B] border border-white/[0.08] rounded-3xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto shadow-xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-center">
            {/* Gastando Separado */}
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-rose-950/20 border border-rose-500/25 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-rose-400 font-bold font-mono uppercase">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Assinando Ferramentas Separadas:</span>
              </div>
              <div className="space-y-1.5 text-slate-400">
                <div className="flex justify-between gap-2"><span>Midjourney (Fotos)</span><span className="font-mono text-slate-300 shrink-0">R$ 180/mês</span></div>
                <div className="flex justify-between gap-2"><span>Runway Gen-3 (Vídeos)</span><span className="font-mono text-slate-300 shrink-0">R$ 190/mês</span></div>
                <div className="flex justify-between gap-2"><span>Kling AI (Motion Control)</span><span className="font-mono text-slate-300 shrink-0">R$ 160/mês</span></div>
                <div className="flex justify-between gap-2"><span>ElevenLabs (Locução)</span><span className="font-mono text-slate-300 shrink-0">R$ 120/mês</span></div>
                <div className="flex justify-between gap-2"><span>Topaz Video (Upscale 4K)</span><span className="font-mono text-slate-300 shrink-0">R$ 200/mês</span></div>
              </div>
              <div className="pt-2.5 border-t border-rose-500/20 flex justify-between font-bold text-rose-300">
                <span>Custo Médio Mensal:</span>
                <span className="font-mono text-sm line-through text-rose-400">~R$ 850/mês</span>
              </div>
            </div>

            {/* Com o VORIXA */}
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#12141F] to-[#0D0E14] text-white border-2 border-emerald-500/40 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-emerald-300 font-bold font-mono text-xs uppercase">
                <Zap className="w-4 h-4 text-emerald-400 fill-current shrink-0" />
                <span>Tudo Unificado no VORIXA:</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Você acessa os mesmos motores de ponta em um estúdio centralizado. Economize tempo e mais de 80% em dinheiro com créditos transparentes.
              </p>
              <div className="pt-2 border-t border-white/[0.08] flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Planos a partir de</span>
                  <span className="text-3xl sm:text-4xl font-black text-white">R$ 39</span>
                  <span className="text-xs text-slate-400 font-mono"> / mês</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold shrink-0">
                  Economia Real
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Dinâmico por Aba: Assinaturas ou Pacotes Avulsos */}
        {pricingTab === "subscription" ? (
          /* Grid com os 3 Planos Mensais/Anuais */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto items-stretch relative z-10">
            {/* Starter Pack */}
            <div className="bg-[#07080B] border border-white/[0.08] hover:border-white/20 rounded-3xl p-5 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl transition-all">
              <div className="space-y-4">
                <div className="text-xs font-mono text-slate-400 uppercase font-bold">Plano Inicial</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {billingCycle === "yearly" ? "R$ 31" : "R$ 39"}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/ mês</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Ideal para testar e criar seus primeiros vídeos e avatares com IA.</p>

                <div className="pt-4 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>150 Créditos</strong> todo mês</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Acesso ao VORIXA FLOW & Estúdio</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>FLUX.1 Schnell & Kling AI</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Download sem marca d'água</span>
                  </div>
                </div>
              </div>

              <Link
                href="/register?plan=starter"
                className="w-full py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white font-bold text-xs text-center transition-all min-h-[44px] flex items-center justify-center cursor-pointer active:scale-95"
              >
                Assinar Plano Inicial
              </Link>
            </div>

            {/* Creator Pro (Mais Vendido com Destaque Especial) */}
            <div className="bg-gradient-to-b from-[#12141F] to-[#0A0B10] text-white border-2 border-emerald-500 rounded-3xl p-5 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative scale-100 lg:scale-105 z-10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-mono font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                ✦ MAIS VENDIDO & RECOMENDADO
              </div>

              <div className="space-y-4">
                <div className="text-xs font-mono text-emerald-400 uppercase font-bold">Creator Pro</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {billingCycle === "yearly" ? "R$ 79" : "R$ 99"}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ mês</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">Perfeito para criadores de conteúdo, afiliados, agências e canais dark.</p>

                <div className="pt-4 border-t border-white/[0.08] space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>500 Créditos</strong> renovados mensalmente</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Fila de renderização ultra-rápida</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>LipSync em Português e Motion Dança</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Creative Upscale 4K Ultra HD</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Direito de uso comercial 100% livre</span>
                  </div>
                </div>
              </div>

              <Link
                href="/register?plan=creator_pro"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-sm text-center shadow-lg shadow-emerald-500/40 transition-all min-h-[48px] flex items-center justify-center cursor-pointer active:scale-95"
              >
                Garantir Plano Creator Pro
              </Link>
            </div>

            {/* Studio Ultra */}
            <div className="bg-[#07080B] border border-white/[0.08] hover:border-white/20 rounded-3xl p-5 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl transition-all">
              <div className="space-y-4">
                <div className="text-xs font-mono text-cyan-400 uppercase font-bold">Studio & Produtoras</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    {billingCycle === "yearly" ? "R$ 199" : "R$ 249"}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/ mês</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Para times e agências com alto volume diário de campanhas e clientes.</p>

                <div className="pt-4 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>1.500 Créditos</strong> mensais dedicados</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Renderização em lote e paralela</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Suporte prioritário via WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Acesso a novos modelos antes de todos</span>
                  </div>
                </div>
              </div>

              <Link
                href="/register?plan=studio"
                className="w-full py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white font-bold text-xs text-center transition-all min-h-[44px] flex items-center justify-center cursor-pointer active:scale-95"
              >
                Assinar Plano Studio
              </Link>
            </div>
          </div>
        ) : (
          /* Grid com Pacotes Avulsos (Sem Mensalidade, a partir de R$ 9,90) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto items-stretch relative z-10">
            {/* Pacote Teste R$ 9,90 */}
            <div className="bg-[#07080B] border border-white/[0.08] hover:border-emerald-500/40 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all">
              <div className="space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">
                  TESTE R$ 9,90
                </span>
                <h4 className="text-base font-bold text-white">Pacote Teste</h4>
                <div className="text-2xl font-extrabold text-white">R$ 9,90</div>
                <p className="text-xs text-slate-400">50 Créditos para testar imediatamente.</p>
              </div>
              <Link
                href="/register?package=pkg-test"
                className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-xs text-center transition-all min-h-[44px] flex items-center justify-center"
              >
                Comprar R$ 9,90
              </Link>
            </div>

            {/* Pacote Iniciante R$ 19,90 */}
            <div className="bg-[#07080B] border border-white/[0.08] hover:border-emerald-500/40 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all">
              <div className="space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  100 CRÉDITOS
                </span>
                <h4 className="text-base font-bold text-white">Iniciante</h4>
                <div className="text-2xl font-extrabold text-white">R$ 19,90</div>
                <p className="text-xs text-slate-400">Ideal para gerar suas primeiras fotos e vídeos.</p>
              </div>
              <Link
                href="/register?package=pkg-100"
                className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-xs text-center transition-all min-h-[44px] flex items-center justify-center"
              >
                Comprar R$ 19,90
              </Link>
            </div>

            {/* Pacote Profissional R$ 79,90 (Destaque) */}
            <div className="bg-[#12141F] border-2 border-emerald-500 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.25)] relative">
              <span className="absolute -top-2.5 right-4 text-[9px] font-mono font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                Mais Vendido
              </span>
              <div className="space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  500 + 50 BÔNUS
                </span>
                <h4 className="text-base font-bold text-white">Profissional</h4>
                <div className="text-2xl font-extrabold text-white">R$ 79,90</div>
                <p className="text-xs text-slate-300">Excelente para quem quer produzir com frequência sem mensalidade fixa.</p>
              </div>
              <Link
                href="/register?package=pkg-500"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center transition-all min-h-[44px] flex items-center justify-center shadow-md shadow-emerald-500/30"
              >
                Comprar R$ 79,90
              </Link>
            </div>

            {/* Pacote Criador Pro R$ 149,90 */}
            <div className="bg-[#07080B] border border-white/[0.08] hover:border-emerald-500/40 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all">
              <div className="space-y-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold">
                  1000 + 150 BÔNUS
                </span>
                <h4 className="text-base font-bold text-white">Criador Pro</h4>
                <div className="text-2xl font-extrabold text-white">R$ 149,90</div>
                <p className="text-xs text-slate-400">Máximo retorno em créditos para campanhas intensivas.</p>
              </div>
              <Link
                href="/register?package=pkg-1000"
                className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-xs text-center transition-all min-h-[44px] flex items-center justify-center"
              >
                Comprar R$ 149,90
              </Link>
            </div>
          </div>
        )}

        {/* Bloco de Blindagem e Garantia Sem Risco */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#07080B] border border-emerald-500/30 max-w-2xl mx-auto text-center space-y-2 flex flex-col items-center shadow-md relative z-10">
          <ShieldCheck className="w-7 h-7 text-emerald-400 mb-0.5 shrink-0" />
          <h4 className="text-sm font-bold text-white">Garantia Incondicional de 7 Dias</h4>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            Se por qualquer motivo você não ficar 100% satisfeito com o VORIXA nos primeiros 7 dias, solicite o cancelamento e estornamos seu investimento sem perguntas ou burocracia.
          </p>
        </div>
      </div>
    </section>
  );
}
