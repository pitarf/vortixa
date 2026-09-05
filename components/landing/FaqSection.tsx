"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * Seção de Dúvidas Frequentes (FAQ) em Linhas Horizontais Minimalistas.
 * Sem empilhamento de caixas pesadas, foco em tipografia limpa e expansão suave.
 */
export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "O que é o VORIXA e como ele funciona?",
      a: "O VORIXA é uma plataforma tudo-em-um que reúne os melhores modelos de IA do mundo (FLUX.1, Kling AI, LipSync e Upscale 4K) em um estúdio visual unificado. Você pode criar influenciadores virtuais, comerciais, vídeos virais para TikTok/Reels e encadear nós em pipelines automáticos sem precisar assinar softwares separados.",
    },
    {
      q: "Preciso aparecer nos vídeos ou contratar modelos?",
      a: "Não! Com a tecnologia de Influencers IA e LivePortrait LipSync, você gera personagens com rostos fotorrealistas que falam seus roteiros em português e realizam movimentos naturais com total consistência de cena para cena.",
    },
    {
      q: "Posso usar as mídias geradas comercialmente?",
      a: "Sim, 100%! Todos os direitos sobre as imagens, vídeos e áudios gerados no VORIXA pertencem a você. Você pode veicular campanhas pagas no Meta/TikTok Ads, atender clientes ou monetizar canais no YouTube.",
    },
    {
      q: "Como funciona a garantia de 7 dias?",
      a: "Oferecemos garantia incondicional de 7 dias. Se por qualquer motivo você achar que a plataforma não atendeu suas expectativas, basta solicitar o reembolso pelo painel e devolvemos 100% do valor.",
    },
    {
      q: "Preciso de um computador potente com placa de vídeo?",
      a: "Não! Todo o processamento pesado de inteligência artificial é executado em nossos clusters de GPUs de altíssimo desempenho na nuvem. Você só precisa de um navegador comum no celular ou computador.",
    },
    {
      q: "Os créditos de IA expiram?",
      a: "Nos pacotes avulsos, seus créditos não possuem validade curta. Nos planos por assinatura, sua cota é renovada mensalmente com acesso prioritário às filas de renderização.",
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-12">
      {/* Cabeçalho */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase font-semibold block">
          DÚVIDAS FREQUENTES
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          Perguntas <span className="font-serif italic font-normal text-slate-300">frequentes</span>.
        </h2>
      </div>

      {/* Linhas Horizontais Minimalistas */}
      <div className="divide-y divide-[#1E202E]/80 border-y border-[#1E202E]/80">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-6">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {faq.q}
                </span>
                <span className="text-slate-400 group-hover:text-white transition-colors">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>
              {isOpen && (
                <div className="pt-4 text-xs sm:text-sm text-slate-400 leading-relaxed font-sans max-w-3xl">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
