"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Wand2,
  Sparkles,
  Image as ImageIcon,
  Video,
  Navigation,
  Activity,
  Maximize2,
  Coins,
  Play,
  Download,
  Boxes,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { PromptInput } from "@/components/ai/prompt-input";
import { FileUploader } from "@/components/ai/file-uploader";

type StudioTool = "image" | "video" | "lipsync" | "motion" | "upscale";

interface ToolDefinition {
  id: StudioTool;
  slug: string;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  cost: number;
  description: string;
  color: string;
}

const TOOLS: Record<StudioTool, ToolDefinition> = {
  image: {
    id: "image",
    slug: "gerador-imagem",
    name: "FLUX Imagem",
    badge: "FLUX.1 Schnell",
    icon: ImageIcon,
    cost: 1,
    description: "Crie ilustrações e fotos ultra-realistas com prompts textuais em segundos.",
    color: "from-violet-500 to-indigo-600",
  },
  video: {
    id: "video",
    slug: "imagem-video",
    name: "Kling Vídeo",
    badge: "Kling AI 1.5",
    icon: Video,
    cost: 10,
    description: "Anime imagens estáticas ou gere sequências cinematográficas em 5s ou 10s.",
    color: "from-cyan-500 to-blue-600",
  },
  lipsync: {
    id: "lipsync",
    slug: "lip-sync",
    name: "LipSync Studio",
    badge: "LivePortrait",
    icon: Navigation,
    cost: 8,
    description: "Sincronize perfeitamente lábios e expressões faciais com faixas de áudio.",
    color: "from-pink-500 to-rose-600",
  },
  motion: {
    id: "motion",
    slug: "motion-control",
    name: "Motion Control",
    badge: "Pose Transfer",
    icon: Activity,
    cost: 15,
    description: "Transfira movimentação de um vídeo de referência para qualquer personagem.",
    color: "from-fuchsia-500 to-purple-600",
  },
  upscale: {
    id: "upscale",
    slug: "upscale",
    name: "Creative Upscale 4K",
    badge: "Ultra-Res",
    icon: Sparkles,
    cost: 5,
    description: "Melhore nitidez, remova ruído e eleve mídias até resolução 4K Ultra HD.",
    color: "from-amber-500 to-orange-600",
  },
};

const STYLE_PRESETS = [
  { name: "Cinematográfico 8K", suffix: ", cinematic lighting, 8k resolution, photorealistic, Unreal Engine 5 render, award winning cinematography" },
  { name: "Fotorrealista", suffix: ", highly detailed, 35mm lens, depth of field, studio lighting, natural skin textures" },
  { name: "Cyberpunk Néon", suffix: ", cyberpunk aesthetics, neon glow, reflective rainy streets, futuristic atmosphere, ray tracing" },
  { name: "Anime Ghibli", suffix: ", anime aesthetic, Studio Ghibli style, vibrant colors, lush scenic background, hand-drawn illustration" },
  { name: "3D Octane", suffix: ", 3d octane render, glossy textures, volumetric lighting, surreal concept art, C4D" },
];

export default function StudioCreatePage() {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<StudioTool>("image");
  const [balance, setBalance] = useState<number>(0);
  const [creditMode, setCreditMode] = useState<string>("LIMITED");

  // Inputs unificados
  const [prompt, setPrompt] = useState("");
  const [imageSize, setImageSize] = useState("square_hd");
  const [videoMode, setVideoMode] = useState<"text" | "image">("image");
  const [sourceImageUrl, setSourceImageUrl] = useState("");
  const [sourceVideoUrl, setSourceVideoUrl] = useState("");
  const [sourceAudioUrl, setSourceAudioUrl] = useState("");
  const [characterImageUrl, setCharacterImageUrl] = useState("");
  const [referenceVideoUrl, setReferenceVideoUrl] = useState("");
  const [duration, setDuration] = useState("5");
  const [scaleFactor, setScaleFactor] = useState("2");
  const [cameraMotion, setCameraMotion] = useState("static");

  // Estado de processamento
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<string>("");
  const [activeJob, setActiveJob] = useState<any>(null);
  const [resultMediaUrl, setResultMediaUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOpeningInFlow, setIsOpeningInFlow] = useState(false);

  // Carrega configurações e saldo
  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/tools/config");
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
        setCreditMode(data.creditMode);
      }
    } catch (e) {
      console.error("Erro ao carregar configurações do Studio:", e);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleApplyPreset = (presetSuffix: string) => {
    if (!prompt.includes(presetSuffix)) {
      setPrompt((prev) => (prev.trim() ? `${prev.trim()}${presetSuffix}` : presetSuffix.replace(/^, /, "")));
      toast.info("Preset de estilo aplicado ao prompt!");
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    setErrorMsg(null);

    const toolDef = TOOLS[activeTool];
    const cost = toolDef.cost;

    if (creditMode !== "UNLIMITED" && balance < cost) {
      toast.error(`Saldo insuficiente (${balance} créditos disponíveis. Custo: ${cost}).`);
      setErrorMsg("Você não possui saldo de créditos suficiente para esta geração.");
      return;
    }

    // Monta payload de acordo com a ferramenta
    const inputs: Record<string, any> = {};

    if (activeTool === "image") {
      if (!prompt.trim()) {
        toast.error("Por favor, informe o prompt para gerar a imagem.");
        return;
      }
      inputs.prompt = prompt;
      inputs.image_size = imageSize;
      inputs.num_inference_steps = 4; // FLUX.1 Schnell otimizado para 4 passos ultra rápidos (máx 12)
    } else if (activeTool === "video") {
      if (videoMode === "image" && !sourceImageUrl) {
        toast.error("Por favor, faça upload da imagem estática de origem.");
        return;
      }
      if (!prompt.trim() && videoMode === "text") {
        toast.error("Informe a descrição textual da cena do vídeo.");
        return;
      }
      inputs.prompt = prompt;
      inputs.image_url = videoMode === "image" ? sourceImageUrl : "";
      inputs.duration = duration;
      inputs.camera_motion = cameraMotion;
    } else if (activeTool === "lipsync") {
      if (!sourceVideoUrl || !sourceAudioUrl) {
        toast.error("Faça o upload do vídeo de base e do arquivo de áudio.");
        return;
      }
      inputs.video_url = sourceVideoUrl;
      inputs.audio_url = sourceAudioUrl;
    } else if (activeTool === "motion") {
      if (!characterImageUrl || !referenceVideoUrl) {
        toast.error("Faça o upload da imagem do personagem e do vídeo de movimento.");
        return;
      }
      inputs.character_image_url = characterImageUrl;
      inputs.reference_video_url = referenceVideoUrl;
      inputs.prompt = prompt;
    } else if (activeTool === "upscale") {
      if (!sourceVideoUrl) {
        toast.error("Faça o upload do vídeo que deseja realizar o upscale.");
        return;
      }
      inputs.video_url = sourceVideoUrl;
      inputs.scale_factor = scaleFactor;
    }

    try {
      setIsGenerating(true);
      setStep("Preparando");
      setResultMediaUrl(null);

      const idempotencyKey = `studio-${activeTool}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: toolDef.slug,
          inputs,
          idempotencyKey,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Falha ao iniciar geração no cluster.");
      }

      const job = await res.json();
      setActiveJob(job);
      setStep("Na fila");
      pollJob(job.id);
    } catch (err: any) {
      setIsGenerating(false);
      setErrorMsg(err.message || "Erro durante o disparo.");
      toast.error(err.message || "Erro na geração.");
    }
  };

  const pollJob = (jobId: string) => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/tools/job/${jobId}`);
        if (!res.ok) return;

        const currentJob = await res.json();
        console.log("📡 [POLLING RESPOSTA DA API /api/tools/job/id]:", currentJob);
        setActiveJob(currentJob);

        if (currentJob.status === "PROCESSING") {
          setStep("Processando no cluster de IA");
        } else if (currentJob.status === "COMPLETED") {
          clearInterval(timer);
          setStep("Concluído");
          setIsGenerating(false);
          if (currentJob.outputs?.[0]?.fileUrl) {
            setResultMediaUrl(currentJob.outputs[0].fileUrl);
          }
          fetchConfig();
          toast.success("✨ Mídia gerada com sucesso!");
        } else if (currentJob.status === "FAILED") {
          clearInterval(timer);
          setStep("Falhou");
          setIsGenerating(false);
          setErrorMsg(currentJob.error || "A geração falhou no motor de IA.");
          fetchConfig();
          toast.error("A geração falhou no provedor.");
        }
      } catch {
        // Polling retry
      }
    }, 2500);
  };

  const handleOpenInFlow = async () => {
    try {
      setIsOpeningInFlow(true);
      const toolDef = TOOLS[activeTool];

      // Cria um novo fluxo
      const res = await fetch("/api/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Pipeline - ${toolDef.name}`,
          description: `Fluxo criado a partir do Studio CREATE com ${toolDef.name}.`,
        }),
      });

      if (!res.ok) {
        throw new Error("Não foi possível inicializar a sessão do VORIXA FLOW.");
      }

      const newFlow = await res.json();

      // Adiciona o nó no fluxo criado
      const nodeType = activeTool === "image" ? "image" : activeTool === "video" ? "video" : activeTool === "lipsync" ? "lipsync" : activeTool === "upscale" ? "upscale" : "video";

      const nodeConfig: Record<string, any> = {
        prompt,
        image_size: imageSize,
        duration: parseInt(duration, 10) || 5,
        output_url: resultMediaUrl,
      };

      await fetch(`/api/flows/${newFlow.id}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeType,
          title: toolDef.name,
          positionX: 300,
          positionY: 200,
          toolSlug: toolDef.slug,
          config: nodeConfig,
        }),
      });

      toast.success("✦ Pipeline criado! Redirecionando para o VORIXA FLOW...");
      router.push(`/dashboard/flow/${newFlow.id}`);
    } catch (e: any) {
      toast.error(e.message || "Erro ao abrir no Flow.");
    } finally {
      setIsOpeningInFlow(false);
    }
  };

  const currentToolDef = TOOLS[activeTool];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header do Studio CREATE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E202E] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
              <Wand2 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-heading">
              Studio CREATE
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold uppercase">
              v2.0 Turbo
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Estúdio integrado de criação rápida. Escolha o motor de IA, ajuste os parâmetros e renderize em segundos.
          </p>
        </div>

        {/* Saldo e Ações Rápidas */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#0D0E12] border border-[#1E202E] flex items-center gap-3">
            <Coins className="h-4 w-4 text-amber-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block leading-none">Seu Saldo</span>
              <span className="text-xs font-bold text-slate-200">
                {creditMode === "UNLIMITED" ? "Ilimitado" : `${balance} créditos`}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard/flow")}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-cyan-400 transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <Boxes className="h-4 w-4" />
            <span className="hidden sm:inline">Ir para o Flow Canvas</span>
          </button>
        </div>
      </div>

      {/* Seletor de Ferramentas / Motores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {(Object.keys(TOOLS) as StudioTool[]).map((key) => {
          const t = TOOLS[key];
          const isSelected = activeTool === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveTool(key);
                setResultMediaUrl(null);
                setErrorMsg(null);
              }}
              className={`relative p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? "bg-[#13141B] border-violet-500/80 shadow-[0_0_25px_rgba(139,92,246,0.2)]"
                  : "bg-[#0D0E12] border-[#1E202E] hover:border-slate-700 opacity-80 hover:opacity-100"
              }`}
              style={{ minHeight: "80px" }}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`h-8 w-8 rounded-xl bg-gradient-to-tr ${t.color} flex items-center justify-center text-white shadow-md`}
                >
                  <t.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">{t.cost} cr</span>
              </div>
              <div className="mt-2">
                <div className="text-xs font-bold text-white">{t.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{t.badge}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Grid Central: Parâmetros (Esquerda) + Preview Cinematográfico (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel de Parâmetros da Ferramenta */}
        <div className="lg:col-span-7 space-y-6 bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-5 md:p-6">
          <div className="flex items-center justify-between border-b border-[#1E202E] pb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-violet-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                Parâmetros de {currentToolDef.name}
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Custo estimado: <strong className="text-violet-400">{currentToolDef.cost} créditos</strong>
            </span>
          </div>

          {/* Form específico por ferramenta */}
          {activeTool === "image" && (
            <div className="space-y-5">
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                label="Prompt de Criação da Imagem"
                placeholder="Ex: Close cinematográfico de um samurai futurista com armadura cibernética de titânio e luzes néon azuis sob chuva, iluminação volumétrica, fotorrealista..."
              />

              {/* Presets de Estilo */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Presets de Estilo Rápido
                </label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset.suffix)}
                      className="px-3 py-1.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] hover:border-violet-500/40 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                    >
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Proporção de Tela (Aspect Ratio)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "1:1 Quadrado", val: "square_hd" },
                    { label: "16:9 Cinema", val: "landscape_16_9" },
                    { label: "9:16 Stories/Reels", val: "portrait_16_9" },
                  ].map((ratio) => (
                    <button
                      key={ratio.val}
                      type="button"
                      onClick={() => setImageSize(ratio.val)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        imageSize === ratio.val
                          ? "bg-violet-600/10 border-violet-500 text-violet-300"
                          : "bg-[#13141B] border-[#1E202E] text-slate-400 hover:border-slate-700"
                      }`}
                      style={{ minHeight: "44px" }}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTool === "video" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Modo de Operação
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVideoMode("image")}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      videoMode === "image"
                        ? "bg-cyan-600/10 border-cyan-500 text-cyan-300"
                        : "bg-[#13141B] border-[#1E202E] text-slate-400"
                    }`}
                    style={{ minHeight: "44px" }}
                  >
                    Imagem para Vídeo (Recomendado)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoMode("text")}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      videoMode === "text"
                        ? "bg-cyan-600/10 border-cyan-500 text-cyan-300"
                        : "bg-[#13141B] border-[#1E202E] text-slate-400"
                    }`}
                    style={{ minHeight: "44px" }}
                  >
                    Texto para Vídeo
                  </button>
                </div>
              </div>

              {videoMode === "image" && (
                <FileUploader
                  accept="image/*"
                  label="Imagem de Entrada (Frame Inicial)"
                  onUploadSuccess={setSourceImageUrl}
                  onClear={() => setSourceImageUrl("")}
                />
              )}

              <PromptInput
                value={prompt}
                onChange={setPrompt}
                label="Prompt de Movimento / Cena"
                placeholder={
                  videoMode === "image"
                    ? "Descreva como a câmera se move e o que acontece na cena... Ex: Câmera faz zoom in dramático enquanto o vento sopra as roupas"
                    : "Descreva a cena de vídeo completa em detalhes..."
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Duração do Vídeo
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["5", "10"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          duration === d
                            ? "bg-cyan-600/10 border-cyan-500 text-cyan-300"
                            : "bg-[#13141B] border-[#1E202E] text-slate-400"
                        }`}
                        style={{ minHeight: "44px" }}
                      >
                        {d} Segundos
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Movimento de Câmera
                  </label>
                  <select
                    value={cameraMotion}
                    onChange={(e) => setCameraMotion(e.target.value)}
                    className="w-full rounded-xl bg-[#13141B] border border-[#1E202E] px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    style={{ minHeight: "44px" }}
                  >
                    <option value="static">Estático / Natural</option>
                    <option value="zoom_in">Zoom In Cinemático</option>
                    <option value="pan_left">Panorâmica Esquerda</option>
                    <option value="pan_right">Panorâmica Direita</option>
                    <option value="orbital">Movimento Orbital</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTool === "lipsync" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileUploader
                  accept="video/*"
                  label="1. Vídeo de Rosto / Personagem"
                  onUploadSuccess={setSourceVideoUrl}
                  onClear={() => setSourceVideoUrl("")}
                />
                <FileUploader
                  accept="audio/*"
                  label="2. Áudio de Fala (Voz)"
                  onUploadSuccess={setSourceAudioUrl}
                  onClear={() => setSourceAudioUrl("")}
                />
              </div>
              <p className="text-xs text-slate-400 bg-[#13141B] p-3.5 rounded-2xl border border-[#1E202E]">
                💡 <strong>Dica Pro:</strong> Para sincronizações perfeitas, certifique-se de que o rosto do personagem esteja iluminado e visível na maior parte dos quadros.
              </p>
            </div>
          )}

          {activeTool === "motion" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FileUploader
                  accept="image/*"
                  label="1. Imagem do Personagem Alvo"
                  onUploadSuccess={setCharacterImageUrl}
                  onClear={() => setCharacterImageUrl("")}
                />
                <FileUploader
                  accept="video/*"
                  label="2. Vídeo de Referência da Pose"
                  onUploadSuccess={setReferenceVideoUrl}
                  onClear={() => setReferenceVideoUrl("")}
                />
              </div>
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                label="Prompt de Estilização (Opcional)"
                placeholder="Detalhes adicionais sobre o ambiente e iluminação final..."
              />
            </div>
          )}

          {activeTool === "upscale" && (
            <div className="space-y-5">
              <FileUploader
                accept="video/*"
                label="Vídeo de Origem para Upscale"
                onUploadSuccess={setSourceVideoUrl}
                onClear={() => setSourceVideoUrl("")}
              />

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Fator de Resolução
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "2x Resolução (Full HD -> 2K)", val: "2" },
                    { label: "4x Resolução (Full HD -> 4K UHD)", val: "4" },
                  ].map((factor) => (
                    <button
                      key={factor.val}
                      type="button"
                      onClick={() => setScaleFactor(factor.val)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        scaleFactor === factor.val
                          ? "bg-amber-600/10 border-amber-500 text-amber-300"
                          : "bg-[#13141B] border-[#1E202E] text-slate-400"
                      }`}
                      style={{ minHeight: "44px" }}
                    >
                      {factor.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Botão de Disparo */}
          <div className="pt-4 border-t border-[#1E202E] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block leading-none">Custo Total</span>
                <span className="text-sm font-bold text-white">
                  {creditMode === "UNLIMITED" ? "Ilimitado" : `${currentToolDef.cost} créditos`}
                </span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-white text-sm font-bold shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ minHeight: "44px" }}
            >
              {isGenerating ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{step}...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Iniciar Geração no Studio</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Lado Direito: Preview & Player Integrado */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-5 md:p-6 flex flex-col min-h-[480px] justify-between">
            <div className="flex items-center justify-between border-b border-[#1E202E] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-heading">
                  Preview & Player
                </span>
              </div>
              {resultMediaUrl && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  Pronto para uso
                </span>
              )}
            </div>

            {/* Visualizador de Mídia */}
            <div className="flex-1 flex flex-col items-center justify-center text-center p-2 min-h-[300px]">
              {isGenerating ? (
                <div className="space-y-5">
                  <div className="relative h-20 w-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 animate-ping" />
                    <div className="h-20 w-20 rounded-full border-4 border-violet-600 border-t-cyan-400 animate-spin" />
                    <Sparkles className="h-7 w-7 text-violet-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white tracking-wide">{step}</div>
                    <div className="text-xs text-slate-500 font-mono">Executando inferência no motor {currentToolDef.badge}</div>
                  </div>
                </div>
              ) : resultMediaUrl ? (
                <div className="w-full space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border border-[#1E202E] bg-black group max-h-[360px] flex items-center justify-center">
                    {resultMediaUrl.endsWith(".mp4") || resultMediaUrl.endsWith(".webm") || activeTool !== "image" ? (
                      <video
                        src={resultMediaUrl}
                        controls
                        autoPlay
                        loop
                        className="w-full h-full max-h-[360px] object-contain rounded-2xl"
                      />
                    ) : (
                      <img
                        src={resultMediaUrl}
                        alt="Resultado da Geração"
                        className="w-full h-full max-h-[360px] object-contain rounded-2xl"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={resultMediaUrl}
                      download="vorixa-asset"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-slate-200 transition-all cursor-pointer"
                      style={{ minHeight: "44px" }}
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </a>

                    <button
                      onClick={handleOpenInFlow}
                      disabled={isOpeningInFlow}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-xs font-bold text-violet-300 transition-all cursor-pointer"
                      style={{ minHeight: "44px" }}
                    >
                      <Boxes className="h-4 w-4 text-violet-400" />
                      <span>{isOpeningInFlow ? "Abrindo..." : "Open in Flow ✦"}</span>
                    </button>
                  </div>
                </div>
              ) : errorMsg ? (
                <div className="space-y-3 max-w-sm">
                  <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-bold text-red-300">{errorMsg}</div>
                  <p className="text-xs text-slate-500">
                    Seus créditos foram mantidos ou estornados automaticamente no Ledger.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-w-xs text-slate-500">
                  <div className="h-14 w-14 rounded-3xl bg-[#13141B] border border-[#1E202E] flex items-center justify-center mx-auto text-slate-400">
                    <currentToolDef.icon className="h-7 w-7" />
                  </div>
                  <div className="text-xs font-medium text-slate-400">
                    Ajuste os parâmetros à esquerda e clique em <strong>Iniciar Geração</strong> para renderizar.
                  </div>
                </div>
              )}
            </div>

            {/* Dica de Integração com o Flow */}
            <div className="pt-4 border-t border-[#1E202E] mt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span>Encadeie múltiplos modelos no Canvas</span>
              <button
                onClick={() => router.push("/dashboard/flow")}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Abrir VORIXA FLOW</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
