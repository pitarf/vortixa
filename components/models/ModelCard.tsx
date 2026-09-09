"use client";

import React from "react";
import { MarketplaceModelItem, CATEGORY_LABELS } from "./types";
import { Zap, User, Sparkles, MapPin, AtSign, Eye, Calendar, Flame } from "lucide-react";
import { useRouter } from "next/navigation";

interface ModelCardProps {
  model: MarketplaceModelItem;
  onOpenDetails: (model: MarketplaceModelItem) => void;
  onBookModel: (model: MarketplaceModelItem) => void;
}

export function ModelCard({ model, onOpenDetails, onBookModel }: ModelCardProps) {
  const router = useRouter();

  const isAi = model.type === "AI";
  const categoryMeta = CATEGORY_LABELS[model.category] || { label: model.category, icon: "✨" };

  const formatPrice = (cents?: number | null) => {
    if (!cents) return "Sob Consulta";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAi) {
      // Redireciona para o Studio Create com parâmetro do modelo
      const query = new URLSearchParams();
      query.set("modelRef", model.id);
      query.set("modelName", model.name);
      if (model.promptTrigger) {
        query.set("prompt", model.promptTrigger);
      }
      if (model.referenceFaceUrl) {
        query.set("refImg", model.referenceFaceUrl);
      }
      router.push(`/dashboard/create?${query.toString()}`);
    } else {
      // Abre modal de proposta de contratação/reserva
      onBookModel(model);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(model)}
      className="group relative rounded-3xl bg-[#0D0E12] border border-[#1E202E] hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-600/10 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Imagem de Capa / Avatar em Alta Definição */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
        <img
          src={model.avatarUrl}
          alt={model.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradiente de sobreposição para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-black/40 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Badges do Topo (Tipo + Categoria) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5">
            {isAi ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-violet-600/90 text-white backdrop-blur-md shadow-md">
                <Sparkles className="w-3 h-3" />
                <span>IA</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-600/90 text-white backdrop-blur-md shadow-md">
                <User className="w-3 h-3" />
                <span>REAL</span>
              </span>
            )}

            {model.isFeatured && (
              <span className="px-2 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/90 text-black backdrop-blur-md shadow-md">
                ⭐ TOP
              </span>
            )}

            {model.isHot18 && (
              <span className="px-2 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-600/90 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                <Flame className="w-3 h-3" />
                <span>+18</span>
              </span>
            )}
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 text-slate-200 border border-white/10 backdrop-blur-md">
            {categoryMeta.icon} {categoryMeta.label}
          </span>
        </div>

        {/* Botão Flutuante de Ver Perfil no Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <span className="px-4 py-2 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xl flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-violet-400" />
            <span>Ver Portfólio</span>
          </span>
        </div>

        {/* Rodapé Interno da Imagem: Localização ou Handle */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] text-slate-300 z-10">
          {model.location ? (
            <span className="flex items-center gap-1 truncate max-w-[65%] drop-shadow">
              <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">{model.location}</span>
            </span>
          ) : (
            <span />
          )}

          {model.instagramHandle && (
            <span className="flex items-center gap-1 text-slate-300 drop-shadow">
              <AtSign className="w-3 h-3 text-pink-400 shrink-0" />
              <span className="truncate">{model.instagramHandle}</span>
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo Descritivo e Ações */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors truncate">
              {model.name}
            </h3>

            {/* Custo ou Preço */}
            {isAi ? (
              <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-lg shrink-0">
                ⚡ {model.creditsPricePerGen} créditos
              </span>
            ) : (
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg shrink-0">
                🏷️ {formatPrice(model.bookingPriceCents)}/dia
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {model.bio || "Modelo visual disponível para produções digitais e físicas."}
          </p>
        </div>

        {/* Tags de Estilo */}
        <div className="flex flex-wrap gap-1.5">
          {model.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#070709] text-slate-400 border border-[#1E202E]"
            >
              #{tag}
            </span>
          ))}
          {model.tags.length > 3 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#070709] text-slate-500">
              +{model.tags.length - 3}
            </span>
          )}
        </div>

        {/* Botão de Ação Primária */}
        <div className="pt-2 border-t border-[#1E202E]">
          {isAi ? (
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all cursor-pointer"
              style={{ minHeight: "44px" }}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Usar no Studio CREATE</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1E202E] hover:bg-cyan-600 hover:text-white text-cyan-300 text-xs font-bold border border-cyan-500/30 hover:border-cyan-500 transition-all cursor-pointer"
              style={{ minHeight: "44px" }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Contratar / Reservar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}