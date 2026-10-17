"use client";

import React, { useState } from "react";
import { 
  Sliders, 
  RefreshCw, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  KeyRound,
  PlusCircle,
  MinusCircle,
  Trash2,
  Search,
  Ban,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";

export function generateAdminIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return "adm_adj_" + crypto.randomUUID();
  }
  return "adm_adj_" + Date.now() + "_" + Math.random().toString(36).substring(3, 9);
}

export interface CreditAdjustmentFormProps {
  onSuccess?: () => void;
}

export function CreditAdjustmentForm({ onSuccess }: CreditAdjustmentFormProps) {
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [adjustmentMode, setAdjustmentMode] = useState<"add" | "deduct" | "zero">("add");
  const [creditsAmount, setCreditsAmount] = useState<number>(100);
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => generateAdminIdempotencyKey());

  // Lookup de usuário e controle de bloqueio da IA
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
        if (onSuccess) onSuccess();
      } else {
        toast.error(json.error || "Erro ao alterar status de acesso.");
      }
    } catch {
      toast.error("Erro de conexão ao alterar status do usuário.");
    } finally {
      setTogglingBlock(false);
    }
  };

  const handleResetForm = () => {
    setTargetUserId("");
    setAdjustmentMode("add");
    setCreditsAmount(100);
    setReason("");
    setSearchedUser(null);
    setIdempotencyKey(generateAdminIdempotencyKey());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUserId = targetUserId.trim();

    if (!cleanUserId) {
      toast.error("O ID ou e-mail do usuário de destino é obrigatório.");
      return;
    }

    if (adjustmentMode !== "zero" && (!creditsAmount || creditsAmount <= 0)) {
      toast.error("Informe uma quantidade de créditos válida (maior que zero).");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: any = {
        targetUserId: cleanUserId,
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

      const json = await res.json().catch(() => ({}));

      if (res.status === 409) {
        toast.error(json.error || "Conflito de Idempotência: Esta chave já foi utilizada com parâmetros divergentes.");
        setIdempotencyKey(generateAdminIdempotencyKey());
        return;
      }

      if (res.ok) {
        if (json.message?.includes("idempotente") || json.alreadyProcessed) {
          toast.info(json.message || "Operação já processada anteriormente (idempotente).");
        } else {
          toast.success(json.message || "Créditos ajustados com sucesso administrativamente!");
        }
        if (json.newBalance !== undefined && searchedUser) {
          setSearchedUser({ ...searchedUser, balance: json.newBalance });
        } else {
          handleLookupUser(cleanUserId);
        }
        setReason("");
        if (onSuccess) onSuccess();
      } else {
        toast.error(json.error || "Erro ao efetuar ajuste administrativo de créditos.");
      }
    } catch {
      toast.error("Erro de conexão com o servidor. A mesma chave foi mantida para retry seguro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Sliders className="h-5 w-5 text-cyan-400" />
            Ajuste Administrativo de Créditos & Acesso à IA
          </div>
          <button
            type="button"
            onClick={handleResetForm}
            disabled={isSubmitting}
            title="Limpar formulário e gerar nova chave de operação"
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Nova Operação
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Adicione, retire créditos ou bloqueie o acesso do usuário à IA com auditoria garantida no Ledger.
        </p>

        {/* Seletor Tátil de Operação */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setAdjustmentMode("add")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all min-h-[42px] cursor-pointer ${
              adjustmentMode === "add"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Adicionar (+)</span>
          </button>

          <button
            type="button"
            onClick={() => setAdjustmentMode("deduct")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all min-h-[42px] cursor-pointer ${
              adjustmentMode === "deduct"
                ? "bg-rose-600 text-white shadow-md shadow-rose-900/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MinusCircle className="h-3.5 w-3.5" />
            <span>Tirar (-)</span>
          </button>

          <button
            type="button"
            onClick={() => setAdjustmentMode("zero")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all min-h-[42px] cursor-pointer ${
              adjustmentMode === "zero"
                ? "bg-amber-600 text-white shadow-md shadow-amber-900/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Zerar Saldo</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                disabled={isSubmitting}
                placeholder="Cole o ID (UUID) ou digite o e-mail do usuário..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-11 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-mono min-h-[44px]"
                required
              />
              <button
                type="button"
                onClick={() => handleLookupUser()}
                disabled={searchingUser || !targetUserId.trim() || isSubmitting}
                className="absolute right-2 p-2 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
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

          {/* Preview do Usuário Localizado */}
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
                <div>
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
                  disabled={togglingBlock || isSubmitting}
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

          {adjustmentMode !== "zero" ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  {adjustmentMode === "deduct" ? "Quantidade a Deduzir" : "Quantidade a Conceder"}
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
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-bold min-h-[44px]"
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
                    disabled={isSubmitting}
                    className="px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer min-h-[30px]"
                  >
                    {adjustmentMode === "deduct" ? `-${val}` : `+${val}`}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl">
              <p className="text-xs text-amber-300 leading-relaxed">
                🧹 <strong>Modo Zerar Saldo</strong>: Todo o saldo do usuário será retirado, deixando-o com 0 créditos.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Motivo Administrativo (AuditLog - Opcional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              placeholder={
                adjustmentMode === "deduct"
                  ? "Ex: Cancelamento, estorno ou correção de saldo"
                  : adjustmentMode === "zero"
                  ? "Ex: Zerar saldo por solicitação ou termo"
                  : "Ex: Bonificação de suporte, recarga manual PIX"
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
            />

            {/* Sugestões Táteis */}
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
                  disabled={isSubmitting}
                  className="px-2 py-0.5 text-[10px] rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-cyan-950/30 border border-cyan-900/50 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              Garantia de Idempotência Ativa
            </div>
            <p className="text-[11px] text-cyan-300/80 leading-relaxed">
              Esta operação registra transação única no banco de dados e gera registro de autoria no Ledger. Reenvios acidentais e retries de rede mantêm a mesma chave para prevenir duplicidades.
            </p>
            <div className="flex items-center gap-1 text-[10px] text-cyan-400/60 font-mono pt-0.5">
              <KeyRound className="h-3 w-3" />
              <span>Chave: {idempotencyKey.substring(0, 24)}...</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-xs font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[46px] cursor-pointer active:scale-95 ${
              adjustmentMode === "deduct"
                ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"
                : adjustmentMode === "zero"
                ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/20"
                : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
            }`}
          >
            {isSubmitting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : adjustmentMode === "deduct" ? (
              <MinusCircle className="h-4 w-4" />
            ) : adjustmentMode === "zero" ? (
              <Trash2 className="h-4 w-4" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            <span>
              {isSubmitting
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
  );
}
