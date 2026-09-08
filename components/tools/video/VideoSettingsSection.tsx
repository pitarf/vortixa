"use client";

import React, { useState } from "react";
import { Settings2, ChevronDown, Crown } from "lucide-react";
import { VideoDuration, VideoQuality } from "./types";

interface VideoSettingsSectionProps {
  duration: VideoDuration;
  onChangeDuration: (duration: VideoDuration) => void;
  aspectRatio: string;
  onChangeAspectRatio: (ratio: string) => void;
  quality: VideoQuality;
  onChangeQuality: (quality: VideoQuality) => void;
  cameraMovement: string;
  onChangeCameraMovement: (movement: string) => void;
  seed: string;
  onChangeSeed: (seed: string) => void;
  negativePrompt: string;
  onChangeNegativePrompt: (negative: string) => void;
}

export function VideoSettingsSection({
  duration,
  onChangeDuration,
  aspectRatio,
  onChangeAspectRatio,
  quality,
  onChangeQuality,
  cameraMovement,
  onChangeCameraMovement,
  seed,
  onChangeSeed,
  negativePrompt,
  onChangeNegativePrompt,
}: VideoSettingsSectionProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Header com Marcador Circular 3 */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-[#13141B] border border-[#1E202E] flex items-center justify-center text-xs font-bold text-slate-300">
          3
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">Ajustes</h2>
          <p className="text-[11px] text-slate-400">Configure a duração e o formato</p>
        </div>
      </div>

      {/* Grid com 3 Colunas: Duração | Proporção | Qualidade */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Coluna 1: Duração (5s | 10s) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 block">Duração</label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#070709] border border-[#1E202E] rounded-xl">
            <button
              type="button"
              onClick={() => onChangeDuration("5")}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                duration === "5"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              style={{ minHeight: "36px" }}
            >
              5s
            </button>
            <button
              type="button"
              onClick={() => onChangeDuration("10")}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                duration === "10"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              style={{ minHeight: "36px" }}
            >
              10s
            </button>
          </div>
        </div>

        {/* Coluna 2: Proporção (16:9 | 9:16 | 1:1) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 block">Proporção</label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#070709] border border-[#1E202E] rounded-xl">
            {[
              { id: "16:9", label: "16:9" },
              { id: "9:16", label: "9:16" },
              { id: "1:1", label: "1:1" },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onChangeAspectRatio(r.id)}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  aspectRatio === r.id
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
                style={{ minHeight: "36px" }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Coluna 3: Qualidade (Padrão | Alta 👑) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 block">Qualidade</label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#070709] border border-[#1E202E] rounded-xl">
            <button
              type="button"
              onClick={() => onChangeQuality("standard")}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                quality === "standard"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              style={{ minHeight: "36px" }}
            >
              Padrão
            </button>
            <button
              type="button"
              onClick={() => onChangeQuality("high")}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                quality === "high"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              style={{ minHeight: "36px" }}
            >
              <span>Alta</span>
              <Crown className="w-3 h-3 text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Acordeão de Configurações Avançadas */}
      <div className="pt-2 border-t border-[#1E202E]/60">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Settings2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">Configurações avançadas (opcional)</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="space-y-3 pt-3 pb-1 animate-in fade-in-50 duration-200">
            {/* Movimento de Câmera */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 block">
                Movimento de Câmera
              </label>
              <select
                value={cameraMovement}
                onChange={(e) => onChangeCameraMovement(e.target.value)}
                className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="none">Automático / Dinâmico pelo Prompt</option>
                <option value="zoom_in">Zoom In (Aproximação Lenta)</option>
                <option value="zoom_out">Zoom Out (Afastamento)</option>
                <option value="pan_left">Panorâmica Esquerda (Pan Left)</option>
                <option value="pan_right">Panorâmica Direita (Pan Right)</option>
                <option value="orbit_360">Orbital 360 Graus</option>
                <option value="crane_down">Grua Descendente (Crane Down)</option>
              </select>
            </div>

            {/* Seed Numérica */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 block">
                Seed (Semente para Reprodutibilidade)
              </label>
              <input
                type="text"
                value={seed}
                onChange={(e) => onChangeSeed(e.target.value)}
                placeholder="Aleatória (deixe em branco se não souber)"
                className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500"
              />
            </div>

            {/* Prompt Negativo */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400 block">
                Prompt Negativo (O que evitar no vídeo)
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => onChangeNegativePrompt(e.target.value)}
                placeholder="Ex: borrões, distorções, membros extras, glitch, watermark"
                className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
