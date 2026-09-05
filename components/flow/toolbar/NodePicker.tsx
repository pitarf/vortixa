"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useFlowStore } from "@/stores/flow-store";
import { FlowNodeType } from "@/types/flow";
import {
  Search,
  X,
  Type,
  Image,
  Video,
  Mic,
  Activity,
  Sparkles,
  Download,
  Boxes,
  Zap,
} from "lucide-react";

interface NodeToolOption {
  type: FlowNodeType;
  title: string;
  category: "text" | "image" | "video" | "audio" | "motion" | "enhance";
  description: string;
  creditCost: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
}

const AVAILABLE_NODES: NodeToolOption[] = [
  {
    type: "prompt",
    title: "Prompt Criativo",
    category: "text",
    description: "Nó de texto para descrição rica e estilizada com presets conceituais.",
    creditCost: 0,
    icon: Type,
    accentColor: "#8B5CF6",
  },
  {
    type: "image",
    title: "FLUX Schnell Imagem",
    category: "image",
    description: "Geração ultrarrápida de imagens em alta resolução com FLUX.",
    creditCost: 1,
    icon: Image,
    accentColor: "#06B6D4",
  },
  {
    type: "video",
    title: "Kling Vídeo AI",
    category: "video",
    description: "Transforma imagens estáticas em vídeos fluidos e cinematográficos.",
    creditCost: 10,
    icon: Video,
    accentColor: "#10B981",
  },
  {
    type: "motion",
    title: "Motion Control Kling",
    category: "motion",
    description: "Transfira movimentos complexos de um vídeo para o seu personagem.",
    creditCost: 15,
    icon: Activity,
    accentColor: "#EC4899",
  },
  {
    type: "lipsync",
    title: "Lip Sync Sincronizado",
    category: "audio",
    description: "Sincronização labial fotorrealista com áudios e vozes carregadas.",
    creditCost: 8,
    icon: Mic,
    accentColor: "#F59E0B",
  },
  {
    type: "upscale",
    title: "Creative Upscale 4K",
    category: "enhance",
    description: "Amplie a nitidez, textura e resolução de vídeos para 4K.",
    creditCost: 5,
    icon: Sparkles,
    accentColor: "#A855F7",
  },
  {
    type: "export",
    title: "Exportar para Biblioteca",
    category: "enhance",
    description: "Salva o resultado final na galeria permanente ou faz download direto.",
    creditCost: 0,
    icon: Download,
    accentColor: "#64748B",
  },
];

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "text", label: "Texto" },
  { id: "image", label: "Imagem" },
  { id: "video", label: "Vídeo" },
  { id: "audio", label: "Áudio" },
  { id: "motion", label: "Motion" },
  { id: "enhance", label: "Melhorias" },
];

/**
 * Seletor de Nós Estilo Command Palette do VORIXA FLOW.
 */
export function NodePicker() {
  const { nodePickerOpen, setNodePickerOpen, addNode, nodePickerPosition } = useFlowStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredNodes = useMemo(() => {
    return AVAILABLE_NODES.filter((node) => {
      const matchesSearch =
        node.title.toLowerCase().includes(search.toLowerCase()) ||
        node.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || node.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const handleSelectNode = useCallback(
    (type: FlowNodeType) => {
      addNode(type, nodePickerPosition || undefined);
      setNodePickerOpen(false);
      setSearch("");
    },
    [addNode, nodePickerPosition, setNodePickerOpen]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && nodePickerOpen) {
        setNodePickerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodePickerOpen, setNodePickerOpen]);

  if (!nodePickerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Adicionar Nó ao Fluxo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-950/95 border border-slate-800/90 shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header do Picker */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Adicionar Nó ao Fluxo</h3>
              <p className="text-[11px] text-slate-400">Escolha uma ferramenta generativa ou controle de fluxo</p>
            </div>
          </div>

          <button
            onClick={() => setNodePickerOpen(false)}
            aria-label="Fechar seletor"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de Busca & Categorias */}
        <div className="p-4 border-b border-slate-800/80 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar nós (ex: Imagem, Kling, Sincronização, Upscale)..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Ferramentas */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {filteredNodes.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Nenhuma ferramenta encontrada para a busca realizada.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredNodes.map((node) => {
                const IconComponent = node.icon;
                return (
                  <button
                    key={node.type}
                    onClick={() => handleSelectNode(node.type)}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/40 hover:bg-slate-900/90 border border-slate-800/80 hover:border-violet-500/50 text-left transition-all group hover:scale-[1.01] hover:shadow-lg cursor-pointer"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${node.accentColor}18`,
                        border: `1px solid ${node.accentColor}40`,
                      }}
                    >
                      <IconComponent className="w-4 h-4" style={{ color: node.accentColor }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-100 group-hover:text-violet-300 transition-colors truncate">
                          {node.title}
                        </span>
                        {node.creditCost > 0 ? (
                          <span className="text-[10px] font-mono text-amber-400 font-bold flex-shrink-0 flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5 fill-current" /> {node.creditCost}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-medium flex-shrink-0">Grátis</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {node.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
