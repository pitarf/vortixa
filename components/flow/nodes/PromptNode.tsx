"use client";

import React, { memo, useCallback } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { FlowNodeData, useFlowStore } from "@/stores/flow-store";
import { Type, Sparkles } from "lucide-react";

const STYLE_PRESETS = [
  { id: "cinematic", label: "Cinemático" },
  { id: "photorealistic", label: "Fotorrealista" },
  { id: "anime", label: "Anime / Concept" },
  { id: "cyberpunk", label: "Cyberpunk" },
  { id: "3d_render", label: "Render 3D" },
];

export const PromptNode = memo(function PromptNode({ id, data, selected }: NodeProps<any>) {
  const nodeData = data as FlowNodeData;
  const { updateNodeConfig } = useFlowStore();
  const config = (nodeData.config || {}) as { prompt?: string; stylePreset?: string };

  const handlePromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeConfig(id, { prompt: e.target.value });
    },
    [id, updateNodeConfig]
  );

  const handlePresetSelect = useCallback(
    (presetId: string) => {
      updateNodeConfig(id, { stylePreset: presetId });
    },
    [id, updateNodeConfig]
  );

  const promptLength = config.prompt?.length || 0;

  return (
    <BaseNode
      id={id}
      nodeType="prompt"
      title={nodeData.title}
      creditCost={0}
      status={nodeData.status}
      error={nodeData.error}
      selected={selected}
      icon={Type}
      accentColor="#8B5CF6"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-400" /> Prompt Criativo
          </span>
          <span className="font-mono text-[10px] text-slate-500">{promptLength} caracteres</span>
        </div>

        <textarea
          value={config.prompt || ""}
          onChange={handlePromptChange}
          placeholder="Descreva a cena ou elemento que deseja gerar..."
          rows={3}
          className="w-full px-2.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none font-sans transition-all leading-relaxed"
        />

        <div className="flex flex-wrap gap-1 pt-1">
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                config.stylePreset === preset.id
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </BaseNode>
  );
});
