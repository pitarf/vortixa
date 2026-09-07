"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Wand2 } from "lucide-react";
import { AIModelDef } from "./types";

interface ImageHeaderProps {
  currentModelDef: AIModelDef;
}

export function ImageHeader({ currentModelDef }: ImageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4 border-b border-[#1E202E] pb-5">
      {/* Lado Esquerdo: Voltar, Título e Subtítulo */}
      <div className="flex flex-col justify-center space-y-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-600/30 ring-1 ring-white/20">
            <Wand2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                Geração de Imagem
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30">
                {currentModelDef.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-xl leading-relaxed">
              Crie fotos hiper-realistas, artes e designs com Inteligência Artificial sem complicação.
            </p>
          </div>
        </div>
      </div>

      {/* Lado Direito: Banner Cinematográfico com Citação & Card FLUX.1 */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1E202E] bg-gradient-to-r from-[#0D0E12] to-[#13141B] p-4 flex items-center justify-between gap-6 min-w-[320px] lg:max-w-md shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <p className="text-xs sm:text-sm italic font-serif text-slate-300">
            “Da sua imaginação para a realidade.”
          </p>
          <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500 block">
            — VORIXA
          </span>
        </div>

        <div className="relative z-10 flex items-center gap-3 bg-[#070709]/80 border border-violet-500/30 p-2.5 rounded-xl backdrop-blur-md shadow-lg">
          <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-violet-400/50 shadow-sm flex-shrink-0">
            <img
              src="/media/landing/gallery/editorial_fashion.jpg"
              alt="FLUX.1"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white font-mono">FLUX.1</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Qualidade profissional para suas ideias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
