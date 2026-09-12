"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

/**
 * Galeria Editorial Estática e Limpa:
 * - ZERO zoom
 * - ZERO escala
 * - ZERO distorção ou efeito estranho
 * - Reprodução suave e estável dos vídeos originais em alta definição.
 */
export function ResultsMasonryGallery() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const galleryItems = [
    {
      id: 1,
      category: "ugc",
      mediaType: "video",
      title: "Modelo Fashion Falando (Comercial)",
      modelTag: "Kling 2.6 Pro + Áudio",
      prompt: 'Uma fotografia de moda em corpo inteiro, a modelo em pé, apresentando a roupa com um sorriso radiante para a câmera, falando em português: "Gostou? Compre no carrinho laranja, agora mesmo!"',
      mediaUrl: "/uploads/f80d19de-085b-4378-98ea-b7733c8ffdd8.mp4",
      aspectRatio: "aspect-[9/16]",
      badge: "Vídeo & Fala 🗣️",
      accentColor: "border-violet-500/40 text-violet-300 bg-violet-950/60",
    },
    {
      id: 2,
      category: "ugc",
      mediaType: "video",
      title: "Atuação Interativa em Português",
      modelTag: "Seedance 2.0",
      prompt: 'faça ela ir andando ate a camera e dizer em portugues brasil: "Estou pronta pro churrasco, vai me convidar?"',
      mediaUrl: "/uploads/cacdb6d2-4c8a-4f7e-8f14-8e7d7a21f287.mp4",
      aspectRatio: "aspect-[9/16]",
      badge: "Seedance 2.0 ⚡",
      accentColor: "border-emerald-500/40 text-emerald-300 bg-emerald-950/60",
    },
    {
      id: 3,
      category: "fashion",
      mediaType: "image",
      title: "Modelo Brasileira Editorial 8K",
      modelTag: "Nano Banana Pro (Google)",
      prompt: "Full-length photograph, a beautiful Brazilian model with tanned, natural blonde skin showcasing realistic skin texture and visible pores. Symmetrical face, confident gaze, voluminous curly hair, elegant fashion pose, 85mm lens 8K.",
      mediaUrl: "/uploads/fc5afea8-272c-4afc-8deb-beebfa65a118.jpg",
      aspectRatio: "aspect-[9/16]",
      badge: "Foto Estúdio 8K 📸",
      accentColor: "border-amber-500/40 text-amber-300 bg-amber-950/60",
    },
    {
      id: 4,
      category: "fashion",
      mediaType: "video",
      title: "Lookbook Editorial em Estúdio",
      modelTag: "Kling 2.1 Pro",
      prompt: "Full-length fashion lookbook photograph, a young woman with a gentle smile stepping forward in a bright, modern studio, looking directly at the camera, fluid natural movement in 4K.",
      mediaUrl: "/uploads/bdc1b96b-d7d2-4f55-8f2b-a90631629c00.mp4",
      aspectRatio: "aspect-[9/16]",
      badge: "Kling 2.1 Pro 👑",
      accentColor: "border-cyan-500/40 text-cyan-300 bg-cyan-950/60",
    },
    {
      id: 5,
      category: "commercial",
      mediaType: "image",
      title: "Ensaio Fotográfico Fotorrealista",
      modelTag: "Nano Banana Pro (Google)",
      prompt: "Ultra-wide full-length shot of an athletic woman with natural curly brown hair and authentic skin texture in a clean minimalist studio with neutral white background, 28mm f/8 sharp focus head to toe.",
      mediaUrl: "/uploads/ff6bb395-d216-467d-aa57-c3878b973993.jpg",
      aspectRatio: "aspect-[9/16]",
      badge: "Corpo Inteiro 8K",
      accentColor: "border-pink-500/40 text-pink-300 bg-pink-950/60",
    },
    {
      id: 6,
      category: "ugc",
      mediaType: "video",
      title: "Atuação Carnaval & Eventos",
      modelTag: "Seedance 2.0 Native",
      prompt: 'faça ela ir andando ate a camera e dizer em portugues brasil: "Estou pronta para a Festa de Carnaval"',
      mediaUrl: "/uploads/87cf520d-8277-4f00-9644-26f4584735a6.mp4",
      aspectRatio: "aspect-[9/16]",
      badge: "Fala Nativa PT-BR",
      accentColor: "border-indigo-500/40 text-indigo-300 bg-indigo-950/60",
    },
  ];

  const filteredItems =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const handleCopyPrompt = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase font-semibold block">
            GALERIA & PRODUÇÕES REAIS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Criado com <span className="font-serif italic font-normal text-slate-300">VORIXA</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
            Peças audiovisuais e fotografias geradas na plataforma com qualidade cinematográfica original.
          </p>
        </div>

        {/* Filtros em Pílulas */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: "Todas as Criações" },
            { key: "ugc", label: "Influencers & Fala" },
            { key: "fashion", label: "Moda & Modelos" },
            { key: "commercial", label: "Comercial & Ads" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === f.key
                  ? "bg-white text-slate-950 shadow-lg font-bold"
                  : "bg-[#0D0E12] border border-[#1E202E] text-slate-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Mosaico Limpo com Conteúdo Real */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`relative rounded-3xl overflow-hidden bg-[#0D0E12] border border-[#1E202E] hover:border-slate-600 shadow-2xl group flex flex-col justify-between ${item.aspectRatio}`}
          >
            {/* Renderização condicional: Vídeo ou Foto Real */}
            {item.mediaType === "video" ? (
              <video
                src={item.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Gradient Overlay Suave */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/20 pointer-events-none" />

            {/* Badge Superior */}
            <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
              <span className={`px-3 py-1 rounded-lg border text-[10px] font-mono font-bold backdrop-blur-md ${item.accentColor}`}>
                {item.badge}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-slate-300 backdrop-blur-md">
                {item.modelTag}
              </span>
            </div>

            {/* Detalhes e Ação de Copiar Prompt */}
            <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white tracking-wide">
                  {item.title}
                </h4>
                <button
                  onClick={() => handleCopyPrompt(item.id, item.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
                  title="Copiar prompt de exemplo"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-300" />
                      <span>Copiar Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-mono opacity-80">
                "{item.prompt}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
