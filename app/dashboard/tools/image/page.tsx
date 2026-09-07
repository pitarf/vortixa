"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coins, RefreshCw, Wand2 } from "lucide-react";
import { toast } from "sonner";

import {
  CreationMode,
  QualityMode,
  AIModelDef,
  InspirationItem,
  RecentCreation,
  STYLE_PRESETS,
  RESOLUTION_OPTIONS,
  AI_MODELS,
  PROMPT_SUGGESTIONS,
  ImageHeader,
  ImageWorkflowTabs,
  ImageReferenceUploader,
  ImagePromptSection,
  ImageStyleGrid,
  ImageRatioSelector,
  ImageModelPicker,
  ImagePreviewArea,
  ImageHistorySidebar,
  ImageInspirationGallery,
} from "@/components/tools/image";

export default function ImageGenerationPage() {
  const router = useRouter();

  // Estados Globais de Créditos
  const [balance, setBalance] = useState<number>(2480);
  const [creditMode, setCreditMode] = useState<string>("LIMITED");

  // Workflow Tabs
  const [creationMode, setCreationMode] = useState<CreationMode>("text-to-image");

  // Controles de Criação
  const [prompt, setPrompt] = useState<string>(
    "Uma mulher futurista em uma cidade cyberpunk, chuva neon, iluminação cinematográfica, ultra realista, 8k, destaque no rosto, atmosfera de filme, profundidade de campo."
  );
  const [selectedStyle, setSelectedStyle] = useState<string>("cinematic");
  const [aspectRatio, setAspectRatio] = useState<string>("landscape_16_9");
  const [resolution, setResolution] = useState<string>("1792 x 1024");
  const [qualityMode, setQualityMode] = useState<QualityMode>("fast");
  const [selectedModelId, setSelectedModelId] = useState<string>("fal-ai/flux/schnell");

  // Imagem Base para Img2Img ou Estilo
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>("");
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isUploadingRef, setIsUploadingRef] = useState<boolean>(false);
  const [denoiseStrength, setDenoiseStrength] = useState<number>(0.40);

  // Configurações Avançadas e Inferência
  const [inferenceSteps, setInferenceSteps] = useState<number>(24);
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [seed, setSeed] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>(
    "blurry, low quality, deformed anatomy, bad hands, extra limbs, watermark, artifacts, signature"
  );

  // Estados de Geração e Preview
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStepText, setActiveStepText] = useState<string>("");
  const [activeResultUrl, setActiveResultUrl] = useState<string>("/media/landing/gallery/street_dancer.jpg");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Carrossel de Variações do Preview
  const [variations, setVariations] = useState<string[]>([
    "/media/landing/gallery/street_dancer.jpg",
    "/media/landing/gallery/editorial_fashion.jpg",
    "/media/landing/gallery/hypercar_cyberpunk.jpg",
    "/media/landing/hero/hero_main.jpg",
    "/media/landing/gallery/perfume_commercial.jpg",
  ]);
  const [activeVariationIndex, setActiveVariationIndex] = useState<number>(0);

  // Histórico Lateral
  const [historyItems, setHistoryItems] = useState<RecentCreation[]>([
    {
      id: "hist-1",
      url: "/media/landing/gallery/street_dancer.jpg",
      title: "Mulher Cyberpunk",
      resolution: "1024x1024",
      timeAgo: "há 2 min",
      prompt: "Uma mulher futurista em uma cidade cyberpunk, chuva neon...",
      style: "cinematic",
      ratio: "1:1",
    },
    {
      id: "hist-2",
      url: "/media/landing/hero/hero_main.jpg",
      title: "Cidade Flutuante",
      resolution: "1792x1024",
      timeAgo: "há 15 min",
      prompt: "Cidade futurista flutuante acima das nuvens...",
      style: "digital-art",
      ratio: "16:9",
    },
    {
      id: "hist-3",
      url: "/media/landing/gallery/perfume_commercial.jpg",
      title: "Perfume Luxo",
      resolution: "1024x1024",
      timeAgo: "há 1 hora",
      prompt: "Frasco de perfume de luxo em vidro lapidado...",
      style: "octane3d",
      ratio: "1:1",
    },
    {
      id: "hist-4",
      url: "/media/landing/gallery/editorial_fashion.jpg",
      title: "Astronauta",
      resolution: "1024x1536",
      timeAgo: "há 2 horas",
      prompt: "Astronauta em traje futurista detalhado...",
      style: "realist",
      ratio: "9:16",
    },
    {
      id: "hist-5",
      url: "/media/landing/gallery/hypercar_cyberpunk.jpg",
      title: "Dragão Épico",
      resolution: "1792x1024",
      timeAgo: "há 3 horas",
      prompt: "Dragão ancestral de escamas de obsidiana...",
      style: "cinematic",
      ratio: "16:9",
    },
  ]);

  // Busca configurações reais de saldo
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
        console.warn("Erro ao carregar configurações de ferramentas:", err);
      }
    }
    loadConfig();
  }, []);

  // Sincroniza resolução ao alterar aspect ratio
  const handleSelectRatio = (ratioId: string) => {
    setAspectRatio(ratioId);
    if (ratioId === "original" && originalDimensions) {
      setResolution(`${originalDimensions.width} x ${originalDimensions.height}`);
      return;
    }
    const options = RESOLUTION_OPTIONS[ratioId];
    if (options && options.length > 0) {
      setResolution(options[0]);
    }
  };

  // Aplica preset de estilo visual
  const handleSelectStyle = (styleId: string) => {
    if (selectedStyle === styleId) {
      setSelectedStyle("");
      toast.info("Estilo padrão restaurado.");
      return;
    }
    setSelectedStyle(styleId);
    const preset = STYLE_PRESETS.find((p) => p.id === styleId);
    if (preset) {
      setInferenceSteps(preset.recommendedSteps);
      setGuidanceScale(preset.recommendedCfg);
      toast.info(`Estilo "${preset.name}" ativado com parâmetros otimizados.`);
    }
  };

  // Inspiração e prompt aleatório
  const handleInspirationPrompt = () => {
    const random = PROMPT_SUGGESTIONS[Math.floor(Math.random() * PROMPT_SUGGESTIONS.length)];
    setPrompt(random);
    toast.info("Ideia criativa carregada no prompt!");
  };

  const handleClearPrompt = () => {
    setPrompt("");
    toast.info("Campo de prompt limpo.");
  };

  // Otimização com IA
  const handleOptimizePrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Digite uma ideia antes de otimizar.");
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
          toolType: "image",
          style: selectedStyle || undefined,
        }),
      });

      if (!res.ok) throw new Error("Não foi possível otimizar o prompt.");
      const data = await res.json();
      if (data.optimizedPrompt) {
        setPrompt(data.optimizedPrompt);
        toast.success("Prompt otimizado com enriquecimento cinematográfico!");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro na otimização.");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Upload de Imagem de Referência / Base
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    // Ler dimensões naturais da imagem no navegador
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const w = img.naturalWidth || 1024;
        const h = img.naturalHeight || 1024;
        setOriginalDimensions({ width: w, height: h });
        setAspectRatio("original");
        setResolution(`${w} x ${h}`);
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    } catch (e) {
      console.warn("Não foi possível pré-calcular dimensões da imagem:", e);
    }

    try {
      setIsUploadingRef(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/tools/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Falha ao fazer upload da imagem.");
      const data = await res.json();
      setReferenceImageUrl(data.url);
      toast.success("Imagem anexada! Opção de Tamanho Original ativada.");
    } catch (err: any) {
      toast.error(err.message || "Erro no upload.");
    } finally {
      setIsUploadingRef(false);
    }
  };

  const handleSelectModel = (model: AIModelDef) => {
    setSelectedModelId(model.id);
    if (model.id === "fal-ai/flux/schnell") {
      setQualityMode("fast");
      setInferenceSteps(4);
    } else if (model.id === "fal-ai/recraft-v3") {
      setQualityMode("standard");
      setInferenceSteps(20);
    } else if (model.id === "fal-ai/nano-banana-pro") {
      setQualityMode("standard");
      setInferenceSteps(24);
    } else if (model.id === "fal-ai/flux-pro/v1.1-ultra") {
      setQualityMode("hd");
      setInferenceSteps(28);
    }
  };

  // Disparo de Geração
  const handleGenerateImage = async () => {
    if (isGenerating) return;
    if (!prompt.trim()) {
      toast.error("Por favor, descreva a imagem que deseja criar.");
      return;
    }

    const currentModel = AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0];
    const cost = currentModel.cost;

    if (creditMode !== "UNLIMITED" && balance < cost) {
      toast.error(`Saldo insuficiente (${balance} créditos disponíveis. Custo: ${cost}).`);
      return;
    }

    try {
      setIsGenerating(true);
      setActiveStepText("Conectando ao cluster de GPUs");

      const inputs: Record<string, any> = {
        prompt,
        image_size: aspectRatio,
        resolution,
        num_inference_steps: currentModel.recommendedSteps || inferenceSteps,
        guidance_scale: guidanceScale,
        negative_prompt: negativePrompt || undefined,
        seed: seed ? parseInt(seed, 10) : undefined,
        style: selectedStyle || undefined,
        mode: creationMode,
      };

      if (referenceImageUrl) {
        inputs.image_url = referenceImageUrl;
        inputs.strength = denoiseStrength;
      }

      const idempotencyKey = `image-tool-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: "gerador-imagem",
          modelId: currentModel.id,
          inputs,
          idempotencyKey,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao disparar inferência.");
      }

      const job = await res.json();
      setActiveStepText("Renderizando pixels em alta fidelidade");

      // Polling do Job
      pollJobStatus(job.id);
    } catch (err: any) {
      setIsGenerating(false);
      setActiveStepText("");
      toast.error(err.message || "Falha na geração.");
    }
  };

  const pollJobStatus = (jobId: string) => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/tools/job/${jobId}`);
        if (!res.ok) return;

        const currentJob = await res.json();

        if (currentJob.status === "PROCESSING") {
          setActiveStepText("Refinando iluminação e microtexturas");
        } else if (currentJob.status === "COMPLETED") {
          clearInterval(timer);
          setIsGenerating(false);
          setActiveStepText("");

          if (currentJob.outputs && currentJob.outputs.length > 0) {
            const finalUrl = currentJob.outputs[0].fileUrl;
            setActiveResultUrl(finalUrl);

            setVariations((prev) => [finalUrl, ...prev.slice(0, 4)]);
            setActiveVariationIndex(0);

            const newHistItem: RecentCreation = {
              id: currentJob.id,
              url: finalUrl,
              title: prompt.slice(0, 24) || "Nova Criação",
              resolution: resolution,
              timeAgo: "agora mesmo",
              prompt,
              style: selectedStyle,
              ratio: aspectRatio,
            };
            setHistoryItems((prev) => [newHistItem, ...prev.slice(0, 7)]);
            toast.success("Imagem renderizada com sucesso!");
          }
        } else if (currentJob.status === "FAILED") {
          clearInterval(timer);
          setIsGenerating(false);
          setActiveStepText("");
          toast.error(currentJob.error || "A geração falhou. Seus créditos foram preservados.");
        }
      } catch (err) {
        clearInterval(timer);
        setIsGenerating(false);
        setActiveStepText("");
      }
    }, 2000);
  };

  // Ações da Imagem Ativa
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = activeResultUrl;
    link.download = `vorixa-image-${Date.now()}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download iniciado!");
  };

  const handleVary = () => {
    toast.info("Variação iniciada. Re-renderizando com micro-ajustes...");
    handleGenerateImage();
  };

  const handleUpscale = () => {
    router.push(`/dashboard/tools/upscale?sourceUrl=${encodeURIComponent(activeResultUrl)}`);
  };

  const handleSendToFlow = () => {
    toast.success("Imagem enviada como nó de entrada para o VORIXA FLOW!");
    router.push("/dashboard/flow");
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copiado para a área de transferência!");
  };

  const handleApplyInspiration = (item: InspirationItem) => {
    setPrompt(item.prompt);
    if (item.style) handleSelectStyle(item.style);
    if (item.ratio) handleSelectRatio(item.ratio);
    toast.success(`Inspiração "${item.title}" aplicada!`);
  };

  const currentModelDef = AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0];

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 p-3 sm:p-5 lg:p-6 space-y-6 max-w-[1700px] mx-auto font-sans">
      {/* 1. Header & Top Banner */}
      <ImageHeader currentModelDef={currentModelDef} />

      {/* 2. Abas de Modo de Criação (Workflow Tabs) */}
      <ImageWorkflowTabs
        creationMode={creationMode}
        onSelectMode={(mode) => setCreationMode(mode)}
      />

      {/* 3. Corpo Principal: 3 Colunas (Controles / Preview / Histórico) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Coluna da Esquerda: Controles */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4 bg-[#0D0E12] border border-[#1E202E] p-4 sm:p-5 rounded-2xl shadow-xl">
          {/* Uploader para Referência / Img2Img */}
          <ImageReferenceUploader
            creationMode={creationMode}
            referenceImageUrl={referenceImageUrl}
            isUploadingRef={isUploadingRef}
            denoiseStrength={denoiseStrength}
            onFileUpload={handleFileUpload}
            onRemoveImage={() => setReferenceImageUrl("")}
            onChangeDenoiseStrength={setDenoiseStrength}
          />

          {/* Prompt de Criação */}
          <ImagePromptSection
            prompt={prompt}
            isOptimizing={isOptimizing}
            onChangePrompt={setPrompt}
            onOptimizePrompt={handleOptimizePrompt}
            onInspirationPrompt={handleInspirationPrompt}
            onClearPrompt={handleClearPrompt}
          />

          {/* Grid de Estilos */}
          <ImageStyleGrid
            selectedStyle={selectedStyle}
            onSelectStyle={handleSelectStyle}
          />

          {/* Proporção e Tamanho */}
          <ImageRatioSelector
            aspectRatio={aspectRatio}
            resolution={resolution}
            originalDimensions={originalDimensions}
            hasReferenceImage={!!referenceImageUrl}
            onSelectRatio={handleSelectRatio}
            onChangeResolution={setResolution}
          />

          {/* Seleção do Modelo IA */}
          <ImageModelPicker
            selectedModelId={selectedModelId}
            onSelectModel={handleSelectModel}
          />

          {/* Barra de Ação Principal (Custo & Botão Gerar) */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="text-slate-400">Custo da geração:</span>
              <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                <span>
                  {currentModelDef.cost} crédito{currentModelDef.cost > 1 ? "s" : ""}
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 text-white shadow-xl shadow-cyan-500/20 transition-all cursor-pointer"
              style={{ minHeight: "48px" }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{activeStepText || "Gerando Imagem..."}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-cyan-200" />
                  <span>Gerar Imagem</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Coluna Central: Preview e Variações */}
        <div className="lg:col-span-5 xl:col-span-5">
          <ImagePreviewArea
            isGenerating={isGenerating}
            activeStepText={activeStepText}
            activeResultUrl={activeResultUrl}
            inferenceSteps={inferenceSteps}
            variations={variations}
            activeVariationIndex={activeVariationIndex}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            onCopyPrompt={handleCopyPrompt}
            onSelectVariation={(url, idx) => {
              setActiveResultUrl(url);
              setActiveVariationIndex(idx);
            }}
            onPrevVariation={() => {
              const prevIdx = activeVariationIndex > 0 ? activeVariationIndex - 1 : variations.length - 1;
              setActiveVariationIndex(prevIdx);
              setActiveResultUrl(variations[prevIdx]);
            }}
            onNextVariation={() => {
              const nextIdx = activeVariationIndex < variations.length - 1 ? activeVariationIndex + 1 : 0;
              setActiveVariationIndex(nextIdx);
              setActiveResultUrl(variations[nextIdx]);
            }}
            onDownload={handleDownload}
            onVary={handleVary}
            onUpscale={handleUpscale}
            onSendToFlow={handleSendToFlow}
          />
        </div>

        {/* Coluna da Direita: Histórico & Dicas */}
        <div className="lg:col-span-3 xl:col-span-3">
          <ImageHistorySidebar
            historyItems={historyItems}
            onSelectHistoryItem={(item) => {
              setActiveResultUrl(item.url);
              setPrompt(item.prompt);
            }}
            onReusePrompt={(p) => {
              setPrompt(p);
              toast.info("Prompt recuperado do histórico!");
            }}
          />
        </div>
      </div>

      {/* 4. Seção Inferior: Inspirações e Exemplos */}
      <ImageInspirationGallery onApplyInspiration={handleApplyInspiration} />
    </div>
  );
}
