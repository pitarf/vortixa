"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Lock,
  RefreshCw,
  Zap,
  CheckCircle2,
  CreditCard,
  Loader2,
  Sparkles,
  Check,
  Coins,
  ArrowRight,
} from "lucide-react";

export interface CreditPackageSummary {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  priceCents: number;
  bonusCredits: number;
  isPopular?: boolean;
}

export interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: CreditPackageSummary | null;
  onProceed: (selectedMethod: "pix" | "card") => Promise<void> | void;
  isProcessing?: boolean;
}

export function PaymentCheckoutModal({
  isOpen,
  onClose,
  packageData,
  onProceed,
  isProcessing = false,
}: PaymentCheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"pix" | "card">("pix");

  if (!isOpen || !packageData) return null;

  const totalCredits = packageData.credits + packageData.bonusCredits;
  const unitCost = (packageData.priceCents / 100 / totalCredits).toFixed(2);

  const formatBRL = (cents: number) => {
    return (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleConfirm = () => {
    if (isProcessing) return;
    onProceed(selectedMethod);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg md:max-w-xl rounded-3xl bg-[#0D0E12] border border-[#1E202E] shadow-[0_0_80px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glows decorativos sutis */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* 1. Header do Modal */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-[#1E202E] bg-[#13141B]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-0.5 shadow-lg shadow-violet-600/20">
              <div className="w-full h-full bg-[#0D0E12] rounded-[14px] flex items-center justify-center text-violet-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="checkout-modal-title"
                  className="text-base font-bold text-white tracking-tight"
                >
                  Checkout Seguro VORIXA
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  SSL 256-bit
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Adquira créditos pré-pagos sem assinaturas forçadas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            aria-label="Fechar checkout"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Conteúdo Rolável */}
        <div className="relative z-10 p-6 space-y-6 overflow-y-auto">
          {/* Card Resumo do Pacote Selecionado */}
          <div className="rounded-2xl bg-gradient-to-b from-[#13141B] to-[#070709] border border-[#1E202E] p-5 shadow-inner">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Resumo do Pedido
              </span>
              {packageData.bonusCredits > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                  +{packageData.bonusCredits} BÔNUS INCLUSO
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h4 className="text-xl font-bold text-white tracking-tight">
                  Pacote {packageData.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {packageData.description || "Acesso completo a todos os motores neurais."}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {formatBRL(packageData.priceCents)}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  pagamento único sob demanda
                </div>
              </div>
            </div>

            {/* Balanço de Créditos */}
            <div className="mt-4 pt-4 border-t border-[#1E202E]/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {totalCredits.toLocaleString("pt-BR")} créditos
                </span>
                <span className="text-slate-500 font-mono">
                  (≈ R$ {unitCost} / crédito)
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sem data de expiração
              </span>
            </div>
          </div>

          {/* 3. Seletor de Método de Pagamento */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block">
              Escolha a Forma de Pagamento
            </label>

            <div className="grid grid-cols-1 gap-3">
              {/* Opção 1: Pix Instantâneo (Mercado Pago) */}
              <button
                type="button"
                onClick={() => setSelectedMethod("pix")}
                className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[56px] relative ${
                  selectedMethod === "pix"
                    ? "bg-gradient-to-r from-violet-950/40 via-[#13141B] to-cyan-950/20 border-violet-500 shadow-lg shadow-violet-500/10"
                    : "bg-[#070709]/60 border-[#1E202E] hover:border-slate-700 hover:bg-[#13141B]/40"
                }`}
              >
                {/* Ícone Oficial Pix */}
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400 mt-0.5">
                  <svg
                    viewBox="0 0 512 512"
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M400.1 234.3L327.9 162c-39.7-39.7-104.1-39.7-143.8 0L111.9 234.3c-39.7 39.7-39.7 104.1 0 143.8l72.2 72.3c39.7 39.7 104.1 39.7 143.8 0l72.2-72.3c39.7-39.7 39.7-104.1 0-143.8zm-111.4 111.4c-17.9 17.9-47 17.9-64.9 0l-57.8-57.8c-17.9-17.9-17.9-47 0-64.9l57.8-57.8c17.9-17.9 47-17.9 64.9 0l57.8 57.8c17.9 17.9 17.9 47 0 64.9l-57.8 57.8z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">
                      Pix Instantâneo (Mercado Pago)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Liberação Imediata
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Aprovação em segundos via QR Code ou chave Copia e Cola. Créditos disponíveis instantaneamente após o banco confirmar.
                  </p>
                </div>

                <div className="flex-shrink-0 self-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      selectedMethod === "pix"
                        ? "border-violet-500 bg-violet-600 text-white"
                        : "border-slate-600 bg-transparent"
                    }`}
                  >
                    {selectedMethod === "pix" && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </button>

              {/* Opção 2: Cartão de Crédito / Outros */}
              <button
                type="button"
                onClick={() => setSelectedMethod("card")}
                className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[56px] relative ${
                  selectedMethod === "card"
                    ? "bg-gradient-to-r from-violet-950/40 via-[#13141B] to-cyan-950/20 border-violet-500 shadow-lg shadow-violet-500/10"
                    : "bg-[#070709]/60 border-[#1E202E] hover:border-slate-700 hover:bg-[#13141B]/40"
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center flex-shrink-0 text-violet-400 mt-0.5">
                  <CreditCard className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">
                      Cartão de Crédito / Outros
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono">
                      Até 12x
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Visa, Mastercard, Elo, Hipercard e American Express com tokenização segura e proteção antifraude.
                  </p>

                  {/* Bandeiras de Cartão */}
                  <div className="flex items-center gap-2 mt-2 opacity-70">
                    <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#13141B] border border-slate-700 rounded text-slate-300">
                      VISA
                    </span>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#13141B] border border-slate-700 rounded text-slate-300">
                      MASTERCARD
                    </span>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#13141B] border border-slate-700 rounded text-slate-300">
                      ELO
                    </span>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[#13141B] border border-slate-700 rounded text-slate-300">
                      AMEX
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 self-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      selectedMethod === "card"
                        ? "border-violet-500 bg-violet-600 text-white"
                        : "border-slate-600 bg-transparent"
                    }`}
                  >
                    {selectedMethod === "card" && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 4. Badges de Segurança e Garantia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#070709]/70 border border-[#1E202E] text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Criptografia Ponta a Ponta</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#070709]/70 border border-[#1E202E] text-xs text-slate-300">
              <RefreshCw className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Estorno Automático em Falhas</span>
            </div>
          </div>
        </div>

        {/* 5. Footer com Botão de Ação */}
        <div className="relative z-10 p-6 border-t border-[#1E202E] bg-[#13141B]/70 flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            style={{ minHeight: "48px" }}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 active:scale-[0.99] transition-all shadow-xl shadow-violet-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processando Sessão Segura...</span>
              </>
            ) : (
              <>
                <span>
                  {selectedMethod === "pix"
                    ? "Gerar QR Code Pix Seguro"
                    : "Prosseguir para Pagamento Seguro"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-500">
            Transação protegida por arquitetura financeira Zero Trust. Ao continuar, você concorda com os Termos de Serviço VORIXA.
          </p>
        </div>
      </div>
    </div>
  );
}
