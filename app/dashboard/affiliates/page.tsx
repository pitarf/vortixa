"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Share2,
  Copy,
  Check,
  Coins,
  TrendingUp,
  Users,
  Wallet,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Send,
  Edit3,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  DollarSign,
  RefreshCw,
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
      toast.success("Link de indicação copiado para a área de transferência!");
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
      `Crie imagens e vídeos ultra-realistas com inteligência artificial no VORIXA! Use meu link para se cadastrar e ganhar bônus de boas-vindas: ${referralLink}`
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
    if (!newCustomCode.trim()) {
      toast.error("Digite o código desejado.");
      return;
    }

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

      // Primeiro salva a chave Pix
      await fetch("/api/affiliates/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pixKey: pixKey.trim(), pixKeyType }),
      });

      // Em seguida dispara o saque
      const res = await fetch("/api/affiliates/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao solicitar saque.");
      }

      toast.success(data.message || "Solicitação de saque enviada!");
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

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header com Banner Gradiente */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-[#0D0E12] to-cyan-950/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              PROGRAMA DE AFILIADOS OFICIAL
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading">
              Indique Amigos e Ganhe <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">{commissionPercent}% de Comissão</span> em Dinheiro
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Compartilhe seu link exclusivo com criadores, agências e amigos. Sempre que alguém se cadastrar e comprar créditos, você recebe {commissionPercent}% do valor da compra diretamente na sua carteira Pix.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch md:items-center">
            <button
              onClick={() => setIsPayoutModalOpen(true)}
              disabled={(stats?.profile?.balanceCents || 0) < 5000}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer min-h-[44px]"
            >
              <Wallet className="w-4 h-4" />
              <span>Solicitar Saque Pix</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de 4 KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Saldo Disponível */}
        <div className="bg-[#0D0E12] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Saldo Disponível</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-3xl font-black text-emerald-400 tracking-tight font-heading">
              R$ {balanceInReais}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Mínimo para saque: R$ 50,00</span>
          </div>
        </div>

        {/* KPI 2: Total Histórico Ganho */}
        <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Faturado</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-3xl font-black text-white tracking-tight font-heading">
              R$ {totalEarningsInReais}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Acumulado desde o início</span>
          </div>
        </div>

        {/* KPI 3: Amigos Indicados */}
        <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total de Indicados</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-3xl font-black text-white tracking-tight font-heading">
              {stats?.totalReferrals || 0}
            </div>
            <span className="text-[11px] text-cyan-400 font-medium mt-1 block">
              {stats?.convertedReferrals || 0} com compras realizadas
            </span>
          </div>
        </div>

        {/* KPI 4: Sua Taxa de Comissão */}
        <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Sua Comissão</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-3xl font-black text-amber-300 tracking-tight font-heading">
              {commissionPercent}%
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Em todas as compras</span>
          </div>
        </div>
      </div>

      {/* Card de Compartilhamento do Link e Código */}
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 font-heading">
              <Share2 className="w-5 h-5 text-emerald-400" />
              Seu Link & Código de Indicação
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Envie este link para qualquer pessoa. Nós cuidamos da atribuição automática nos próximos 30 dias.
            </p>
          </div>

          <button
            onClick={() => {
              setNewCustomCode(stats?.profile?.customCode || "");
              setIsEditCodeModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-[#13141B] hover:bg-[#1E202E] text-slate-300 border border-[#1E202E] transition-all cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Personalizar Código</span>
          </button>
        </div>

        {/* Barra do Link com Botão de Cópia */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="flex-1 bg-[#070709] border border-[#1E202E] rounded-2xl px-4 py-3 flex items-center justify-between gap-3 text-xs text-slate-300 font-mono overflow-x-auto">
            <span className="truncate">{referralLink}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-sans font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                Código: {activeCode}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-600/20 min-h-[44px]"
            >
              {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Copiado!" : "Copiar Link"}</span>
            </button>

            <button
              onClick={handleCopyCode}
              title="Copiar apenas o código"
              className="px-4 py-3 rounded-2xl bg-[#13141B] hover:bg-[#1E202E] text-slate-300 border border-[#1E202E] text-xs font-bold transition-all active:scale-95 cursor-pointer min-h-[44px]"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Botões de Compartilhamento Rápido em Redes */}
        <div className="flex items-center gap-3 pt-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Compartilhar direto:</span>
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 text-xs font-bold transition-all cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleShareTelegram}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/30 text-xs font-bold transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </button>
        </div>
      </div>

      {/* Seção com Abas de Histórico */}
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#1E202E] pb-4 flex-wrap gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("commissions")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "commissions"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Indicações & Comissões ({commissions.length})
            </button>
            <button
              onClick={() => setActiveTab("payouts")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "payouts"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Histórico de Saques Pix ({payouts.length})
            </button>
          </div>

          <button
            onClick={() => {
              fetchStats();
              fetchHistory();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Aba 1: Comissões */}
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
                <p className="text-sm font-bold text-slate-300">Nenhuma compra realizada ainda</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Envie seu link de indicação para amigos e comunidades para começar a receber comissões instantâneas.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#1E202E]">
                {commissions.map((comm) => (
                  <div
                    key={comm.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          Compra de Pacote ({((comm.purchaseAmountCents || 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(comm.createdAt).toLocaleString("pt-BR")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {comm.status === "APPROVED" ? "Aprovada" : "Estornada"}
                        </span>
                        <div className="text-sm font-black text-emerald-400 mt-1 font-heading">
                          + {((comm.commissionAmountCents || 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Aba 2: Saques */}
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
                <p className="text-sm font-bold text-slate-300">Nenhum saque solicitado</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Assim que acumular R$ 50,00 em comissões, você poderá solicitar o resgate via Pix.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#1E202E]">
                {payouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${
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
                      <div>
                        <div className="font-bold text-white">
                          Saque Pix ({payout.pixKeyType}: {payout.pixKey})
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Solicitado em {new Date(payout.requestedAt).toLocaleString("pt-BR")}
                        </div>
                        {payout.adminNotes && (
                          <div className="text-[11px] text-slate-400 mt-1 italic">
                            Nota: {payout.adminNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      <div className="text-right">
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
                        <div className="text-sm font-black text-white mt-1 font-heading">
                          {((payout.amountCents || 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal 1: Personalizar Código */}
      {isEditCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white font-heading">Personalizar Código de Indicação</h3>
              <p className="text-xs text-slate-400 mt-1">
                Escolha um código exclusivo para sua marca ou nome. Ele substituirá o código padrão no seu link.
              </p>
            </div>

            <form onSubmit={handleUpdateCustomCode} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Novo Código</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: SEUNOME, PRO-CRIADOR"
                  value={newCustomCode}
                  onChange={(e) => setNewCustomCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs text-white uppercase font-mono placeholder-slate-600 focus:border-emerald-500 outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  3 a 20 caracteres (somente letras, números, hífen e underline).
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditCodeModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-slate-300 text-xs font-bold border border-[#1E202E] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingCode || !newCustomCode.trim()}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  {isUpdatingCode ? "Salvando..." : "Salvar Código"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Solicitar Saque Pix */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white font-heading">Solicitar Saque via Pix</h3>
              <p className="text-xs text-slate-400 mt-1">
                Saldo disponível: <strong className="text-emerald-400">R$ {balanceInReais}</strong>
              </p>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Tipo de Chave Pix</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["CPF", "EMAIL", "PHONE", "CNPJ", "RANDOM"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPixKeyType(type)}
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
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Sua Chave Pix</label>
                <input
                  type="text"
                  required
                  placeholder="Digite sua chave Pix"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">Valor do Saque (R$)</label>
                  <button
                    type="button"
                    onClick={() => setPayoutAmount(((stats?.profile?.balanceCents || 0) / 100).toFixed(2))}
                    className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer"
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
                  className="flex-1 py-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-slate-300 text-xs font-bold border border-[#1E202E] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayout || !payoutAmount || !pixKey}
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
