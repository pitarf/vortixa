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
import { INSPIRATIONS, InspirationItem, ModelOption, StudioHistoryItem } from "./types";

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
  recentCreations?: StudioHistoryItem[];
  onSelectRecentCreation?: (url: string, mediaType: "image" | "video") => void;
  imageSize?: string;
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
  recentCreations = [],
  onSelectRecentCreation,
  imageSize = "landscape_16_9",
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
      {/* Container Principal do Player com Zero CLS */}
      <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-3.5 sm:p-5 space-y-4 shadow-2xl">
        {/* Header do Player: Abas Resultado / Comparar + Fullscreen */}
        <div className="flex items-center justify-between border-b border-[#1E202E] pb-3 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onPreviewTabChange("result")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
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
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center justify-center ${
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
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] rounded-xl hover:bg-[#13141B]"
            title="Visualizar em Tela Cheia"
            aria-label="Visualizar em Tela Cheia"
          >
            <Maximize2 className="h-4 w-4" />
            <span className="hidden sm:inline">Tela Cheia</span>
          </button>
        </div>

        {/* Visualizador Central com Enquadramento Dinâmico sem Cortes (Zero CLS) */}
        <div className="relative rounded-2xl overflow-hidden bg-black border border-[#1E202E] w-full min-h-[300px] sm:min-h-[420px] max-h-[650px] flex items-center justify-center group shadow-inner">
          {isGenerating ? (
            <div className="p-6 text-center space-y-4 max-w-sm">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 animate-ping" />
                <div className="h-full w-full rounded-full border-4 border-violet-600 border-t-cyan-400 animate-spin" />
                <Wand2 className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-300 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">{stepText}</h3>
                <p className="text-[11px] text-slate-400 font-mono">Motor: {currentModelDef.name}</p>
              </div>
            </div>
          ) : previewTab === "compare" && referenceImageUrl ? (
            <div className="grid grid-cols-2 w-full h-full min-h-[300px] sm:min-h-[420px]">
              <div className="relative h-full border-r border-[#1E202E] bg-[#070709] flex items-center justify-center overflow-hidden">
                <img src={referenceImageUrl} alt="Original" className="w-full h-full object-contain" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300 z-10">
                  Referência
                </span>
              </div>
              <div className="relative h-full bg-[#070709] flex items-center justify-center overflow-hidden">
                {resultMediaType === "video" && resultMediaUrl ? (
                  <video src={resultMediaUrl} autoPlay loop muted playsInline className="w-full h-full object-contain" />
                ) : (
                  <img src={resultMediaUrl || referenceImageUrl} alt="Gerado" className="w-full h-full object-contain" />
                )}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-emerald-400 z-10">
                  Gerado
                </span>
              </div>
            </div>
          ) : resultMediaUrl ? (
            <div className="relative w-full h-full min-h-[300px] sm:min-h-[420px] flex items-center justify-center bg-[#070709] overflow-hidden">
              {/* Blur de Fundo Ambiental Suave da Própria Mídia */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-25 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${resultMediaUrl})` }}
              />

              {resultMediaType === "video" ? (
                <>
                  <video
                    ref={videoRef}
                    src={resultMediaUrl}
                    loop
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    className="relative z-10 max-h-[620px] w-auto max-w-full object-contain shadow-2xl"
                  />

                  {/* Botão Play Central com Touch Target Amplo */}
                  {!isPlaying && (
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      className="absolute inset-0 m-auto h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-20 min-h-[44px] min-w-[44px]"
                      aria-label="Reproduzir vídeo"
                    >
                      <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-white ml-1" />
                    </button>
                  )}

                  {/* Barra de Controles Inferior com Altura Tátil */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 space-y-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-20">
                    <input
                      type="range"
                      min={0}
                      max={durationSec || 5}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 accent-cyan-400 bg-white/20 rounded-lg cursor-pointer"
                    />

                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleTogglePlay}
                          className="hover:text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
                          aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                        </button>
                        <span className="font-mono text-[11px]">
                          {formatSeconds(currentTime)} / {formatSeconds(durationSec)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.muted = !isMuted;
                              setIsMuted(!isMuted);
                            }
                          }}
                          className="hover:text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
                          aria-label={isMuted ? "Ativar som" : "Desativar som"}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsFullscreen(true)}
                          className="hover:text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
                          aria-label="Tela cheia"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <img
                  src={resultMediaUrl}
                  alt="Obra de IA"
                  className="relative z-10 max-h-[620px] w-auto max-w-full object-contain shadow-2xl animate-in fade-in duration-300"
                />
              )}
            </div>
          ) : (
            <div className="p-6 sm:p-8 text-center space-y-3">
              {DefaultIcon && (
                <div className="h-12 w-12 rounded-2xl bg-[#13141B] border border-[#1E202E] flex items-center justify-center text-slate-400 mx-auto">
                  <DefaultIcon className="h-6 w-6" />
                </div>
              )}
              <div className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Configure os parâmetros à esquerda e clique em <strong>Gerar</strong> para iniciar a renderização.
              </div>
            </div>
          )}
        </div>

        {/* Barra de Ações Rápidas Abaixo do Player com Touch Targets Ergonômicos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:flex items-center gap-2 pt-1">
          <a
            href={resultMediaUrl || "#"}
            download="vortixia-studio-render"
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-slate-200 transition-all cursor-pointer min-h-[44px]"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span>Baixar</span>
          </a>

          <button
            type="button"
            onClick={onVary}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-slate-200 transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            <RotateCcw className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>Variar</span>
          </button>

          <button
            type="button"
            onClick={onSelectUpscale}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-amber-300 transition-all cursor-pointer min-h-[44px]"
          >
            <Layers className="h-4 w-4 text-amber-400 shrink-0" />
            <span>Upscale 4K</span>
          </button>

          <button
            type="button"
            onClick={onOpenInFlow}
            disabled={isOpeningInFlow}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-xs font-bold text-violet-300 transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            <Boxes className="h-4 w-4 text-violet-400 shrink-0" />
            <span>Flow</span>
          </button>

          <button
            type="button"
            onClick={onSetResultAsReference}
            className="col-span-2 sm:col-span-1 md:col-auto p-2.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-slate-400 hover:text-white transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Usar como referência"
            aria-label="Usar como imagem de referência"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* SEÇÃO DE GERAÇÕES RECENTES COM ASPECT RATIO E TOUCH TARGETS */}
      {recentCreations.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-white">Gerações Recentes</span>
            <span className="text-[11px] text-slate-500 font-mono">
              {recentCreations.length} mídia{recentCreations.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex sm:grid sm:grid-cols-5 gap-2 overflow-x-auto no-scrollbar touch-pan-x pb-1.5">
            {recentCreations.slice(0, 5).map((item, idx) => {
              const isActive = resultMediaUrl === item.url;
              return (
                <button
                  key={item.id || idx}
                  type="button"
                  onClick={() => onSelectRecentCreation?.(item.url, item.mediaType || "image")}
                  className={`relative rounded-xl overflow-hidden border aspect-video cursor-pointer transition-all shrink-0 w-28 sm:w-auto min-h-[44px] bg-[#070709] ${
                    isActive
                      ? "border-cyan-400 shadow-md shadow-cyan-400/30 ring-1 ring-cyan-400 scale-[1.02]"
                      : "border-[#1E202E] hover:border-slate-600 opacity-70 hover:opacity-100"
                  }`}
                >
                  {item.mediaType === "video" ? (
                    <video src={item.url} className="w-full h-full object-cover aspect-video" muted playsInline />
                  ) : (
                    <img src={item.url} alt={item.prompt || "Criação"} className="w-full h-full object-cover aspect-video" />
                  )}
                  {item.mediaType === "video" && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 fill-white text-white drop-shadow" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SEÇÃO INFERIOR: Inspirações com Aspect Ratio Fixo */}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {INSPIRATIONS.map((insp) => (
            <button
              key={insp.id}
              type="button"
              onClick={() => onSelectInspiration(insp)}
              className="group relative rounded-2xl overflow-hidden border border-[#1E202E] hover:border-violet-500/70 transition-all duration-300 text-left aspect-[4/5] bg-[#070709] cursor-pointer min-h-[44px]"
            >
              <img
                src={insp.thumb}
                alt={insp.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold text-slate-300">
                {insp.badge}
              </div>

              <div className="absolute inset-0 m-auto h-10 w-10 rounded-full bg-violet-600/80 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg">
                <Play className="h-4 w-4 fill-white ml-0.5" />
              </div>

              <div className="absolute bottom-2 inset-x-2">
                <div className="text-[11px] font-bold text-white leading-snug line-clamp-1 break-words">
                  {insp.title}
                </div>
                <div className="text-[9px] font-mono text-cyan-400">{insp.model}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal em Tela Cheia Adaptativo com Altura 100dvh */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 h-[100dvh] pb-[max(1rem,env(safe-area-inset-bottom))] animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">{projectName}</span>
              <span className="text-xs font-mono text-slate-400">({resultMediaType})</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 rounded-2xl bg-[#13141B] hover:bg-[#1E202E] text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Fechar tela cheia"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 max-h-[80vh] w-full">
            {resultMediaType === "video" && resultMediaUrl ? (
              <video src={resultMediaUrl} controls autoPlay loop className="max-w-full max-h-full rounded-2xl aspect-video object-contain" />
            ) : (
              <img src={resultMediaUrl || ""} alt="Full render" className="max-w-full max-h-full object-contain rounded-2xl aspect-video" />
            )}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href={resultMediaUrl || "#"}
              download="vortixia-asset"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold cursor-pointer min-h-[48px]"
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
