"use client";

import React, { memo, useCallback } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { FlowNodeData, useFlowStore } from "@/stores/flow-store";
import { isSafeMediaUrl } from "@/lib/flow-utils";
import { Image, Maximize2, Download } from "lucide-react";

const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"] as const;

/**
 * Nó de Geração de Imagem FLUX no VORIXA FLOW.
 */
export const ImageNode = memo(function ImageNode({ id, data, selected }: NodeProps<any>) {
  const nodeData = data as FlowNodeData;
  const { updateNodeConfig, setLightboxMedia } = useFlowStore();
  const config = (nodeData.config || {}) as { prompt?: string; aspectRatio?: string };

  const rawUrl = (nodeData.outputs?.output_image || nodeData.outputs?.url) as string | undefined;
  const outputImageUrl = isSafeMediaUrl(rawUrl) ? rawUrl : undefined;

  const handleAspectChange = useCallback(
    (ratio: string) => {
      updateNodeConfig(id, { aspectRatio: ratio as any });
    },
    [id, updateNodeConfig]
  );

  return (
    <BaseNode
      id={id}
      nodeType="image"
      title={nodeData.title}
      creditCost={nodeData.creditCost || 1}
      status={nodeData.status}
      error={nodeData.error}
      selected={selected}
      icon={Image}
      accentColor="#06B6D4"
    >
      <div className="space-y-2.5">
        {/* Proporção da Imagem */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Proporção (Aspect Ratio)
          </label>
          <div className="grid grid-cols-5 gap-1">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio}
                onClick={() => handleAspectChange(ratio)}
                aria-label={`Selecionar proporção ${ratio}`}
                className={`py-1 rounded-lg text-[10px] font-mono font-medium transition-all cursor-pointer ${
                  (config.aspectRatio || "1:1") === ratio
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800/80"
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Preview do Output Gerado */}
        {outputImageUrl ? (
          <div className="relative group/preview rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center">
            <img src={outputImageUrl} alt="Gerado por FLUX" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  setLightboxMedia({
                    url: outputImageUrl,
                    type: "image",
                    title: nodeData.title,
                    prompt: config.prompt,
                  })
                }
                className="p-1.5 rounded-lg bg-slate-900/90 text-slate-200 hover:text-cyan-400 border border-slate-700 transition-colors shadow-lg cursor-pointer"
                title="Expandir Lightbox"
                aria-label="Expandir imagem no lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <a
                href={outputImageUrl}
                download="vorixa-flux-image.jpg"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-slate-900/90 text-slate-200 hover:text-cyan-400 border border-slate-700 transition-colors shadow-lg"
                title="Download da Imagem"
                aria-label="Fazer download da imagem"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="py-4 rounded-xl border border-dashed border-slate-800/80 bg-slate-900/20 flex flex-col items-center justify-center text-slate-600 gap-1">
            <Image className="w-6 h-6 stroke-[1.5]" />
            <span className="text-[10px]">Aguardando conexão ou execução</span>
          </div>
        )}
      </div>
    </BaseNode>
  );
});
