"use client";

import React from "react";
import { Type, Image as ImageIcon, Palette, User } from "lucide-react";
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
];

export function ImageWorkflowTabs({
  creationMode,
  onSelectMode,
}: ImageWorkflowTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 px-0.5 scrollbar-none overscroll-x-contain touch-pan-x border-b border-[#1E202E]/60 -mx-1 sm:mx-0">
      {WORKFLOW_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = creationMode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectMode(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer touch-manipulation select-none active:scale-[0.98] ${
              isActive
                ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-violet-600/25 ring-1 ring-white/20"
                : "bg-[#0D0E12] text-slate-400 border border-[#1E202E] hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
