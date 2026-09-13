"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Share2,
  Copy,
  Check,
  TrendingUp,
  Users,
  Wallet,
  Sparkles,
  MessageCircle,
  Send,
  Edit3,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  RefreshCw,
  Calculator,
} from "lucide-react";

export default function AffiliatesPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Modais e Abas
  const [activeTab, setActiveTab] = useState<"commissions" | "payouts">("commissions");
  const [isEditCodeModalOpen, setIsEditCodeModalOpen] = useState(false);
  const [newCustomCode, setNewCustomCode] = useState("");
  const [isUpdatingCode, setIsUpdatingCode] = useState(false);

  // Modal de Saque Pix
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixKeyType, setPixKeyType] = useState<"CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM">("CPF");
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  // Simulador Interativo de Comissões
  const [simulatedReferrals, setSimulatedReferrals] = useState(25);

  // Históricos
  const [commissions, setCommissions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/affiliates/me");
      if (!res.ok) {
        throw new Error("Erro ao carregar dados do afiliado.");
      }
      const data = await res.json();
      setStats(data.stats);
      if (data.stats?.profile?.pixKey) {
        setPixKey(data.stats.profile.pixKey);
      }
      if (data.stats?.profile?.pixKeyType) {
        setPixKeyType(data.stats.profile.pixKeyType);
      }
    } catch (err: any) {
      toast.error(err.message || "Não foi possível carregar seu painel de afiliado.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const [commissionsRes, payoutsRes] = await Promise.all([
        fetch("/api/affiliates/conversions?limit=50"),
        fetch("/api/affiliates/payout"),
      ]);

      if (commissionsRes.ok) {
        const commData = await commissionsRes.json();
        setCommissions(commData.commissions || []);
      }
      if (payoutsRes.ok) {
        const payData = await payoutsRes.json();
        setPayouts(payData.payouts || []);
      }
    } catch (err) {
      console.error("Erro ao carregar históricos:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, []);

  const activeCode = stats?.profile?.customCode || stats?.profile?.code || "VORIXA";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://vortixia.com.br";
  const referralLink = `${origin}/register?ref=${activeCode}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      toast.success("Link de indicação copiado!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(activeCode);
      setCopiedCode(true);
      toast.success(`Código "${activeCode}" copiado!`);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Crie imagens e vídeos ultra-realistas com inteligência artificial no VORIXA! Cadastre-se pelo meu link com bônus de boas-vindas: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `Crie imagens e vídeos ultra-realistas com inteligência artificial no VORIXA!`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`, "_blank");
  };

  const handleUpdateCustomCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomCode.trim() || isUpdatingCode) return;

    try {
      setIsUpdatingCode(true);
      const res = await fetch("/api/affiliates/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customCode: newCustomCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Não foi possível atualizar o código.");
      }

      toast.success("Código de indicação personalizado com sucesso!");
      setStats(data.stats);
      setIsEditCodeModalOpen(false);
      setNewCustomCode("");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar código.");
    } finally {
      setIsUpdatingCode(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingPayout) return;

    const amountNumber = parseFloat(payoutAmount.replace(",", "."));
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error("Informe um valor de saque válido.");
      return;
    }

    const amountCents = Math.round(amountNumber * 100);

    if (amountCents < 5000) {
      toast.error("O valor mínimo para solicitação de saque é de R$ 50,00.");
      return;
    }

    if (!pixKey.trim()) {
      toast.error("Informe a sua chave Pix para receber a transferência.");
      return;
    }

    try {
      setIsSubmittingPayout(true);

      await fetch("/api/affiliates/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pixKey: pixKey.trim(), pixKeyType }),
      });

      const res = await fetch("/api/affiliates/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao solicitar saque.");
      }

      toast.success(data.message || "Solicitação de saque enviada com sucesso!");
      setIsPayoutModalOpen(false);
      setPayoutAmount("");
      fetchStats();
      fetchHistory();
    } catch (err: any) {
      toast.error(err.message || "Falha ao processar saque.");
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  const balanceInReais = ((stats?.profile?.balanceCents || 0) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const totalEarningsInReais = ((stats?.profile?.totalEarningsCents || 0) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const commissionPercent = Math.round((stats?.profile?.commissionRate || 0.15) * 100);
  const rawBalanceCents = stats?.profile?.balanceCents || 0;
  const progressToPayout = Math.min(100, Math.round((rawBalanceCents / 5000) * 100));

  // Cálculo da simulação de ganhos (Média de ticket R$ 79,90 por pacote)
  const averageTicketReais = 79.90;
  const estimatedMonthly = Math.round(simulatedReferrals * averageTicketReais * (commissionPercent / 100));
  const estimatedYearly = estimatedMonthly * 12;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16 sm:pb-20 px-3 sm:px-4 lg:px-6">
      {/* Header com Banner Gradiente Estilo Wealth / Stripe Partner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/40 via-[#0D0E12] to-[#070709] p-5 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>PROGRAMA OFICIAL DE AFILIADOS VORIXA</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading leading-tight">
              Indique Criadores e Ganhe{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                {commissionPercent}% de Comissão
              </span>{" "}
              em Dinheiro
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Compartilhe seu link com criadores, agências e estúdios. Sempre que alguém se cadastrar e comprar créditos, você recebe {commissionPercent}% de comissão via Pix. Sem limites de ganhos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch md:items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsPayoutModalOpen(true)}
              disabled={rawBalanceCents < 5000}
              style={{ minHeight: "48px" }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>Solicitar Saque Pix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de 4 KPIs Financeiros Adaptativo (1 col celular, 2 cols tablet, 4 cols desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* KPI 1: Saldo Disponível com Barra de Progresso */}
        <div className="bg-[#0D0E12] border border-emerald-500/30 rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase">Saldo Disponível</span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-mono break-all">
              R$ {balanceInReais}
            </div>
            {/* Barra de Progresso até R$ 50,00 */}
            <div className="mt-2.5 space-y-1">
              <div className="w-full bg-[#13141B] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressToPayout}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block font-mono truncate">
                {rawBalanceCents >= 5000
                  ? "Liberado para saque Pix imediato"
                  : `${progressToPayout}% para saque mínimo (R$ 50,00)`}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Faturado Histórico */}
        <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase">Total Ganho</span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono break-all">
              R$ {totalEarningsInReais}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block truncate">
              Acumulado histórico consolidado
            </span>
          </div>
        </div>

        {/* KPI 3: Indicados & Conversões */}
        <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase">Total Indicados</span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {stats?.totalReferrals || 0}
            </div>
            <span className="text-[11px] text-cyan-400 font-medium mt-1 block truncate">
              {stats?.convertedReferrals || 0} compras ({stats?.totalReferrals ? Math.round(((stats.convertedReferrals || 0) / stats.totalReferrals) * 100) : 0}% conv.)
            </span>
          </div>
        </div>

        {/* KPI 4: Taxa de Comissão Ativa */}
        <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase">Sua Comissão</span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight font-mono">
              {commissionPercent}%
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block truncate">
              Recorrente em todas as recargas
            </span>
          </div>
        </div>
      </div>

      {/* Hub de Compartilhamento de Link & Código (100% Adaptativo) */}
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 font-heading">
              <Share2 className="w-5 h-5 text-emerald-400 shrink-0" />
              Seu Link & Código de Indicação
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Envie este link para qualquer pessoa. Atribuição de cookies segura com validade de 30 dias.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setNewCustomCode(stats?.profile?.customCode || "");
              setIsEditCodeModalOpen(true);
            }}
            style={{ minHeight: "44px" }}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#13141B] hover:bg-[#1E202E] text-slate-300 border border-[#1E202E] transition-all cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Personalizar Código</span>
          </button>
        </div>

        {/* Barra do Link: Quebra em Coluna no Mobile e Linha no Desktop */}
        <div className="flex flex-col md:flex-row items-stretch gap-2.5">
          <div
            style={{ minHeight: "48px" }}
            className="flex-1 bg-[#070709] border border-[#1E202E] rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300 font-mono overflow-hidden"
          >
            <span className="truncate select-all">{referralLink}</span>
            <span className="text-[10px] font-sans font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 shrink-0 self-start sm:self-auto">
              Código: {activeCode}
            </span>
          </div>

          {/* Botões de Ação com Touch Target Mínimo de 48px */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              style={{ minHeight: "48px" }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Copiado!" : "Copiar Link"}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCode}
              title="Copiar apenas o código"
              style={{ minHeight: "48px" }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#13141B] hover:bg-[#1E202E] text-slate-300 border border-[#1E202E] text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="sm:hidden">Copiar Código</span>
            </button>
          </div>
        </div>

        {/* Atalhos Rápidos para Redes Sociais */}
        <div className="flex items-center gap-2.5 pt-1 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Compartilhar direto:</span>
          <button
            type="button"
            onClick={handleShareWhatsApp}
            style={{ minHeight: "44px" }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 text-xs font-bold transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleShareTelegram}
            style={{ minHeight: "44px" }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/30 text-xs font-bold transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Telegram</span>
          </button>
        </div>
      </div>

      {/* Simulador Interativo de Comissões */}
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-5 sm:p-8 shadow-2xl space-y-4 sm:space-y-5">
        <div className="flex items-center gap-2 text-violet-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Calculator className="w-4 h-4 text-emerald-400" />
          Projeção Financeira
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-lg sm:text-2xl font-bold text-white font-heading">
              Simulador de Ganhos Mensais
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Arraste a barra para projetar quanto você pode faturar por mês recomendando o VORIXA para sua audiência (estimativa baseada no pacote médio de R$ 79,90).
            </p>

            <div className="pt-3 space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">Criadores Ativos Recomendados:</span>
                <span className="text-emerald-400 text-sm">{simulatedReferrals} pessoas / mês</span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={simulatedReferrals}
                onChange={(e) => setSimulatedReferrals(parseInt(e.target.value))}
                className="w-full h-2 bg-[#13141B] rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 criadores</span>
                <span>100 criadores</span>
                <span>200 criadores</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#070709] border border-emerald-500/20 p-5 sm:p-6 flex flex-col items-center justify-center text-center min-w-[220px]">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              Estimativa Mensal
            </span>
            <span className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
              R$ {estimatedMonthly.toLocaleString("pt-BR")}
            </span>
            <span className="text-[11px] text-slate-500 font-mono mt-1 sm:mt-2">
              ≈ R$ {estimatedYearly.toLocaleString("pt-BR")} / ano
            </span>
          </div>
        </div>
      </div>

      {/* Histórico Financeiro: Abas de Comissões e Saques Pix em Cards Empilháveis */}
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-[#1E202E] pb-4 flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab("commissions")}
              style={{ minHeight: "44px" }}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "commissions"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Indicações & Comissões ({commissions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("payouts")}
              style={{ minHeight: "44px" }}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "payouts"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Histórico de Saques Pix ({payouts.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              fetchStats();
              fetchHistory();
            }}
            style={{ minHeight: "44px" }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer px-3 py-2 rounded-xl hover:bg-[#13141B]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Aba 1: Comissões em Cards Empilháveis Adaptativos */}
        {activeTab === "commissions" && (
          <div>
            {isLoadingHistory ? (
              <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Carregando conversões...</span>
              </div>
            ) : commissions.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-300 font-heading">Nenhuma compra realizada ainda</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Envie seu link de indicação para amigos e comunidades para começar a receber comissões instantâneas.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {commissions.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#070709]/80 border border-[#1E202E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">
                          Compra de Pacote ({((comm.purchaseAmountCents || 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {new Date(comm.createdAt).toLocaleString("pt-BR")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E202E]/60">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {comm.status === "APPROVED" ? "Aprovada" : "Estornada"}
                      </span>
                      <div className="text-sm font-black text-emerald-400 font-mono">
                        + {((comm.commissionAmountCents || 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Aba 2: Saques Pix em Cards Empilháveis Adaptativos */}
        {activeTab === "payouts" && (
          <div>
            {isLoadingHistory ? (
              <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Carregando saques...</span>
              </div>
            ) : payouts.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Wallet className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-300 font-heading">Nenhum saque solicitado</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Assim que acumular R$ 50,00 em comissões, você poderá solicitar o resgate via Pix.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#070709]/80 border border-[#1E202E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${
                        payout.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : payout.status === "REJECTED"
                          ? "bg-rose-500/10 text-rose-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {payout.status === "PAID" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : payout.status === "REJECTED" ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">
                          Saque Pix ({payout.pixKeyType}: {payout.pixKey})
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          Solicitado em {new Date(payout.requestedAt).toLocaleString("pt-BR")}
                        </div>
                        {payout.adminNotes && (
                          <div className="text-[11px] text-slate-400 mt-1 italic truncate">
                            Nota: {payout.adminNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E202E]/60">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        payout.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : payout.status === "REJECTED"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {payout.status === "PAID"
                          ? "Transferido ✅"
                          : payout.status === "REJECTED"
                          ? "Recusado ❌"
                          : "Em Análise ⏳"}
                      </span>
                      <div className="text-sm font-black text-white font-mono">
                        {((payout.amountCents || 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal 1: Personalizar Código (Mobile Full-Screen Resiliente) */}
      {isEditCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
          <div className="bg-[#0D0E12] border-0 sm:border border-[#1E202E] rounded-none sm:rounded-3xl p-5 sm:p-7 w-full max-w-md shadow-2xl space-y-5 max-h-none sm:max-h-[90vh] overflow-y-auto overscroll-contain">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">Personalizar Código de Indicação</h3>
              <p className="text-xs text-slate-400 mt-1">
                Escolha um código exclusivo para sua marca ou nome. Ele substituirá o código padrão no seu link de indicação.
              </p>
            </div>

            <form onSubmit={handleUpdateCustomCode} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 font-mono uppercase">Novo Código</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: SEUNOME, PRO-CRIADOR"
                  value={newCustomCode}
                  onChange={(e) => setNewCustomCode(e.target.value.toUpperCase())}
                  style={{ minHeight: "48px" }}
                  className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs text-white uppercase font-mono placeholder-slate-600 focus:border-emerald-500 outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                  3 a 20 caracteres (letras, números, hífen e underline).
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditCodeModalOpen(false)}
                  style={{ minHeight: "48px" }}
                  className="flex-1 py-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-slate-300 text-xs font-bold border border-[#1E202E] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingCode || !newCustomCode.trim()}
                  style={{ minHeight: "48px" }}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  {isUpdatingCode ? "Salvando..." : "Salvar Código"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Solicitar Saque Pix (Mobile Full-Screen Resiliente) */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in">
          <div className="bg-[#0D0E12] border-0 sm:border border-[#1E202E] rounded-none sm:rounded-3xl p-5 sm:p-7 w-full max-w-md shadow-2xl space-y-5 max-h-none sm:max-h-[92vh] overflow-y-auto overscroll-contain">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">Solicitar Saque via Pix</h3>
              <p className="text-xs text-slate-400 mt-1">
                Saldo disponível: <strong className="text-emerald-400 font-mono">R$ {balanceInReais}</strong>
              </p>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 font-mono uppercase">Tipo de Chave Pix</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["CPF", "EMAIL", "PHONE", "CNPJ", "RANDOM"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPixKeyType(type)}
                      style={{ minHeight: "44px" }}
                      className={`py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        pixKeyType === type
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/40"
                          : "bg-[#13141B] text-slate-400 border-[#1E202E] hover:text-white"
                      }`}
                    >
                      {type === "PHONE" ? "Telefone" : type === "RANDOM" ? "Aleatória" : type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 font-mono uppercase">Sua Chave Pix</label>
                <input
                  type="text"
                  required
                  placeholder="Digite sua chave Pix"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  style={{ minHeight: "48px" }}
                  className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:border-emerald-500 outline-none font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase">Valor do Saque (R$)</label>
                  <button
                    type="button"
                    onClick={() => setPayoutAmount(((stats?.profile?.balanceCents || 0) / 100).toFixed(2))}
                    style={{ minHeight: "44px" }}
                    className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer flex items-center"
                  >
                    Sacar Tudo
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ex: 50.00"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  style={{ minHeight: "48px" }}
                  className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:border-emerald-500 outline-none font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Valor mínimo: R$ 50,00. As transferências são processadas em até 24h úteis.
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  style={{ minHeight: "48px" }}
                  className="flex-1 py-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-slate-300 text-xs font-bold border border-[#1E202E] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayout || !payoutAmount || !pixKey}
                  style={{ minHeight: "48px" }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  {isSubmittingPayout ? "Enviando..." : "Confirmar Saque"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
