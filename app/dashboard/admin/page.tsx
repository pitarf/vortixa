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
  AlertTriangle,
  Globe,
  Sliders,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface StatsData {
  revenueCents: number;
  paymentsCount: {
    PAID: number;
    PENDING: number;
    FAILED: number;
    REFUNDED: number;
  };
  creditsSold: number;
  creditsConsumed: number;
  estimatedIACostUsd: number;
  estimatedMarginPercent: number;
  packagesCount: number;
}

interface BrandingData {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  faviconUrl: string;
  ogImageUrl: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [branding, setBranding] = useState<BrandingData>({
    siteTitle: "",
    siteDescription: "",
    siteKeywords: "",
    faviconUrl: "",
    ogImageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingBranding, setSavingBranding] = useState(false);
  const [adjustingCredits, setAdjustingCredits] = useState(false);

  // Form de ajuste manual de crédito
  const [targetUserId, setTargetUserId] = useState("");
  const [creditsAmount, setCreditsAmount] = useState<number>(100);
  const [reason, setReason] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, brandingRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/branding"),
      ]);

      if (statsRes.status === 401 || statsRes.status === 403) {
        toast.error("Acesso restrito. Apenas administradores podem visualizar esta página.");
        return;
      }

      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        setStats(statsJson);
      }

      if (brandingRes.ok) {
        const brandingJson = await brandingRes.json();
        setBranding(brandingJson);
      }
    } catch (err: any) {
      toast.error("Erro ao carregar dados do painel administrativo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      // Gera idempotencyKey única no cliente para evitar duplo disparo ou retries acidentais
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
        fetchData();
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
          <p className="text-slate-400 text-sm">Carregando painel de controle administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header com Status Administrativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            Módulo Administrativo & Controle
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Painel Executivo e Métricas
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Auditoria financeira consolidada, controle de créditos e parametrização de SEO.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all border border-slate-800 disabled:opacity-50"
          style={{ minHeight: "44px" }}
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar Métricas
        </button>
      </div>

      {/* Cards de Métricas e Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Faturada */}
        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Receita Total Paga</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">
              {stats ? `R$ ${(stats.revenueCents / 100).toFixed(2).replace(".", ",")}` : "R$ 0,00"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stats?.paymentsCount.PAID || 0} faturamentos aprovados
          </p>
        </div>

        {/* Créditos Concedidos */}
        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Créditos Vendidos</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">
              {stats?.creditsSold.toLocaleString("pt-BR") || 0}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Consumo: {stats?.creditsConsumed.toLocaleString("pt-BR") || 0} créditos
          </p>
        </div>

        {/* Custo Estimado IA */}
        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Custo de API (fal.ai)</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">
              ${stats?.estimatedIACostUsd.toFixed(2) || "0.00"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Consumo real agregado em USD</p>
        </div>

        {/* Margem Bruta Estimada */}
        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Margem Estimada</span>
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">
              {stats?.estimatedMarginPercent || 0}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Receita Líquida vs Custo IA</p>
        </div>
      </div>

      {/* Grid Principal: Branding e Ajuste de Créditos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Painel de Branding e SEO Dinâmico */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6">
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
        <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
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
    </div>
  );
}
