"use client";

import React, { useState } from "react";
import { 
  Play, 
  Pause, 
  Percent, 
  Coins, 
  X, 
  Layers, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface AdminServiceBatchBarProps {
  selectedCount: number;
  totalCount: number;
  selectedIds: string[];
  onClearSelection: () => void;
  onSuccess: () => void;
}

export function AdminServiceBatchBar({
  selectedCount,
  totalCount,
  selectedIds,
  onClearSelection,
  onSuccess,
}: AdminServiceBatchBarProps) {
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<"percentage" | "fixed" | null>(null);
  const [percentageValue, setPercentageValue] = useState<number>(10);
  const [fixedValue, setFixedValue] = useState<number>(15);

  if (selectedCount === 0) return null;

  const executeBatchAction = async (
    action: "activate" | "deactivate" | "adjust_credits_percentage" | "set_fixed_credits",
    value?: number
  ) => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceIds: selectedIds,
          action,
          value,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Operação em lote concluída com sucesso!");
        setActiveModal(null);
        onClearSelection();
        onSuccess();
      } else {
        toast.error(data.error || "Erro ao executar ação em lote.");
      }
    } catch (error: any) {
      toast.error("Erro de conexão ao processar ação em lote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Barra Fixa Flutuante na base da tela (Mobile-First) */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-2xl z-40 bg-slate-900/95 backdrop-blur-xl border border-violet-500/40 shadow-2xl shadow-violet-950/60 rounded-2xl p-3 sm:p-4 text-white transition-all animate-in fade-in slide-in-from-bottom-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Informação dos Selecionados */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{selectedCount} de {totalCount} selecionados</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ações em lote para serviços e motores
              </p>
            </div>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {/* Ativar Todos */}
            <button
              type="button"
              onClick={() => executeBatchAction("activate")}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              style={{ minHeight: "38px" }}
              title="Ativar serviços selecionados"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Ativar</span>
            </button>

            {/* Pausar Todos */}
            <button
              type="button"
              onClick={() => executeBatchAction("deactivate")}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              style={{ minHeight: "38px" }}
              title="Pausar serviços selecionados"
            >
              <Pause className="h-3.5 w-3.5 fill-current" />
              <span>Pausar</span>
            </button>

            {/* Reajuste % */}
            <button
              type="button"
              onClick={() => setActiveModal("percentage")}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              style={{ minHeight: "38px" }}
              title="Reajustar créditos por porcentagem"
            >
              <Percent className="h-3.5 w-3.5" />
              <span>Reajustar %</span>
            </button>

            {/* Definir Fixo */}
            <button
              type="button"
              onClick={() => setActiveModal("fixed")}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all disabled:opacity-50"
              style={{ minHeight: "38px" }}
              title="Definir valor fixo de créditos"
            >
              <Coins className="h-3.5 w-3.5" />
              <span>Fixo</span>
            </button>

            {/* Cancelar Seleção */}
            <button
              type="button"
              onClick={onClearSelection}
              disabled={loading}
              className="flex items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all ml-1"
              style={{ minHeight: "38px", minWidth: "38px" }}
              title="Limpar seleção"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal / Diálogo para Reajuste de Porcentagem */}
      {activeModal === "percentage" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
                <Percent className="h-4 w-4" />
                Reajuste Percentual em Lote
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Você está alterando o custo em créditos de <strong>{selectedCount}</strong> serviço(s). Digite uma porcentagem positiva para aumentar ou negativa para diminuir (ex: <strong>10</strong> para +10% ou <strong>-15</strong> para -15%).
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Porcentagem de Reajuste (%)
              </label>
              <input
                type="number"
                value={percentageValue}
                onChange={(e) => setPercentageValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-violet-500"
                placeholder="Ex: 10"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                style={{ minHeight: "40px" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => executeBatchAction("adjust_credits_percentage", percentageValue)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-all shadow-lg shadow-violet-600/20 disabled:opacity-50"
                style={{ minHeight: "40px" }}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Aplicar Reajuste
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Diálogo para Definir Valor Fixo de Créditos */}
      {activeModal === "fixed" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Coins className="h-4 w-4" />
                Definir Créditos Fixos em Lote
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Todos os <strong>{selectedCount}</strong> serviço(s) selecionados passarão a custar exatamente a quantia especificada abaixo.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Novo Custo Fixo em Créditos
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={fixedValue}
                onChange={(e) => setFixedValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-cyan-500"
                placeholder="Ex: 15"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                style={{ minHeight: "40px" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => executeBatchAction("set_fixed_credits", fixedValue)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50"
                style={{ minHeight: "40px" }}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Salvar Valor Fixo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
