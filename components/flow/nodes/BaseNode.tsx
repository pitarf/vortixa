"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  FLOW_HANDLE_COLORS,
  NODE_HANDLES_REGISTRY,
  FlowNodeType,
  FlowNodeExecutionStatus,
} from "@/types/flow";
import { useFlowStore } from "@/stores/flow-store";
import {
  Boxes,
  Loader2,
  CheckCircle2,
  AlertCircle,
  SkipForward,
  Trash2,
  Copy,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

interface BaseNodeProps {
  id: string;
  nodeType: FlowNodeType;
  title: string;
  creditCost?: number;
  status?: FlowNodeExecutionStatus;
  error?: string | null;
  selected?: boolean;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Componente Base de Nó do VORIXA FLOW.
 * Padroniza a moldura Dark Obsidian, portas de entrada/saída (Handles), header, custo e status de execução.
 */
export const BaseNode = memo(function BaseNode({
  id,
  nodeType,
  title,
  creditCost = 0,
  status = "IDLE",
  error,
  selected = false,
  icon: Icon = Boxes,
  accentColor = "#8B5CF6",
  children,
  footer,
}: BaseNodeProps) {
  const { setSelectedNodeId, duplicateNode, deleteNode } = useFlowStore();
  const handlesDef = NODE_HANDLES_REGISTRY[nodeType] || { inputs: [], outputs: [] };

  const getStatusBadge = () => {
    switch (status) {
      case "RUNNING":
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/40 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
            Executando
          </span>
        );
      case "QUEUED":
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Na Fila
          </span>
        );
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Concluído
          </span>
        );
      case "FAILED":
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/15 text-red-300 border border-red-500/40">
            <AlertCircle className="w-3 h-3 text-red-400" />
            Falhou
          </span>
        );
      case "SKIPPED":
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <SkipForward className="w-3 h-3" />
            Ignorado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      tabIndex={0}
      role="group"
      aria-label={`Nó ${title} do tipo ${nodeType}`}
      className={`relative min-w-[280px] max-w-[340px] rounded-2xl bg-slate-950/95 backdrop-blur-xl border transition-all duration-200 group select-none shadow-2xl focus:outline-none focus:ring-1 focus:ring-violet-500/60 ${
        selected
          ? "border-violet-500 ring-2 ring-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
          : "border-slate-800/90 hover:border-slate-700 hover:shadow-slate-900/60"
      }`}
    >
      {/* Handles de Entrada (Inputs) */}
      <div className="absolute -left-[9px] top-12 flex flex-col gap-4 z-20">
        {handlesDef.inputs.map((handle) => {
          const colorToken = FLOW_HANDLE_COLORS[handle.type] || FLOW_HANDLE_COLORS.any;
          return (
            <div key={handle.id} className="relative group/handle flex items-center">
              <Handle
                type="target"
                position={Position.Left}
                id={handle.id}
                aria-label={`Entrada ${handle.label}`}
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#070709",
                  border: `2.5px solid ${colorToken.hex}`,
                  borderRadius: "9999px",
                }}
                className="transition-transform hover:scale-125 !cursor-crosshair shadow-md"
              />
              <div className="absolute left-6 hidden group-hover/handle:flex items-center px-2 py-1 rounded-md bg-slate-900/95 text-[10px] font-medium text-slate-200 border border-slate-700 whitespace-nowrap shadow-xl z-50 pointer-events-none">
                <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: colorToken.hex }} />
                {handle.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Handles de Saída (Outputs) */}
      <div className="absolute -right-[9px] top-12 flex flex-col gap-4 z-20">
        {handlesDef.outputs.map((handle) => {
          const colorToken = FLOW_HANDLE_COLORS[handle.type] || FLOW_HANDLE_COLORS.any;
          return (
            <div key={handle.id} className="relative group/handle flex items-center justify-end">
              <Handle
                type="source"
                position={Position.Right}
                id={handle.id}
                aria-label={`Saída ${handle.label}`}
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#070709",
                  border: `2.5px solid ${colorToken.hex}`,
                  borderRadius: "9999px",
                }}
                className="transition-transform hover:scale-125 !cursor-crosshair shadow-md"
              />
              <div className="absolute right-6 hidden group-hover/handle:flex items-center px-2 py-1 rounded-md bg-slate-900/95 text-[10px] font-medium text-slate-200 border border-slate-700 whitespace-nowrap shadow-xl z-50 pointer-events-none">
                {handle.label}
                <span className="w-2 h-2 rounded-full ml-1.5" style={{ backgroundColor: colorToken.hex }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Header do Nó */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800/80 bg-slate-900/40 rounded-t-2xl">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 shadow-inner"
            style={{ backgroundColor: `${accentColor}18`, border: `1px solid ${accentColor}40` }}
          >
            <Icon className="w-4 h-4" style={{ color: accentColor }} />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-slate-100 truncate tracking-tight">{title}</span>
            <span className="text-[10px] text-slate-400 capitalize font-mono">{nodeType}</span>
          </div>
        </div>

        {/* Badges de Custo & Status */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {getStatusBadge()}
          {creditCost > 0 ? (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-current" /> {creditCost}
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-semibold text-slate-400">
              Grátis
            </span>
          )}

          {/* Menu de Ações Rápidas */}
          <div className="flex items-center gap-0.5 ml-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedNodeId(id);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Configurações do Nó"
              aria-label="Abrir configurações"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateNode(id);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-violet-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Duplicar Nó"
              aria-label="Duplicar nó"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(id);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Excluir Nó"
              aria-label="Excluir nó"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Corpo do Nó */}
      <div className="p-3.5 space-y-3">{children}</div>

      {/* Mensagem de Erro Visual */}
      {error && (
        <div className="mx-3 mb-3 p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-[11px] text-red-300 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-400 mt-0.5" />
          <span className="line-clamp-2">{error}</span>
        </div>
      )}

      {/* Rodapé Opcional */}
      {footer && <div className="px-3.5 py-2 border-t border-slate-800/60 bg-slate-950/40 rounded-b-2xl">{footer}</div>}
    </div>
  );
});
