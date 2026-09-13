"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Sparkles, ShieldCheck, Activity } from "lucide-react";
import { HeroCinematic } from "@/components/landing/HeroCinematic";
import { EnginesShowcase } from "@/components/landing/EnginesShowcase";
import { MotionProofShowcase } from "@/components/landing/MotionProofShowcase";
import { FlowInteractiveDemo } from "@/components/landing/FlowInteractiveDemo";
import { BuildWithAiVisual } from "@/components/landing/BuildWithAiVisual";
import { ResultsMasonryGallery } from "@/components/landing/ResultsMasonryGallery";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsTrust } from "@/components/landing/TestimonialsTrust";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

/**
 * Landing Page Oficial do VORIXA — Design de Elite Awwwards / Apple Grade.
 * Arquitetura Dark Obsidian (#07080B, #0D0E14, #12141F) com iluminação volumétrica contida,
 * tipografia fluida de 320px a 4K, touch targets >= 44px e zero CLS.
 */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Travar o scroll de fundo quando o menu gaveta estiver aberto no mobile
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#07080B] text-foreground flex flex-col font-sans selection:bg-violet-500/30 selection:text-white relative overflow-x-clip w-full">
      {/* Luzes Volumétricas de Fundo (Ambient Auroras Contidas - Sem Overflow Horizontal) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[350px] sm:h-[500px] bg-gradient-to-b from-violet-600/15 via-indigo-500/10 to-transparent blur-[120px] sm:blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-[45%] -right-[15%] sm:-right-[5%] w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-emerald-500/10 blur-[130px] sm:blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-[15%] -left-[15%] sm:-left-[5%] w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-cyan-500/10 blur-[130px] sm:blur-[150px] pointer-events-none -z-10" />

      {/* Floating Navigation Island (Padrão Apple / Awwwards) */}
      <header className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 w-full max-w-7xl mx-auto">
        <div className="backdrop-blur-2xl bg-[#0D0E14]/85 border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.6)] rounded-2xl md:rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between transition-all duration-300">
          {/* Logo Oficial & Badge de Status */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-h-[44px]">
            <img
              src="/logos/logo principal.png"
              alt="VORIXA Logo"
              className="h-7 sm:h-8 md:h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px] font-mono font-bold text-violet-300 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span>v2.6 LIVE</span>
            </span>
          </Link>

          {/* Links Centrais de Navegação Desktop */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13px] font-medium tracking-wide text-slate-300">
            <a href="#features" className="hover:text-white transition-colors duration-200 py-2">
              Ferramentas
            </a>
            <a href="#motion-proof" className="hover:text-emerald-300 transition-colors duration-200 flex items-center gap-1.5 py-2">
              <span>Motion Control</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </a>
            <a href="#flow-demo" className="hover:text-white transition-colors duration-200 py-2">
              Workflows
            </a>
            <a href="#gallery" className="hover:text-white transition-colors duration-200 py-2">
              Galeria
            </a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200 py-2">
              Planos
            </a>
            <a href="#faq" className="hover:text-white transition-colors duration-200 py-2">
              Dúvidas
            </a>
          </nav>

          {/* Ações Rápidas de Acesso */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex items-center justify-center min-h-[44px] min-w-[44px]">
              <ThemeToggle />
            </div>

            <Link
              href="/login"
              className="hidden sm:inline-flex text-xs font-semibold text-slate-300 hover:text-white px-3.5 sm:px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all min-h-[44px] items-center justify-center cursor-pointer"
            >
              Entrar
            </Link>

            <Link
              href="/register"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-[11px] sm:text-xs font-bold text-white shadow-lg shadow-violet-600/30 transition-all active:scale-95 min-h-[44px] cursor-pointer shrink-0"
            >
              <span>Começar Grátis</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </Link>

            {/* Botão Mobile Hamburger (Touch target >= 44x44px) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer transition-colors active:scale-95"
              aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Drawer Modal Mobile Ergonômico com Backdrop */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end animate-in fade-in duration-200">
            {/* Backdrop Blur */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Painel Inferior Deslizante (Bottom Sheet Drawer) */}
            <div className="relative w-full bg-[#0D0E14] border-t border-white/[0.12] rounded-t-[28px] p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <img src="/logos/logo principal.png" alt="VORIXA" className="h-6 w-auto" />
                  <span className="text-[10px] font-mono text-violet-400 font-bold bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                    v2.6 LIVE
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 min-h-[44px] min-w-[44px] rounded-full bg-white/[0.06] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col space-y-1">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white rounded-xl hover:bg-white/[0.05] min-h-[44px] flex items-center"
                >
                  Ferramentas Integradas
                </a>
                <a
                  href="#motion-proof"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-emerald-400 hover:text-emerald-300 rounded-xl hover:bg-emerald-500/10 min-h-[44px] flex items-center justify-between"
                >
                  <span>Motion Control Real</span>
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 font-bold">
                    Novo
                  </span>
                </a>
                <a
                  href="#flow-demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white rounded-xl hover:bg-white/[0.05] min-h-[44px] flex items-center"
                >
                  Workflows Interativos
                </a>
                <a
                  href="#gallery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white rounded-xl hover:bg-white/[0.05] min-h-[44px] flex items-center"
                >
                  Galeria de Resultados
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white rounded-xl hover:bg-white/[0.05] min-h-[44px] flex items-center"
                >
                  Planos & Preços
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold text-slate-200 hover:text-white rounded-xl hover:bg-white/[0.05] min-h-[44px] flex items-center"
                >
                  Dúvidas Frequentes
                </a>
              </nav>

              <div className="pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-white/[0.06] text-xs font-semibold text-white border border-white/[0.08] min-h-[44px] flex items-center justify-center"
                >
                  Entrar na Conta
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-xs font-bold text-white shadow-lg shadow-violet-600/30 min-h-[44px] flex items-center justify-center"
                >
                  Começar com 100 Créditos
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Storytelling Cinematográfico Completo com Espaçamento Fluido */}
      <main className="flex-1 space-y-16 sm:space-y-24 md:space-y-32">
        {/* 1. IMPACTO: Hero com Estética Esculpida e Vídeo Protagonista */}
        <HeroCinematic />

        {/* 2. DEMONSTRAÇÃO & RESULTADO: "Tudo numa ferramenta só" + Super Bento Card + Slider 8K */}
        <div className="reveal-on-scroll">
          <EnginesShowcase />
        </div>

        {/* 2.1 PROVA REAL: Showroom de Tecnologia Futurista (Dança TikTok -> Personagem IA -> Vídeo Final VORIXA) */}
        <div id="motion-proof" className="reveal-on-scroll">
          <MotionProofShowcase />
        </div>

        {/* 3. TECNOLOGIA: VORIXA FLOW — Grafo Interativo Nó por Nó */}
        <div className="reveal-on-scroll">
          <FlowInteractiveDemo />
        </div>

        {/* 4. AUTOMAÇÃO: Build with AI — Da fala ao pipeline sintetizado */}
        <div className="reveal-on-scroll">
          <BuildWithAiVisual />
        </div>

        {/* 5. PROVA VISUAL: Galeria Editorial Mosaico com Vídeos e Imagens Reais */}
        <div id="gallery" className="reveal-on-scroll">
          <ResultsMasonryGallery />
        </div>

        {/* 6. ECONOMIA: Planos de Assinatura com Comparativo de Custos Dark Obsidian */}
        <div className="reveal-on-scroll">
          <PricingSection />
        </div>

        {/* 7. PROVA SOCIAL: Depoimentos de Agências e Criadores */}
        <div className="reveal-on-scroll">
          <TestimonialsTrust />
        </div>

        {/* 8. FAQ: Dúvidas Frequentes em Linhas Minimalistas */}
        <div id="faq" className="reveal-on-scroll">
          <FaqSection />
        </div>

        {/* 9. FECHAMENTO & CONVERSÃO: Banner Final de Alto Impacto com 100 Créditos */}
        <div className="reveal-on-scroll">
          <FinalCtaSection />
        </div>
      </main>

      {/* Rodapé Arquitetural Master com Status Operacional e Navegação Completa */}
      <LandingFooter />
    </div>
  );
}
