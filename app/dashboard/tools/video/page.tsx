"use client";

import React, { useState } from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { PromptInput } from "@/components/ai/prompt-input";
import { FileUploader } from "@/components/ai/file-uploader";

const VIDEO_MODELS = [
  { id: "fal-ai/kling-video/v2.1/pro/image-to-video", name: "Kling 2.1 Pro", badge: "Cinema Master", cost: 15, description: "Última geração Kling com máxima consistência temporal e física", speed: "~ 60s" },
  { id: "fal-ai/luma-dream-machine/ray-2", name: "Luma Ray 2", badge: "Física Realista", cost: 12, description: "Arquitetura Ray 2 de alta coerência dinâmica e controle de câmera", speed: "~ 45s" },
  { id: "fal-ai/wan-i2v", name: "Wan 2.1 High-Motion", badge: "Fluidez Extrema", cost: 10, description: "Movimentos corporais fluidos e grande estabilidade em 720p", speed: "~ 35s" },
  { id: "fal-ai/minimax/video-01-live", name: "Hailuo Minimax 01 Live", badge: "Expressões Vivas", cost: 12, description: "Renderização humana hiper-expressiva e ação contínua", speed: "~ 40s" },
];

export default function VideoToolPage() {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [selectedModelId, setSelectedModelId] = useState<string>(VIDEO_MODELS[0].id);

  const selectedModel = VIDEO_MODELS.find((m) => m.id === selectedModelId) || VIDEO_MODELS[0];

  return (
    <GenerationLayout
      toolSlug="imagem-video"
      title="Imagem/Texto para Vídeo"
      description="Crie vídeos realistas a partir de descrições textuais ou dando movimento a uma imagem."
      selectedModelId={selectedModelId}
      customCost={selectedModel.cost}
      initialInputs={{
        prompt: "",
        image_url: "",
        duration: "5",
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6">
          {/* Seletor de Modelo de IA (Cards Táteis) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Motor de IA para Vídeo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {VIDEO_MODELS.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModelId(model.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#13141B] border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/50"
                        : "bg-[#070709] border-[#1E202E] hover:border-slate-700 opacity-85 hover:opacity-100"
                    }`}
                    style={{ minHeight: "82px" }}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">
                        {model.name}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 whitespace-nowrap">
                        {model.cost} cr
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight my-1">
                      {model.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-[#1E202E]/60">
                      <span className="text-cyan-400 font-semibold">{model.badge}</span>
                      <span className="text-slate-500">{model.speed}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seletor de Modo */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Modo de Geração</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode("text");
                  setInputVal("image_url", "");
                }}
                className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-300 ${
                  mode === "text"
                    ? "bg-violet-600/10 border-violet-500 text-violet-400"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
                style={{ minHeight: "44px" }}
              >
                Texto para Vídeo
              </button>
              <button
                type="button"
                onClick={() => setMode("image")}
                className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-300 ${
                  mode === "image"
                    ? "bg-violet-600/10 border-violet-500 text-violet-400"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
                style={{ minHeight: "44px" }}
              >
                Imagem para Vídeo
              </button>
            </div>
          </div>

          {mode === "image" && (
            <FileUploader
              accept="image/*"
              label="Imagem Estática de Origem"
              onUploadSuccess={(url) => setInputVal("image_url", url)}
              onClear={() => setInputVal("image_url", "")}
            />
          )}

          <PromptInput
            value={inputs.prompt || ""}
            onChange={(val) => setInputVal("prompt", val)}
            placeholder={
              mode === "image"
                ? "Descreva a movimentação ou a ação desejada no vídeo... Ex: A câmera faz zoom lento enquanto o cabelo da moça voa ao vento"
                : "Descreva a cena cinematográfica que deseja gerar... Ex: Um astronauta caminhando na areia vermelha de Marte, iluminação dramática"
            }
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Duração</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "5 Segundos", value: "5" },
                { name: "10 Segundos", value: "10" },
              ].map((dur) => (
                <button
                  key={dur.value}
                  type="button"
                  onClick={() => setInputVal("duration", dur.value)}
                  className={`py-3 px-4 text-xs font-bold rounded-xl border transition-all duration-300 ${
                    inputs.duration === dur.value
                      ? "bg-violet-600/10 border-violet-500 text-violet-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  {dur.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </GenerationLayout>
  );
}
