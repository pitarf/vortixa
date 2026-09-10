"use client";

import React from "react";
import { Sparkles, Video, Image as ImageIcon, Flame } from "lucide-react";
import { TopServiceModel } from "@/services/admin-dashboard.service";

interface AdminTopServicesTableProps {
  services: TopServiceModel[];
}

export function AdminTopServicesTable({ services }: AdminTopServicesTableProps) {
  if (!services || services.length === 0) {
    return (
      <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-6 text-center">
        <p className="text-slate-500 text-xs">Nenhuma geração registrada no período para ranqueamento.</p>
      </div>
    );
  }

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
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-[11px] font-black text-slate-400 border border-slate-800 flex-shrink-0">
        {index + 1}
      </span>
    );
  };

  const maxUsage = Math.max(...services.map((s) => s.usageCount), 1);

  return (
    <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-xl shadow-black/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Sparkles className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <span>Serviços & Modelos Mais Utilizados</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranking de motores por volume, créditos consumidos e receita estimada.
          </p>
        </div>
      </div>

      {/* VISUALIZAÇÃO MOBILE EM CARDS: Não comprime a tela nem exige rolagem horizontal */}
      <div className="space-y-3 sm:hidden">
        {services.map((svc, index) => {
          const ratioPercent = Math.min(100, Math.round((svc.usageCount / maxUsage) * 100));

          return (
            <div
              key={svc.modelId || index}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2.5"
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

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300 flex-shrink-0">
                  {getToolIcon(svc.toolSlug)}
                  <span className="truncate max-w-[80px]">{svc.toolName}</span>
                </span>
              </div>

              {/* Grid 4 KPIs do Serviço no Card */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/60">
                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-400 block font-medium">Gerações</span>
                  <span className="font-bold text-white">
                    {svc.usageCount.toLocaleString("pt-BR")}
                  </span>
                </div>

                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-400 block font-medium">Créditos</span>
                  <span className="font-bold text-cyan-400">
                    {svc.creditsConsumed.toLocaleString("pt-BR")} cr
                  </span>
                </div>

                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-400 block font-medium">Custo de API</span>
                  <span className="font-bold text-amber-400 font-mono">
                    ${svc.apiCostUsd.toFixed(2)}
                  </span>
                </div>

                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-400 block font-medium">Receita Estimada</span>
                  <span className="font-bold text-emerald-400">
                    R$ {svc.estimatedRevenueBrl.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Barra de Proporção de Uso */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Participação no Volume</span>
                  <span>{ratioPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
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

      {/* VISUALIZAÇÃO DESKTOP EM TABELA EXPANDIDA (SM+) */}
      <div className="hidden sm:block overflow-x-auto overscroll-x-contain scrollbar-thin">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-3 pl-2">Posição & Motor</th>
              <th className="pb-3 text-center">Tipo</th>
              <th className="pb-3 text-right">Gerações</th>
              <th className="pb-3 text-right">Créditos</th>
              <th className="pb-3 text-right">Custo API ($)</th>
              <th className="pb-3 text-right pr-2">Receita Est. (R$)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {services.map((svc, index) => (
              <tr key={svc.modelId || index} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 pl-2">
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
                <td className="py-3.5 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                    {getToolIcon(svc.toolSlug)}
                    {svc.toolName}
                  </span>
                </td>
                <td className="py-3.5 text-right font-semibold text-white">
                  {svc.usageCount.toLocaleString("pt-BR")}
                </td>
                <td className="py-3.5 text-right font-medium text-cyan-400">
                  {svc.creditsConsumed.toLocaleString("pt-BR")} cr
                </td>
                <td className="py-3.5 text-right font-mono text-amber-400">
                  ${svc.apiCostUsd.toFixed(2)}
                </td>
                <td className="py-3.5 text-right font-bold text-emerald-400 pr-2">
                  R$ {svc.estimatedRevenueBrl.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
