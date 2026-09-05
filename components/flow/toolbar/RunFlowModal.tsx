"use client";

import React, { useMemo, useState } from "react";
import { useFlowStore } from "@/stores/flow-store";
import {
  Play,
  X,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export function RunFlowModal() {
  const {
    runModalOpen,
    setRunModalOpen,
    nodes,
    edges,
    userBalance,
    creditMode,
    executeFlow,
    isExecuting,
  } = useFlowStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcula custo estimado dos nós no frontend apenas para orientação visual (o backend recalcula no banco)
  const executionSummary = useMemo(() => {
    let totalCost = 0;
    const generativeNodes: Array<{ id: string; title: string; cost: number; type: string }> = [];

    nodes.forEach((n) => {
      const cost = n.data.creditCost || 0;
      if (cost > 0) {
        totalCost += cost;
        generativeNodes.push({
          id: n.id,
          title: n.data.title,
          cost,
          type: n.data.nodeType,
        });
      }
    });

    const hasEnoughCredits = creditMode === "UNLIMITED" || userBalance >= totalCost;

    return {
      totalCost,
      generativeNodes,
      totalNodes: nodes.length,
      totalConnections: edges.length,
      hasEnoughCredits,
    };
  }, [nodes, edges, userBalance, creditMode]);

  if (!runModalOpen) return null;

  const handleConfirmRun = async () => {
    setIsSubmitting(true);
    await executeFlow();
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-950/95 border border-slate-800/80 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Confirmar Execução do Fluxo</h3>
              <p className="text-xs text-slate-400">Revise os custos e o encadeamento de nós</p>
            </div>
          </div>

          <button
            onClick={() => setRunModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Resumo da Execução */}
        <div className="p-5 space-y-4 text-xs">
          {/* Métricas do Grafo */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Total Nós</span>
              <span className="text-base font-bold text-slate-100 font-mono">{executionSummary.totalNodes}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Conexões</span>
              <span className="text-base font-bold text-slate-100 font-mono">{executionSummary.totalConnections}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Custo Total</span>
              <span className="text-base font-bold text-amber-400 font-mono">⚡ {executionSummary.totalCost}</span>
            </div>
          </div>

          {/* Lista de Nós Pagos */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Detalhamento de Custo por Nó
            </span>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {executionSummary.generativeNodes.length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-900/30 text-slate-500 text-center">
                  Este fluxo contém apenas nós utilitários gratuitos.
                </div>
              ) : (
                executionSummary.generativeNodes.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60"
                  >
                    <span className="text-slate-200 font-medium truncate">{item.title}</span>
                    <span className="font-mono text-amber-400 font-bold flex-shrink-0">⚡ {item.cost} cr</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Saldo vs Custo */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Seu Saldo Disponível:</span>
              <span className="font-mono font-bold text-slate-100">
                {creditMode === "UNLIMITED" ? "ILIMITADO" : `${userBalance} créditos`}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800/60 pt-2">
              <span className="text-slate-400">Saldo Restante Estimado:</span>
              <span
                className={`font-mono font-bold ${
                  executionSummary.hasEnoughCredits ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {creditMode === "UNLIMITED" ? "ILIMITADO" : `${userBalance - executionSummary.totalCost} créditos`}
              </span>
            </div>
          </div>

          {/* Aviso de Saldo Insuficiente */}
          {!executionSummary.hasEnoughCredits && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Saldo Insuficiente de Créditos</span>
                <p className="text-[11px] leading-relaxed">
                  Você precisa de mais {executionSummary.totalCost - userBalance} créditos para executar este fluxo.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
          <button
            onClick={() => setRunModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>

          {!executionSummary.hasEnoughCredits ? (
            <Link
              href="/dashboard/admin"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-current" /> Recarregar Créditos
            </Link>
          ) : (
            <button
              onClick={handleConfirmRun}
              disabled={isSubmitting || isExecuting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Iniciando...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Executar Pipeline Real</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
