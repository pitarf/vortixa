"use client";

import React from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { PromptInput } from "@/components/ai/prompt-input";

export default function ImageToolPage() {
  return (
    <GenerationLayout
      toolSlug="geracao-imagem"
      title="Geração de Imagem"
      description="Crie ilustrações e fotos realistas de alta qualidade digitando um prompt."
      initialInputs={{
        prompt: "",
        image_size: "square_hd",
        num_inference_steps: 28,
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6">
          <PromptInput
            value={inputs.prompt || ""}
            onChange={(val) => setInputVal("prompt", val)}
            placeholder="Descreva a imagem detalhadamente... Ex: Um gato ciborgue com luzes neon violeta e ciano no estilo cyberpunk, alta qualidade, 4k"
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio (Proporção)</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Quadrado (1:1)", value: "square_hd" },
                { name: "Paisagem (16:9)", value: "landscape_16_9" },
                { name: "Retrato (9:16)", value: "portrait_16_9" },
              ].map((ratio) => (
                <button
                  key={ratio.value}
                  type="button"
                  onClick={() => setInputVal("image_size", ratio.value)}
                  className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-300 ${
                    inputs.image_size === ratio.value
                      ? "bg-violet-600/10 border-violet-500 text-violet-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  {ratio.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </GenerationLayout>
  );
}
