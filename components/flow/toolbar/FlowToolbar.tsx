"use client";

import React, { memo } from "react";
import { useFlowStore } from "@/stores/flow-store";
import {
  Play,
  Square,
  Plus,
  Save,
  Undo2,
  Redo2,
  Sparkles,
  Maximize2,
  SlidersHorizontal,
  Loader2,
  Check,
} from "lucide-react";

export const FlowToolbar = memo(function FlowToolbar({ onFitView }: { onFitView?: () => void }) {
  const {
    flowName,
    setFlowName,
    status,
    isDirty,
    isSaving,
    lastSavedAt,
    saveFlow,
    isExecuting,
    cancelExecution,
    setNodePickerOpen,
    setAiBuilderOpen,
    setRunModalOpen,
    setInspectorOpen,
    inspectorOpen,
    undo,
    redo,
    canUndo,
    canRedo,
    userBalance,
    creditMode,
  } = useFlowStore();

  return (
    <header className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none select-none">
      {/* Bloco Esquerdo: Título & Status */}
      <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl pointer-events-auto">
        <input
          type="text"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          className="bg-transparent text-sm font-semibold text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50 rounded px-1.5 py-0.5 max-w-[200px] md:max-w-[280px] truncate"
          placeholder="Nome do Fluxo..."
        />

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-[10px] font-mono">
          <span
            className={`px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
              status === "ACTIVE"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
            }`}
          >
            {status}
          </span>

          <span className="text-slate-500 hidden sm:inline">
            {isSaving ? (
              <span className="flex items-center gap-1 text-slate-400">
                <Loader2 className="w-3 h-3 animate-spin" /> Salvando...
              </span>
            ) : isDirty ? (
              <span className="text-amber-400/80">Não salvo</span>
            ) : lastSavedAt ? (
              <span className="flex items-center gap-1 text-slate-500">
                <Check className="w-3 h-3 text-emerald-400" /> Salvo
              </span>
            ) : null}
          </span>
        </div>
      </div>

      {/* Bloco Central: Ações de Criação & IA */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl pointer-events-auto">
        <button
          onClick={() => setNodePickerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Node</span>
        </button>

        <button
          onClick={() => setAiBuilderOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-900/60 via-purple-900/40 to-cyan-900/60 hover:from-violet-900 hover:to-cyan-900 text-cyan-300 border border-cyan-500/30 text-xs font-semibold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">✦ Build with AI</span>
        </button>
      </div>

      {/* Bloco Direito: Histórico, Salvar, Saldo & Execução */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-2xl pointer-events-auto">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 pr-2 border-r border-slate-800">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Desfazer (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Refazer (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Fit View */}
        {onFitView && (
          <button
            onClick={onFitView}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Ajustar Visualização"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}

        {/* Toggle Inspector */}
        <button
          onClick={() => setInspectorOpen(!inspectorOpen)}
          className={`p-1.5 rounded-lg transition-colors ${
            inspectorOpen ? "bg-violet-500/20 text-violet-300 border border-violet-500/40" : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
          title="Propriedades do Nó"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Saldo de Créditos Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200">
          <span className="text-amber-400 font-bold">⚡</span>
          <span className="font-bold">
            {creditMode === "UNLIMITED" ? "ILIMITADO" : `${userBalance} cr`}
          </span>
        </div>

        {/* Salvar */}
        <button
          onClick={() => saveFlow()}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Salvar</span>
        </button>

        {/* Botão Principal: RUN FLOW */}
        {isExecuting ? (
          <button
            onClick={cancelExecution}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all animate-pulse cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Cancelar</span>
          </button>
        ) : (
          <button
            onClick={() => setRunModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Flow</span>
          </button>
        )}
      </div>
    </header>
  );
});
