"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Video, UserCheck, Mic, Wand2, ArrowRight } from "lucide-react";

/**
 * Seção "O que você pode criar com o VORIXA" focada em casos de uso de venda.
 */
export function SalesUseCasesV2() {
  const useCases = [
    {
      icon: UserCheck,
      badge: "Influenciador Virtual",
      title: "Crie personas que não existem na vida real",
      desc: "Desenvolva modelos masculinos ou femininos com rosto e estilo consistente. Eles viram o rosto da sua marca para gravar centenas de criativos sem cachê de ator.",
      accent: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20",
      gradient: "from-emerald-500/20 to-transparent",
    },
    {
      icon: Video,
      badge: "Vídeos Virais & TikTok Ads",
      title: "Anúncios em vídeo com roteiro de alta conversão",
      desc: "Transforme qualquer roteiro de vendas em vídeo vertical em 9:16. O modelo fala em português do Brasil com expressões naturais e sincronia labial perfeita.",
      accent: "text-cyan-400 border-cyan-500/30 bg-cyan-950/20",
      gradient: "from-cyan-500/20 to-transparent",
    },
    {
      icon: Wand2,
      badge: "Clonagem de Movimentos (Motion)",
      title: "Copie coreografias e gestos de vídeos do TikTok",
      desc: "Grave um vídeo qualquer dançando ou gesticulando com o celular e transfira todos os movimentos para o seu modelo de IA com física e roupas realistas.",
      accent: "text-violet-400 border-violet-500/30 bg-violet-950/20",
      gradient: "from-violet-500/20 to-transparent",
    },
    {
      icon: Mic,
      badge: "Dublagem & LipSync Nativo",
      title: "Locução convincente sem estúdio de gravação",
      desc: "Escolha vozes ultra-humanizadas em português ou envie seu próprio áudio gravado. A boca do modelo virtual se move no tempo exato das palavras.",
      accent: "text-amber-400 border-amber-500/30 bg-amber-950/20",
      gradient: "from-amber-500/20 to-transparent",
    },
  ];

  return (
    <section className="py-10 sm:py-16 md:py-20 px-3 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-12">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>APLICAÇÕES PRÁTICAS PARA FATURAR MAIS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          O que você consegue criar em <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">poucos minutos</span>:
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Tudo desenhado para quem precisa de agilidade comercial, múltiplos criativos para testar em campanhas e zero dependência técnica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-6xl mx-auto">
        {useCases.map((uc, idx) => {
          const IconComponent = uc.icon;
          return (
            <div
              key={idx}
              className="bg-[#0D0E14] border border-white/[0.08] hover:border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-xl relative overflow-hidden transition-all group"
            >
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${uc.gradient} blur-[60px] pointer-events-none group-hover:scale-125 transition-transform duration-700`} />
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-3 rounded-2xl border ${uc.accent} w-fit`}>
                    <IconComponent className="w-6 h-6 shrink-0" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-slate-300">
                    {uc.badge}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {uc.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {uc.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] relative z-10 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Tempo médio de render:</span>
                <span className="font-mono text-emerald-400 font-bold">~15 a 45 segundos</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
