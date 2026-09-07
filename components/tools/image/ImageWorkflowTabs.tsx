"use client";

import React from "react";
import { Type, Image as ImageIcon, Palette, User, LayoutGrid } from "lucide-react";
import { CreationMode } from "./types";

interface ImageWorkflowTabsProps {
  creationMode: CreationMode;
  onSelectMode: (mode: CreationMode) => void;
}

const WORKFLOW_TABS = [
  { id: "text-to-image" as CreationMode, label: "Texto para Imagem", icon: Type },
  { id: "image-to-image" as CreationMode, label: "Imagem para Imagem", icon: ImageIcon },
  { id: "style-ref" as CreationMode, label: "Estilo de Referência", icon: Palette },
  { id: "character" as CreationMode, label: "Personagem", icon: User },
  { id: "composition" as CreationMode, label: "Composição Avançada", icon: LayoutGrid },
];

export function ImageWorkflowTabs({
  creationMode,
  onSelectMode,
}: ImageWorkflowTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#1E202E]/60">
      {WORKFLOW_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = creationMode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectMode(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-violet-600/25 ring-1 ring-white/20"
                : "bg-[#0D0E12] text-slate-400 border border-[#1E202E] hover:border-slate-700 hover:text-slate-200"
            }`}
            style={{ minHeight: "40px" }}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
