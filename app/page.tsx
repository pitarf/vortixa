"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroCinematic } from "@/components/landing/HeroCinematic";
import { EnginesShowcase } from "@/components/landing/EnginesShowcase";
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
 * Landing Page Oficial do VORIXA — Experiência Cinematográfica All-in-One de Criação com IA.
 * Alternância rítmica de superfícies (Off-White e Dark Obsidian), tipografia editorial (Inter + Instrument Serif)
 * e uso protagonista de vídeos reais em alta definição.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-violet-500/30 selection:text-white">
      {/* Header Fixo Minimalista */}
      <header className="h-20 border-b border-[#1E202E]/60 bg-background/90 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logos/logo principal.png"
            alt="VORIXA Logo"
            className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Links Centrais de Navegação */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Ferramentas</a>
          <a href="#flow-demo" className="hover:text-white transition-colors">Workflows</a>
          <a href="#gallery" className="hover:text-white transition-colors">Galeria</a>
          <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
          <a href="#faq" className="hover:text-white transition-colors">Dúvidas</a>
        </nav>

        {/* Ações de Autenticação e Tema */}
        <div className="flex items-center gap-3">
          {/* Alternador de Tema Claro / Escuro */}
          <ThemeToggle />

          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl bg-[#13141B] border border-[#1E202E] transition-all hover:bg-[#1E202E] min-h-[40px] flex items-center justify-center cursor-pointer"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-xs font-bold text-white shadow-lg shadow-violet-600/25 transition-all hover:scale-105 min-h-[40px]"
          >
            <span>Começar</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Storytelling Cinematográfico Completo */}
      <main className="flex-1 space-y-8">
        {/* 1. IMPACTO: Hero com Container Off-White, Tipografia Editorial e Vídeo Protagonista */}
        <HeroCinematic />

        {/* 2. DEMONSTRAÇÃO & RESULTADO: "Tudo numa ferramenta só" + Card Workflow + 3 Cards de Vídeos e Before/After */}
        <EnginesShowcase />

        {/* 3. TECNOLOGIA: VORIXA FLOW — Grafo Interativo Nó por Nó */}
        <FlowInteractiveDemo />

        {/* 4. AUTOMAÇÃO: Build with AI — Da fala ao pipeline sintetizado */}
        <BuildWithAiVisual />

        {/* 5. PROVA VISUAL: Galeria Editorial Mosaico com Vídeos Reais */}
        <div id="gallery">
          <ResultsMasonryGallery />
        </div>

        {/* 6. ECONOMIA: Planos de Assinatura com Quebra Visual Off-White */}
        <PricingSection />

        {/* 7. PROVA SOCIAL: Depoimentos de Agências e Criadores */}
        <TestimonialsTrust />

        {/* 8. FAQ: Dúvidas Frequentes em Linhas Minimalistas */}
        <div id="faq">
          <FaqSection />
        </div>

        {/* 9. FECHAMENTO & CONVERSÃO: Banner Final com Vídeo de Fundo e 100 Créditos */}
        <FinalCtaSection />
      </main>

      {/* Rodapé Master com Status Operacional e Logo Oficial */}
      <LandingFooter />
    </div>
  );
}
