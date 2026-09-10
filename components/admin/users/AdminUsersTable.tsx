"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  Shield,
  ShieldOff,
  Coins,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  PlusCircle,
  ArrowUpDown,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { AdminBatchActionsBar } from "./AdminBatchActionsBar";
import { AdminUserDrawer } from "./AdminUserDrawer";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "ADMIN" | "USER";
  isBlocked: boolean;
  isUnlimited: boolean;
  balance: number;
  totalRechargesBrl: number;
  totalRechargesCount: number;
  totalJobsCount: number;
  createdAt: string;
}

export function AdminUsersTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "balance" | "name">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Paginação
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Seleção Múltipla
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);

  // Modal / Drawer de Usuário
  const [drawerUserId, setDrawerUserId] = useState<string | null>(null);

  // Modal de Adicionar Créditos em Lote
  const [batchCreditsModalOpen, setBatchCreditsModalOpen] = useState(false);
  const [batchCreditsAmount, setBatchCreditsAmount] = useState<number>(100);
  const [batchCreditsReason, setBatchCreditsReason] = useState("");

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (roleFilter !== "ALL") params.set("role", roleFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.items || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      } else {
        toast.error("Erro ao carregar lista de usuários.");
      }
    } catch {
      toast.error("Erro de conexão ao buscar usuários.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, roleFilter, statusFilter, sortBy, sortOrder, page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Alternar Seleção de um Usuário
  const handleToggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Alternar Selecionar Todos os da Página Atual
  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allCurrentIds = users.map((u) => u.id);
      setSelectedUserIds((prev) => Array.from(new Set([...prev, ...allCurrentIds])));
    } else {
      const currentIdsSet = new Set(users.map((u) => u.id));
      setSelectedUserIds((prev) => prev.filter((id) => !currentIdsSet.has(id)));
    }
  };

  const isAllCurrentSelected = useMemo(() => {
    if (users.length === 0) return false;
    return users.every((u) => selectedUserIds.includes(u.id));
  }, [users, selectedUserIds]);

  // Executar Ação em Lote
  const handleBatchAction = async (
    action: "block" | "unblock" | "promote" | "demote" | "delete" | "add_credits",
    customAmount?: number,
    customReason?: string
  ) => {
    if (selectedUserIds.length === 0) return;

    if (action === "add_credits" && customAmount === undefined) {
      setBatchCreditsModalOpen(true);
      return;
    }

    if (action === "delete") {
      const confirmed = window.confirm(
        `Tem certeza de que deseja EXCLUIR PERMANENTEMENTE ${selectedUserIds.length} usuário(s)? Esta ação não pode ser desfeita.`
      );
      if (!confirmed) return;
    }

    try {
      setBatchLoading(true);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          userIds: selectedUserIds,
          amount: customAmount,
          reason: customReason || `Ação em lote: ${action}`,
        }),
      });

      const resJson = await res.json();
      if (res.ok) {
        toast.success(resJson.message || "Ação em massa executada com sucesso!");
        setSelectedUserIds([]);
        fetchUsers();
      } else {
        toast.error(resJson.error || "Erro ao executar ação em massa.");
      }
    } catch {
      toast.error("Erro de conexão ao processar ação em lote.");
    } finally {
      setBatchLoading(false);
      setBatchCreditsModalOpen(false);
    }
  };

  // Ação rápida individual de bloqueio/desbloqueio
  const handleQuickToggleBlock = async (user: UserRow, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextBlocked = !user.isBlocked;
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: nextBlocked }),
      });
      const resJson = await res.json();
      if (res.ok) {
        toast.success(nextBlocked ? `Usuário ${user.name} bloqueado!` : `Usuário ${user.name} desbloqueado!`);
        fetchUsers();
      } else {
        toast.error(resJson.error || "Erro ao alterar status do usuário.");
      }
    } catch {
      toast.error("Erro de rede ao alterar status.");
    }
  };

  // Ação rápida individual de promoção/rebaixamento
  const handleQuickToggleRole = async (user: UserRow, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });
      const resJson = await res.json();
      if (res.ok) {
        toast.success(`Papel do usuário atualizado para ${nextRole}!`);
        fetchUsers();
      } else {
        toast.error(resJson.error || "Erro ao alterar papel do usuário.");
      }
    } catch {
      toast.error("Erro de rede ao atualizar papel.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-900">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, e-mail ou ID do usuário..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            style={{ minHeight: "42px" }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro por Role */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filtrar por privilégio ou papel"
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500 transition-colors"
            style={{ minHeight: "42px" }}
          >
            <option value="ALL">Todos os Papéis</option>
            <option value="USER">Usuários (USER)</option>
            <option value="ADMIN">Administradores (ADMIN)</option>
          </select>

          {/* Filtro por Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filtrar por status de acesso"
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500 transition-colors"
            style={{ minHeight: "42px" }}
          >
            <option value="ALL">Todos os Status</option>
            <option value="active">Apenas Ativos</option>
            <option value="blocked">Apenas Bloqueados</option>
          </select>

          {/* Ordenação */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-") as ["createdAt" | "balance" | "name", "asc" | "desc"];
              setSortBy(field);
              setSortOrder(order);
              setPage(1);
            }}
            aria-label="Ordenar listagem de usuários"
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500 transition-colors"
            style={{ minHeight: "42px" }}
          >
            <option value="createdAt-desc">Mais Recentes Primeiro</option>
            <option value="createdAt-asc">Mais Antigos Primeiro</option>
            <option value="balance-desc">Maior Saldo de Créditos</option>
            <option value="balance-asc">Menor Saldo de Créditos</option>
            <option value="name-asc">Nome (A-Z)</option>
          </select>

          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
            style={{ minHeight: "42px", minWidth: "42px" }}
            title="Atualizar lista"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-violet-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Visualização Mobile em Cards Empilháveis (Oculto em telas sm e maiores) */}
      <div className="space-y-3 sm:hidden">
        {loading && users.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-slate-950/60 border border-slate-900 rounded-2xl p-6">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-violet-500 mb-2" />
            <span className="text-xs">Carregando usuários do sistema...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-slate-950/60 border border-slate-900 rounded-2xl p-6 text-xs">
            Nenhum usuário encontrado com os filtros aplicados.
          </div>
        ) : (
          users.map((user) => {
            const isSelected = selectedUserIds.includes(user.id);
            return (
              <div
                key={user.id}
                onClick={() => setDrawerUserId(user.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? "bg-violet-950/30 border-violet-500/50 shadow-lg shadow-violet-950/30"
                    : "bg-slate-950/80 border-slate-900 hover:border-slate-800"
                }`}
              >
                {/* Cabeçalho do Card Mobile */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="p-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectUser(user.id)}
                        aria-label={`Selecionar usuário ${user.name}`}
                        className="rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-violet-500 h-5 w-5 cursor-pointer"
                      />
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-full w-full object-cover rounded-xl"
                        />
                      ) : (
                        <span>{(user.name || "U")[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        user.role === "ADMIN"
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        user.isBlocked
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {user.isBlocked ? "Bloqueado" : "Ativo"}
                    </span>
                  </div>
                </div>

                {/* Métricas do Usuário no Mobile */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-center">
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 font-medium block">Saldo</span>
                    <span className="text-xs font-mono font-black text-amber-300">
                      {user.isUnlimited ? "ILIMITADO" : `${user.balance.toLocaleString("pt-BR")} cr`}
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 font-medium block">Recargas</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      R$ {user.totalRechargesBrl.toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 font-medium block">Gerações</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {user.totalJobsCount}
                    </span>
                  </div>
                </div>

                {/* Ações Rápidas Mobile com Touch Targets >= 44px */}
                <div
                  className="flex items-center justify-between gap-2 pt-2 border-t border-slate-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleQuickToggleBlock(user, e)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                        user.isBlocked
                          ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20"
                          : "text-amber-400 border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20"
                      }`}
                      title={user.isBlocked ? "Desbloquear" : "Bloquear"}
                    >
                      {user.isBlocked ? <Shield className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                      <span>{user.isBlocked ? "Desbloquear" : "Bloquear"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickToggleRole(user, e)}
                      className="p-2.5 rounded-xl text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                      title={user.role === "ADMIN" ? "Rebaixar para USER" : "Promover a ADMIN"}
                    >
                      {user.role === "ADMIN" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDrawerUserId(user.id)}
                      className="p-2.5 rounded-xl text-violet-400 border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                      title="Ver detalhes completos"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Tabela de Usuários (Desktop & Tablet: sm em diante) */}
      <div className="hidden sm:block bg-slate-950/60 border border-slate-900 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto overscroll-x-contain">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-900/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllCurrentSelected}
                    onChange={handleToggleSelectAll}
                    aria-label="Selecionar todos os usuários da página atual"
                    className="rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-violet-500 h-4 w-4 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Usuário</th>
                <th className="py-3.5 px-4">Papel (Role)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Saldo Atual</th>
                <th className="py-3.5 px-4">Total Recargas</th>
                <th className="py-3.5 px-4">Gerações IA</th>
                <th className="py-3.5 px-4">Cadastrado em</th>
                <th className="py-3.5 px-4 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-xs">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-violet-500 mb-2" />
                    <span>Carregando usuários do sistema...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    Nenhum usuário encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <tr
                      key={user.id}
                      onClick={() => setDrawerUserId(user.id)}
                      className={`hover:bg-slate-900/60 transition-colors cursor-pointer ${
                        isSelected ? "bg-violet-950/20" : ""
                      }`}
                    >
                      {/* Checkbox de Seleção */}
                      <td
                        className="py-3 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectUser(user.id)}
                          aria-label={`Selecionar usuário ${user.name}`}
                          className="rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-violet-500 h-4 w-4 cursor-pointer"
                        />
                      </td>

                      {/* Dados do Usuário */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="h-full w-full object-cover rounded-xl"
                              />
                            ) : (
                              <span>{(user.name || "U")[0]?.toUpperCase()}</span>
                            )}
                          </div>
                          <div className="flex flex-col truncate max-w-[200px] sm:max-w-xs">
                            <span className="font-bold text-white truncate">
                              {user.name}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Papel */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            user.role === "ADMIN"
                              ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            user.isBlocked
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {user.isBlocked ? "Bloqueado" : "Ativo"}
                        </span>
                      </td>

                      {/* Saldo de Créditos */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-black text-amber-300">
                          {user.isUnlimited ? "ILIMITADO" : `${user.balance.toLocaleString("pt-BR")} cr`}
                        </span>
                      </td>

                      {/* Total Recargas */}
                      <td className="py-3 px-4 font-mono text-slate-300">
                        R$ {user.totalRechargesBrl.toFixed(2).replace(".", ",")}
                        <span className="text-[10px] text-slate-500 block">
                          ({user.totalRechargesCount} transação(ões))
                        </span>
                      </td>

                      {/* Gerações de IA */}
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {user.totalJobsCount} gerações
                      </td>

                      {/* Data de Criação */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                      </td>

                      {/* Ações Rápidas por Linha */}
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleQuickToggleBlock(user, e)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              user.isBlocked
                                ? "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                : "text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                            }`}
                            title={user.isBlocked ? "Desbloquear" : "Bloquear"}
                          >
                            {user.isBlocked ? <Shield className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleQuickToggleRole(user, e)}
                            className="p-1.5 rounded-lg text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors cursor-pointer"
                            title={user.role === "ADMIN" ? "Rebaixar para USER" : "Promover a ADMIN"}
                          >
                            {user.role === "ADMIN" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDrawerUserId(user.id)}
                            className="p-1.5 rounded-lg text-violet-400 border border-violet-500/30 hover:bg-violet-500/20 transition-colors cursor-pointer"
                            title="Ver detalhes completos"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rodapé de Paginação Adaptativo (Mobile e Desktop) */}
      <div className="p-4 rounded-2xl border border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60 text-xs text-slate-400">
        <span>
          Exibindo <strong>{users.length}</strong> de <strong>{totalCount}</strong> usuário(s)
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer min-h-[44px]"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </button>

          <span className="font-mono text-xs px-2 font-bold text-white">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer min-h-[44px]"
          >
            <span>Próxima</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Barra de Ações em Lote Flutuante */}
      <AdminBatchActionsBar
        selectedCount={selectedUserIds.length}
        totalCount={totalCount}
        onClearSelection={() => setSelectedUserIds([])}
        onAction={(action) => handleBatchAction(action)}
        loading={batchLoading}
      />

      {/* Modal de Créditos em Massa */}
      {batchCreditsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Coins className="h-4 w-4 text-violet-400" />
                <span>Adicionar Créditos em Massa</span>
              </div>
              <button
                type="button"
                onClick={() => setBatchCreditsModalOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Você está prestes a conceder créditos para{" "}
              <strong className="text-white">{selectedUserIds.length}</strong> usuário(s) selecionado(s).
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Quantidade de Créditos por Usuário
                </label>
                <input
                  type="number"
                  value={batchCreditsAmount}
                  onChange={(e) => setBatchCreditsAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:border-violet-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Motivo Administrativo (AuditLog)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Campanha de fidelidade, compensação geral"
                  value={batchCreditsReason}
                  onChange={(e) => setBatchCreditsReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBatchCreditsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleBatchAction("add_credits", batchCreditsAmount, batchCreditsReason)}
                disabled={batchLoading || !batchCreditsReason.trim()}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {batchLoading ? "Aplicando..." : "Confirmar Concessão"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer Lateral de Perfil Detalhado */}
      <AdminUserDrawer
        userId={drawerUserId}
        onClose={() => setDrawerUserId(null)}
        onUserUpdated={fetchUsers}
      />
    </div>
  );
}
