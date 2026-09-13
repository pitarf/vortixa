"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Coins,
  Copy,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    paymentId: string;
    orderId?: string;
    credits: number;
    bonusCredits?: number;
    amountCents: number;
    newBalance?: number;
    packageName?: string;
  } | null;
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
  orderDetails,
}: PaymentSuccessModalProps) {
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen || !orderDetails) return null;

  const formatBRL = (cents: number) => {
    return (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleCopyOrderId = async () => {
    const idToCopy = orderDetails.orderId || orderDetails.paymentId;
    try {
      await navigator.clipboard.writeText(idToCopy);
      setCopiedId(true);
      toast.success("Identificador do pedido copiado!");
      setTimeout(() => setCopiedId(false), 2500);
    } catch {
      toast.error("Não foi possível copiar o identificador.");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0D0E12] border border-emerald-500/40 shadow-[0_0_90px_rgba(16,185,129,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow Superior Esmeralda */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -mt-24" />

        {/* Conteúdo Central de Celebração */}
        <div className="relative z-10 p-6 md:p-8 flex flex-col items-center text-center space-y-6 overflow-y-auto">
          {/* Ícone com Glow e Animação */}
          <div className="relative mt-2">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0D0E12] rounded-[22px] flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Título & Descrição */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              PAGAMENTO CONFIRMADO
            </div>
            <h3
              id="success-modal-title"
              className="text-2xl md:text-3xl font-black text-white tracking-tight"
            >
              Créditos Liberados com Sucesso!
            </h3>
            <p className="text-xs md:text-sm text-slate-400 max-w-sm">
              Sua recarga já foi processada atomicamente no banco de dados e está disponível na sua carteira digital.
            </p>
          </div>

          {/* Recibo da Transação */}
          <div className="w-full rounded-2xl bg-[#070709] border border-[#1E202E] p-5 text-left space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E202E]/80 text-xs">
              <span className="text-slate-400 font-mono uppercase">ID do Pedido</span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="flex items-center gap-1 text-slate-300 hover:text-white font-mono text-[11px] p-1 rounded hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <span>
                  #{(orderDetails.orderId || orderDetails.paymentId).slice(0, 10).toUpperCase()}
                </span>
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Créditos Concedidos */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300 font-medium">Créditos Adicionados</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-emerald-400 font-mono text-base">
                  +{orderDetails.credits.toLocaleString("pt-BR")}
                </span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            {orderDetails.bonusCredits && orderDetails.bonusCredits > 0 ? (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Bônus Promocional</span>
                <span className="font-mono text-emerald-300 font-bold">
                  +{orderDetails.bonusCredits} GRÁTIS
                </span>
              </div>
            ) : null}

            {/* Valor Pago */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Valor Total Pago</span>
              <span className="font-mono text-white font-bold">
                {formatBRL(orderDetails.amountCents)}
              </span>
            </div>

            {/* Novo Saldo Atualizado */}
            {orderDetails.newBalance !== undefined && (
              <div className="pt-3 border-t border-[#1E202E]/80 flex items-center justify-between text-sm">
                <span className="text-violet-300 font-bold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Novo Saldo Disponível
                </span>
                <span className="text-lg font-black text-white font-mono">
                  {orderDetails.newBalance.toLocaleString("pt-BR")} créditos
                </span>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="w-full space-y-3 pt-2">
            <Link
              href="/dashboard/create"
              onClick={onClose}
              style={{ minHeight: "48px" }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 shadow-xl shadow-violet-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ir para o Studio CREATE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={onClose}
              style={{ minHeight: "44px" }}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              Continuar no Painel de Créditos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
