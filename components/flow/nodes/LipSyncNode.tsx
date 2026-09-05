"use client";

import React, { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { FlowNodeData, useFlowStore } from "@/stores/flow-store";
import { isSafeMediaUrl } from "@/lib/flow-utils";
import { Mic, Maximize2 } from "lucide-react";

/**
 * Nó de Sincronização Labial LipSync no VORIXA FLOW.
 */
export const LipSyncNode = memo(function LipSyncNode({ id, data, selected }: NodeProps<any>) {
  const nodeData = data as FlowNodeData;
  const { setLightboxMedia } = useFlowStore();
  const rawUrl = (nodeData.outputs?.output_video || nodeData.outputs?.url) as string | undefined;
  const outputVideoUrl = isSafeMediaUrl(rawUrl) ? rawUrl : undefined;

  return (
    <BaseNode
      id={id}
      nodeType="lipsync"
      title={nodeData.title}
      creditCost={nodeData.creditCost || 8}
      status={nodeData.status}
      error={nodeData.error}
      selected={selected}
      icon={Mic}
      accentColor="#EC4899"
    >
      <div className="space-y-2">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex justify-between">
            <span>Modelo:</span>
            <span className="text-pink-400 font-mono font-medium">Sync 1.5 HD</span>
          </div>
          <div className="flex justify-between">
            <span>Rastreio Facial:</span>
            <span className="text-emerald-400 font-semibold">Ativo</span>
          </div>
        </div>

        {outputVideoUrl && (
          <button
            onClick={() =>
              setLightboxMedia({
                url: outputVideoUrl,
                type: "video",
                title: nodeData.title,
              })
            }
            aria-label="Assistir vídeo sincronizado"
            className="w-full py-1.5 px-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" /> Assistir Vídeo Sincronizado
          </button>
        )}
      </div>
    </BaseNode>
  );
});
