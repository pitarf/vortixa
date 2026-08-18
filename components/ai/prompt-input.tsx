"use client";

import React from "react";

interface PromptInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
}

export function PromptInput({
  value,
  onChange,
  placeholder = "Descreva a imagem que deseja criar...",
  label = "Prompt de Geração",
}: PromptInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:bg-slate-900 focus:ring-1 focus:ring-violet-500 outline-none transition-all duration-300 resize-none min-h-[100px]"
        maxLength={1000}
      />
      <div className="flex justify-end text-xs text-slate-500 mt-1">
        {value.length}/1000 caracteres
      </div>
    </div>
  );
}
