"use client";

import React from "react";

interface ModelLogoProps {
  modelId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Componente que renderiza o logo/insígnia oficial de cada motor de IA
 * de vídeo com dimensões perfeitamente contidas (overflow-hidden, padding adequado
 * e tipografia escalonada) para jamais vazar das bordas em qualquer tamanho (sm, md, lg).
 */
export function ModelLogo({ modelId, className = "", size = "md" }: ModelLogoProps) {
  const isSm = size === "sm";
  const sizeClasses = {
    sm: "w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-lg",
    md: "w-11 h-11 min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] rounded-xl",
    lg: "w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-2xl",
  }[size];

  // Kling 2.1 Pro
  if (modelId.includes("kling-video/v2.1")) {
    return (
      <div
        className={`relative ${sizeClasses} bg-gradient-to-br from-[#1A0B2E] via-[#2B1055] to-[#7928CA] border border-fuchsia-500/40 flex flex-col items-center justify-center p-0.5 shadow-md shadow-purple-900/40 overflow-hidden flex-shrink-0 select-none ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.3),transparent_70%)] pointer-events-none" />
        <span
          className={`font-black text-white tracking-tighter leading-none font-sans ${
            isSm ? "text-[9px]" : "text-[12px]"
          }`}
        >
          KLING
        </span>
        <span
          className={`font-mono font-extrabold text-fuchsia-300 leading-none px-1 py-0.2 rounded bg-fuchsia-950/70 border border-fuchsia-500/40 ${
            isSm ? "text-[6px] mt-0.5" : "text-[8px] mt-0.5"
          }`}
        >
          2.1
        </span>
      </div>
    );
  }

  // Kling 3.0 Pro
  if (modelId.includes("kling-video/v3")) {
    return (
      <div
        className={`relative ${sizeClasses} bg-gradient-to-br from-[#120824] via-[#350E6B] to-[#9333EA] border border-purple-500/50 flex flex-col items-center justify-center p-0.5 shadow-md shadow-purple-900/50 overflow-hidden flex-shrink-0 select-none ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.4),transparent_70%)] pointer-events-none" />
        <span
          className={`font-black text-white tracking-tighter leading-none font-sans ${
            isSm ? "text-[9px]" : "text-[12px]"
          }`}
        >
          KLING
        </span>
        <span
          className={`font-mono font-extrabold text-amber-300 leading-none px-1 py-0.2 rounded bg-amber-950/70 border border-amber-500/40 whitespace-nowrap ${
            isSm ? "text-[6px] mt-0.5" : "text-[7.5px] mt-0.5"
          }`}
        >
          3.0 4K
        </span>
      </div>
    );
  }

  // ByteDance Seedance 2.0
  if (modelId.includes("seedance") || modelId.includes("bytedance")) {
    return (
      <div
        className={`relative ${sizeClasses} bg-gradient-to-br from-[#061826] via-[#0E3A5D] to-[#00D2FF] border border-cyan-400/40 flex flex-col items-center justify-center p-0.5 shadow-md shadow-cyan-950/50 overflow-hidden flex-shrink-0 select-none ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.4),transparent_70%)] pointer-events-none" />
        <svg
          className={`${isSm ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} text-cyan-300 fill-current mb-0.5`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span
          className={`font-black text-white tracking-tighter leading-none ${
            isSm ? "text-[7px]" : "text-[9px]"
          }`}
        >
          SEEDANCE
        </span>
        <span
          className={`font-mono text-cyan-200 uppercase font-bold leading-none ${
            isSm ? "text-[5.5px]" : "text-[7px] mt-0.5"
          }`}
        >
          2.0
        </span>
      </div>
    );
  }

  // Wan 2.1 (Alibaba)
  if (modelId.includes("wan-i2v") || modelId.includes("wan")) {
    return (
      <div
        className={`relative ${sizeClasses} bg-gradient-to-br from-[#240C00] via-[#5C2300] to-[#FF6B00] border border-orange-500/40 flex flex-col items-center justify-center p-0.5 shadow-md shadow-orange-950/50 overflow-hidden flex-shrink-0 select-none ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.4),transparent_70%)] pointer-events-none" />
        <span
          className={`font-black text-white tracking-tight leading-none font-sans ${
            isSm ? "text-[10px]" : "text-[13px]"
          }`}
        >
          WAN
        </span>
        <span
          className={`font-mono font-bold text-orange-200 leading-none px-1 rounded bg-orange-950/70 border border-orange-500/30 ${
            isSm ? "text-[6px] mt-0.5" : "text-[8px] mt-0.5"
          }`}
        >
          2.1
        </span>
      </div>
    );
  }

  // Luma Ray 2 (Luma AI Dream Machine)
  if (modelId.includes("luma") || modelId.includes("ray-2")) {
    return (
      <div
        className={`relative ${sizeClasses} bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#38BDF8] border border-sky-400/40 flex flex-col items-center justify-center p-0.5 shadow-md shadow-sky-950/50 overflow-hidden flex-shrink-0 select-none ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.3),transparent_70%)] pointer-events-none" />
        <div
          className={`${
            isSm ? "w-2.5 h-2.5 mb-0.5" : "w-3.5 h-3.5 mb-0.5"
          } rounded-full border border-sky-400/60 flex items-center justify-center`}
        >
          <div className={`${isSm ? "w-1 h-1" : "w-1.5 h-1.5"} rounded-full bg-sky-400 animate-pulse`} />
        </div>
        <span
          className={`font-black text-white tracking-tighter leading-none ${
            isSm ? "text-[6.5px]" : "text-[9px]"
          }`}
        >
          RAY 2
        </span>
      </div>
    );
  }

  // Hailuo Minimax
  if (modelId.includes("minimax")) {
    return (
      <div
        className={`relative ${sizeClasses} bg-gradient-to-br from-[#1E0922] via-[#451052] to-[#D946EF] border border-fuchsia-400/40 flex flex-col items-center justify-center p-0.5 shadow-md shadow-fuchsia-950/50 overflow-hidden flex-shrink-0 select-none ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.3),transparent_70%)] pointer-events-none" />
        <span
          className={`font-black text-white tracking-tighter leading-none font-sans ${
            isSm ? "text-[8px]" : "text-[10.5px]"
          }`}
        >
          HAILUO
        </span>
        <span
          className={`font-mono font-bold text-fuchsia-200 leading-none px-0.5 rounded bg-fuchsia-950/70 border border-fuchsia-500/30 ${
            isSm ? "text-[5.5px] mt-0.5" : "text-[7px] mt-0.5"
          }`}
        >
          MiniMax
        </span>
      </div>
    );
  }

  // Fallback Genérico Elegante
  return (
    <div
      className={`relative ${sizeClasses} bg-[#13141B] border border-[#1E202E] flex items-center justify-center text-slate-300 font-bold ${
        isSm ? "text-[9px]" : "text-xs"
      } ${className}`}
    >
      AI
    </div>
  );
}
