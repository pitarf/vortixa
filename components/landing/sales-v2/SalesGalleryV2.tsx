"use client";

import React, { useState } from "react";
import { Sparkles, Play, Pause, Volume2, VolumeX } from "lucide-react";

/**
 * Galeria Editorial de Mídias Reais (Estilo Octuz AI) — Sem nenhuma mídia Hot.
 * Populada com as criações reais do usuário e benchmarks autorizados:
 * - Comercial de Perfume
 * - Modelo Lookbook Editorial
 * - Apresentadora Falando em Português
 * - Modelo Brasileira
 * - Dança / Motion Control
 * - Ensaio Fotográfico
 */
export function SalesGalleryV2() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeAudioVideoId, setActiveAudioVideoId] = useState<number | null>(null);

  const gallery = [
    {
      id: 11,
      category: "ugc",
      type: "video",
      title: "Geração de Vídeo Ultra-Realista",
      tag: "Hiper-Realismo • WaveSpeed",
      url: "/uploads/wavespeed_realism_showcase.mp4",
      poster: "/uploads/wavespeed_realism_showcase_poster.jpg",
      desc: "Microexpressões faciais orgânicas, iluminação de cinema e física de movimento indistinguível do mundo real.",
    },
    {
      id: 1,
      category: "ugc",
      type: "video",
      title: "Modelo Falando em Português (Festa da Virginia)",
      tag: "Foto para Vídeo & Fala",
      url: "/uploads/7a8abe32-afbb-42f6-9c7a-e77a9aadec60.mp4",
      poster: "/uploads/6ea5aba0-f0a5-4be8-985e-09da93fb0630.jpg",
      desc: "Foto estática de corpo todo animada com caminhada elegante e fala natural em português.",
    },
    {
      id: 9,
      category: "ugc",
      type: "video",
      title: "Modelo Fashion Apresentando Roupa",
      tag: "Vídeo & Locução",
      url: "/uploads/f80d19de-085b-4378-98ea-b7733c8ffdd8.mp4",
      poster: "/uploads/fc5afea8-272c-4afc-8deb-beebfa65a118.jpg",
      desc: "Modelo virtual apresentando produto de moda olhando nos olhos do cliente.",
    },
    {
      id: 12,
      category: "motion",
      type: "video",
      title: "Coreografia & Fluidez (Seedance 2.5)",
      tag: "Seedance 2.5 • Motion",
      url: "/uploads/seedance_showcase_1.mp4",
      poster: "/uploads/seedance_poster_1.jpg",
      desc: "Dinâmica de movimento expressiva com alta retenção anatômica e fluidez em 60fps.",
    },
    {
      id: 13,
      category: "fashion",
      type: "video",
      title: "Passarela Cinemática (Seedance 2.5)",
      tag: "Moda & Presença",
      url: "/uploads/seedance_showcase_2.mp4",
      poster: "/uploads/seedance_poster_2.jpg",
      desc: "Simulação realista de física de tecidos, iluminação volumétrica e presença de palco.",
    },
    {
      id: 14,
      category: "commercial",
      type: "video",
      title: "Produção Comercial Cinematográfica",
      tag: "Comercial & VFX",
      url: "/uploads/seedance_showcase_3.mp4",
      poster: "/uploads/seedance_poster_3.jpg",
      desc: "Composição dramática em formato horizontal cinematográfico com pós-processamento de filme.",
    },
    {
      id: 2,
      category: "motion",
      type: "video",
      title: "Clonagem de Dança do TikTok",
      tag: "Motion Real",
      url: "/uploads/motion_gerado_vortixia.mp4",
      poster: "/uploads/motion_personagem_base.png",
      desc: "Transferência de passos do TikTok para personagem virtual com física realista.",
    },
    {
      id: 3,
      category: "commercial",
      type: "video",
      title: "Comercial One Million (Paco Rabanne)",
      tag: "Loop Contínuo • 4K",
      url: "/uploads/one_million_loop.mp4",
      poster: "/uploads/one_million_rabanne.png",
      desc: "Anúncio de produto com iluminação dinâmica, rotação de câmera fluida e reprodução contínua em loop e reverso.",
    },
    {
      id: 4,
      category: "fashion",
      type: "image",
      title: "Modelo Brasileira (Pele Real & Cachos)",
      tag: "Recraft V3 • 8K UHD",
      url: "/uploads/3edfbb77-e69f-4ab7-8298-696549bf49a3.jpg",
      poster: "/uploads/3edfbb77-e69f-4ab7-8298-696549bf49a3.jpg",
      desc: "Retrato ultra-realista com textura autêntica de microporos, iluminação de estúdio com softbox e lente 85mm.",
    },
    {
      id: 10,
      category: "fashion",
      type: "image",
      title: "Ensaio Fotográfico Brasileiro",
      tag: "Fotografia Editorial",
      url: "/uploads/36c7aff2-166d-4bdc-a002-032243d98196.jpg",
      poster: "/uploads/36c7aff2-166d-4bdc-a002-032243d98196.jpg",
      desc: "Fotografia nítida capturada com padrão de câmera Hasselblad, iluminação de contorno e expressão natural.",
    },
    {
      id: 5,
      category: "fashion",
      type: "video",
      title: "Lookbook Editorial em Passarela",
      tag: "Moda & Estilo",
      url: "/uploads/bdc1b96b-d7d2-4f55-8f2b-a90631629c00.mp4",
      poster: "/uploads/bc3c42a6-32d9-4f53-bbc8-a27accc1800e.jpg",
      desc: "Movimentação fluida de tecido e postura elegante em estúdio contemporâneo.",
    },
    {
      id: 6,
      category: "fashion",
      type: "image",
      title: "Modelo em Iluminação Natural",
      tag: "Editorial de Beleza",
      url: "/uploads/fc5afea8-272c-4afc-8deb-beebfa65a118.jpg",
      poster: "/uploads/fc5afea8-272c-4afc-8deb-beebfa65a118.jpg",
      desc: "Ensaio fotográfico com iluminação suave, foco nos detalhes dos olhos e textura de alta definição.",
    },
    {
      id: 7,
      category: "ugc",
      type: "video",
      title: "Diálogo Espontâneo em Português",
      tag: "Fala Nativa PT-BR",
      url: "/uploads/cacdb6d2-4c8a-4f7e-8f14-8e7d7a21f287.mp4",
      poster: "/uploads/867192da-b5f6-4d67-b4b5-8191723e46fe.jpg",
      desc: "Aproximação da câmera com entonação coloquial brasileira e sorriso natural.",
    },
    {
      id: 8,
      category: "commercial",
      type: "image",
      title: "Ensaio Fotográfico Minimalista",
      tag: "Campanha de Marca",
      url: "/uploads/ff6bb395-d216-467d-aa57-c3878b973993.jpg",
      poster: "/uploads/ff6bb395-d216-467d-aa57-c3878b973993.jpg",
      desc: "Fotografia editorial com proporções harmônicas e paleta de cores limpa.",
    },
  ];

  const filtered =
    activeFilter === "all"
      ? gallery
      : gallery.filter((item) => item.category === activeFilter);

  return (
    <section className="py-12 sm:py-16 px-3 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-12 w-full">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-sans tracking-widest text-cyan-400 uppercase font-medium">
            Resultados Reais
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-white tracking-tight">
            Exemplos criados na{" "}
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              plataforma
            </span>
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-light">
            Vídeos verticais e ensaios prontos para você veicular no TikTok, Instagram ou anúncios.
          </p>
        </div>

        {/* Filtros Discretos */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { key: "all", label: "Tudo" },
            { key: "ugc", label: "Influenciadores & Fala" },
            { key: "motion", label: "Motion & Dança" },
            { key: "commercial", label: "Comerciais & Produtos" },
            { key: "fashion", label: "Moda & Modelos" },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-sans transition-all cursor-pointer whitespace-nowrap min-h-[40px] ${
                activeFilter === f.key
                  ? "bg-white text-slate-950 font-semibold"
                  : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Cards Verticais (Estilo Octuz AI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-stretch">
        {filtered.map((item, idx) => {
          const delayClass =
            idx % 4 === 0
              ? "reveal-delay-1"
              : idx % 4 === 1
              ? "reveal-delay-2"
              : idx % 4 === 2
              ? "reveal-delay-3"
              : "reveal-delay-4";

          return (
            <div
              key={item.id}
              className={`group relative rounded-3xl overflow-hidden bg-[#0C0D12] border border-white/[0.08] hover:border-white/25 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between shadow-xl reveal-on-scroll ${delayClass}`}
            >
              {/* Visualizador de Mídia 9:16 ou Proporcional */}
              <div className="relative aspect-[9/14] w-full bg-black overflow-hidden flex items-center justify-center">
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    poster={item.poster}
                    autoPlay
                    loop
                    muted={activeAudioVideoId !== item.id}
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                )}

                {/* Tag de Categoria Superior */}
                <div className="absolute top-3 left-3 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-sans text-slate-200 font-medium">
                    {item.tag}
                  </span>
                </div>

                {/* Controle de Áudio para Vídeos */}
                {item.type === "video" && (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveAudioVideoId(
                        activeAudioVideoId === item.id ? null : item.id
                      )
                    }
                    className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white hover:bg-black hover:scale-110 active:scale-95 transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                    title={activeAudioVideoId === item.id ? "Mutar áudio" : "Ouvir áudio"}
                    aria-label={activeAudioVideoId === item.id ? "Mutar áudio do vídeo" : "Ouvir áudio do vídeo"}
                  >
                    {activeAudioVideoId === item.id ? (
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                )}
              </div>

              {/* Legenda Discreta e Elegante */}
              <div className="p-4 sm:p-5 space-y-1.5 bg-[#0C0D12]">
                <h4 className="text-sm font-medium text-white truncate">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
