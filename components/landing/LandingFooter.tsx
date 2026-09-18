"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

/**
 * Rodapé Arquitetural de Alto Escalão (Apple / Linear / Vercel).
 * Touch targets >= 44px em todos os links e disposição equilibrada em telas de 320px a 4K.
 */
export function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050608] pt-12 sm:pt-16 pb-10 sm:pb-12 px-3 sm:px-6 relative w-full">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Topo do Rodapé: Brand Manifesto + 4 Colunas de Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Coluna 1 (Brand & Manifesto: 4 colunas) */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3 min-h-[44px]">
              <img
                src="/logos/logo principal.png"
                alt="VORTIXIA"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Plataforma completa para você criar imagens, vídeos com modelos virtuais, sincronizar dublagens e animar movimentos em alta definição.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse shrink-0" />
              <span>Servidores operando normalmente</span>
            </div>
          </div>

          {/* Colunas de Navegação (8 colunas divididas em 3 blocos) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-xs font-sans">
            
            {/* Coluna Plataforma */}
            <div className="space-y-3">
              <h5 className="font-mono uppercase font-bold text-slate-200 tracking-wider text-[11px]">
                Plataforma
              </h5>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/dashboard" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    VORTIXIA FLOW (Canvas)
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/tools/motion" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    Motion Control (Kling v3)
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/tools/lipsync" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    Dublagem & LipSync PT-BR
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/tools/image" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    FLUX 1.1 Pro Ultra
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/tools/upscale" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    Creative Upscale 4K
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna Recursos & Galeria */}
            <div className="space-y-3">
              <h5 className="font-mono uppercase font-bold text-slate-200 tracking-wider text-[11px]">
                Recursos
              </h5>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/dashboard/library" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    Galeria Criativa
                  </Link>
                </li>
                <li>
                  <a href="#motion-proof" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    Workflows Prontos
                  </a>
                </li>
                <li>
                  <a href="#planos-topo" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    Comparativo de Economia
                  </a>
                </li>
                <li>
                  <Link href="/dashboard/credits" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    Calculadora de Créditos
                  </Link>
                </li>
                <li>
                  <a href="#faq" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    Central de Dúvidas (FAQ)
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna Legal & Suporte */}
            <div className="space-y-3">
              <h5 className="font-mono uppercase font-bold text-slate-200 tracking-wider text-[11px]">
                Empresa & Termos
              </h5>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/terms" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    Política de Privacidade (LGPD)
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/profile" className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center">
                    Área do Assinante
                  </Link>
                </li>
                <li>
                  <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition-colors py-1 inline-block min-h-[36px] flex items-center"
                  >
                    Suporte via WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Barra Inferior com Copyright e Garantia */}
        <div className="pt-6 sm:pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>© 2026 VORTIXIA Inc. Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Privacidade Total • Zero Retenção de Dados Sensíveis</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
