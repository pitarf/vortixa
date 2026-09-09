"use client";

import React from "react";
import { ShieldAlert, AlertTriangle, ArrowRight, Lock } from "lucide-react";

interface AgeVerificationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function AgeVerificationModal({ onConfirm, onCancel }: AgeVerificationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#0D0E12] border border-rose-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-rose-950/40 relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Ícone de Alerta */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-600/30 text-white">
            <ShieldAlert className="w-8 h-8" />
          </div>
        </div>

        {/* Conteúdo Explicativo */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold">
            <Lock className="w-3 h-3" />
            <span>CONTEÚDO ADULTO +18</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">
            Verificação de Maioridade
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Esta seção contém motores de inteligência artificial generativa sem censura moral (NSFW), incluindo nudez artística, lingerie e conteúdo adulto com processamento exclusivo na <b>WaveSpeed AI</b>.
          </p>
        </div>

        {/* Termos de Consentimento */}
        <div className="p-3.5 rounded-2xl bg-[#13141B] border border-[#1E202E] text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>É expressamente proibida a criação de conteúdo ilegal, não consensual ou que envolva menores de idade (tolerância zero).</span>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3.5 px-5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <span>Tenho 18 anos ou mais (Entrar)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 px-5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#13141B] transition-all cursor-pointer"
            style={{ minHeight: "40px" }}
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
