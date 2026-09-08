export type VideoCreationMode = "text-to-video" | "image-to-video";
export type VideoDuration = "5" | "10";
export type VideoQuality = "standard" | "high";

export interface VideoModelDef {
  id: string;
  name: string;
  badge: string;
  isRecommended?: boolean;
  cost: number;
  description: string;
  speed: string;
  hasNativeAudio?: boolean;
  thumb?: string;
}

export interface VideoRecentCreation {
  id: string;
  url: string;
  thumbUrl?: string;
  title: string;
  duration: string;
  timeAgo: string;
  prompt: string;
  ratio: string;
  quality: string;
  modelName: string;
}

export const VIDEO_MODELS: VideoModelDef[] = [
  {
    id: "fal-ai/kling-video/v2.1/pro/image-to-video",
    name: "Kling 2.1 Pro",
    badge: "RECOMENDADO",
    isRecommended: true,
    cost: 15,
    description: "Vídeos ultra realistas com movimento de câmera cinematográfico.",
    speed: "~ 50s",
    thumb: "/media/landing/gallery/editorial_fashion.jpg",
  },
  {
    id: "fal-ai/bytedance/seedance-2.0",
    name: "ByteDance Seedance 2.0",
    badge: "Áudio & Física 👑",
    cost: 20,
    description: "Motor líder com física realista e síntese de áudio nativo sincronizado.",
    speed: "~ 45s",
    hasNativeAudio: true,
    thumb: "/media/landing/gallery/hypercar_cyberpunk.jpg",
  },
  {
    id: "fal-ai/wan-i2v",
    name: "Wan 2.1 High-Motion",
    badge: "Super Econômico ⚡",
    cost: 10,
    description: "Movimentos corporais e dança com estabilidade extrema em 720p.",
    speed: "~ 35s",
    thumb: "/media/landing/gallery/street_dancer.jpg",
  },
  {
    id: "fal-ai/kling-video/v3/pro/image-to-video",
    name: "Kling 3.0 Pro",
    badge: "Cinema Ultra 4K",
    cost: 20,
    description: "Renderização cinematográfica máxima com consistência temporal extrema.",
    speed: "~ 60s",
    thumb: "/media/landing/gallery/perfume_commercial.jpg",
  },
  {
    id: "fal-ai/luma-dream-machine/ray-2",
    name: "Luma Ray 2",
    badge: "Física Realista",
    cost: 12,
    description: "Arquitetura Ray 2 de alta coerência dinâmica e controle de câmera 3D.",
    speed: "~ 45s",
    thumb: "/test_wide_establishing.png",
  },
  {
    id: "fal-ai/minimax/video-01-live",
    name: "Hailuo Minimax 01",
    badge: "Expressões Vivas",
    cost: 12,
    description: "Renderização facial hiper-expressiva e ação contínua.",
    speed: "~ 40s",
    thumb: "/media/landing/gallery/editorial_fashion.jpg",
  },
];

export const VIDEO_PROMPT_SUGGESTIONS = [
  "Uma mulher futurista em uma cidade cyberpunk, chuva neon, olhando para a câmera, movimento de câmera suave, ambiente cinematográfico, ultra realista, 8k.",
  "Carro esportivo acelerando por uma rodovia costeira ao entardecer, reflexos dourados na lataria, tomada aérea com drone girando.",
  "Astronauta explorando uma caverna cristalina em Marte, partículas brilhantes flutuando no ar, luz volumétrica cinematográfica.",
  "Retrato close-up de um samurai na floresta de bambu, vento soprando folhas, gotas de chuva caindo lentamente em 60fps.",
  "Câmera orbitando 360 graus ao redor de um modelo fashion em Nova York, luzes da cidade desfocadas ao fundo, estilo editorial Vogue.",
];
