"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Video } from "lucide-react";

export function VideoHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
      <div className="space-y-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-600/30 ring-1 ring-white/20">
            <Video className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
              Imagem / Texto para Vídeo
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
              Transforme suas ideias em vídeos cinematográficos com IA. Simples, rápido e com resultados profissionais.
            </p>
          </div>
        </div>
      </div>

      {/* Citação artística "Da ideia ao movimento." */}
      <div className="hidden md:flex flex-col items-end justify-center">
        <p className="text-base font-serif italic text-slate-300 tracking-wide">
          “Da ideia ao movimento.”
        </p>
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-0.5">
          — VORIXA
        </span>
      </div>
    </div>
  );
}
