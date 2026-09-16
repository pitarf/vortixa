"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
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
  Lock,
  Unlock,
  Loader2,
  Maximize2,
  Minimize2,
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
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockedPrompt, setUnlockedPrompt] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listener de tecla ESC e trava de scroll
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Inicialização e persistência local do status de desbloqueio
  useEffect(() => {
    setActiveImageIndex(0);
    setCopiedPrompt(false);
    setIsPurchasing(false);

    if (!model) return;

    try {
      const stored = localStorage.getItem("vorixa_unlocked_prompts");
      if (stored) {
        const unlockedMap = JSON.parse(stored);
        if (unlockedMap[model.id]) {
          setIsUnlocked(true);
          setUnlockedPrompt(unlockedMap[model.id]);
          return;
        }
      }
    } catch {}

    setIsUnlocked(false);
    setUnlockedPrompt(null);
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

  // Montagem exclusiva com a Foto de Corpo Todo (ocultando a foto de perfil conforme solicitado)
  const { galleryImages, fullBodyIndex } = useMemo(() => {
    if (!model) {
      return { galleryImages: [], fullBodyIndex: 0 };
    }

    const fullBodyUrl = model.coverUrl || (model.gallery && model.gallery[0]) || model.avatarUrl;

    const list: { url: string; label: string; kind: "FULL_BODY" }[] = [];

    if (fullBodyUrl) {
      list.push({ url: fullBodyUrl, label: "Foto de Corpo Todo", kind: "FULL_BODY" });
    }

    return {
      galleryImages: list,
      fullBodyIndex: 0,
    };
  }, [model]);

  if (!isOpen || !model || !mounted || typeof document === "undefined") return null;

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

  const handleCopyPrompt = () => {
    const text = unlockedPrompt || model.promptTrigger;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    toast.success("Master Prompt copiado para a área de transferência!");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleUseInStudio = () => {
    const query = new URLSearchParams();
    query.set("modelRef", model.id);
    query.set("modelName", model.name);
    const text = unlockedPrompt || model.promptTrigger;
    if (text) {
      query.set("prompt", text);
    }
    const face = model.referenceFaceUrl || model.avatarUrl;
    if (face) {
      query.set("refImg", face);
    }
    router.push(`/dashboard/create?${query.toString()}`);
  };

  const handleUnlockPrompt = async () => {
    if (isPurchasing) return;
    try {
      setIsPurchasing(true);
      const res = await fetch("/api/models/purchase-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId: model.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Não foi possível desbloquear o Master Prompt. Verifique seu saldo de créditos.");
        return;
      }

      const promptText = data.prompt || model.promptTrigger || "";
      setIsUnlocked(true);
      setUnlockedPrompt(promptText);

      try {
        const stored = localStorage.getItem("vorixa_unlocked_prompts");
        const map = stored ? JSON.parse(stored) : {};
        map[model.id] = promptText;
        localStorage.setItem("vorixa_unlocked_prompts", JSON.stringify(map));
      } catch {}

      toast.success("Master Prompt desbloqueado com sucesso!");
    } catch (error) {
      toast.error("Erro de conexão ao processar o desbloqueio. Tente novamente.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const nextImage = () => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    if (galleryImages.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 overscroll-contain"
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
          <div>
            {/* Visualizador Principal sem Cortes com Suporte a 9:16 e Botão de Enquadramento */}
            <div className="relative aspect-[3/4] sm:aspect-[9/16] max-h-[62vh] sm:max-h-[70vh] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-[#1E202E] shadow-2xl">
              {galleryImages.length > 0 ? (
                <>
                  {/* Fundo com Blur Suave da Própria Foto para Preenchimento Elegante */}
                  {fitMode === "contain" && (
                    <div
                      className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-35 scale-110 pointer-events-none"
                      style={{ backgroundImage: `url(${galleryImages[activeImageIndex]?.url})` }}
                    />
                  )}

                  <img
                    key={galleryImages[activeImageIndex]?.url}
                    src={galleryImages[activeImageIndex]?.url}
                    alt={`${model.name} - ${galleryImages[activeImageIndex]?.label}`}
                    className={`relative z-10 h-full w-full ${
                      fitMode === "contain"
                        ? "object-contain"
                        : "object-cover object-top"
                    } animate-in fade-in duration-300 select-none`}
                  />
                </>
              ) : (
                <div className="text-slate-500 text-xs font-mono">Sem imagens disponíveis</div>
              )}

              {/* Contador Flutuante de Fotos */}
              {galleryImages.length > 0 && (
                <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white shadow-md">
                  {String(activeImageIndex + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")} • {galleryImages[activeImageIndex]?.label}
                </div>
              )}

              {/* Botão de Alternar Enquadramento: Sem Cortes (Contain) vs Preencher (Cover) */}
              <button
                type="button"
                onClick={() => setFitMode(fitMode === "contain" ? "cover" : "contain")}
                className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/80 hover:bg-black/95 text-white backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md min-h-[36px]"
                title={fitMode === "contain" ? "Alternar para preenchimento" : "Alternar para imagem completa sem corte"}
              >
                {fitMode === "contain" ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Completa (Sem Corte)</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Preenchida</span>
                  </>
                )}
              </button>

              {/* Controles de Navegação Touch-Friendly (>= 44px) */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-xl bg-black/85 hover:bg-black text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xl active:scale-95"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-xl bg-black/85 hover:bg-black text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xl active:scale-95"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Miniaturas Inferiores com Identificação de Tipo e Scroll Tátil Suave */}
          {galleryImages.length > 1 && (
            <div
              className="flex items-center gap-2.5 overflow-x-auto pt-3.5 no-scrollbar"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer min-h-[44px] min-w-[44px] ${
                    idx === activeImageIndex
                      ? "border-violet-500 ring-2 ring-violet-500/40 scale-105"
                      : "border-[#1E202E] opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Visualizar ${img.label}`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-center text-slate-300 truncate px-1 py-0.5">
                    {img.kind === "FULL_BODY" ? "Corpo" : img.kind === "PROFILE" ? "Perfil" : `#${idx + 1}`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: Ficha Técnica, Master Prompt à Venda e Ações */}
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

            {/* SEÇÃO PRINCIPAL: Master Prompt de IA à Venda */}
            {isAi && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider flex items-center gap-2">
                    <span>Master Prompt de IA à Venda</span>
                  </h4>
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Prompt Desbloqueado ✅</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 text-violet-200 border border-violet-400/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                      <Sparkles className="w-3 h-3 text-violet-300" />
                      <span>Item Exclusivo à Venda</span>
                    </span>
                  )}
                </div>

                {!isUnlocked ? (
                  /* ESTADO BLOQUEADO */
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#13141B] via-[#0D0E12] to-[#070709] border border-violet-500/30 hover:border-violet-400/50 shadow-[0_8px_32px_rgba(139,92,246,0.12)] p-4 sm:p-5 space-y-4 transition-all">
                    {/* Header com Ícone de Cadeado e Preço em Destaque */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-xl bg-violet-950/80 border border-violet-500/40 text-violet-300 shadow-inner">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Engenharia de Prompt Protegida</div>
                          <div className="text-[10px] text-slate-400 font-mono">Desbloqueio definitivo para sua conta</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">Preço de Aquisição</span>
                        <span className="text-sm sm:text-base font-mono font-black text-violet-200 bg-violet-600/20 px-2.5 py-0.5 rounded-lg border border-violet-400/30 inline-flex items-center gap-1 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                          <span>💎</span>
                          <span>{model.creditsPricePerGen} créditos</span>
                        </span>
                      </div>
                    </div>

                    {/* Prévia borrada para instigar curiosidade e proteger o prompt */}
                    <div className="relative rounded-xl p-3.5 bg-black/70 border border-white/5 overflow-hidden">
                      <p className="text-xs font-mono text-slate-400 blur-sm select-none pointer-events-none opacity-40 leading-relaxed break-words">
                        {model.promptTrigger || "ultra photorealistic 8k full body and portrait master prompt cinematic lighting, 85mm f/1.4, perfect facial symmetry, hyperdetailed skin, luxury editorial aesthetic award winning photography"}
                      </p>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070709]/95 border border-violet-500/40 text-xs font-mono text-violet-200 shadow-2xl">
                          <Lock className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          <span>Prompt Bloqueado • Adquira para Revelar</span>
                        </span>
                      </div>
                    </div>

                    {/* Botão de Compra Protagonista com touch target >= 48px */}
                    <button
                      type="button"
                      onClick={handleUnlockPrompt}
                      disabled={isPurchasing}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-xl shadow-violet-600/30 transition-all cursor-pointer min-h-[48px]"
                    >
                      {isPurchasing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
                          <span>Processando Desbloqueio...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-violet-200 shrink-0" />
                          <span>Desbloquear Master Prompt ({model.creditsPricePerGen} créditos)</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* ESTADO DESBLOQUEADO */
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-950/25 via-[#0D0E12] to-[#070709] border border-emerald-500/40 shadow-[0_8px_32px_rgba(16,185,129,0.15)] p-4 sm:p-5 space-y-4 animate-in fade-in-50 duration-300">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                          <Unlock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Master Prompt Revelado</div>
                          <div className="text-[10px] text-emerald-400/80 font-mono">Disponível para cópia e uso direto no Studio</div>
                        </div>
                      </div>

                      {/* Botão de 1 toque Copiar Prompt com Sonner toast */}
                      <button
                        type="button"
                        onClick={handleCopyPrompt}
                        className="flex items-center gap-1.5 text-xs font-mono text-slate-200 hover:text-white transition-colors cursor-pointer min-h-[44px] px-3.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 shadow-sm"
                        aria-label="Copiar prompt completo"
                      >
                        {copiedPrompt ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300 font-bold">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copiar Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Prompt Limpo e Legível */}
                    <div className="p-3.5 rounded-xl bg-black/80 border border-emerald-500/25">
                      <p className="text-xs font-mono text-slate-200 break-words select-all leading-relaxed">
                        {unlockedPrompt || model.promptTrigger}
                      </p>
                    </div>

                    {/* Botão Primário "Usar no Studio CREATE" com touch target >= 48px */}
                    <button
                      type="button"
                      onClick={handleUseInStudio}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xl shadow-emerald-600/25 transition-all cursor-pointer min-h-[48px]"
                    >
                      <Zap className="w-4 h-4 fill-current text-emerald-200 shrink-0" />
                      <span>Usar no Studio CREATE</span>
                    </button>
                  </div>
                )}

                {model.loraModelId && (
                  <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 pt-1 px-1">
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
                  <strong>Casting Verificado VORTIXIA:</strong> Contratação com contrato padrão de cessão de direitos de imagem, suporte presencial/remoto e garantia de produção.
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
                {isAi ? "Preço do Item na Vitrine:" : "Valor Base por Diária:"}
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-white">
                {isAi ? `💎 ${model.creditsPricePerGen} créditos` : formatPrice(model.bookingPriceCents)}
              </span>
            </div>

            {isAi ? (
              <button
                type="button"
                onClick={handleUseInStudio}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-xl shadow-violet-600/30 transition-all cursor-pointer min-h-[44px]"
              >
                <Zap className="w-4 h-4 fill-current shrink-0" />
                <span>{isUnlocked ? "Abrir Studio CREATE com este Modelo" : "Iniciar Criação no Studio com este Modelo"}</span>
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
    </div>,
    document.body
  );
}
