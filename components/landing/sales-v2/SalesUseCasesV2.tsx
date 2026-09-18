"use client";

import React from "react";
import { UserCheck, Video, Wand2, Mic } from "lucide-react";

/**
 * Seção de Casos de Uso com Estética Editorial Elegante (Estilo Octuz AI).
 * Redação 100% humanizada sem termos de IA futurista ou exageros.
 */
export function SalesUseCasesV2() {
  const cases = [
    {
      icon: UserCheck,
      tag: "Influenciador Virtual",
      title: "Um rosto exclusivo para a sua marca",
      desc: "Crie personagens com consistência fotográfica que viram a cara da sua empresa ou de canais de conteúdo. Você tem controle total sobre roupas, cenário e tom de voz.",
    },
    {
      icon: Video,
      tag: "Vídeos em 9:16",
      title: "Criativos para TikTok, Reels e Anúncios",
      desc: "Gere vídeos no formato vertical prontos para veiculação em campanhas. O personagem fala seu texto de forma fluida, olhando diretamente para a câmera.",
    },
    {
      icon: Wand2,
      tag: "Clonagem de Movimentos",
      title: "Copie passos e danças de vídeos reais",
      desc: "Envie um vídeo gravado no celular com uma coreografia ou movimento específico e transfira a movimentação inteira para o seu modelo de forma suave.",
    },
    {
      icon: Mic,
      tag: "Sincronia Labial",
      title: "Dublagem natural em português",
      desc: "Basta digitar o texto ou enviar um áudio de voz. A boca e as expressões faciais do modelo se movem no tempo exato das palavras faladas.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 px-3 sm:px-6 max-w-7xl mx-auto space-y-10 sm:space-y-14 w-full">
      {/* Cabeçalho */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-sans tracking-widest text-cyan-400 uppercase font-medium">
          Aplicações Reais
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-tight">
          O que você pode criar{" "}
          <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            na prática
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
          Soluções práticas para quem quer produzir vídeos de alta conversão sem complicação.
        </p>
      </div>

      {/* Grid de 4 Cards Elegantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {cases.map((c, idx) => {
          const IconComp = c.icon;
          const delayClass =
            idx === 0
              ? "reveal-delay-1"
              : idx === 1
              ? "reveal-delay-2"
              : idx === 2
              ? "reveal-delay-3"
              : "reveal-delay-4";

          return (
            <div
              key={idx}
              className={`bg-[#0C0D12] border border-white/[0.08] hover:border-white/20 hover:-translate-y-1 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-5 transition-all duration-300 shadow-xl reveal-on-scroll ${delayClass}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-200">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-sans px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-200 whitespace-nowrap font-medium">
                    {c.tag}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-medium text-white tracking-tight">
                  {c.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  {c.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] text-xs text-slate-400 flex items-center justify-between">
                <span className="font-light">Tempo médio de produção:</span>
                <span className="font-mono text-cyan-400 font-medium">~15 a 45 segundos</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
