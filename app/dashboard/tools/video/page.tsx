"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  VideoCreationMode,
  VideoDuration,
  VideoQuality,
  VideoModelDef,
  VideoRecentCreation,
  VIDEO_MODELS,
  VIDEO_PROMPT_SUGGESTIONS,
  VideoHeader,
  VideoInputSection,
  VideoModelSection,
  VideoSettingsSection,
  VideoPreviewPlayer,
  VideoActionBar,
} from "@/components/tools/video";

export default function VideoGenerationPage() {
  // Saldo e limites
  const [balance, setBalance] = useState<number>(2480);
  const [creditMode, setCreditMode] = useState<string>("LIMITED");

  // Estado dos Inputs (Passo 1: Entrada)
  const [creationMode, setCreationMode] = useState<VideoCreationMode>("text-to-video");
  const [prompt, setPrompt] = useState<string>(
    "Uma mulher futurista em uma cidade cyberpunk, chuva neon, olhando para a câmera, movimento de câmera suave, ambiente cinematográfico, ultra realista, 8k."
  );
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>("/media/landing/gallery/editorial_fashion.jpg");
  const [isUploadingRef, setIsUploadingRef] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Estado do Motor de IA (Passo 2)
  const [selectedModel, setSelectedModel] = useState<VideoModelDef>(VIDEO_MODELS[0]); // Kling 2.1 Pro

  // Estado dos Ajustes (Passo 3)
  const [duration, setDuration] = useState<VideoDuration>("5");
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [quality, setQuality] = useState<VideoQuality>("standard");
  const [cameraMovement, setCameraMovement] = useState<string>("none");
  const [seed, setSeed] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");

  // Estados de Geração e Preview
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStepText, setActiveStepText] = useState<string>("");
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>("");

  // Histórico de Vídeos Reais do Usuário (sem fakes)
  const [recentCreations, setRecentCreations] = useState<VideoRecentCreation[]>([]);

  // Carrega configuração de saldo e histórico real
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/tools/config");
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balance ?? 2480);
          setCreditMode(data.creditMode ?? "LIMITED");
        }
      } catch (err) {
        console.warn("Erro ao carregar saldo:", err);
      }
    }

    async function loadHistory() {
      try {
        const res = await fetch("/api/library?type=video");
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            const mapped: VideoRecentCreation[] = data.items.map((it: any) => ({
              id: it.id,
              url: it.url,
              thumbUrl: it.inputs?.image_url || it.thumbUrl || undefined,
              title: it.prompt ? it.prompt.slice(0, 24) : "Criação de Vídeo",
              duration: `${it.inputs?.duration || "5"}s`,
              timeAgo: new Date(it.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              prompt: it.prompt || "",
              ratio: it.inputs?.aspect_ratio || "16:9",
              quality: "Alta",
              modelName: it.modelName || "Kling 2.1 Pro",
            }));
            setRecentCreations(mapped);
            if (mapped[0]?.url) {
              setActiveVideoUrl(mapped[0].url);
            }
          }
        }
      } catch (err) {
        console.warn("Histórico real de vídeo vazio ou inicial:", err);
      }
    }

    loadConfig();
    loadHistory();
  }, []);

  // Upload de Imagem de Referência
  const handleUploadImage = async (file: File) => {
    try {
      setIsUploadingRef(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/tools/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Falha no upload da imagem de referência.");
      const data = await res.json();
      setReferenceImageUrl(data.url);
      setCreationMode("image-to-video");
      toast.success("Imagem de referência anexada com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro no upload.");
    } finally {
      setIsUploadingRef(false);
    }
  };

  // Inspiração e Otimização com IA
  const handleInspirationPrompt = () => {
    const random = VIDEO_PROMPT_SUGGESTIONS[Math.floor(Math.random() * VIDEO_PROMPT_SUGGESTIONS.length)];
    setPrompt(random);
    toast.info("Prompt criativo sugerido!");
  };

  const handleClearPrompt = () => {
    setPrompt("");
    toast.info("Campo de texto limpo.");
  };

  const handleOptimizePrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Digite uma ideia antes de inspirar.");
      return;
    }
    try {
      setIsOptimizing(true);
      const res = await fetch("/api/tools/optimize-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          enhanceQuality: true,
          toolType: "video",
        }),
      });

      if (!res.ok) throw new Error("Não foi possível otimizar o prompt.");
      const data = await res.json();
      if (data.optimizedPrompt) {
        setPrompt(data.optimizedPrompt);
        toast.success("Prompt enriquecido com iluminação e movimentos cinematográficos!");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro na otimização.");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Polling do Job de Geração
  const pollJobStatus = (jobId: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/tools/job/${jobId}`);
        if (!res.ok) throw new Error("Erro ao consultar status do job.");

        const data = await res.json();

        if (data.status === "COMPLETED") {
          clearInterval(interval);
          setIsGenerating(false);
          setActiveStepText("");

          const outputUrl = data.outputs?.[0]?.fileUrl || activeVideoUrl;
          setActiveVideoUrl(outputUrl);

          const newCreation: VideoRecentCreation = {
            id: data.id,
            url: outputUrl,
            thumbUrl: referenceImageUrl || undefined,
            title: prompt.slice(0, 24),
            duration: `${duration}s`,
            timeAgo: "Agora",
            prompt,
            ratio: aspectRatio,
            quality: quality === "high" ? "Alta" : "Padrão",
            modelName: selectedModel.name,
          };

          setRecentCreations((prev) => [newCreation, ...prev]);
          toast.success("Vídeo cinematográfico renderizado com sucesso!");
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          setIsGenerating(false);
          setActiveStepText("");
          toast.error(data.error || "A renderização do vídeo falhou na GPU.");
        } else {
          setActiveStepText(
            attempts < 4
              ? "Inicializando cluster neural"
              : attempts < 8
              ? "Calculando física e interpolação de movimento"
              : "Codificando vídeo em 4K e aplicando color grading"
          );
        }
      } catch (err) {
        console.error("Erro no polling:", err);
      }

      if (attempts > 120) {
        clearInterval(interval);
        setIsGenerating(false);
        setActiveStepText("");
        toast.error("Tempo limite excedido na renderização do vídeo.");
      }
    }, 2500);
  };

  // Disparo de Geração de Vídeo
  const handleGenerateVideo = async () => {
    if (isGenerating) return;
    if (!prompt.trim() && !referenceImageUrl) {
      toast.error("Por favor, forneça uma descrição ou envie uma imagem de referência.");
      return;
    }

    const cost = selectedModel.cost;

    if (creditMode !== "UNLIMITED" && balance < cost) {
      toast.error(`Saldo insuficiente (${balance} créditos disponíveis. Custo: ${cost}).`);
      return;
    }

    try {
      setIsGenerating(true);
      setActiveStepText("Conectando ao cluster de GPUs");

      const inputs: Record<string, any> = {
        prompt,
        duration,
        aspect_ratio: aspectRatio,
        quality,
        camera_movement: cameraMovement,
        seed: seed ? parseInt(seed, 10) : undefined,
        negative_prompt: negativePrompt || undefined,
      };

      if (creationMode === "image-to-video" && referenceImageUrl) {
        inputs.image_url = referenceImageUrl;
        inputs.prompt_image_url = referenceImageUrl;
      }

      const idempotencyKey = `video-tool-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: "imagem-video",
          modelId: selectedModel.id,
          inputs,
          idempotencyKey,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao iniciar renderização.");
      }

      const job = await res.json();
      setActiveStepText("Renderizando frames de vídeo...");
      pollJobStatus(job.id);
    } catch (err: any) {
      setIsGenerating(false);
      setActiveStepText("");
      toast.error(err.message || "Erro ao disparar inferência.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 p-3 sm:p-5 lg:p-6 space-y-6 max-w-[1700px] mx-auto font-sans">
      {/* 1. Header com Título, Subtítulo e Citação VORIXA */}
      <VideoHeader />

      {/* 2. Grid Principal em 2 Colunas: Controles à Esquerda e Preview/Player à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna da Esquerda: Blocos 1, 2, 3 e Barra de Ação */}
        <div className="lg:col-span-6 space-y-4">
          {/* Card 1: Entrada */}
          <VideoInputSection
            creationMode={creationMode}
            onSelectMode={(mode) => setCreationMode(mode)}
            prompt={prompt}
            onChangePrompt={setPrompt}
            referenceImageUrl={referenceImageUrl}
            onRemoveReferenceImage={() => setReferenceImageUrl("")}
            onUploadImage={handleUploadImage}
            isUploadingRef={isUploadingRef}
            onInspirationPrompt={handleInspirationPrompt}
            onClearPrompt={handleClearPrompt}
            onOptimizePrompt={handleOptimizePrompt}
            isOptimizing={isOptimizing}
          />

          {/* Card 2: Motor de IA */}
          <VideoModelSection
            selectedModel={selectedModel}
            onSelectModel={(model) => setSelectedModel(model)}
          />

          {/* Card 3: Ajustes (Duração, Proporção, Qualidade e Avançado) */}
          <VideoSettingsSection
            duration={duration}
            onChangeDuration={setDuration}
            aspectRatio={aspectRatio}
            onChangeAspectRatio={setAspectRatio}
            quality={quality}
            onChangeQuality={setQuality}
            cameraMovement={cameraMovement}
            onChangeCameraMovement={setCameraMovement}
            seed={seed}
            onChangeSeed={setSeed}
            negativePrompt={negativePrompt}
            onChangeNegativePrompt={setNegativePrompt}
          />

          {/* Card 4: Barra de Ação (Custo e Botão Gerar Vídeo) */}
          <VideoActionBar
            cost={selectedModel.cost}
            isGenerating={isGenerating}
            activeStepText={activeStepText}
            onGenerate={handleGenerateVideo}
          />
        </div>

        {/* Coluna da Direita: Preview Player com Variações Recentes */}
        <div className="lg:col-span-6 sticky top-6">
          <VideoPreviewPlayer
            isGenerating={isGenerating}
            activeStepText={activeStepText}
            activeVideoUrl={activeVideoUrl}
            recentCreations={recentCreations}
            onSelectCreation={(c) => {
              setActiveVideoUrl(c.url);
              setPrompt(c.prompt);
            }}
            aspectRatio={aspectRatio}
          />
        </div>
      </div>
    </div>
  );
}
