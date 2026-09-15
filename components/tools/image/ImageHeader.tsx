"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Wand2 } from "lucide-react";

export function ImageHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
      <div className="space-y-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Imagem</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-600/30 ring-1 ring-white/20">
            <Wand2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
              Crie imagens incríveis com IA
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
              Transforme suas ideias em imagens de alta qualidade. Simples, rápido e sem limites.
            </p>
          </div>
        </div>
      </div>

      {/* Citação artística "Da sua imaginação para a realidade." */}
      <div className="hidden md:flex flex-col items-end justify-center">
        <p className="text-base font-serif italic text-slate-300 tracking-wide">
          “Da sua imaginação para a realidade.”
        </p>
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-0.5">
          — VORTIXIA
        </span>
      </div>
    </div>
  );
}
