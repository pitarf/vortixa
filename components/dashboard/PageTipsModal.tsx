"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Lightbulb,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { PAGE_TIPS_DATA, PageTipData } from "@/lib/data/page-tips-data";

interface PageTipsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function PageTipsModal({ isOpen: controlledIsOpen, onClose: controlledOnClose }: PageTipsModalProps) {
  const pathname = usePathname();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [expandedAccordionId, setExpandedAccordionId] = useState<string | null>(null);

  // Encontra os dados da página atual
  const tipData: PageTipData | undefined =
    PAGE_TIPS_DATA[pathname] ||
    PAGE_TIPS_DATA[Object.keys(PAGE_TIPS_DATA).find((k) => pathname.startsWith(k) && k !== "/dashboard") || "/dashboard"];

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  // Abertura automática na 1ª visita à rota específica
  useEffect(() => {
    if (!pathname || typeof window === "undefined") return;

    const storageKey = `vorixa_tip_seen_${pathname}`;
    const alreadySeen = localStorage.getItem(storageKey);

    if (!alreadySeen && tipData) {
      const timer = setTimeout(() => {
        setInternalIsOpen(true);
        localStorage.setItem(storageKey, "true");
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [pathname, tipData]);

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const toggleAccordion = (id: string) => {
    setExpandedAccordionId((prev) => (prev === id ? null : id));
  };

  if (!isOpen || !tipData) return null;

  const Icon = tipData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in-50 duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-[#0D0E12] border border-[#1E202E] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tip-modal-title"
      >
        {/* Glow Superior */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-violet-600/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* Botão Fechar Fixo no Topo */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-[#070709]/90 border border-[#1E202E] hover:border-slate-600 text-slate-400 hover:text-white transition-all cursor-pointer shadow-md"
          aria-label="Fechar dicas"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Fixo */}
        <div className="p-5 sm:p-7 pb-4 border-b border-[#1E202E] shrink-0 pr-14 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${tipData.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span>Dica de Ferramenta</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 font-bold">
                  {tipData.badgeText}
                </span>
              </div>
              <h2 id="tip-modal-title" className="text-lg sm:text-xl font-black text-white font-heading tracking-tight">
                {tipData.title}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {tipData.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Corpo Rolável */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Seção 1: O Que Dá Para Fazer Nesta Tela */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                Como usar esta ferramenta (Passo a Passo)
              </span>
              {tipData.recommendedModel && (
                <span className="text-[10px] font-mono text-violet-400 font-semibold hidden sm:inline">
                  Recomendado: {tipData.recommendedModel}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {tipData.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#070709] border border-[#1E202E] hover:border-slate-700/80 transition-all space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <strong className="text-xs font-bold text-slate-200">{step.title}</strong>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed pl-6">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Seção 2: Acordeão de Dúvidas Técnicas & Detalhes Aprofundados */}
          {tipData.accordions && tipData.accordions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#1E202E]">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-[11px] font-mono uppercase font-bold text-slate-300 tracking-wider">
                  Dúvidas Frequentes & Detalhes Desta Tela
                </span>
              </div>

              <div className="space-y-2">
                {tipData.accordions.map((item) => {
                  const isExpanded = expandedAccordionId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border transition-all ${
                        isExpanded
                          ? "border-violet-500/40 bg-[#070709] shadow-md"
                          : "border-[#1E202E] bg-[#0A0B0E] hover:border-slate-700"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(item.id)}
                        className="w-full flex items-center justify-between p-3 sm:p-3.5 text-left cursor-pointer"
                      >
                        <span className="text-xs font-bold text-slate-200 pr-2">
                          {item.title}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-violet-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 text-[11px] text-slate-300 leading-relaxed border-t border-[#1E202E]/60 animate-in fade-in-50 duration-200">
                          {item.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Seção 3: Dica Especial de Pro */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#13141B] to-[#070709] border border-violet-500/30 flex items-start gap-2.5 text-xs">
            <div className="p-1 rounded-lg bg-violet-600/20 text-violet-300 shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-amber-300" />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-violet-300 text-[11px] uppercase tracking-wider block">
                Dica Especial do VORIXA
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {tipData.proTip}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Fixo */}
        <div className="p-4 sm:p-5 border-t border-[#1E202E] bg-[#0A0B0E] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Releia a qualquer momento clicando em "💡 Dicas da Página" no topo.</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white shadow-md shadow-violet-600/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            style={{ minHeight: "40px" }}
          >
            <span>Entendido, vamos criar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Botão Compacto para o Header do Dashboard
 */
export function PageTipsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ver dicas desta ferramenta"
      title="Ver o que dá para fazer nesta página"
      className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#0D0E12] hover:bg-[#13141B] border border-[#1E202E] hover:border-amber-500/50 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm group active:scale-95"
      style={{ minHeight: "40px" }}
    >
      <Lightbulb className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
      <span className="text-xs font-semibold hidden lg:inline">Dicas da Página</span>
    </button>
  );
}
