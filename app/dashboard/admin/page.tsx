"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Layers, 
  TrendingUp, 
  RefreshCw, 
  Zap, 
  Globe, 
  Sliders, 
  CheckCircle2,
  Video,
  Image as ImageIcon,
  Clock,
  Sparkles
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
import { ScrollText, Layers2, LayoutDashboard, UserCog } from "lucide-react";

interface BrandingData {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  faviconUrl: string;
  ogImageUrl: string;
}

export default function AdminDashboardPage() {
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

  // Form de ajuste manual de crédito
  const [targetUserId, setTargetUserId] = useState("");
  const [creditsAmount, setCreditsAmount] = useState<number>(100);
  const [reason, setReason] = useState("");

  // Aba principal do Painel Admin ("overview" | "services" | "users" | "logs" | "models")
  const [mainTab, setMainTab] = useState<"overview" | "services" | "users" | "logs" | "models">("overview");

  // Aba móvel ativa para a seção de configurações inferiores ("adjust" | "branding")
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

  const handleAdjustCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId.trim() || !reason.trim()) {
      toast.error("Preencha todos os campos obrigatórios para o ajuste de créditos.");
      return;
    }

    try {
      setAdjustingCredits(true);
      const idempotencyKey = `adm_adj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const res = await fetch("/api/admin/adjust-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: targetUserId.trim(),
          creditsAmount: Number(creditsAmount),
          reason: reason.trim(),
          idempotencyKey,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(json.message || "Créditos ajustados com sucesso!");
        setTargetUserId("");
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
          <p className="text-slate-400 text-sm">Carregando painel executivo e métricas do VORIXA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 px-2 sm:px-0">
      {/* Header com Status Administrativo e Ação de Atualização */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            Módulo Executivo & Controle Financeiro
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Dashboard Administrativo Geral
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Visão 360º de faturamento, margem de lucro, custos de API, top serviços e auditoria de usuários.
          </p>
        </div>

        <button
          onClick={() => fetchStats(currentPeriod)}
          disabled={refreshing}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all border border-slate-800 disabled:opacity-50"
          style={{ minHeight: "44px" }}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-violet-400" : ""}`} />
          <span>{refreshing ? "Atualizando..." : "Atualizar Métricas"}</span>
        </button>
      </div>

      {/* Abas Principais de Navegação do Painel (Scroll horizontal no mobile com touch targets confortáveis) */}
      <div className="flex items-center gap-2 border-b border-slate-900 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setMainTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            mainTab === "overview"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
          }`}
          style={{ minHeight: "44px" }}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Visão Geral & Métricas</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab("services")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            mainTab === "services"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
          }`}
          style={{ minHeight: "44px" }}
        >
          <Layers2 className="h-4 w-4 text-cyan-400" />
          <span>Catálogo de Serviços & Precificação</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            mainTab === "users"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
          }`}
          style={{ minHeight: "44px" }}
        >
          <UserCog className="h-4 w-4 text-emerald-400" />
          <span>Gestão de Usuários & Ações em Massa</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab("models")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            mainTab === "models"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
          }`}
          style={{ minHeight: "44px" }}
        >
          <Sparkles className="h-4 w-4 text-violet-400" />
          <span>Vitrine de Modelos & Casting</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab("logs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            mainTab === "logs"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
          }`}
          style={{ minHeight: "44px" }}
        >
          <ScrollText className="h-4 w-4 text-amber-400" />
          <span>Logs do Sistema & Auditoria CRM</span>
        </button>
      </div>

      {mainTab === "models" ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="h-4 w-4" />
                Vitrine & Casting de Modelos
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Gestão Administrativa de Modelos (IA & Reais)
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Controle o catálogo de modelos para ensaios gerativos, precificação de créditos e contratações de casting.
              </p>
            </div>
          </div>
          <AdminModelsManager />
        </div>
      ) : mainTab === "users" ? (
        <AdminUsersTable />
      ) : mainTab === "services" ? (
        <AdminServicesCatalog />
      ) : mainTab === "logs" ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
                <ScrollText className="h-4 w-4" />
                Monitoramento & Governança
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Central de Logs do Sistema & Auditoria CRM
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Rastreamento em tempo real de pagamentos, falhas/sucessos de IA e ações administrativas.
              </p>
            </div>
          </div>
          <AdminLogsViewer />
        </div>
      ) : (
        <>
          {/* Barra de Filtros Temporais (Hoje, Semanal, Mensal, Anual, Customizado) */}
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
        <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900/60 to-slate-950 border border-violet-900/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-300 uppercase tracking-wider">
              <Clock className="h-4 w-4 text-violet-400" />
              Desempenho de Hoje (Tempo Real)
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Atualizado em minutos
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-400 font-medium">Entrou Hoje</span>
              <div className="text-sm font-black text-emerald-400 mt-0.5">
                R$ {stats.todayStats.revenueBrl.toFixed(2)}
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-400 font-medium">Lucro Líquido Hoje</span>
              <div className="text-sm font-black text-violet-400 mt-0.5">
                R$ {stats.todayStats.profitBrl.toFixed(2)}
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-400 font-medium">Gasto com API</span>
              <div className="text-sm font-black text-amber-400 font-mono mt-0.5">
                ${stats.todayStats.apiCostUsd.toFixed(2)}
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-400 font-medium">Novos Cadastros</span>
              <div className="text-sm font-black text-cyan-400 mt-0.5">
                +{stats.todayStats.signups}
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-400 font-medium">Mídias Geradas</span>
              <div className="text-sm font-black text-fuchsia-400 mt-0.5">
                {stats.todayStats.generations}
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-400 font-medium">Créditos Gastos</span>
              <div className="text-sm font-black text-rose-400 mt-0.5">
                {stats.todayStats.creditsConsumed.toLocaleString("pt-BR")} cr
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards de Métricas e Indicadores Consolidados do Período */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Faturada no Período */}
        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Receita no Período</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">
              {stats ? `R$ ${stats.revenueBrl.toFixed(2).replace(".", ",")}` : "R$ 0,00"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stats?.creditsSold.toLocaleString("pt-BR") || 0} créditos vendidos
          </p>
        </div>

        {/* Lucro Líquido Estimado */}
        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Lucro Líquido Estimado</span>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">
              {stats ? `R$ ${stats.profitBrl.toFixed(2).replace(".", ",")}` : "R$ 0,00"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Margem estimada de {stats?.marginPercent || 0}%
          </p>
        </div>

        {/* Custo Agregado de API */}
        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Custo de API (fal / WaveSpeed)</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">
              ${stats?.apiCostUsd.toFixed(2) || "0.00"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Consumo: {stats?.creditsConsumed.toLocaleString("pt-BR") || 0} créditos
          </p>
        </div>

        {/* Novos Cadastros e Total */}
        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Cadastros no Período</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">
              +{stats?.newSignups || 0}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Base total: {stats?.totalUsersCount || 0} usuários registrados
          </p>
        </div>
      </div>

      {/* Gráficos Interativos Dinâmicos (Linha / Área com Eixo X adaptável) */}
      {stats && (
        <AdminAnalyticsCharts
          data={stats.timeSeries}
          xAxisType={stats.xAxisType}
        />
      )}

      {/* Grid de Seções: Top Serviços & Ranking de Usuários */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AdminTopServicesTable services={stats.topServices} />
          <AdminUsersLeaderboard
            topByBalance={stats.topUsersByBalance}
            topByConsumption={stats.topUsersByConsumption}
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
      <div className="lg:hidden flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 gap-1.5 shadow-lg">
        <button
          type="button"
          onClick={() => setActiveConfigTab("adjust")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeConfigTab === "adjust"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
              : "text-slate-400 hover:text-white"
          }`}
          style={{ minHeight: "44px" }}
        >
          <Sliders className="h-4 w-4" />
          Ajustar Créditos
        </button>
        <button
          type="button"
          onClick={() => setActiveConfigTab("branding")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeConfigTab === "branding"
              ? "bg-violet-500 text-white shadow-md shadow-violet-500/20"
              : "text-slate-400 hover:text-white"
          }`}
          style={{ minHeight: "44px" }}
        >
          <Globe className="h-4 w-4" />
          Branding & SEO
        </button>
      </div>

      {/* Grid Secundário: Branding & SEO + Ajuste de Créditos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Painel de Branding e SEO Dinâmico */}
        <div className={`bg-slate-950/40 border border-slate-900 rounded-2xl p-4 sm:p-6 ${
          activeConfigTab === "branding" ? "block" : "hidden lg:block"
        }`}>
          <div className="flex items-center gap-2 text-white font-bold text-base mb-1">
            <Globe className="h-5 w-5 text-violet-400" />
            Configuração de Branding & SEO
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Altere dinamicamente o título, favicon e meta tags de compartilhamento indexadas pelo Google.
          </p>

          <form onSubmit={handleSaveBranding} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Título da Aplicação (siteTitle)
              </label>
              <input
                type="text"
                value={branding.siteTitle}
                onChange={(e) => setBranding({ ...branding, siteTitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                style={{ minHeight: "44px" }}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Descrição de Busca (siteDescription)
              </label>
              <textarea
                value={branding.siteDescription}
                onChange={(e) => setBranding({ ...branding, siteDescription: e.target.value })}
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Palavras-chave (siteKeywords)
              </label>
              <input
                type="text"
                value={branding.siteKeywords}
                onChange={(e) => setBranding({ ...branding, siteKeywords: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                style={{ minHeight: "44px" }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Favicon URL (faviconUrl)
                </label>
                <input
                  type="text"
                  value={branding.faviconUrl}
                  onChange={(e) => setBranding({ ...branding, faviconUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  style={{ minHeight: "44px" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  OG Preview Image URL (ogImageUrl)
                </label>
                <input
                  type="text"
                  value={branding.ogImageUrl}
                  onChange={(e) => setBranding({ ...branding, ogImageUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  style={{ minHeight: "44px" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingBranding}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/20 disabled:opacity-50"
              style={{ minHeight: "44px" }}
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

        {/* Ajuste Manual de Saldo com Idempotência */}
        <div 
          ref={creditFormRef}
          className={`bg-slate-950/40 border border-slate-900 rounded-2xl p-4 sm:p-6 flex flex-col justify-between ${
            activeConfigTab === "adjust" ? "block" : "hidden lg:flex"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-1">
              <Sliders className="h-5 w-5 text-cyan-400" />
              Ajuste Administrativo de Créditos
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Ajuste saldo com auditoria compulsória no Ledger e proteção de chave contra retries.
            </p>

            <form onSubmit={handleAdjustCredits} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ID do Usuário Destino (targetUserId)
                </label>
                <input
                  type="text"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="Ex: cld9482..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                  style={{ minHeight: "44px" }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quantidade de Créditos (Positivo para crédito, Negativo para débito)
                </label>
                <input
                  type="number"
                  value={creditsAmount}
                  onChange={(e) => setCreditsAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-bold"
                  style={{ minHeight: "44px" }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Motivo Administrativo (AuditLog)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Bonificação de suporte, compensação de instabilidade"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  style={{ minHeight: "44px" }}
                  required
                />
              </div>

              <div className="p-3 bg-cyan-950/30 border border-cyan-900/50 rounded-xl">
                <p className="text-[11px] text-cyan-300 leading-relaxed">
                  🛡️ <strong>Garantia de Idempotência</strong>: Esta operação registra transação única no banco de dados e gera registro de autoria do administrador logado na sessão.
                </p>
              </div>

              <button
                type="submit"
                disabled={adjustingCredits}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50"
                style={{ minHeight: "44px" }}
              >
                {adjustingCredits ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {adjustingCredits ? "Processando Ajuste..." : "Executar Ajuste de Créditos"}
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

