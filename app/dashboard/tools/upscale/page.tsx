"use client";

import React from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { FileUploader } from "@/components/ai/file-uploader";
import { useSearchParams } from "next/navigation";
import { Zap } from "lucide-react";

const UPSCALE_MODELS = [
  {
    id: "fal-ai/creative-upscaler",
    name: "Creative Video Upscaler 4K",
    badge: "Ultra Definição 💎",
    cost: 5,
    description: "Restauração facial, aumento de nitidez, remoção de artefatos de compressão e super-resolução para 2K/4K.",
    speed: "~ 35s",
  },
];

export default function UpscaleToolPage() {
  const searchParams = useSearchParams();
  const initialMedia = searchParams.get("video") || searchParams.get("sourceUrl") || searchParams.get("image") || "";
  const selectedModel = UPSCALE_MODELS[0];

  return (
    <GenerationLayout
      toolSlug="upscale"
      title="Video Upscale 4K"
      description="Aumente a resolução e restaure detalhes anatômicos e faciais de vídeos criados com IA."
      selectedModelId={selectedModel.id}
      customCost={selectedModel.cost}
      initialInputs={{
        video_url: initialMedia,
        scale_factor: "2",
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6 w-full">
          {/* Card do Motor de IA */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 font-mono">
              Motor de Super-Resolução e Restauração
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

          <FileUploader
            accept="video/*"
            label="Vídeo de Origem (MP4 ou MOV)"
            onUploadSuccess={(url) => setInputVal("video_url", url)}
            onClear={() => setInputVal("video_url", "")}
          />

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
