"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Sparkles, ShieldCheck, Flame, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SalesHeroV2 } from "@/components/landing/sales-v2/SalesHeroV2";
import { SalesTopPricingV2 } from "@/components/landing/sales-v2/SalesTopPricingV2";
import { SalesUseCasesV2 } from "@/components/landing/sales-v2/SalesUseCasesV2";
import { MotionProofShowcase } from "@/components/landing/MotionProofShowcase";
import { ResultsMasonryGallery } from "@/components/landing/ResultsMasonryGallery";
import { TestimonialsTrust } from "@/components/landing/TestimonialsTrust";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * HOME V2 — Página de Vendas de Alta Conversão Oficial do VORIXA.
 * Mantém a Home 1 intacta na raiz (/) e disponibiliza a Home 2 em (/home-2).
 * Foco:
 * 1. Planos de preços logo no primeiro terço de rolagem (Top Pricing).
 * 2. Storytelling direto focado em negócios, ROI e economia.
 * 3. Prova real em vídeo (Motion e Dança TikTok).
 * 4. Microgarantias (7 dias, Pix instantâneo, Cartão 12x).
 */
export default function HomeV2Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#07080B] text-foreground flex flex-col font-sans selection:bg-emerald-500/30 selection:text-white relative overflow-x-clip w-full">
      {/* Luzes Volumétricas de Fundo */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[350px] sm:h-[500px] bg-gradient-to-b from-emerald-600/15 via-violet-600/15 to-transparent blur-[120px] sm:blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-[45%] -right-[15%] sm:-right-[5%] w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-emerald-500/10 blur-[130px] sm:blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-[15%] -left-[15%] sm:-left-[5%] w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-cyan-500/10 blur-[130px] sm:blur-[150px] pointer-events-none -z-10" />

      {/* Banner de Alternância Rápida entre Home 1 e Home 2 para Comparação do Cliente */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#0D0E14] to-violet-950 border-b border-emerald-500/30 px-3 py-2 text-center text-xs text-slate-200 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
          <Flame className="w-3 h-3 text-emerald-400 fill-current animate-pulse" />
          HOME V2 (VERSÃO DE VENDAS)
        </span>
        <span className="hidden xs:inline text-slate-300">
          Planos no topo e foco direto em conversão comercial.
        </span>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-white hover:text-emerald-300 font-bold underline transition-colors"
          >
            Ver Home V1 (Institucional)
          </Link>
          <span className="text-slate-500">•</span>
          <a
            href="#planos-topo"
            className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
          >
            Ir para os Planos ↓
          </a>
        </div>
      </div>

      {/* Header Sticky com Floating Island */}
      <header className="sticky top-2 sm:top-3 z-50 px-3 sm:px-6 w-full max-w-7xl mx-auto">
        <div className="backdrop-blur-2xl bg-[#0D0E14]/90 border border-white/[0.1] shadow-[0_16px_40px_rgba(0,0,0,0.7)] rounded-2xl md:rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between transition-all duration-300">
          {/* Logo & Badge */}
          <Link href="/home-2" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-h-[44px]">
            <img
              src="/logos/logo principal.png"
              alt="VORIXA Logo"
              className="h-7 sm:h-8 md:h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-[10px] font-mono font-bold text-emerald-300 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>VENDAS V2</span>
            </span>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13px] font-medium tracking-wide text-slate-300">
            <a href="#planos-topo" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors duration-200 py-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Planos & Preços (Topo)</span>
            </a>
            <a href="#motion-proof" className="hover:text-emerald-300 transition-colors duration-200 flex items-center gap-1.5 py-2">
              <span>Dança & Motion Real</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </a>
            <a href="#use-cases" className="hover:text-white transition-colors duration-200 py-2">
              O Que Você Cria
            </a>
            <a href="#gallery" className="hover:text-white transition-colors duration-200 py-2">
              Resultados Reais
            </a>
            <a href="#faq" className="hover:text-white transition-colors duration-200 py-2">
              Dúvidas
            </a>
          </nav>

          {/* Ações Direitas */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link
              href="/login"
              className="hidden sm:inline-flex text-xs font-semibold text-slate-300 hover:text-white px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 min-h-[44px] items-center"
            >
              Entrar
            </Link>

            <a
              href="#planos-topo"
              className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-95 min-h-[44px]"
            >
              <span>Ver Planos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Botão Hamburger Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.05] border border-white/[0.1] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Menu de Navegação"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menu Gaveta Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 rounded-2xl bg-[#0D0E14] border border-white/[0.1] shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-1">
              <a
                href="#planos-topo"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-bold text-emerald-400 hover:text-emerald-300 rounded-xl hover:bg-emerald-500/10 min-h-[44px] flex items-center justify-between"
              >
                <span>Planos & Preços (Topo)</span>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 font-bold">
                  Oferta
                </span>
              </a>
              <a
                href="#motion-proof"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white rounded-xl hover:bg-white/[0.05] min-h-[44px] flex items-center"
              >
                Dança & Motion Real
              </a>
              <a
                href="#use-cases"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white rounded-xl hover:bg-white/[0.05] min-h-[44px] flex items-center"
              >
                O Que Você Cria
              </a>
              <a
                href="#gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white rounded-xl hover:bg-white/[0.05] min-h-[44px] flex items-center"
              >
                Resultados Reais
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white rounded-xl hover:bg-white/[0.05] min-h-[44px] flex items-center"
              >
                Dúvidas Frequentes
              </a>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.05] min-h-[44px] flex items-center"
              >
                Voltar para Home V1 (Institucional)
              </Link>
            </nav>

            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-white/[0.06] text-xs font-semibold text-white border border-white/[0.08] min-h-[44px] flex items-center justify-center"
              >
                Entrar na Conta
              </Link>
              <a
                href="#planos-topo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/30 min-h-[44px] flex items-center justify-center"
              >
                Ver Planos & Assinar
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Sequência Estratégica de Vendas (Home V2) */}
      <main className="flex-1 space-y-12 sm:space-y-16 md:space-y-24">
        {/* 1. HERO SALES: Choque imediato com foco em criar modelos que vendem */}
        <SalesHeroV2 />

        {/* 2. PLANOS NO TOPO: Atende diretamente ao pedido do dono */}
        <SalesTopPricingV2 />

        {/* 3. CASOS DE USO COMERCIAIS: O que o cliente consegue criar */}
        <div id="use-cases">
          <SalesUseCasesV2 />
        </div>

        {/* 4. PROVA REAL: Showroom de Dança TikTok -> Modelo IA -> Vídeo Final VORIXA */}
        <div id="motion-proof">
          <MotionProofShowcase />
        </div>

        {/* 5. RESULTADOS REAIS: Galeria de Criativos em 9:16 */}
        <div id="gallery">
          <ResultsMasonryGallery />
        </div>

        {/* 6. PROVA SOCIAL & DEPOIMENTOS: Criadores e agências */}
        <TestimonialsTrust />

        {/* 7. PERGUNTAS FREQUENTES (FAQ) DE VENDAS */}
        <div id="faq">
          <FaqSection />
        </div>

        {/* 8. FECHAMENTO FINAL COM OFERTA E GARANTIA */}
        <FinalCtaSection />
      </main>

      {/* Rodapé Oficial */}
      <LandingFooter />
    </div>
  );
}
