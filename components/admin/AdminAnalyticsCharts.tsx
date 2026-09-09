"use client";

import React, { useState } from "react";
import { TrendingUp, Users, DollarSign, Activity, Cpu, Calendar } from "lucide-react";
import { ChartDataPoint } from "@/services/admin-dashboard.service";

interface AdminAnalyticsChartsProps {
  data: ChartDataPoint[];
  xAxisType: "hours" | "days" | "months";
}

export function AdminAnalyticsCharts({ data, xAxisType }: AdminAnalyticsChartsProps) {
  const [activeMetric, setActiveMetric] = useState<"financial" | "signups" | "generations">("financial");
  // Inicializa com o último ponto para que o usuário mobile veja métricas em destaque no HUD fixo imediatamente
  const [selectedIndex, setSelectedIndex] = useState<number>(data && data.length > 0 ? data.length - 1 : 0);

  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 sm:p-8 text-center">
        <p className="text-slate-500 text-sm">Nenhum dado temporal disponível para o período selecionado.</p>
      </div>
    );
  }

  const activePoint = data[selectedIndex] || data[data.length - 1];

  // Cálculos para o SVG responsivo
  const svgWidth = 800;
  const svgHeight = 240;
  const paddingX = 36;
  const paddingY = 24;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  // Encontra valores máximos para dimensionar o eixo Y
  const maxRevenue = Math.max(...data.map((d) => d.revenueBrl), 10);
  const maxProfit = Math.max(...data.map((d) => d.profitBrl), 10);
  const maxFinancial = Math.max(maxRevenue, maxProfit, 50);

  const maxSignups = Math.max(...data.map((d) => d.signups), 5);
  const maxGenerations = Math.max(...data.map((d) => d.generations), 10);
  const maxActivity = Math.max(maxSignups, maxGenerations);

  const getX = (index: number) => {
    if (data.length <= 1) return paddingX + plotWidth / 2;
    return paddingX + (index / (data.length - 1)) * plotWidth;
  };

  const getYFinancial = (val: number) => {
    return svgHeight - paddingY - (Math.max(0, val) / maxFinancial) * plotHeight;
  };

  const getYActivity = (val: number) => {
    return svgHeight - paddingY - (val / maxActivity) * plotHeight;
  };

  // Gerar caminhos de linhas e áreas
  const createPath = (getY: (d: ChartDataPoint) => number) => {
    return data
      .map((d, i) => {
        const x = getX(i);
        const y = getY(d);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const createAreaPath = (getY: (d: ChartDataPoint) => number) => {
    const linePath = createPath(getY);
    const firstX = getX(0);
    const lastX = getX(data.length - 1);
    const bottomY = svgHeight - paddingY;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const revenueLine = createPath((d) => getYFinancial(d.revenueBrl));
  const revenueArea = createAreaPath((d) => getYFinancial(d.revenueBrl));

  const profitLine = createPath((d) => getYFinancial(d.profitBrl));
  const profitArea = createAreaPath((d) => getYFinancial(d.profitBrl));

  const signupsLine = createPath((d) => getYActivity(d.signups));
  const signupsArea = createAreaPath((d) => getYActivity(d.signups));

  const generationsLine = createPath((d) => getYActivity(d.generations));
  const generationsArea = createAreaPath((d) => getYActivity(d.generations));

  // Redução de rótulos do eixo X para legibilidade em smartphones
  const step = Math.max(1, Math.ceil(data.length / 8));
  const xLabels = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  const activeX = getX(selectedIndex);

  return (
    <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-3 sm:p-6 relative overflow-hidden backdrop-blur-md shadow-xl shadow-black/30">
      {/* Header com Alternador de Métrica Mobile-First */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Activity className="h-5 w-5 text-violet-400 flex-shrink-0" />
            <span>Curva de Evolução & Tendência</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Agrupado por {xAxisType === "hours" ? "Horas do Dia" : xAxisType === "days" ? "Dias" : "Meses"}.
          </p>
        </div>

        {/* Segmented Control Touch-Friendly (Thumb Zone) */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveMetric("financial")}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-lg text-xs font-bold transition-all min-h-[44px] touch-manipulation active:scale-95 ${
              activeMetric === "financial"
                ? "bg-violet-600 text-white shadow-sm shadow-violet-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">Financeiro</span>
          </button>
          <button
            onClick={() => setActiveMetric("signups")}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-lg text-xs font-bold transition-all min-h-[44px] touch-manipulation active:scale-95 ${
              activeMetric === "signups"
                ? "bg-violet-600 text-white shadow-sm shadow-violet-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">Cadastros</span>
          </button>
          <button
            onClick={() => setActiveMetric("generations")}
            className={`flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-lg text-xs font-bold transition-all min-h-[44px] touch-manipulation active:scale-95 ${
              activeMetric === "generations"
                ? "bg-violet-600 text-white shadow-sm shadow-violet-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Cpu className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">Gerações IA</span>
          </button>
        </div>
      </div>

      {/* HUD Executivo Fixo Superior: NUNCA FICA SOB O POLEGAR DO USUÁRIO */}
      {activePoint && (
        <div className="mb-4 p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3 text-violet-400" />
                Ponto Selecionado:
              </span>
              <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                {activePoint.label}
              </span>
            </div>
            <span className="text-[10px] text-violet-400 font-medium hidden sm:inline">
              Toque no gráfico para inspecionar outros pontos
            </span>
          </div>

          {activeMetric === "financial" && (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Receita Bruta</span>
                <span className="text-xs sm:text-sm font-black text-emerald-400">
                  R$ {activePoint.revenueBrl.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Lucro Líquido</span>
                <span className="text-xs sm:text-sm font-black text-violet-400">
                  R$ {activePoint.profitBrl.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Custo de API</span>
                <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">
                  ${activePoint.apiCostUsd.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {activeMetric === "signups" && (
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Novos Cadastros</span>
                <span className="text-sm sm:text-base font-black text-cyan-400">
                  +{activePoint.signups}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Status</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-300">
                  {activePoint.signups > 0 ? "Atividade Registrada" : "Sem Cadastros"}
                </span>
              </div>
            </div>
          )}

          {activeMetric === "generations" && (
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Mídias Concluídas</span>
                <span className="text-sm sm:text-base font-black text-fuchsia-400">
                  {activePoint.generations}
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
                <span className="text-[10px] text-slate-400 block font-medium">Custo Estimado API</span>
                <span className="text-sm sm:text-base font-black text-amber-400 font-mono">
                  ${activePoint.apiCostUsd.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gráfico SVG Responsivo com Scrubbing Tátil Otimizado */}
      <div className="w-full relative overflow-x-auto pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 no-scrollbar touch-pan-x">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="min-w-[560px] sm:min-w-full w-full h-52 sm:h-60 overflow-visible select-none"
        >
          <defs>
            <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="fuchsiaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d946ef" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#d946ef" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Linhas horizontais de grade (Grid) */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = paddingY + plotHeight * ratio;
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={svgWidth - paddingX}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Linha Vertical de Ponto Selecionado (Crosshair) */}
          <line
            x1={activeX}
            y1={paddingY}
            x2={activeX}
            y2={svgHeight - paddingY}
            stroke="#8b5cf6"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.8"
          />

          {/* Desenho das Linhas e Áreas */}
          {activeMetric === "financial" && (
            <>
              <path d={revenueArea} fill="url(#emeraldGrad)" />
              <path
                d={revenueLine}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path d={profitArea} fill="url(#violetGrad)" />
              <path
                d={profitLine}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {activeMetric === "signups" && (
            <>
              <path d={signupsArea} fill="url(#cyanGrad)" />
              <path
                d={signupsLine}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {activeMetric === "generations" && (
            <>
              <path d={generationsArea} fill="url(#fuchsiaGrad)" />
              <path
                d={generationsLine}
                fill="none"
                stroke="#d946ef"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Pontos Visíveis e Hitboxes Ampliadas para Toque com Polegar */}
          {data.map((pt, i) => {
            const x = getX(i);
            const y =
              activeMetric === "financial"
                ? getYFinancial(pt.revenueBrl)
                : activeMetric === "signups"
                ? getYActivity(pt.signups)
                : getYActivity(pt.generations);

            const isSelected = selectedIndex === i;

            return (
              <g
                key={i}
                className="cursor-pointer"
                onClick={() => setSelectedIndex(i)}
                onTouchStart={() => setSelectedIndex(i)}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                {/* Hitbox Invisível Ampliada (>= 36px de área de toque do dedo) */}
                <rect
                  x={x - 18}
                  y={paddingY}
                  width={36}
                  height={plotHeight}
                  fill="transparent"
                />

                {/* Halo pulsante no ponto selecionado */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r={9}
                    className="fill-violet-500/20 stroke-violet-400 stroke-2 animate-pulse"
                  />
                )}

                {/* Círculo do ponto */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 6 : 3.5}
                  className={`transition-all ${
                    activeMetric === "financial"
                      ? "fill-emerald-400 stroke-slate-950 stroke-2"
                      : activeMetric === "signups"
                      ? "fill-cyan-400 stroke-slate-950 stroke-2"
                      : "fill-fuchsia-400 stroke-slate-950 stroke-2"
                  }`}
                />
              </g>
            );
          })}

          {/* Rótulos do Eixo X */}
          {xLabels.map((lbl, idx) => {
            const originalIndex = data.findIndex((d) => d.label === lbl.label);
            const x = getX(originalIndex);
            return (
              <text
                key={idx}
                x={x}
                y={svgHeight - 6}
                textAnchor="middle"
                className="text-[10px] fill-slate-500 font-mono font-semibold"
              >
                {lbl.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legenda Informativa Rodapé */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-900 text-xs font-medium">
        <div className="flex items-center gap-4">
          {activeMetric === "financial" && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300 text-[11px]">Receita</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span className="text-slate-300 text-[11px]">Lucro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-400 text-[11px]">Custo API</span>
              </div>
            </>
          )}

          {activeMetric === "signups" && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="text-slate-300 text-[11px]">Novos Cadastros de Usuários</span>
            </div>
          )}

          {activeMetric === "generations" && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" />
              <span className="text-slate-300 text-[11px]">Mídias IA (Fotos & Vídeos)</span>
            </div>
          )}
        </div>

        <span className="text-[10px] text-slate-500 font-mono">
          Total de pontos: {data.length}
        </span>
      </div>
    </div>
  );
}
