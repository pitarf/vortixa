"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User as UserIcon,
  Coins,
  Shield,
  ShieldOff,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  DollarSign,
  Layers,
  Sparkles,
  Loader2,
  RotateCcw,
  Check,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface AdminUserDrawerProps {
  userId: string | null;
  onClose: () => void;
  onUserUpdated?: () => void;
}

interface UserDetailData {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: "ADMIN" | "USER";
    isBlocked: boolean;
    isUnlimited: boolean;
    balance: number;
    createdAt: string;
    updatedAt: string;
  };
  payments: Array<{
    id: string;
    orderId?: string | null;
    amountCents: number;
    amountBrl: string;
    creditsGranted: number;
    status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    gateway: string;
    gatewayTxId?: string | null;
    createdAt: string;
  }>;
  pendingPayments: Array<{
    id: string;
    orderId?: string | null;
    amountCents: number;
    amountBrl: string;
    creditsGranted: number;
    status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    gateway: string;
    gatewayTxId?: string | null;
    createdAt: string;
  }>;
  jobs: Array<{
    id: string;
    modelName: string;
    modelTechnicalName?: string;
    toolName: string;
    toolSlug?: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
    creditCost: number;
    apiUnitCostUsd: number;
    providerCostUsd?: number | null;
    creditsCharged: number;
    creditsRefunded: number;
    error?: string | null;
    fileUrl?: string | null;
    createdAt: string;
  }>;
  creditTransactions: Array<{
    id: string;
    amount: number;
    type: string;
    description?: string | null;
    createdAt: string;
  }>;
}

export function AdminUserDrawer({ userId, onClose, onUserUpdated }: AdminUserDrawerProps) {
  const [activeTab, setActiveTab] = useState<"actions" | "payments" | "jobs">("actions");
  const [data, setData] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states - Alteração de senha
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Form states - Ajuste de créditos individual
  const [creditsDelta, setCreditsDelta] = useState<number>(50);
  const [creditsReason, setCreditsReason] = useState("");
  const [adjustingCredits, setAdjustingCredits] = useState(false);

  // Status de operações gerais
  const [actionLoading, setActionLoading] = useState(false);
  const [approvingPaymentId, setApprovingPaymentId] = useState<string | null>(null);

  const fetchUserDetails = async (targetId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${targetId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao carregar detalhes do usuário.");
        onClose();
      }
    } catch {
      toast.error("Erro de conexão ao buscar dados do usuário.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    } else {
      setData(null);
    }
  }, [userId]);

  if (!userId) return null;

  // Atualizar Role
  const handleToggleRole = async () => {
    if (!data) return;
    const newRole = data.user.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/users/${data.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const resJson = await res.json();
      if (res.ok) {
        toast.success(`Privilégio atualizado para ${newRole}!`);
        setData((prev) => (prev ? { ...prev, user: { ...prev.user, role: newRole } } : null));
        onUserUpdated?.();
      } else {
        toast.error(resJson.error || "Falha ao alterar papel do usuário.");
      }
    } catch {
      toast.error("Erro de rede ao alterar privilégio.");
    } finally {
      setActionLoading(false);
    }
  };

  // Alternar Bloqueio
  const handleToggleBlock = async () => {
    if (!data) return;
    const nextBlocked = !data.user.isBlocked;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/users/${data.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: nextBlocked }),
      });
      const resJson = await res.json();
      if (res.ok) {
        toast.success(nextBlocked ? "Usuário bloqueado com sucesso!" : "Usuário desbloqueado com sucesso!");
        setData((prev) => (prev ? { ...prev, user: { ...prev.user, isBlocked: nextBlocked } } : null));
        onUserUpdated?.();
      } else {
        toast.error(resJson.error || "Falha ao alterar status de bloqueio.");
      }
    } catch {
      toast.error("Erro de rede ao alterar status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Alternar Acesso Ilimitado
  const handleToggleUnlimited = async () => {
    if (!data) return;
    const nextUnlimited = !data.user.isUnlimited;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/users/${data.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isUnlimited: nextUnlimited }),
      });
      const resJson = await res.json();
      if (res.ok) {
        toast.success(nextUnlimited ? "Acesso ilimitado ativado!" : "Acesso ilimitado desativado!");
        setData((prev) => (prev ? { ...prev, user: { ...prev.user, isUnlimited: nextUnlimited } } : null));
        onUserUpdated?.();
      } else {
        toast.error(resJson.error || "Falha ao alterar permissão ilimitada.");
      }
    } catch {
      toast.error("Erro de rede ao alterar permissão.");
    } finally {
      setActionLoading(false);
    }
  };

  // Alterar Senha
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !newPassword.trim()) return;
    if (newPassword.trim().length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      setSavingPassword(true);
      const res = await fetch(`/api/admin/users/${data.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: newPassword.trim() }),
      });
      const resJson = await res.json();
      if (res.ok) {
        toast.success("Senha do usuário redefinida com sucesso!");
        setNewPassword("");
      } else {
        toast.error(resJson.error || "Erro ao definir nova senha.");
      }
    } catch {
      toast.error("Erro de rede ao alterar senha.");
    } finally {
      setSavingPassword(false);
    }
  };

  // Ajustar Crédito Manual com Idempotência e Ledger
  const handleAdjustCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !creditsReason.trim() || creditsDelta === 0) {
      toast.error("Preencha a quantidade de créditos e o motivo obrigatório.");
      return;
    }

    try {
      setAdjustingCredits(true);
      const idempotencyKey = `user_drawer_adj_${data.user.id}_${Date.now()}`;
      const res = await fetch("/api/admin/adjust-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: data.user.id,
          creditsAmount: Number(creditsDelta),
          reason: creditsReason.trim(),
          idempotencyKey,
        }),
      });

      const resJson = await res.json();
      if (res.ok) {
        toast.success(resJson.message || "Créditos ajustados com sucesso!");
        setCreditsReason("");
        fetchUserDetails(data.user.id);
        onUserUpdated?.();
      } else {
        toast.error(resJson.error || "Erro ao ajustar créditos.");
      }
    } catch {
      toast.error("Erro de rede ao ajustar créditos.");
    } finally {
      setAdjustingCredits(false);
    }
  };

  // Aprovação Manual de Recarga Pendente
  const handleManualApprovePayment = async (paymentId: string) => {
    try {
      setApprovingPaymentId(paymentId);
      const res = await fetch("/api/admin/payments/manual-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId,
          reason: "Aprovação manual autorizada via Drawer de Usuário",
        }),
      });

      const resJson = await res.json();
      if (res.ok) {
        toast.success(resJson.message || "Recarga aprovada e créditos concedidos!");
        if (data) fetchUserDetails(data.user.id);
        onUserUpdated?.();
      } else {
        toast.error(resJson.error || "Falha ao aprovar recarga.");
      }
    } catch {
      toast.error("Erro de rede ao aprovar pagamento.");
    } finally {
      setApprovingPaymentId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-950 border-l border-slate-900 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header do Drawer */}
        <div className="p-4 sm:p-6 border-b border-slate-900 flex items-center justify-between bg-slate-950/80 sticky top-0 z-10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-lg">
              {data?.user.image ? (
                <img
                  src={data.user.image}
                  alt={data.user.name}
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                <span>{(data?.user.name || "U")[0]?.toUpperCase()}</span>
              )}
            </div>
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-white truncate">
                  {data?.user.name || "Carregando..."}
                </span>
                {data && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                      data.user.role === "ADMIN"
                        ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {data.user.role}
                  </span>
                )}
                {data?.user.isBlocked && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Bloqueado
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-slate-400 truncate">
                {data?.user.email || userId}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            aria-label="Fechar gaveta"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Abas Superiores */}
        <div className="flex border-b border-slate-900 px-4 sm:px-6 bg-slate-950/40">
          <button
            type="button"
            onClick={() => setActiveTab("actions")}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "actions"
                ? "border-violet-500 text-violet-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Ações & Acesso
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "payments"
                ? "border-violet-500 text-violet-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Recargas & Pagamentos</span>
            {data && data.pendingPayments.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {data.pendingPayments.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "jobs"
                ? "border-violet-500 text-violet-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Histórico IA & Custos
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
              <span className="text-xs">Carregando dados detalhados do usuário...</span>
            </div>
          ) : data ? (
            <>
              {/* =============================================================
                  ABA 1: AÇÕES DO USUÁRIO & ACESSO
                 ============================================================= */}
              {activeTab === "actions" && (
                <div className="space-y-6">
                  {/* Card de Saldo & Status Rápido */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900/60 to-slate-950 border border-violet-900/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-mono block font-bold">
                        Saldo Atual
                      </span>
                      <span className="text-2xl font-black text-amber-300 font-mono">
                        {data.user.isUnlimited ? "ILIMITADO" : `${data.user.balance.toLocaleString("pt-BR")} cr`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleBlock}
                        disabled={actionLoading}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          data.user.isBlocked
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
                        }`}
                      >
                        {data.user.isBlocked ? "Desbloquear Conta" : "Bloquear Conta"}
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleRole}
                        disabled={actionLoading}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all cursor-pointer"
                      >
                        {data.user.role === "ADMIN" ? "Rebaixar a USER" : "Promover a ADMIN"}
                      </button>
                    </div>
                  </div>

                  {/* Interruptor Acesso Ilimitado */}
                  <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Zap className="h-4 w-4 text-amber-400" />
                        Acesso Ilimitado (VIP Free Generations)
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Ignora o débito de créditos ao gerar imagens e vídeos.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleUnlimited}
                      disabled={actionLoading}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        data.user.isUnlimited
                          ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                          : "bg-slate-800 text-slate-300 border-slate-700 hover:text-white"
                      }`}
                    >
                      {data.user.isUnlimited ? "ATIVADO" : "DESATIVADO"}
                    </button>
                  </div>

                  {/* Form de Ajuste Manual de Crédito */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                      <Coins className="h-4 w-4 text-cyan-400" />
                      Ajuste Administrativo de Créditos (Ledger)
                    </div>
                    <p className="text-xs text-slate-400">
                      Adicione créditos positivos ou debite créditos negativos com registro imediato de auditoria.
                    </p>

                    <form onSubmit={handleAdjustCredits} className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Quantidade (+ para conceder / - para debitar)
                          </label>
                          <input
                            type="number"
                            value={creditsDelta}
                            onChange={(e) => setCreditsDelta(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:border-cyan-500 focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Motivo / Justificativa (AuditLog)
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Bonificação suporte, recarga manual PIX"
                            value={creditsReason}
                            onChange={(e) => setCreditsReason(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={adjustingCredits}
                        className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20 disabled:opacity-50 cursor-pointer"
                      >
                        {adjustingCredits ? <Loader2 className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />}
                        <span>Aplicar Ajuste de Créditos</span>
                      </button>
                    </form>
                  </div>

                  {/* Form de Alterar Senha Diretamente */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-900 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                      <KeyRound className="h-4 w-4 text-violet-400" />
                      Segurança & Redefinição de Senha
                    </div>
                    <p className="text-xs text-slate-400">
                      Defina uma nova senha criptografada diretamente com bcryptjs para o usuário.
                    </p>

                    <form onSubmit={handleChangePassword} className="space-y-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">
                          Nova Senha (mínimo 6 dígitos)
                        </label>
                        <input
                          type="password"
                          placeholder="Digite a nova senha segura..."
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={savingPassword}
                        className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-violet-600/20 disabled:opacity-50 cursor-pointer"
                      >
                        {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        <span>Salvar Nova Senha</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* =============================================================
                  ABA 2: RECARGAS & PAGAMENTOS
                 ============================================================= */}
              {activeTab === "payments" && (
                <div className="space-y-4">
                  {/* Destaque de Recargas Pendentes */}
                  {data.pendingPayments.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                        <AlertTriangle className="h-4 w-4 text-amber-400 animate-pulse" />
                        Recargas Pendentes Aguardando Aprovação ({data.pendingPayments.length})
                      </div>

                      {data.pendingPayments.map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-white">
                                R$ {p.amountBrl}
                              </span>
                              <span className="text-xs font-mono font-bold text-amber-300">
                                (+{p.creditsGranted} créditos)
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-1">
                              ID: {p.id} • Gateway: {p.gateway.toUpperCase()} • Criado em:{" "}
                              {new Date(p.createdAt).toLocaleString("pt-BR")}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleManualApprovePayment(p.id)}
                            disabled={approvingPaymentId === p.id}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                          >
                            {approvingPaymentId === p.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            <span>Aprovar Recarga Manualmente</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Histórico Geral de Transações */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Histórico Completo de Pagamentos ({data.payments.length})
                    </span>

                    {data.payments.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500 bg-slate-900/30 rounded-xl border border-slate-900">
                        Nenhum pagamento registrado para este usuário.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                        {data.payments.map((p) => (
                          <div
                            key={p.id}
                            className="p-3 rounded-xl bg-slate-900/40 border border-slate-900 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">R$ {p.amountBrl}</span>
                                <span className="font-mono text-violet-400 font-bold">
                                  +{p.creditsGranted} cr
                                </span>
                                <span
                                  className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${
                                    p.status === "PAID"
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                      : p.status === "PENDING"
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  }`}
                                >
                                  {p.status}
                                </span>
                              </div>
                              <div className="text-[10px] font-mono text-slate-400 mt-1">
                                Gateway: {p.gateway} • {new Date(p.createdAt).toLocaleString("pt-BR")}
                              </div>
                            </div>

                            {p.status === "PENDING" && (
                              <button
                                type="button"
                                onClick={() => handleManualApprovePayment(p.id)}
                                disabled={approvingPaymentId === p.id}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[11px] font-bold transition-all cursor-pointer"
                              >
                                Aprovar
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* =============================================================
                  ABA 3: HISTÓRICO DE GERAÇÕES IA & CUSTOS
                 ============================================================= */}
              {activeTab === "jobs" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Jobs de IA Executados ({data.jobs.length})
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Últimas 50 gerações
                    </span>
                  </div>

                  {data.jobs.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500 bg-slate-900/30 rounded-xl border border-slate-900">
                      Nenhuma geração executada por este usuário até o momento.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                      {data.jobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white font-heading">
                                {job.toolName}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                {job.modelName}
                              </span>
                              <span
                                className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${
                                  job.status === "COMPLETED"
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : job.status === "FAILED"
                                    ? "bg-rose-500/20 text-rose-300"
                                    : "bg-amber-500/20 text-amber-300"
                                }`}
                              >
                                {job.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                              <span>
                                Custo: <strong className="text-violet-300">{job.creditCost} cr</strong>
                              </span>
                              <span>•</span>
                              <span>
                                Custo API:{" "}
                                <strong className="text-amber-300">
                                  ${(job.providerCostUsd ?? job.apiUnitCostUsd).toFixed(4)} USD
                                </strong>
                              </span>
                              <span>•</span>
                              <span>{new Date(job.createdAt).toLocaleString("pt-BR")}</span>
                            </div>

                            {job.error && (
                              <p className="text-[11px] text-rose-400/90 font-mono bg-rose-950/30 p-1.5 rounded-lg border border-rose-900/50 mt-1">
                                {job.error}
                              </p>
                            )}
                          </div>

                          {job.fileUrl && (
                            <a
                              href={job.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition-all border border-slate-700"
                            >
                              <span>Visualizar</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
