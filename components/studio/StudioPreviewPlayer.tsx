"use client";

import React, { useRef, useState } from "react";
import {
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
  Wand2,
  Download,
  RotateCcw,
  Layers,
  Boxes,
  Image as ImageIcon,
  Flame,
  X,
} from "lucide-react";
import { INSPIRATIONS, InspirationItem, ModelOption } from "./types";

interface StudioPreviewPlayerProps {
  isGenerating: boolean;
  stepText: string;
  currentModelDef: ModelOption;
  previewTab: "result" | "compare";
  onPreviewTabChange: (tab: "result" | "compare") => void;
  resultMediaUrl: string | null;
  resultMediaType: "image" | "video";
  referenceImageUrl: string;
  projectName: string;
  onOpenInFlow: () => void;
  isOpeningInFlow: boolean;
  onSelectInspiration: (insp: InspirationItem) => void;
  onSelectUpscale: () => void;
  onVary: () => void;
  onSetResultAsReference: () => void;
  defaultIcon?: React.ComponentType<{ className?: string }>;
}

export function StudioPreviewPlayer({
  isGenerating,
  stepText,
  currentModelDef,
  previewTab,
  onPreviewTabChange,
  resultMediaUrl,
  resultMediaType,
  referenceImageUrl,
  projectName,
  onOpenInFlow,
  isOpeningInFlow,
  onSelectInspiration,
  onSelectUpscale,
  onVary,
  onSetResultAsReference,
  defaultIcon: DefaultIcon,
}: StudioPreviewPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSec, setDurationSec] = useState(5);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setDurationSec(videoRef.current.duration || 5);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Container Principal do Player */}
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-4 sm:p-5 space-y-4">
        {/* Header do Player: Abas Resultado / Comparar + Fullscreen */}
        <div className="flex items-center justify-between border-b border-[#1E202E] pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreviewTabChange("result")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                previewTab === "result"
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Resultado
            </button>
            <button
              type="button"
              onClick={() => onPreviewTabChange("compare")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                previewTab === "compare"
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Comparar
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Visualizar em Tela Cheia"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tela Cheia</span>
          </button>
        </div>

        {/* Visualizador / Player Central */}
        <div className="relative rounded-2xl overflow-hidden bg-black border border-[#1E202E] aspect-video flex items-center justify-center group">
          {isGenerating ? (
            <div className="p-6 text-center space-y-4 max-w-sm">
              <div className="relative h-20 w-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 animate-ping" />
                <div className="h-20 w-20 rounded-full border-4 border-violet-600 border-t-cyan-400 animate-spin" />
                <Wand2 className="h-7 w-7 text-cyan-300 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white tracking-wide">{stepText}</h3>
                <p className="text-xs text-slate-400 font-mono">Motor: {currentModelDef.name}</p>
              </div>
            </div>
          ) : previewTab === "compare" && referenceImageUrl ? (
            <div className="grid grid-cols-2 w-full h-full">
              <div className="relative h-full border-r border-[#1E202E]">
                <img src={referenceImageUrl} alt="Original" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300">
                  Referência
                </span>
              </div>
              <div className="relative h-full">
                {resultMediaType === "video" && resultMediaUrl ? (
                  <video src={resultMediaUrl} autoPlay loop muted className="w-full h-full object-cover" />
                ) : (
                  <img src={resultMediaUrl || referenceImageUrl} alt="Gerado" className="w-full h-full object-cover" />
                )}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-emerald-400">
                  Gerado
                </span>
              </div>
            </div>
          ) : resultMediaUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {resultMediaType === "video" ? (
                <>
                  <video
                    ref={videoRef}
                    src={resultMediaUrl}
                    loop
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-contain"
                  />

                  {/* Botão Play Grande Central */}
                  {!isPlaying && (
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-20"
                    >
                      <Play className="h-7 w-7 fill-white ml-1" />
                    </button>
                  )}

                  {/* Barra de Controles Inferior */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    {/* Timeline */}
                    <input
                      type="range"
                      min={0}
                      max={durationSec || 5}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 accent-cyan-400 bg-white/20 rounded-lg cursor-pointer"
                    />

                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleTogglePlay}
                          className="hover:text-white cursor-pointer"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                        </button>
                        <span className="font-mono text-[11px]">
                          {formatSeconds(currentTime)} / {formatSeconds(durationSec)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.muted = !isMuted;
                              setIsMuted(!isMuted);
                            }
                          }}
                          className="hover:text-white cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsFullscreen(true)}
                          className="hover:text-white cursor-pointer"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <img src={resultMediaUrl} alt="Obra de IA" className="w-full h-full object-contain" />
              )}
            </div>
          ) : (
            <div className="p-8 text-center space-y-3">
              {DefaultIcon && (
                <div className="h-12 w-12 rounded-2xl bg-[#13141B] border border-[#1E202E] flex items-center justify-center text-slate-400 mx-auto">
                  <DefaultIcon className="h-6 w-6" />
                </div>
              )}
              <div className="text-xs text-slate-400 max-w-xs">
                Configure os parâmetros à esquerda e clique em <strong>Gerar</strong> para iniciar a inferência.
              </div>
            </div>
          )}
        </div>

        {/* Barra de Ações Rápidas Abaixo do Player */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <a
            href={resultMediaUrl || "#"}
            download="vorixa-studio-render"
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-slate-200 transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Baixar</span>
          </a>

          <button
            type="button"
            onClick={onVary}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-slate-200 transition-all cursor-pointer disabled:opacity-50"
            style={{ minHeight: "44px" }}
          >
            <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
            <span>Variar</span>
          </button>

          <button
            type="button"
            onClick={onSelectUpscale}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-amber-300 transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span>Upscale 4K</span>
          </button>

          <button
            type="button"
            onClick={onOpenInFlow}
            disabled={isOpeningInFlow}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-xs font-bold text-violet-300 transition-all cursor-pointer disabled:opacity-50"
            style={{ minHeight: "44px" }}
          >
            <Boxes className="h-3.5 w-3.5 text-violet-400" />
            <span>Flow</span>
          </button>

          <button
            type="button"
            onClick={onSetResultAsReference}
            className="p-2.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Usar como referência"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* SEÇÃO INFERIOR: Inspirações para você (Carrossel / 5 Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Inspirações para você
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-cyan-400 font-mono">
            {INSPIRATIONS.length} modelos
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {INSPIRATIONS.map((insp) => (
            <button
              key={insp.id}
              type="button"
              onClick={() => onSelectInspiration(insp)}
              className="group relative rounded-2xl overflow-hidden border border-[#1E202E] hover:border-violet-500/70 transition-all duration-300 text-left aspect-[4/5] bg-black cursor-pointer"
            >
              <img
                src={insp.thumb}
                alt={insp.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Badge de Duração / Resolução */}
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold text-slate-300">
                {insp.badge}
              </div>

              {/* Botão Play Sobreposto */}
              <div className="absolute inset-0 m-auto h-9 w-9 rounded-full bg-violet-600/80 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg">
                <Play className="h-4 w-4 fill-white ml-0.5" />
              </div>

              {/* Título e Modelo */}
              <div className="absolute bottom-2 inset-x-2">
                <div className="text-[11px] font-bold text-white leading-snug line-clamp-1">
                  {insp.title}
                </div>
                <div className="text-[9px] font-mono text-cyan-400">{insp.model}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal em Tela Cheia (Fullscreen Viewer) */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{projectName}</span>
              <span className="text-xs font-mono text-slate-400">({resultMediaType})</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 rounded-2xl bg-[#13141B] hover:bg-[#1E202E] text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 max-h-[85vh]">
            {resultMediaType === "video" && resultMediaUrl ? (
              <video src={resultMediaUrl} controls autoPlay loop className="max-w-full max-h-full rounded-2xl" />
            ) : (
              <img src={resultMediaUrl || ""} alt="Full render" className="max-w-full max-h-full object-contain rounded-2xl" />
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <a
              href={resultMediaUrl || "#"}
              download="vorixa-asset"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Baixar em Alta Resolução</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
