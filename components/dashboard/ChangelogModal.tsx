"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  ArrowRight,
  Search,
  Zap,
  Wand2,
  Video,
  Layers,
  Coins,
  ShieldCheck,
  Check,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import {
  CHANGELOG_ITEMS,
  ChangelogCategory,
  ChangelogItem,
} from "@/lib/data/changelog-data";

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: (ChangelogCategory | "Todos")[] = [
  "Todos",
  "Modelos de IA",
  "Estúdio & Flow",
  "Ferramentas",
  "Plataforma",
];

export function ChangelogModal({ isOpen, onClose }: ChangelogModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ChangelogCategory | "Todos">("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  // Fechar com ESC e travar scroll do body
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = CHANGELOG_ITEMS.filter((item) => {
    const matchesCategory =
      selectedCategory === "Todos" || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.badge.toLowerCase().includes(query) ||
      item.highlights.some((h) => h.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="changelog-modal-title"
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] rounded-3xl bg-[#0D0E12] border border-[#1E202E] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER DO MODAL ================= */}
        <div className="p-5 border-b border-[#1E202E] bg-gradient-to-r from-[#0D0E12] via-[#13141B] to-[#0D0E12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Sparkles className="h-5 w-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="changelog-modal-title"
                  className="text-base sm:text-lg font-bold text-white font-heading tracking-wide"
                >
                  Novidades & Versões no VORIXA
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  OS 2.5 Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore todos os modelos neurais e recursos ativos na plataforma.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-[#070709] border border-[#1E202E] text-slate-400 hover:text-white hover:bg-[#1E202E] transition-colors cursor-pointer"
            style={{ minHeight: "44px", minWidth: "44px" }}
            aria-label="Fechar janela"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================= BARRA DE BUSCA & FILTROS ================= */}
        <div className="p-4 bg-[#070709] border-b border-[#1E202E] space-y-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar modelos, ferramentas ou novidades (ex: Google, 60fps, 4K)..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#0D0E12] border border-[#1E202E] hover:border-cyan-500/40 focus:border-cyan-500 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
              style={{ minHeight: "44px" }}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm"
                      : "bg-[#0D0E12] border border-[#1E202E] text-slate-400 hover:text-slate-200"
                  }`}
                  style={{ minHeight: "36px" }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= LISTA DE NOVIDADES SCROLLÁVEL ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#070709]/50">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-300">
                Nenhum recurso encontrado para "{searchQuery}".
              </p>
              <p className="text-xs text-slate-500">
                Tente buscar por termos como "Imagen", "Kling", "FLUX" ou selecione a categoria "Todos".
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Todos");
                }}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#13141B] border border-[#1E202E] text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                Limpar Busca
              </button>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#0D0E12] border border-[#1E202E] hover:border-cyan-500/30 transition-all space-y-3 group"
              >
                {/* Topo do Card: Título + Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${item.badgeColor.bg} ${item.badgeColor.text} ${item.badgeColor.border}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-[#13141B] border border-[#1E202E]">
                      {item.category}
                    </span>
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* Resumo Técnico */}
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                {/* Bullets de Destaques */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                  {item.highlights.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                      <Check className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Métricas e Botão de Ação */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E202E]">
                  <div className="flex items-center gap-2">
                    {item.metrics?.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#13141B] border border-[#1E202E] text-slate-300"
                      >
                        <strong className="text-slate-400">{m.label}:</strong> {m.value}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-cyan-500/20 to-violet-500/20 hover:from-cyan-500/30 hover:to-violet-500/30 border border-cyan-500/40 text-cyan-200 hover:text-white transition-all shadow-sm group/btn cursor-pointer"
                    style={{ minHeight: "36px" }}
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= RODAPÉ DO MODAL ================= */}
        <div className="p-4 border-t border-[#1E202E] bg-[#0D0E12] flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Total de <strong>13 recursos ativos</strong> no VORIXA CREATIVE OS.
          </span>

          <Link
            href="/dashboard/changelog"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Ver histórico completo & roadmap</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}