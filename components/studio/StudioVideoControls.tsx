"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { VORIXA_VOICES } from "@/lib/voice-catalog";

interface StudioVideoControlsProps {
  selectedModelId?: string;
  duration: string;
  onDurationChange: (duration: string) => void;
  videoQuality?: string;
  onVideoQualityChange?: (quality: string) => void;
  cameraMotion: string;
  onCameraMotionChange: (motion: string) => void;
  enableTalkingVideo: boolean;
  onToggleTalkingVideo: (enabled: boolean) => void;
  speechText: string;
  onSpeechTextChange: (text: string) => void;
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  selectedGender: "all" | "female" | "male";
  onGenderChange: (gender: "all" | "female" | "male") => void;
}

export function StudioVideoControls({
  selectedModelId = "",
  duration,
  onDurationChange,
  videoQuality = "standard",
  onVideoQualityChange,
  cameraMotion,
  onCameraMotionChange,
  enableTalkingVideo,
  onToggleTalkingVideo,
  speechText,
  onSpeechTextChange,
  selectedVoice,
  onVoiceChange,
  selectedGender,
  onGenderChange,
}: StudioVideoControlsProps) {
  // Modelos como Kling 2.6 Pro e Seedance já geram vídeo com fala/áudio sincronizado nativamente pelo prompt,
  // portanto a opção de LipSync manual só deve aparecer para modelos de vídeo puro que NÃO possuem áudio/fala nativa (Kling 2.1, Wan, Luma, Minimax).
  const modelHasNativeAudio =
    selectedModelId.includes("v2.6") ||
    selectedModelId.includes("seedance") ||
    selectedModelId === "vorixa-ia";
  return (
    <div className="border border-[#1E202E] rounded-2xl p-4 bg-[#070709] space-y-3 text-xs">
      {/* Duração e Resolução do Vídeo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Duração */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13141B]/60 border border-[#1E202E]">
          <span className="text-slate-300 font-bold">Duração</span>
          <div className="flex gap-1.5">
            {["5", "10", "30"].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onDurationChange(d)}
                className={`px-3 py-2 rounded-lg font-mono font-bold transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
                  duration === d
                    ? "bg-cyan-600/30 border border-cyan-500 text-cyan-300"
                    : "bg-[#070709] text-slate-400 hover:text-white"
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        {/* Resolução (720p HD vs 1080p Pro vs 4K Ultra) */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#13141B]/60 border border-[#1E202E]">
          <span className="text-slate-300 font-bold">Resolução</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onVideoQualityChange?.("standard")}
              className={`px-2.5 py-2 rounded-lg font-mono text-[10px] font-bold transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                videoQuality === "standard"
                  ? "bg-violet-600 text-white"
                  : "bg-[#070709] text-slate-400 hover:text-white"
              }`}
              title="720p HD"
            >
              720p
            </button>
            <button
              type="button"
              onClick={() => onVideoQualityChange?.("high")}
              className={`px-2.5 py-2 rounded-lg font-mono text-[10px] font-bold transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                videoQuality === "high"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-[#070709] text-slate-400 hover:text-white"
              }`}
              title="1080p Full HD Pro"
            >
              1080p 👑
            </button>
            <button
              type="button"
              onClick={() => onVideoQualityChange?.("ultra4k")}
              className={`px-2.5 py-2 rounded-lg font-mono text-[10px] font-bold transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                videoQuality === "ultra4k"
                  ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm"
                  : "bg-[#070709] text-slate-400 hover:text-white"
              }`}
              title="4K Ultra Cinema"
            >
              4K 🚀
            </button>
          </div>
        </div>
      </div>

      {/* One-Shot Talking Video / LipSync com Voz de Estúdio ElevenLabs (PT-BR) */}
      <div className="pt-3 border-t border-[#1E202E] space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
            <span className="text-xs font-bold text-white truncate">Voz de Estúdio BR & LipSync (ElevenLabs)</span>
          </div>
          <label className="relative inline-flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px] p-2 -mr-2">
            <input
              type="checkbox"
              checked={enableTalkingVideo}
              onChange={(e) => onToggleTalkingVideo(e.target.checked)}
              className="sr-only peer"
              aria-label="Ativar Voz e Fala do Personagem"
            />
            <div className="w-10 h-5 bg-[#1E202E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[14px] after:left-[10px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-cyan-500"></div>
          </label>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          {modelHasNativeAudio
            ? "Opcional: Substitui o áudio sintetizado pelo realismo de atores brasileiros reais com ElevenLabs (+9 cr)."
            : "Gera a fala neural e sincroniza os lábios automaticamente (+9 cr)."}
        </p>

          {enableTalkingVideo && (
            <div className="space-y-2 pt-1 animate-in fade-in-50 duration-200">
              {/* Filtros Rápidos de Gênero e Idade */}
              <div className="space-y-1.5">
                <div className="grid grid-cols-3 gap-1 bg-[#13141B] p-1 rounded-xl border border-[#1E202E]">
                  <button
                    type="button"
                    onClick={() => onGenderChange("all")}
                    className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                      selectedGender === "all" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onGenderChange("female");
                      onVoiceChange("Rachel");
                    }}
                    className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                      selectedGender === "female" ? "bg-fuchsia-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Feminino 👩
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onGenderChange("male");
                      onVoiceChange("Brian");
                    }}
                    className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer min-h-[40px] flex items-center justify-center ${
                      selectedGender === "male" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Masculino 👨
                  </button>
                </div>

                <select
                  value={selectedVoice}
                  onChange={(e) => onVoiceChange(e.target.value)}
                  className="w-full bg-[#13141B] border border-[#1E202E] rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-violet-500 cursor-pointer min-h-[44px]"
                >
                  {VORIXA_VOICES.filter((v) => {
                    if (selectedGender !== "all" && v.gender !== selectedGender) return false;
                    return true;
                  }).map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Texto da Fala</span>
                <textarea
                  value={speechText}
                  onChange={(e) => onSpeechTextChange(e.target.value)}
                  rows={2}
                  placeholder="O que o personagem de vídeo deve falar em português..."
                  className="w-full bg-[#13141B] border border-[#1E202E] rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 resize-none leading-tight"
                />
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

