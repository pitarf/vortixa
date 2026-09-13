"use client";

import React from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { PromptInput } from "@/components/ai/prompt-input";
import { FileUploader } from "@/components/ai/file-uploader";

const MOTION_MODELS = [
  {
    id: "fal-ai/kling-video/v3/standard/motion-control",
    name: "Kling Video v3 Motion Control",
    badge: "Fidelidade Óssea",
    cost: 15,
    description: "Transfere poses e movimentos de corpo inteiro de um vídeo para imagem estática",
    speed: "~ 60s",
  },
];

export default function MotionToolPage() {
  const selectedModel = MOTION_MODELS[0];

  return (
    <GenerationLayout
      toolSlug="motion-control"
      title="Motion Control"
      description="Transfira poses e movimentos corporais de um vídeo de referência para uma imagem estática de personagem."
      selectedModelId={selectedModel.id}
      customCost={selectedModel.cost}
      initialInputs={{
        prompt: "",
        character_image_url: "",
        reference_video_url: "",
        character_orientation: "video",
        keep_original_sound: true,
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6">
          {/* Card do Motor de IA */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Motor de IA para Animação de Movimento
            </label>
            <div className="grid grid-cols-1 gap-3">
              {MOTION_MODELS.map((model) => (
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
          {/* Uploads Duplos: Personagem + Movimento de Referência (1 coluna mobile, 2 colunas desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <FileUploader
              accept="image/*"
              label="1. Personagem (Imagem)"
              onUploadSuccess={(url) => setInputVal("character_image_url", url)}
              onClear={() => setInputVal("character_image_url", "")}
            />

            <FileUploader
              accept="video/*"
              label="2. Movimento (Vídeo de Referência)"
              onUploadSuccess={(url) => setInputVal("reference_video_url", url)}
              onClear={() => setInputVal("reference_video_url", "")}
            />
          </div>

          {/* Opções de Orientação & Áudio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#13141B] border border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Orientação da Pose
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInputVal("character_orientation", "video")}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-left ${
                    (inputs.character_orientation || "video") === "video"
                      ? "bg-violet-600/20 border-violet-500 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <span className="block font-bold">🕺 Seguir Vídeo (Recomendado)</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Ideal para danças e movimentos dinâmicos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputVal("character_orientation", "image")}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-left ${
                    inputs.character_orientation === "image"
                      ? "bg-violet-600/20 border-violet-500 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <span className="block font-bold">🖼️ Seguir Imagem</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Mantém ângulo e câmera originais da foto</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Áudio do Vídeo
              </label>
              <label className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors" style={{ minHeight: "44px" }}>
                <input
                  type="checkbox"
                  checked={inputs.keep_original_sound !== false}
                  onChange={(e) => setInputVal("keep_original_sound", e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded bg-slate-800 border-slate-700 focus:ring-violet-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-200 block">Preservar áudio/música original</span>
                  <span className="text-[11px] text-slate-400 block">Mantém o som e ritmo da referência</span>
                </div>
              </label>
            </div>
          </div>

          <PromptInput
            value={inputs.prompt || ""}
            onChange={(val) => setInputVal("prompt", val)}
            placeholder="Opcional: Detalhes adicionais sobre a cena final..."
            label="Prompt de Apoio (Opcional)"
          />
        </div>
      )}
    </GenerationLayout>
  );
}
