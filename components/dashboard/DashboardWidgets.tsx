"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Heart,
  MessageSquare,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export function DashboardWidgets() {
  const [period, setPeriod] = useState<"30" | "7">("30");
  const [hasLikedCommunity, setHasLikedCommunity] = useState(false);
  const [likesCount, setLikesCount] = useState(1428);

  const handleLikeCommunity = () => {
    if (!hasLikedCommunity) {
      setHasLikedCommunity(true);
      setLikesCount((prev) => prev + 1);
      toast.success("Obra curtida no VORIXA Community!");
    } else {
      setHasLikedCommunity(false);
      setLikesCount((prev) => prev - 1);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
      {/* ================= WIDGET 1: ESTATÍSTICAS DE USO ================= */}
      <div className="rounded-3xl bg-[#0D0E12] border border-[#1E202E] p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-violet-600/15 text-violet-400 flex items-center justify-center">
                <BarChart3 className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-white font-heading">
                Estatísticas de uso
              </span>
            </div>

            {/* Seletor de Período */}
            <div className="flex items-center gap-1 bg-[#070709] border border-[#1E202E] rounded-xl p-0.5 text-[10px] font-mono">
              <button
                onClick={() => setPeriod("30")}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  period === "30"
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                30 dias
              </button>
              <button
                onClick={() => setPeriod("7")}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  period === "7"
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                7 dias
              </button>
            </div>
          </div>

          {/* Gráfico SVG de Anel / Gauge Circular (62%) */}
          <div className="flex items-center justify-around py-2">
            <div className="relative h-28 w-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#1E202E]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-violet-500"
                  strokeDasharray="62, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black font-heading text-white">62%</span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">Utilizado</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">Consumidos</span>
                <span className="font-bold text-slate-200">1.540 créditos</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">Restantes</span>
                <span className="font-bold text-amber-300">2.480 créditos</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">Gerações no ciclo</span>
                <span className="font-bold text-emerald-400">48 mídias</span>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/credits"
          className="flex items-center justify-between text-xs font-mono font-bold text-violet-400 hover:text-violet-300 pt-2 border-t border-[#1E202E]"
        >
          <span>Ver extrato detalhado</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* ================= WIDGET 2: DESTAQUE DA COMUNIDADE ================= */}
      <div className="rounded-3xl bg-[#0D0E12] border border-[#1E202E] p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-heading">
                Destaque da comunidade
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-pink-500/10 border border-pink-500/20 text-pink-300 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>Em Alta</span>
            </span>
          </div>

          {/* Card Cinematográfico da Obra */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-[#1E202E] group">
            <img
              src="/media/landing/gallery/editorial_fashion.jpg"
              alt="O Despertar - Aurora Cine"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
              <span className="text-xs font-bold text-white font-heading">O Despertar</span>
              <span className="text-[10px] font-mono text-slate-300">por @aurora_cine</span>
            </div>
          </div>

          {/* Engajamento Social */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLikeCommunity}
                className={`flex items-center gap-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
                  hasLikedCommunity ? "text-pink-400" : "text-slate-400 hover:text-pink-400"
                }`}
              >
                <Heart className={`h-4 w-4 ${hasLikedCommunity ? "fill-current" : ""}`} />
                <span>{likesCount.toLocaleString("pt-BR")}</span>
              </button>

              <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                <MessageSquare className="h-4 w-4" />
                <span>89</span>
              </div>
            </div>

            <Link
              href="/dashboard/flow"
              className="text-[11px] font-mono text-violet-400 hover:text-violet-300 font-bold"
            >
              Remixar no Flow →
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed border-t border-[#1E202E] pt-2">
          Workflows compartilhados na comunidade com autorização de re-execução.
        </p>
      </div>

      {/* ================= WIDGET 3: NOVIDADES NO VORIXA ================= */}
      <div className="rounded-3xl bg-[#0D0E12] border border-[#1E202E] p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-bold text-white font-heading">
                Novidades no VORIXA
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Changelog</span>
          </div>

          <div className="space-y-2.5">
            {/* Novidade 1 */}
            <div className="p-2.5 rounded-xl bg-[#070709] border border-[#1E202E] space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-200">Kling AI 1.5 Disponível</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 font-bold">
                  v1.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Renderizações 1080p nativas a 60fps com estabilização cinematográfica.
              </p>
            </div>

            {/* Novidade 2 */}
            <div className="p-2.5 rounded-xl bg-[#070709] border border-[#1E202E] space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-200">Novo modelo FLUX.1 Schnell</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-violet-500/20 text-violet-300 font-bold">
                  Turbo
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Gerações de imagens fotorrealistas em velocidade ultra-rápida (&lt; 2.0s).
              </p>
            </div>

            {/* Novidade 3 */}
            <div className="p-2.5 rounded-xl bg-[#070709] border border-[#1E202E] space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-200">Upscale 4K Aprimorado</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 font-bold">
                  4K AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Restauração neural facial e preservação de texturas volumétricas.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/flow"
          className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 pt-2 border-t border-[#1E202E]"
        >
          <span>Testar novos modelos no Flow</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}