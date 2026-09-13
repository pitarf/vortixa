"use client";

import React, { useState, useRef } from "react";
import { GenerationLayout } from "@/components/ai/generation-layout";
import { PromptInput } from "@/components/ai/prompt-input";
import { toast } from "sonner";
import {
  Upload,
  Video,
  Image as ImageIcon,
  RefreshCw,
  Film,
  Camera,
  Volume2,
  VolumeX,
} from "lucide-react";

const MOTION_MODELS = [
  {
    id: "fal-ai/kling-video/v3/standard/motion-control",
    name: "Kling Video v3 Motion Control",
    badge: "Fidelidade Óssea 🦴",
    cost: 15,
    description: "Transfere poses, gestos e coreografias de corpo inteiro de um vídeo para imagem estática com cinematografia fidedigna.",
    speed: "~ 60s",
  },
];

export default function MotionToolPage() {
  const selectedModel = MOTION_MODELS[0];

  return (
    <GenerationLayout
      toolSlug="motion-control"
      title="Motion Control"
      description="Transfira poses e movimentos corporais de um vídeo de referência para uma imagem estática de personagem com fidelidade óssea."
      selectedModelId={selectedModel.id}
      customCost={selectedModel.cost}
      initialInputs={{
        prompt: "",
        character_image_url: "",
        reference_video_url: "",
        character_orientation: "video",
        keep_original_sound: true,
      }}
    >
      {({ setInputVal, inputs }) => (
        <MotionToolForm setInputVal={setInputVal} inputs={inputs} model={selectedModel} />
      )}
    </GenerationLayout>
  );
}

interface MotionFormProps {
  setInputVal: (key: string, val: any) => void;
  inputs: Record<string, any>;
  model: typeof MOTION_MODELS[0];
}

function MotionToolForm({ setInputVal, inputs, model }: MotionFormProps) {
  const [isDraggingChar, setIsDraggingChar] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [isUploadingChar, setIsUploadingChar] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const charInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File, type: "character" | "video") => {
    const isChar = type === "character";
    const setUploading = isChar ? setIsUploadingChar : setIsUploadingVideo;

    if (isChar && !file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem (JPG, PNG ou WEBP).");
      return;
    }
    if (!isChar && !file.type.startsWith("video/")) {
      toast.error("Por favor, selecione um arquivo de vídeo (MP4 ou MOV).");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/tools/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Falha no envio do arquivo.");
      const data = await res.json();

      if (isChar) {
        setInputVal("character_image_url", data.url);
        toast.success("Foto do personagem anexada com sucesso!");
      } else {
        setInputVal("reference_video_url", data.url);
        toast.success("Vídeo de movimento carregado com sucesso!");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro no upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* 1. Card do Motor de IA */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 font-mono">
          Motor de Animação Óssea
        </label>
        <div className="p-4 rounded-2xl border bg-[#13141B] border-violet-500/80 shadow-[0_0_24px_rgba(139,92,246,0.2)] flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-bold text-white">{model.name}</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 whitespace-nowrap">
              {model.cost} créditos
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {model.description}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-[#1E202E]">
            <span className="text-cyan-400 font-semibold">{model.badge}</span>
            <span className="text-slate-500">{model.speed}</span>
          </div>
        </div>
      </div>

      {/* 2. Zonas de Upload Responsivas com Drag-and-Drop e Botões >= 44px */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          Mídias de Entrada Obrigatórias
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Slot 1: Personagem (Imagem) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Personagem (Foto)</span>
              </span>
              {inputs.character_image_url && (
                <button
                  type="button"
                  onClick={() => setInputVal("character_image_url", "")}
                  className="text-xs font-mono text-rose-400 hover:text-rose-300 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-end px-1 touch-manipulation"
                >
                  Remover
                </button>
              )}
            </div>

            <input
              type="file"
              ref={charInputRef}
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "character")}
              className="hidden"
            />

            {inputs.character_image_url ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#1E202E] bg-[#070709] h-48 flex items-center justify-center group shadow-md">
                <img
                  src={inputs.character_image_url}
                  alt="Personagem"
                  className="w-full h-full object-contain p-2"
                />
                <button
                  type="button"
                  onClick={() => charInputRef.current?.click()}
                  className="absolute bottom-3 px-4 py-2.5 rounded-xl bg-black/85 border border-white/20 text-white text-xs font-semibold hover:bg-black transition-colors min-h-[44px] touch-manipulation cursor-pointer shadow-lg"
                >
                  Trocar Foto
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingChar(true);
                }}
                onDragLeave={() => setIsDraggingChar(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingChar(false);
                  if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0], "character");
                }}
                onClick={() => charInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[176px] touch-manipulation select-none active:scale-[0.99] ${
                  isDraggingChar
                    ? "border-cyan-400 bg-cyan-950/20"
                    : "border-[#1E202E] hover:border-violet-500/70 bg-[#070709] hover:bg-[#0D0E12]"
                }`}
              >
                {isUploadingChar ? (
                  <RefreshCw className="w-6 h-6 text-violet-400 animate-spin mb-2" />
                ) : (
                  <Upload className="w-6 h-6 text-violet-400 mb-2" />
                )}
                <span className="text-xs font-bold text-slate-200">Foto do Personagem</span>
                <span className="text-[10px] text-slate-500 mt-1 mb-2">Arraste ou escolha uma imagem (JPG/PNG)</span>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    charInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#13141B] hover:bg-violet-600/30 border border-[#1E202E] hover:border-violet-500/50 text-slate-200 text-xs font-semibold min-h-[44px] flex items-center justify-center transition-all touch-manipulation"
                >
                  Escolher Imagem
                </button>
              </div>
            )}
          </div>

          {/* Slot 2: Movimento (Vídeo de Referência) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-violet-400" />
                <span>2. Movimento Guia (Vídeo)</span>
              </span>
              {inputs.reference_video_url && (
                <button
                  type="button"
                  onClick={() => setInputVal("reference_video_url", "")}
                  className="text-xs font-mono text-rose-400 hover:text-rose-300 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-end px-1 touch-manipulation"
                >
                  Remover
                </button>
              )}
            </div>

            <input
              type="file"
              ref={videoInputRef}
              accept="video/*"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "video")}
              className="hidden"
            />

            {inputs.reference_video_url ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#1E202E] bg-[#070709] h-48 flex items-center justify-center group shadow-md">
                <video
                  src={inputs.reference_video_url}
                  controls
                  playsInline
                  className="w-full h-full object-contain p-2"
                />
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="absolute bottom-3 px-4 py-2.5 rounded-xl bg-black/85 border border-white/20 text-white text-xs font-semibold hover:bg-black transition-colors min-h-[44px] touch-manipulation cursor-pointer shadow-lg"
                >
                  Trocar Vídeo
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingVideo(true);
                }}
                onDragLeave={() => setIsDraggingVideo(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingVideo(false);
                  if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0], "video");
                }}
                onClick={() => videoInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[176px] touch-manipulation select-none active:scale-[0.99] ${
                  isDraggingVideo
                    ? "border-violet-400 bg-violet-950/20"
                    : "border-[#1E202E] hover:border-violet-500/70 bg-[#070709] hover:bg-[#0D0E12]"
                }`}
              >
                {isUploadingVideo ? (
                  <RefreshCw className="w-6 h-6 text-violet-400 animate-spin mb-2" />
                ) : (
                  <Film className="w-6 h-6 text-cyan-400 mb-2" />
                )}
                <span className="text-xs font-bold text-slate-200">Vídeo de Referência</span>
                <span className="text-[10px] text-slate-500 mt-1 mb-2">Arraste ou escolha um vídeo (MP4/MOV)</span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    videoInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#13141B] hover:bg-violet-600/30 border border-[#1E202E] hover:border-violet-500/50 text-slate-200 text-xs font-semibold min-h-[44px] flex items-center justify-center transition-all touch-manipulation"
                >
                  Escolher Vídeo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Seletor de Orientação ('Vídeo' / 'Imagem') em Botões Segmentados com Touch Targets Generosos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#070709] border border-[#1E202E]">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Orientação do Personagem
          </label>
          <div className="grid grid-cols-2 gap-2 bg-[#0D0E12] p-1 rounded-xl border border-[#1E202E]">
            <button
              type="button"
              onClick={() => setInputVal("character_orientation", "video")}
              className={`py-3 px-3 rounded-lg text-xs font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer min-h-[52px] touch-manipulation select-none active:scale-[0.98] ${
                (inputs.character_orientation || "video") === "video"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                <span>Seguir Vídeo</span>
              </div>
              <span className="text-[9px] font-normal opacity-85">Ângulo e corte dinâmico</span>
            </button>

            <button
              type="button"
              onClick={() => setInputVal("character_orientation", "image")}
              className={`py-3 px-3 rounded-lg text-xs font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer min-h-[52px] touch-manipulation select-none active:scale-[0.98] ${
                inputs.character_orientation === "image"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                <span>Seguir Imagem</span>
              </div>
              <span className="text-[9px] font-normal opacity-85">Enquadramento fixo da foto</span>
            </button>
          </div>
        </div>

        <div className="space-y-2 flex flex-col justify-center">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Tratamento de Áudio
          </label>
          <button
            type="button"
            onClick={() => setInputVal("keep_original_sound", inputs.keep_original_sound === false)}
            className={`w-full min-h-[52px] p-3 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer select-none active:scale-[0.99] touch-manipulation ${
              inputs.keep_original_sound !== false
                ? "bg-violet-950/20 border-violet-500/50 text-white"
                : "bg-[#0D0E12] border-[#1E202E] text-slate-400"
            }`}
          >
            <div className="flex items-center gap-2.5 text-left">
              {inputs.keep_original_sound !== false ? (
                <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <div>
                <span className="text-xs font-bold block">Preservar Áudio Original</span>
                <span className="text-[10px] text-slate-400 block">Mantém trilha e sincronia do vídeo guia</span>
              </div>
            </div>
            <div
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                inputs.keep_original_sound !== false ? "bg-violet-600 justify-end" : "bg-slate-800 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </div>
          </button>
        </div>
      </div>

      {/* 4. Prompt de Apoio Opcional com Auto-Otimização */}
      <PromptInput
        value={inputs.prompt || ""}
        onChange={(val) => setInputVal("prompt", val)}
        placeholder="Opcional: Detalhes específicos de iluminação, ambiente ou texturas desejadas..."
        label="Prompt de Apoio Cinematográfico (Opcional)"
        toolType="motion"
      />
    </div>
  );
}
