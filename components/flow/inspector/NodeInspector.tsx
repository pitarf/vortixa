"use client";

import React, { useMemo } from "react";
import { useFlowStore } from "@/stores/flow-store";
import { isSafeMediaUrl, formatExecutionTime } from "@/lib/flow-utils";
import {
  X,
  SlidersHorizontal,
  Trash2,
  Copy,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  Maximize2,
  Download,
} from "lucide-react";

/**
 * Painel Inspetor Lateral do VORIXA FLOW.
 * Permite configuração granular de nós selecionados, ajuste de parâmetros de IA e auditoria de outputs.
 */
export function NodeInspector() {
  const {
    nodes,
    selectedNodeId,
    inspectorOpen,
    setInspectorOpen,
    updateNodeConfig,
    updateNodeTitle,
    duplicateNode,
    deleteNode,
    setLightboxMedia,
  } = useFlowStore();

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId);
  }, [nodes, selectedNodeId]);

  if (!inspectorOpen || !selectedNode) return null;

  const { data } = selectedNode;
  const config = (data.config || {}) as Record<string, any>;
  const outputUrl = (data.outputs?.url || data.outputs?.output_image || data.outputs?.output_video) as string | undefined;
  const isSafeOutput = isSafeMediaUrl(outputUrl);
  const executionDuration = formatExecutionTime(data.startedAt, data.completedAt);

  return (
    <aside
      role="complementary"
      aria-label="Inspetor de propriedades do nó"
      className="fixed inset-x-3 bottom-3 top-20 sm:top-20 sm:right-4 sm:left-auto sm:bottom-4 sm:w-96 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-slate-800/90 shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col z-30 overflow-hidden animate-in slide-in-from-right-5 duration-200"
    >
      {/* Header do Inspector */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold text-slate-100 truncate">Inspetor de Nó</span>
            <span className="text-[10px] text-slate-400 capitalize font-mono">{data.nodeType}</span>
          </div>
        </div>

        <button
          onClick={() => setInspectorOpen(false)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Fechar inspetor"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Conteúdo com scroll em grupos lógicos */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
        {/* SEÇÃO 1: GERAL */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Nome do Nó (Identificação)
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateNodeTitle(selectedNode.id, e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 transition-all font-medium"
            placeholder="Nome do nó..."
          />
        </div>

        {/* SEÇÃO 2: MODELO & HARDWARE */}
        <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Informações do Modelo
          </span>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Consumo:</span>
            <span className="font-mono text-amber-400 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              {data.creditCost ? `${data.creditCost} créditos` : "Grátis"}
            </span>
          </div>
          {data.toolSlug && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Motor IA:</span>
              <span className="font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                {data.toolSlug}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status do Nó:</span>
            <span
              className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                data.status === "COMPLETED"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : data.status === "RUNNING"
                  ? "bg-violet-500/10 text-violet-400 border border-violet-500/30 animate-pulse"
                  : data.status === "FAILED"
                  ? "bg-red-500/10 text-red-400 border border-red-500/30"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {data.status || "IDLE"}
            </span>
          </div>
          {executionDuration && (
            <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" /> Duração:
              </span>
              <span className="font-mono text-slate-300">{executionDuration}</span>
            </div>
          )}
        </div>

        {/* SEÇÃO 3: PARÂMETROS ESPECÍFICOS DO NÓ */}
        <div className="space-y-3 pt-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Parâmetros de Geração
          </span>

          {data.nodeType === "prompt" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Descrição do Prompt
                </label>
                <textarea
                  value={config.prompt || ""}
                  onChange={(e) => updateNodeConfig(selectedNode.id, { prompt: e.target.value })}
                  rows={5}
                  placeholder="Insira o prompt descritivo da cena..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Prompt Negativo
                </label>
                <textarea
                  value={config.negativePrompt || ""}
                  onChange={(e) => updateNodeConfig(selectedNode.id, { negativePrompt: e.target.value })}
                  rows={2}
                  placeholder="Elementos indesejados na geração..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>
            </div>
          )}

          {data.nodeType === "image" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Proporção de Tela
                </label>
                <select
                  value={config.aspectRatio || "16:9"}
                  onChange={(e) => updateNodeConfig(selectedNode.id, { aspectRatio: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="1:1">1:1 (Quadrado / Feed)</option>
                  <option value="16:9">16:9 (Cinemático Widescreen)</option>
                  <option value="9:16">9:16 (Stories / Reels / TikTok)</option>
                  <option value="4:3">4:3 (Formato Padrão)</option>
                  <option value="3:4">3:4 (Retrato)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Formato de Renderização
                </label>
                <select
                  value={config.outputFormat || "jpeg"}
                  onChange={(e) => updateNodeConfig(selectedNode.id, { outputFormat: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="jpeg">JPEG (Rápido e Equilibrado)</option>
                  <option value="png">PNG (Máxima Fidelidade Sem Compressão)</option>
                  <option value="webp">WEBP (Compacto e Moderno)</option>
                </select>
              </div>
            </div>
          )}

          {data.nodeType === "video" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Duração do Take
                </label>
                <select
                  value={config.duration || 5}
                  onChange={(e) => updateNodeConfig(selectedNode.id, { duration: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="5">5 Segundos (Take Dinâmico)</option>
                  <option value="10">10 Segundos (Cena Estendida)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Movimento de Câmera
                </label>
                <select
                  value={config.cameraMovement || "static"}
                  onChange={(e) => updateNodeConfig(selectedNode.id, { cameraMovement: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="static">Estático / Suave</option>
                  <option value="zoom_in">Zoom In (Aproximação)</option>
                  <option value="zoom_out">Zoom Out (Afastamento)</option>
                  <option value="pan_left">Panorâmica Esquerda</option>
                  <option value="pan_right">Panorâmica Direita</option>
                  <option value="orbit">Órbita Circular 360°</option>
                </select>
              </div>
            </div>
          )}

          {data.nodeType === "upscale" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Fator de Resolução
                </label>
                <select
                  value={config.scaleFactor || 2}
                  onChange={(e) => updateNodeConfig(selectedNode.id, { scaleFactor: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="2">2x (Resolução 2K HD)</option>
                  <option value="4">4x (Master Ultra HD 4K)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 4: RESULTADO GERADO (OUTPUT) */}
        {outputUrl && isSafeOutput && (
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Resultado da Execução
            </span>
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center">
              {data.nodeType === "video" || data.nodeType === "lipsync" || data.nodeType === "upscale" ? (
                <video src={outputUrl} controls className="w-full h-full object-contain" />
              ) : (
                <img src={outputUrl} alt="Output do nó" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() =>
                  setLightboxMedia({
                    url: outputUrl,
                    type: data.nodeType === "image" ? "image" : "video",
                    title: data.title,
                    prompt: config.prompt,
                  })
                }
                className="flex-1 py-1.5 px-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" /> Abrir Lightbox
              </button>
              <a
                href={outputUrl}
                download={`vorixa-${data.nodeId}`}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                title="Download do Arquivo"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Dica de Encadeamento */}
        <div className="p-3 rounded-2xl bg-violet-950/20 border border-violet-500/20 flex items-start gap-2 text-[11px] text-violet-300">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-violet-400" />
          <span>
            Os dados de saída dos nós conectados alimentam automaticamente a entrada deste nó durante a execução em cadeia.
          </span>
        </div>
      </div>

      {/* Footer com Ações */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between gap-2">
        <button
          onClick={() => duplicateNode(selectedNode.id)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-all cursor-pointer min-h-[44px] flex-1"
        >
          <Copy className="w-3.5 h-3.5" /> Duplicar
        </button>

        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-semibold transition-all cursor-pointer min-h-[44px] flex-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Excluir
        </button>
      </div>
    </aside>
  );
}
