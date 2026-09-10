"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  CreationMode,
  QualityMode,
  AIModelDef,
  RecentCreation,
  AI_MODELS,
  PROMPT_SUGGESTIONS,
  ImageHeader,
  ImageInputSection,
  ImageSettingsSection,
  ImageActionBar,
  ImagePreviewArea,
} from "@/components/tools/image";
import { MarketplaceModelItem } from "@/components/models/types";
import { QuickModelPickerModal } from "@/components/models/QuickModelPickerModal";
import { FALLBACK_MARKETPLACE_MODELS } from "@/lib/marketplace-models";

export default function ImageGenerationPage() {
  // Saldo do usuário
  const [balance, setBalance] = useState<number>(2480);
  const [creditMode, setCreditMode] = useState<string>("LIMITED");

  // Workflow (Abas: Texto para Imagem | Imagem como Referência | Mesmo Personagem)
  const [creationMode, setCreationMode] = useState<CreationMode>("text-to-image");

  // Parâmetros de Entrada
  const [prompt, setPrompt] = useState<string>(
    "Uma mulher futurista em uma cidade cyberpunk, chuva neon, olhando para a câmera, ultra realista, cinematográfico, 8k"
  );
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>("");
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isUploadingRef, setIsUploadingRef] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Integração com Vitrine de Modelos
  const [activeShowcaseModel, setActiveShowcaseModel] = useState<MarketplaceModelItem | null>(null);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState<boolean>(false);

  // Ajustes de Proporção e Qualidade (sem seção de Estilo)
  const [aspectRatio, setAspectRatio] = useState<string>("landscape_16_9");
  const [qualityMode, setQualityMode] = useState<QualityMode>("standard");

  // Configurações Avançadas
  const [inferenceSteps, setInferenceSteps] = useState<number>(24);
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [seed, setSeed] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");

  // Estados de Geração e Preview
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStepText, setActiveStepText] = useState<string>("");
  const [activeResultUrl, setActiveResultUrl] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Histórico de Gerações Recentes do Usuário (100% Real, sem mocks)
  const [variations, setVariations] = useState<string[]>([]);
  const [activeVariationIndex, setActiveVariationIndex] = useState<number>(0);

  // Custo dinâmico baseado no modo de qualidade (Padrão: 1 cr | Alta: 2 cr | Ultra: 4 cr)
  const costMap: Record<QualityMode, number> = {
    fast: 1,
    standard: 2,
    hd: 3,
    ultra: 4,
  };
  const currentCost = costMap[qualityMode] || 2;

  // Busca configurações reais de saldo e histórico real
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

    async function loadRealHistory() {
      try {
        const res = await fetch("/api/library?type=image");
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            const urls = data.items.map((it: any) => it.url).filter(Boolean);
            setVariations(urls);
            if (urls[0]) {
              setActiveResultUrl(urls[0]);
            }
          }
        }
      } catch (err) {
        console.warn("Nenhum histórico real ainda para carregar:", err);
      }
    }

    loadConfig();
    loadRealHistory();

    // Suporte a query params vindos da Vitrine de Modelos (?modelRef=...)
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const modelRef = sp.get("modelRef");
      const refImg = sp.get("refImg");
      const promptParam = sp.get("prompt");
      const modelName = sp.get("modelName");

      if (modelRef) {
        const found = FALLBACK_MARKETPLACE_MODELS.find(
          (m) => m.id === modelRef || m.slug === modelRef
        );
        if (found) {
          handleSelectShowcaseModel(found);
        } else {
          handleSelectShowcaseModel({
            id: modelRef,
            name: modelName || "Modelo da Vitrine",
            slug: modelRef,
            type: "AI",
            category: "FASHION",
            avatarUrl: refImg || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
            gallery: [],
            tags: ["Casting", "Vitrine"],
            promptTrigger: promptParam || null,
            referenceFaceUrl: refImg || null,
            creditsPricePerGen: 5,
            status: true,
            isFeatured: true,
            isHot18: false,
          });
        }
      } else {
        if (promptParam) setPrompt(promptParam);
        if (refImg) {
          setReferenceImageUrl(refImg);
          setCreationMode("character");
        }
      }
    }
  }, []);

  // Seleção de Modelo da Vitrine
  const handleSelectShowcaseModel = (model: MarketplaceModelItem) => {
    setActiveShowcaseModel(model);
    const faceImg = model.referenceFaceUrl || model.avatarUrl;
    if (faceImg) {
      setReferenceImageUrl(faceImg);
    }
    setCreationMode("character"); // Ativa modo de preservação facial FLUX PuLID

    if (model.promptTrigger) {
      setPrompt((prevPrompt) => {
        if (!prevPrompt.trim()) return model.promptTrigger || "";
        if (model.promptTrigger && !prevPrompt.includes(model.promptTrigger)) {
          return `${model.promptTrigger}, ${prevPrompt.trim()}`;
        }
        return prevPrompt;
      });
    }

    toast.success(`Modelo "${model.name}" ativado com Preservação Facial (FLUX PuLID)!`);
  };

  const handleRemoveShowcaseModel = () => {
    setActiveShowcaseModel(null);
    setReferenceImageUrl("");
    toast.info("Modelo da vitrine desvinculado.");
  };

  // Upload de Imagem de Referência
  const handleUploadImage = async (file: File) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const w = img.naturalWidth || 1024;
        const h = img.naturalHeight || 1024;
        setOriginalDimensions({ width: w, height: h });
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    } catch (e) {
      console.warn("Não foi possível pré-calcular dimensões:", e);
    }

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
      setCreationMode("image-to-image");
      toast.success("Imagem anexada com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro no upload.");
    } finally {
      setIsUploadingRef(false);
    }
  };

  // Inspiração e Prompt Aleatório
  const handleInspirationPrompt = () => {
    const random = PROMPT_SUGGESTIONS[Math.floor(Math.random() * PROMPT_SUGGESTIONS.length)];
    setPrompt(random);
    toast.info("Prompt criativo sugerido!");
  };

  const handleClearPrompt = () => {
    setPrompt("");
    toast.info("Campo de texto limpo.");
  };

  // Otimização com IA
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
          toolType: "image",
        }),
      });

      if (!res.ok) throw new Error("Não foi possível otimizar o prompt.");
      const data = await res.json();
      if (data.optimizedPrompt) {
        setPrompt(data.optimizedPrompt);
        toast.success("Prompt enriquecido com iluminação e textura cinematográfica!");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro na otimização.");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Polling de Inferência
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

          const outputUrl = data.outputs?.[0]?.fileUrl || "";
          if (outputUrl) {
            setActiveResultUrl(outputUrl);
            setVariations((prev) => [outputUrl, ...prev]);
          }
          toast.success("Imagem renderizada com sucesso!");
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          setIsGenerating(false);
          setActiveStepText("");
          toast.error(data.error || "A renderização falhou na GPU.");
        } else {
          setActiveStepText(
            attempts < 3
              ? "Inicializando cluster neural"
              : attempts < 6
              ? "Renderizando microporos e iluminação volumétrica"
              : "Aplicando color grading e super-resolução"
          );
        }
      } catch (err) {
        console.error("Erro no polling:", err);
      }

      if (attempts > 90) {
        clearInterval(interval);
        setIsGenerating(false);
        setActiveStepText("");
        toast.error("Tempo limite excedido na renderização da imagem.");
      }
    }, 2000);
  };

  // Disparo de Geração
  const handleGenerateImage = async () => {
    if (isGenerating) return;
    if (!prompt.trim() && !referenceImageUrl) {
      toast.error("Por favor, forneça uma descrição da imagem.");
      return;
    }

    if (creditMode !== "UNLIMITED" && balance < currentCost) {
      toast.error(`Saldo insuficiente (${balance} créditos disponíveis. Custo: ${currentCost}).`);
      return;
    }

    // Mapeamento automático do melhor motor com base no modo
    let targetModelId = "fal-ai/flux/schnell";
    if (creationMode === "character") {
      targetModelId = "fal-ai/flux-pulid";
    } else if (qualityMode === "ultra") {
      targetModelId = "fal-ai/flux-pro/v1.1-ultra";
    } else if (qualityMode === "standard") {
      targetModelId = "fal-ai/nano-banana-pro";
    }

    try {
      setIsGenerating(true);
      setActiveStepText("Otimizando prompt com Inteligência Artificial...");

      // Auto-otimização inteligente de prompt antes de disparar para as GPUs (com timeout resiliente de 3.5s)
      let finalPrompt = prompt.trim();
      if (finalPrompt) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const optRes = await fetch("/api/tools/optimize-prompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              prompt: finalPrompt,
              enhanceQuality: true,
              toolType: "image",
              hasReferenceImage: Boolean(referenceImageUrl),
              image_url: referenceImageUrl || undefined,
            }),
          });
          clearTimeout(timeoutId);

          if (optRes.ok) {
            const optData = await optRes.json();
            if (optData.optimizedPrompt) {
              finalPrompt = optData.optimizedPrompt;
              setPrompt(finalPrompt); // Atualiza o textarea em tempo real para o usuário ver
            }
          }
        } catch {
          // Fallback resiliente mantém prompt original sem travar a geração
        }
      } else if (referenceImageUrl) {
        // Fallback para quando o usuário envia foto de referência sem texto
        finalPrompt = "A high quality detailed photograph faithfully preserving the subject in the reference image, natural lighting";
      }

      setActiveStepText("Conectando ao cluster de GPUs");

      const inputs: Record<string, any> = {
        prompt: finalPrompt,
        image_size: aspectRatio,
        aspect_ratio: aspectRatio,
        num_inference_steps: inferenceSteps,
        guidance_scale: guidanceScale,
        negative_prompt: negativePrompt || undefined,
        seed: seed ? parseInt(seed, 10) : undefined,
        mode: creationMode,
      };

      if (referenceImageUrl) {
        inputs.image_url = referenceImageUrl;
        inputs.prompt_image_url = referenceImageUrl;
      }

      const idempotencyKey = `image-tool-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: "gerador-imagem",
          modelId: targetModelId,
          inputs,
          idempotencyKey,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao iniciar inferência.");
      }

      const job = await res.json();
      setActiveStepText("Renderizando pixels em alta definição...");
      pollJobStatus(job.id);
    } catch (err: any) {
      setIsGenerating(false);
      setActiveStepText("");
      toast.error(err.message || "Erro ao iniciar renderização.");
    }
  };

  // Ações de Preview
  const handleCopyPrompt = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copiado para a área de transferência!");
  };

  const handleDownload = () => {
    if (!activeResultUrl) return;
    window.open(activeResultUrl, "_blank");
  };

  const handleVary = () => {
    setSeed(String(Math.floor(Math.random() * 999999)));
    handleGenerateImage();
  };

  const handleUpscale = () => {
    window.location.href = `/dashboard/tools/upscale?image=${encodeURIComponent(activeResultUrl)}`;
  };

  const handleSendToFlow = () => {
    window.location.href = `/dashboard/flow?image=${encodeURIComponent(activeResultUrl)}`;
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 p-3 sm:p-5 lg:p-6 space-y-6 max-w-[1700px] mx-auto font-sans">
      {/* 1. Header Oficial: "Crie imagens incríveis com IA" + Citação artística */}
      <ImageHeader />

      {/* 2. Grid Principal em 2 Colunas: Controles à Esquerda e Preview à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna da Esquerda: Entrada, Proporção & Qualidade (SEM Estilo), Barra de Ação */}
        <div className="lg:col-span-6 space-y-4">
          {/* Card 1: Entrada (Abas de Fluxo, Prompt, Inspirar/Aleatório/Limpar, Upload) */}
          <ImageInputSection
            creationMode={creationMode}
            onSelectMode={(mode) => setCreationMode(mode)}
            prompt={prompt}
            onChangePrompt={setPrompt}
            referenceImageUrl={referenceImageUrl}
            onRemoveReferenceImage={() => {
              setReferenceImageUrl("");
              setActiveShowcaseModel(null);
            }}
            onUploadImage={handleUploadImage}
            isUploadingRef={isUploadingRef}
            onInspirationPrompt={handleInspirationPrompt}
            onClearPrompt={handleClearPrompt}
            onOptimizePrompt={handleOptimizePrompt}
            isOptimizing={isOptimizing}
            onOpenModelPicker={() => setIsModelPickerOpen(true)}
            activeModelName={activeShowcaseModel?.name || null}
          />

          {/* Card 2: Proporção da Imagem e Qualidade (SEM Estilo) + Avançado */}
          <ImageSettingsSection
            aspectRatio={aspectRatio}
            onChangeAspectRatio={setAspectRatio}
            qualityMode={qualityMode}
            onChangeQualityMode={setQualityMode}
            originalDimensions={originalDimensions}
            hasReferenceImage={!!referenceImageUrl}
            seed={seed}
            onChangeSeed={setSeed}
            negativePrompt={negativePrompt}
            onChangeNegativePrompt={setNegativePrompt}
            inferenceSteps={inferenceSteps}
            onChangeInferenceSteps={setInferenceSteps}
            guidanceScale={guidanceScale}
            onChangeGuidanceScale={setGuidanceScale}
          />

          {/* Card 3: Barra de Ação (Custo estimado dinâmico e Botão Gerar Imagem) */}
          <ImageActionBar
            cost={currentCost}
            isGenerating={isGenerating}
            activeStepText={activeStepText}
            onGenerate={handleGenerateImage}
          />
        </div>

        {/* Coluna da Direita: Preview Player com Gerações Recentes do Usuário */}
        <div className="lg:col-span-6 sticky top-6">
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
      </div>

      {/* Modal Rápido de Seleção de Modelo da Vitrine */}
      <QuickModelPickerModal
        isOpen={isModelPickerOpen}
        onClose={() => setIsModelPickerOpen(false)}
        onSelectModel={handleSelectShowcaseModel}
        activeModelId={activeShowcaseModel?.id || null}
      />
    </div>
  );
}
