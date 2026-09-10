import React from "react";
import {
  Image as ImageIcon,
  Video,
  Navigation,
  Activity,
  Layers,
} from "lucide-react";

export type StudioTool = "image" | "video" | "lipsync" | "motion" | "upscale";

export interface ModelOption {
  id: string;
  name: string;
  badge: string;
  cost: number;
  description: string;
  speed: string;
  requiresReferenceImage?: boolean;
}

export interface ToolDefinition {
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

export const TOOLS: Record<StudioTool, ToolDefinition> = {
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
      { id: "fal-ai/nano-banana-pro", name: "Nano Banana Pro (Google)", badge: "Fotorrealismo Humano 👑", cost: 3, description: "Modelo oficial Google Imagen 3 / Gemini 3 Pro. Anatomia humana e edição com foto", speed: "~ 12s" },
      { id: "fal-ai/flux-pulid", name: "FLUX PuLID (Mesmo Rosto)", badge: "Rosto Idêntico 👤", cost: 4, description: "Fixação absoluta de identidade. Preserva o mesmo rosto e barba da foto enviada", speed: "~ 15s", requiresReferenceImage: true },
      { id: "fal-ai/flux/schnell", name: "FLUX.1 Turbo", badge: "Super Rápido", cost: 1, description: "Geração ultra-rápida em 4 segundos da Black Forest Labs para testar conceitos", speed: "~ 4s" },
      { id: "fal-ai/recraft-v3", name: "Recraft V3 Design", badge: "Design & Logos", cost: 2, description: "Perfeito para tipografia legível, ilustrações vetoriais e marcas", speed: "~ 10s" },
      { id: "fal-ai/flux-pro/v1.1-ultra", name: "FLUX Pro Ultra", badge: "Máxima Resolução", cost: 4, description: "Qualidade cinematográfica de estúdio da Black Forest Labs em altíssima definição", speed: "~ 20s" },
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
      { id: "fal-ai/bytedance/seedance-2.5", name: "ByteDance Seedance 2.5", badge: "Cinema Master 👑", cost: 25, description: "Topo de linha mundial: até 30s de vídeo contínuo, som nativo e física hiper-realista", speed: "~ 55s" },
      { id: "fal-ai/bytedance/seedance-2.0", name: "ByteDance Seedance 2.0", badge: "Áudio & Física ⚡", cost: 20, description: "Motor líder da ByteDance com física real e áudio sincronizado nativo", speed: "~ 45s" },
      { id: "fal-ai/wan-i2v", name: "Wan 2.1 High-Motion", badge: "Super Econômico ⚡", cost: 10, description: "Movimentos corporais fluidos e alta estabilidade em 720p com menor custo", speed: "~ 35s" },
      { id: "fal-ai/kling-video/v2.1/pro/image-to-video", name: "Kling 2.1 Pro", badge: "Cinema Master", cost: 15, description: "Geração Kling 2.1 com excelente consistência temporal e física", speed: "~ 50s" },
      { id: "fal-ai/kling-video/v3/standard/image-to-video", name: "Kling 3.0 Standard", badge: "Cinema Rápido 🎬", cost: 15, description: "Versão equilibrada e econômica do Kling 3.0 com fluidez cinematográfica", speed: "~ 45s" },
      { id: "fal-ai/kling-video/v3/pro/image-to-video", name: "Kling 3.0 Pro", badge: "Cinema Ultra 👑", cost: 20, description: "Renderização cinematográfica máxima em alta fidelidade e consistência temporal extrema", speed: "~ 60s" },
      { id: "fal-ai/luma-dream-machine/ray-2", name: "Luma Ray 2", badge: "Física Realista", cost: 12, description: "Arquitetura Ray 2 de alta coerência dinâmica e física 3D", speed: "~ 45s" },
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
      { id: "fal-ai/bytedance/omnihuman", name: "ByteDance OmniHuman Pro", badge: "Avatar Studio 👑", cost: 25, description: "Avatar ultra-realista com sincronia labial, respiração e gestos expressivos", speed: "~ 40s" },
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

export interface StylePreset {
  id: string;
  name: string;
  thumb: string;
  description: string;
  recommendedSteps: number;
  recommendedCfg: number;
  suffix: string;
}

export const STYLE_PRESETS: StylePreset[] = [
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
    thumb: "/media/landing/hero/hero_studio_master.jpg",
    description: "Pintura digital conceitual, traços ricos, iluminação fantasiosa e alto contraste.",
    recommendedSteps: 22,
    recommendedCfg: 8.5,
    suffix: ", digital concept art, highly detailed digital painting, vibrant palette, fantasy atmosphere, artstation trending",
  },
];

export interface AspectRatioOption {
  id: string;
  label: string;
  name: string;
  iconWidth: string;
  defaultRes: string;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: "square_hd", label: "1:1", name: "Quadrado", iconWidth: "w-4 h-4", defaultRes: "1024 x 1024" },
  { id: "landscape_16_9", label: "16:9", name: "Cinema", iconWidth: "w-6 h-3.5", defaultRes: "1792 x 1024" },
  { id: "portrait_16_9", label: "9:16", name: "Reels", iconWidth: "w-3.5 h-6", defaultRes: "1024 x 1792" },
  { id: "landscape_4_3", label: "4:3", name: "Paisagem", iconWidth: "w-5 h-4", defaultRes: "1152 x 864" },
  { id: "landscape_3_2", label: "3:2", name: "Fotografia", iconWidth: "w-6 h-4", defaultRes: "1216 x 832" },
];

export const RESOLUTION_OPTIONS: Record<string, string[]> = {
  square_hd: ["1024 x 1024", "768 x 768", "1536 x 1536"],
  landscape_16_9: ["1792 x 1024", "1344 x 768", "1920 x 1080"],
  portrait_16_9: ["1024 x 1792", "768 x 1344", "1080 x 1920"],
  landscape_4_3: ["1152 x 864", "1024 x 768", "1440 x 1080"],
  landscape_3_2: ["1216 x 832", "1536 x 1024"],
};

export const QUALITY_MODES = [
  { id: "fast", name: "Rápido", cost: 1, modelId: "fal-ai/flux/schnell", badge: "1 crédito", steps: 4 },
  { id: "standard", name: "Padrão", cost: 2, modelId: "fal-ai/recraft-v3", badge: "2 créditos", steps: 20 },
  { id: "hd", name: "Alta Definição", cost: 4, modelId: "fal-ai/flux-pro/v1.1-ultra", badge: "4 créditos", steps: 28 },
  { id: "ultra", name: "Ultra", cost: 8, modelId: "fal-ai/flux-pro/v1.1-ultra", badge: "8 créditos", steps: 35 },
];

export interface InspirationItem {
  id: string;
  title: string;
  thumb: string;
  videoUrl?: string;
  imageUrl?: string;
  badge: string;
  ratio: string;
  tool: StudioTool;
  model: string;
  styleId: string;
  prompt: string;
}

export const INSPIRATIONS: InspirationItem[] = [
  {
    id: "insp-1",
    title: "Cyberpunk Hypercar Nocturne",
    thumb: "/media/landing/gallery/hypercar_cyberpunk.jpg",
    videoUrl: "/media/landing/videos/cinematic_hypercar.mp4",
    badge: "0:05",
    ratio: "16:9",
    tool: "video",
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
    tool: "image",
    model: "FLUX.1 Pro",
    styleId: "realist",
    prompt: "Retrato editorial de alta-costura, modelo com detalhes holográficos na pele de titânio, iluminação de estúdio suave, textura de pele natural ultra-realista, lente 85mm f/1.4.",
  },
  {
    id: "insp-3",
    title: "Luxury Perfume Liquid Gold",
    thumb: "/media/landing/gallery/perfume_commercial.jpg",
    videoUrl: "/media/landing/videos/commercial_perfume.mp4",
    badge: "0:05",
    ratio: "1:1",
    tool: "video",
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
    tool: "motion",
    model: "Motion Control",
    styleId: "cinematic",
    prompt: "Dançarino urbano com jaqueta cibernética reagindo a batidas graves sob iluminação néon pulsante de beco urbano molhado, câmera lenta a 60fps.",
  },
  {
    id: "insp-5",
    title: "AI Presenter Hyper-Real",
    thumb: "/media/landing/gallery/avatar_presenter.jpg",
    videoUrl: "/media/landing/videos/lipsync_avatar.mp4",
    badge: "0:05",
    ratio: "16:9",
    tool: "lipsync",
    model: "LivePortrait",
    styleId: "cinematic",
    prompt: "Apresentadora virtual hiper-realista em estúdio de tecnologia futurista falando com entusiasmo e microexpressões faciais naturais, profundidade de campo sutil.",
  },
];

export interface StudioHistoryItem {
  id: string;
  url: string;
  mediaType: "image" | "video";
  modelName: string;
  prompt: string;
  createdAt: string;
  timeAgo: string;
}
