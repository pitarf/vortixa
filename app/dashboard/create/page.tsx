"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Wand2,
  Image as ImageIcon,
  Video,
  Navigation,
  Activity,
  Maximize2,
  Minimize2,
  Coins,
  Play,
  Pause,
  Download,
  Boxes,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  Upload,
  X,
  Volume2,
  VolumeX,
  Copy,
  Pencil,
  Check,
  MoreVertical,
  MoreHorizontal,
  Share2,
  Clock,
  Flame,
  CheckCircle2,
  RotateCcw,
  Sliders,
  ExternalLink,
  Music,
  Sparkles,
} from "lucide-react";
import { AudioSourceSelector } from "@/components/ai/audio-source-selector";
import { FileUploader } from "@/components/ai/file-uploader";
import { toast } from "sonner";

// =========================================================================
// TIPOS E DEFINIÇÕES
// =========================================================================

type StudioTool = "image" | "video" | "lipsync" | "motion" | "upscale";

interface ModelOption {
  id: string;
  name: string;
  badge: string;
  cost: number;
  description: string;
  speed: string;
}

interface ToolDefinition {
  id: StudioTool;
  slug: string;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultCost: number;
  models: ModelOption[];
  description: string;
  color: string;
}

const TOOLS: Record<StudioTool, ToolDefinition> = {
  image: {
    id: "image",
    slug: "gerador-imagem",
    name: "Imagem",
    badge: "FLUX & Imagen",
    icon: ImageIcon,
    defaultCost: 1,
    description: "Crie fotos humanas hiper-realistas, produtos e artes com prompts simples.",
    color: "from-violet-600 via-indigo-600 to-cyan-500",
    models: [
      { id: "fal-ai/flux/schnell", name: "FLUX.1 Turbo", badge: "Super Rápido", cost: 1, description: "Geração ultra-rápida em segundos, ideal para testar ideias", speed: "~ 4s" },
      { id: "fal-ai/nano-banana-pro", name: "Google Imagen 3", badge: "Realismo Humano", cost: 3, description: "Especialista em pessoas reais, iluminação natural e textos nítidos", speed: "~ 14s" },
      { id: "fal-ai/recraft-v3", name: "Recraft V3 Design", badge: "Design & Logos", cost: 2, description: "Perfeito para tipografia legível, ilustrações vetoriais e marcas", speed: "~ 12s" },
      { id: "fal-ai/flux-pro/v1.1-ultra", name: "FLUX Pro Ultra", badge: "Máxima Definição", cost: 4, description: "Qualidade cinematográfica de estúdio e detalhes extremos", speed: "~ 20s" },
    ],
  },
  video: {
    id: "video",
    slug: "imagem-video",
    name: "Vídeo",
    badge: "Kling AI",
    icon: Video,
    defaultCost: 10,
    description: "Dê vida e movimento a fotos ou crie cenas de vídeo cinematográficas.",
    color: "from-cyan-500 to-blue-600",
    models: [
      { id: "fal-ai/kling-video/v2.1/pro/image-to-video", name: "Kling 2.1 Pro", badge: "Cinema Master", cost: 15, description: "Última geração Kling com máxima consistência temporal e física", speed: "~ 60s" },
      { id: "fal-ai/luma-dream-machine/ray-2", name: "Luma Ray 2", badge: "Física Realista", cost: 12, description: "Arquitetura Ray 2 de alta coerência dinâmica e física 3D", speed: "~ 45s" },
      { id: "fal-ai/wan-i2v", name: "Wan 2.1 High-Motion", badge: "Fluidez Extrema", cost: 10, description: "Movimentos corporais e estabilidade em 720p", speed: "~ 35s" },
      { id: "fal-ai/minimax/video-01-live", name: "Hailuo Minimax 01 Live", badge: "Expressões Vivas", cost: 12, description: "Expressões faciais vivas e ações contínuas", speed: "~ 40s" },
    ],
  },
  lipsync: {
    id: "lipsync",
    slug: "lip-sync",
    name: "Avatar",
    badge: "LivePortrait",
    icon: Navigation,
    defaultCost: 8,
    description: "Sincronize perfeitamente lábios e expressões faciais com faixas de áudio.",
    color: "from-pink-500 to-rose-600",
    models: [
      { id: "fal-ai/latentsync", name: "LatentSync Pro", badge: "Alta Fidelidade", cost: 8, description: "Sincronia labial e fonética ultra-realista em Português e Inglês", speed: "~ 30s" },
      { id: "fal-ai/sync-lipsync", name: "Sync Audio LipSync", badge: "Expressivo", cost: 8, description: "Movimento labial natural com preservação de expressões faciais", speed: "~ 25s" },
    ],
  },
  motion: {
    id: "motion",
    slug: "motion-control",
    name: "Motion",
    badge: "Pose Transfer",
    icon: Activity,
    defaultCost: 15,
    description: "Transfira movimentação de um vídeo de referência para qualquer personagem.",
    color: "from-fuchsia-500 to-purple-600",
    models: [
      { id: "fal-ai/kling/motion-control", name: "Kling Motion", badge: "Pose Transfer", cost: 15, description: "Transferência física precisa de movimento", speed: "~ 60s" },
    ],
  },
  upscale: {
    id: "upscale",
    slug: "upscale",
    name: "Upscale",
    badge: "Creative 4K",
    icon: Layers,
    defaultCost: 5,
    description: "Melhore nitidez, remova ruído e eleve mídias até resolução 4K Ultra HD.",
    color: "from-amber-500 to-orange-600",
    models: [
      { id: "fal-ai/creative-upscaler", name: "Creative Upscaler 4K", badge: "Ultra-Res", cost: 5, description: "Restauração e texturização em 4K", speed: "~ 20s" },
    ],
  },
};

const STYLE_PRESETS = [
  {
    id: "cinematic",
    name: "Cinemático",
    thumb: "/media/landing/gallery/hypercar_cyberpunk.jpg",
    description: "Iluminação dramática chiaroscuro, lente anamórfica 2.39:1 e grading Hollywoodiano.",
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
  { id: "square_hd", label: "1:1", name: "Quadrado", iconWidth: "w-4 h-4", defaultRes: "1024 x 1024" },
  { id: "landscape_16_9", label: "16:9", name: "Cinema", iconWidth: "w-6 h-3.5", defaultRes: "1792 x 1024" },
  { id: "portrait_16_9", label: "9:16", name: "Reels", iconWidth: "w-3.5 h-6", defaultRes: "1024 x 1792" },
  { id: "landscape_4_3", label: "4:3", name: "Paisagem", iconWidth: "w-5 h-4", defaultRes: "1152 x 864" },
  { id: "landscape_3_2", label: "3:2", name: "Fotografia", iconWidth: "w-6 h-4", defaultRes: "1216 x 832" },
];

const RESOLUTION_OPTIONS: Record<string, string[]> = {
  square_hd: ["1024 x 1024", "768 x 768", "1536 x 1536"],
  landscape_16_9: ["1792 x 1024", "1344 x 768", "1920 x 1080"],
  portrait_16_9: ["1024 x 1792", "768 x 1344", "1080 x 1920"],
  landscape_4_3: ["1152 x 864", "1024 x 768", "1440 x 1080"],
  landscape_3_2: ["1216 x 832", "1536 x 1024"],
};

const QUALITY_MODES = [
  { id: "fast", name: "Rápido", cost: 1, modelId: "fal-ai/flux/schnell", badge: "1 crédito", steps: 4 },
  { id: "standard", name: "Padrão", cost: 2, modelId: "fal-ai/recraft-v3", badge: "2 créditos", steps: 20 },
  { id: "hd", name: "Alta Definição", cost: 4, modelId: "fal-ai/flux-pro/v1.1-ultra", badge: "4 créditos", steps: 28 },
  { id: "ultra", name: "Ultra", cost: 8, modelId: "fal-ai/flux-pro/v1.1-ultra", badge: "8 créditos", steps: 35 },
];

const INSPIRATIONS = [
  {
    id: "insp-1",
    title: "Cyberpunk Hypercar Nocturne",
    thumb: "/media/landing/gallery/hypercar_cyberpunk.jpg",
    videoUrl: "/media/landing/videos/cinematic_hypercar.mp4",
    badge: "0:05",
    ratio: "16:9",
    tool: "video" as StudioTool,
    model: "Kling AI 1.5",
    styleId: "cinematic",
    prompt: "Hypercar futurista com neon ciano e roxo em alta velocidade numa rodovia molhada de Neo-Tóquio, reflexos volumétricos, chuva fina, câmera tracking em baixa altitude.",
  },
  {
    id: "insp-2",
    title: "Editorial Haute Couture Cyber",
    thumb: "/media/landing/gallery/editorial_fashion.jpg",
    imageUrl: "/media/landing/gallery/editorial_fashion.jpg",
    badge: "8K",
    ratio: "9:16",
    tool: "image" as StudioTool,
    model: "FLUX.1 Pro",
    styleId: "photorealistic",
    prompt: "Retrato editorial de alta-costura, modelo com detalhes holográficos na pele de titânio, iluminação de estúdio suave, textura de pele natural ultra-realista, lente 85mm f/1.4.",
  },
  {
    id: "insp-3",
    title: "Luxury Perfume Liquid Gold",
    thumb: "/media/landing/gallery/perfume_commercial.jpg",
    videoUrl: "/media/landing/videos/commercial_perfume.mp4",
    badge: "0:05",
    ratio: "1:1",
    tool: "video" as StudioTool,
    model: "Kling 1.5",
    styleId: "octane3d",
    prompt: "Frasco de perfume de luxo de vidro lapidado emergindo de ondas douradas líquidas, iluminação softbox, rotação orbital 360 suave, partículas em suspensão.",
  },
  {
    id: "insp-4",
    title: "Street Dancer Cyber Hip-Hop",
    thumb: "/media/landing/gallery/street_dancer.jpg",
    videoUrl: "/media/landing/videos/motion_dancer.mp4",
    badge: "0:10",
    ratio: "9:16",
    tool: "motion" as StudioTool,
    model: "Motion Control",
    styleId: "cyberpunk",
    prompt: "Dançarino urbano com jaqueta cibernética reagindo a batidas graves sob iluminação néon pulsante de beco urbano molhado, câmera lenta a 60fps.",
  },
  {
    id: "insp-5",
    title: "AI Presenter Hyper-Real",
    thumb: "/media/landing/gallery/avatar_presenter.jpg",
    videoUrl: "/media/landing/videos/lipsync_avatar.mp4",
    badge: "0:05",
    ratio: "16:9",
    tool: "lipsync" as StudioTool,
    model: "LivePortrait",
    styleId: "cinematic",
    prompt: "Apresentadora virtual hiper-realista em estúdio de tecnologia futurista falando com entusiasmo e microexpressões faciais naturais, profundidade de campo sutil.",
  },
];

// =========================================================================
// COMPONENTE PRINCIPAL
// =========================================================================

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
  const [selectedStyle, setSelectedStyle] = useState<string>("cinematic");
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>("");
  const [isUploadingRef, setIsUploadingRef] = useState(false);
  const refFileInputRef = useRef<HTMLInputElement>(null);

  // Configurações Avançadas
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [inferenceSteps, setInferenceSteps] = useState(4);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [seed, setSeed] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState("blurry, low quality, deformed anatomy, bad hands, extra limbs, watermark, artifacts, signature");

  // Parâmetros de Vídeo / Avatar / Motion
  const [videoMode, setVideoMode] = useState<"text" | "image">("image");
  const [duration, setDuration] = useState("5");
  const [cameraMotion, setCameraMotion] = useState("static");
  const [enableTalkingVideo, setEnableTalkingVideo] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("pt-BR-FranciscaNeural");
  const [sourceVideoUrl, setSourceVideoUrl] = useState("");
  const [sourceAudioUrl, setSourceAudioUrl] = useState("");
  const [characterImageUrl, setCharacterImageUrl] = useState("");
  const [referenceVideoUrl, setReferenceVideoUrl] = useState("");

  // Estado de Processamento e Geração
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [stepText, setStepText] = useState("");
  const [activeJob, setActiveJob] = useState<any>(null);
  const [resultMediaUrl, setResultMediaUrl] = useState<string | null>("/media/landing/videos/cinematic_hypercar.mp4");
  const [resultMediaType, setResultMediaType] = useState<"image" | "video">("video");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOpeningInFlow, setIsOpeningInFlow] = useState(false);

  // Player de Vídeo Customizado
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSec, setDurationSec] = useState(5);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewTab, setPreviewTab] = useState<"result" | "compare">("result");

  // Histórico de Criações
  const [historyItems, setHistoryItems] = useState<any[]>([]);
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
          return;
        }
      }
      // Fallback rico e visual para o histórico caso o banco esteja novo
      setHistoryItems([
        {
          id: "hist-1",
          url: "/media/landing/videos/cinematic_hypercar.mp4",
          mediaType: "video",
          modelName: "FLUX.1 Schnell",
          prompt: "Hypercar futurista com neon ciano e roxo em alta velocidade numa rodovia de Neo-Tóquio",
          createdAt: new Date().toISOString(),
          timeAgo: "Agora",
        },
        {
          id: "hist-2",
          url: "/media/landing/gallery/editorial_fashion.jpg",
          mediaType: "image",
          modelName: "FLUX.1 Pro",
          prompt: "Retrato editorial com reflexos holográficos em luz de estúdio suave",
          createdAt: new Date(Date.now() - 120000).toISOString(),
          timeAgo: "2m atrás",
        },
        {
          id: "hist-3",
          url: "/media/landing/videos/commercial_perfume.mp4",
          mediaType: "video",
          modelName: "Kling AI",
          prompt: "Frasco de perfume luxo emergindo de líquido dourado",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          timeAgo: "1h atrás",
        },
        {
          id: "hist-4",
          url: "/media/landing/videos/motion_dancer.mp4",
          mediaType: "video",
          modelName: "Motion Control",
          prompt: "Transferência de pose para dançarino urbano sob neon",
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          timeAgo: "3h atrás",
        },
        {
          id: "hist-5",
          url: "/media/landing/videos/lipsync_avatar.mp4",
          mediaType: "video",
          modelName: "LivePortrait",
          prompt: "Apresentadora virtual hiper-realista com sincronia de fala",
          createdAt: new Date(Date.now() - 18000000).toISOString(),
          timeAgo: "5h atrás",
        },
      ]);
    } catch (e) {
      console.warn("Erro ao buscar histórico:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchHistory();
  }, []);

  // Sincroniza modelo padrão ao alternar ferramenta
  useEffect(() => {
    const currentToolDef = TOOLS[activeTool];
    if (currentToolDef.models.length > 0) {
      setSelectedModelId(currentToolDef.models[0].id);
    }
  }, [activeTool]);

  // Video Controls Handlers
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

  // Aplica Presets de Estilo com Toggle e Parâmetros Ideais
  const handleSelectStyle = (styleId: string) => {
    // Se clicar no mesmo estilo ativo, desmarca
    if (selectedStyle === styleId) {
      setSelectedStyle("");
      toast.info("Estilo padrão restaurado.");
      return;
    }

    setSelectedStyle(styleId);
    const preset = STYLE_PRESETS.find((p) => p.id === styleId);
    if (!preset) return;

    // Ajusta parâmetros de inferência recomendados para o estilo
    if (preset.recommendedSteps) {
      setInferenceSteps(preset.recommendedSteps);
    }
    if (preset.recommendedCfg) {
      setGuidanceScale(preset.recommendedCfg);
    }

    toast.info(`Estilo "${preset.name}" ativado com parâmetros otimizados.`);
  };

  // Otimização de Prompt com IA considerando o Estilo Visual ativo
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
      toast.success("Imagem de referência anexada ao Studio!");
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
    const cost = selectedModel.cost + (hasTalkingVideo ? 9 : 0);

    if (creditMode !== "UNLIMITED" && balance < cost) {
      toast.error(`Saldo insuficiente (${balance} créditos disponíveis. Custo: ${cost}).`);
      setErrorMsg("Você não possui saldo suficiente para esta operação.");
      return;
    }

    if (activeTool === "image" && !prompt.trim()) {
      toast.error("Informe a descrição textual para gerar a imagem.");
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
      setStepText("Conectando ao cluster de IA");

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

            // Adiciona ao topo do histórico local
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
  const handleSelectInspiration = (insp: (typeof INSPIRATIONS)[0]) => {
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
  const currentModelDef = currentToolDef.models.find((m) => m.id === selectedModelId) || currentToolDef.models[0];

  return (
    <div className="max-w-[1700px] mx-auto space-y-6 pb-20 text-slate-100 antialiased font-sans">
      {/* =========================================================================
          1. HEADER DO STUDIO: Título, Badge v2.0, Controles de Projeto e Flow
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E202E] pb-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 flex-shrink-0">
            <Wand2 className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
                Studio CREATE
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-violet-950/60 border border-violet-500/30 text-violet-400 font-bold uppercase tracking-wider">
                v2.0 Turbo
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Do conceito ao resultado. Crie imagens, vídeos e avatares com IA em um estúdio integrado.
            </p>
          </div>
        </div>

        {/* Controles de Projeto e Ações Rápidas */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Nome do Projeto Editável */}
          <div className="flex items-center bg-[#0D0E12] border border-[#1E202E] rounded-xl px-3 py-1.5 focus-within:border-violet-500 transition-all">
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempProjectName}
                  onChange={(e) => setTempProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setProjectName(tempProjectName || "Projeto sem nome");
                      setIsEditingName(false);
                      toast.success("Nome atualizado!");
                    }
                  }}
                  autoFocus
                  className="bg-transparent text-xs text-white outline-none w-36 font-semibold"
                />
                <button
                  onClick={() => {
                    setProjectName(tempProjectName || "Projeto sem nome");
                    setIsEditingName(false);
                    toast.success("Nome atualizado!");
                  }}
                  className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setTempProjectName(projectName);
                  setIsEditingName(true);
                }}
                className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer group"
              >
                <span className="truncate max-w-[140px]">{projectName}</span>
                <Pencil className="h-3 w-3 text-slate-500 group-hover:text-violet-400 transition-colors" />
              </button>
            )}
          </div>

          {/* Botão Salvar */}
          <button
            onClick={handleSaveProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D0E12] hover:bg-[#13141B] border border-[#1E202E] text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <span>Salvar</span>
          </button>

          {/* Menu Reticências */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl bg-[#0D0E12] hover:bg-[#13141B] border border-[#1E202E] text-slate-400 hover:text-white transition-all cursor-pointer"
              style={{ minHeight: "44px", minWidth: "44px" }}
              aria-label="Mais opções"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0D0E12] border border-[#1E202E] shadow-2xl p-1.5 z-50 text-xs space-y-1">
                <button
                  onClick={() => {
                    setPrompt("");
                    setReferenceImageUrl("");
                    setIsMenuOpen(false);
                    toast.info("Campos resetados.");
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#13141B] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Limpar todos os campos
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(prompt);
                    setIsMenuOpen(false);
                    toast.success("Prompt copiado para a área de transferência!");
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#13141B] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Copiar prompt atual
                </button>
                <button
                  onClick={() => {
                    router.push("/dashboard/library");
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#13141B] text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Abrir Galeria & Histórico
                </button>
              </div>
            )}
          </div>

          {/* Botão Enviar para o Flow */}
          <button
            onClick={handleOpenInFlow}
            disabled={isOpeningInFlow}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 active:scale-95 text-white text-xs font-bold shadow-lg shadow-violet-600/25 transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            <Boxes className="h-4 w-4" />
            <span>{isOpeningInFlow ? "Criando Flow..." : "Enviar para o Flow"}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. STEPPER HORIZONTAL: 1: Tipo de Mídia > 2: Prompt > 3: Parâmetros > 4: Gerar
         ========================================================================= */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center justify-between min-w-[700px] gap-2 p-1.5 bg-[#0D0E12] border border-[#1E202E] rounded-2xl">
          {[
            { step: 1, title: "Tipo de Mídia", subtitle: "Selecione o que criar" },
            { step: 2, title: "Prompt & Referências", subtitle: "Descreva sua cena" },
            { step: 3, title: "Parâmetros", subtitle: "Ajuste o estilo" },
            { step: 4, title: "Gerar & Refinar", subtitle: "Veja o resultado" },
          ].map((item, idx) => {
            const isActive = activeStep === item.step;
            return (
              <React.Fragment key={item.step}>
                <button
                  onClick={() => setActiveStep(item.step)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all cursor-pointer flex-1 ${
                    isActive
                      ? "bg-cyan-950/30 border border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "hover:bg-[#13141B] opacity-75 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-black font-mono transition-all ${
                      isActive
                        ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30"
                        : "bg-[#13141B] border border-[#1E202E] text-slate-400"
                    }`}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div className={`text-xs font-bold leading-tight ${isActive ? "text-cyan-300" : "text-slate-200"}`}>
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">{item.subtitle}</div>
                  </div>
                </button>

                {idx < 3 && <ChevronRight className="h-4 w-4 text-slate-700 flex-shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          3. GRID PRINCIPAL: Coluna de Criação + Preview/Player Central + Histórico
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =======================================================================
            COLUNA DA ESQUERDA: PARÂMETROS & CONTROLES (lg:col-span-4)
           ======================================================================= */}
        <div className="lg:col-span-4 space-y-5 bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-4 sm:p-5">
          {/* Seção Tipo de Mídia */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Tipo de Mídia
              </label>
              <span className="text-[10px] font-mono text-slate-500">Etapa 1 de 4</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-[#070709] rounded-2xl border border-[#1E202E]">
              {(["image", "video", "lipsync", "motion"] as StudioTool[]).map((key) => {
                const t = TOOLS[key];
                const isSelected = activeTool === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setActiveTool(key);
                      setActiveStep(1);
                    }}
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#13141B]"
                    }`}
                    style={{ minHeight: "44px" }}
                  >
                    <t.icon className="h-4 w-4 mb-1" />
                    <span className="text-[10px] truncate max-w-full">{t.name}</span>
                  </button>
                );
              })}

              {/* Botão de expansão [>] */}
              <button
                type="button"
                onClick={() => setActiveTool("upscale")}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  activeTool === "upscale"
                    ? "bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#13141B]"
                }`}
                style={{ minHeight: "44px" }}
                title="Ferramentas Extras (Upscale 4K)"
              >
                <Layers className="h-4 w-4 mb-1" />
                <span className="text-[10px]">Mais &gt;</span>
              </button>
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
                  {activeTool === "image"
                    ? "Escolha o motor ideal para o seu tipo de imagem:"
                    : "Selecione o motor de inferência:"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-violet-400 font-semibold">
                {currentModelDef.cost} crédito{currentModelDef.cost > 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentToolDef.models.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => {
                      setSelectedModelId(model.id);
                      if (activeTool === "image") {
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

          {/* Seção Qualidade / Modo (Paridade com a ferramenta de imagem) */}
          {activeTool === "image" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Qualidade / Modo
                </label>
                <span className="text-[10px] text-slate-400">Ajuste de velocidade e fidelidade</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUALITY_MODES.map((mode) => {
                  const isSelected = qualityMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        setQualityMode(mode.id);
                        setInferenceSteps(mode.steps);
                        setSelectedModelId(mode.modelId);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#13141B] border-violet-500 shadow-md shadow-violet-500/20 ring-1 ring-violet-500/50"
                          : "bg-[#070709] border-[#1E202E] hover:border-slate-700 opacity-85 hover:opacity-100"
                      }`}
                      style={{ minHeight: "58px" }}
                    >
                      <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-300"}`}>
                        {mode.name}
                      </span>
                      <span className="text-[10px] font-mono text-violet-400 font-semibold">
                        {mode.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Seção Prompt de Criação */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Prompt de Criação
                </label>
                {selectedStyle && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <span>Estilo: {STYLE_PRESETS.find((s) => s.id === selectedStyle)?.name || selectedStyle}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedStyle("")}
                      className="hover:text-white transition-colors cursor-pointer"
                      title="Remover estilo visual"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleOptimizePrompt}
                disabled={isOptimizing || !prompt.trim()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white shadow-md shadow-violet-600/20 transition-all active:scale-95 cursor-pointer"
                style={{ minHeight: "34px" }}
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
                placeholder="Ex: Close cinematográfico de um samurai futurista com armadura cibernética de titânio e luzes néon azuis sob chuva, iluminação volumétrica, fotorrealista..."
                className="w-full bg-transparent p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
                maxLength={1500}
              />

              {/* Preview de imagem de referência, se carregada */}
              {referenceImageUrl && (
                <div className="px-3 pb-2 flex items-center gap-2">
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-violet-500/50">
                    <img src={referenceImageUrl} alt="Referência" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setReferenceImageUrl("")}
                      className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Imagem de referência ativa</span>
                </div>
              )}

              {/* Rodapé da Textarea com Ícones Rápidos */}
              <div className="flex items-center justify-between border-t border-[#1E202E] px-3 py-2 text-slate-400">
                <div className="flex items-center gap-2">
                  {/* Upload de Referência */}
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
                    className="p-1.5 rounded-lg hover:bg-[#13141B] hover:text-violet-400 transition-colors cursor-pointer"
                    title="Anexar imagem de referência"
                    style={{ minHeight: "36px", minWidth: "36px" }}
                  >
                    {isUploadingRef ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-violet-400" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {prompt && (
                    <button
                      type="button"
                      onClick={() => setPrompt("")}
                      className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                  <span className="text-[10px] font-mono text-slate-500">
                    {prompt.length}/1500
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Estilo Visual com Thumbnails Reais */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Estilo Visual
              </label>
              {selectedStyle && (
                <span className="text-[11px] text-cyan-400 font-mono">
                  Ativo ({STYLE_PRESETS.find((s) => s.id === selectedStyle)?.name})
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {STYLE_PRESETS.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => handleSelectStyle(style.id)}
                    className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col items-center justify-end p-1.5 aspect-square ${
                      isSelected
                        ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400"
                        : "border-[#1E202E] hover:border-slate-600 opacity-80 hover:opacity-100"
                    }`}
                    style={{ minHeight: "56px" }}
                    title={style.description}
                  >
                    <img
                      src={style.thumb}
                      alt={style.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <span className="relative z-10 text-[9px] font-bold text-white text-center leading-tight truncate w-full">
                      {style.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedStyle && (
              <p className="text-[11px] text-slate-400 leading-snug bg-[#070709] border border-[#1E202E] rounded-xl px-2.5 py-1.5">
                <span className="text-cyan-400 font-semibold font-mono">Diretiva: </span>
                {STYLE_PRESETS.find((s) => s.id === selectedStyle)?.description}
              </p>
            )}
          </div>

          {/* Seção Proporção de Tela e Resolução */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Proporção da Imagem
              </label>
              {activeTool === "image" && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Tamanho:</span>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="bg-[#070709] border border-[#1E202E] rounded-lg px-2 py-0.5 text-[11px] font-mono text-cyan-400 outline-none cursor-pointer"
                  >
                    {(RESOLUTION_OPTIONS[imageSize] || [resolution]).map((res) => (
                      <option key={res} value={res} className="bg-[#0D0E12] text-white">
                        {res}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {ASPECT_RATIOS.map((ratio) => {
                const isSelected = imageSize === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => {
                      setImageSize(ratio.id);
                      if (RESOLUTION_OPTIONS[ratio.id]?.[0]) {
                        setResolution(RESOLUTION_OPTIONS[ratio.id][0]);
                      }
                    }}
                    className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#13141B] border-violet-500 text-white shadow-md shadow-violet-500/20"
                        : "bg-[#070709] border-[#1E202E] text-slate-400 hover:text-slate-200"
                    }`}
                    style={{ minHeight: "52px" }}
                  >
                    <div
                      className={`border border-current rounded-sm ${ratio.iconWidth} ${
                        isSelected ? "border-violet-400 bg-violet-500/20" : "border-slate-500"
                      }`}
                    />
                    <div className="text-[10px] font-bold font-mono">{ratio.label}</div>
                    <span className="text-[8px] text-slate-500 font-sans truncate">{ratio.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seção de Controles Específicos para Vídeo */}
          {activeTool === "video" && (
            <div className="border border-[#1E202E] rounded-2xl p-4 bg-[#070709] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold">Duração do Vídeo</span>
                <div className="flex gap-2">
                  {["5", "10"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`px-3 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                        duration === d
                          ? "bg-cyan-600/30 border border-cyan-500 text-cyan-300"
                          : "bg-[#13141B] text-slate-400 hover:text-white"
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-300 font-bold block">Movimento de Câmera</span>
                <select
                  value={cameraMotion}
                  onChange={(e) => setCameraMotion(e.target.value)}
                  className="w-full bg-[#13141B] border border-[#1E202E] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="static">Estático / Suave e Natural</option>
                  <option value="zoom_in">Aproximação (Zoom In)</option>
                  <option value="pan_left">Panorâmica para a Esquerda</option>
                  <option value="pan_right">Panorâmica para a Direita</option>
                  <option value="orbital">Giro Orbital 360</option>
                </select>
              </div>

              {/* One-Shot Talking Video Toggle */}
              <div className="pt-3 border-t border-[#1E202E] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs font-bold text-white">Voz & Fala do Personagem</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableTalkingVideo}
                      onChange={(e) => setEnableTalkingVideo(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-[#1E202E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-cyan-500"></div>
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Gera a fala neural e sincroniza os lábios automaticamente (+9 cr).
                </p>

                {enableTalkingVideo && (
                  <div className="space-y-2 pt-1 animate-in fade-in-50 duration-200">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Voz (PT-BR)</span>
                      <select
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="w-full bg-[#13141B] border border-[#1E202E] rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-violet-500 cursor-pointer"
                      >
                        <option value="pt-BR-FranciscaNeural">Francisca (Feminina, Natural)</option>
                        <option value="pt-BR-AntonioNeural">Antônio (Masculino, Confiante)</option>
                        <option value="pt-BR-ThalitaMultilingualNeural">Thalita (Feminina, Jovem)</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1">Texto da Fala</span>
                      <textarea
                        value={speechText}
                        onChange={(e) => setSpeechText(e.target.value)}
                        rows={2}
                        placeholder="O que o personagem de vídeo deve falar em português..."
                        className="w-full bg-[#13141B] border border-[#1E202E] rounded-xl p-2 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 resize-none leading-tight"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seção de Controles Específicos para LipSync / Avatar */}
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
                    currentModelDef.cost + (activeTool === "video" && enableTalkingVideo && speechText.trim() ? 9 : 0)
                  } créditos)
                </span>
              </>
            )}
          </button>
        </div>

        {/* =======================================================================
            COLUNA CENTRAL: PREVIEW PRINCIPAL, CUSTOM PLAYER & INSPIRAÇÕES (lg:col-span-5)
           ======================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header do Player: Abas Resultado / Comparar + Fullscreen */}
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E202E] pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewTab("result")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    previewTab === "result"
                      ? "bg-violet-600/20 text-violet-300 border border-violet-500/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Resultado
                </button>
                <button
                  onClick={() => setPreviewTab("compare")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    previewTab === "compare"
                      ? "bg-violet-600/20 text-violet-300 border border-violet-500/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Comparar
                </button>
              </div>

              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Visualizar em Tela Cheia"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tela Cheia</span>
              </button>
            </div>

            {/* Visualizador / Player Central */}
            <div className="relative rounded-2xl overflow-hidden bg-black border border-[#1E202E] aspect-video flex items-center justify-center group">
              {isGenerating ? (
                <div className="p-6 text-center space-y-4 max-w-sm">
                  <div className="relative h-20 w-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 animate-ping" />
                    <div className="h-20 w-20 rounded-full border-4 border-violet-600 border-t-cyan-400 animate-spin" />
                    <Wand2 className="h-7 w-7 text-cyan-300 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white tracking-wide">{stepText}</h3>
                    <p className="text-xs text-slate-400 font-mono">Motor: {currentModelDef.name}</p>
                  </div>
                </div>
              ) : previewTab === "compare" && referenceImageUrl ? (
                <div className="grid grid-cols-2 w-full h-full">
                  <div className="relative h-full border-r border-[#1E202E]">
                    <img src={referenceImageUrl} alt="Original" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300">
                      Referência
                    </span>
                  </div>
                  <div className="relative h-full">
                    {resultMediaType === "video" && resultMediaUrl ? (
                      <video src={resultMediaUrl} autoPlay loop muted className="w-full h-full object-cover" />
                    ) : (
                      <img src={resultMediaUrl || referenceImageUrl} alt="Gerado" className="w-full h-full object-cover" />
                    )}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-emerald-400">
                      Gerado
                    </span>
                  </div>
                </div>
              ) : resultMediaUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {resultMediaType === "video" ? (
                    <>
                      <video
                        ref={videoRef}
                        src={resultMediaUrl}
                        loop
                        playsInline
                        onTimeUpdate={handleTimeUpdate}
                        className="w-full h-full object-contain"
                      />

                      {/* Botão Play Grande Central */}
                      {!isPlaying && (
                        <button
                          type="button"
                          onClick={handleTogglePlay}
                          className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-20"
                        >
                          <Play className="h-7 w-7 fill-white ml-1" />
                        </button>
                      )}

                      {/* Barra de Controles Inferior */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        {/* Timeline */}
                        <input
                          type="range"
                          min={0}
                          max={durationSec || 5}
                          step={0.1}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1 accent-cyan-400 bg-white/20 rounded-lg cursor-pointer"
                        />

                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <div className="flex items-center gap-3">
                            <button onClick={handleTogglePlay} className="hover:text-white cursor-pointer">
                              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                            </button>
                            <span className="font-mono text-[11px]">
                              {formatSeconds(currentTime)} / {formatSeconds(durationSec)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                if (videoRef.current) {
                                  videoRef.current.muted = !isMuted;
                                  setIsMuted(!isMuted);
                                }
                              }}
                              className="hover:text-white cursor-pointer"
                            >
                              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </button>
                            <button onClick={() => setIsFullscreen(true)} className="hover:text-white cursor-pointer">
                              <Maximize2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <img src={resultMediaUrl} alt="Obra de IA" className="w-full h-full object-contain" />
                  )}
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-[#13141B] border border-[#1E202E] flex items-center justify-center text-slate-400 mx-auto">
                    <currentToolDef.icon className="h-6 w-6" />
                  </div>
                  <div className="text-xs text-slate-400 max-w-xs">
                    Configure os parâmetros à esquerda e clique em <strong>Gerar</strong> para iniciar a inferência.
                  </div>
                </div>
              )}
            </div>

            {/* Barra de Ações Rápidas Abaixo do Player */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <a
                href={resultMediaUrl || "#"}
                download="vorixa-studio-render"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-slate-200 transition-all cursor-pointer"
                style={{ minHeight: "44px" }}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Baixar</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setSeed(Math.floor(Math.random() * 9999999).toString());
                  handleGenerate();
                }}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-slate-200 transition-all cursor-pointer"
                style={{ minHeight: "44px" }}
              >
                <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
                <span>Variar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTool("upscale");
                  toast.info("Ferramenta de Upscale 4K selecionada!");
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-amber-300 transition-all cursor-pointer"
                style={{ minHeight: "44px" }}
              >
                <Layers className="h-3.5 w-3.5 text-amber-400" />
                <span>Upscale 4K</span>
              </button>

              <button
                type="button"
                onClick={handleOpenInFlow}
                disabled={isOpeningInFlow}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-xs font-bold text-violet-300 transition-all cursor-pointer"
                style={{ minHeight: "44px" }}
              >
                <Boxes className="h-3.5 w-3.5 text-violet-400" />
                <span>Flow </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (resultMediaUrl) {
                    setReferenceImageUrl(resultMediaUrl);
                    toast.success("Mídia definida como referência de entrada!");
                  }
                }}
                className="p-2.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Usar como referência"
                style={{ minHeight: "44px", minWidth: "44px" }}
              >
                <ImageIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* =====================================================================
              SEÇÃO INFERIOR: 'Inspirações para você' (Carrossel / 5 Cards)
             ===================================================================== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-violet-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                  Inspirações para você
                </h3>
              </div>
              <button
                onClick={() => toast.info("Carrossel atualizado com novos conceitos!")}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Ver mais &gt;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {INSPIRATIONS.map((insp) => (
                <button
                  key={insp.id}
                  type="button"
                  onClick={() => handleSelectInspiration(insp)}
                  className="group relative rounded-2xl overflow-hidden border border-[#1E202E] hover:border-violet-500/70 transition-all duration-300 text-left aspect-[4/5] bg-black cursor-pointer"
                >
                  <img
                    src={insp.thumb}
                    alt={insp.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Badge de Duração / Resolução */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold text-slate-300">
                    {insp.badge}
                  </div>

                  {/* Botão Play Sobreposto */}
                  <div className="absolute inset-0 m-auto h-9 w-9 rounded-full bg-violet-600/80 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg">
                    <Play className="h-4 w-4 fill-white ml-0.5" />
                  </div>

                  {/* Título e Modelo */}
                  <div className="absolute bottom-2 inset-x-2">
                    <div className="text-[11px] font-bold text-white leading-snug line-clamp-1">
                      {insp.title}
                    </div>
                    <div className="text-[9px] font-mono text-cyan-400">{insp.model}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =======================================================================
            COLUNA DA DIREITA: HISTÓRICO LATERAL (lg:col-span-3)
           ======================================================================= */}
        <div className="lg:col-span-3 space-y-4 bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-4">
          <div className="flex items-center justify-between border-b border-[#1E202E] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                Histórico
              </h2>
            </div>
            <button
              onClick={() => router.push("/dashboard/library")}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Ver todos
            </button>
          </div>

          {/* Lista de Gerações Anteriores */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {historyItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setResultMediaUrl(item.url);
                  setResultMediaType(item.mediaType === "video" ? "video" : "image");
                  if (item.prompt) setPrompt(item.prompt);
                  toast.success("Carregado no player!");
                }}
                className="group p-2 rounded-2xl bg-[#070709] border border-[#1E202E] hover:border-violet-500/50 transition-all cursor-pointer flex items-center gap-3"
              >
                {/* Thumbnail */}
                <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-[#1E202E]">
                  {item.mediaType === "video" ? (
                    <video src={item.url} className="h-full w-full object-cover" />
                  ) : (
                    <img src={item.url} alt="Histórico" className="h-full w-full object-cover" />
                  )}
                  {item.mediaType === "video" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="h-3.5 w-3.5 text-white fill-white" />
                    </div>
                  )}
                </div>

                {/* Detalhes do Item */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="text-violet-400 font-semibold">{item.modelName}</span>
                    <span>{item.timeAgo || "recente"}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                    {item.prompt || "Criação de estúdio"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(item.prompt || "");
                    toast.success("Prompt copiado!");
                  }}
                  className="text-slate-500 hover:text-white p-1"
                  title="Copiar prompt"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. BARRA DE RODAPÉ: Dica de Pro, Créditos com Gráfico Circular e Métricas
         ========================================================================= */}
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

      {/* =========================================================================
          5. MODAL EM TELA CHEIA (FULLSCREEN VIEWER)
         ========================================================================= */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{projectName}</span>
              <span className="text-xs font-mono text-slate-400">({resultMediaType})</span>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 rounded-2xl bg-[#13141B] hover:bg-[#1E202E] text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 max-h-[85vh]">
            {resultMediaType === "video" && resultMediaUrl ? (
              <video src={resultMediaUrl} controls autoPlay loop className="max-w-full max-h-full rounded-2xl" />
            ) : (
              <img src={resultMediaUrl || ""} alt="Full render" className="max-w-full max-h-full object-contain rounded-2xl" />
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <a
              href={resultMediaUrl || "#"}
              download="vorixa-asset"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold cursor-pointer"
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