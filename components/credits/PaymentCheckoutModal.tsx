"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  FileText,
} from "lucide-react";
import { cleanDocument, formatDocument, isValidDocument } from "@/lib/document-validator";
import { toast } from "sonner";

export interface CreditPackageSummary {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  priceCents: number;
  bonusCredits: number;
  isPopular?: boolean;
}

export interface CardData {
  cardNumber?: string;
  cardHolderName?: string;
  cardExpiryMonth?: string;
  cardExpiryYear?: string;
  cardCcv?: string;
}

export interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: CreditPackageSummary | null;
  onProceed: (
    selectedMethod: "pix" | "card",
    cpf?: string,
    cardData?: CardData
  ) => Promise<void> | void;
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
  const [cpf, setCpf] = useState<string>("");
  const [cpfTouched, setCpfTouched] = useState<boolean>(false);

  // Campos de Cartão de Crédito
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardHolder, setCardHolder] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCcv, setCardCcv] = useState<string>("");
  const [cardTouched, setCardTouched] = useState<boolean>(false);

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatCardExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  // Carrega CPF salvo previamente no localStorage para máxima conveniência
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      try {
        const savedCpf = localStorage.getItem("vorixa_user_cpf");
        if (savedCpf) {
          setCpf(formatDocument(savedCpf));
        }
      } catch {
        // Ignora caso storage esteja bloqueado
      }
    }
  }, [isOpen]);

  const docValidation = useMemo(() => {
    if (!cpf) return { isValid: false, clean: "" };
    return isValidDocument(cpf);
  }, [cpf]);

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
    setCpfTouched(true);

    const clean = cleanDocument(cpf);
    if (!clean) {
      toast.error("Informe seu CPF ou CNPJ para emissão da cobrança segura.");
      return;
    }

    if (!docValidation.isValid) {
      toast.error(docValidation.error || "CPF ou CNPJ inválido. Verifique os dígitos informados.");
      return;
    }

    // Salva no localStorage para próximas compras
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vorixa_user_cpf", clean);
      } catch {
        // Ignora
      }
    }

    // Pagamento via Cartão de Crédito temporariamente suspenso
    if ((selectedMethod as string) === "card") {
      toast.error("O pagamento via Cartão de Crédito está temporariamente em manutenção. Utilize o Pix Instantâneo para liberação imediata.");
      setSelectedMethod("pix");
      return;
    }

    onProceed(selectedMethod, clean);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full h-full sm:h-auto max-w-lg md:max-w-xl rounded-none sm:rounded-3xl bg-[#0D0E12] border-0 sm:border border-[#1E202E] shadow-[0_0_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-none sm:max-h-[92vh]">
        {/* Glows Decorativos de Fundo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* 1. Header do Modal (Fixo e Seguro) */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[#1E202E] bg-[#13141B]/80 sticky top-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-0.5 shadow-lg shadow-violet-600/20 shrink-0">
              <div className="w-full h-full bg-[#0D0E12] rounded-[14px] flex items-center justify-center text-violet-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  id="checkout-modal-title"
                  className="text-sm sm:text-base font-bold text-white tracking-tight font-heading truncate"
                >
                  Checkout Seguro VORTIXIA
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 shrink-0">
                  <Lock className="w-2.5 h-2.5" />
                  SSL 256-BIT
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Processado via gateway oficial Vorexpay
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            aria-label="Fechar checkout"
            style={{ minHeight: "48px", minWidth: "48px" }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Conteúdo Rolável com overscroll-contain */}
        <div className="relative z-10 p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto overscroll-contain flex-1">
          {/* Card Resumo do Pedido */}
          <div className="rounded-2xl bg-gradient-to-b from-[#13141B] to-[#070709] border border-[#1E202E] p-4 sm:p-5 shadow-inner space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5 font-bold">
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
                <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight font-heading">
                  Pacote {packageData.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {packageData.description || "Acesso completo a todos os motores criativos neurais."}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {formatBRL(packageData.priceCents)}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  pagamento único sob demanda
                </div>
              </div>
            </div>

            {/* Balanço de Créditos */}
            <div className="pt-3 border-t border-[#1E202E]/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {totalCredits.toLocaleString("pt-BR")} créditos
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  (≈ R$ {unitCost} / cr)
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sem renovação automática
              </span>
            </div>
          </div>

          {/* 3. Seletor de Forma de Pagamento */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block">
              Escolha a Forma de Pagamento
            </label>

            <div className="grid grid-cols-1 gap-3">
              {/* Opção 1: Pix Instantâneo (Vorexpay) */}
              <button
                type="button"
                role="radio"
                aria-checked={selectedMethod === "pix"}
                onClick={() => setSelectedMethod("pix")}
                style={{ minHeight: "68px" }}
                className={`w-full flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  selectedMethod === "pix"
                    ? "bg-gradient-to-r from-violet-950/40 via-[#13141B] to-emerald-950/20 border-violet-500 shadow-lg shadow-violet-500/10 ring-1 ring-violet-500"
                    : "bg-[#070709] border-[#1E202E] hover:border-slate-700 hover:bg-[#13141B]"
                }`}
              >
                {/* Ícone Oficial Pix */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                  <svg
                    viewBox="0 0 512 512"
                    className="w-5 h-5 sm:w-6 sm:h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M400.1 234.3L327.9 162c-39.7-39.7-104.1-39.7-143.8 0L111.9 234.3c-39.7 39.7-39.7 104.1 0 143.8l72.2 72.3c39.7 39.7 104.1 39.7 143.8 0l72.2-72.3c39.7-39.7 39.7-104.1 0-143.8zm-111.4 111.4c-17.9 17.9-47 17.9-64.9 0l-57.8-57.8c-17.9-17.9-17.9-47 0-64.9l57.8-57.8c17.9-17.9 47-17.9 64.9 0l57.8 57.8c17.9 17.9 17.9 47 0 64.9l-57.8 57.8z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-white font-heading">
                      Pix Instantâneo (Vorexpay)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Liberação em 3s
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Aprovação em segundos via QR Code dinâmico do Banco Central ou chave Copia e Cola. Seus créditos entram na hora.
                  </p>
                </div>

                <div className="shrink-0 self-center">
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

              {/* Opção 2: Cartão de Crédito - TEMPORARIAMENTE DESATIVADO / EM MANUTENÇÃO */}
              {/*
              <button
                type="button"
                role="radio"
                aria-checked={selectedMethod === "card"}
                onClick={() => setSelectedMethod("card")}
                style={{ minHeight: "68px" }}
                className={`w-full flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  selectedMethod === "card"
                    ? "bg-gradient-to-r from-violet-950/40 via-[#13141B] to-cyan-950/20 border-violet-500 shadow-lg shadow-violet-500/10 ring-1 ring-violet-500"
                    : "bg-[#070709] border-[#1E202E] hover:border-slate-700 hover:bg-[#13141B]"
                }`}
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-400 mt-0.5">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-white font-heading">
                      Cartão de Crédito
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold">
                      Até 12x
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Visa, Mastercard, Elo e Amex com tokenização bancária e proteção antifraude 3D Secure.
                  </p>

                  <div className="flex items-center gap-1.5 mt-2 opacity-80 flex-wrap">
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

                <div className="shrink-0 self-center">
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
              */}
            </div>
          </div>

          {/* 4. Identificação do Titular (CPF / CNPJ) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="checkout-cpf-input"
                className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-violet-400" />
                CPF ou CNPJ do Titular
              </label>
              {cpfTouched && docValidation.isValid && (
                <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Documento Válido
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id="checkout-cpf-input"
                type="text"
                inputMode="numeric"
                value={cpf}
                onChange={(e) => {
                  setCpf(formatDocument(e.target.value));
                  if (!cpfTouched) setCpfTouched(true);
                }}
                onBlur={() => setCpfTouched(true)}
                placeholder="000.000.000-00"
                maxLength={18}
                disabled={isProcessing}
                style={{ minHeight: "48px" }}
                className={`w-full bg-[#070709] border rounded-2xl px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none transition-all ${
                  cpfTouched && !docValidation.isValid && cpf.length > 0
                    ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30"
                    : docValidation.isValid
                    ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                    : "border-[#1E202E] focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              {cpfTouched && !docValidation.isValid && cpf.length > 0 ? (
                <span className="text-rose-400 font-medium">
                  {docValidation.error || "CPF ou CNPJ inválido."}
                </span>
              ) : (
                <span className="text-slate-400">
                  Exigido pelo Banco Central para liquidação instantânea e emissão do Pix.
                </span>
              )}
            </div>
          </div>

          {/* 5. Dados do Cartão de Crédito - TEMPORARIAMENTE DESATIVADO / EM MANUTENÇÃO */}
          {/*
          {selectedMethod === "card" && (
            <div className="space-y-3 pt-2 p-4 rounded-2xl bg-[#070709] border border-[#1E202E] animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-bold flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  Dados do Cartão de Crédito
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase bg-[#13141B] px-2 py-0.5 rounded border border-white/5">
                  Criptografia 3D Secure
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Número do Cartão</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  disabled={isProcessing}
                  className="w-full bg-[#0D0E12] border border-[#1E202E] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Nome Impresso no Cartão</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  disabled={isProcessing}
                  className="w-full bg-[#0D0E12] border border-[#1E202E] rounded-xl px-3.5 py-2.5 text-sm text-white uppercase placeholder:text-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300">Validade (MM/AA)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                    placeholder="MM/AA"
                    maxLength={5}
                    disabled={isProcessing}
                    className="w-full bg-[#0D0E12] border border-[#1E202E] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300">CVV</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={cardCcv}
                    onChange={(e) => setCardCcv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    disabled={isProcessing}
                    className="w-full bg-[#0D0E12] border border-[#1E202E] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}
          */}

          {/* 6. Selos de Garantia e Confiança Financeira */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#070709] border border-[#1E202E] text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Criptografia Ponta a Ponta AES-256</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#070709] border border-[#1E202E] text-xs text-slate-300">
              <RefreshCw className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">Estorno Automático em Falhas</span>
            </div>
          </div>
        </div>

        {/* 5. Footer com Botão de Ação CTA Touch Target 52px */}
        <div className="relative z-10 p-4 sm:p-6 border-t border-[#1E202E] bg-[#13141B]/90 sticky bottom-0 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            style={{ minHeight: "52px" }}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 active:scale-[0.99] transition-all shadow-xl shadow-violet-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                <span>Processando Pagamento Seguro...</span>
              </>
            ) : (
              <>
                <span className="truncate">
                  Gerar QR Code Pix Instantâneo ({formatBRL(packageData.priceCents)})
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-400">
            Ambiente financeiro Zero Trust. Seus dados estão seguros e criptografados.
          </p>
        </div>
      </div>
    </div>
  );
}
