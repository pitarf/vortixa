"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

/**
 * Seção de Preços & Oferta de Elite — Estilo Octuz AI (Clean & Luxury).
 * Posicionada logo após o Hero.
 * Design sóbrio com cards refinados, comparativo objetivo de economia e planos transparentes.
 */
export function SalesTopPricingV2() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [pricingTab, setPricingTab] = useState<"subscription" | "credits">("subscription");

  return (
    <section id="planos-topo" className="py-10 sm:py-16 px-3 sm:px-6 max-w-7xl mx-auto space-y-10 sm:space-y-14 w-full scroll-mt-28">
      {/* Cabeçalho da Seção */}
      <div className="text-center space-y-3.5 max-w-3xl mx-auto">
        <span className="text-xs font-sans tracking-widest text-cyan-400 uppercase font-medium">
          Investimento Transparente
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-tight">
          Quanto você pagaria por{" "}
          <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            tudo isso separado?
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-light">
          Em vez de acumular 5 assinaturas em dólar que pesam no cartão, você centraliza sua produção em um único lugar com créditos que rendem de verdade.
        </p>
      </div>

      {/* Comparativo de Custos: Formato Cartão Elegante Octuz AI */}
      <div className="max-w-2xl mx-auto bg-[#0C0D12]/90 backdrop-blur-xl border border-white/[0.1] hover:border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 transition-all duration-300">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/[0.08]">
            <span className="font-medium">Ferramentas separadas no mercado</span>
            <span className="font-medium">Média de mercado</span>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-300 py-1.5 hover:text-white transition-colors">
            <span className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              Gerador de Imagens Fotorrealistas
            </span>
            <span className="font-mono text-slate-400">R$ 180 / mês</span>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-300 py-1.5 hover:text-white transition-colors">
            <span className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              Gerador de Vídeos em Alta Resolução
            </span>
            <span className="font-mono text-slate-400">R$ 190 / mês</span>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-300 py-1.5 hover:text-white transition-colors">
            <span className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              Clonagem de Movimentos (Motion Control)
            </span>
            <span className="font-mono text-slate-400">R$ 160 / mês</span>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-300 py-1.5 hover:text-white transition-colors">
            <span className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              Dublagem e Sincronia Labial em Português
            </span>
            <span className="font-mono text-slate-400">R$ 120 / mês</span>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-300 py-1.5 hover:text-white transition-colors">
            <span className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              Melhoria de Resolução para 4K
            </span>
            <span className="font-mono text-slate-400">R$ 200 / mês</span>
          </div>
        </div>

        {/* Linha de Fechamento de Valor */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/[0.08] flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-xs text-slate-400 block font-light">Total contratando avulso:</span>
            <span className="text-base sm:text-lg line-through text-slate-500 font-mono">~R$ 850 / mês</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-cyan-400 block font-medium tracking-wide">No VORTIXIA a partir de:</span>
            <span className="text-2xl sm:text-3xl font-normal text-white font-serif">R$ 39 <span className="text-xs font-sans text-slate-400">/ mês</span></span>
          </div>
        </div>
      </div>

      {/* Controles de Seleção de Plano (Abas e Ciclo de Faturamento) */}
      <div className="flex flex-col items-center space-y-4 pt-2">
        <div className="inline-flex items-center p-1.5 rounded-full bg-[#0C0D12] border border-white/[0.1] shadow-lg">
          <button
            type="button"
            onClick={() => setPricingTab("subscription")}
            className={`px-6 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
              pricingTab === "subscription"
                ? "bg-white text-slate-950 shadow-md font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Assinaturas Mensais
          </button>
          <button
            type="button"
            onClick={() => setPricingTab("credits")}
            className={`px-6 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
              pricingTab === "credits"
                ? "bg-white text-slate-950 shadow-md font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Pacotes de Créditos Avulsos
          </button>
        </div>

        {pricingTab === "subscription" && (
          <div className="flex items-center gap-3 text-xs font-sans text-slate-400">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${billingCycle === "monthly" ? "text-white font-medium underline underline-offset-4" : "hover:text-slate-200"}`}
            >
              Cobrança mensal
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`py-1.5 px-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${billingCycle === "yearly" ? "text-cyan-400 font-medium underline underline-offset-4" : "hover:text-slate-200"}`}
            >
              <span>Cobrança anual</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]">20% off</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid de Planos */}
      {pricingTab === "subscription" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {/* Plano Inicial */}
          <div className="bg-[#0C0D12] border border-white/[0.08] hover:border-white/20 hover:-translate-y-1.5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xl reveal-on-scroll reveal-delay-1">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-sans text-slate-400 uppercase tracking-wider block">Para experimentar</span>
                <h3 className="text-xl font-medium text-white">Plano Inicial</h3>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-normal text-white font-serif">
                  {billingCycle === "yearly" ? "R$ 31" : "R$ 39"}
                </span>
                <span className="text-xs text-slate-400 font-sans">/ mês</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Perfeito para validar a plataforma e gerar seus primeiros vídeos e influenciadores.
              </p>

              <div className="pt-4 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-300 font-light">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span><strong>150 Créditos</strong> renovados todo mês</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Acesso aos modelos de imagem e vídeo</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Download direto em alta qualidade</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Sem marca d'água</span>
                </div>
              </div>
            </div>

            <Link
              href="/register?plan=starter"
              className="w-full py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-98 border border-white/[0.12] text-white text-xs font-medium text-center transition-all min-h-[48px] flex items-center justify-center cursor-pointer shadow-sm"
            >
              Começar com o Inicial
            </Link>
          </div>

          {/* Plano Creator Pro (Destaque Principal em Azul Neon) */}
          <div className="bg-[#111219] border-2 border-cyan-500/60 hover:border-cyan-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-[0_12px_45px_rgba(6,182,212,0.22)] relative scale-100 lg:scale-105 z-10 hover:-translate-y-2 transition-all duration-300 reveal-scale reveal-delay-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-950 text-[10px] font-sans font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.6)]">
              Mais Escolhido
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-sans text-cyan-400 uppercase tracking-wider block font-medium">Criadores & Produtores</span>
                <h3 className="text-xl font-medium text-white">Creator Pro</h3>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-normal text-white font-serif">
                  {billingCycle === "yearly" ? "R$ 79" : "R$ 99"}
                </span>
                <span className="text-xs text-slate-400 font-sans">/ mês</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Para quem produz conteúdos recorrentes para TikTok, Instagram Reels, anúncios e canais dark.
              </p>

              <div className="pt-4 border-t border-white/[0.08] space-y-2.5 text-xs text-slate-200 font-light">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span><strong>500 Créditos</strong> renovados mensalmente</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Sincronia labial (LipSync) e Motion Dança</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Aumento de resolução para 4K Ultra HD</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Prioridade na fila de renderização</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Direito de uso comercial liberado</span>
                </div>
              </div>
            </div>

            <Link
              href="/register?plan=creator_pro"
              className="w-full py-3.5 rounded-full bg-white hover:bg-slate-100 active:scale-98 text-slate-950 text-xs font-bold text-center transition-all min-h-[48px] flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl"
            >
              Assinar Creator Pro
            </Link>
          </div>

          {/* Plano Studio */}
          <div className="bg-[#0C0D12] border border-white/[0.08] hover:border-white/20 hover:-translate-y-1.5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xl reveal-on-scroll reveal-delay-3">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-sans text-slate-400 uppercase tracking-wider block">Agências & Equipes</span>
                <h3 className="text-lg font-medium text-white">Studio & Agências</h3>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-normal text-white font-serif">
                  {billingCycle === "yearly" ? "R$ 199" : "R$ 249"}
                </span>
                <span className="text-xs text-slate-400 font-sans">/ mês</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Para quem gerencia múltiplas contas, clientes de agência e precisa de renderizações paralelas.
              </p>

              <div className="pt-4 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-300 font-light">
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span><strong>1.500 Créditos</strong> mensais dedicados</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Renderização paralela de múltiplos nós</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Suporte prioritário via WhatsApp</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Acesso antecipado a novos modelos</span>
                </div>
              </div>
            </div>

            <Link
              href="/register?plan=studio"
              className="w-full py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-98 border border-white/[0.12] text-white text-xs font-medium text-center transition-all min-h-[48px] flex items-center justify-center cursor-pointer shadow-sm"
            >
              Assinar Plano Studio
            </Link>
          </div>
        </div>
      ) : (
        /* Pacotes Avulsos (Sem Mensalidade, a partir de R$ 9,90) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto items-stretch">
          <div className="bg-[#0C0D12] border border-white/[0.08] hover:border-white/20 hover:-translate-y-1 rounded-3xl p-6 flex flex-col justify-between space-y-4 transition-all duration-300 shadow-lg">
            <div className="space-y-2.5">
              <span className="text-[11px] font-sans px-3 py-1 rounded-full bg-white/[0.05] text-slate-300 inline-block">
                50 Créditos
              </span>
              <h4 className="text-base font-medium text-white">Pacote Teste</h4>
              <div className="text-2xl sm:text-3xl font-serif text-white">R$ 9,90</div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">Para quem quer fazer uma geração rápida de teste.</p>
            </div>
            <Link
              href="/register?package=pkg-test"
              className="w-full py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-98 text-white text-xs text-center border border-white/[0.12] min-h-[44px] flex items-center justify-center transition-all cursor-pointer font-medium"
            >
              Comprar por R$ 9,90
            </Link>
          </div>

          <div className="bg-[#0C0D12] border border-white/[0.08] hover:border-white/20 hover:-translate-y-1 rounded-3xl p-6 flex flex-col justify-between space-y-4 transition-all duration-300 shadow-lg">
            <div className="space-y-2.5">
              <span className="text-[11px] font-sans px-3 py-1 rounded-full bg-white/[0.05] text-slate-300 inline-block">
                100 Créditos
              </span>
              <h4 className="text-base font-medium text-white">Iniciante</h4>
              <div className="text-2xl sm:text-3xl font-serif text-white">R$ 19,90</div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">Ideal para criar um primeiro lote de imagens ou vídeo.</p>
            </div>
            <Link
              href="/register?package=pkg-100"
              className="w-full py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-98 text-white text-xs text-center border border-white/[0.12] min-h-[44px] flex items-center justify-center transition-all cursor-pointer font-medium"
            >
              Comprar por R$ 19,90
            </Link>
          </div>

          <div className="bg-[#111219] border border-cyan-500/50 hover:border-cyan-400 hover:-translate-y-1.5 rounded-3xl p-6 flex flex-col justify-between space-y-4 relative transition-all duration-300 shadow-[0_8px_30px_rgba(6,182,212,0.18)]">
            <span className="absolute -top-3 right-5 text-[10px] font-sans bg-cyan-400 text-slate-950 font-bold px-3 py-0.5 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              Recomendado
            </span>
            <div className="space-y-2.5">
              <span className="text-[11px] font-sans px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium inline-block">
                500 + 50 Bônus
              </span>
              <h4 className="text-base font-medium text-white">Profissional</h4>
              <div className="text-2xl sm:text-3xl font-serif text-white">R$ 79,90</div>
              <p className="text-xs text-slate-300 font-light leading-relaxed">Ótimo volume para produzir sem compromisso mensal.</p>
            </div>
            <Link
              href="/register?package=pkg-500"
              className="w-full py-3 rounded-full bg-white hover:bg-slate-100 active:scale-98 text-slate-950 font-bold text-xs text-center min-h-[44px] flex items-center justify-center shadow transition-all cursor-pointer"
            >
              Comprar por R$ 79,90
            </Link>
          </div>

          <div className="bg-[#0C0D12] border border-white/[0.08] hover:border-white/20 hover:-translate-y-1 rounded-3xl p-6 flex flex-col justify-between space-y-4 transition-all duration-300 shadow-lg">
            <div className="space-y-2.5">
              <span className="text-[11px] font-sans px-3 py-1 rounded-full bg-white/[0.05] text-slate-300 inline-block">
                1000 + 150 Bônus
              </span>
              <h4 className="text-base font-medium text-white">Criador Pro</h4>
              <div className="text-2xl sm:text-3xl font-serif text-white">R$ 149,90</div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">Para produções completas com dublagem e render em 4K.</p>
            </div>
            <Link
              href="/register?package=pkg-1000"
              className="w-full py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:scale-98 text-white text-xs text-center border border-white/[0.12] min-h-[44px] flex items-center justify-center transition-all cursor-pointer font-medium"
            >
              Comprar por R$ 149,90
            </Link>
          </div>
        </div>
      )}

      {/* Selo de Garantia Sem Risco */}
      <div className="max-w-xl mx-auto text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-2 text-xs font-sans text-slate-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>7 dias de garantia incondicional</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-light">
          Experimente a plataforma com segurança. Se não atender suas expectativas na primeira semana, basta solicitar o estorno diretamente pelo painel.
        </p>
      </div>
    </section>
  );
}
