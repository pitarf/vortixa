"use client";

import React from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { FileUploader } from "@/components/ai/file-uploader";

const UPSCALE_MODELS = [
  {
    id: "fal-ai/creative-upscaler",
    name: "Creative Video Upscaler 4K",
    badge: "Ultra Definição",
    cost: 5,
    description: "Restauração facial, aumento de nitidez e super-resolução para 2K/4K",
    speed: "~ 35s",
  },
];

export default function UpscaleToolPage() {
  const selectedModel = UPSCALE_MODELS[0];

  return (
    <GenerationLayout
      toolSlug="upscale"
      title="Video Upscale"
      description="Aumente a definição e melhore a qualidade de seus vídeos gerados com inteligência artificial."
      selectedModelId={selectedModel.id}
      customCost={selectedModel.cost}
      initialInputs={{
        video_url: "",
        scale_factor: "2",
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6">
          {/* Card do Motor de IA */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Motor de Super-Resolução e Restauração
            </label>
            <div className="grid grid-cols-1 gap-3">
              {UPSCALE_MODELS.map((model) => (
                <div
                  key={model.id}
                  className="p-3.5 rounded-2xl border bg-[#13141B] border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/50 flex flex-col justify-between"
                  style={{ minHeight: "82px" }}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-white">
                      {model.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 whitespace-nowrap">
                      {model.cost} créditos
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-tight my-1.5">
                    {model.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1.5 border-t border-[#1E202E]/60">
                    <span className="text-cyan-400 font-semibold">{model.badge}</span>
                    <span className="text-slate-500">{model.speed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <FileUploader
            accept="video/*"
            label="Vídeo de Origem"
            onUploadSuccess={(url) => setInputVal("video_url", url)}
            onClear={() => setInputVal("video_url", "")}
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Escala de Upscale</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "2x Resolução", value: "2" },
                { name: "4x Resolução", value: "4" },
              ].map((scale) => (
                <button
                  key={scale.value}
                  type="button"
                  onClick={() => setInputVal("scale_factor", scale.value)}
                  className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-300 ${
                    inputs.scale_factor === scale.value
                      ? "bg-violet-600/10 border-violet-500 text-violet-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  {scale.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </GenerationLayout>
  );
}
