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
  { id: "image-to-image" as CreationMode, label: "Imagem de Referência", icon: ImageIcon },
  { id: "character" as CreationMode, label: "Mesmo Rosto (PuLID)", icon: User },
  { id: "style-ref" as CreationMode, label: "Estilo & Paleta", icon: Palette },
];

export function ImageWorkflowTabs({
  creationMode,
  onSelectMode,
}: ImageWorkflowTabsProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-[#070709] border border-[#1E202E] rounded-2xl overflow-x-auto no-scrollbar overscroll-x-contain touch-pan-x w-full">
      {WORKFLOW_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = creationMode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectMode(tab.id)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap shrink-0 min-h-[44px] cursor-pointer touch-manipulation select-none active:scale-[0.98] ${
              isActive
                ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-violet-600/30 ring-1 ring-white/20"
                : "text-slate-400 hover:text-white hover:bg-[#13141B]"
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
