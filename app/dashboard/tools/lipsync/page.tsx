"use client";

import React from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { FileUploader } from "@/components/ai/file-uploader";
import { AudioSourceSelector } from "@/components/ai/audio-source-selector";

const LIPSYNC_MODELS = [
  { id: "fal-ai/latentsync", name: "LatentSync Pro", badge: "Alta Fidelidade", cost: 8, description: "Sincronia labial e fonética ultra-realista em Português e Inglês", speed: "~ 30s" },
  { id: "fal-ai/sync-lipsync", name: "Sync Audio LipSync", badge: "Expressivo", cost: 8, description: "Movimento labial natural com preservação de expressões faciais", speed: "~ 25s" },
];

export default function LipSyncToolPage() {
  const [selectedModelId, setSelectedModelId] = React.useState<string>(LIPSYNC_MODELS[0].id);
  const selectedModel = LIPSYNC_MODELS.find((m) => m.id === selectedModelId) || LIPSYNC_MODELS[0];

  return (
    <GenerationLayout
      toolSlug="lip-sync"
      title="Lip Sync"
      description="Sincronize com perfeição a fala e os movimentos labiais de um personagem de vídeo com qualquer áudio."
      selectedModelId={selectedModelId}
      customCost={selectedModel.cost}
      initialInputs={{
        video_url: "",
        audio_url: "",
      }}
    >
      {({ setInputVal, inputs }) => (
        <div className="space-y-6">
          {/* Seletor de Modelo LipSync */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FileUploader
              accept="video/*"
              label="1. Vídeo Original"
              onUploadSuccess={(url) => setInputVal("video_url", url)}
              onClear={() => setInputVal("video_url", "")}
            />

            <AudioSourceSelector
              label="2. Áudio de Fala"
              audioUrl={inputs.audio_url || ""}
              onAudioChange={(url) => setInputVal("audio_url", url)}
            />
          </div>
        </div>
      )}
    </GenerationLayout>
  );
}
