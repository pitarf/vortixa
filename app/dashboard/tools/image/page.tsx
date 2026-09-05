"use client";

import React, { useState } from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { PromptInput } from "@/components/ai/prompt-input";
import { Zap, Sparkles, Wand2, Crown, Check } from "lucide-react";

interface ModelOption {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  cost: number;
  icon: React.ComponentType<{ className?: string }>;
  recommended?: boolean;
}

const AVAILABLE_IMAGE_MODELS: ModelOption[] = [
  {
    id: "fal-ai/nano-banana-pro",
    name: "Google Imagen 3 (Gemini)",
    subtitle: "Pele Real, Cenas Vivas & Cenografia",
    badge: "3 CRÉDITOS",
    cost: 3,
    icon: Wand2,
    recommended: true,
  },
  {
    id: "fal-ai/flux-pro/v1.1-ultra",
    name: "FLUX 1.1 Pro Ultra",
    subtitle: "Estúdio Master 2K / Alta Definição",
    badge: "4 CRÉDITOS",
    cost: 4,
    icon: Crown,
  },
  {
    id: "fal-ai/recraft-v3",
    name: "Recraft V3 Cinema",
    subtitle: "Tipografia, Letreiros & Design",
    badge: "2 CRÉDITOS",
    cost: 2,
    icon: Sparkles,
  },
  {
    id: "fal-ai/flux/schnell",
    name: "FLUX Schnell",
    subtitle: "Rápido & Econômico",
    badge: "1 CRÉDITO",
    cost: 1,
    icon: Zap,
  },
];

export default function ImageToolPage() {
  const [selectedModel, setSelectedModel] = useState<ModelOption>(AVAILABLE_IMAGE_MODELS[0]); // Google Imagen 3 por padrão

  return (
    <GenerationLayout
      toolSlug="gerador-imagem"
      title="Geração de Imagem"
      description="Crie ilustrações e fotos realistas de alta qualidade escolhendo o motor de IA ideal para o seu projeto."
      selectedModelId={selectedModel.id}
      customCost={selectedModel.cost}
      initialInputs={{
        prompt: "",
        image_size: "square_hd",
        num_inference_steps: 28,
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6">
          {/* Seletor de Motor de IA */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-sm font-medium text-slate-300">
                Motor de Inteligência Artificial
              </label>
              <span className="text-xs text-violet-400 font-medium">
                Selecione a qualidade e o consumo de créditos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_IMAGE_MODELS.map((model) => {
                const Icon = model.icon;
                const isSelected = selectedModel.id === model.id;

                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModel(model)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? "bg-violet-950/30 border-violet-500 shadow-md shadow-violet-900/20"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? "bg-violet-600 text-white shadow-sm"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-200"}`}>
                            {model.name}
                          </span>
                          {model.recommended && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              RECOMENDADO
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{model.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                            : "bg-slate-800 border-slate-700 text-slate-400"
                        }`}
                      >
                        {model.badge}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-violet-400 mt-1" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campo de Prompt */}
          <PromptInput
            value={inputs.prompt || ""}
            onChange={(val) => setInputVal("prompt", val)}
            placeholder="Descreva a imagem detalhadamente... Ex: Uma jovem atleta de 25 anos de corpo todo na academia segurando uma garrafa de água, na parede escrito TREINE e PENSE"
          />

          {/* Proporção da Imagem */}
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
