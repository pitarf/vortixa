"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Wand2,
  Play,
  RefreshCw,
  Upload,
  X,
  ArrowRight,
  Volume2,
  MessageSquareQuote,
} from "lucide-react";
import { AudioSourceSelector } from "@/components/ai/audio-source-selector";
import { FileUploader } from "@/components/ai/file-uploader";
import { toast } from "sonner";
import {
  StudioTool,
  TOOLS,
  STYLE_PRESETS,
  InspirationItem,
  StudioHistoryItem,
  StudioHeader,
  StudioToolSelector,
  StudioModelSelector,
  StudioStyleSelector,
  StudioAspectRatioSelector,
  StudioVideoControls,
  StudioAdvancedSettings,
  StudioPreviewPlayer,
  StudioHistorySidebar,
  ActiveShowcaseModelBanner,
} from "@/components/studio";
import { MarketplaceModelItem } from "@/components/models/types";
import { QuickModelPickerModal } from "@/components/models/QuickModelPickerModal";
import { FALLBACK_MARKETPLACE_MODELS } from "@/lib/marketplace-models";

export default function StudioCreatePage() {
  const router = useRouter();

  // Estado Geral de Ferramenta e Modelo
  const [activeTool, setActiveTool] = useState<StudioTool>("image");
  const [selectedModelId, setSelectedModelId] = useState<string>("fal-ai/flux/schnell");
  const [balance, setBalance] = useState<number>(2480);
  const [creditMode, setCreditMode] = useState<string>("LIMITED");

  // Projeto
  const [projectName, setProjectName] = useState("Projeto sem nome");
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempProjectName, setTempProjectName] = useState(projectName);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Workflow Stepper
  const [activeStep, setActiveStep] = useState<number>(1);

  // Inputs de Criação
  const [prompt, setPrompt] = useState("");
  const [imageSize, setImageSize] = useState<string>("landscape_16_9");
  const [resolution, setResolution] = useState<string>("1792 x 1024");
  const [qualityMode, setQualityMode] = useState<string>("fast");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>("");
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isUploadingRef, setIsUploadingRef] = useState(false);
  const refFileInputRef = useRef<HTMLInputElement>(null);

  // Integração com Vitrine de Modelos
  const [activeShowcaseModel, setActiveShowcaseModel] = useState<MarketplaceModelItem | null>(null);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);

  // Configurações Avançadas
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [inferenceSteps, setInferenceSteps] = useState(4);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState("blurry, low quality, deformed anatomy, bad hands, extra limbs, watermark, artifacts, signature");

  // Parâmetros de Vídeo / Avatar / Motion
  const [videoMode, setVideoMode] = useState<"text" | "image">("image");
  const [duration, setDuration] = useState("5");
  const [videoQuality, setVideoQuality] = useState<string>("standard");
  const [cameraMotion, setCameraMotion] = useState("static");
  const [enableTalkingVideo, setEnableTalkingVideo] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("Rachel");
  const [selectedGender, setSelectedGender] = useState<"all" | "female" | "male">("all");
  const [sourceVideoUrl, setSourceVideoUrl] = useState("");
  const [sourceAudioUrl, setSourceAudioUrl] = useState("");
  const [characterImageUrl, setCharacterImageUrl] = useState("");
  const [referenceVideoUrl, setReferenceVideoUrl] = useState("");

  // Estado de Processamento e Geração
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [stepText, setStepText] = useState("");
  const [activeJob, setActiveJob] = useState<any>(null);
  const [resultMediaUrl, setResultMediaUrl] = useState<string | null>(null);
  const [resultMediaType, setResultMediaType] = useState<"image" | "video">("image");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOpeningInFlow, setIsOpeningInFlow] = useState(false);

  // Tabs do Player
  const [previewTab, setPreviewTab] = useState<"result" | "compare">("result");

  // Histórico de Criações
  const [historyItems, setHistoryItems] = useState<StudioHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Carrega configurações de saldo e histórico
  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/tools/config");
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance ?? 2480);
        setCreditMode(data.creditMode ?? "LIMITED");
      }
    } catch (e) {
      console.warn("Usando saldo padrão em modo preview:", e);
    }
  };

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await fetch("/api/library");
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setHistoryItems(data.items);
          if (data.items[0]?.url) {
            setResultMediaUrl(data.items[0].url);
            setResultMediaType(data.items[0].mediaType || "image");
          }
          return;
        }
      }
      // Se não houver itens no banco do usuário, mantém lista limpa
      setHistoryItems([]);
    } catch (e) {
      console.warn("Erro ao buscar histórico:", e);
      setHistoryItems([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Aplica modelo selecionado da vitrine no Studio
  const handleApplyShowcaseModel = (model: MarketplaceModelItem) => {
    setActiveShowcaseModel(model);
    setProjectName(`Campanha - ${model.name}`);

    // Preenche foto de referência facial
    const faceImg = model.referenceFaceUrl || model.avatarUrl;
    if (faceImg) {
      setReferenceImageUrl(faceImg);
    }

    // Injeta promptTrigger se ainda não presente
    if (model.promptTrigger) {
      setPrompt((prevPrompt) => {
        if (!prevPrompt.trim()) {
          return model.promptTrigger || "";
        }
        if (model.promptTrigger && !prevPrompt.includes(model.promptTrigger)) {
          return `${model.promptTrigger}, ${prevPrompt.trim()}`;
        }
        return prevPrompt;
      });
    }

    // Se for ferramenta de imagem, seleciona o motor ideal com preservação facial
    if (activeTool === "image") {
      setSelectedModelId("fal-ai/flux-pulid");
      setQualityMode("standard");
      setInferenceSteps(20);
    }

    toast.success(`Modelo "${model.name}" ativado com consistência facial (FLUX PuLID)!`);
  };

  const handleRemoveShowcaseModel = () => {
    setActiveShowcaseModel(null);
    setReferenceImageUrl("");
    toast.info("Modelo da vitrine desvinculado.");
  };

  useEffect(() => {
    fetchConfig();
    fetchHistory();

    // Lê parâmetros da URL caso venha da Vitrine de Modelos
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const promptParam = sp.get("prompt");
      const refImgParam = sp.get("refImg");
      const modelRefParam = sp.get("modelRef");
      const modelNameParam = sp.get("modelName");

      if (modelRefParam) {
        // Busca se existe no catálogo fallback ou se há dados
        const found = FALLBACK_MARKETPLACE_MODELS.find(
          (m) => m.id === modelRefParam || m.slug === modelRefParam
        );

        if (found) {
          handleApplyShowcaseModel(found);
        } else {
          // Cria objeto de modelo sintetizado a partir dos query params
          const dynamicModel: MarketplaceModelItem = {
            id: modelRefParam,
            name: modelNameParam || "Modelo da Vitrine",
            slug: modelRefParam,
            type: "AI",
            category: "FASHION",
            avatarUrl: refImgParam || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
            gallery: [],
            tags: ["Casting", "Vitrine"],
            promptTrigger: promptParam || null,
            referenceFaceUrl: refImgParam || null,
            creditsPricePerGen: 5,
            status: true,
            isFeatured: true,
            isHot18: false,
          };
          handleApplyShowcaseModel(dynamicModel);
        }
      } else {
        if (promptParam) {
          setPrompt(promptParam);
          toast.info("Prompt carregado no Studio CREATE!");
        }
        if (refImgParam) {
          setReferenceImageUrl(refImgParam);
          setSelectedModelId("fal-ai/flux-pulid");
        }
      }
    }
  }, []);

  // Sincroniza modelo padrão ao alternar ferramenta (caso não haja modelo da vitrine ativo)
  useEffect(() => {
    if (activeShowcaseModel && activeTool === "image") {
      setSelectedModelId("fal-ai/flux-pulid");
      return;
    }
    const currentToolDef = TOOLS[activeTool];
    if (currentToolDef.models.length > 0) {
      setSelectedModelId(currentToolDef.models[0].id);
    }
  }, [activeTool, activeShowcaseModel]);

  // Aplica Presets de Estilo com Toggle e Parâmetros Ideais
  const handleSelectStyle = (styleId: string) => {
    if (selectedStyle === styleId) {
      setSelectedStyle("");
      toast.info("Estilo padrão restaurado.");
      return;
    }

    setSelectedStyle(styleId);
    const preset = STYLE_PRESETS.find((p) => p.id === styleId);
    if (!preset) return;

    if (preset.recommendedSteps) {
      setInferenceSteps(preset.recommendedSteps);
    }
    if (preset.recommendedCfg) {
      setGuidanceScale(preset.recommendedCfg);
    }

    toast.info(`Estilo "${preset.name}" ativado com parâmetros otimizados.`);
  };

  // Otimização de Prompt com IA
  const handleOptimizePrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, digite uma ideia antes de otimizar.");
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
          toolType: activeTool,
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

  // Upload de Imagem de Referência
  const handleReferenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const w = img.naturalWidth || 1024;
        const h = img.naturalHeight || 1024;
        setOriginalDimensions({ width: w, height: h });
        setImageSize("original");
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

      if (!res.ok) throw new Error("Falha no upload da imagem de referência.");
      const data = await res.json();
      setReferenceImageUrl(data.url);
      toast.success("Imagem anexada! Proporção e tamanho originais ativados.");
    } catch (err: any) {
      toast.error(err.message || "Erro no upload.");
    } finally {
      setIsUploadingRef(false);
    }
  };

  // Geração de Mídia
  const handleGenerate = async () => {
    if (isGenerating) return;
    setErrorMsg(null);

    const toolDef = TOOLS[activeTool];
    const selectedModel = toolDef.models.find((m) => m.id === selectedModelId) || toolDef.models[0];
    const hasTalkingVideo = activeTool === "video" && enableTalkingVideo && Boolean(speechText.trim());
    
    let cost = 0;
    const durationMultiplier = (activeTool === "video" && duration === "10") ? 2 : (activeTool === "video" && duration === "30") ? 3 : 1;
    const isKling = activeTool === "video" && selectedModel.id.includes("kling");
    const qualityMultiplier = isKling
      ? videoQuality === "ultra4k"
        ? 2.0
        : videoQuality === "high"
        ? 1.5
        : 1.0
      : 1.0;
    cost = Math.round((selectedModel.cost * durationMultiplier * qualityMultiplier)) + (hasTalkingVideo ? 9 : 0);

    if (creditMode !== "UNLIMITED" && balance < cost) {
      toast.error(`Saldo insuficiente (${balance} créditos disponíveis. Custo: ${cost}).`);
      setErrorMsg("Você não possui saldo suficiente para esta operação.");
      return;
    }

    if (activeTool === "image" && !prompt.trim()) {
      toast.error("Informe a descrição textual para gerar a imagem.");
      return;
    }

    if (activeTool === "image" && selectedModel.requiresReferenceImage && !referenceImageUrl) {
      const msg = `O modelo ${selectedModel.name} exige uma foto de referência de rosto. Anexe uma imagem ou selecione um modelo como Nano Banana Pro ou FLUX Turbo para criar do zero.`;
      toast.error(msg, { duration: 6000 });
      setErrorMsg(msg);
      return;
    }

    const inputs: Record<string, any> = {
      prompt,
      image_size: imageSize,
      seed: seed ? parseInt(seed, 10) : undefined,
      style: selectedStyle || undefined,
    };

    if (activeTool === "image") {
      inputs.num_inference_steps = inferenceSteps;
      inputs.guidance_scale = guidanceScale;
      inputs.resolution = resolution;
      if (negativePrompt.trim()) inputs.negative_prompt = negativePrompt.trim();
      if (referenceImageUrl) inputs.image_url = referenceImageUrl;
    } else if (activeTool === "video") {
      inputs.duration = duration;
      inputs.camera_motion = cameraMotion;
      inputs.quality = videoQuality;
      inputs.resolution = videoQuality === "high" ? "1080p" : "720p";
      if (videoMode === "image" && referenceImageUrl) inputs.image_url = referenceImageUrl;
      if (hasTalkingVideo) {
        inputs.is_talking_video = true;
        inputs.speech_text = speechText.trim();
        inputs.voice = selectedVoice;
      }
    } else if (activeTool === "lipsync") {
      inputs.video_url = sourceVideoUrl || resultMediaUrl;
      inputs.audio_url = sourceAudioUrl;
    } else if (activeTool === "motion") {
      inputs.character_image_url = characterImageUrl || referenceImageUrl;
      inputs.reference_video_url = referenceVideoUrl;
    } else if (activeTool === "upscale") {
      inputs.video_url = sourceVideoUrl || resultMediaUrl;
      inputs.image_url = referenceImageUrl || resultMediaUrl;
      inputs.scale_factor = 2;
    }

    try {
      setIsGenerating(true);
      setActiveStep(4);
      setStepText("Otimizando prompt com Inteligência Artificial...");

      // Auto-otimização de prompt transparente antes do disparo (com timeout resiliente de 3.5s)
      let finalPrompt = prompt.trim();
      const hasRefImg = Boolean(referenceImageUrl || characterImageUrl);
      // [TESTE TEMPORÁRIO]: Auto-otimização comentada para testar o envio do prompt 100% puro em português
      /*
      if (finalPrompt && (activeTool === "image" || activeTool === "video")) {
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
              toolType: activeTool,
              style: selectedStyle || undefined,
              hasReferenceImage: hasRefImg,
              image_url: referenceImageUrl || characterImageUrl || undefined,
            }),
          });
          clearTimeout(timeoutId);

          if (optRes.ok) {
            const optData = await optRes.json();
            if (optData.optimizedPrompt) {
              finalPrompt = optData.optimizedPrompt;
              setPrompt(finalPrompt);
            }
          }
        } catch {
          // Fallback resiliente mantém prompt original sem travar a geração
        }
      } else if (!finalPrompt && hasRefImg && activeTool === "image") {
        finalPrompt = "A high quality detailed photograph faithfully preserving the subject in the reference image, natural lighting";
      }
      */

      setStepText("Conectando ao cluster de IA");

      // Atualiza prompt final nos inputs e marca como já otimizado para evitar dupla execução
      inputs.prompt = finalPrompt;
      inputs.is_prompt_optimized = true;

      const idempotencyKey = `studio-${activeTool}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: toolDef.slug,
          modelId: selectedModelId,
          inputs,
          idempotencyKey,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Falha ao enviar geração.");
      }

      const job = await res.json();
      setActiveJob(job);
      setStepText("Processando inferência no motor");
      pollJob(job.id, activeTool === "image" ? "image" : "video");
    } catch (err: any) {
      setIsGenerating(false);
      setErrorMsg(err.message || "Erro no disparo da geração.");
      toast.error(err.message || "Erro na geração.");
    }
  };

  const pollJob = (jobId: string, expectedType: "image" | "video") => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/tools/job/${jobId}`);
        if (!res.ok) return;

        const currentJob = await res.json();
        setActiveJob(currentJob);

        if (currentJob.status === "PROCESSING") {
          setStepText("Renderizando no cluster GPU");
        } else if (currentJob.status === "COMPLETED") {
          clearInterval(timer);
          setStepText("Concluído!");
          setIsGenerating(false);

          if (currentJob.outputs?.[0]?.fileUrl) {
            const finalUrl = currentJob.outputs[0].fileUrl;
            setResultMediaUrl(finalUrl);
            setResultMediaType(expectedType);

            setHistoryItems((prev) => [
              {
                id: currentJob.id,
                url: finalUrl,
                mediaType: expectedType,
                modelName: TOOLS[activeTool].models.find((m) => m.id === selectedModelId)?.name || "IA",
                prompt,
                createdAt: new Date().toISOString(),
                timeAgo: "Agora",
              },
              ...prev,
            ]);
          }
          fetchConfig();
          toast.success("Obra renderizada com sucesso no Studio!");
        } else if (currentJob.status === "FAILED") {
          clearInterval(timer);
          setIsGenerating(false);
          setErrorMsg(currentJob.error || "A geração falhou no motor de IA.");
          fetchConfig();
          toast.error("A geração falhou.");
        }
      } catch {
        // Polling retry silencioso
      }
    }, 2500);
  };

  // Enviar para o VORIXA FLOW
  const handleOpenInFlow = async () => {
    try {
      setIsOpeningInFlow(true);
      const toolDef = TOOLS[activeTool];

      const res = await fetch("/api/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${projectName || "Produção"} - ${toolDef.name}`,
          description: `Fluxo derivado do Studio CREATE com prompt: "${prompt.slice(0, 80)}..."`,
        }),
      });

      if (!res.ok) throw new Error("Não foi possível criar o fluxo.");
      const newFlow = await res.json();

      const nodeType = activeTool === "image" ? "image" : "video";
      await fetch(`/api/flows/${newFlow.id}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeType,
          title: `${toolDef.name} Studio`,
          positionX: 250,
          positionY: 180,
          toolSlug: toolDef.slug,
          config: {
            prompt,
            image_size: imageSize,
            output_url: resultMediaUrl,
          },
        }),
      });

      toast.success("Pipeline criado no VORIXA FLOW!");
      router.push(`/dashboard/flow/${newFlow.id}`);
    } catch (e: any) {
      toast.error(e.message || "Erro ao abrir no Flow.");
    } finally {
      setIsOpeningInFlow(false);
    }
  };

  // Carregar Inspiração no Studio
  const handleSelectInspiration = (insp: InspirationItem) => {
    setActiveTool(insp.tool);
    setPrompt(insp.prompt);
    setSelectedStyle(insp.styleId);
    if (insp.videoUrl) {
      setResultMediaUrl(insp.videoUrl);
      setResultMediaType("video");
    } else if (insp.imageUrl) {
      setResultMediaUrl(insp.imageUrl);
      setResultMediaType("image");
    }
    toast.success(`Inspiração "${insp.title}" carregada no Studio!`);
  };

  // Salvar Projeto
  const handleSaveProject = () => {
    setIsEditingName(false);
    localStorage.setItem(
      "vorixa_studio_last_project",
      JSON.stringify({
        name: projectName,
        tool: activeTool,
        prompt,
        imageSize,
        style: selectedStyle,
        updatedAt: new Date().toISOString(),
      })
    );
    toast.success(`Projeto "${projectName}" salvo com sucesso!`);
  };

  const currentToolDef = TOOLS[activeTool];
  const currentModelDef =
    currentToolDef.models.find((m) => m.id === selectedModelId) || currentToolDef.models[0];

  return (
    <div className="w-full max-w-[1700px] mx-auto space-y-6 pb-20 text-slate-100 antialiased font-sans overflow-x-hidden">
      {/* 1. HEADER DO STUDIO */}
      <StudioHeader
        projectName={projectName}
        isEditingName={isEditingName}
        tempProjectName={tempProjectName}
        onTempProjectNameChange={setTempProjectName}
        onStartEditingName={() => {
          setTempProjectName(projectName);
          setIsEditingName(true);
        }}
        onConfirmProjectName={() => {
          setProjectName(tempProjectName || "Projeto sem nome");
          setIsEditingName(false);
          toast.success("Nome atualizado!");
        }}
        onSaveProject={handleSaveProject}
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        onClearFields={() => {
          setPrompt("");
          setReferenceImageUrl("");
          setIsMenuOpen(false);
          toast.info("Campos resetados.");
        }}
        onCopyPrompt={() => {
          navigator.clipboard.writeText(prompt);
          setIsMenuOpen(false);
          toast.success("Prompt copiado para a área de transferência!");
        }}
        onOpenLibrary={() => {
          router.push("/dashboard/library");
          setIsMenuOpen(false);
        }}
        onOpenInFlow={handleOpenInFlow}
        isOpeningInFlow={isOpeningInFlow}
        activeStep={activeStep}
        onStepChange={setActiveStep}
      />

      {/* 2. GRID PRINCIPAL: 3 COLUNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUNA DA ESQUERDA: PARÂMETROS & CONTROLES (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-5 bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-3.5 sm:p-5 w-full min-w-0">
          {/* Banner de Modelo da Vitrine Ativo */}
          {activeShowcaseModel && (
            <ActiveShowcaseModelBanner
              model={activeShowcaseModel}
              onRemove={handleRemoveShowcaseModel}
            />
          )}

          {/* Seção Tipo de Mídia */}
          <StudioToolSelector
            activeTool={activeTool}
            onSelectTool={(tool) => {
              setActiveTool(tool);
              setActiveStep(1);
            }}
          />

          {/* Seção Modelo de IA e Modo/Qualidade */}
          <StudioModelSelector
            activeTool={activeTool}
            selectedModelId={selectedModelId}
            onSelectModel={(modelId) => {
              setSelectedModelId(modelId);
              if (activeTool === "image") {
                if (modelId === "fal-ai/flux/schnell") {
                  setQualityMode("fast");
                  setInferenceSteps(4);
                } else if (modelId === "fal-ai/recraft-v3") {
                  setQualityMode("standard");
                  setInferenceSteps(20);
                } else if (modelId === "fal-ai/nano-banana-pro") {
                  setQualityMode("standard");
                  setInferenceSteps(24);
                } else if (modelId === "fal-ai/flux-pro/v1.1-ultra") {
                  setQualityMode("hd");
                  setInferenceSteps(28);
                } else if (modelId === "fal-ai/flux-pulid") {
                  setQualityMode("standard");
                  setInferenceSteps(20);
                }
              }
            }}
            qualityMode={qualityMode}
            onSelectQualityMode={(modeId, steps, modelId) => {
              setQualityMode(modeId);
              setInferenceSteps(steps);
              setSelectedModelId(modelId);
            }}
            onOpenModelShowcasePicker={() => setIsModelPickerOpen(true)}
            hasActiveShowcaseModel={!!activeShowcaseModel}
          />

          {/* Seção Prompt de Criação */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Prompt de Criação
                </label>
              </div>
              <button
                type="button"
                onClick={handleOptimizePrompt}
                disabled={isOptimizing || !prompt.trim()}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white shadow-md shadow-violet-600/20 transition-all active:scale-95 cursor-pointer min-h-[44px]"
              >
                {isOptimizing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 text-cyan-200" />
                )}
                <span>Otimizar com IA</span>
              </button>
            </div>

            {/* Dica para Vídeo com Fala Nativa */}
            {activeTool === "video" && (
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-violet-950/30 border border-violet-500/30 text-violet-200 text-[11px] leading-relaxed">
                <MessageSquareQuote className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-violet-300 font-semibold">Dica de Fala em Português:</strong> Para a modelo falar em português, coloque o diálogo obrigatoriamente <strong className="text-amber-300 underline underline-offset-2 font-bold">entre aspas</strong> (ex: <em className="text-white">"Gostou do look? Garanta o seu no link!"</em>). Falas sem aspas serão traduzidas para o inglês na cena.
                </span>
              </div>
            )}

            <div className="relative rounded-2xl border border-[#1E202E] bg-[#070709] focus-within:border-violet-500/80 transition-all">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder={
                  activeTool === "video"
                    ? 'Ex: A modelo olha para a câmera sorrindo e diz: "Oi pessoal, confira essa novidade exclusiva!", movimento suave de câmera, 4k ultra realista...'
                    : "Ex: Close cinematográfico de um samurai futurista com armadura cibernética de titânio e luzes néon azuis sob chuva, iluminação volumétrica, fotorrealista..."
                }
                className="w-full bg-transparent p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed break-words"
                maxLength={1500}
              />

              {/* Preview de imagem de referência, se carregada */}
              {referenceImageUrl && (
                <div className="px-3 pb-2 flex items-center gap-2">
                  <div className="relative h-11 w-11 rounded-lg overflow-hidden border border-violet-500/50 aspect-square shrink-0">
                    <img src={referenceImageUrl} alt="Referência" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setReferenceImageUrl("")}
                      className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity min-h-[44px] min-w-[44px]"
                      aria-label="Remover imagem de referência"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono truncate">Imagem de referência ativa</span>
                </div>
              )}

              {/* Rodapé da Textarea com Upload de Referência */}
              <div className="flex items-center justify-between border-t border-[#1E202E] px-3 py-2 text-slate-400 gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <input
                    ref={refFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleReferenceUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => refFileInputRef.current?.click()}
                    disabled={isUploadingRef}
                    className="p-2.5 rounded-lg hover:bg-[#13141B] hover:text-violet-400 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Anexar imagem de referência local"
                    aria-label="Anexar imagem de referência"
                  >
                    {isUploadingRef ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-violet-400" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModelPickerOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#13141B] hover:bg-violet-600/20 border border-[#1E202E] hover:border-violet-500/50 text-slate-300 hover:text-violet-300 text-xs font-medium transition-all cursor-pointer min-h-[44px]"
                    title="Escolher modelo do catálogo da vitrine"
                  >
                    <span>🎭</span>
                    <span className="hidden sm:inline">
                      {activeShowcaseModel ? activeShowcaseModel.name : "Modelo da Vitrine"}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {prompt && (
                    <button
                      type="button"
                      onClick={() => setPrompt("")}
                      className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer min-h-[44px] px-2 flex items-center"
                    >
                      Limpar
                    </button>
                  )}
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {prompt.length}/1500
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Proporção da Imagem e Resolução */}
          <StudioAspectRatioSelector
            activeTool={activeTool}
            imageSize={imageSize}
            onSelectImageSize={setImageSize}
            resolution={resolution}
            onSelectResolution={setResolution}
            referenceImageUrl={referenceImageUrl}
            originalDimensions={originalDimensions}
          />

          {/* Controles Específicos para Vídeo */}
          {activeTool === "video" && (
            <StudioVideoControls
              selectedModelId={selectedModelId}
              duration={duration}
              onDurationChange={setDuration}
              videoQuality={videoQuality}
              onVideoQualityChange={setVideoQuality}
              cameraMotion={cameraMotion}
              onCameraMotionChange={setCameraMotion}
              enableTalkingVideo={enableTalkingVideo}
              onToggleTalkingVideo={setEnableTalkingVideo}
              speechText={speechText}
              onSpeechTextChange={setSpeechText}
              selectedVoice={selectedVoice}
              onVoiceChange={setSelectedVoice}
              selectedGender={selectedGender}
              onGenderChange={setSelectedGender}
            />
          )}

          {/* Controles Específicos para LipSync / Avatar */}
          {activeTool === "lipsync" && (
            <div className="space-y-4">
              <FileUploader
                accept="video/*"
                label="1. Vídeo do Personagem"
                onUploadSuccess={(url) => setSourceVideoUrl(url)}
                onClear={() => setSourceVideoUrl("")}
              />
              <AudioSourceSelector
                label="2. Áudio de Fala do Personagem"
                audioUrl={sourceAudioUrl}
                onAudioChange={(url) => setSourceAudioUrl(url)}
              />
            </div>
          )}

          {/* Alerta de Imagem Obrigatória para o Modelo */}
          {activeTool === "image" && currentModelDef.requiresReferenceImage && !referenceImageUrl && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
              <span className="text-base shrink-0 mt-0.5">⚠️</span>
              <div className="space-y-1">
                <p className="font-bold text-amber-300">
                  O modelo {currentModelDef.name} exige uma foto de referência
                </p>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  Para clonar ou fixar o rosto, clique no ícone de upload (abaixo do prompt) e anexe uma foto facial, ou selecione <strong>Nano Banana Pro</strong> ou <strong>FLUX Turbo</strong> para criar do zero.
                </p>
              </div>
            </div>
          )}

          {/* Mensagem de Erro Específica */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <span className="text-base shrink-0 mt-0.5">❌</span>
              <div className="space-y-1 flex-1">
                <p className="font-bold text-rose-300">Não foi possível concluir a geração</p>
                <p className="text-[11px] text-rose-200/90 leading-relaxed break-words">{errorMsg}</p>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-rose-400 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Configurações Avançadas (Acordeão) */}
          <StudioAdvancedSettings
            isOpen={isAdvancedOpen}
            onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
            inferenceSteps={inferenceSteps}
            onInferenceStepsChange={setInferenceSteps}
            guidanceScale={guidanceScale}
            onGuidanceScaleChange={setGuidanceScale}
            seed={seed}
            onSeedChange={setSeed}
            negativePrompt={negativePrompt}
            onNegativePromptChange={setNegativePrompt}
            onRandomSeed={() => setSeed(Math.floor(Math.random() * 9999999).toString())}
          />

          {/* Botão de Ação Principal: Gerar */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 active:scale-[0.98] disabled:opacity-50 text-white font-black text-sm tracking-wide shadow-xl shadow-violet-600/30 transition-all cursor-pointer"
            style={{ minHeight: "52px" }}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>{stepText || "Renderizando..."}</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>
                  Gerar {currentToolDef.name} ({
                    activeTool === "video" && currentModelDef.id === "vorixa-ia"
                      ? duration === "30"
                        ? videoQuality === "ultra4k" ? 150 : videoQuality === "high" ? 120 : 65
                        : duration === "10"
                        ? videoQuality === "ultra4k" ? 60 : videoQuality === "high" ? 45 : 25
                        : videoQuality === "ultra4k" ? 35 : videoQuality === "high" ? 25 : 15
                      : Math.round(
                          currentModelDef.cost *
                          (activeTool === "video" && duration === "10" ? 2 : (activeTool === "video" && duration === "30") ? 3 : 1) *
                          (activeTool === "video" && currentModelDef.id.includes("kling")
                            ? videoQuality === "ultra4k"
                              ? 2.0
                              : videoQuality === "high"
                              ? 1.5
                              : 1.0
                            : 1.0)
                        ) + (activeTool === "video" && enableTalkingVideo && speechText.trim() ? 9 : 0)
                  } créditos)
                </span>
              </>
            )}
          </button>
        </div>

        {/* COLUNA CENTRAL: PREVIEW PRINCIPAL, CUSTOM PLAYER & INSPIRAÇÕES (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <StudioPreviewPlayer
            isGenerating={isGenerating}
            stepText={stepText}
            currentModelDef={currentModelDef}
            previewTab={previewTab}
            onPreviewTabChange={setPreviewTab}
            resultMediaUrl={resultMediaUrl}
            resultMediaType={resultMediaType}
            referenceImageUrl={referenceImageUrl}
            projectName={projectName}
            onOpenInFlow={handleOpenInFlow}
            isOpeningInFlow={isOpeningInFlow}
            onSelectInspiration={handleSelectInspiration}
            onSelectUpscale={() => {
              setActiveTool("upscale");
              toast.info("Ferramenta de Upscale 4K selecionada!");
            }}
            onVary={() => {
              setSeed(Math.floor(Math.random() * 9999999).toString());
              handleGenerate();
            }}
            onSetResultAsReference={() => {
              if (resultMediaUrl) {
                setReferenceImageUrl(resultMediaUrl);
                toast.success("Mídia definida como referência de entrada!");
              }
            }}
            defaultIcon={currentToolDef.icon}
            recentCreations={historyItems}
            onSelectRecentCreation={(url, mediaType) => {
              setResultMediaUrl(url);
              setResultMediaType(mediaType);
              toast.success("Carregado no player!");
            }}
          />
        </div>

        {/* COLUNA DA DIREITA: HISTÓRICO LATERAL (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          <StudioHistorySidebar
            historyItems={historyItems}
            isLoading={isLoadingHistory}
            onSelectItem={(item) => {
              setResultMediaUrl(item.url);
              setResultMediaType(item.mediaType);
              if (item.prompt) setPrompt(item.prompt);
              toast.success("Carregado no player!");
            }}
            onCopyPrompt={(promptText) => {
              navigator.clipboard.writeText(promptText);
              toast.success("Prompt copiado!");
            }}
          />
        </div>
      </div>

      {/* 3. BARRA DE RODAPÉ: DICA DE PRO, CRÉDITOS E MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-[#0D0E12] border border-[#1E202E]">
        {/* Dica de Pro */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Dica de Pro
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Use o VORIXA FLOW para encadear múltiplos modelos e criar produções completas.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard/flow")}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer pt-1"
          >
            <span>Abrir Flow Canvas</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Seus Créditos com Gráfico Circular */}
        <div className="flex items-center gap-3.5">
          <div className="relative h-12 w-12 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#1E202E]"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-violet-500 transition-all duration-1000 ease-out"
                strokeDasharray="62, 100"
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white">
              62%
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Seus Créditos</span>
            <div className="text-sm font-black text-white">
              {creditMode === "UNLIMITED" ? "Ilimitados" : `${balance.toLocaleString()} restantes`}
            </div>
          </div>
        </div>

        {/* Tempo Médio de Geração */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Tempo Médio de Geração</span>
          <div className="text-sm font-black text-white font-mono">{currentModelDef.speed}</div>
          <span className="text-[10px] text-slate-500">Otimizado no cluster GPU do {currentModelDef.name}</span>
        </div>

        {/* Qualidade de Saída */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Qualidade de Saída</span>
          <div className="text-sm font-black text-white font-mono">Até 8K Ultra HD</div>
          <span className="text-[10px] text-slate-500">Compatível com Upscale Neural 4K/8K</span>
        </div>
      </div>

      {/* Modal de Seleção Rápida de Modelo da Vitrine / Casting */}
      <QuickModelPickerModal
        isOpen={isModelPickerOpen}
        onClose={() => setIsModelPickerOpen(false)}
        onSelectModel={handleApplyShowcaseModel}
        activeModelId={activeShowcaseModel?.id || null}
      />
    </div>
  );
}