"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Layers, 
  TrendingUp, 
  RefreshCw, 
  Globe, 
  Sliders, 
  CheckCircle2,
  Clock,
  Sparkles,
  ScrollText,
  Layers2,
  LayoutDashboard,
  UserCog,
  MinusCircle,
  PlusCircle,
  Ban,
  Search,
  Trash2,
  UserCheck,
  Coins
} from "lucide-react";
import { toast } from "sonner";
import { TimePeriod, ExecutiveDashboardStats } from "@/services/admin-dashboard.service";
import { AdminDateFilter } from "@/components/admin/AdminDateFilter";
import { AdminAnalyticsCharts } from "@/components/admin/AdminAnalyticsCharts";
import { AdminTopServicesTable } from "@/components/admin/AdminTopServicesTable";
import { AdminUsersLeaderboard } from "@/components/admin/AdminUsersLeaderboard";
import { AdminLogsViewer } from "@/components/admin/logs/AdminLogsViewer";
import { AdminServicesCatalog } from "@/components/admin/services/AdminServicesCatalog";
import { AdminUsersTable } from "@/components/admin/users/AdminUsersTable";
import { AdminModelsManager } from "@/components/admin/models/AdminModelsManager";
import { AdminAffiliatesManager } from "@/components/admin/affiliates/AdminAffiliatesManager";

interface BrandingData {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  faviconUrl: string;
  ogImageUrl: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<ExecutiveDashboardStats | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<TimePeriod>("today");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [branding, setBranding] = useState<BrandingData>({
    siteTitle: "",
    siteDescription: "",
    siteKeywords: "",
    faviconUrl: "",
    ogImageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingBranding, setSavingBranding] = useState(false);
  const [adjustingCredits, setAdjustingCredits] = useState(false);

  // Form de ajuste manual de crédito e controle de acesso
  const [targetUserId, setTargetUserId] = useState("");
  const [adjustmentMode, setAdjustmentMode] = useState<"add" | "deduct" | "zero">("add");
  const [creditsAmount, setCreditsAmount] = useState<number>(100);
  const [reason, setReason] = useState("");
  const [searchedUser, setSearchedUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    isUnlimited: boolean;
    balance: number;
    totalSpentBrl?: number;
    totalPaidCount?: number;
    createdAt: string;
  } | null>(null);
  const [searchingUser, setSearchingUser] = useState(false);
  const [togglingBlock, setTogglingBlock] = useState(false);

  // Aba principal do Painel Admin
  const [mainTab, setMainTab] = useState<"overview" | "services" | "users" | "logs" | "models" | "affiliates">("overview");

  // Aba móvel ativa para a seção de configurações inferiores
  const [activeConfigTab, setActiveConfigTab] = useState<"adjust" | "branding">("adjust");
  const creditFormRef = React.useRef<HTMLDivElement>(null);

  const fetchStats = async (periodToFetch = currentPeriod, start = customStartDate, end = customEndDate) => {
    try {
      setRefreshing(true);
      let url = `/api/admin/stats?period=${periodToFetch}`;
      if (periodToFetch === "custom" && start && end) {
        url += `&startDate=${start}&endDate=${end}`;
      }

      const res = await fetch(url);

      if (res.status === 401 || res.status === 403) {
        toast.error("Acesso restrito. Apenas administradores podem visualizar esta página.");
        router.replace("/dashboard");
        return;
      }

      if (res.ok) {
        const json = await res.json();
        setStats(json);
      } else {
        toast.error("Erro ao carregar estatísticas do painel executivo.");
      }
    } catch (err: any) {
      toast.error("Erro de conexão ao carregar estatísticas.");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const fetchBranding = async () => {
    try {
      const res = await fetch("/api/admin/branding");
      if (res.ok) {
        const json = await res.json();
        setBranding(json);
      }
    } catch (e) {
      console.warn("Aviso ao carregar branding:", e);
    }
  };

  useEffect(() => {
    fetchStats("today");
    fetchBranding();
  }, []);

  const handlePeriodChange = (period: TimePeriod) => {
    setCurrentPeriod(period);
    fetchStats(period);
  };

  const handleCustomDatesChange = (start: string, end: string) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
  };

  const handleApplyCustomFilter = () => {
    if (!customStartDate || !customEndDate) {
      toast.error("Selecione a data de início e término.");
      return;
    }
    setCurrentPeriod("custom");
    fetchStats("custom", customStartDate, customEndDate);
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingBranding(true);
      const res = await fetch("/api/admin/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branding),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(json.message || "Configurações salvas com sucesso!");
      } else {
        toast.error(json.error || "Erro ao salvar configurações de branding.");
      }
    } catch (err: any) {
      toast.error("Erro de conexão ao salvar branding.");
    } finally {
      setSavingBranding(false);
    }
  };

  const handleLookupUser = async (query = targetUserId) => {
    const q = query.trim();
    if (!q || q.length < 2) {
      setSearchedUser(null);
      return;
    }
    try {
      setSearchingUser(true);
      const res = await fetch(`/api/admin/users/lookup?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (res.ok && json.found && json.user) {
        setSearchedUser(json.user);
      } else {
        setSearchedUser(null);
      }
    } catch {
      // silencioso
    } finally {
      setSearchingUser(false);
    }
  };

  const handleToggleBlockUser = async () => {
    if (!searchedUser) return;
    const nextBlocked = !searchedUser.isBlocked;
    const actionWord = nextBlocked ? "BANIR / BLOQUEAR da IA" : "DESBLOQUEAR e liberar acesso à IA";
    
    if (!window.confirm(`Confirma ${actionWord} para o usuário ${searchedUser.email}?`)) {
      return;
    }

    try {
      setTogglingBlock(true);
      const res = await fetch(`/api/admin/users/${searchedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: nextBlocked }),
      });
      const json = await res.json();
      if (res.ok) {
        setSearchedUser({ ...searchedUser, isBlocked: nextBlocked });
        toast.success(nextBlocked ? "Usuário banido/bloqueado da IA com sucesso!" : "Acesso à IA liberado!");
        fetchStats(currentPeriod);
      } else {
        toast.error(json.error || "Erro ao alterar status de acesso.");
      }
    } catch {
      toast.error("Erro de conexão ao alterar status do usuário.");
    } finally {
      setTogglingBlock(false);
    }
  };

  const handleAdjustCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTarget = targetUserId.trim();
    if (!cleanTarget) {
      toast.error("Informe o ID ou e-mail do usuário de destino.");
      return;
    }

    if (adjustmentMode !== "zero" && (!creditsAmount || creditsAmount <= 0)) {
      toast.error("Informe uma quantidade de créditos válida maior que zero.");
      return;
    }

    try {
      setAdjustingCredits(true);
      const idempotencyKey = `adm_adj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const payload: any = {
        targetUserId: cleanTarget,
        idempotencyKey,
        reason: reason.trim() || undefined,
      };

      if (adjustmentMode === "zero") {
        payload.action = "ZERO";
      } else if (adjustmentMode === "deduct") {
        payload.creditsAmount = -Math.abs(Number(creditsAmount));
      } else {
        payload.creditsAmount = Math.abs(Number(creditsAmount));
      }

      const res = await fetch("/api/admin/adjust-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(json.message || "Créditos ajustados com sucesso!");
        if (json.newBalance !== undefined && searchedUser) {
          setSearchedUser({ ...searchedUser, balance: json.newBalance });
        } else {
          handleLookupUser(cleanTarget);
        }
        setReason("");
        fetchStats(currentPeriod);
      } else {
        toast.error(json.error || "Erro ao efetuar ajuste de créditos.");
      }
    } catch (err: any) {
      toast.error("Erro de rede ao ajustar créditos.");
    } finally {
      setAdjustingCredits(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
          <p className="text-slate-400 text-sm">Carregando painel executivo e métricas do VORTIXIA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 px-1 sm:px-0">
      {/* Header com Status Administrativo e Ação de Atualização */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E202E] pb-6">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            Módulo Executivo & Controle Financeiro
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-heading">
            Dashboard Administrativo Geral
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Visão 360º de faturamento, margem de lucro, custos de API, top serviços e auditoria de usuários.
          </p>
        </div>

        <button
          onClick={() => fetchStats(currentPeriod)}
          disabled={refreshing}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D0E12] hover:bg-[#13141B] text-slate-200 text-xs font-semibold transition-all border border-[#1E202E] disabled:opacity-50 min-h-[44px] touch-manipulation active:scale-95 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-violet-400" : ""}`} />
          <span>{refreshing ? "Atualizando..." : "Atualizar Métricas"}</span>
        </button>
      </div>

      {/* Abas Principais de Navegação do Painel (Scroll horizontal suave com touch targets confortáveis) */}
      <div className="flex items-center gap-2 border-b border-[#1E202E] pb-2 overflow-x-auto no-scrollbar scrollbar-none snap-x">
        <button
          type="button"
          onClick={() => setMainTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[44px] touch-manipulation snap-start cursor-pointer ${
            mainTab === "overview"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "bg-[#0D0E12] text-slate-400 hover:text-white hover:bg-[#13141B] border border-[#1E202E]"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Visão Geral & Métricas</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab("services")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[44px] touch-manipulation snap-start cursor-pointer ${
            mainTab === "services"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "bg-[#0D0E12] text-slate-400 hover:text-white hover:bg-[#13141B] border border-[#1E202E]"
          }`}
        >
          <Layers2 className="h-4 w-4 text-cyan-400" />
          <span>Catálogo de Serviços</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[44px] touch-manipulation snap-start cursor-pointer ${
            mainTab === "users"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "bg-[#0D0E12] text-slate-400 hover:text-white hover:bg-[#13141B] border border-[#1E202E]"
          }`}
        >
          <UserCog className="h-4 w-4 text-emerald-400" />
          <span>Gestão de Usuários</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab("models")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[44px] touch-manipulation snap-start cursor-pointer ${
            mainTab === "models"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "bg-[#0D0E12] text-slate-400 hover:text-white hover:bg-[#13141B] border border-[#1E202E]"
          }`}
        >
          <Sparkles className="h-4 w-4 text-violet-400" />
          <span>Vitrine de Modelos</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab("affiliates")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[44px] touch-manipulation snap-start cursor-pointer ${
            mainTab === "affiliates"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "bg-[#0D0E12] text-slate-400 hover:text-white hover:bg-[#13141B] border border-[#1E202E]"
          }`}
        >
          <Users className="h-4 w-4 text-emerald-400" />
          <span>Afiliados & Saques</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab("logs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[44px] touch-manipulation snap-start cursor-pointer ${
            mainTab === "logs"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "bg-[#0D0E12] text-slate-400 hover:text-white hover:bg-[#13141B] border border-[#1E202E]"
          }`}
        >
          <ScrollText className="h-4 w-4 text-amber-400" />
          <span>Logs do Sistema</span>
        </button>
      </div>

      {mainTab === "affiliates" ? (
        <AdminAffiliatesManager />
      ) : mainTab === "models" ? (
        <AdminModelsManager />
      ) : mainTab === "users" ? (
        <AdminUsersTable />
      ) : mainTab === "services" ? (
        <AdminServicesCatalog />
      ) : mainTab === "logs" ? (
        <AdminLogsViewer />
      ) : (
        <>
          {/* Barra de Filtros Temporais */}
          <AdminDateFilter
            currentPeriod={currentPeriod}
            onPeriodChange={handlePeriodChange}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomDatesChange={handleCustomDatesChange}
            onApplyCustomFilter={handleApplyCustomFilter}
            loading={refreshing}
          />

          {/* Destaques do Dia Atual (Hoje em Tempo Real) */}
          {stats && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#0D0E12] to-[#070709] border border-violet-900/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 border-b border-[#1E202E] pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-300 uppercase tracking-wider">
                  <Clock className="h-4 w-4 text-violet-400" />
                  Desempenho de Hoje (Tempo Real)
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Atualizado em minutos
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
                <div className="bg-[#070709] p-2.5 rounded-xl border border-[#1E202E]">
                  <span className="text-[10px] text-slate-400 font-medium block">Entrou Hoje</span>
                  <div className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5 truncate font-mono">
                    R$ {stats.todayStats.revenueBrl.toFixed(2)}
                  </div>
                </div>

                <div className="bg-[#070709] p-2.5 rounded-xl border border-[#1E202E]">
                  <span className="text-[10px] text-slate-400 font-medium block">Lucro Líquido</span>
                  <div className="text-xs sm:text-sm font-black text-violet-400 mt-0.5 truncate font-mono">
                    R$ {stats.todayStats.profitBrl.toFixed(2)}
                  </div>
                </div>

                <div className="bg-[#070709] p-2.5 rounded-xl border border-[#1E202E]">
                  <span className="text-[10px] text-slate-400 font-medium block">Gasto com API</span>
                  <div className="text-xs sm:text-sm font-black text-amber-400 font-mono mt-0.5 truncate">
                    ${stats.todayStats.apiCostUsd.toFixed(2)}
                  </div>
                </div>

                <div className="bg-[#070709] p-2.5 rounded-xl border border-[#1E202E]">
                  <span className="text-[10px] text-slate-400 font-medium block">Novos Cadastros</span>
                  <div className="text-xs sm:text-sm font-black text-cyan-400 mt-0.5 truncate font-mono">
                    +{stats.todayStats.signups}
                  </div>
                </div>

                <div className="bg-[#070709] p-2.5 rounded-xl border border-[#1E202E]">
                  <span className="text-[10px] text-slate-400 font-medium block">Mídias Geradas</span>
                  <div className="text-xs sm:text-sm font-black text-fuchsia-400 mt-0.5 truncate font-mono">
                    {stats.todayStats.generations}
                  </div>
                </div>

                <div className="bg-[#070709] p-2.5 rounded-xl border border-[#1E202E]">
                  <span className="text-[10px] text-slate-400 font-medium block">Créditos Gastos</span>
                  <div className="text-xs sm:text-sm font-black text-rose-400 mt-0.5 truncate font-mono">
                    {stats.todayStats.creditsConsumed.toLocaleString("pt-BR")} cr
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cards de Métricas e Indicadores Consolidados do Período */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Receita Faturada */}
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Receita no Período</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">
                  {stats ? `R$ ${stats.revenueBrl.toFixed(2).replace(".", ",")}` : "R$ 0,00"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                {stats?.creditsSold.toLocaleString("pt-BR") || 0} créditos vendidos
              </p>
            </div>

            {/* Lucro Líquido Estimado */}
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Lucro Líquido Estimado</span>
                <div className="h-8 w-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">
                  {stats ? `R$ ${stats.profitBrl.toFixed(2).replace(".", ",")}` : "R$ 0,00"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Margem estimada de {stats?.marginPercent || 0}%
              </p>
            </div>

            {/* Custo Agregado de API */}
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Custo de Infraestrutura</span>
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Layers className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">
                  ${stats?.apiCostUsd.toFixed(2) || "0.00"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Consumo: {stats?.creditsConsumed.toLocaleString("pt-BR") || 0} créditos
              </p>
            </div>

            {/* Novos Cadastros */}
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Cadastros no Período</span>
                <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">
                  +{stats?.newSignups || 0}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Base total: {stats?.totalUsersCount || 0} usuários
              </p>
            </div>
          </div>

          {/* Gráficos Interativos Dinâmicos com SVG Responsivo sem corte */}
          {stats && (
            <AdminAnalyticsCharts
              data={stats.timeSeries}
              xAxisType={stats.xAxisType}
            />
          )}

          {/* Grid de Seções: Top Serviços & Ranking de Usuários com Cards no Mobile */}
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <AdminTopServicesTable services={stats.topServices} />
              <AdminUsersLeaderboard
                topByBalance={stats.topUsersByBalance}
                topByConsumption={stats.topUsersByConsumption}
                topByPaid={stats.topUsersByPaid}
                onSelectUserForAdjustment={(userId) => {
                  setTargetUserId(userId);
                  setActiveConfigTab("adjust");
                  setTimeout(() => {
                    creditFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 50);
                }}
              />
            </div>
          )}

          {/* Seletor Mobile de Abas para Configurações (Thumb-friendly) */}
          <div className="lg:hidden flex items-center bg-[#0D0E12] p-1 rounded-2xl border border-[#1E202E] gap-1 shadow-lg">
            <button
              type="button"
              onClick={() => setActiveConfigTab("adjust")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all min-h-[44px] touch-manipulation active:scale-95 cursor-pointer ${
                activeConfigTab === "adjust"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span>Ajustar Créditos</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveConfigTab("branding")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all min-h-[44px] touch-manipulation active:scale-95 cursor-pointer ${
                activeConfigTab === "branding"
                  ? "bg-violet-500 text-white shadow-md shadow-violet-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>Branding & SEO</span>
            </button>
          </div>

          {/* Grid Secundário: Branding & SEO + Ajuste de Créditos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Painel de Branding e SEO Dinâmico */}
            <div className={`bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-6 ${
              activeConfigTab === "branding" ? "block" : "hidden lg:block"
            }`}>
              <div className="flex items-center gap-2 text-white font-bold text-base mb-1 font-heading">
                <Globe className="h-5 w-5 text-violet-400" />
                Configuração de Branding & SEO
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Altere dinamicamente o título, favicon e meta tags de compartilhamento indexadas pelo Google.
              </p>

              <form onSubmit={handleSaveBranding} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Título da Aplicação (siteTitle)
                  </label>
                  <input
                    type="text"
                    value={branding.siteTitle}
                    onChange={(e) => setBranding({ ...branding, siteTitle: e.target.value })}
                    className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors min-h-[48px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Descrição de Busca (siteDescription)
                  </label>
                  <textarea
                    value={branding.siteDescription}
                    onChange={(e) => setBranding({ ...branding, siteDescription: e.target.value })}
                    rows={2}
                    className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none min-h-[64px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Palavras-chave (siteKeywords)
                  </label>
                  <input
                    type="text"
                    value={branding.siteKeywords}
                    onChange={(e) => setBranding({ ...branding, siteKeywords: e.target.value })}
                    className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors min-h-[48px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Favicon URL (faviconUrl)
                    </label>
                    <input
                      type="text"
                      value={branding.faviconUrl}
                      onChange={(e) => setBranding({ ...branding, faviconUrl: e.target.value })}
                      className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors min-h-[48px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      OG Preview Image URL (ogImageUrl)
                    </label>
                    <input
                      type="text"
                      value={branding.ogImageUrl}
                      onChange={(e) => setBranding({ ...branding, ogImageUrl: e.target.value })}
                      className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors min-h-[48px]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingBranding}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/20 disabled:opacity-50 min-h-[48px] touch-manipulation active:scale-95 cursor-pointer"
                >
                  {savingBranding ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {savingBranding ? "Gravando Configurações..." : "Salvar Configurações de Branding"}
                </button>
              </form>
            </div>

            {/* Ajuste Manual de Saldo com Idempotência e Banimento da IA */}
            <div 
              ref={creditFormRef}
              className={`bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-6 flex flex-col justify-between ${
                activeConfigTab === "adjust" ? "block" : "hidden lg:flex"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-white font-bold text-base font-heading">
                    <Sliders className="h-5 w-5 text-cyan-400" />
                    Ajuste de Créditos & Acesso à IA
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                    Ledger Seguro
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Adicione, retire créditos ou suspenda o acesso do usuário à IA sem complicação no celular.
                </p>

                {/* Seletor Tátil de Operação (+ / - / Zerar) */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#070709] border border-[#1E202E] rounded-xl mb-4">
                  <button
                    type="button"
                    onClick={() => setAdjustmentMode("add")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                      adjustmentMode === "add"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Adicionar (+)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustmentMode("deduct")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                      adjustmentMode === "deduct"
                        ? "bg-rose-600 text-white shadow-md shadow-rose-900/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <MinusCircle className="h-3.5 w-3.5" />
                    <span>Tirar / Reduzir (-)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustmentMode("zero")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                      adjustmentMode === "zero"
                        ? "bg-amber-600 text-white shadow-md shadow-amber-900/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Zerar Saldo</span>
                  </button>
                </div>

                <form onSubmit={handleAdjustCredits} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Usuário Destino (ID ou E-mail)
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={targetUserId}
                        onChange={(e) => {
                          setTargetUserId(e.target.value);
                          if (e.target.value.trim().length >= 3) {
                            handleLookupUser(e.target.value);
                          } else {
                            setSearchedUser(null);
                          }
                        }}
                        onBlur={() => handleLookupUser()}
                        placeholder="Cole o ID ou digite o e-mail do usuário..."
                        className="w-full bg-[#070709] border border-[#1E202E] rounded-xl pl-4 pr-11 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono min-h-[48px]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleLookupUser()}
                        disabled={searchingUser || !targetUserId.trim()}
                        className="absolute right-2 p-2 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                        title="Buscar usuário"
                      >
                        {searchingUser ? (
                          <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card de Preview do Usuário Localizado */}
                  {searchedUser && (
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 animate-in fade-in duration-200">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {searchedUser.name || "Sem nome cadastrado"}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono truncate">
                            {searchedUser.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-right shrink-0">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Total Gasto (R$)</span>
                            <span className="text-xs font-black text-emerald-400 font-mono">
                              R$ {(searchedUser.totalSpentBrl ?? 0).toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Saldo Atual</span>
                            <span className="text-xs font-black text-cyan-300 font-mono">
                              {searchedUser.balance} cr
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
                        <div className="flex items-center gap-1.5">
                          {searchedUser.isBlocked ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              <Ban className="h-3 w-3" /> Banido da IA
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <UserCheck className="h-3 w-3" /> IA Liberada
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleToggleBlockUser}
                          disabled={togglingBlock}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 min-h-[36px] cursor-pointer active:scale-95 ${
                            searchedUser.isBlocked
                              ? "bg-emerald-600/80 hover:bg-emerald-600 text-white"
                              : "bg-rose-600/80 hover:bg-rose-600 text-white"
                          }`}
                        >
                          {togglingBlock ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : searchedUser.isBlocked ? (
                            <UserCheck className="h-3 w-3" />
                          ) : (
                            <Ban className="h-3 w-3" />
                          )}
                          <span>
                            {searchedUser.isBlocked ? "Desbanir Usuário" : "Banir Usuário da IA"}
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quantidade de Créditos (visível quando não for Zerar) */}
                  {adjustmentMode !== "zero" ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-300">
                          {adjustmentMode === "deduct"
                            ? "Quantidade a Deduzir / Tirar"
                            : "Quantidade a Conceder / Adicionar"}
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {adjustmentMode === "deduct" ? "Será debitado do saldo" : "Será creditado no saldo"}
                        </span>
                      </div>

                      <div className="relative">
                        <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-sm ${
                          adjustmentMode === "deduct" ? "text-rose-400" : "text-emerald-400"
                        }`}>
                          {adjustmentMode === "deduct" ? "−" : "+"}
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={creditsAmount}
                          onChange={(e) => setCreditsAmount(Math.abs(Number(e.target.value)))}
                          className="w-full bg-[#070709] border border-[#1E202E] rounded-xl pl-8 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-bold min-h-[48px]"
                          required
                        />
                      </div>

                      {/* Atalhos Rápidos de Quantidade */}
                      <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar">
                        {[50, 100, 250, 500, 1000].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setCreditsAmount(val)}
                            className="px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer min-h-[32px]"
                          >
                            {adjustmentMode === "deduct" ? `-${val}` : `+${val}`}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl">
                      <p className="text-xs text-amber-300 leading-relaxed">
                        🧹 <strong>Modo Zerar Saldo</strong>: Ao confirmar, todo o saldo remanescente do usuário será deduzido, deixando a conta com exatamente 0 créditos.
                      </p>
                    </div>
                  )}

                  {/* Motivo Administrativo com Sugestões Rápidas */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Motivo / Justificativa (Opcional - preenchimento automático)
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={
                        adjustmentMode === "deduct"
                          ? "Ex: Cancelamento, estorno ou correção"
                          : adjustmentMode === "zero"
                          ? "Ex: Zerar saldo por solicitação ou termo"
                          : "Ex: Bonificação de suporte, recarga manual PIX"
                      }
                      className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors min-h-[48px]"
                    />

                    {/* Sugestões Táteis de Motivos */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(adjustmentMode === "deduct"
                        ? ["Dedução por cancelamento", "Estorno de teste", "Correção de saldo"]
                        : adjustmentMode === "zero"
                        ? ["Zerar saldo administrativamente", "Encerramento de conta", "Correção total"]
                        : ["Bonificação de suporte", "Recarga manual PIX", "Compensação de instabilidade"]
                      ).map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => setReason(sug)}
                          className="px-2 py-0.5 text-[10px] rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={adjustingCredits}
                    className={`w-full mt-2 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-white text-xs font-bold transition-all shadow-lg disabled:opacity-50 min-h-[48px] touch-manipulation active:scale-95 cursor-pointer ${
                      adjustmentMode === "deduct"
                        ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"
                        : adjustmentMode === "zero"
                        ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/20"
                        : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                    }`}
                  >
                    {adjustingCredits ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : adjustmentMode === "deduct" ? (
                      <MinusCircle className="h-4 w-4" />
                    ) : adjustmentMode === "zero" ? (
                      <Trash2 className="h-4 w-4" />
                    ) : (
                      <PlusCircle className="h-4 w-4" />
                    )}
                    <span>
                      {adjustingCredits
                        ? "Processando Operação..."
                        : adjustmentMode === "deduct"
                        ? `Confirmar Débito de ${creditsAmount} Créditos`
                        : adjustmentMode === "zero"
                        ? "Zerar Saldo deste Usuário Agora"
                        : `Confirmar Adição de ${creditsAmount} Créditos`}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
