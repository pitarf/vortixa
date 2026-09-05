"use client";

import React, { memo } from "react";
import { EdgeProps, getBezierPath, BaseEdge } from "@xyflow/react";
import { useFlowStore } from "@/stores/flow-store";
import { FLOW_HANDLE_COLORS } from "@/types/flow";
import { X } from "lucide-react";

export const CustomEdge = memo(function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  sourceHandleId,
}: EdgeProps) {
  const { isExecuting, edges, setEdges, takeSnapshot } = useFlowStore();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleType = (sourceHandleId?.split("_")[1] || "any") as keyof typeof FLOW_HANDLE_COLORS;
  const colorToken = FLOW_HANDLE_COLORS[handleType] || FLOW_HANDLE_COLORS.any;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    takeSnapshot();
    setEdges(edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: isExecuting ? colorToken.hex : selected ? "#A78BFA" : "#334155",
          strokeWidth: selected || isExecuting ? 2.5 : 1.8,
          strokeDasharray: isExecuting ? "6, 6" : undefined,
          animation: isExecuting ? "flowDash 1.2s linear infinite" : undefined,
          filter: isExecuting ? `drop-shadow(0 0 6px ${colorToken.hex}80)` : undefined,
          transition: "stroke 0.2s, stroke-width 0.2s",
        }}
      />

      {/* Botão de Exclusão da Conexão ao passar mouse ou selecionar */}
      {selected && (
        <foreignObject
          width={24}
          height={24}
          x={labelX - 12}
          y={labelY - 12}
          className="overflow-visible pointer-events-auto"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <button
            onClick={handleDelete}
            className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50 flex items-center justify-center shadow-lg transition-all transform hover:scale-110 cursor-pointer"
            title="Remover Conexão"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </foreignObject>
      )}
    </>
  );
});
