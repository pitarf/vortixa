"use client";

import React from "react";
import {
  Wand2,
  Pencil,
  Check,
  MoreHorizontal,
  Boxes,
  ChevronRight,
} from "lucide-react";

interface StudioHeaderProps {
  projectName: string;
  isEditingName: boolean;
  tempProjectName: string;
  onTempProjectNameChange: (val: string) => void;
  onStartEditingName: () => void;
  onConfirmProjectName: () => void;
  onSaveProject: () => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onClearFields: () => void;
  onCopyPrompt: () => void;
  onOpenLibrary: () => void;
  onOpenInFlow: () => void;
  isOpeningInFlow: boolean;
  activeStep: number;
  onStepChange: (step: number) => void;
}

const WORKFLOW_STEPS = [
  { step: 1, title: "Tipo de Mídia", subtitle: "Selecione o que criar" },
  { step: 2, title: "Prompt & Referências", subtitle: "Descreva sua cena" },
  { step: 3, title: "Parâmetros", subtitle: "Ajuste o estilo" },
  { step: 4, title: "Gerar & Refinar", subtitle: "Veja o resultado" },
];

export function StudioHeader({
  projectName,
  isEditingName,
  tempProjectName,
  onTempProjectNameChange,
  onStartEditingName,
  onConfirmProjectName,
  onSaveProject,
  isMenuOpen,
  onToggleMenu,
  onClearFields,
  onCopyPrompt,
  onOpenLibrary,
  onOpenInFlow,
  isOpeningInFlow,
  activeStep,
  onStepChange,
}: StudioHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Barra Superior com Título, Nome Editável, Ações Rápidas e Botão Flow */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E202E] pb-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 flex-shrink-0">
            <Wand2 className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
                Studio CREATE
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-violet-950/60 border border-violet-500/30 text-violet-400 font-bold uppercase tracking-wider">
                v2.0 Turbo
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Do conceito ao resultado. Crie imagens, vídeos e avatares com IA em um estúdio integrado.
            </p>
          </div>
        </div>

        {/* Controles de Projeto e Ações Rápidas */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Nome do Projeto Editável */}
          <div className="flex items-center bg-[#0D0E12] border border-[#1E202E] rounded-xl px-3 py-1.5 focus-within:border-violet-500 transition-all">
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempProjectName}
                  onChange={(e) => onTempProjectNameChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onConfirmProjectName();
                    }
                  }}
                  autoFocus
                  className="bg-transparent text-xs text-white outline-none w-36 font-semibold"
                />
                <button
                  type="button"
                  onClick={onConfirmProjectName}
                  className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  aria-label="Confirmar nome"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onStartEditingName}
                className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer group"
              >
                <span className="truncate max-w-[140px]">{projectName}</span>
                <Pencil className="h-3 w-3 text-slate-500 group-hover:text-violet-400 transition-colors" />
              </button>
            )}
          </div>

          {/* Botão Salvar */}
          <button
            type="button"
            onClick={onSaveProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D0E12] hover:bg-[#13141B] border border-[#1E202E] text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <span>Salvar</span>
          </button>

          {/* Menu Reticências */}
          <div className="relative">
            <button
              type="button"
              onClick={onToggleMenu}
              className="p-2.5 rounded-xl bg-[#0D0E12] hover:bg-[#13141B] border border-[#1E202E] text-slate-400 hover:text-white transition-all cursor-pointer"
              style={{ minHeight: "44px", minWidth: "44px" }}
              aria-label="Mais opções"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0D0E12] border border-[#1E202E] shadow-2xl p-1.5 z-50 text-xs space-y-1">
                <button
                  type="button"
                  onClick={onClearFields}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#13141B] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Limpar todos os campos
                </button>
                <button
                  type="button"
                  onClick={onCopyPrompt}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#13141B] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Copiar prompt atual
                </button>
                <button
                  type="button"
                  onClick={onOpenLibrary}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#13141B] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Abrir Galeria & Histórico
                </button>
              </div>
            )}
          </div>

          {/* Botão Enviar para o Flow */}
          <button
            type="button"
            onClick={onOpenInFlow}
            disabled={isOpeningInFlow}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 active:scale-95 text-white text-xs font-bold shadow-lg shadow-violet-600/25 transition-all cursor-pointer disabled:opacity-50"
            style={{ minHeight: "44px" }}
          >
            <Boxes className="h-4 w-4" />
            <span>{isOpeningInFlow ? "Criando Flow..." : "Enviar para o Flow"}</span>
          </button>
        </div>
      </div>

      {/* Workflow Stepper Horizontal */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center justify-between min-w-[700px] gap-2 p-1.5 bg-[#0D0E12] border border-[#1E202E] rounded-2xl">
          {WORKFLOW_STEPS.map((item, idx) => {
            const isActive = activeStep === item.step;
            return (
              <React.Fragment key={item.step}>
                <button
                  type="button"
                  onClick={() => onStepChange(item.step)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all cursor-pointer flex-1 ${
                    isActive
                      ? "bg-cyan-950/30 border border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "hover:bg-[#13141B] opacity-75 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-black font-mono transition-all ${
                      isActive
                        ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30"
                        : "bg-[#13141B] border border-[#1E202E] text-slate-400"
                    }`}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div className={`text-xs font-bold leading-tight ${isActive ? "text-cyan-300" : "text-slate-200"}`}>
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">{item.subtitle}</div>
                  </div>
                </button>

                {idx < 3 && <ChevronRight className="h-4 w-4 text-slate-700 flex-shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
