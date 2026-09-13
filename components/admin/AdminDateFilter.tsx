"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  CalendarDays, 
  CalendarRange, 
  Filter, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  Check,
  Sparkles
} from "lucide-react";
import { TimePeriod } from "@/services/admin-dashboard.service";

interface AdminDateFilterProps {
  currentPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  customStartDate: string;
  customEndDate: string;
  onCustomDatesChange: (start: string, end: string) => void;
  onApplyCustomFilter: () => void;
  loading: boolean;
}

export function AdminDateFilter({
  currentPeriod,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomDatesChange,
  onApplyCustomFilter,
  loading,
}: AdminDateFilterProps) {
  const [showCustomDrawer, setShowCustomDrawer] = useState(currentPeriod === "custom");

  const filterButtons: { id: TimePeriod; shortLabel: string; fullLabel: string; icon: React.ElementType }[] = [
    { id: "today", shortLabel: "Hoje", fullLabel: "Hoje (24h)", icon: Clock },
    { id: "weekly", shortLabel: "7 Dias", fullLabel: "Últimos 7 Dias", icon: CalendarDays },
    { id: "monthly", shortLabel: "30 Dias", fullLabel: "Últimos 30 Dias", icon: Calendar },
    { id: "yearly", shortLabel: "1 Ano", fullLabel: "Último Ano", icon: CalendarRange },
    { id: "all", shortLabel: "Tudo", fullLabel: "Todo o Histórico", icon: Filter },
  ];

  const handlePeriodClick = (id: TimePeriod) => {
    if (id !== "custom") {
      setShowCustomDrawer(false);
    }
    onPeriodChange(id);
  };

  const setPresetRange = (daysAgo: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - daysAgo);

    const format = (d: Date) => d.toISOString().split("T")[0];
    onCustomDatesChange(format(start), format(end));
  };

  return (
    <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-2.5 sm:p-4 backdrop-blur-xl shadow-2xl shadow-black/40 space-y-3">
      {/* Barra de Segmented Control com Rolagem Horizontal Suave */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 overflow-x-auto no-scrollbar scrollbar-none py-0.5 snap-x">
          <div className="flex items-center gap-1.5 min-w-max p-1 bg-[#070709] rounded-xl border border-[#1E202E]/60">
            {filterButtons.map((btn) => {
              const Icon = btn.icon;
              const isActive = currentPeriod === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => handlePeriodClick(btn.id)}
                  disabled={loading}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all min-h-[44px] touch-manipulation active:scale-[0.97] cursor-pointer snap-start ${
                    isActive
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 border border-violet-500/50"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#13141B] border border-transparent"
                  } disabled:opacity-50`}
                  title={btn.fullLabel}
                >
                  <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="inline sm:hidden">{btn.shortLabel}</span>
                  <span className="hidden sm:inline">{btn.fullLabel}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5" />}
                </button>
              );
            })}

            {/* Gatilho de Período Personalizado */}
            <button
              type="button"
              onClick={() => setShowCustomDrawer((prev) => !prev)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all min-h-[44px] touch-manipulation active:scale-[0.97] cursor-pointer snap-start ${
                currentPeriod === "custom" || showCustomDrawer
                  ? "bg-[#13141B] text-violet-300 border border-violet-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#13141B] border border-transparent"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 flex-shrink-0 text-violet-400" />
              <span>Personalizado</span>
              {showCustomDrawer ? (
                <ChevronUp className="h-3.5 w-3.5 ml-0.5 opacity-70" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 ml-0.5 opacity-70" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Gaveta Expansível de Intervalo de Datas com Presets Ergonômicos */}
      {showCustomDrawer && (
        <div className="pt-3 border-t border-[#1E202E] flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-violet-400" />
              Atalhos Rápidos:
            </span>
            <button
              type="button"
              onClick={() => setPresetRange(3)}
              className="px-3 py-1.5 rounded-md bg-[#13141B] hover:bg-[#1E202E] text-[11px] text-slate-300 border border-[#1E202E] transition-colors cursor-pointer min-h-[36px]"
            >
              Últimos 3 dias
            </button>
            <button
              type="button"
              onClick={() => setPresetRange(15)}
              className="px-3 py-1.5 rounded-md bg-[#13141B] hover:bg-[#1E202E] text-[11px] text-slate-300 border border-[#1E202E] transition-colors cursor-pointer min-h-[36px]"
            >
              Últimos 15 dias
            </button>
            <button
              type="button"
              onClick={() => setPresetRange(60)}
              className="px-3 py-1.5 rounded-md bg-[#13141B] hover:bg-[#1E202E] text-[11px] text-slate-300 border border-[#1E202E] transition-colors cursor-pointer min-h-[36px]"
            >
              Últimos 60 dias
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2 bg-[#070709] border border-[#1E202E] rounded-xl px-3 py-2 min-h-[48px] focus-within:border-violet-500 transition-colors">
                <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">De</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => onCustomDatesChange(e.target.value, customEndDate)}
                  className="w-full bg-transparent text-xs text-white focus:outline-none [color-scheme:dark] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 bg-[#070709] border border-[#1E202E] rounded-xl px-3 py-2 min-h-[48px] focus-within:border-violet-500 transition-colors">
                <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Até</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => onCustomDatesChange(customStartDate, e.target.value)}
                  className="w-full bg-transparent text-xs text-white focus:outline-none [color-scheme:dark] cursor-pointer"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onApplyCustomFilter}
              disabled={loading || !customStartDate || !customEndDate}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border min-h-[48px] flex items-center justify-center gap-2 touch-manipulation active:scale-[0.97] cursor-pointer ${
                currentPeriod === "custom"
                  ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/30"
                  : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-600/20"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <Check className="h-4 w-4" />
              <span>Aplicar Intervalo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
