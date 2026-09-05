"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Boxes,
  Wand2,
  Film,
  Coins,
  Activity,
  ArrowRight,
  Zap,
  ShieldCheck,
} from "lucide-react";

interface DashboardHeroProps {
  userName: string;
  userBalance: number;
  isUnlimited: boolean;
  stats: {
    projectsCount: number;
    assetsCount: number;
    creditsAvailable: number;
    uptime: string;
  };
}

export function DashboardHero({
  userName,
  userBalance,
  isUnlimited,
  stats,
}: DashboardHeroProps) {
  return (
    <div className="relative rounded-3xl border border-[#1E202E] bg-[#0D0E12] overflow-hidden shadow-2xl">
      {/* Background Cinematográfico com Imagem de Alta Resolução e Gradiente Dark Obsidian */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: "url('/media/landing/hero/hero_studio_master.jpg')",
        }}
      />
      {/* Gradientes Obsidian de Profundidade */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#070709] via-[#070709]/90 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-transparent pointer-events-none" />

      {/* Brilho Suave Superior */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-8 md:p-10 space-y-6">
        {/* Tag Superior de Identidade Editorial */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono font-bold text-violet-300 uppercase tracking-widest">
          <Zap className="h-3 w-3 text-amber-400" />
          <span>AI Creative Operating System</span>
        </div>

        {/* Saudação e Headline Editorial */}
        <div className="max-w-3xl space-y-2">
          <h2 className="text-sm md:text-base font-mono font-semibold text-slate-400">
            Olá, <span className="text-slate-200 font-bold">{userName}</span> 👋
          </h2>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight leading-tight">
            Vamos criar algo{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              incrível hoje?
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl pt-1">
            Transforme ideias em produções audiovisuais completas com IA. Do conceito ao resultado, tudo em um só lugar.
          </p>
        </div>

        {/* Botões de Ação Rápida */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/dashboard/create"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs md:text-sm font-bold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Criar com IA →</span>
          </Link>

          <Link
            href="/dashboard/flow"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#13141B]/80 hover:bg-[#1A1B26] border border-[#1E202E] hover:border-cyan-500/40 text-slate-200 text-xs md:text-sm font-semibold transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <Boxes className="h-4 w-4 text-cyan-400" />
            <span>Abrir VORIXA FLOW</span>
          </Link>

          <Link
            href="/dashboard/tools/image"
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors"
            style={{ minHeight: "44px" }}
          >
            <span>Explorar Modelos</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Citação Inspiradora e Grid de Métricas Rápidas */}
        <div className="pt-6 border-t border-[#1E202E]/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Citação Inspiradora */}
          <div className="text-xs sm:text-sm font-serif italic text-slate-400 flex items-center gap-2">
            <span className="text-violet-400 text-lg leading-none">“</span>
            <span>Ideias ganham vida aqui.</span>
            <span className="font-sans not-italic text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold ml-1">
              — VORIXA
            </span>
          </div>

          {/* Grid de 4 Métricas Rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full lg:w-auto">
            {/* Projetos Criados */}
            <div className="px-3.5 py-2 rounded-2xl bg-[#070709]/80 border border-[#1E202E] flex flex-col">
              <span className="text-base sm:text-lg font-black font-heading text-white">
                {stats.projectsCount}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Projetos criados
              </span>
            </div>

            {/* Ativos na Biblioteca */}
            <div className="px-3.5 py-2 rounded-2xl bg-[#070709]/80 border border-[#1E202E] flex flex-col">
              <span className="text-base sm:text-lg font-black font-heading text-white">
                {stats.assetsCount}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Ativos na biblioteca
              </span>
            </div>

            {/* Créditos Disponíveis */}
            <div className="px-3.5 py-2 rounded-2xl bg-[#070709]/80 border border-amber-500/20 flex flex-col">
              <span className="text-base sm:text-lg font-black font-heading text-amber-300">
                {isUnlimited ? "∞" : stats.creditsAvailable.toLocaleString("pt-BR")}
              </span>
              <span className="text-[10px] font-mono text-amber-400/70 uppercase">
                Créditos disponíveis
              </span>
            </div>

            {/* Uptime Operacional */}
            <div className="px-3.5 py-2 rounded-2xl bg-[#070709]/80 border border-emerald-500/20 flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-base sm:text-lg font-black font-heading text-emerald-400">
                  {stats.uptime}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Uptime operacional
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}