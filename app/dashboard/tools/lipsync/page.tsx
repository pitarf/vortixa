"use client";

import React from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { FileUploader } from "@/components/ai/file-uploader";
import { AudioSourceSelector } from "@/components/ai/audio-source-selector";

const LIPSYNC_MODELS = [
  {
    id: "fal-ai/latentsync",
    name: "LatentSync Pro",
    badge: "Alta Fidelidade 🎤",
    cost: 8,
    description: "Sincronia labial e fonética ultra-realista em Português e Inglês com preservação de dentes e formato da boca.",
    speed: "~ 30s",
  },
  {
    id: "fal-ai/sync-lipsync",
    name: "Sync Audio LipSync",
    badge: "Expressivo ✨",
    cost: 8,
    description: "Movimento labial natural com preservação de expressões faciais, micro-gestos e dinâmica de iluminação.",
    speed: "~ 25s",
  },
];

export default function LipSyncToolPage() {
  const [selectedModelId, setSelectedModelId] = React.useState<string>(LIPSYNC_MODELS[0].id);
  const selectedModel = LIPSYNC_MODELS.find((m) => m.id === selectedModelId) || LIPSYNC_MODELS[0];

  return (
    <GenerationLayout
      toolSlug="lip-sync"
      title="Sincronização Labial (Lip Sync)"
      description="Sincronize com perfeição a fala e os movimentos labiais de um personagem de vídeo com qualquer áudio ou voz gerada por IA."
      selectedModelId={selectedModelId}
      customCost={selectedModel.cost}
      initialInputs={{
        video_url: "",
        audio_url: "",
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6 w-full">
          {/* Seletor de Modelo LipSync com Touch Targets >= 48px */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 font-mono">
              Motor de Sincronia Labial
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LIPSYNC_MODELS.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModelId(model.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[96px] select-none active:scale-[0.98] touch-manipulation ${
                      isSelected
                        ? "bg-violet-50 dark:bg-[#13141B] border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.15)] ring-1 ring-violet-500"
                        : "bg-white dark:bg-[#070709] border-slate-200 dark:border-[#1E202E] hover:border-slate-400 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate font-heading">
                        {model.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20 whitespace-nowrap">
                        {model.cost} cr
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight my-1.5">
                      {model.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1.5 border-t border-slate-200 dark:border-[#1E202E]/60">
                      <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{model.badge}</span>
                      <span className="text-slate-500">{model.speed}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Uploads Duplos: Vídeo Original + Áudio de Fala com Touch Confortável */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <div className="space-y-2">
              <FileUploader
                accept="video/*"
                label="1. Vídeo com Rosto do Personagem"
                onUploadSuccess={(url) => setInputVal("video_url", url)}
                onClear={() => setInputVal("video_url", "")}
              />
            </div>

            <div className="space-y-2">
              <AudioSourceSelector
                label="2. Áudio de Fala (Gravação, MP3 ou Voz IA)"
                audioUrl={inputs.audio_url || ""}
                onAudioChange={(url) => setInputVal("audio_url", url)}
              />
            </div>
          </div>
        </div>
      )}
    </GenerationLayout>
  );
}
