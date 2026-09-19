"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Ticket, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Seção de Planos no Final da Home (Segunda Referência):
 * - Estilo idêntico ao do print do usuário (Título centralizado "PLANOS", subheadline "Cancele quando quiser. Sem letras miúdas.").
 * - Campo funcional "TEM UM CUPOM DE INDICAÇÃO?" com botão "Aplicar" iluminado em roxo/neon.
 * - Cards com abas "Mensal" e "Vitalício / Anual" com badge luminosa "MELHOR CUSTO-BENEFÍCIO".
 * - Cálculo dinâmico do desconto ao aplicar cupom (ex: VORTIXIA10, PROMO15, VIP20 ou cupons de afiliados).
 */
export function SalesBottomPricingV2() {
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    label: string;
  } | null>(null);

  const [selectedPlanType, setSelectedPlanType] = useState<"monthly" | "annual">("annual");

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponCode.trim()) {
      toast.error("Por favor, digite um código de cupom ou indicação.");
      return;
    }

    setIsValidating(true);
    try {
      const res = await fetch("/api/affiliates/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.code,
          discountPercent: data.discountPercent,
          label: data.label,
        });
        toast.success(data.message || "Cupom aplicado com sucesso!");
      } else {
        toast.error(data.error || "Cupom inválido ou expirado.");
      }
    } catch {
      toast.error("Erro ao validar cupom. Verifique sua conexão.");
    } finally {
      setIsValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Cupom removido.");
  };

  // Cálculo de desconto nos planos
  const calculatePrice = (basePrice: number) => {
    if (!appliedCoupon) return basePrice;
    const discount = (basePrice * appliedCoupon.discountPercent) / 100;
    return Math.max(1, basePrice - discount);
  };

  return (
    <section id="planos-final" className="py-14 sm:py-20 px-3 sm:px-6 max-w-5xl mx-auto space-y-10 sm:space-y-12 w-full scroll-mt-24">
      {/* Cabeçalho Fiel à Referência do Usuário */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-sans tracking-[0.25em] text-slate-300 uppercase font-semibold">
          PLANOS
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-tight">
          Cancele quando quiser.{" "}
          <span className="text-slate-400">Sem letras miúdas.</span>
        </h2>
      </div>

      {/* Barra de Cupom Funcional Estilo Pílula da Referência */}
      <div className="max-w-md mx-auto">
        <form
          onSubmit={handleApplyCoupon}
          className="relative flex items-center bg-[#0C0D12] border border-white/[0.12] rounded-full p-1.5 sm:p-2 shadow-2xl focus-within:border-fuchsia-500/50 transition-all min-h-[46px]"
        >
          <div className="pl-3 pr-2 text-fuchsia-400 shrink-0">
            <Ticket className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder={appliedCoupon ? `CUPOM ${appliedCoupon.code} ATIVO` : "TEM UM CUPOM DE INDICAÇÃO?"}
            disabled={Boolean(appliedCoupon)}
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 placeholder:tracking-wider placeholder:font-mono focus:outline-none uppercase font-mono px-1 py-1.5"
          />

          {appliedCoupon ? (
            <button
              type="button"
              onClick={removeCoupon}
              className="shrink-0 px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium transition-all cursor-pointer min-h-[36px]"
            >
              Remover
            </button>
          ) : (
            <button
              type="submit"
              disabled={isValidating}
              className="shrink-0 px-5 py-2.5 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all cursor-pointer min-h-[38px] flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isValidating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <span>Aplicar</span>
              )}
            </button>
          )}
        </form>

        {appliedCoupon && (
          <div className="mt-2 text-center text-xs text-fuchsia-400 font-medium flex items-center justify-center gap-1.5 animate-in fade-in duration-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {appliedCoupon.label}: {appliedCoupon.discountPercent}% OFF garantido em todos os planos!
            </span>
          </div>
        )}
      </div>

      {/* Grid de Cards de Planos (Design da Referência: Mensal vs Vitalício) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto">
        {/* Card 1: Mensal */}
        <div
          onClick={() => setSelectedPlanType("monthly")}
          className={`rounded-2xl p-6 sm:p-7 bg-[#090A0F] border transition-all duration-300 flex flex-col justify-between space-y-6 shadow-2xl cursor-pointer relative ${
            selectedPlanType === "monthly"
              ? "border-purple-500/50 ring-1 ring-purple-500/30"
              : "border-white/[0.08] hover:border-white/20"
          }`}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                Mensal
              </h3>
              <p className="text-xs text-slate-400 font-light mt-1">
                Acesso completo com renovação flexível mês a mês.
              </p>
            </div>

            <div className="pt-2">
              {appliedCoupon && (
                <span className="text-xs line-through text-slate-500 font-mono block mb-0.5">
                  R$ 99,00
                </span>
              )}
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  R$ {calculatePrice(99).toFixed(2).replace(".", ",")}
                </span>
                <span className="text-xs text-slate-500 font-medium">/mês</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>500 créditos renovados todo mês</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Geração de imagens e vídeos ultra-realistas</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Sincronia labial e dublagem nativa em português</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Motion Control e clonagem de movimentos</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Cancele quando quiser, sem letras miúdas</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href={`/login?plan=monthly${appliedCoupon ? `&coupon=${appliedCoupon.code}` : ""}`}
              className="w-full py-3 px-5 rounded-xl bg-[#14151E] hover:bg-[#1C1D2B] border border-white/[0.1] hover:border-purple-500/40 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Quero esse</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Card 2: Anual / Melhor Custo-Benefício */}
        <div
          onClick={() => setSelectedPlanType("annual")}
          className={`rounded-2xl p-6 sm:p-7 bg-[#090A0F] border transition-all duration-300 flex flex-col justify-between space-y-6 shadow-2xl cursor-pointer relative ${
            selectedPlanType === "annual"
              ? "border-purple-500/70 ring-1 ring-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.15)]"
              : "border-white/[0.08] hover:border-purple-500/40"
          }`}
        >
          {/* Badge Luminosa Pílula Centralizada no Topo Conforme Print */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
            <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-[0_0_15px_rgba(168,85,247,0.6)] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 fill-current" />
              MELHOR CUSTO-BENEFÍCIO (ECONOMIZE 20%)
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                Anual
              </h3>
              <p className="text-xs text-slate-400 font-light mt-1">
                Economize R$ 240/ano com faturamento anual e créditos turbinados.
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs line-through text-slate-500 font-mono block mb-0.5">
                R$ 99,00
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  R$ {calculatePrice(79).toFixed(2).replace(".", ",")}
                </span>
                <span className="text-xs text-purple-400 font-medium">/mês (faturado anualmente)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="font-medium text-white">500 créditos renovados todo mês</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="font-semibold text-emerald-400">Economia real de 20% em relação ao mensal</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Acesso prioritário a todos os novos motores e modelos</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Renderização ultra-rápida em 4K</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Garantia incondicional de 7 dias com reembolso Pix</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href={`/login?plan=annual${appliedCoupon ? `&coupon=${appliedCoupon.code}` : ""}`}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
            >
              <span>Quero esse</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Garantia de Segurança */}
      <div className="flex items-center justify-center gap-3 text-xs text-slate-400 pt-2">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>Pagamento seguro via Pix com liberação imediata da conta</span>
      </div>
    </section>
  );
}
