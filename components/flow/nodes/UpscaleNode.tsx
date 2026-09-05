"use client";

import React, { memo, useCallback } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { FlowNodeData, useFlowStore } from "@/stores/flow-store";
import { isSafeMediaUrl } from "@/lib/flow-utils";
import { Sparkles, Maximize2 } from "lucide-react";

/**
 * Nó de Creative Upscale 4K no VORIXA FLOW.
 */
export const UpscaleNode = memo(function UpscaleNode({ id, data, selected }: NodeProps<any>) {
  const nodeData = data as FlowNodeData;
  const { updateNodeConfig, setLightboxMedia } = useFlowStore();
  const config = (nodeData.config || {}) as { scaleFactor?: number; targetResolution?: string };
  const rawUrl = (nodeData.outputs?.output_video || nodeData.outputs?.url) as string | undefined;
  const outputVideoUrl = isSafeMediaUrl(rawUrl) ? rawUrl : undefined;

  const handleScaleFactor = useCallback(
    (factor: 2 | 4) => {
      updateNodeConfig(id, { scaleFactor: factor, targetResolution: factor === 4 ? "4k" : "2k" });
    },
    [id, updateNodeConfig]
  );

  return (
    <BaseNode
      id={id}
      nodeType="upscale"
      title={nodeData.title}
      creditCost={nodeData.creditCost || 5}
      status={nodeData.status}
      error={nodeData.error}
      selected={selected}
      icon={Sparkles}
      accentColor="#F59E0B"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Escala</label>
          <div className="flex gap-1">
            {[2, 4].map((factor) => (
              <button
                key={factor}
                onClick={() => handleScaleFactor(factor as 2 | 4)}
                aria-label={`Escala ${factor}x`}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-medium transition-all cursor-pointer ${
                  (config.scaleFactor || 2) === factor
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800/80"
                }`}
              >
                {factor}x ({factor === 4 ? "4K" : "2K"})
              </button>
            ))}
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
            aria-label="Assistir vídeo em resolução ampliada"
            className="w-full py-1.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" /> Assistir Vídeo em 4K
          </button>
        )}
      </div>
    </BaseNode>
  );
});
