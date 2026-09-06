"use client";

import React, { useState } from "react";
import { Mic, Upload, Sparkles, Volume2, Play, Square, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { FileUploader } from "@/components/ai/file-uploader";

interface AudioSourceSelectorProps {
  label?: string;
  audioUrl: string;
  onAudioChange: (url: string) => void;
}

export function AudioSourceSelector({
  label = "2. Áudio de Fala",
  audioUrl,
  onAudioChange,
}: AudioSourceSelectorProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "tts">("tts");
  const [ttsText, setTtsText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("pt-BR-FranciscaNeural");
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  const handleGenerateVoice = async () => {
    if (!ttsText.trim()) {
      toast.error("Por favor, digite o texto para narrar com a voz da IA.");
      return;
    }

    try {
      setIsGeneratingVoice(true);
      toast.loading("Sintetizando fala em português com inteligência artificial...", { id: "tts-gen" });

      const res = await fetch("/api/tools/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: ttsText.trim(),
          voice: selectedVoice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao sintetizar a voz.");
      }

      toast.success("Áudio narrado gerado com sucesso! (1 crédito consumido)", { id: "tts-gen" });
      onAudioChange(data.audioUrl);
    } catch (err: any) {
      toast.error(err.message || "Não foi possível gerar a fala.", { id: "tts-gen" });
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const handleTogglePlay = () => {
    if (!audioUrl) return;

    if (isPlaying && audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
      return;
    }

    const audio = new Audio(audioUrl);
    setAudioPlayer(audio);
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
    };

    audio.onerror = () => {
      setIsPlaying(false);
      toast.error("Não foi possível reproduzir a prévia do áudio.");
    };

    audio.play();
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          {label}
        </label>
        {audioUrl && (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Áudio Pronto
          </span>
        )}
      </div>

      {/* Tabs de Seleção: Gerar com IA vs Upload Próprio */}
      <div className="flex bg-[#070709] border border-[#1E202E] p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab("tts")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "tts"
              ? "bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 text-white border border-violet-500/40 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Gerar Voz com IA</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-violet-500/20 text-violet-300 font-mono">1 cr</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "upload"
              ? "bg-[#13141B] text-white border border-slate-700 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-slate-400" />
          <span>Upload de Arquivo</span>
        </button>
      </div>

      {/* Conteúdo da Aba 1: Geração de Áudio Neural com IA */}
      {activeTab === "tts" && (
        <div className="flex-1 flex flex-col justify-between border border-[#1E202E] rounded-2xl p-4 bg-[#070709] space-y-3">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-300">Voz em Português (Brasil)</span>
                <span className="text-[10px] text-cyan-400 font-mono">Neural Studio</span>
              </div>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-[#13141B] border border-[#1E202E] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500 cursor-pointer"
              >
                <option value="pt-BR-FranciscaNeural">Francisca (Feminina, Natural e Clara)</option>
                <option value="pt-BR-AntonioNeural">Antônio (Masculino, Confiante e Comercial)</option>
                <option value="pt-BR-ThalitaMultilingualNeural">Thalita (Feminina, Expressiva e Jovem)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-300">Texto para Fala</span>
                <span className="text-[10px] text-slate-500 font-mono">{ttsText.length}/1000</span>
              </div>
              <textarea
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="Digite exatamente o que o personagem de vídeo irá falar em português..."
                className="w-full bg-[#13141B] border border-[#1E202E] rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2 items-center">
            <button
              type="button"
              onClick={handleGenerateVoice}
              disabled={isGeneratingVoice || !ttsText.trim()}
              className="w-full flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-violet-600/20 transition-all cursor-pointer"
            >
              {isGeneratingVoice ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sintetizando Voz...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Gerar Fala com IA (1 crédito)</span>
                </>
              )}
            </button>

            {audioUrl && (
              <button
                type="button"
                onClick={handleTogglePlay}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#13141B] border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 font-mono text-xs cursor-pointer whitespace-nowrap"
                title="Ouvir áudio gerado"
              >
                {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? "Parar" : "Ouvir"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo da Aba 2: Upload Normal de MP3/WAV */}
      {activeTab === "upload" && (
        <div className="flex-1">
          <FileUploader
            accept="audio/*"
            label="Carregar Arquivo de Áudio"
            onUploadSuccess={(url) => onAudioChange(url)}
            onClear={() => onAudioChange("")}
          />
        </div>
      )}
    </div>
  );
}
