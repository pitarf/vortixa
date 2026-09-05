"use client";

import React, { useState } from "react";
import { useFlowStore } from "@/stores/flow-store";
import {
  Sparkles,
  X,
  Wand2,
  ArrowRight,
  Film,
  Zap,
} from "lucide-react";

const SUGGESTED_IDEAS = [
  "Crie uma imagem de um samurai futurista em Tóquio chuvosa e transforme em um vídeo com movimento de câmera.",
  "Gere um cenário de ficção científica espacial, crie o vídeo cinematográfico e faça upscale em 4K.",
  "Crie um retrato hiper-realista, gere um vídeo de movimento e aplique sincronização labial.",
];

export function AIFlowBuilderModal() {
  const { aiBuilderOpen, setAiBuilderOpen, applyAITemplate } = useFlowStore();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!aiBuilderOpen) return null;

  const handleGenerateProposal = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      // Interpreta a intenção do usuário e constrói o pipeline
      const lower = prompt.toLowerCase();

      let templateNodes: any[] = [];
      let templateEdges: any[] = [];

      if (lower.includes("upscale") || lower.includes("4k")) {
        templateNodes = [
          {
            nodeType: "prompt",
            title: "Prompt: Cena Cinemática",
            config: { prompt: prompt, stylePreset: "cinematic" },
            position: { x: 100, y: 150 },
          },
          {
            nodeType: "image",
            title: "FLUX: Geração Base",
            config: { aspectRatio: "16:9" },
            position: { x: 440, y: 150 },
          },
          {
            nodeType: "video",
            title: "Kling: Vídeo em Movimento",
            config: { duration: 5, cameraMovement: "zoom_in" },
            position: { x: 780, y: 150 },
          },
          {
            nodeType: "upscale",
            title: "Upscale: Master 4K",
            config: { scaleFactor: 4, targetResolution: "4k" },
            position: { x: 1120, y: 150 },
          },
        ];

        templateEdges = [
          { sourceIndex: 0, sourceHandle: "output_text", targetIndex: 1, targetHandle: "input_prompt" },
          { sourceIndex: 1, sourceHandle: "output_image", targetIndex: 2, targetHandle: "input_image" },
          { sourceIndex: 2, sourceHandle: "output_video", targetIndex: 3, targetHandle: "input_video" },
        ];
      } else if (lower.includes("lipsync") || lower.includes("voz") || lower.includes("fala")) {
        templateNodes = [
          {
            nodeType: "prompt",
            title: "Prompt: Personagem",
            config: { prompt: prompt, stylePreset: "photorealistic" },
            position: { x: 100, y: 150 },
          },
          {
            nodeType: "image",
            title: "FLUX: Retrato do Personagem",
            config: { aspectRatio: "16:9" },
            position: { x: 440, y: 150 },
          },
          {
            nodeType: "video",
            title: "Kling: Animação Facial",
            config: { duration: 5 },
            position: { x: 780, y: 150 },
          },
          {
            nodeType: "lipsync",
            title: "LipSync: Sincronia de Voz",
            config: {},
            position: { x: 1120, y: 150 },
          },
        ];

        templateEdges = [
          { sourceIndex: 0, sourceHandle: "output_text", targetIndex: 1, targetHandle: "input_prompt" },
          { sourceIndex: 1, sourceHandle: "output_image", targetIndex: 2, targetHandle: "input_image" },
          { sourceIndex: 2, sourceHandle: "output_video", targetIndex: 3, targetHandle: "input_video" },
        ];
      } else {
        templateNodes = [
          {
            nodeType: "prompt",
            title: "Prompt: Conceito Criativo",
            config: { prompt: prompt, stylePreset: "cinematic" },
            position: { x: 100, y: 150 },
          },
          {
            nodeType: "image",
            title: "FLUX: Renderização de Imagem",
            config: { aspectRatio: "16:9" },
            position: { x: 440, y: 150 },
          },
          {
            nodeType: "video",
            title: "Kling: Vídeo Dinâmico",
            config: { duration: 5, cameraMovement: "pan_right" },
            position: { x: 780, y: 150 },
          },
        ];

        templateEdges = [
          { sourceIndex: 0, sourceHandle: "output_text", targetIndex: 1, targetHandle: "input_prompt" },
          { sourceIndex: 1, sourceHandle: "output_image", targetIndex: 2, targetHandle: "input_image" },
        ];
      }

      setIsGenerating(false);
      applyAITemplate(templateNodes, templateEdges);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-950/95 border border-slate-800/80 shadow-[0_0_60px_rgba(139,92,246,0.2)] overflow-hidden flex flex-col">
        {/* Header do AI Builder */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-gradient-to-r from-violet-950/40 via-purple-950/30 to-cyan-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <span>✦ Build Flow with AI</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  IA Generativa
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Descreva sua ideia em linguagem natural e a IA montará o pipeline ideal.
              </p>
            </div>
          </div>

          <button
            onClick={() => setAiBuilderOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Descreva o que deseja criar:</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Crie um vídeo de uma nave espacial pousando em um planeta alienígena e aplique upscale 4K..."
              rows={4}
              autoFocus
              className="w-full px-3.5 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 leading-relaxed resize-none transition-all"
            />
          </div>

          {/* Sugestões Rápidas */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Wand2 className="w-3 h-3 text-cyan-400" /> Exemplos para inspirar:
            </span>
            <div className="space-y-1.5">
              {SUGGESTED_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(idea)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 text-xs text-slate-300 transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{idea}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer com Botão de Ação */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-end gap-3">
          <button
            onClick={() => setAiBuilderOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleGenerateProposal}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 hover:opacity-95 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Montando Pipeline...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Construir no Canvas</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
