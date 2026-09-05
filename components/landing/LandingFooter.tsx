"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap, ShieldCheck, Cpu, Workflow } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-[#1E202E] bg-gradient-to-b from-[#070709] to-black pt-20 pb-12 px-4 sm:px-6">
      {/* Final Massive CTA */}
      <div className="max-w-4xl mx-auto text-center space-y-6 pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono font-bold uppercase">
          ✦ O Futuro da Criação Começa Agora
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-heading leading-tight">
          Pronto para Construir Produções Cinematográficas com IA?
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          Crie sua conta agora mesmo e receba 100 créditos para experimentar o VORIXA FLOW e os modelos FLUX.1 e Kling AI.
        </p>
        <div className="pt-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm sm:text-base shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:opacity-95 transition-all hover:scale-105"
            style={{ minHeight: "52px" }}
          >
            <Sparkles className="h-5 w-5" />
            <span>Criar Minha Conta Gratuita</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-[#1E202E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <img
            src="/logos/logo principal.png"
            alt="VORIXA"
            className="h-6 w-auto object-contain opacity-80"
          />
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>99.99% Uptime • Cluster IA Ativo</span>
          </span>
        </div>
        <div>
          © 2026 VORIXA Inc. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
