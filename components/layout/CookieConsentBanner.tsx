"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Cookie, X, Check } from "lucide-react";

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já consentiu anteriormente
    const consent = localStorage.getItem("vortixa_cookie_consent");
    if (!consent) {
      // Exibe após breve delay para UX suave
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("vortixa_cookie_consent", "all");
    localStorage.setItem("vortixa_cookie_consent_date", new Date().toISOString());
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem("vortixa_cookie_consent", "essential");
    localStorage.setItem("vortixa_cookie_consent_date", new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl border border-[#1E202E] bg-[#0D0E12]/95 backdrop-blur-xl p-5 shadow-2xl shadow-black/80 text-slate-200">
        <div className="flex items-start gap-3.5">
          <div className="h-9 w-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 text-violet-400">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Privacidade & Cookies</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">LGPD</span>
              </h4>
              <button
                onClick={handleAcceptEssential}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Fechar e manter apenas essenciais"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Utilizamos cookies essenciais para autenticação segura e métricas de desempenho para aprimorar sua experiência generativa, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
            <div className="pt-1 text-[11px]">
              <Link
                href="/termos"
                className="text-violet-400 hover:text-violet-300 underline font-medium"
              >
                Termos de Uso & Políticas de Privacidade
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2.5 pt-3 border-t border-[#1E202E]">
          <button
            type="button"
            onClick={handleAcceptEssential}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#13141B] border border-[#1E202E] hover:bg-[#1E202E] text-slate-300 hover:text-white transition-all cursor-pointer"
            style={{ minHeight: "36px" }}
          >
            Apenas Essenciais
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white shadow-lg shadow-violet-600/25 transition-all cursor-pointer"
            style={{ minHeight: "36px" }}
          >
            <Check className="h-3.5 w-3.5" />
            <span>Aceitar Todos</span>
          </button>
        </div>
      </div>
    </div>
  );
}
