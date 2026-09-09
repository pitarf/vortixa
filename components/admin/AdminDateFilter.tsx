"use client";

import React, { useState } from "react";
import { Calendar, Clock, CalendarDays, CalendarRange, Filter, SlidersHorizontal, ChevronDown, ChevronUp, Check } from "lucide-react";
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
    { id: "today", shortLabel: "Hoje", fullLabel: "Hoje (Horas)", icon: Clock },
    { id: "weekly", shortLabel: "7 Dias", fullLabel: "Últimos 7 Dias", icon: CalendarDays },
    { id: "monthly", shortLabel: "30 Dias", fullLabel: "Últimos 30 Dias", icon: Calendar },
    { id: "yearly", shortLabel: "1 Ano", fullLabel: "Último Ano", icon: CalendarRange },
    { id: "all", shortLabel: "Tudo", fullLabel: "Todo o Período", icon: Filter },
  ];

  const handlePeriodClick = (id: TimePeriod) => {
    if (id !== "custom") {
      setShowCustomDrawer(false);
    }
    onPeriodChange(id);
  };

  const toggleCustomDrawer = () => {
    setShowCustomDrawer((prev) => !prev);
  };

  return (
    <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-lg shadow-black/20 space-y-3">
      {/* Barra Superior: Pill Buttons com Rolagem Suave no Polegar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth py-1 -my-1">
          <div className="flex items-center gap-1.5 min-w-max">
            {filterButtons.map((btn) => {
              const Icon = btn.icon;
              const isActive = currentPeriod === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() => handlePeriodClick(btn.id)}
                  disabled={loading}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] touch-manipulation active:scale-95 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30 border border-violet-500"
                      : "bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/80"
                  } disabled:opacity-50`}
                  title={btn.fullLabel}
                >
                  <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="inline sm:hidden">{btn.shortLabel}</span>
                  <span className="hidden sm:inline">{btn.fullLabel}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 sm:hidden" />}
                </button>
              );
            })}

            {/* Botão Gatilho de Período Customizado */}
            <button
              onClick={toggleCustomDrawer}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] touch-manipulation active:scale-95 ${
                currentPeriod === "custom" || showCustomDrawer
                  ? "bg-slate-800 text-violet-300 border border-violet-500/50"
                  : "bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/80"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 flex-shrink-0 text-violet-400" />
              <span>Personalizado</span>
              {showCustomDrawer ? (
                <ChevronUp className="h-3 w-3 ml-0.5 opacity-70" />
              ) : (
                <ChevronDown className="h-3 w-3 ml-0.5 opacity-70" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Gaveta / Seletor Customizado com visual expansível ergonômico */}
      {showCustomDrawer && (
        <div className="pt-2 border-t border-slate-900/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 min-h-[44px] focus-within:border-violet-500 transition-colors">
              <span className="text-[11px] font-semibold text-slate-400 flex-shrink-0">De:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => onCustomDatesChange(e.target.value, customEndDate)}
                className="w-full bg-transparent text-xs text-white focus:outline-none [color-scheme:dark] cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 min-h-[44px] focus-within:border-violet-500 transition-colors">
              <span className="text-[11px] font-semibold text-slate-400 flex-shrink-0">Até:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => onCustomDatesChange(customStartDate, e.target.value)}
                className="w-full bg-transparent text-xs text-white focus:outline-none [color-scheme:dark] cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => {
              onApplyCustomFilter();
            }}
            disabled={loading || !customStartDate || !customEndDate}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border min-h-[44px] w-full sm:w-auto flex items-center justify-center gap-2 touch-manipulation active:scale-95 ${
              currentPeriod === "custom"
                ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/30"
                : "bg-slate-800 border-slate-700 text-violet-300 hover:bg-violet-600 hover:text-white"
            } disabled:opacity-40`}
          >
            <Check className="h-3.5 w-3.5" />
            <span>Aplicar Filtro</span>
          </button>
        </div>
      )}
    </div>
  );
}
