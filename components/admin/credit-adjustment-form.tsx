"use client";
import React, { useState } from "react";
import { Sliders, RefreshCw, CheckCircle2, RotateCcw, ShieldCheck, KeyRound } from "lucide-react";
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
  const [creditsAmount, setCreditsAmount] = useState<number>(100);
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => generateAdminIdempotencyKey());

  const handleResetForm = () => {
    setTargetUserId("");
    setCreditsAmount(100);
    setReason("");
    setIdempotencyKey(generateAdminIdempotencyKey());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUserId = targetUserId.trim();
    const cleanReason = reason.trim();

    if (!cleanUserId) {
      toast.error("O ID do Usuario Destino e obrigatorio.");
      return;
    }

    if (creditsAmount === 0 || isNaN(creditsAmount)) {
      toast.error("Informe uma quantidade de creditos valida (diferente de zero).");
      return;
    }

    if (!cleanReason) {
      toast.error("O motivo administrativo para auditoria e obrigatorio.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/adjust-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: cleanUserId,
          creditsAmount: Number(creditsAmount),
          reason: cleanReason,
          idempotencyKey,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 409) {
        toast.error(json.error || "Conflito de Idempotencia: Esta chave ja foi utilizada com parametros divergentes.");
        setIdempotencyKey(generateAdminIdempotencyKey());
        return;
      }

      if (res.ok) {
        if (json.message?.includes("idempotente") || json.alreadyProcessed) {
          toast.info(json.message || "Operacao ja processada anteriormente (idempotente).");
        } else {
          toast.success(json.message || "Creditos ajustados com sucesso administrativamente!");
        }
        handleResetForm();
        if (onSuccess) onSuccess();
      } else {
        toast.error(json.error || "Erro ao efetuar ajuste administrativo de creditos.");
      }
    } catch (err) {
      toast.error("Erro de conexao com o servidor. A mesma chave foi mantida para retry seguro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Sliders className="h-5 w-5 text-cyan-400" />
            Ajuste Administrativo de Creditos
          </div>
          <button
            type="button"
            onClick={handleResetForm}
            disabled={isSubmitting}
            title="Limpar formulario e gerar nova chave de operacao"
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <RotateCcw className="h-3 w-3" />
            Nova Operacao
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Ajuste saldo com auditoria compulsoria no Ledger e protecao de chave contra retries.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ID do Usuario Destino (targetUserId)
            </label>
            <input
              type="text"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              disabled={isSubmitting}
              placeholder="Ex: cld9482..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ minHeight: "44px" }}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Quantidade de Creditos (Positivo para credito, Negativo para debito)
            </label>
            <input
              type="number"
              value={creditsAmount}
              onChange={(e) => setCreditsAmount(Number(e.target.value))}
              disabled={isSubmitting}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
              disabled={isSubmitting}
              placeholder="Ex: Bonificacao de suporte, compensacao de instabilidade"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ minHeight: "44px" }}
              required
            />
          </div>

          <div className="p-3 bg-cyan-950/30 border border-cyan-900/50 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              Garantia de Idempotencia Ativa
            </div>
            <p className="text-[11px] text-cyan-300/80 leading-relaxed">
              Esta operacao registra transacao unica no banco de dados e gera registro de autoria no Ledger. Reenvios acidentais e rWtries de rede mantem a mesma chave para prevenir duplicidades.
            </p>
            <div className="flex items-center gap-1 text-[10px] text-cyan-400/60 font-mono pt-0.5">
              <KeyRound className="h-3 w-3" />
              <span>Chave: {idempotencyKey.substring(0, 24)}...</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: "44px" }}
          >
            {isSubmitting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {isSubmitting ? "Processando Ajuste..." : "Executar Ajuste de Creditos"}
          </button>
        </form>
      </div>
    </div>
  );
}
