"use client";

import React, { useState } from "react";
import { Wand2, Languages, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface PromptInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  toolType?: "image" | "video" | "lipsync" | "motion" | "upscale";
  showOptimizeButton?: boolean;
}

export function PromptInput({
  value,
  onChange,
  placeholder = "Descreva a imagem ou vídeo que deseja criar...",
  label = "Prompt de Geração",
  toolType = "image",
  showOptimizeButton = true,
}: PromptInputProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimizePrompt = async () => {
    if (!value.trim()) {
      toast.error("Digite um prompt antes de otimizar.");
      return;
    }

    try {
      setIsOptimizing(true);
      const res = await fetch("/api/tools/optimize-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: value,
          enhanceQuality: true,
          toolType,
        }),
      });

      if (!res.ok) {
        throw new Error("Não foi possível otimizar o prompt.");
      }

      const data = await res.json();
      onChange(data.optimizedPrompt);
      toast.success("Prompt otimizado e enriquecido!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao otimizar prompt.");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
          {label}
        </label>

        {showOptimizeButton && (
          <button
            type="button"
            onClick={handleOptimizePrompt}
            disabled={isOptimizing || !value.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
          >
            {isOptimizing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5 text-cyan-200" />
            )}
            <span>Otimizar Prompt por IA</span>
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full rounded-2xl border border-border bg-card p-4 text-sm text-foreground placeholder-slate-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all duration-300 resize-none min-h-[110px]"
          maxLength={1500}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1 text-slate-400">
          <Languages className="w-3.5 h-3.5 text-violet-400" />
          <span>Falas entre aspas ("...") são preservadas exatamente no idioma digitado.</span>
        </span>
        <span>{value.length}/1500 caracteres</span>
      </div>
    </div>
  );
}
