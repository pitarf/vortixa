"use client";

import React, { useState } from "react";
import { MarketplaceModelItem, CATEGORY_LABELS } from "./types";
import {
  X,
  Zap,
  Sparkles,
  User,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  AtSign,
  Mail,
  Calendar,
  Layers,
  Flame,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ModelDetailModalProps {
  model: MarketplaceModelItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookModel: (model: MarketplaceModelItem) => void;
}

export function ModelDetailModal({
  model,
  isOpen,
  onClose,
  onBookModel,
}: ModelDetailModalProps) {
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!isOpen || !model) return null;

  const isAi = model.type === "AI";
  const categoryMeta = CATEGORY_LABELS[model.category] || { label: model.category, icon: "✨" };

  // Galeria de fotos unificada (avatar + gallery)
  const images = [
    ...(model.avatarUrl ? [model.avatarUrl] : []),
    ...(model.coverUrl ? [model.coverUrl] : []),
    ...(model.gallery || []),
  ].filter((url, index, self) => self.indexOf(url) === index);

  const formatPrice = (cents?: number | null) => {
    if (!cents) return "Sob Consulta";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const handleCopyPrompt = () => {
    if (!model.promptTrigger) return;
    navigator.clipboard.writeText(model.promptTrigger);
    setCopiedPrompt(true);
    toast.success("Prompt trigger copiado para a área de transferência!");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleUseInStudio = () => {
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
  };

  const nextImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in-50 duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-[#0D0E12] border border-[#1E202E] shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="model-detail-title"
      >
        {/* Glow Superior */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-3xl pointer-events-none" />

        {/* Botão Fechar Fixo */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-[#070709]/90 border border-[#1E202E] hover:border-slate-600 text-slate-400 hover:text-white transition-all cursor-pointer shadow-md"
          aria-label="Fechar detalhes do modelo"
        >
          <X className="w-4 h-4" />
        </button>

        {/* COLUNA ESQUERDA: Carrossel de Mídia em Alta Definição */}
        <div className="w-full lg:w-1/2 bg-black/50 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1E202E] p-4">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-[#1E202E]">
            {images.length > 0 ? (
              <img
                src={images[activeImageIndex]}
                alt={`${model.name} foto ${activeImageIndex + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-slate-500 text-xs font-mono">Sem imagens</div>
            )}

            {/* Controles do Carrossel */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/70 hover:bg-black text-white backdrop-blur-md border border-white/10 transition-all cursor-pointer"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/70 hover:bg-black text-white backdrop-blur-md border border-white/10 transition-all cursor-pointer"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                      }`}
                      aria-label={`Ir para foto ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-3 no-scrollbar">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-14 w-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    idx === activeImageIndex
                      ? "border-violet-500 ring-2 ring-violet-500/20"
                      : "border-[#1E202E] opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: Informações Detalhadas, Especificações e Ações */}
        <div className="w-full lg:w-1/2 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto max-h-[500px] lg:max-h-[92vh] space-y-6">
          <div className="space-y-4">
            {/* Header de Título & Badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {isAi ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-violet-600 text-white shadow-md">
                    <Sparkles className="w-3 h-3" />
                    <span>Modelo de IA</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-600 text-white shadow-md">
                    <User className="w-3 h-3" />
                    <span>Modelo Real Verificado</span>
                  </span>
                )}

                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#1E202E] text-slate-300">
                  {categoryMeta.icon} {categoryMeta.label}
                </span>

                {model.isHot18 && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-600 text-white flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>Adulto 18+</span>
                  </span>
                )}
              </div>

              <h2 id="model-detail-title" className="text-2xl font-black text-white font-heading">
                {model.name}
              </h2>

              {/* Informações de Localização / Contato */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pt-1">
                {model.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{model.location}</span>
                  </span>
                )}
                {model.instagramHandle && (
                  <span className="flex items-center gap-1">
                    <AtSign className="w-3.5 h-3.5 text-pink-400" />
                    <span>{model.instagramHandle}</span>
                  </span>
                )}
                {model.contactEmail && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{model.contactEmail}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Biografia Completa */}
            <div className="space-y-1">
              <h4 className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                Sobre o Modelo / Perfil
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {model.bio || "Nenhuma descrição fornecida."}
              </p>
            </div>

            {/* Parâmetros Técnicos para Modelo de IA */}
            {isAi && model.promptTrigger && (
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#070709] border border-[#1E202E]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-violet-400 tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Trigger Prompt Recomendado</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-300 bg-black/40 p-2.5 rounded-xl border border-white/5 break-all select-all">
                  {model.promptTrigger}
                </p>
                {model.loraModelId && (
                  <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-cyan-400" />
                    <span>LoRA ID: <strong className="text-slate-300">{model.loraModelId}</strong></span>
                  </div>
                )}
              </div>
            )}

            {/* Tags de Estilo */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                Tags & Nichos
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {model.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#070709] text-slate-300 border border-[#1E202E]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rodapé com Valores e Ação Principal */}
          <div className="pt-4 border-t border-[#1E202E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {isAi ? "Consumo por Geração:" : "Valor Base por Diária:"}
              </span>
              <span className="text-base font-black font-mono text-white">
                {isAi ? `⚡ ${model.creditsPricePerGen} créditos` : formatPrice(model.bookingPriceCents)}
              </span>
            </div>

            {isAi ? (
              <button
                type="button"
                onClick={handleUseInStudio}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-xl shadow-violet-600/30 transition-all cursor-pointer"
                style={{ minHeight: "44px" }}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Iniciar Criação no Studio com este Modelo</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookModel(model);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-xl shadow-cyan-600/30 transition-all cursor-pointer"
                style={{ minHeight: "44px" }}
              >
                <Calendar className="w-4 h-4" />
                <span>Solicitar Proposta de Contratação</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}