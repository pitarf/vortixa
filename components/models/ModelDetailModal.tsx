"use client";

import React, { useState, useEffect } from "react";
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
  ShieldCheck,
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

  useEffect(() => {
    setActiveImageIndex(0);
  }, [model]);

  // Trava de Scroll do Body para Prevenir Scroll Chaining
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !model) return null;

  const isAi = model.type === "AI";
  const categoryMeta = CATEGORY_LABELS[model.category] || { label: model.category, icon: "✨" };

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
      maximumFractionDigits: 0,
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-4xl lg:max-w-5xl h-full sm:h-auto max-h-screen sm:max-h-[92vh] rounded-none sm:rounded-3xl bg-[#0D0E12] border-0 sm:border border-[#1E202E] shadow-2xl overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-200 overscroll-contain"
        role="dialog"
        aria-modal="true"
        aria-labelledby="model-detail-title"
      >
        {/* Glow Superior */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-3xl pointer-events-none" />

        {/* Botão Fechar Ergonômico (>= 44px) */}
        <button
          type="button"
          onClick={onClose}
          className="fixed sm:absolute top-3 right-3 sm:top-4 sm:right-4 z-40 p-2.5 rounded-2xl bg-[#070709]/90 border border-[#1E202E] hover:border-slate-600 text-slate-400 hover:text-white transition-all cursor-pointer shadow-xl min-h-[44px] min-w-[44px] flex items-center justify-center backdrop-blur-md"
          aria-label="Fechar lookbook do modelo"
        >
          <X className="w-5 h-5 sm:w-4 sm:h-4" />
        </button>

        {/* COLUNA ESQUERDA: Lookbook Fotográfico (Comp-Card Gallery) */}
        <div className="w-full lg:w-1/2 bg-black/40 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1E202E] p-4 sm:p-6 shrink-0">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-[#1E202E]">
            {images.length > 0 ? (
              <img
                src={images[activeImageIndex]}
                alt={`${model.name} foto ${activeImageIndex + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-slate-500 text-xs font-mono">Sem imagens disponíveis</div>
            )}

            {/* Contador Flutuante de Fotos */}
            {images.length > 0 && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white">
                {String(activeImageIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </div>
            )}

            {/* Controles de Navegação Touch-Friendly (>= 44px) */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg active:scale-95"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg active:scale-95"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas Inferiores com Scroll Tátil Suave */}
          {images.length > 1 && (
            <div
              className="flex items-center gap-2.5 overflow-x-auto pt-3.5 no-scrollbar"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-16 w-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    idx === activeImageIndex
                      ? "border-violet-500 ring-2 ring-violet-500/30 scale-105"
                      : "border-[#1E202E] opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Visualizar foto ${idx + 1}`}
                >
                  <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: Ficha Técnica, Informações e Ações */}
        <div className="w-full lg:w-1/2 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto flex-1 lg:max-h-[92vh] space-y-6 overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="space-y-5">
            {/* Header: Badges e Nome */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {isAi ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-violet-600 text-white shadow-md">
                    <Sparkles className="w-3 h-3" />
                    <span>Persona de IA</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-600 text-white shadow-md">
                    <User className="w-3 h-3" />
                    <span>Modelo Real Verificado</span>
                  </span>
                )}

                <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-[#1E202E] text-slate-300">
                  {categoryMeta.icon} {categoryMeta.label}
                </span>

                {model.isHot18 && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-600 text-white flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>Adulto 18+</span>
                  </span>
                )}
              </div>

              <h2 id="model-detail-title" className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                {model.name}
              </h2>

              {/* Informações de Contato / Localização */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pt-1">
                {model.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{model.location}</span>
                  </span>
                )}
                {model.instagramHandle && (
                  <span className="flex items-center gap-1">
                    <AtSign className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span>{model.instagramHandle}</span>
                  </span>
                )}
                {model.contactEmail && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{model.contactEmail}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Biografia do Casting */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                Sobre o Modelo / Perfil Editorial
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {model.bio || "Nenhuma descrição detalhada informada para este perfil."}
              </p>
            </div>

            {/* Parâmetros Neurais para Modelos de IA */}
            {isAi && model.promptTrigger && (
              <div className="space-y-2 p-4 rounded-2xl bg-[#070709] border border-[#1E202E]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-violet-400 tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>Trigger Prompt Recomendado</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[44px] px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40"
                    aria-label="Copiar prompt trigger"
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
                <p className="text-xs font-mono text-slate-300 bg-black/50 p-3 rounded-xl border border-white/5 break-all select-all leading-relaxed">
                  {model.promptTrigger}
                </p>
                {model.loraModelId && (
                  <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 pt-1">
                    <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>LoRA ID: <strong className="text-slate-300">{model.loraModelId}</strong></span>
                  </div>
                )}
              </div>
            )}

            {/* Garantia de Casting para Modelos Reais */}
            {!isAi && (
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-900/30 text-xs text-cyan-300/90 leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Casting Verificado VORIXA:</strong> Contratação com contrato padrão de cessão de direitos de imagem, suporte presencial/remoto e garantia de produção.
                </span>
              </div>
            )}

            {/* Tags e Nichos */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                Tags & Nichos
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {model.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1 rounded-lg bg-[#070709] text-slate-300 border border-[#1E202E]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rodapé Fixo / Ação Principal com Touch Target >= 44px */}
          <div className="pt-5 border-t border-[#1E202E] space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {isAi ? "Consumo por Geração:" : "Valor Base por Diária:"}
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-white">
                {isAi ? `⚡ ${model.creditsPricePerGen} créditos` : formatPrice(model.bookingPriceCents)}
              </span>
            </div>

            {isAi ? (
              <button
                type="button"
                onClick={handleUseInStudio}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xl shadow-violet-600/30 transition-all cursor-pointer min-h-[44px]"
              >
                <Zap className="w-4 h-4 fill-current shrink-0" />
                <span>Iniciar Criação no Studio com este Modelo</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookModel(model);
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:opacity-95 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xl shadow-cyan-600/30 transition-all cursor-pointer min-h-[44px]"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Solicitar Proposta de Contratação</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
