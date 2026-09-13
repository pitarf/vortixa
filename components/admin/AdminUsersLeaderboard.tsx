"use client";

import React, { useState } from "react";
import { Wallet, Zap, UserCheck, ArrowUpRight, Copy, Check, Search } from "lucide-react";
import { toast } from "sonner";
import { TopUserItem } from "@/services/admin-dashboard.service";

interface AdminUsersLeaderboardProps {
  topByBalance: TopUserItem[];
  topByConsumption: TopUserItem[];
  onSelectUserForAdjustment?: (userId: string) => void;
}

export function AdminUsersLeaderboard({
  topByBalance,
  topByConsumption,
  onSelectUserForAdjustment,
}: AdminUsersLeaderboardProps) {
  const [tab, setTab] = useState<"balance" | "consumption">("balance");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const rawList = tab === "balance" ? topByBalance : topByConsumption;
  const list = rawList.filter((u) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      u.id.toLowerCase().includes(term)
    );
  });

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("ID copiado para a área de transferência!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRankBadge = (idx: number) => {
    if (idx === 0) {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[11px] font-black text-slate-950 shadow-md shadow-amber-500/30 flex-shrink-0">
          1
        </span>
      );
    }
    if (idx === 1) {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-[11px] font-black text-slate-950 shadow-md shadow-slate-300/20 flex-shrink-0">
          2
        </span>
      );
    }
    if (idx === 2) {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 text-[11px] font-black text-amber-100 shadow-md shadow-amber-800/20 flex-shrink-0">
          3
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#13141B] text-[11px] font-bold text-slate-300 border border-[#1E202E] flex-shrink-0">
        {idx + 1}
      </span>
    );
  };

  return (
    <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl shadow-black/40 flex flex-col justify-between">
      <div>
        {/* Header com Abas Segmentadas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-white font-black text-base font-heading">
              <UserCheck className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <span>Leaderboard de Usuários</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditoria de maiores saldos e maiores consumidores da plataforma.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1 p-1 bg-[#070709] rounded-xl border border-[#1E202E] w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setTab("balance")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all min-h-[44px] touch-manipulation active:scale-[0.97] cursor-pointer ${
                tab === "balance"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wallet className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Maior Saldo</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("consumption")}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all min-h-[44px] touch-manipulation active:scale-[0.97] cursor-pointer ${
                tab === "consumption"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Maior Consumo</span>
            </button>
          </div>
        </div>

        {/* Campo de Busca Rápida no Card */}
        <div className="relative mb-3">
          <Search className="h-3.5 w-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nome, e-mail ou ID..."
            className="w-full bg-[#070709] border border-[#1E202E] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors min-h-[44px]"
          />
        </div>

        {/* Lista de Usuários */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto scrollbar-thin pr-1">
          {list.length === 0 ? (
            <p className="text-slate-500 text-xs py-8 text-center">Nenhum usuário localizado.</p>
          ) : (
            list.map((u, idx) => {
              const initials = (u.name || "U")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={u.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#13141B] border border-[#1E202E] hover:border-slate-700 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getRankBadge(idx)}

                    <div className="w-8 h-8 rounded-full bg-violet-950/80 border border-violet-800/50 flex items-center justify-center text-[11px] font-bold text-violet-300 flex-shrink-0">
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                        <span className="truncate">{u.name || "Usuário"}</span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyId(e, u.id)}
                          className="text-[10px] text-slate-500 hover:text-slate-300 font-mono flex items-center gap-0.5 flex-shrink-0 bg-[#070709] px-2 py-1 rounded border border-[#1E202E] cursor-pointer min-h-[28px] touch-manipulation"
                          title="Copiar ID completo"
                        >
                          {copiedId === u.id ? (
                            <Check className="h-2.5 w-2.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-2.5 w-2.5" />
                          )}
                          <span>{u.id.slice(0, 6)}...</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        {u.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E202E] flex-shrink-0">
                    {tab === "balance" ? (
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-black text-cyan-400 font-mono">
                          {u.balance.toLocaleString("pt-BR")} cr
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Pago: R$ {u.totalPaidBrl.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-black text-fuchsia-400 font-mono">
                          {u.creditsSpent.toLocaleString("pt-BR")} cr
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {u.generationsCount} mídias geradas
                        </div>
                      </div>
                    )}

                    {onSelectUserForAdjustment && (
                      <button
                        type="button"
                        onClick={() => onSelectUserForAdjustment(u.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/30 text-xs font-bold transition-all min-h-[44px] touch-manipulation active:scale-[0.97] cursor-pointer flex-shrink-0"
                        title="Ajustar créditos deste usuário"
                      >
                        <span>Ajustar</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
