export type CreationMode = "text-to-image" | "image-to-image" | "style-ref" | "character";
export type QualityMode = "fast" | "standard" | "hd" | "ultra";

export interface StylePreset {
  id: string;
  name: string;
  thumb: string;
  description: string;
  recommendedSteps: number;
  recommendedCfg: number;
  suffix: string;
}

export interface AspectRatioOption {
  id: string;
  label: string;
  name: string;
  width: string;
  defaultRes: string;
}

export interface AIModelDef {
  id: string;
  name: string;
  badge: string;
  cost: number;
  description: string;
  speed: string;
  recommendedSteps: number;
}

export interface InspirationItem {
  id: string;
  tag: string;
  title: string;
  thumb: string;
  style: string;
  ratio: string;
  prompt: string;
}

export interface RecentCreation {
  id: string;
  url: string;
  title: string;
  resolution: string;
  timeAgo: string;
  prompt: string;
  style: string;
  ratio: string;
}

export const STYLE_PRESETS: StylePreset[] = [
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
    thumb: "/media/landing/hero/hero_studio_master.jpg",
    description: "Pintura digital conceitual, traços ricos, iluminação fantasiosa e alto contraste.",
    recommendedSteps: 22,
    recommendedCfg: 8.5,
    suffix: ", digital concept art, highly detailed digital painting, vibrant palette, fantasy atmosphere, artstation trending",
  },
];

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: "square_hd", label: "1:1", name: "Quadrado", width: "w-4 h-4", defaultRes: "1024 x 1024" },
  { id: "landscape_16_9", label: "16:9", name: "Paisagem", width: "w-6 h-3.5", defaultRes: "1792 x 1024" },
  { id: "portrait_16_9", label: "9:16", name: "Retrato", width: "w-3.5 h-6", defaultRes: "1024 x 1792" },
  { id: "landscape_4_3", label: "4:3", name: "Clássico", width: "w-5 h-4", defaultRes: "1152 x 864" },
  { id: "landscape_3_2", label: "3:2", name: "Fotografia", width: "w-6 h-4", defaultRes: "1216 x 832" },
];

export const RESOLUTION_OPTIONS: Record<string, string[]> = {
  square_hd: ["1024 x 1024", "768 x 768", "1536 x 1536"],
  landscape_16_9: ["1792 x 1024", "1344 x 768", "1920 x 1080"],
  portrait_16_9: ["1024 x 1792", "768 x 1344", "1080 x 1920"],
  landscape_4_3: ["1152 x 864", "1024 x 768", "1440 x 1080"],
  landscape_3_2: ["1216 x 832", "1536 x 1024"],
};

export const AI_MODELS: AIModelDef[] = [
  {
    id: "fal-ai/nano-banana-pro",
    name: "Nano Banana Pro (Google)",
    badge: "Fotorrealismo Humano 👑",
    cost: 3,
    description: "Modelo oficial Google Imagen 3 / Gemini 3 Pro. Anatomia humana, fotorrealismo e edição com foto",
    speed: "~ 12s",
    recommendedSteps: 24,
  },
  {
    id: "fal-ai/flux-pulid",
    name: "FLUX PuLID (Mesmo Rosto)",
    badge: "Rosto Idêntico 👤",
    cost: 4,
    description: "Fixação absoluta de identidade. Preserva o mesmo rosto, barba, cabelo e traços físicos da sua foto",
    speed: "~ 15s",
    recommendedSteps: 28,
  },
  {
    id: "fal-ai/flux/schnell",
    name: "FLUX.1 Turbo",
    badge: "Super Rápido",
    cost: 1,
    description: "Geração ultra-rápida em 4 segundos da Black Forest Labs para testar conceitos",
    speed: "~ 4s",
    recommendedSteps: 4,
  },
  {
    id: "fal-ai/recraft-v3",
    name: "Recraft V3 Design",
    badge: "Design & Logos",
    cost: 2,
    description: "Perfeito para tipografia legível, ilustrações vetoriais e marcas",
    speed: "~ 10s",
    recommendedSteps: 20,
  },
  {
    id: "fal-ai/flux-pro/v1.1-ultra",
    name: "FLUX Pro Ultra",
    badge: "Máxima Resolução",
    cost: 4,
    description: "Qualidade cinematográfica de estúdio da Black Forest Labs em altíssima definição",
    speed: "~ 20s",
    recommendedSteps: 28,
  },
];

export const QUALITY_MODES: { id: QualityMode; name: string; cost: number; modelId: string; badge: string; steps: number }[] = [
  { id: "fast", name: "Rápido", cost: 1, modelId: "fal-ai/flux/schnell", badge: "1 crédito", steps: 4 },
  { id: "standard", name: "Padrão", cost: 2, modelId: "fal-ai/recraft-v3", badge: "2 créditos", steps: 20 },
  { id: "hd", name: "Alta Definição", cost: 4, modelId: "fal-ai/flux-pro/v1.1-ultra", badge: "4 créditos", steps: 28 },
  { id: "ultra", name: "Ultra", cost: 8, modelId: "fal-ai/flux-pro/v1.1-ultra", badge: "8 créditos", steps: 35 },
];

export const PROMPT_SUGGESTIONS = [
  "Uma mulher futurista em uma cidade cyberpunk, chuva neon, iluminação cinematográfica, ultra realista, 8k, destaque no rosto, atmosfera de filme, profundidade de campo.",
  "Close editorial de modelo em estúdio com detalhes holográficos na pele, luz suave de difusor softbox, lente prime 85mm f/1.4, poros naturais visíveis.",
  "Paisagem épica de cidade flutuante no topo de montanhas rochosas envolta em névoa dourada ao entardecer, arquitetura clássica misturada com ficção científica.",
  "Frasco de perfume de luxo com detalhes em vidro lapidado sobre base de mármore preto molhado, reflexos de iluminação de estúdio comercial 3D.",
  "Astronauta explorando floresta bioluminescente em planeta alienígena, luzes de neon azul e violeta refletidas na viseira espelhada, 8k.",
  "Dragão ancestral de escamas de obsidiana e magma brilhante sobrevoando ruínas de castelo medieval sob tempestade de raios volumétrica.",
];

export const INSPIRATION_ITEMS: InspirationItem[] = [
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
