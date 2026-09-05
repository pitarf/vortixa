"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Wand2,
  Flame,
  Type,
  Image as ImageIcon,
  Palette,
  User,
  LayoutGrid,
  Lightbulb,
  Dices,
  Trash2,
  Maximize2,
  Minimize2,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Upload,
  RefreshCw,
  Coins,
  Share2,
  Boxes,
  Eye,
  X,
  MoreVertical,
  MoreHorizontal,
  ExternalLink,
  Zap,
  Crown
} from "lucide-react";
import { toast } from "sonner";

// =========================================================================
// DEFINIÇÕES E CONSTANTES DE DADOS
// =========================================================================

type CreationMode = "text-to-image" | "image-to-image" | "style-ref" | "character" | "composition";
type QualityMode = "fast" | "standard" | "hd" | "ultra";

interface StylePreset {
  id: string;
  name: string;
  thumb: string;
  description: string;
  recommendedSteps: number;
  recommendedCfg: number;
  suffix: string;
}

const STYLE_PRESETS: StylePreset[] = [
  {
    id: "cinematic",
    name: "Cinemático",
    thumb: "/media/landing/gallery/hypercar_cyberpunk.jpg",
    description: "Iluminação chiaroscuro dramática, lente anamórfica 2.39:1 e grading Hollywoodiano.",
    recommendedSteps: 24,
    recommendedCfg: 7.5,
    suffix: ", cinematic lighting, 8k resolution, photorealistic, award winning cinematography, anamorphic lens flare",
  },
  {
    id: "realist",
    name: "Realista",
    thumb: "/media/landing/gallery/editorial_fashion.jpg",
    description: "Fotografia crua unedited, microporos autênticos, textura natural sem CGI.",
    recommendedSteps: 28,
    recommendedCfg: 7.0,
    suffix: ", highly detailed raw photo, 35mm lens, natural skin textures with pores, no cgi, softbox studio",
  },
  {
    id: "anime",
    name: "Anime",
    thumb: "/test_wide_establishing.png",
    description: "Visual cel-shading moderno, céus luminosos no estilo Makoto Shinkai e Ufotable.",
    recommendedSteps: 20,
    recommendedCfg: 8.0,
    suffix: ", anime aesthetic, modern Japanese animation, Makoto Shinkai style, vibrant colors, lush scenic background",
  },
  {
    id: "octane3d",
    name: "3D Render",
    thumb: "/media/landing/gallery/perfume_commercial.jpg",
    description: "Render Octane & Redshift no Cinema 4D com cáusticas e reflexos ray-tracing.",
    recommendedSteps: 25,
    recommendedCfg: 7.5,
    suffix: ", 3d octane render, glossy textures, volumetric lighting, surreal luxury concept art, Cinema 4D, pristine reflections",
  },
  {
    id: "photographic",
    name: "Fotográfico",
    thumb: "/media/landing/gallery/street_dancer.jpg",
    description: "Fotografia documental de rua, profundidade de campo óptica e luz ambiente natural.",
    recommendedSteps: 26,
    recommendedCfg: 7.0,
    suffix: ", authentic street photography, 85mm f/1.4 lens, candid shot, natural daylight, photorealistic depth of field",
  },
  {
    id: "digital-art",
    name: "Arte Digital",
    thumb: "/media/landing/hero/hero_main.jpg",
    description: "Pintura digital conceitual, traços ricos, iluminação fantasiosa e alto contraste.",
    recommendedSteps: 22,
    recommendedCfg: 8.5,
    suffix: ", digital concept art, highly detailed digital painting, vibrant palette, fantasy atmosphere, artstation trending",
  },
];

const ASPECT_RATIOS = [
  { id: "square_hd", label: "1:1", name: "Quadrado", width: "w-4 h-4", defaultRes: "1024 x 1024" },
  { id: "landscape_16_9", label: "16:9", name: "Paisagem", width: "w-6 h-3.5", defaultRes: "1792 x 1024" },
  { id: "portrait_16_9", label: "9:16", name: "Retrato", width: "w-3.5 h-6", defaultRes: "1024 x 1792" },
  { id: "landscape_4_3", label: "4:3", name: "Clássico", width: "w-5 h-4", defaultRes: "1152 x 864" },
  { id: "landscape_3_2", label: "3:2", name: "Fotografia", width: "w-6 h-4", defaultRes: "1216 x 832" },
];

const RESOLUTION_OPTIONS: Record<string, string[]> = {
  square_hd: ["1024 x 1024", "768 x 768", "1536 x 1536"],
  landscape_16_9: ["1792 x 1024", "1344 x 768", "1920 x 1080"],
  portrait_16_9: ["1024 x 1792", "768 x 1344", "1080 x 1920"],
  landscape_4_3: ["1152 x 864", "1024 x 768", "1440 x 1080"],
  landscape_3_2: ["1216 x 832", "1536 x 1024"],
};

interface AIModelDef {
  id: string;
  name: string;
  badge: string;
  cost: number;
  description: string;
  speed: string;
  recommendedSteps: number;
}

const AI_MODELS: AIModelDef[] = [
  {
    id: "fal-ai/flux/schnell",
    name: "FLUX.1 Turbo",
    badge: "Super Rápido",
    cost: 1,
    description: "Geração ultra-rápida em segundos, ideal para testar ideias",
    speed: "~ 4s",
    recommendedSteps: 4,
  },
  {
    id: "fal-ai/nano-banana-pro",
    name: "Google Imagen 3",
    badge: "Realismo Humano",
    cost: 3,
    description: "Especialista em pessoas reais, fotos sem corte e textos nítidos",
    speed: "~ 14s",
    recommendedSteps: 24,
  },
  {
    id: "fal-ai/recraft-v3",
    name: "Recraft V3 Design",
    badge: "Design & Logos",
    cost: 2,
    description: "Perfeito para tipografia legível, ilustrações e marcas",
    speed: "~ 12s",
    recommendedSteps: 20,
  },
  {
    id: "fal-ai/flux-pro/v1.1-ultra",
    name: "FLUX Pro Ultra",
    badge: "Máxima Definição",
    cost: 4,
    description: "Qualidade cinematográfica de estúdio e detalhes extremos",
    speed: "~ 20s",
    recommendedSteps: 28,
  },
];

const QUALITY_MODES: { id: QualityMode; name: string; cost: number; modelId: string; badge: string; steps: number }[] = [
  { id: "fast", name: "Rápido", cost: 1, modelId: "fal-ai/flux/schnell", badge: "1 crédito", steps: 4 },
  { id: "standard", name: "Padrão", cost: 2, modelId: "fal-ai/recraft-v3", badge: "2 créditos", steps: 20 },
  { id: "hd", name: "Alta Definição", cost: 4, modelId: "fal-ai/flux-pro/v1.1-ultra", badge: "4 créditos", steps: 28 },
  { id: "ultra", name: "Ultra", cost: 8, modelId: "fal-ai/flux-pro/v1.1-ultra", badge: "8 créditos", steps: 35 },
];

const PROMPT_SUGGESTIONS = [
  "Uma mulher futurista em uma cidade cyberpunk, chuva neon, iluminação cinematográfica, ultra realista, 8k, destaque no rosto, atmosfera de filme, profundidade de campo.",
  "Close editorial de modelo em estúdio com detalhes holográficos na pele, luz suave de difusor softbox, lente prime 85mm f/1.4, poros naturais visíveis.",
  "Paisagem épica de cidade flutuante no topo de montanhas rochosas envolta em névoa dourada ao entardecer, arquitetura clássica misturada com ficção científica.",
  "Frasco de perfume de luxo com detalhes em vidro lapidado sobre base de mármore preto molhado, reflexos de iluminação de estúdio comercial 3D.",
  "Astronauta explorando floresta bioluminescente em planeta alienígena, luzes de neon azul e violeta refletidas na viseira espelhada, 8k.",
  "Dragão ancestral de escamas de obsidiana e magma brilhante sobrevoando ruínas de castelo medieval sob tempestade de raios volumétrica.",
];

const INSPIRATION_ITEMS = [
  {
    id: "insp-1",
    tag: "Em Alta",
    title: "Retrato Cyberpunk Neon",
    thumb: "/media/landing/gallery/street_dancer.jpg",
    style: "cinematic",
    ratio: "portrait_16_9",
    prompt: "Uma mulher futurista em uma cidade cyberpunk, chuva neon, iluminação cinematográfica, ultra realista, 8k, destaque no rosto, atmosfera de filme, profundidade de campo.",
  },
  {
    id: "insp-2",
    tag: "Personagens",
    title: "Hypercar Nocturne",
    thumb: "/media/landing/gallery/hypercar_cyberpunk.jpg",
    style: "cinematic",
    ratio: "landscape_16_9",
    prompt: "Hypercar futurista com neon ciano e roxo em alta velocidade numa rodovia molhada de Neo-Tóquio, reflexos volumétricos, chuva fina, câmera tracking.",
  },
  {
    id: "insp-3",
    tag: "Cenários",
    title: "Cidade Flutuante",
    thumb: "/media/landing/hero/hero_main.jpg",
    style: "digital-art",
    ratio: "landscape_16_9",
    prompt: "Cidade futurista flutuante acima das nuvens com cachoeiras etéreas e luzes douradas ao entardecer, arte conceitual cinematográfica.",
  },
  {
    id: "insp-4",
    tag: "Produtos",
    title: "Perfume Luxo Dourado",
    thumb: "/media/landing/gallery/perfume_commercial.jpg",
    style: "octane3d",
    ratio: "square_hd",
    prompt: "Frasco de perfume de luxo de vidro lapidado emergindo de ondas douradas líquidas, iluminação softbox, render 3D pristine reflections.",
  },
  {
    id: "insp-5",
    tag: "Personagens",
    title: "Astronauta Cósmica",
    thumb: "/media/landing/gallery/editorial_fashion.jpg",
    style: "realist",
    ratio: "portrait_16_9",
    prompt: "Astronauta em traje futurista detalhado com reflexos de nebulosa na viseira capacete, iluminação dramática estelar, 8k raw photo.",
  },
  {
    id: "insp-6",
    tag: "Anime",
    title: "Guerreira Cel-Shading",
    thumb: "/test_wide_establishing.png",
    style: "anime",
    ratio: "landscape_16_9",
    prompt: "Menina guerreira anime com cabelo escuro e olhos expressivos sob céu estrelado místico no estilo Makoto Shinkai e Ufotable, arte digital nítida.",
  },
  {
    id: "insp-7",
    tag: "Cenários",
    title: "Montanhas Alpinas",
    thumb: "/media/landing/gallery/hypercar_cyberpunk.jpg",
    style: "photographic",
    ratio: "landscape_16_9",
    prompt: "Cadeia de montanhas alpinas com lago glacial espelhado ao amanhecer, névoa volumétrica suave, fotografia de natureza em 8k.",
  },
];

interface RecentCreation {
  id: string;
  url: string;
  title: string;
  resolution: string;
  timeAgo: string;
  prompt: string;
  style: string;
  ratio: string;
}

export default function ImageGenerationPage() {
  const router = useRouter();

  // Estados Globais
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
  const [isUploadingRef, setIsUploadingRef] = useState<boolean>(false);
  const [denoiseStrength, setDenoiseStrength] = useState<number>(0.75);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configurações Avançadas
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [inferenceSteps, setInferenceSteps] = useState<number>(24);
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [seed, setSeed] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("blurry, low quality, deformed anatomy, bad hands, extra limbs, watermark, artifacts, signature");

  // Estados de Geração e Preview
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStepText, setActiveStepText] = useState<string>("");
  const [activeResultUrl, setActiveResultUrl] = useState<string>("/media/landing/gallery/street_dancer.jpg");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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

  // Filtros de Inspiração
  const [selectedTag, setSelectedTag] = useState<string>("Em Alta");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

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
      toast.success("Imagem de referência anexada com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro no upload.");
    } finally {
      setIsUploadingRef(false);
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

            // Adiciona às variações e histórico
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

  const handleApplyInspiration = (item: typeof INSPIRATION_ITEMS[0]) => {
    setPrompt(item.prompt);
    if (item.style) handleSelectStyle(item.style);
    if (item.ratio) handleSelectRatio(item.ratio);
    toast.success(`Inspiração "${item.title}" aplicada!`);
  };

  const filteredInspirations =
    selectedTag === "Em Alta"
      ? INSPIRATION_ITEMS
      : INSPIRATION_ITEMS.filter((i) => i.tag.toLowerCase() === selectedTag.toLowerCase());

  const currentQualityCost = QUALITY_MODES.find((q) => q.id === qualityMode)?.cost || 1;
  const currentModelDef = AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0];

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 p-3 sm:p-5 lg:p-6 space-y-6 max-w-[1700px] mx-auto font-sans">
      
      {/* =====================================================================
          1. HEADER & TOP BANNER CINEMATOGRÁFICO
          ===================================================================== */}
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4 border-b border-[#1E202E] pb-5">
        
        {/* Lado Esquerdo: Voltar, Título e Subtítulo */}
        <div className="flex flex-col justify-center space-y-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-600/30 ring-1 ring-white/20">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                  Geração de Imagem
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/15 text-violet-400 border border-violet-500/30">
                  {currentModelDef.name}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-xl leading-relaxed">
                Crie fotos hiper-realistas, artes e designs com Inteligência Artificial sem complicação.
              </p>
            </div>
          </div>
        </div>

        {/* Lado Direito: Banner Cinematográfico com Citação & Card FLUX.1 */}
        <div className="relative overflow-hidden rounded-2xl border border-[#1E202E] bg-gradient-to-r from-[#0D0E12] to-[#13141B] p-4 flex items-center justify-between gap-6 min-w-[320px] lg:max-w-md shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 space-y-1">
            <p className="text-xs sm:text-sm italic font-serif text-slate-300">
              “Da sua imaginação para a realidade.”
            </p>
            <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500 block">
              — VORIXA
            </span>
          </div>

          <div className="relative z-10 flex items-center gap-3 bg-[#070709]/80 border border-violet-500/30 p-2.5 rounded-xl backdrop-blur-md shadow-lg">
            <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-violet-400/50 shadow-sm flex-shrink-0">
              <img
                src="/media/landing/gallery/editorial_fashion.jpg"
                alt="FLUX.1"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white font-mono">FLUX.1</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Qualidade profissional para suas ideias.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. ABAS DE MODO DE CRIAÇÃO (WORKFLOW TABS)
          ===================================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#1E202E]/60">
        {[
          { id: "text-to-image" as CreationMode, label: "Texto para Imagem", icon: Type },
          { id: "image-to-image" as CreationMode, label: "Imagem para Imagem", icon: ImageIcon },
          { id: "style-ref" as CreationMode, label: "Estilo de Referência", icon: Palette },
          { id: "character" as CreationMode, label: "Personagem", icon: User },
          { id: "composition" as CreationMode, label: "Composição Avançada", icon: LayoutGrid },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = creationMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCreationMode(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-violet-600/25 ring-1 ring-white/20"
                  : "bg-[#0D0E12] text-slate-400 border border-[#1E202E] hover:border-slate-700 hover:text-slate-200"
              }`}
              style={{ minHeight: "40px" }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          3. CORPO PRINCIPAL: 3 COLUNAS (CONTROLES / PREVIEW / HISTÓRICO)
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* -------------------------------------------------------------------
            COLUNA DA ESQUERDA: PAINEL DE CRIAÇÃO E CONTROLES (5 COLUNAS)
            ------------------------------------------------------------------- */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4 bg-[#0D0E12] border border-[#1E202E] p-4 sm:p-5 rounded-2xl shadow-xl">

          {/* Upload para Img2Img ou Estilo */}
          {creationMode !== "text-to-image" && (
            <div className="p-3 rounded-xl bg-[#070709] border border-violet-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-violet-300">
                  {creationMode === "image-to-image"
                    ? "Imagem Base de Entrada"
                    : creationMode === "style-ref"
                    ? "Imagem de Estilo / Paleta"
                    : "Imagem de Referência do Rosto"}
                </span>
                {referenceImageUrl && (
                  <button
                    type="button"
                    onClick={() => setReferenceImageUrl("")}
                    className="text-red-400 hover:text-red-300 text-[11px] font-mono cursor-pointer"
                  >
                    Remover
                  </button>
                )}
              </div>

              {referenceImageUrl ? (
                <div className="relative h-28 rounded-lg overflow-hidden border border-[#1E202E]">
                  <img src={referenceImageUrl} alt="Referência" className="h-full w-full object-cover" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingRef}
                  className="w-full border-2 border-dashed border-[#1E202E] hover:border-violet-500/80 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {isUploadingRef ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-violet-400" />
                  ) : (
                    <Upload className="w-5 h-5 text-violet-400" />
                  )}
                  <span className="text-xs font-semibold">Clique para carregar imagem</span>
                  <span className="text-[10px] text-slate-500 font-mono">PNG, JPG até 50MB</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {creationMode === "image-to-image" && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Intensidade de Variação (Denoise)</span>
                    <span className="font-mono text-cyan-400 font-bold">{denoiseStrength}</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    value={denoiseStrength}
                    onChange={(e) => setDenoiseStrength(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}

          {/* Seção: Prompt de Criação */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Prompt de Criação
              </label>
              <button
                type="button"
                onClick={handleOptimizePrompt}
                disabled={isOptimizing || !prompt.trim()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white shadow-md shadow-violet-600/20 transition-all active:scale-95 cursor-pointer"
                style={{ minHeight: "32px" }}
              >
                {isOptimizing ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Wand2 className="h-3.5 w-3.5 text-cyan-200" />
                )}
                <span>Otimizar com IA</span>
              </button>
            </div>

            <div className="relative rounded-2xl border border-[#1E202E] bg-[#070709] focus-within:border-violet-500/80 transition-all">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Descreva sua ideia com riqueza de detalhes..."
                className="w-full bg-transparent p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
                maxLength={1500}
              />

              {/* Barra de ações no rodapé do prompt */}
              <div className="flex items-center justify-between border-t border-[#1E202E] px-3 py-2 text-slate-400 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleInspirationPrompt}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#13141B] hover:text-amber-300 transition-colors text-[11px] font-semibold cursor-pointer"
                  >
                    <Lightbulb className="w-3 h-3 text-amber-400" />
                    <span>Inspirar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInspirationPrompt}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#13141B] hover:text-cyan-300 transition-colors text-[11px] font-semibold cursor-pointer"
                  >
                    <Dices className="w-3 h-3 text-cyan-400" />
                    <span>Prompt Aleatório</span>
                  </button>

                  {prompt && (
                    <button
                      type="button"
                      onClick={handleClearPrompt}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#13141B] hover:text-rose-300 transition-colors text-[11px] font-semibold cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 text-rose-400" />
                      <span>Limpar</span>
                    </button>
                  )}
                </div>

                <span className="text-[10px] font-mono text-slate-500">
                  {prompt.length}/1500
                </span>
              </div>
            </div>
          </div>

          {/* Seção: Estilo Visual (6 Cards) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Estilo Visual
              </label>
              {selectedStyle && (
                <span className="text-[10px] text-cyan-400 font-mono">
                  Ativo ({STYLE_PRESETS.find((s) => s.id === selectedStyle)?.name})
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6 gap-2">
              {STYLE_PRESETS.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => handleSelectStyle(style.id)}
                    className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col items-center justify-end p-1.5 aspect-square ${
                      isSelected
                        ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400"
                        : "border-[#1E202E] hover:border-slate-600 opacity-80 hover:opacity-100"
                    }`}
                    style={{ minHeight: "58px" }}
                    title={style.description}
                  >
                    <img
                      src={style.thumb}
                      alt={style.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                    <span className="relative z-10 text-[9px] font-bold text-white text-center leading-tight truncate w-full">
                      {style.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seção: Proporção da Imagem e Tamanho */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Proporção da Imagem
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400">Tamanho:</span>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="bg-[#070709] border border-[#1E202E] rounded-lg px-2 py-0.5 text-[11px] font-mono text-cyan-400 outline-none cursor-pointer"
                >
                  {(RESOLUTION_OPTIONS[aspectRatio] || [resolution]).map((res) => (
                    <option key={res} value={res} className="bg-[#0D0E12] text-white">
                      {res}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {ASPECT_RATIOS.map((ratio) => {
                const isSelected = aspectRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => handleSelectRatio(ratio.id)}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#13141B] border-violet-500 text-white shadow-md shadow-violet-500/25"
                        : "bg-[#070709] border-[#1E202E] text-slate-400 hover:text-slate-200"
                    }`}
                    style={{ minHeight: "50px" }}
                  >
                    <div
                      className={`border border-current rounded-sm ${ratio.width} ${
                        isSelected ? "border-violet-400 bg-violet-500/20" : "border-slate-500"
                      }`}
                    />
                    <span className="text-[10px] font-bold font-mono">{ratio.label}</span>
                    <span className="text-[8px] text-slate-500 font-sans truncate">{ratio.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seção Modelo de IA com Linguagem Amigável para Leigos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Qual Inteligência Artificial você quer usar?
                </label>
                <span className="text-[11px] text-slate-400">
                  Escolha o motor ideal para o seu objetivo:
                </span>
              </div>
              <span className="text-[10px] font-mono text-violet-400 font-semibold">
                {currentModelDef.cost} crédito{currentModelDef.cost > 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AI_MODELS.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => {
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
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#13141B] border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/50"
                        : "bg-[#070709] border-[#1E202E] hover:border-slate-700 opacity-85 hover:opacity-100"
                    }`}
                    style={{ minHeight: "82px" }}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">
                        {model.name}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 whitespace-nowrap">
                        {model.cost} cr
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight my-1">
                      {model.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-[#1E202E]/60">
                      <span className="text-cyan-400 font-semibold">{model.badge}</span>
                      <span className="text-slate-500">{model.speed}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Barra de Ação Principal (Custo & Botão Gerar) */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="text-slate-400">Custo da geração:</span>
              <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                <span>{currentModelDef.cost} crédito{currentModelDef.cost > 1 ? "s" : ""}</span>
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

        {/* -------------------------------------------------------------------
            ÁREA CENTRAL: PREVIEW PRINCIPAL & CARROSSEL (5 COLUNAS)
            ------------------------------------------------------------------- */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-4 bg-[#0D0E12] border border-[#1E202E] p-4 sm:p-5 rounded-2xl shadow-xl">

          {/* Header do Preview */}
          <div className="flex items-center justify-between border-b border-[#1E202E] pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Preview
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                title="Tela Cheia"
                style={{ minHeight: "32px" }}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">Tela Cheia</span>
              </button>

              <button
                type="button"
                onClick={handleCopyPrompt}
                className="p-1.5 rounded-lg bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copiar Prompt"
                style={{ minHeight: "32px", minWidth: "32px" }}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Principal com Imagem Ativa */}
          <div className="relative rounded-2xl overflow-hidden border border-[#1E202E] bg-black/80 flex items-center justify-center min-h-[380px] max-h-[480px] shadow-2xl">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-0.5 animate-spin">
                  <div className="h-full w-full bg-[#070709] rounded-2xl flex items-center justify-center">
                    <Wand2 className="h-6 w-6 text-cyan-300 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white font-heading">
                    {activeStepText || "Renderizando na GPU..."}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    Taxa de amostragem: {inferenceSteps} steps
                  </p>
                </div>
              </div>
            ) : (
              <img
                src={activeResultUrl}
                alt="Preview Gerado"
                className="w-full h-full object-contain max-h-[460px] rounded-xl transition-all duration-300 hover:scale-[1.01]"
              />
            )}
          </div>

          {/* Carrossel Inferior de Variações */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Variações Recentes</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const prevIdx = activeVariationIndex > 0 ? activeVariationIndex - 1 : variations.length - 1;
                    setActiveVariationIndex(prevIdx);
                    setActiveResultUrl(variations[prevIdx]);
                  }}
                  className="p-1 rounded bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = activeVariationIndex < variations.length - 1 ? activeVariationIndex + 1 : 0;
                    setActiveVariationIndex(nextIdx);
                    setActiveResultUrl(variations[nextIdx]);
                  }}
                  className="p-1 rounded bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {variations.map((url, idx) => {
                const isActive = activeResultUrl === url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveResultUrl(url);
                      setActiveVariationIndex(idx);
                    }}
                    className={`relative rounded-xl overflow-hidden border aspect-square cursor-pointer transition-all ${
                      isActive
                        ? "border-cyan-400 shadow-md shadow-cyan-400/30 ring-1 ring-cyan-400 scale-[1.02]"
                        : "border-[#1E202E] hover:border-slate-600 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt={`Variação ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Barra de Ações Rápidas abaixo do Preview */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#1E202E]">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              title="Download em alta resolução"
              style={{ minHeight: "38px" }}
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Baixar</span>
            </button>

            <button
              type="button"
              onClick={handleVary}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              title="Gerar variação com mesma seed"
              style={{ minHeight: "38px" }}
            >
              <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
              <span>Variar</span>
            </button>

            <button
              type="button"
              onClick={handleUpscale}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              title="Restauração neural em 4K"
              style={{ minHeight: "38px" }}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Upscale 4K</span>
            </button>

            <button
              type="button"
              onClick={handleSendToFlow}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              title="Enviar para o VORIXA FLOW"
              style={{ minHeight: "38px" }}
            >
              <Boxes className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate">Usar no Canvas</span>
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            COLUNA DA DIREITA: HISTÓRICO & DICA DE PRO (3 COLUNAS)
            ------------------------------------------------------------------- */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-4">

          {/* Card Histórico */}
          <div className="bg-[#0D0E12] border border-[#1E202E] p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E202E] pb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Histórico
              </h2>
              <Link
                href="/dashboard/library"
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5"
              >
                <span>Ver todos</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#1E202E]">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveResultUrl(item.url);
                    setPrompt(item.prompt);
                  }}
                  className="group flex items-center justify-between p-2 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-violet-500/60 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="relative h-11 w-11 rounded-lg overflow-hidden border border-[#1E202E] flex-shrink-0">
                      <img src={item.url} alt={item.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="overflow-hidden text-left">
                      <h3 className="text-xs font-bold text-white truncate max-w-[130px]">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                        <span>{item.resolution}</span>
                        <span>•</span>
                        <span>{item.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrompt(item.prompt);
                      toast.info("Prompt recuperado do histórico!");
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-[#13141B] transition-colors"
                    title="Reutilizar prompt"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card Dica de Pro */}
          <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-[#0D0E12] to-[#070709] p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300 shadow-md">
                <Lightbulb className="w-4 h-4 text-violet-400" />
              </div>
              <span className="text-xs font-bold text-white font-heading">
                Dica de Pro
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Use o <span className="text-violet-400 font-bold">VORIXA FLOW</span> para criar variações, vídeos e até avatares a partir das suas imagens.
            </p>

            <Link
              href="/dashboard/flow"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
            >
              <span>Abrir no Flow</span>
              <ArrowLeft className="w-3 h-3 rotate-180" />
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. SEÇÃO INFERIOR: EXEMPLOS E INSPIRAÇÕES COM FILTROS DE TAGS
          ===================================================================== */}
      <div className="bg-[#0D0E12] border border-[#1E202E] p-4 sm:p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1E202E] pb-3">
          
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-heading">
              Exemplos e Inspirações
            </h2>
          </div>

          {/* Abas / Filtros de Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
            {["Em Alta", "Personagens", "Cenários", "Produtos", "Anime", "Arte", "Minimalista"].map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                      : "bg-[#070709] border border-[#1E202E] text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <Link
            href="/dashboard/library"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span>Ver mais</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid de Cards de Inspiração */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {filteredInspirations.map((item) => (
            <div
              key={item.id}
              onClick={() => handleApplyInspiration(item)}
              className="group relative rounded-xl overflow-hidden border border-[#1E202E] hover:border-cyan-400 aspect-[4/5] bg-black/60 cursor-pointer transition-all shadow-md hover:shadow-cyan-400/20"
            >
              <img
                src={item.thumb}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-2.5">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-500/30 text-violet-300 border border-violet-500/30 w-fit mb-1">
                  {item.tag}
                </span>
                <h3 className="text-xs font-bold text-white truncate leading-tight">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Tela Cheia */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-[#13141B] border border-[#1E202E] hover:border-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Baixar</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-xl bg-[#13141B] border border-[#1E202E] hover:border-slate-700 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <img
            src={activeResultUrl}
            alt="Tela Cheia"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

    </div>
  );
}
