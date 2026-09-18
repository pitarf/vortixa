"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SalesHeroV2 } from "@/components/landing/sales-v2/SalesHeroV2";
import { SalesTopPricingV2 } from "@/components/landing/sales-v2/SalesTopPricingV2";
import { SalesUseCasesV2 } from "@/components/landing/sales-v2/SalesUseCasesV2";
import { SalesImageToVideoV2 } from "@/components/landing/sales-v2/SalesImageToVideoV2";
import { SalesMotionV2 } from "@/components/landing/sales-v2/SalesMotionV2";
import { SalesGalleryV2 } from "@/components/landing/sales-v2/SalesGalleryV2";
import { TestimonialsTrust } from "@/components/landing/TestimonialsTrust";
import { FaqSection } from "@/components/landing/FaqSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * HOME V2 — Página de Vendas de Luxo e Alta Conversão (Estilo Octuz AI).
 * Destaques Principais:
 * 1. Tipografia Editorial Elegante (Instrument Serif + Inter limpo).
 * 2. Sem visual de ficção científica ou jargões exagerados de IA.
 * 3. Vídeo principal da mulher do Carnaval preservado em 16:9 com áudio PT-BR.
 * 4. Planos e Preços posicionados estrategicamente logo abaixo do Hero.
 * 5. Seção de Motion Control em comparativo limpo de 3 cartões.
 * 6. Galeria de Mídias Reais geradas nos testes (excluindo qualquer mídia hot).
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

  // Ativador de Animações de Scroll com Suavidade (Intersection Observer)
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
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const animatedElements = document.querySelectorAll(
      ".reveal-on-scroll, .reveal-scale"
    );
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#070709] text-[#F8FAFC] flex flex-col font-sans selection:bg-cyan-500/25 selection:text-cyan-200 relative overflow-x-clip w-full">
      {/* Luz Suave de Fundo Minimalista Azul Neon */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-cyan-500/[0.04] to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Barra de Navegação Superior Suave */}
      <header className="sticky top-3 z-50 px-3 sm:px-6 w-full max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-[#0C0D12]/90 border border-white/[0.08] rounded-full px-5 py-2.5 flex items-center justify-between transition-all">
          {/* Logo VORTIXIA */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 min-h-[44px]">
            <img
              src="/logos/logo principal.png"
              alt="VORTIXIA"
              className="h-7 w-auto object-contain"
            />
          </Link>

          {/* Links Centrais de Navegação */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-sans text-slate-300">
            <a href="#planos-topo" className="text-white hover:text-cyan-400 font-medium transition-colors py-2">
              Planos & Preços
            </a>
            <a href="#use-cases" className="hover:text-white transition-colors py-2">
              Recursos
            </a>
            <a href="#image-to-video" className="hover:text-white transition-colors py-2">
              Foto para Vídeo
            </a>
            <a href="#motion-proof" className="hover:text-white transition-colors py-2">
              Dança & Movimento
            </a>
            <a href="#gallery" className="hover:text-white transition-colors py-2">
              Resultados
            </a>
            <a href="#faq" className="hover:text-white transition-colors py-2">
              Dúvidas
            </a>
          </nav>

          {/* Ações Direitas */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-sans text-slate-300 hover:text-white px-3 py-2 transition-colors min-h-[40px] flex items-center"
            >
              Entrar
            </Link>

            <a
              href="#planos-topo"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-200 text-slate-950 font-medium text-xs transition-all min-h-[40px]"
            >
              <span>Ver planos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Menu Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menu Gaveta Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 rounded-3xl bg-[#0C0D12] border border-white/[0.1] shadow-2xl backdrop-blur-2xl animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-2 text-sm text-slate-200 font-sans">
              <a
                href="#planos-topo"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-white/[0.05] text-white font-medium"
              >
                Planos & Preços (Topo)
              </a>
              <a
                href="#use-cases"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-white/[0.05]"
              >
                O Que Você Cria
              </a>
              <a
                href="#image-to-video"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-white/[0.05]"
              >
                Foto para Vídeo & Fala
              </a>
              <a
                href="#motion-proof"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-white/[0.05]"
              >
                Dança & Movimento Real
              </a>
              <a
                href="#gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-white/[0.05]"
              >
                Resultados Reais
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl hover:bg-white/[0.05]"
              >
                Dúvidas Frequentes
              </a>
              <Link
                href="/home-legacy"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Ver Home V1 (Institucional)
              </Link>
            </nav>

            <div className="pt-3 mt-2 border-t border-white/[0.08] flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-white/[0.05] text-xs font-medium text-white"
              >
                Entrar na Conta
              </Link>
              <a
                href="#planos-topo"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-white text-slate-950 text-xs font-semibold shadow"
              >
                Começar Agora
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Conteúdo Sequencial Estruturado para Venda */}
      <main className="flex-1 space-y-12 sm:space-y-20">
        {/* 1. HERO SALES COM VÍDEO DA MULHER DO CARNAVAL (Imediato para LCP Ótimo) */}
        <div>
          <SalesHeroV2 />
        </div>

        {/* 2. PLANOS DE PREÇOS NO TOPO (Padrão Octuz AI) */}
        <div className="reveal-on-scroll">
          <SalesTopPricingV2 />
        </div>

        {/* 3. CASOS DE USO PRÁTICOS */}
        <div id="use-cases" className="reveal-on-scroll">
          <SalesUseCasesV2 />
        </div>

        {/* 4. TRANSFORMAÇÃO DE FOTO PARA VÍDEO & FALA NATIVA (Festa da Virginia) */}
        <div id="image-to-video" className="reveal-scale">
          <SalesImageToVideoV2 />
        </div>

        {/* 5. MOTION CONTROL (Dança TikTok -> Modelo -> Vídeo Final) */}
        <div id="motion-proof" className="reveal-scale">
          <SalesMotionV2 />
        </div>

        {/* 6. GALERIA DE MÍDIAS GERADAS NO BANCO E TESTES (Sem Nicho Hot) */}
        <div id="gallery" className="reveal-on-scroll">
          <SalesGalleryV2 />
        </div>

        {/* 6. PROVA SOCIAL & DEPOIMENTOS */}
        <div className="reveal-on-scroll">
          <TestimonialsTrust />
        </div>

        {/* 7. DÚVIDAS FREQUENTES (FAQ) */}
        <div id="faq" className="reveal-on-scroll">
          <FaqSection />
        </div>

        {/* 8. BANNER FINAL DE FECHAMENTO DISCRETO */}
        <section className="py-12 px-3 sm:px-6 max-w-4xl mx-auto text-center space-y-6 reveal-scale">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0C0D12] border border-white/[0.08] space-y-5">
            <h3 className="text-2xl sm:text-3xl font-normal text-white">
              Pronto para criar conteúdos com{" "}
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                modelos virtuais?
              </span>
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto font-light leading-relaxed">
              Junte-se a criadores e agências que já estão economizando tempo e dinheiro em cada campanha.
            </p>
            <div className="pt-2">
              <a
                href="#planos-topo"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-slate-200 text-slate-950 font-semibold text-sm transition-all shadow"
              >
                <span>Escolher meu plano</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé Oficial */}
      <LandingFooter />
    </div>
  );
}
