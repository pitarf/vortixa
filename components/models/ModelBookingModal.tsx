"use client";

import React, { useState, useEffect } from "react";
import { MarketplaceModelItem, CATEGORY_LABELS } from "./types";
import { X, DollarSign, Send, MapPin, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ModelBookingModalProps {
  model: MarketplaceModelItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ModelBookingModal({
  model,
  isOpen,
  onClose,
  onSuccess,
}: ModelBookingModalProps) {
  const [notes, setNotes] = useState("");
  const [estimatedBudgetStr, setEstimatedBudgetStr] = useState("");
  const [projectType, setProjectType] = useState("Campanha Comercial (TV & Digital)");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trava de Scroll do Body
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !model) return null;

  const categoryMeta = CATEGORY_LABELS[model.category] || { label: model.category, icon: "✨" };

  const formatPrice = (cents?: number | null) => {
    if (!cents) return "Sob Consulta";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  // Cálculo e Preview Dinâmico do Orçamento Proposto
  const parsedBudgetNumber = (() => {
    if (!estimatedBudgetStr.trim()) return null;
    const clean = estimatedBudgetStr.replace(/[^0-9,.-]/g, "").replace(",", ".");
    const val = parseFloat(clean);
    return isNaN(val) || val <= 0 ? null : val;
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!notes.trim()) {
      toast.error("Por favor, descreva o briefing ou escopo da campanha.");
      return;
    }

    try {
      setIsSubmitting(true);

      let estimatedBudgetCents: number | undefined = undefined;
      if (parsedBudgetNumber) {
        estimatedBudgetCents = Math.round(parsedBudgetNumber * 100);
      }

      const fullBriefing = `[Tipo de Projeto: ${projectType}]\n${notes.trim()}`;

      const response = await fetch("/api/models/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelId: model.id,
          notes: fullBriefing,
          estimatedBudgetCents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível registrar a proposta.");
      }

      toast.success("Solicitação enviada com sucesso!", {
        description: "A assessoria do modelo e o time de casting entrarão em contato em breve.",
      });

      setNotes("");
      setEstimatedBudgetStr("");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Erro ao enviar proposta de reserva:", err);
      toast.error(err.message || "Falha ao registrar solicitação de contratação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-xl h-full sm:h-auto max-h-screen sm:max-h-[92vh] rounded-none sm:rounded-3xl bg-[#0D0E12] border-0 sm:border border-[#1E202E] shadow-2xl overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200 overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* Glow Superior */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Botão Fechar (>= 44px) */}
        <button
          type="button"
          onClick={onClose}
          className="fixed sm:absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2.5 rounded-2xl bg-[#070709]/90 border border-[#1E202E] hover:border-slate-600 text-slate-400 hover:text-white transition-all cursor-pointer shadow-md min-h-[44px] min-w-[44px] flex items-center justify-center backdrop-blur-md"
          aria-label="Fechar modal de contratação"
        >
          <X className="w-5 h-5 sm:w-4 sm:h-4" />
        </button>

        {/* Resumo do Talento (Comp-Card Mini) */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#1E202E] relative z-10">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <img
              src={model.avatarUrl}
              alt={model.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-[#1E202E] shadow-md shrink-0"
            />
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Modelo Real Agenciado
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {categoryMeta.icon} {categoryMeta.label}
                </span>
              </div>
              <h2 id="booking-modal-title" className="text-base sm:text-lg font-black text-white font-heading truncate">
                Proposta para {model.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                {model.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{model.location}</span>
                  </span>
                )}
                <span className="text-emerald-400 font-bold shrink-0">
                  Base: {formatPrice(model.bookingPriceCents)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Proposta de Casting com Inputs Ergonômicos */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
              Tipo de Produção / Formato
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full bg-[#070709] border border-[#1E202E] focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-base sm:text-sm text-white rounded-2xl px-3.5 py-3 outline-none transition-all min-h-[44px] cursor-pointer"
            >
              <option value="Campanha Comercial (TV & Digital)">Campanha Comercial (TV & Digital)</option>
              <option value="Editorial de Moda / Lookbook">Editorial de Moda / Lookbook</option>
              <option value="E-commerce & Catálogo de Produtos">E-commerce & Catálogo de Produtos</option>
              <option value="Vídeo Institucional / B2B">Vídeo Institucional / B2B</option>
              <option value="Presença em Evento / Desfile">Presença em Evento / Desfile</option>
              <option value="Outro Formato">Outro Formato</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
              Briefing & Escopo do Projeto <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva detalhes como: local da gravação, previsão de diárias, roteiro simplificado e direitos de veiculação pretendidos."
              className="w-full bg-[#070709] border border-[#1E202E] focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-base sm:text-sm text-white placeholder-slate-500 rounded-2xl p-3.5 outline-none resize-none transition-all leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
              Orçamento Estimado Proposto (R$)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                inputMode="decimal"
                value={estimatedBudgetStr}
                onChange={(e) => setEstimatedBudgetStr(e.target.value)}
                placeholder={model.bookingPriceCents ? `Ex: ${(model.bookingPriceCents / 100).toFixed(2)}` : "Ex: 5000"}
                className="w-full bg-[#070709] border border-[#1E202E] focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-base sm:text-sm text-white placeholder-slate-500 rounded-2xl pl-10 pr-4 py-3 outline-none transition-all min-h-[44px]"
              />
            </div>

            {/* Painel de Comparativo Monetário em Tempo Real */}
            <div className="mt-2 p-3 rounded-xl bg-black/40 border border-[#1E202E] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Valor da Proposta:</span>
              <span className="font-bold text-white">
                {parsedBudgetNumber
                  ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(parsedBudgetNumber)
                  : `${formatPrice(model.bookingPriceCents)} (Padrão do Modelo)`}
              </span>
            </div>
          </div>

          {/* Garantia e Segurança do Casting */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-900/30 text-[11px] text-cyan-300/90 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Ao enviar, o coordenador de casting VORIXA validará a agenda do modelo e retornará com minuta de cessão de direitos e alinhamento de produção.
            </span>
          </div>

          {/* Ações com Touch Targets >= 44px */}
          <div className="pt-4 border-t border-[#1E202E] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#1E202E] hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:opacity-95 active:scale-[0.98] text-white text-xs font-bold shadow-lg shadow-cyan-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enviando proposta...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Proposta de Reserva</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
