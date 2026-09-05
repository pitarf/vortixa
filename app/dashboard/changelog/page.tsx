"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Check,
  ArrowRight,
  ChevronRight,
  Boxes,
  Wand2,
  Video,
  Layers,
  Coins,
  ShieldCheck,
  Zap,
  Activity,
  Calendar,
  Clock,
  ExternalLink,
  Flame,
} from "lucide-react";
import {
  CHANGELOG_ITEMS,
  ROADMAP_ITEMS,
  ChangelogCategory,
} from "@/lib/data/changelog-data";

const CATEGORIES: (ChangelogCategory | "Todos")[] = [
  "Todos",
  "Modelos de IA",
  "Estúdio & Flow",
  "Ferramentas",
  "Plataforma",
];

export default function ChangelogPage() {
  const [selectedCategory, setSelectedCategory] = useState<ChangelogCategory | "Todos">("Todos");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Agrupamento por versão
  const versionReleases = [
    {
      version: "VORIXA OS 2.5 - Supercharged AI & Imagen 3",
      tag: "Atual (Stable)",
      date: "Setembro 2026",
      items: filteredItems.filter((i) => i.version === "v2.5" || i.version === "Turbo" || i.version === "v2.2" || i.version === "4K AI"),
    },
    {
      version: "VORIXA OS 2.0 - Flow Workspace & Studio CREATE",
      tag: "Major Release",
      date: "Agosto 2026",
      items: filteredItems.filter((i) => i.version === "v2.0" || i.version === "v2.1" || i.version === "v3.0"),
    },
    {
      version: "VORIXA OS 1.5 - Cinematografia 60fps & Animação Facial",
      tag: "Core Engine",
      date: "Julho 2026",
      items: filteredItems.filter((i) => i.version === "v1.5" || i.version === "v1.8"),
    },
    {
      version: "VORIXA OS 1.0 - Plataforma & Infraestrutura",
      tag: "Foundations",
      date: "Junho 2026",
      items: filteredItems.filter((i) => i.version === "v2.3" || (i.category === "Plataforma" && !i.version)),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 pt-2 px-2 sm:px-4">
      {/* ================= BREADCRUMBS & HERO ================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-cyan-400 font-bold">Central de Novidades & Changelog</span>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0D0E12] via-[#13141B] to-[#070709] border border-[#1E202E] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>VORIXA CREATIVE OS 2.5 LIVE</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
                Novidades & Histórico de Versões
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                Acompanhe o lançamento de novos motores de inteligência artificial, atualizações do
                canvas visual VORIXA FLOW e ferramentas exclusivas de produção audiovisual.
              </p>
            </div>

            {/* Strip de 4 Métricas de Plataforma */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#1E202E]/80">
              <div className="p-3 rounded-2xl bg-[#070709]/80 border border-[#1E202E]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  Motores Neurais
                </span>
                <span className="text-lg font-black text-cyan-300 font-heading">5 Ativos</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#070709]/80 border border-[#1E202E]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  Latência Turbo
                </span>
                <span className="text-lg font-black text-violet-300 font-heading">&lt; 2.0s</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#070709]/80 border border-[#1E202E]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  Qualidade Máxima
                </span>
                <span className="text-lg font-black text-amber-300 font-heading">4K UHD</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#070709]/80 border border-[#1E202E]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  Disponibilidade
                </span>
                <span className="text-lg font-black text-emerald-300 font-heading">99.99%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BARRA DE FILTROS & BUSCA ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D0E12] border border-[#1E202E]">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none text-xs font-mono">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm"
                  : "bg-[#070709] border border-[#1E202E] text-slate-400 hover:text-white"
              }`}
              style={{ minHeight: "44px" }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por modelo, recurso ou tag..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#070709] border border-[#1E202E] hover:border-cyan-500/40 focus:border-cyan-500 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
            style={{ minHeight: "44px" }}
          />
        </div>
      </div>

      {/* ================= TIMELINE DE LANÇAMENTOS AGRUPADOS ================= */}
      <div className="space-y-12">
        {versionReleases.map(
          (rel, idx) =>
            rel.items.length > 0 && (
              <section key={idx} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E202E]">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-cyan-400 ring-4 ring-cyan-500/20" />
                    <h2 className="text-lg sm:text-xl font-bold text-white font-heading">
                      {rel.version}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#13141B] border border-[#1E202E] text-cyan-300">
                      {rel.tag}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 hidden sm:block">
                    {rel.date}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rel.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-3xl bg-[#0D0E12] border border-[#1E202E] hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${item.badgeColor.bg} ${item.badgeColor.text} ${item.badgeColor.border}`}
                          >
                            {item.badge}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {item.category}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          {item.highlights.slice(0, 3).map((h, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-[11px] text-slate-400"
                            >
                              <Check className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#1E202E] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {item.metrics?.map((m, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#070709] border border-[#1E202E] text-slate-300"
                            >
                              <strong className="text-slate-500">{m.label}:</strong> {m.value}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-white transition-all cursor-pointer"
                          style={{ minHeight: "36px" }}
                        >
                          <span>{item.actionText}</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
        )}
      </div>

      {/* ================= ROADMAP DE PRÓXIMOS LANÇAMENTOS ================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0E12] border border-[#1E202E] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E202E]">
          <div className="flex items-center gap-2.5">
            <Flame className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white font-heading">
              Roadmap & Próximas Inovações
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Pipeline de Pesquisa & IA</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROADMAP_ITEMS.map((road) => (
            <div
              key={road.id}
              className="p-4 rounded-2xl bg-[#070709] border border-[#1E202E] space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {road.quarter}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">{road.status}</span>
                </div>
                <h3 className="text-xs font-bold text-white font-heading">{road.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{road.description}</p>
              </div>

              <div className="pt-2 border-t border-[#1E202E]/60 text-[10px] font-mono text-slate-500">
                Tag: <span className="text-slate-300">{road.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= BANNER FINAL DE CONVITE ================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-900/30 via-[#0D0E12] to-cyan-900/30 border border-[#1E202E] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1 max-w-xl">
          <h2 className="text-lg sm:text-xl font-bold text-white font-heading">
            Pronto para criar sua próxima produção cinematográfica?
          </h2>
          <p className="text-xs text-slate-400">
            Conecte nós no VORIXA FLOW ou utilize o Studio CREATE para renderizações imediatas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/flow"
            className="px-5 py-2.5 rounded-2xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition-all shadow-lg shadow-cyan-500/20"
            style={{ minHeight: "44px" }}
          >
            Abrir VORIXA FLOW →
          </Link>
          <Link
            href="/dashboard/create"
            className="px-5 py-2.5 rounded-2xl text-xs font-mono font-bold bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-white transition-all"
            style={{ minHeight: "44px" }}
          >
            Studio CREATE
          </Link>
        </div>
      </div>
    </div>
  );
}