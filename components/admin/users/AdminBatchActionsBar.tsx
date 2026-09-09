"use client";

import React from "react";
import {
  Shield,
  ShieldOff,
  UserCheck,
  UserX,
  PlusCircle,
  Trash2,
  X,
  Loader2,
} from "lucide-react";

interface AdminBatchActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onClearSelection: () => void;
  onAction: (action: "block" | "unblock" | "promote" | "demote" | "delete" | "add_credits") => void;
  loading?: boolean;
}

export function AdminBatchActionsBar({
  selectedCount,
  totalCount,
  onClearSelection,
  onAction,
  loading = false,
}: AdminBatchActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <aside
      aria-label="Ações em massa para usuários selecionados"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-slate-950/95 border border-violet-500/40 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-2xl shadow-violet-950/50 animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Contador e Desmarcar */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-violet-400 animate-ping" />
            <span className="text-xs sm:text-sm font-black text-white font-mono">
              {selectedCount} de {totalCount} selecionado(s)
            </span>
          </div>
          <button
            type="button"
            onClick={onClearSelection}
            disabled={loading}
            className="text-[11px] text-slate-400 hover:text-white underline underline-offset-4 flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
            Desmarcar
          </button>
        </div>

        {/* Botões de Ação em Massa */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-center md:justify-end">
          {/* Adicionar Créditos */}
          <button
            type="button"
            onClick={() => onAction("add_credits")}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/30 disabled:opacity-50 cursor-pointer"
            style={{ minHeight: "38px" }}
            title="Conceder créditos a todos os selecionados"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlusCircle className="h-3.5 w-3.5" />}
            <span>+ Créditos</span>
          </button>

          {/* Bloquear */}
          <button
            type="button"
            onClick={() => onAction("block")}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            style={{ minHeight: "38px" }}
            title="Bloquear acesso dos usuários selecionados"
          >
            <ShieldOff className="h-3.5 w-3.5" />
            <span>Bloquear</span>
          </button>

          {/* Desbloquear */}
          <button
            type="button"
            onClick={() => onAction("unblock")}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            style={{ minHeight: "38px" }}
            title="Desbloquear usuários selecionados"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Desbloquear</span>
          </button>

          {/* Promover para Admin */}
          <button
            type="button"
            onClick={() => onAction("promote")}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            style={{ minHeight: "38px" }}
            title="Promover selecionados a ADMIN"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Promover a Admin</span>
            <span className="sm:hidden">Admin</span>
          </button>

          {/* Rebaixar para User */}
          <button
            type="button"
            onClick={() => onAction("demote")}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            style={{ minHeight: "38px" }}
            title="Rebaixar selecionados a USER"
          >
            <UserX className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Rebaixar a Usuário</span>
            <span className="sm:hidden">Usuário</span>
          </button>

          {/* Excluir em Massa */}
          <button
            type="button"
            onClick={() => onAction("delete")}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            style={{ minHeight: "38px" }}
            title="Excluir contas permanentemente"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
