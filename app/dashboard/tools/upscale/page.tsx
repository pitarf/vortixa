"use client";

import React from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { FileUploader } from "@/components/ai/file-uploader";
import { useSearchParams } from "next/navigation";
import { Zap } from "lucide-react";

const UPSCALE_MODELS = [
  {
    id: "fal-ai/creative-upscaler",
    name: "VORTIXIA Ultra Upscaler 4K",
    badge: "Super Resolução Fiel 💎",
    cost: 5,
    description: "Super-resolução e texturização 4K preservando a integridade fisionômica, traços faciais e anatomia.",
    speed: "~ 25s",
  },
];

export default function UpscaleToolPage() {
  const searchParams = useSearchParams();
  const initialMedia = searchParams.get("video") || searchParams.get("sourceUrl") || searchParams.get("image") || "";
  const [mediaType, setMediaType] = React.useState<"image" | "video">(
    initialMedia.endsWith(".mp4") || initialMedia.includes("video") ? "video" : "image"
  );
  const selectedModel = UPSCALE_MODELS[0];

  return (
    <GenerationLayout
      toolSlug="upscale"
      title="Super-Resolução & Upscale 4K"
      description="Aumente a resolução para 2K/4K de imagens e vídeos mantendo 100% da integridade visual e anatômica."
      selectedModelId={selectedModel.id}
      customCost={selectedModel.cost}
      initialInputs={{
        video_url: mediaType === "video" ? initialMedia : "",
        image_url: mediaType === "image" ? initialMedia : "",
        scale_factor: "2",
        creativity: 0.0,
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6 w-full">
          {/* Seletor do Tipo de Mídia: Imagem vs Vídeo */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Tipo de Mídia para Super-Resolução
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#0E1017] border border-white/[0.08] rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setMediaType("image");
                  setInputVal("video_url", "");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] touch-manipulation ${
                  mediaType === "image"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>🖼️ Upscale de Imagem</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMediaType("video");
                  setInputVal("image_url", "");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] touch-manipulation ${
                  mediaType === "video"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>🎬 Upscale de Vídeo</span>
              </button>
            </div>
          </div>

          {/* Card do Motor de IA */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 font-mono">
              Motor de Super-Resolução e Preservação de Integridade
            </label>
            <div className="p-4 rounded-2xl border bg-[#13141B] border-violet-500/80 shadow-[0_0_24px_rgba(139,92,246,0.2)] flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-white">{selectedModel.name}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 whitespace-nowrap">
                  {selectedModel.cost} créditos
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedModel.description}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-[#1E202E]/60">
                <span className="text-cyan-400 font-semibold">{selectedModel.badge}</span>
                <span className="text-slate-500">{selectedModel.speed}</span>
              </div>
            </div>
          </div>

          {/* Seletor de Arquivo Adaptado */}
          {mediaType === "image" ? (
            <FileUploader
              accept="image/*"
              label="Foto / Imagem de Origem (JPG, PNG ou WEBP)"
              onUploadSuccess={(url) => {
                setInputVal("image_url", url);
                setInputVal("video_url", "");
              }}
              onClear={() => setInputVal("image_url", "")}
            />
          ) : (
            <FileUploader
              accept="video/*"
              label="Vídeo de Origem (MP4 ou MOV)"
              onUploadSuccess={(url) => {
                setInputVal("video_url", url);
                setInputVal("image_url", "");
              }}
              onClear={() => setInputVal("video_url", "")}
            />
          )}

          {/* Dica de Preservação de Integridade */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5">
            <span className="text-base shrink-0 mt-0.5">🛡️</span>
            <div className="space-y-0.5">
              <p className="font-bold text-emerald-300">Integridade Preservada (Zero Alucinação)</p>
              <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                O algoritmo atua em fidelidade cristalina sem distorcer o formato dos olhos, sorriso, proporções corporais ou detalhes originais da imagem.
              </p>
            </div>
          </div>

          <div className="w-full space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Fator de Escala de Super-Resolução
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {[
                { name: "2x Resolução (2K QHD)", value: "2", desc: "Equilíbrio ideal entre fidelidade e nitidez ótica" },
                { name: "4x Resolução (4K Ultra)", value: "4", desc: "Máxima densidade de pixels para telões e cinema" },
              ].map((scale) => (
                <button
                  key={scale.value}
                  type="button"
                  onClick={() => setInputVal("scale_factor", scale.value)}
                  className={`min-h-[64px] p-3.5 text-xs rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-start justify-center select-none active:scale-[0.98] touch-manipulation ${
                    inputs.scale_factor === scale.value
                      ? "bg-[#13141B] border-cyan-400 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/40"
                      : "bg-[#070709] border-[#1E202E] text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="font-bold text-sm font-heading">{scale.name}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{scale.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </GenerationLayout>
  );
}
