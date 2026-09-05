export interface ChangelogMetric {
  label: string;
  value: string;
}

export type ChangelogCategory =
  | "Modelos de IA"
  | "Estúdio & Flow"
  | "Ferramentas"
  | "Plataforma";

export interface ChangelogItem {
  id: string;
  title: string;
  version: string;
  date: string;
  category: ChangelogCategory;
  badge: string;
  badgeColor: {
    bg: string;
    text: string;
    border: string;
  };
  summary: string;
  description: string;
  highlights: string[];
  metrics?: ChangelogMetric[];
  href: string;
  actionText: string;
  isHero?: boolean;
  modelId?: string;
  costInCredits?: number;
}

export interface RoadmapItem {
  id: string;
  title: string;
  quarter: string;
  status: "Em Desenvolvimento" | "Mapeado" | "Pesquisa";
  description: string;
  badge: string;
}

export const CHANGELOG_ITEMS: ChangelogItem[] = [
  {
    id: "google-imagen-3",
    title: "Google Imagen 3 (Gemini Pro)",
    version: "v2.5",
    date: "Setembro 2026",
    category: "Modelos de IA",
    badge: "Google AI",
    badgeColor: {
      bg: "bg-blue-500/20",
      text: "text-blue-300",
      border: "border-blue-500/30",
    },
    summary:
      "Fotorrealismo humano extremo, textura de pele micro-porosa natural e cenografia viva de alta fidelidade.",
    description:
      "Integração oficial com a mais recente geração do Google Imagen 3 (Gemini Pro) via fal.ai. Entrega iluminação volumétrica avançada, fidelidade cenográfica editorial e eliminação completa de artefatos de pele plástica de IA.",
    highlights: [
      "Textura de pele humana hiper-realista com microporos, sardas naturais e luz volumétrica",
      "Compreensão apurada de prompts descritivos complexos e enquadramentos de corpo inteiro da cabeça aos pés",
      "Gerações em proporções 16:9 Cinema, 1:1 Quadrado e 9:16 Vertical para mídias sociais",
      "Consumo balanceado de 3 créditos por geração master",
    ],
    metrics: [
      { label: "Resolução", value: "2K Nativos" },
      { label: "Custo", value: "3 Créditos" },
      { label: "Latência", value: "~4.5s" },
    ],
    href: "/dashboard/tools/image",
    actionText: "Testar Google Imagen 3",
    isHero: true,
    modelId: "fal-ai/nano-banana-pro",
    costInCredits: 3,
  },
  {
    id: "kling-video-1-5",
    title: "Kling AI 1.5 Pro (Vídeo Cinematográfico)",
    version: "v1.5",
    date: "Agosto 2026",
    category: "Modelos de IA",
    badge: "v1.5 60FPS",
    badgeColor: {
      bg: "bg-cyan-500/20",
      text: "text-cyan-300",
      border: "border-cyan-500/30",
    },
    summary:
      "Renderizações de vídeo 1080p nativas a 60fps com estabilização cinematográfica e física coerente.",
    description:
      "O motor Kling AI 1.5 transforma qualquer prompt ou imagem inicial em planos de vídeo cinematográficos com iluminação dinâmica, movimentos de câmera suaves e física realista de tecidos, cabelos e água.",
    highlights: [
      "Renderização nativa a 60 frames por segundo em Full HD (1080p)",
      "Duração configurável de 5 segundos ou 10 segundos contínuos",
      "Estabilização de câmera e movimentos de drone, pan e tilt com amortecimento óptico",
      "Consumo otimizado de 10 créditos por cena cinematográfica",
    ],
    metrics: [
      { label: "Taxa de Quadros", value: "60 FPS" },
      { label: "Duração", value: "5s / 10s" },
      { label: "Custo", value: "10 Créditos" },
    ],
    href: "/dashboard/tools/video",
    actionText: "Testar Kling AI 1.5",
    isHero: true,
    modelId: "fal-ai/kling/video-generation/image-to-video",
    costInCredits: 10,
  },
  {
    id: "flux-schnell-turbo",
    title: "FLUX.1 Schnell Turbo (< 2s)",
    version: "Turbo",
    date: "Setembro 2026",
    category: "Modelos de IA",
    badge: "Turbo <2s",
    badgeColor: {
      bg: "bg-violet-500/20",
      text: "text-violet-300",
      border: "border-violet-500/30",
    },
    summary:
      "Gerações de imagens fotorrealistas em velocidade ultra-rápida em menos de 2 segundos.",
    description:
      "O motor FLUX.1 Schnell Turbo foi concebido para fluxos de concept art e ideação rápida, entregando alta fidelidade estética por apenas 1 crédito e latência inferior a 2 segundos.",
    highlights: [
      "Velocidade ultra-rápida de renderização (< 2 segundos na nuvem)",
      "Custo ultra-acessível de apenas 1 crédito por imagem gerada",
      "Excelente coerência espacial, contraste cinematográfico e renderização de objetos",
      "Ideal para exploração inicial de conceitos e conexão no VORIXA FLOW",
    ],
    metrics: [
      { label: "Latência", value: "< 2.0s" },
      { label: "Custo", value: "1 Crédito" },
      { label: "Estilo", value: "Fotografia & Concept" },
    ],
    href: "/dashboard/tools/image",
    actionText: "Testar FLUX Turbo",
    isHero: true,
    modelId: "fal-ai/flux/schnell",
    costInCredits: 1,
  },
  {
    id: "recraft-v3-cinema",
    title: "Recraft V3 Cinema & Typography",
    version: "v3.0",
    date: "Setembro 2026",
    category: "Modelos de IA",
    badge: "Cinema V3",
    badgeColor: {
      bg: "bg-amber-500/20",
      text: "text-amber-300",
      border: "border-amber-500/30",
    },
    summary:
      "Especialista em renderização de tipografia perfeitamente legível, logotipos e vetores.",
    description:
      "Recraft V3 resolve o clássico desafio de renderizar textos, slogans e letreiros legíveis em imagens geradas por IA, com suporte a composições vetoriais e pôsteres de alta resolução.",
    highlights: [
      "Tipografia e letreiros perfeitamente legíveis integrados na cena",
      "Estilos de pôster cinematográfico, design vetorial e iconografia",
      "Controle estético refinado de paletas de cor e hierarquia visual",
      "2 créditos por geração de alta definição",
    ],
    metrics: [
      { label: "Tipografia", value: "100% Legível" },
      { label: "Custo", value: "2 Créditos" },
      { label: "Modos", value: "Raster & Vector" },
    ],
    href: "/dashboard/tools/image",
    actionText: "Testar Recraft V3",
    isHero: false,
    modelId: "fal-ai/recraft-v3",
    costInCredits: 2,
  },
  {
    id: "creative-upscale-4k",
    title: "Creative Upscale 4K UHD",
    version: "4K AI",
    date: "Setembro 2026",
    category: "Ferramentas",
    badge: "4K AI",
    badgeColor: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
    },
    summary:
      "Restauração neural facial e preservação de texturas volumétricas em escalas 2x e 4x.",
    description:
      "O Creative Upscale 4K reconstrói detalhes sutis que se perdem na geração inicial, aplicando micro-texturização facial, definição de tecidos e redução de ruído digital em resolução 4K UHD.",
    highlights: [
      "Escalabilidade para 2x e 4x a resolução original do vídeo",
      "Restauração neural facial inteligente sem efeito borrado ou plastificado",
      "Preservação da granulação cinematográfica nativa de película",
      "5 créditos por upscale de alta definição",
    ],
    metrics: [
      { label: "Resolução", value: "Até 4K UHD" },
      { label: "Custo", value: "5 Créditos" },
      { label: "Modo", value: "2x & 4x Fator" },
    ],
    href: "/dashboard/tools/upscale",
    actionText: "Testar Upscale 4K",
    isHero: true,
    modelId: "fal-ai/creative-upscaler",
    costInCredits: 5,
  },
  {
    id: "prompt-engine-ai",
    title: "PromptEngine com Tradução & Otimização PT-BR",
    version: "v2.2",
    date: "Setembro 2026",
    category: "Ferramentas",
    badge: "Prompt AI",
    badgeColor: {
      bg: "bg-purple-500/20",
      text: "text-purple-300",
      border: "border-purple-500/30",
    },
    summary:
      "Otimização automática com parâmetros ópticos de cinema e tradução preservando falas em PT-BR.",
    description:
      "Botão interativo ✦ disponível em todos os campos de prompt. Transforma frases simples em instruções técnicas de padrão Sony A7R IV (85mm f/1.4, luz volumétrica e microporos) enquanto preserva citações e falas entre aspas em português.",
    highlights: [
      "Tradução inteligente e expansão com termos ópticos de cinema de estúdio",
      "Preservação universal de citações e diálogos entre aspas em português",
      "Eliminação automática de texturas de cera ou plástico de IA",
      "Disponível gratuitamente em todas as ferramentas de criação",
    ],
    metrics: [
      { label: "Disponibilidade", value: "Gratuito" },
      { label: "Latência", value: "< 1.2s" },
      { label: "Idioma", value: "PT-BR Inteligente" },
    ],
    href: "/dashboard/tools/image",
    actionText: "Experimentar PromptEngine",
    isHero: true,
    costInCredits: 0,
  },
  {
    id: "liveportrait-lipsync",
    title: "LivePortrait LipSync Facial",
    version: "v2.0",
    date: "Agosto 2026",
    category: "Ferramentas",
    badge: "LipSync",
    badgeColor: {
      bg: "bg-pink-500/20",
      text: "text-pink-300",
      border: "border-pink-500/30",
    },
    summary:
      "Sincronização labial facial de precisão sub-milimétrica a partir de qualquer áudio ou voz.",
    description:
      "Carregue o vídeo de um personagem e um arquivo de áudio para que o LivePortrait LipSync sincronize lábios, dentes e mandíbula com máxima naturalidade e fidelidade expressiva.",
    highlights: [
      "Sincronismo fonético sub-milimétrico entre fala e movimento labial",
      "Preservação da iluminação, expressões micro-faciais e piscadas orgânicas",
      "Suporte a áudios MP3, WAV e M4A em qualquer idioma",
      "8 créditos por vídeo sincronizado",
    ],
    metrics: [
      { label: "Precisão", value: "Sub-milimétrica" },
      { label: "Custo", value: "8 Créditos" },
      { label: "Entrada", value: "Vídeo + Áudio" },
    ],
    href: "/dashboard/tools/lipsync",
    actionText: "Testar LipSync Facial",
    isHero: false,
    modelId: "fal-ai/sync",
    costInCredits: 8,
  },
  {
    id: "motion-control",
    title: "Kling Motion Control (Transferência de Poses)",
    version: "v1.8",
    date: "Agosto 2026",
    category: "Ferramentas",
    badge: "Motion AI",
    badgeColor: {
      bg: "bg-fuchsia-500/20",
      text: "text-fuchsia-300",
      border: "border-fuchsia-500/30",
    },
    summary:
      "Transfira coreografias e poses de um vídeo guia para qualquer imagem estática de personagem.",
    description:
      "Extraia o esqueleto cinemático de um vídeo de dança, desfile ou esporte e aplique a animação com fidelidade anatômica ao seu personagem original gerado por IA.",
    highlights: [
      "Transferência dinâmica de movimento corporal de vídeo guia para foto estática",
      "Consistência anatômica de membros, roupas e perspectiva espacial",
      "Suporte a danças urbanas, passos sincronizados e poses esportivas",
      "15 créditos por transferência de movimento cinematográfica",
    ],
    metrics: [
      { label: "Fidelidade", value: "Anatômica 3D" },
      { label: "Custo", value: "15 Créditos" },
      { label: "Modo", value: "Imagem + Vídeo Guia" },
    ],
    href: "/dashboard/tools/motion",
    actionText: "Testar Motion Control",
    isHero: false,
    modelId: "fal-ai/kling/motion-control",
    costInCredits: 15,
  },
  {
    id: "vorixa-flow-dag",
    title: "VORIXA FLOW - Canvas Infinito & DAG Pipeline",
    version: "v2.0",
    date: "Setembro 2026",
    category: "Estúdio & Flow",
    badge: "DAG Flow",
    badgeColor: {
      bg: "bg-cyan-500/20",
      text: "text-cyan-300",
      border: "border-cyan-500/30",
    },
    summary:
      "Espaço de trabalho visual infinito encadeando nós Prompt -> FLUX -> Kling -> LipSync -> 4K.",
    description:
      "O VORIXA FLOW unifica todos os motores de IA em um canvas sem limites baseado em Grafo Acíclico Direcionado (DAG). Conecte saídas de imagem como entradas de vídeo e execute o pipeline completo com 1 clique.",
    highlights: [
      "Canvas infinito com zoom, pan, minimap e histórico de Undo/Redo (Ctrl+Z / Ctrl+Y)",
      "Pipeline encadeado de nós de Prompt, FLUX, Kling, LipSync e Upscale 4K",
      "Modal de pré-voo com estimativa precisa de créditos antes da execução",
      "Cancelamento atômico em tempo real com estorno instantâneo de créditos não utilizados",
    ],
    metrics: [
      { label: "Tipo", value: "DAG Visual" },
      { label: "Conexões", value: "Multi-modelo" },
      { label: "Status", value: "100% Funcional" },
    ],
    href: "/dashboard/flow",
    actionText: "Abrir VORIXA FLOW",
    isHero: true,
  },
  {
    id: "studio-create",
    title: "Studio CREATE (Geração Rápida Integrada)",
    version: "v2.1",
    date: "Setembro 2026",
    category: "Estúdio & Flow",
    badge: "Studio",
    badgeColor: {
      bg: "bg-indigo-500/20",
      text: "text-indigo-300",
      border: "border-indigo-500/30",
    },
    summary:
      "Estúdio rápido all-in-one com presets cinematográficos e botão direto 'Open in Flow ✦'.",
    description:
      "Para criações imediatas sem abrir o grafo, o Studio CREATE oferece acesso rápido a qualquer ferramenta com seletores de proporção (1:1, 16:9, 9:16), presets de iluminação e envio direto para o Flow.",
    highlights: [
      "Alternância imediata entre imagem, vídeo, lipsync, motion e upscale",
      "Presets estéticos: Cinematográfico 8K, Fotorrealista, Cyberpunk e Anime",
      "Uploaders drag-and-drop rápidos de fotos, vídeos e faixas de áudio",
      "Botão 'Open in Flow ✦' para expandir a geração em um pipeline visual",
    ],
    metrics: [
      { label: "Modo", value: "Geração Direta" },
      { label: "Presets", value: "4 Estilos Master" },
      { label: "Exportação", value: "1-Clique para Flow" },
    ],
    href: "/dashboard/create",
    actionText: "Acessar Studio CREATE",
    isHero: false,
  },
  {
    id: "library-central",
    title: "Library Central de Ativos & Cinema Lightbox",
    version: "v1.8",
    date: "Agosto 2026",
    category: "Estúdio & Flow",
    badge: "Library",
    badgeColor: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
    },
    summary:
      "Gerenciador centralizado de mídias com filtros rápidos, busca instantânea e Cinema Lightbox 4K.",
    description:
      "Todos os seus vídeos, imagens e animações gerados ficam armazenados de forma persistente e segura na Library, prontos para download, compartilhamento ou reutilização no Canvas.",
    highlights: [
      "Filtros rápidos por tipo (Todos, Vídeos, Imagens) com contadores em tempo real",
      "Busca textual instantânea por palavras-chave do prompt original",
      "Visualizador Cinema Lightbox em tela cheia com suporte a atalho Esc",
      "Download direto em alta qualidade e proteção contra acesso indevido (anti-IDOR)",
    ],
    metrics: [
      { label: "Armazenamento", value: "Nuvem Persistente" },
      { label: "Visualizador", value: "Lightbox 4K" },
      { label: "Segurança", value: "Anti-IDOR" },
    ],
    href: "/dashboard/library",
    actionText: "Explorar Meus Ativos",
    isHero: false,
  },
  {
    id: "google-oauth-smtp",
    title: "Google OAuth2 & E-mails Transacionais Hostinger",
    version: "v2.3",
    date: "Setembro 2026",
    category: "Plataforma",
    badge: "OAuth 2.0",
    badgeColor: {
      bg: "bg-blue-500/20",
      text: "text-blue-300",
      border: "border-blue-500/30",
    },
    summary:
      "Autenticação Google em 1 clique e disparos de e-mail com layout Dark Obsidian oficial.",
    description:
      "Integração oficial com Google Cloud OAuth2 para login sem atrito e infraestrutura de e-mail transacional via Hostinger SMTP criptografado (SSL Porta 465) com template visual Dark Obsidian.",
    highlights: [
      "Login social imediato com 1 clique via conta Google cadastrada",
      "Vinculação inteligente de contas existentes e proteção anti-força bruta",
      "E-mails transacionais elegantes com identidade VORIXA oficial",
      "Conexão segura SSL autenticada com smtp.hostinger.com",
    ],
    metrics: [
      { label: "Provedor", value: "Google Cloud & Hostinger" },
      { label: "Criptografia", value: "SSL 465 & NextAuth v5" },
      { label: "Segurança", value: "Zero Trust" },
    ],
    href: "/login",
    actionText: "Ver Configurações de Acesso",
    isHero: false,
  },
  {
    id: "credits-ledger",
    title: "Carteira de Créditos & Checkout Dinâmico",
    version: "v2.0",
    date: "Agosto 2026",
    category: "Plataforma",
    badge: "Ledger AI",
    badgeColor: {
      bg: "bg-amber-500/20",
      text: "text-amber-300",
      border: "border-amber-500/30",
    },
    summary:
      "Extrato dinâmico com garantia de idempotência, saldo ao vivo e pacotes via Pix e Cartão.",
    description:
      "Sistema financeiro auditável para aquisição e consumo de créditos na plataforma. Garantia de que nenhuma operação é cobrada em duplicidade mesmo com retentativas de rede, com liberação automática de saldo.",
    highlights: [
      "Atualização de saldo em tempo real no topo de todas as páginas",
      "Pacotes escalonados (Iniciante, Profissional e Criador) com bônus de créditos",
      "Checkout transparente com suporte imediato a Pix e Cartão",
      "Proteção contra idempotência e histórico auditável de cada consumo de IA",
    ],
    metrics: [
      { label: "Garantia", value: "Idempotente 100%" },
      { label: "Métodos", value: "Pix & Cartão" },
      { label: "Ativação", value: "Instantânea" },
    ],
    href: "/dashboard/credits",
    actionText: "Acessar Carteira de Créditos",
    isHero: false,
  },
];

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: "soundfx-ai",
    title: "SoundFX & Voice Synthesis AI",
    quarter: "Q4 2026",
    status: "Em Desenvolvimento",
    description:
      "Geração neural de efeitos sonoros estéreo cinematográficos sincronizados e dublagem hiper-realista por IA.",
    badge: "Áudio AI",
  },
  {
    id: "kling-multi-cam",
    title: "Kling 2.0 Multi-Camera Control",
    quarter: "Q4 2026",
    status: "Em Desenvolvimento",
    description:
      "Controle tridimensional de trajetórias de câmera e tomadas multi-ângulo contínuas em cenas de vídeo.",
    badge: "Câmera 3D",
  },
  {
    id: "collaborative-flow",
    title: "Real-Time Collaborative Canvas",
    quarter: "Q1 2027",
    status: "Mapeado",
    description:
      "Múltiplos criadores editando e executando o mesmo DAG do VORIXA FLOW simultaneamente com cursores em tempo real.",
    badge: "Colaboração",
  },
  {
    id: "lora-character-train",
    title: "LoRA Custom Character Training",
    quarter: "Q1 2027",
    status: "Pesquisa",
    description:
      "Treinamento de pesos LoRA dedicados para consistência anatômica absoluta de personagens em todos os nós do pipeline.",
    badge: "LoRA Studio",
  },
];

export function getFeaturedItems(): ChangelogItem[] {
  return CHANGELOG_ITEMS.filter((item) => item.isHero);
}

export function getChangelogByCategory(category: ChangelogCategory | "Todos"): ChangelogItem[] {
  if (category === "Todos") return CHANGELOG_ITEMS;
  return CHANGELOG_ITEMS.filter((item) => item.category === category);
}