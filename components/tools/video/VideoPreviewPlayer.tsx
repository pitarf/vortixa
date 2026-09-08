"use client";

import React, { useRef, useState } from "react";
import {
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
  RefreshCw,
  Video as VideoIcon,
  X,
} from "lucide-react";
import { VideoRecentCreation } from "./types";

interface VideoPreviewPlayerProps {
  isGenerating: boolean;
  activeStepText: string;
  activeVideoUrl: string;
  recentCreations: VideoRecentCreation[];
  onSelectCreation: (creation: VideoRecentCreation) => void;
  aspectRatio: string;
}

export function VideoPreviewPlayer({
  isGenerating,
  activeStepText,
  activeVideoUrl,
  recentCreations,
  onSelectCreation,
  aspectRatio,
}: VideoPreviewPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlay = () => {
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
    if (videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Header do Player com Ponto Pulsante e Botão Tela Cheia */}
      <div className="flex items-center justify-between border-b border-[#1E202E] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Preview
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="p-1.5 rounded-lg bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">Tela Cheia</span>
        </button>
      </div>

      {/* Janela de Renderização / Vídeo com Player Centralizado */}
      <div className="relative rounded-2xl overflow-hidden border border-[#1E202E] bg-black flex items-center justify-center min-h-[380px] max-h-[520px] shadow-2xl group">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 animate-spin">
              <div className="h-full w-full bg-[#070709] rounded-2xl flex items-center justify-center">
                <VideoIcon className="h-6 w-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white font-heading">
                {activeStepText || "Renderizando vídeo na GPU..."}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Sintetizando frames temporais cinematográficos
              </p>
            </div>
          </div>
        ) : activeVideoUrl ? (
          <>
            <video
              ref={videoRef}
              src={activeVideoUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain max-h-[500px]"
              playsInline
              loop
            />

            {/* Botão Play/Pause Gigante Circular no Centro estilo mockup */}
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 hover:bg-black/20 transition-all"
            >
              <button
                type="button"
                className="h-16 w-16 rounded-full bg-violet-600/80 hover:bg-violet-600 text-white flex items-center justify-center shadow-2xl shadow-violet-600/60 border border-white/30 backdrop-blur-md transition-transform hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-white" />
                ) : (
                  <Play className="w-7 h-7 fill-white ml-1" />
                )}
              </button>
            </div>

            {/* Barra de Controles Inferior Estilo Cinema */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 pt-6 flex items-center gap-3 text-white text-xs">
              <button
                type="button"
                onClick={togglePlay}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <span className="text-[11px] font-mono text-slate-300 min-w-[70px]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* Slider de Progresso */}
              <input
                type="range"
                min={0}
                max={duration || 5}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-violet-500 h-1.5 bg-slate-700/80 rounded-lg cursor-pointer"
              />

              <button
                type="button"
                onClick={toggleMute}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="px-1.5 py-0.5 rounded bg-[#1E202E] text-[10px] font-mono font-bold text-slate-300">
                4K
              </span>

              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-slate-500">
            <div className="h-16 w-16 rounded-2xl bg-[#0D0E12] border border-[#1E202E] flex items-center justify-center text-slate-400 shadow-sm">
              <VideoIcon className="h-7 w-7 text-violet-400/60" />
            </div>
            <div className="space-y-1 max-w-xs">
              <p className="text-sm font-bold text-slate-300">Área de Visualização de Vídeo</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Configure sua cena e clique em <strong>Gerar Vídeo</strong> para assistir a renderização em tempo real.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Miniaturas Recentes (Grid Horizontal Inferior com Gerações Recentes Reais do Usuário) */}
      {recentCreations.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Gerações Recentes</span>
            <span className="text-[11px] text-slate-500 font-mono">
              {recentCreations.length} vídeo{recentCreations.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {recentCreations.slice(0, 5).map((item, idx) => {
              const isActive = activeVideoUrl === item.url;
              return (
                <button
                  key={item.id || idx}
                  type="button"
                  onClick={() => onSelectCreation(item)}
                  className={`relative rounded-xl overflow-hidden border aspect-video cursor-pointer transition-all ${
                    isActive
                      ? "border-cyan-400 shadow-md shadow-cyan-400/30 ring-1 ring-cyan-400 scale-[1.02]"
                      : "border-[#1E202E] hover:border-slate-600 opacity-70 hover:opacity-100"
                  }`}
                >
                  {item.thumbUrl ? (
                    <img
                      src={item.thumbUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-white text-white drop-shadow" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de Tela Cheia */}
      {isFullscreen && activeVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-xl bg-[#13141B] border border-[#1E202E] hover:border-slate-700 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <video
            src={activeVideoUrl}
            controls
            autoPlay
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
