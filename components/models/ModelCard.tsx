"use client";

import React, { useState } from "react";
import { MarketplaceModelItem, CATEGORY_LABELS } from "./types";
import {
  Zap,
  User,
  Sparkles,
  MapPin,
  AtSign,
  Eye,
  Calendar,
  Flame,
  ShieldCheck,
  ArrowUpRight,
  ImageOff,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ModelCardProps {
  model: MarketplaceModelItem;
  onOpenDetails: (model: MarketplaceModelItem) => void;
  onBookModel: (model: MarketplaceModelItem) => void;
}

export function ModelCard({ model, onOpenDetails, onBookModel }: ModelCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const isAi = model.type === "AI";
  const categoryMeta = CATEGORY_LABELS[model.category] || { label: model.category, icon: "✨" };

  const formatPrice = (cents?: number | null) => {
    if (!cents) return "Sob Consulta";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  const handleStudioDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAi) {
      const query = new URLSearchParams();
      query.set("modelRef", model.id);
      query.set("modelName", model.name);
      if (model.promptTrigger) {
        query.set("prompt", model.promptTrigger);
      }
      if (model.referenceFaceUrl || model.avatarUrl) {
        query.set("refImg", model.referenceFaceUrl || model.avatarUrl);
      }
      router.push(`/dashboard/create?${query.toString()}`);
    } else {
      onBookModel(model);
    }
  };

  return (
    <article
      className="group relative rounded-3xl bg-[#0D0E12] border border-[#1E202E] hover:border-violet-500/40 hover:shadow-[0_16px_48px_rgba(139,92,246,0.14)] transition-all duration-300 flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-violet-500/50"
      aria-labelledby={`model-title-${model.id}`}
    >
      {/* Moldura Fotográfica Contida (Aspect Ratio 3:4) para Eliminar CLS */}
      <div
        onClick={() => onOpenDetails(model)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#070709] cursor-pointer select-none"
        role="button"
        tabIndex={0}
        aria-label={`Ver lookbook de ${model.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenDetails(model);
          }
        }}
      >
        {!imageError ? (
          <img
            src={model.avatarUrl}
            alt={`Retrato editorial de ${model.name}`}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center gap-2 p-4 text-center bg-slate-950 text-slate-500">
            <ImageOff className="w-8 h-8 text-slate-600" />
            <span className="text-xs font-mono">{model.name}</span>
          </div>
        )}

        {/* Scrim Gradient Multi-Camadas para Legibilidade WCAG AAA */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0D0E12] via-[#0D0E12]/85 via-50% to-transparent pointer-events-none" />

        {/* Badges de Topo Adaptativas com Badge Luminosa do Prompt */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-1.5 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap max-w-[70%]">
            {isAi ? (
              <>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-violet-950/85 text-violet-200 border border-violet-500/40 backdrop-blur-md shadow-lg shadow-violet-950/40">
                  <Sparkles className="w-3 h-3 text-violet-400 shrink-0" />
                  <span>IA</span>
                </span>

                {/* Badge Luminosa do Item: Prompt à Venda */}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-gradient-to-r from-violet-900/90 via-fuchsia-950/90 to-violet-950/90 text-violet-200 border border-violet-400/50 backdrop-blur-md shadow-[0_0_14px_rgba(168,85,247,0.4)]">
                  <span>💎</span>
                  <span>Prompt: {model.creditsPricePerGen} cr</span>
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-cyan-950/80 text-cyan-200 border border-cyan-500/40 backdrop-blur-md shadow-lg shadow-cyan-950/40">
                <User className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>REAL</span>
              </span>
            )}

            {model.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                ⭐ TOP
              </span>
            )}

            {model.isHot18 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-rose-500/25 text-rose-300 border border-rose-500/40 backdrop-blur-md">
                <Flame className="w-3 h-3 text-rose-400 shrink-0" />
                <span>+18</span>
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/70 text-slate-200 border border-white/15 backdrop-blur-md shrink-0 shadow-sm">
            <span>{categoryMeta.icon}</span>
            <span className="hidden xs:inline truncate max-w-[90px]">{categoryMeta.label}</span>
          </span>
        </div>

        {/* Revelação Cinematográfica no Hover: Botão Flutuante Lookbook & Prompt */}
        <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10 pointer-events-none">
          <span className="px-4 py-2.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/20 text-xs font-bold text-white shadow-2xl flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-violet-400" />
            <span>{isAi ? "Ver Lookbook & Prompt" : "Ver Lookbook"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </span>
        </div>

        {/* Rodapé Interno da Imagem: Localização e Handle Social */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] text-slate-300 z-10 font-mono">
          {model.location ? (
            <span className="flex items-center gap-1 truncate max-w-[62%] drop-shadow-md text-slate-200">
              <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">{model.location}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400 drop-shadow-md">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>Verificado</span>
            </span>
          )}

          {model.instagramHandle && (
            <span className="flex items-center gap-1 text-slate-300 drop-shadow-md hover:text-pink-300 transition-colors">
              <AtSign className="w-3 h-3 text-pink-400 shrink-0" />
              <span className="truncate max-w-[100px]">{model.instagramHandle}</span>
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo Descritivo & Informações do Casting */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 bg-[#0D0E12]">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onOpenDetails(model)}
              className="text-left font-bold text-white hover:text-violet-300 transition-colors truncate font-heading tracking-tight text-sm sm:text-base cursor-pointer focus-visible:outline-none focus-visible:underline"
              id={`model-title-${model.id}`}
            >
              {model.name}
            </button>

            {isAi ? (
              <span className="text-[10px] sm:text-[11px] font-mono font-black text-violet-200 bg-gradient-to-r from-violet-600/30 via-fuchsia-600/20 to-violet-600/30 border border-violet-400/40 px-2 py-0.5 rounded-lg shrink-0 flex items-center gap-1 shadow-[0_0_10px_rgba(168,85,247,0.25)]">
                <span>💎</span>
                <span>Prompt: {model.creditsPricePerGen} cr</span>
              </span>
            ) : (
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-lg shrink-0 flex items-center gap-1">
                🏷️ {formatPrice(model.bookingPriceCents)}/dia
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
            {model.bio || "Modelo visual disponível para produções digitais e físicas."}
          </p>
        </div>

        {/* Tags de Estilo Editorial */}
        <div className="flex flex-wrap gap-1.5">
          {model.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#070709] text-slate-400 border border-[#1E202E]"
            >
              #{tag}
            </span>
          ))}
          {model.tags.length > 3 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#070709] text-slate-500 border border-[#1E202E]">
              +{model.tags.length - 3}
            </span>
          )}
        </div>

        {/* Botão de Ação Primária com Touch Target Rigorosamente >= 44px */}
        <div className="pt-2.5 border-t border-[#1E202E]">
          {isAi ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onOpenDetails(model)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#13141B] hover:bg-violet-950/60 text-slate-200 hover:text-white border border-[#1E202E] hover:border-violet-500/40 text-xs font-bold transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
                aria-label={`Ver lookbook e prompt de ${model.name}`}
              >
                <Eye className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <span className="truncate">Ver Lookbook & Prompt</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenDetails(model)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer min-h-[44px] active:scale-[0.98]"
                aria-label={`Adquirir prompt de ${model.name}`}
              >
                <Sparkles className="w-3.5 h-3.5 fill-current text-violet-200 shrink-0" />
                <span className="truncate">Adquirir Prompt / Usar</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleStudioDirect}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#13141B] hover:bg-cyan-600 hover:text-white active:scale-[0.98] text-cyan-300 text-xs font-bold border border-cyan-500/30 hover:border-cyan-400 shadow-md transition-all cursor-pointer min-h-[44px]"
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Contratar / Reservar</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
