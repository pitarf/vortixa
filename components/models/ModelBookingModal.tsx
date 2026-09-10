"use client";

import React, { useState } from "react";
import { MarketplaceModelItem, CATEGORY_LABELS } from "./types";
import { X, DollarSign, Send, CheckCircle2, MapPin } from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !model) return null;

  const categoryMeta = CATEGORY_LABELS[model.category] || { label: model.category, icon: "✨" };

  const formatPrice = (cents?: number | null) => {
    if (!cents) return "Sob Consulta";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notes.trim()) {
      toast.error("Por favor, descreva os detalhes do projeto ou da campanha.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Tratamento de valor estimado opcional
      let estimatedBudgetCents: number | undefined = undefined;
      if (estimatedBudgetStr.trim()) {
        const parsed = parseFloat(estimatedBudgetStr.replace(/[^0-9,.-]/g, "").replace(",", "."));
        if (!isNaN(parsed) && parsed > 0) {
          estimatedBudgetCents = Math.round(parsed * 100);
        }
      }

      const response = await fetch("/api/models/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelId: model.id,
          notes: notes.trim(),
          estimatedBudgetCents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível enviar a proposta.");
      }

      toast.success("Solicitação enviada com sucesso!", {
        description: "A assessoria do modelo e o time VORIXA entrarão em contato em breve.",
      });

      setNotes("");
      setEstimatedBudgetStr("");
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Erro ao enviar proposta de contratação:", err);
      toast.error(err.message || "Falha ao registrar solicitação de contratação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in-50 duration-200 overscroll-contain">
      <div
        className="relative w-full sm:max-w-lg h-full sm:h-auto max-h-screen sm:max-h-[90vh] rounded-none sm:rounded-3xl bg-[#0D0E12] border-0 sm:border border-[#1E202E] shadow-2xl overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200 overscroll-contain"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* Glow Superior */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Botão Fechar com touch target de 44px */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-xl bg-[#070709]/90 border border-[#1E202E] hover:border-slate-600 text-slate-400 hover:text-white transition-all cursor-pointer shadow-md min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Fechar modal de contratação"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header com Resumo do Modelo */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#1E202E] relative z-10">
          <div className="flex items-center gap-3.5">
            <img
              src={model.avatarUrl}
              alt={model.name}
              className="w-14 h-14 rounded-2xl object-cover border border-[#1E202E]"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Modelo Real
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {categoryMeta.icon} {categoryMeta.label}
                </span>
              </div>
              <h2 id="booking-modal-title" className="text-lg font-black text-white font-heading">
                Contratar {model.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                {model.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{model.location}</span>
                  </span>
                )}
                <span className="text-emerald-400 font-bold">
                  Base: {formatPrice(model.bookingPriceCents)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Proposta */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
              Sobre o Projeto / Campanha <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Campanha publicitária de moda outono/inverno em estúdio em SP. Gravação de vídeo comercial de 30s e fotos para lookbook. Previsão de 1 diária."
              className="w-full bg-[#070709] border border-[#1E202E] focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-xs sm:text-sm text-white placeholder-slate-500 rounded-2xl p-3 outline-none resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase font-mono">
              Orçamento Proposto / Estimado (R$)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={estimatedBudgetStr}
                onChange={(e) => setEstimatedBudgetStr(e.target.value)}
                placeholder={model.bookingPriceCents ? `Ex: ${(model.bookingPriceCents / 100).toFixed(2)}` : "Ex: 5000"}
                className="w-full bg-[#070709] border border-[#1E202E] focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 text-xs sm:text-sm text-white placeholder-slate-500 rounded-2xl pl-10 pr-4 py-3 outline-none transition-all"
                style={{ minHeight: "44px" }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Deixe em branco para considerar a diária base do modelo.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-900/30 text-[11px] text-cyan-300/90 leading-relaxed flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Ao enviar a proposta, um gestor de casting entrará em contato via e-mail para validar datas, cachê final e alinhamento de contrato.
            </span>
          </div>

          <div className="pt-3 border-t border-[#1E202E] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#1E202E] hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              style={{ minHeight: "44px" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              style={{ minHeight: "44px" }}
            >
              {isSubmitting ? (
                <span>Enviando proposta...</span>
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