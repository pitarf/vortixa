"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Zap,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Copy,
  Check,
  AlertOctagon,
  ArrowDownLeft,
  ArrowUpRight,
  Database,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

export type LogType = "payments" | "jobs" | "audit";
export type LogStatusFilter = "ALL" | "SUCCESS" | "FAILED" | "PENDING";

export function AdminLogsViewer() {
  const [activeTab, setActiveTab] = useState<LogType>("payments");
  const [statusFilter, setStatusFilter] = useState<LogStatusFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  // Modal de inspeção rápida de payload / dados
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debounce da busca textual
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        type: activeTab,
        status: statusFilter,
        search: debouncedSearch,
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`/api/admin/logs?${queryParams.toString()}`);

      if (res.status === 401 || res.status === 403) {
        toast.error("Acesso restrito. Apenas administradores autenticados podem visualizar os logs.");
        return;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Erro ao consultar logs do sistema.");
      }

      const data = await res.json();
      setItems(data.items || []);
      setPagination(
        data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 }
      );
    } catch (err: any) {
      toast.error(err.message || "Erro de conexão ao carregar logs.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, statusFilter, debouncedSearch, page, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleTabChange = (newTab: LogType) => {
    setActiveTab(newTab);
    setStatusFilter("ALL");
    setSearchTerm("");
    setDebouncedSearch("");
    setPage(1);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copiado para a área de transferência!");
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Abas Principais de Navegação */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-900 pb-4">
        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-900 gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => handleTabChange("payments")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "payments"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                : "text-slate-400 hover:text-white hover:bg-slate-900/60"
            }`}
            style={{ minHeight: "44px" }}
          >
            <CreditCard className="h-4 w-4" />
            💳 Recargas & Financeiro
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("jobs")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "jobs"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/25"
                : "text-slate-400 hover:text-white hover:bg-slate-900/60"
            }`}
            style={{ minHeight: "44px" }}
          >
            <Zap className="h-4 w-4" />
            ⚡ Gerações & Falhas de IA
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("audit")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "audit"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/25"
                : "text-slate-400 hover:text-white hover:bg-slate-900/60"
            }`}
            style={{ minHeight: "44px" }}
          >
            <ShieldCheck className="h-4 w-4" />
            🛡️ Trilha de Auditoria
          </button>
        </div>

        <button
          type="button"
          onClick={() => fetchLogs()}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-all disabled:opacity-50"
          style={{ minHeight: "44px" }}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-violet-400" : ""}`} />
          <span>{loading ? "Atualizando..." : "Recarregar"}</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca Textual */}
      <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === "payments"
                ? "Buscar por email, ID do usuário, gateway tx ou ID do pagamento..."
                : activeTab === "jobs"
                ? "Buscar por modelo, usuário, prompt, erro ou ID do job..."
                : "Buscar por ação, detalhe ou email do admin..."
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            style={{ minHeight: "44px" }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filtro de Status (Apenas para Pagamentos e Jobs) */}
        {activeTab !== "audit" && (
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            <span className="text-[11px] text-slate-400 font-semibold px-2 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status:
            </span>
            {(["ALL", "SUCCESS", "FAILED", "PENDING"] as LogStatusFilter[]).map((st) => {
              const label =
                st === "ALL"
                  ? "Todos"
                  : st === "SUCCESS"
                  ? "Sucesso / Pago"
                  : st === "FAILED"
                  ? "Falhas / Recusas"
                  : "Pendentes";

              return (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    statusFilter === st
                      ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  style={{ minHeight: "36px" }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Listagem de Logs em Tabela / Cards Responsivos */}
      <div className="bg-slate-950/40 border border-slate-900 rounded-2xl overflow-hidden shadow-xl">
        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
            <p className="text-slate-400 text-xs">Consultando registros no banco de dados...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
            <Database className="h-10 w-10 text-slate-600" />
            <p className="text-white font-semibold text-sm">Nenhum registro encontrado</p>
            <p className="text-slate-400 text-xs max-w-sm">
              Não há dados que correspondam aos filtros selecionados ou ainda não ocorreram eventos nesta categoria.
            </p>
          </div>
        ) : (
          <>
            {/* TABELA: PAGAMENTOS */}
            {activeTab === "payments" && (
              <>
                {/* Mobile Cards Stack */}
                <div className="space-y-3 p-3 sm:hidden">
                  {items.map((payment) => {
                    const isPaid = payment.status === "PAID";
                    const isFailed = payment.status === "FAILED" || payment.isRefunded;
                    const isPending = payment.status === "PENDING";

                    return (
                      <div
                        key={payment.id}
                        onClick={() => setSelectedLog(payment)}
                        className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3 cursor-pointer hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            {isPaid && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                                <CheckCircle2 className="h-3 w-3" /> Pago
                              </span>
                            )}
                            {payment.isRefunded && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950/60 text-purple-400 border border-purple-800/60">
                                <RotateCcwIcon className="h-3 w-3" /> Estornado
                              </span>
                            )}
                            {isFailed && !payment.isRefunded && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/60">
                                <XCircle className="h-3 w-3" /> Falhou
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/60">
                                <Clock className="h-3 w-3" /> Pendente
                              </span>
                            )}
                          </div>

                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 uppercase">
                            {payment.gateway}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-semibold text-white text-xs truncate">
                              {payment.user?.name || "Sem nome"}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {payment.user?.email || payment.user?.id || "N/A"}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="font-mono font-bold text-white text-sm">
                              {payment.amountBRL}
                            </div>
                            <div className="font-bold text-cyan-400 font-mono text-xs">
                              +{payment.creditsGranted.toLocaleString("pt-BR")} cr
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                          <span>{formatDate(payment.createdAt)}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(payment);
                            }}
                            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white flex items-center gap-1 text-xs min-h-[44px] px-3"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Payload</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto overscroll-x-contain">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Usuário</th>
                        <th className="py-3 px-4">Valor (R$)</th>
                        <th className="py-3 px-4">Créditos</th>
                        <th className="py-3 px-4">Gateway</th>
                        <th className="py-3 px-4">Data / Hora</th>
                        <th className="py-3 px-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {items.map((payment) => {
                        const isPaid = payment.status === "PAID";
                        const isFailed = payment.status === "FAILED" || payment.isRefunded;
                        const isPending = payment.status === "PENDING";

                        return (
                          <tr
                            key={payment.id}
                            className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                            onClick={() => setSelectedLog(payment)}
                          >
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {isPaid && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Pago
                                </span>
                              )}
                              {payment.isRefunded && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-950/60 text-purple-400 border border-purple-800/60">
                                  <RotateCcwIcon className="h-3.5 w-3.5" /> Estornado
                                </span>
                              )}
                              {isFailed && !payment.isRefunded && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/60">
                                  <XCircle className="h-3.5 w-3.5" /> Falhou / Recusado
                                </span>
                              )}
                              {isPending && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/60">
                                  <Clock className="h-3.5 w-3.5" /> Pendente
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white truncate max-w-[180px]">
                                {payment.user?.name || "Sem nome"}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                                {payment.user?.email || payment.user?.id || "N/A"}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                              {payment.amountBRL}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="font-bold text-cyan-400 font-mono">
                                +{payment.creditsGranted.toLocaleString("pt-BR")}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 uppercase">
                                {payment.gateway}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                              {formatDate(payment.createdAt)}
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLog(payment);
                                }}
                                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors inline-flex items-center gap-1"
                                title="Inspecionar Detalhes"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline text-[11px]">Ver Payload</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* TABELA: GERAÇÕES IA & FALHAS */}
            {activeTab === "jobs" && (
              <>
                {/* Mobile Cards Stack para Jobs */}
                <div className="space-y-3 p-3 sm:hidden">
                  {items.map((job) => {
                    const isCompleted = job.status === "COMPLETED";
                    const isFailed = job.status === "FAILED" || job.status === "CANCELLED";
                    const isPending = job.status === "PENDING" || job.status === "PROCESSING";

                    return (
                      <div
                        key={job.id}
                        onClick={() => setSelectedLog(job)}
                        className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3 cursor-pointer hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                                <CheckCircle2 className="h-3 w-3" /> Concluído
                              </span>
                            )}
                            {isFailed && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/60">
                                <AlertTriangle className="h-3 w-3" /> Falha
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/60">
                                <Clock className="h-3 w-3" /> {job.status === "PROCESSING" ? "Processando..." : "Na Fila"}
                              </span>
                            )}
                          </div>

                          <div className="text-right">
                            <span className="font-mono text-xs font-bold text-violet-400">
                              {job.creditCost} cr
                            </span>
                            {job.durationSeconds !== null && (
                              <span className="text-[10px] text-slate-500 font-mono block">
                                {job.durationSeconds}s
                              </span>
                            )}
                          </div>
                        </div>

                        {job.error && (
                          <div className="text-[11px] text-rose-400/90 font-medium truncate flex items-center gap-1 bg-rose-950/20 p-2 rounded-lg border border-rose-900/40">
                            <AlertOctagon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{job.error}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-semibold text-cyan-300 text-xs truncate">
                              {job.tool?.name || "Ferramenta IA"}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              {job.model?.technicalName || job.model?.name || "N/A"}
                            </div>
                          </div>

                          <div className="text-right text-[11px] text-slate-400 truncate max-w-[140px]">
                            {job.user?.name || job.user?.email || "Sem identificação"}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                          <span>{formatDate(job.createdAt)}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(job);
                            }}
                            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white flex items-center gap-1 text-xs min-h-[44px] px-3"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Detalhes</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table para Jobs */}
                <div className="hidden sm:block overflow-x-auto overscroll-x-contain">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4">Status & Diagnóstico</th>
                        <th className="py-3 px-4">Usuário</th>
                        <th className="py-3 px-4">Modelo / Ferramenta</th>
                        <th className="py-3 px-4">Custo</th>
                        <th className="py-3 px-4">Tempo Resposta</th>
                        <th className="py-3 px-4">Data / Hora</th>
                        <th className="py-3 px-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {items.map((job) => {
                        const isCompleted = job.status === "COMPLETED";
                        const isFailed = job.status === "FAILED" || job.status === "CANCELLED";
                        const isPending = job.status === "PENDING" || job.status === "PROCESSING";

                        return (
                          <tr
                            key={job.id}
                            className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                            onClick={() => setSelectedLog(job)}
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-1 items-start">
                                {isCompleted && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Concluído
                                  </span>
                                )}
                                {isFailed && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/60">
                                    <AlertTriangle className="h-3.5 w-3.5" /> Falha na Geração
                                  </span>
                                )}
                                {isPending && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/60">
                                    <Clock className="h-3.5 w-3.5" /> {job.status === "PROCESSING" ? "Processando..." : "Na Fila"}
                                  </span>
                                )}
                                {/* Destaque para Categoria de Erro */}
                                {job.error && (
                                  <div className="text-[11px] text-rose-400/90 font-medium truncate max-w-[260px] flex items-center gap-1">
                                    <AlertOctagon className="h-3 w-3 shrink-0" />
                                    <span className="truncate">{job.error}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white truncate max-w-[160px]">
                                {job.user?.name || "Sem nome"}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                                {job.user?.email || job.user?.id || "N/A"}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-cyan-300 truncate max-w-[180px]">
                                {job.tool?.name || "Ferramenta IA"}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                                {job.model?.technicalName || job.model?.name || "N/A"}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="font-mono text-xs font-bold text-violet-400">
                                {job.creditCost} créditos
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                ${job.apiUnitCostUsd?.toFixed(4) || "0.0000"} USD
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {job.durationSeconds !== null ? (
                                <span className="text-slate-300 font-mono text-[11px]">
                                  {job.durationSeconds}s
                                </span>
                              ) : (
                                <span className="text-slate-600 font-mono text-[11px]">-</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                              {formatDate(job.createdAt)}
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLog(job);
                                }}
                                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors inline-flex items-center gap-1"
                                title="Inspecionar Detalhes do Job"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline text-[11px]">Detalhes</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* TABELA: TRILHA DE AUDITORIA */}
            {activeTab === "audit" && (
              <>
                {/* Mobile Cards Stack para Auditoria */}
                <div className="space-y-3 p-3 sm:hidden">
                  {items.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3 cursor-pointer hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-950/40 text-amber-300 border border-amber-800/50">
                          <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                          {log.action}
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatDate(log.createdAt)}
                        </span>
                      </div>

                      <div className="text-xs text-white font-medium">
                        Admin: <span className="text-slate-300">{log.adminUser?.name || "Admin"}</span>
                        <span className="text-[11px] text-slate-500 font-mono block truncate">
                          {log.adminUser?.email || "N/A"}
                        </span>
                      </div>

                      <p className="text-slate-300 text-xs line-clamp-3 bg-slate-950/40 p-2 rounded-lg border border-slate-900 font-sans">
                        {log.details || "Nenhum detalhe adicional informado."}
                      </p>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white flex items-center gap-1 text-xs min-h-[44px] px-3"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Ver Detalhes</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table para Auditoria */}
                <div className="hidden sm:block overflow-x-auto overscroll-x-contain">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4">Ação Administrativa</th>
                        <th className="py-3 px-4">Administrador</th>
                        <th className="py-3 px-4">Detalhes da Modificação</th>
                        <th className="py-3 px-4">Data / Hora</th>
                        <th className="py-3 px-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {items.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                          onClick={() => setSelectedLog(log)}
                        >
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-950/40 text-amber-300 border border-amber-800/50">
                              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white truncate max-w-[180px]">
                              {log.adminUser?.name || "Admin"}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                              {log.adminUser?.email || log.adminUser?.id || "N/A"}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="text-slate-300 text-xs line-clamp-2 max-w-md font-sans">
                              {log.details || "Nenhum detalhe adicional informado."}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLog(log);
                              }}
                              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors inline-flex items-center gap-1"
                              title="Ver Log Completo"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline text-[11px]">Ver</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

        {/* Rodapé de Paginação */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60">
            <div className="text-xs text-slate-400">
              Mostrando página <strong className="text-white">{pagination.page}</strong> de{" "}
              <strong className="text-white">{pagination.totalPages}</strong> (Total:{" "}
              <strong className="text-white">{pagination.total}</strong> registros)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 text-xs border border-slate-800 transition-all"
                style={{ minHeight: "36px" }}
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 text-xs border border-slate-800 transition-all"
                style={{ minHeight: "36px" }}
              >
                Próxima <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal / Gaveta de Inspeção Rápida de Payload & Detalhes (Fullscreen no Mobile) */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overscroll-contain">
          <div className="bg-slate-950 border-0 sm:border border-slate-800 rounded-none sm:rounded-2xl w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden overscroll-contain">
            {/* Cabeçalho do Modal */}
            <div className="p-4 sm:p-5 border-b border-slate-900 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Inspeção de Payload & Diagnóstico
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedLog.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(selectedLog, null, 2), selectedLog.id)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  title="Copiar JSON Completo"
                >
                  {copiedId === selectedLog.id ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Corpo do Modal com Abas de Informação e JSON Formatado */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 font-mono text-xs">
              {/* Alerta de Falha/Erro se houver */}
              {selectedLog.error && (
                <div className="p-3.5 bg-rose-950/40 border border-rose-900/60 rounded-xl space-y-1 font-sans">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                    <AlertOctagon className="h-4 w-4" />
                    Motivo da Falha / Exceção Retornada
                  </div>
                  <p className="text-rose-200 text-xs font-mono break-all whitespace-pre-wrap">
                    {selectedLog.error}
                  </p>
                </div>
              )}

              {/* Informações Resumidas de Identificação */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                  <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">
                    Usuário Vinculado
                  </span>
                  <div className="text-white text-xs font-medium truncate">
                    {selectedLog.user?.name || selectedLog.adminUser?.name || "N/A"}
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono truncate">
                    {selectedLog.user?.email || selectedLog.adminUser?.email || selectedLog.userId || "N/A"}
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                  <span className="text-[11px] text-slate-400 block font-semibold mb-0.5">
                    Data & Hora do Registro
                  </span>
                  <div className="text-white text-xs font-medium">
                    {formatDate(selectedLog.createdAt)}
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono">
                    Atualizado em: {formatDate(selectedLog.updatedAt || selectedLog.createdAt)}
                  </div>
                </div>
              </div>

              {/* Parâmetros de Input (se for Job IA) */}
              {selectedLog.inputs && selectedLog.inputs.length > 0 && (
                <div className="space-y-1.5 font-sans">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                    <Terminal className="h-3.5 w-3.5" /> Parâmetros de Entrada (Prompt & Configs):
                  </span>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2">
                    {selectedLog.inputs.map((inp: any, idx: number) => (
                      <div key={idx} className="text-xs">
                        <span className="text-slate-400 font-mono font-semibold">{inp.key}: </span>
                        <span className="text-slate-200 font-mono break-all">{inp.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* JSON Raw Completo */}
              <div className="space-y-1.5 font-sans">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Database className="h-3.5 w-3.5 text-violet-400" /> Estrutura de Dados Completa (JSON):
                </span>
                <div className="relative">
                  <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-violet-300 font-mono overflow-x-auto max-h-[260px] leading-relaxed">
                    {JSON.stringify(selectedLog, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 border-t border-slate-900 flex justify-end bg-slate-900/40">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                style={{ minHeight: "40px" }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Ícone auxiliar de estorno
function RotateCcwIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
