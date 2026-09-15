"use client";

import React from "react";
import { Mic } from "lucide-react";
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
  const modelHasNativeAudio =
    selectedModelId.includes("v2.6") ||
    selectedModelId.includes("seedance") ||
    selectedModelId === "vorixa-ia";

  return (
    <div className="backdrop-blur-xl bg-[#0E1017]/85 border border-white/[0.08] rounded-2xl p-3.5 sm:p-4.5 space-y-3.5 text-xs shadow-xl">
      {/* Duração e Resolução em Pílulas Táteis Ergonômicas (min-h-[44px]) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Controle de Duração */}
        <div className="p-3 rounded-xl bg-[#070709]/80 border border-white/[0.06] flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Duração
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">{duration} segundos</span>
          </div>

          <div className={`grid ${selectedModelId.includes("seedance") ? "grid-cols-3" : "grid-cols-2"} gap-1.5 p-1 bg-[#0D0E12] rounded-xl border border-white/[0.04]`}>
            {[
              { val: "5", label: "5s", badge: "Padrão" },
              { val: "10", label: "10s", badge: "2x cr" },
              ...(selectedModelId.includes("seedance")
                ? [{ val: "30", label: "30s", badge: "Cinema" }]
                : []),
            ].map((d) => {
              const isSelected = duration === d.val;
              return (
                <button
                  key={d.val}
                  type="button"
                  onClick={() => onDurationChange(d.val)}
                  className={`py-2 px-1 rounded-lg font-mono text-xs font-bold transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? "bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20"
                      : "bg-[#070709] border border-transparent text-slate-400 hover:text-white hover:border-white/[0.08]"
                  }`}
                >
                  <span>{d.label}</span>
                  <span className={`text-[8px] font-sans ${isSelected ? "text-cyan-300" : "text-slate-500"}`}>
                    {d.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controle de Resolução */}
        <div className="p-3 rounded-xl bg-[#070709]/80 border border-white/[0.06] flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Resolução
            </span>
            <span className="text-[10px] font-mono text-violet-400 font-bold">
              {videoQuality === "ultra4k" ? "4K Ultra" : videoQuality === "high" ? "1080p Pro" : "720p HD"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0D0E12] rounded-xl border border-white/[0.04]">
            {[
              { id: "standard", label: "720p", badge: "HD" },
              { id: "high", label: "1080p", badge: "Pro 👑" },
              { id: "ultra4k", label: "4K", badge: "Ultra 🚀" },
            ].map((q) => {
              const isSelected = videoQuality === q.id;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onVideoQualityChange?.(q.id)}
                  className={`py-2 px-1 rounded-lg font-mono text-xs font-bold transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? q.id === "ultra4k"
                        ? "bg-gradient-to-tr from-violet-600 to-cyan-500 border border-cyan-400/80 text-white shadow-md shadow-violet-600/25"
                        : "bg-violet-600/30 border border-violet-500 text-violet-200 shadow-md shadow-violet-500/20"
                      : "bg-[#070709] border border-transparent text-slate-400 hover:text-white hover:border-white/[0.08]"
                  }`}
                  title={`${q.label} ${q.badge}`}
                >
                  <span>{q.label}</span>
                  <span className={`text-[8px] font-sans ${isSelected ? "text-white" : "text-slate-500"}`}>
                    {q.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Módulo de Voz de Estúdio ElevenLabs & LipSync (PT-BR) */}
      <div className="pt-3 border-t border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#070709]/70 border border-white/[0.06]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600/30 to-fuchsia-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 shrink-0">
              <Mic className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-white truncate">Voz de Estúdio BR & LipSync</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 font-bold">
                  ElevenLabs
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {modelHasNativeAudio
                  ? "Substitui áudio por voz humana natural em PT-BR (+9 cr)."
                  : "Gera fala neural sincronizada aos lábios em PT-BR (+9 cr)."}
              </p>
            </div>
          </div>

          {/* Switch estilo Apple com Touch Target >= 44x44px */}
          <label className="relative inline-flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px] p-2 shrink-0">
            <input
              type="checkbox"
              checked={enableTalkingVideo}
              onChange={(e) => onToggleTalkingVideo(e.target.checked)}
              className="sr-only peer"
              aria-label="Ativar Voz e Fala do Personagem"
            />
            <div className="w-11 h-6 bg-[#1E202E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[14px] after:left-[10px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-cyan-500 shadow-inner"></div>
          </label>
        </div>

        {enableTalkingVideo && (
          <div className="space-y-3 pt-1 animate-in fade-in-50 duration-200">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Voz do Locutor
                </span>
                <span className="text-[10px] text-violet-400 font-mono">Português Brasileiro</span>
              </div>

              {/* Touch Target Ajustado para 44px */}
              <div className="grid grid-cols-3 gap-1 bg-[#070709] p-1 rounded-xl border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => onGenderChange("all")}
                  className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
                    selectedGender === "all"
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
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
                  className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1 ${
                    selectedGender === "female"
                      ? "bg-fuchsia-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Feminino</span>
                  <span>👩</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onGenderChange("male");
                    onVoiceChange("Brian");
                  }}
                  className={`py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1 ${
                    selectedGender === "male"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Masculino</span>
                  <span>👨</span>
                </button>
              </div>

              <select
                value={selectedVoice}
                onChange={(e) => onVoiceChange(e.target.value)}
                className="w-full bg-[#070709] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500/80 transition-colors cursor-pointer min-h-[44px]"
              >
                {VORIXA_VOICES.filter((v) => {
                  if (selectedGender !== "all" && v.gender !== selectedGender) return false;
                  return true;
                }).map((voice) => (
                  <option key={voice.id} value={voice.id} className="bg-[#0D0E12] text-white">
                    {voice.name} ({voice.gender === "female" ? "Feminina" : "Masculina"}) - {voice.description || "Expressiva"}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold uppercase tracking-wider">Texto da Fala (Diálogo)</span>
                <span className="font-mono">{speechText.length} caracteres</span>
              </div>
              <textarea
                value={speechText}
                onChange={(e) => onSpeechTextChange(e.target.value)}
                rows={2}
                placeholder="Digite o que a modelo ou personagem deve falar em português com naturalidade..."
                className="w-full bg-[#070709] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/40 resize-none leading-relaxed transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
