"use client";

import React, { memo, useCallback } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { FlowNodeData, useFlowStore } from "@/stores/flow-store";
import { isSafeMediaUrl } from "@/lib/flow-utils";
import { Video, Maximize2, Download, Film } from "lucide-react";

/**
 * Nó de Geração de Vídeo Kling AI no VORIXA FLOW.
 */
export const VideoNode = memo(function VideoNode({ id, data, selected }: NodeProps<any>) {
  const nodeData = data as FlowNodeData;
  const { updateNodeConfig, setLightboxMedia } = useFlowStore();
  const config = (nodeData.config || {}) as { duration?: number; motionStrength?: number; cameraMovement?: string };

  const rawUrl = (nodeData.outputs?.output_video || nodeData.outputs?.url) as string | undefined;
  const outputVideoUrl = isSafeMediaUrl(rawUrl) ? rawUrl : undefined;

  const handleDurationToggle = useCallback(
    (duration: 5 | 10) => {
      updateNodeConfig(id, { duration });
    },
    [id, updateNodeConfig]
  );

  return (
    <BaseNode
      id={id}
      nodeType="video"
      title={nodeData.title}
      creditCost={nodeData.creditCost || 10}
      status={nodeData.status}
      error={nodeData.error}
      selected={selected}
      icon={Video}
      accentColor="#10B981"
    >
      <div className="space-y-2.5">
        {/* Controles de Duração */}
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Duração</label>
          <div className="flex gap-1">
            {[5, 10].map((dur) => (
              <button
                key={dur}
                onClick={() => handleDurationToggle(dur as 5 | 10)}
                aria-label={`Duração ${dur} segundos`}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-medium transition-all cursor-pointer ${
                  (config.duration || 5) === dur
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800/80"
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>
        </div>

        {/* Preview do Vídeo */}
        {outputVideoUrl ? (
          <div className="relative group/video rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center">
            <video
              src={outputVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover/video:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  setLightboxMedia({
                    url: outputVideoUrl,
                    type: "video",
                    title: nodeData.title,
                  })
                }
                className="p-1.5 rounded-lg bg-slate-900/90 text-slate-200 hover:text-emerald-400 border border-slate-700 transition-colors shadow-lg cursor-pointer"
                title="Cinema Lightbox"
                aria-label="Assistir vídeo no lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <a
                href={outputVideoUrl}
                download="vorixa-kling-video.mp4"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-slate-900/90 text-slate-200 hover:text-emerald-400 border border-slate-700 transition-colors shadow-lg"
                title="Download Vídeo"
                aria-label="Download do vídeo"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="py-4 rounded-xl border border-dashed border-slate-800/80 bg-slate-900/20 flex flex-col items-center justify-center text-slate-600 gap-1">
            <Film className="w-6 h-6 stroke-[1.5]" />
            <span className="text-[10px]">Requer nó de Imagem conectado</span>
          </div>
        )}
      </div>
    </BaseNode>
  );
});
