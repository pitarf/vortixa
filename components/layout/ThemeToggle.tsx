"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
      title={theme === "dark" ? "Mudar para Tema Claro" : "Mudar para Tema Escuro"}
      className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="text-xs font-semibold hidden md:inline">Claro</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold hidden md:inline text-slate-800">Escuro</span>
        </>
      )}
    </button>
  );
}
