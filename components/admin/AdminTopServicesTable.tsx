"use client";

import React, { useState } from "react";
import { Sparkles, Video, Image as ImageIcon, Flame } from "lucide-react";
import { TopServiceModel } from "@/services/admin-dashboard.service";

interface AdminTopServicesTableProps {
  services: TopServiceModel[];
}

export function AdminTopServicesTable({ services }: AdminTopServicesTableProps) {
  const [sortBy, setSortBy] = useState<"usage" | "credits" | "revenue">("usage");

  if (!services || services.length === 0) {
    return (
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-8 text-center shadow-xl">
        <p className="text-slate-500 text-xs">Nenhuma geração registrada no período para ranqueamento.</p>
      </div>
    );
  }

  const sortedServices = [...services].sort((a, b) => {
    if (sortBy === "credits") return b.creditsConsumed - a.creditsConsumed;
    if (sortBy === "revenue") return b.estimatedRevenueBrl - a.estimatedRevenueBrl;
    return b.usageCount - a.usageCount;
  });

  const getToolIcon = (toolSlug: string) => {
    if (toolSlug.includes("video")) return <Video className="h-4 w-4 text-cyan-400 flex-shrink-0" />;
    if (toolSlug.includes("hot")) return <Flame className="h-4 w-4 text-rose-500 flex-shrink-0" />;
    return <ImageIcon className="h-4 w-4 text-violet-400 flex-shrink-0" />;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[11px] font-black text-slate-950 shadow-md shadow-amber-500/30 flex-shrink-0">
          1
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-[11px] font-black text-slate-950 shadow-md shadow-slate-300/20 flex-shrink-0">
          2
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 text-[11px] font-black text-amber-100 shadow-md shadow-amber-800/20 flex-shrink-0">
          3
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#13141B] text-[11px] font-bold text-slate-400 border border-[#1E202E] flex-shrink-0">
        {index + 1}
      </span>
    );
  };

  const maxUsage = Math.max(...services.map((s) => s.usageCount), 1);

  return (
    <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl shadow-black/40 flex flex-col justify-between">
      <div>
        {/* Header com Filtro de Classificação */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-white font-black text-base font-heading">
              <Sparkles className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <span>Motores & Serviços Mais Utilizados</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Volume, consumo de créditos e estimativa de faturamento por ferramenta.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#070709] rounded-xl border border-[#1E202E]">
            <button
              type="button"
              onClick={() => setSortBy("usage")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all min-h-[44px] cursor-pointer touch-manipulation active:scale-95 ${
                sortBy === "usage"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Volume
            </button>
            <button
              type="button"
              onClick={() => setSortBy("credits")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all min-h-[44px] cursor-pointer touch-manipulation active:scale-95 ${
                sortBy === "credits"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Créditos
            </button>
            <button
              type="button"
              onClick={() => setSortBy("revenue")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all min-h-[44px] cursor-pointer touch-manipulation active:scale-95 ${
                sortBy === "revenue"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Receita
            </button>
          </div>
        </div>

        {/* Visualização Mobile em Cards Empilháveis Bento */}
        <div className="space-y-3 sm:hidden">
          {sortedServices.map((svc, index) => {
            const ratioPercent = Math.min(100, Math.round((svc.usageCount / maxUsage) * 100));

            return (
              <div
                key={svc.modelId || index}
                className="p-3.5 rounded-xl bg-[#13141B] border border-[#1E202E] hover:border-slate-700 transition-colors space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {getRankBadge(index)}
                    <div className="min-w-0">
                      <div className="font-bold text-white text-xs truncate">
                        {svc.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">
                        {svc.technicalName}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#070709] border border-[#1E202E] text-[10px] text-slate-300 flex-shrink-0">
                    {getToolIcon(svc.toolSlug)}
                    <span className="truncate max-w-[90px]">{svc.toolName}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#1E202E]/60">
                  <div className="bg-[#070709] p-2 rounded-lg border border-[#1E202E]/40">
                    <span className="text-[10px] text-slate-400 block font-medium">Gerações</span>
                    <span className="font-bold text-white font-mono">
                      {svc.usageCount.toLocaleString("pt-BR")}
                    </span>
                  </div>

                  <div className="bg-[#070709] p-2 rounded-lg border border-[#1E202E]/40">
                    <span className="text-[10px] text-slate-400 block font-medium">Créditos</span>
                    <span className="font-bold text-cyan-400 font-mono">
                      {svc.creditsConsumed.toLocaleString("pt-BR")} cr
                    </span>
                  </div>

                  <div className="bg-[#070709] p-2 rounded-lg border border-[#1E202E]/40">
                    <span className="text-[10px] text-slate-400 block font-medium">Custo de API</span>
                    <span className="font-bold text-amber-400 font-mono">
                      ${svc.apiCostUsd.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-[#070709] p-2 rounded-lg border border-[#1E202E]/40">
                    <span className="text-[10px] text-slate-400 block font-medium">Receita Est.</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      R$ {svc.estimatedRevenueBrl.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Participação</span>
                    <span>{ratioPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#070709] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-amber-400"
                      style={{ width: `${ratioPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visualização Desktop em Tabela Expandida */}
        <div className="hidden sm:block overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1E202E] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Posição & Motor</th>
                <th className="pb-3 text-center">Tipo</th>
                <th className="pb-3 text-right">Gerações</th>
                <th className="pb-3 text-right">Créditos</th>
                <th className="pb-3 text-right">Custo API</th>
                <th className="pb-3 text-right pr-2">Receita Est.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E202E]">
              {sortedServices.map((svc, index) => (
                <tr key={svc.modelId || index} className="hover:bg-[#13141B]/60 transition-colors">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      {getRankBadge(index)}
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {svc.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {svc.technicalName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#070709] border border-[#1E202E] text-[11px] text-slate-300">
                      {getToolIcon(svc.toolSlug)}
                      {svc.toolName}
                    </span>
                  </td>
                  <td className="py-3 text-right font-bold text-white font-mono">
                    {svc.usageCount.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3 text-right font-medium text-cyan-400 font-mono">
                    {svc.creditsConsumed.toLocaleString("pt-BR")} cr
                  </td>
                  <td className="py-3 text-right font-mono text-amber-400">
                    ${svc.apiCostUsd.toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-bold text-emerald-400 pr-2 font-mono">
                    R$ {svc.estimatedRevenueBrl.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
