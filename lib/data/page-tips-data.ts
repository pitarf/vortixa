import {
  Wand2,
  Boxes,
  Video,
  Image as ImageIcon,
  Navigation,
  Activity,
  Coins,
  ShieldCheck,
  Zap,
  HelpCircle,
  FolderKanban,
  Layers,
  LucideIcon,
  Sparkles,
} from "lucide-react";

export interface TipAccordionItem {
  id: string;
  title: string;
  content: string;
  badge?: string;
}

export interface PageTipStep {
  title: string;
  description: string;
  badge?: string;
}

export interface PageTipData {
  route: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  badgeText: string;
  steps: PageTipStep[];
  accordions: TipAccordionItem[];
  proTip: string;
  recommendedModel?: string;
}

export const PAGE_TIPS_DATA: Record<string, PageTipData> = {
  "/dashboard": {
    route: "/dashboard",
    title: "Painel Central (Dashboard)",
    subtitle: "Seu centro de comando criativo para acompanhar saldo, acessar ferramentas e gerenciar produções recentes.",
    icon: Zap,
    color: "from-violet-600 to-indigo-600",
    badgeText: "Visão Geral",
    steps: [
      {
        title: "1. Monitoramento de Carteira Digital",
        description: "Seu saldo de créditos fica sempre visível no topo direito. Os créditos comprados nunca expiram e são consumidos sob demanda por inferência.",
      },
      {
        title: "2. Suíte Criativa Unificada",
        description: "Acesse rapidamente o Studio CREATE para produções guiadas, o VORIXA FLOW para pipelines em canvas, ou ferramentas dedicadas de Imagem, Vídeo e Áudio.",
      },
      {
        title: "3. Galeria Recente & Reutilização",
        description: "Suas últimas imagens e vídeos gerados ficam salvos com acesso direto para download, cópia de prompt e envio para o Flow.",
      },
    ],
    accordions: [
      {
        id: "dash-quicksearch",
        title: "Como usar o menu rápido global (Cmd + K / Ctrl + K)?",
        content: "Pressione Cmd + K no Mac ou Ctrl + K no Windows para abrir a busca instantânea. Você pode digitar o nome de qualquer ferramenta, termo de busca ou projeto para navegar sem precisar clicar nos menus.",
      },
      {
        id: "dash-refund",
        title: "Como funciona a segurança financeira de saldo?",
        content: "O VORIXA utiliza um sistema contábil atômico no PostgreSQL. Se qualquer servidor de GPU apresentar timeout ou falha de renderização, seus créditos são automaticamente devolvidos para o seu saldo no mesmo segundo.",
      },
    ],
    proTip: "Dica: Mantenha sempre seus prompts salvos na Biblioteca de Favoritos para reaproveitar estruturas bem-sucedidas em novos projetos.",
  },

  "/dashboard/create": {
    route: "/dashboard/create",
    title: "Studio CREATE",
    subtitle: "Esteira rápida e intuitiva para criar Imagens, Vídeos, Avatares, Motion e Upscale 4K em 1 único lugar.",
    icon: Wand2,
    color: "from-violet-600 via-indigo-600 to-cyan-500",
    badgeText: "Esteira Unificada",
    steps: [
      {
        title: "Etapa 1: Selecione o Tipo de Mídia",
        description: "Alterne no seletor do topo entre Imagem, Vídeo, LipSync (Avatar), Motion Control ou Upscale 4K.",
      },
      {
        title: "Etapa 2: Escolha o Motor de Inteligência Artificial",
        description: "Selecione o modelo mais adequado ao seu objetivo (ex: FLUX.1 Turbo para velocidade em 4s, ByteDance Seedance 2.0 para vídeo com som).",
      },
      {
        title: "Etapa 3: Defina os Parâmetros e Proporção",
        description: "Ajuste o formato de tela (16:9, 9:16, 1:1, etc.) ou selecione 'Original 📷' ao carregar uma imagem de base para preservar resolução sem cortes.",
      },
      {
        title: "Etapa 4: Gerar e Interagir no Player",
        description: "Acompanhe o render na GPU e utilize os botões rápidos: Variar (mesma seed), Usar como Referência, Upscale 4K ou Abrir no FLOW.",
      },
    ],
    accordions: [
      {
        id: "create-opt",
        title: "Como o botão 'Otimizar com IA' aprimora seu prompt?",
        content: "Nosso motor de linguagem contextual analisa sua ideia em português, traduz termos-chave e injeta parâmetros de lentes de estúdio (ex: 85mm f/1.4), iluminação volumétrica e texturas reais, sem produzir estética artificial ou plástica.",
      },
      {
        id: "create-chain",
        title: "Como transformar uma criação do Studio em Vídeo ou Flow?",
        content: "Após gerar uma imagem satisfatória, clique no botão 'Usar como Referência' para transformá-la em imagem de entrada para Vídeo, ou clique em 'Abrir no Flow' para transferi-la automaticamente como nó de um pipeline contínuo.",
      },
    ],
    proTip: "Para retratos fotorrealistas humanos, use o Nano Banana Pro (Google Imagen 3). Para manter a mesma pessoa exata de uma foto, use o FLUX PuLID.",
    recommendedModel: "ByteDance Seedance 2.0 (Vídeo) / Nano Banana Pro (Imagem)",
  },

  "/dashboard/tools/image": {
    route: "/dashboard/tools/image",
    title: "Geração de Imagens Profissional",
    subtitle: "Criação fotográfica e artística de altíssima definição com motores líderes mundiais e retenção de identidade.",
    icon: ImageIcon,
    color: "from-violet-600 to-fuchsia-600",
    badgeText: "Fotografia & Design",
    steps: [
      {
        title: "1. Escolha entre os 4 Fluxos de Trabalho",
        description: "Texto para Imagem (criação do zero), Imagem para Imagem (modificação de foto existente), Estilo de Referência (cópia de estética/cores) ou Personagem (preservação facial).",
      },
      {
        title: "2. Seleção de Motores Especializados",
        description: "Cada motor tem uma especialidade: FLUX.1 Turbo (1 cr, 4s), Nano Banana Pro Google (3 cr, hiper-realismo), FLUX PuLID (4 cr, rosto idêntico) e Recraft V3 (2 cr, design e logos).",
      },
      {
        title: "3. Proporção & Tamanho Original",
        description: "Escolha entre 16:9, 9:16, 1:1, 4:3 ou 3:2. Ao enviar uma foto de referência, o botão 'Original 📷' preserva a matriz nativa de pixels.",
      },
    ],
    accordions: [
      {
        id: "img-pulid",
        title: "Como funciona a aba 'Personagem' (FLUX PuLID)?",
        content: "O FLUX PuLID extrai a assinatura biométrica facial da foto enviada (olhos, nariz, boca, estrutura óssea e barba) e a fixa na nova cena. Você não precisa ajustar sliders de denoise; basta descrever o novo cenário, roupa e ação no prompt mantendo a mesma pessoa.",
      },
      {
        id: "img-recraft",
        title: "Por que usar o Recraft V3 para logotipos e marcas?",
        content: "Modelos convencionais de imagem borram letras. O Recraft V3 foi treinado especificamente para tipografia vetorial nítida, ilustrações limpas e textos perfeitamente legíveis em rótulos e embalagens.",
      },
      {
        id: "img-fullbody",
        title: "Como obter fotos de corpo inteiro sem cortar sapatos ou cabeça?",
        content: "Inclua no prompt: 'full-length lookbook photography, model standing, full body framed from head to toe with visible shoes and floor, 35mm lens, f/8'. Isso orienta a IA a não fechar o enquadramento apenas no tronco.",
      },
    ],
    proTip: "Use o FLUX.1 Turbo para rascunhar ideias rapidamente gastando apenas 1 crédito. Ao encontrar a pose ideal, passe para o FLUX Pro Ultra ou aplique Upscale 4K.",
    recommendedModel: "Nano Banana Pro (Google Imagen 3)",
  },

  "/dashboard/tools/video": {
    route: "/dashboard/tools/video",
    title: "Geração de Vídeo Cinematográfico",
    subtitle: "Dê vida e movimento fluido a fotos estáticas ou crie cenas com física realista e áudio sincronizado.",
    icon: Video,
    color: "from-cyan-500 to-blue-600",
    badgeText: "Cinema & Animação",
    steps: [
      {
        title: "1. Modo de Entrada: Texto ou Imagem",
        description: "Em 'Texto para Vídeo', a IA gera o cenário e os personagens do zero. Em 'Imagem para Vídeo', você envia uma foto base e orienta a dinâmica de movimento.",
      },
      {
        title: "2. Motores Líderes e Suas Vantagens",
        description: "ByteDance Seedance 2.0 (20 cr, com som e física nativa), Wan 2.1 (10 cr, super econômico e ótimo para dança/corpo), Kling 2.1 e 3.0 Pro (15 e 20 cr, máxima consistência temporal de cinema).",
      },
      {
        title: "3. Duração e Fala com IA (One-Shot)",
        description: "Escolha entre 5s ou 10s. Nos motores sem áudio nativo (Wan e Kling), você pode ativar a opção de fala neural em português com sincronia labial automática (+9 cr).",
      },
    ],
    accordions: [
      {
        id: "vid-seedance",
        title: "Por que o ByteDance Seedance 2.0 é o motor recomendado?",
        content: "O Seedance 2.0 é o único motor que sintetiza som cinematográfico e efeitos acústicos (passos, vento, motores, respiração) sincronizados diretamente com os movimentos visuais da cena. Por já ter som nativo, a opção de dublagem forçada é ocultada automaticamente nele.",
      },
      {
        id: "vid-oneshot",
        title: "Como funciona a Fala Integrada One-Shot nos modelos Wan e Kling?",
        content: "Ao ativar 'Adicionar Fala com IA ao Vídeo', o VORIXA orquestra 3 etapas em 1 clique: sintetiza a voz do dublador brasileiro em alta fidelidade (ElevenLabs), gera o vídeo do personagem e sincroniza os lábios com precisão milimétrica via LatentSync Pro.",
      },
      {
        id: "vid-camera",
        title: "Como orientar movimentos de câmera pelo prompt?",
        content: "Os motores de vídeo respondem muito melhor a descrições técnicas de cinema: 'slow cinematic drone shot descending', 'orbit camera 360 around the car', 'smooth steadicam tracking forward'.",
      },
    ],
    proTip: "Para vídeos verticais de Reels e TikTok, garanta que sua imagem base já esteja no formato 9:16 antes de animar.",
    recommendedModel: "ByteDance Seedance 2.0 (fal-ai/bytedance/seedance-2.0)",
  },

  "/dashboard/tools/lipsync": {
    route: "/dashboard/tools/lipsync",
    title: "Sincronização Labial (Avatar / LipSync)",
    subtitle: "Dobre ou anime qualquer pessoa ou personagem a partir de texto em português ou arquivo de voz gravada.",
    icon: Navigation,
    color: "from-pink-500 to-rose-600",
    badgeText: "Voz & Sincronia",
    steps: [
      {
        title: "1. Envie o Vídeo ou Foto do Rosto",
        description: "Carregue o vídeo base do personagem ou foto frontal nítida com boa iluminação e rosto desobstruído.",
      },
      {
        title: "2. Escolha o Método de Áudio",
        description: "Gere fala instantânea com Inteligência Artificial em português (1 crédito) ou envie seu próprio áudio gravado (MP3, WAV).",
      },
      {
        title: "3. Renderização Neural Latente",
        description: "O LatentSync Pro (8 cr) ou Sync Audio modulam cada fonema labial e movimento dos maxilares com fidelidade absoluta.",
      },
    ],
    accordions: [
      {
        id: "lip-photo-reqs",
        title: "Quais os requisitos ideais para a foto ou vídeo de rosto?",
        content: "Utilize imagens frontais com a boca fechada em repouso, boa nitidez nos dentes e olhos, sem óculos espelhados ou sombras excessivas no queixo. Isso garante que a IA deforme apenas a musculatura correta da fala.",
      },
      {
        id: "lip-voices",
        title: "Quais vozes neurais estão disponíveis?",
        content: "Contamos com dubladores de estúdio humano em português: Helena e Sarah (femininas suaves e corporativas), Sofia e Clara (jovens e modernas), Lucas e Marcelo (masculinas firmes e comerciais), Gabriel e Arthur (narrações graves e documentários).",
      },
    ],
    proTip: "Dica: Grave frases com pontuação clara (vírgulas e pontos). As pausas naturais de respiração tornam a sincronia labial ainda mais humana.",
    recommendedModel: "LatentSync Pro (fal-ai/latentsync)",
  },

  "/dashboard/tools/motion": {
    route: "/dashboard/tools/motion",
    title: "Motion Control (Transferência de Pose)",
    subtitle: "Clone a dança, coreografia ou movimentação de um vídeo guia diretamente para o seu personagem.",
    icon: Activity,
    color: "from-fuchsia-500 to-purple-600",
    badgeText: "Coreografia IA",
    steps: [
      {
        title: "1. Imagem do Personagem de Destino",
        description: "Envie a foto da pessoa, modelo ou personagem que receberá a animação (corpo inteiro ou meio-corpo).",
      },
      {
        title: "2. Vídeo de Referência da Coreografia",
        description: "Suba o vídeo com a movimentação que deseja extrair (dança, caminhada, gesticulação de palco).",
      },
      {
        title: "3. Inferência Física Kling Motion",
        description: "O motor Kling Motion (15 cr) extrai o esqueleto 3D do vídeo e transfere para a imagem sem deformar roupas ou anatomia.",
      },
    ],
    accordions: [
      {
        id: "motion-video-guide",
        title: "Como preparar o vídeo de pose para melhor resultado?",
        content: "O vídeo guia deve ter iluminação clara e a pessoa deve estar visível sem cortes de braços ou pernas nas bordas. Evite vídeos com cortes de câmera rápidos ou múltiplas pessoas no mesmo plano.",
      },
      {
        id: "motion-costume",
        title: "A roupa do personagem é alterada durante o movimento?",
        content: "Não. A tecnologia de transferência preserva rigorosamente as vestimentas, texturas e proporções da foto original do personagem, alterando apenas a cinemática articular.",
      },
    ],
    proTip: "Para vídeos de dança, use personagens com roupas que não cubram os joelhos para facilitar a leitura das articulações pela IA.",
  },

  "/dashboard/tools/upscale": {
    route: "/dashboard/tools/upscale",
    title: "Creative Video Upscaler 4K",
    subtitle: "Aumento de resolução para 4K Ultra HD com restauração inteligente de microporos, cabelos e tecidos.",
    icon: Layers,
    color: "from-amber-500 to-orange-600",
    badgeText: "Super Resolução",
    steps: [
      {
        title: "1. Envie sua Imagem ou Vídeo",
        description: "Carregue o arquivo gerado em resolução padrão que precisa de ampliação.",
      },
      {
        title: "2. Selecione o Fator de Escala",
        description: "Escolha entre 2x Resolução (ideal para web e redes sociais) ou 4x Resolução (padrão 4K para monitores e impressão).",
      },
      {
        title: "3. Restauração de Texturas Neurais",
        description: "Ao invés de esticar pixels, o motor recria detalhes ausentes em alta frequência (fios de cabelo, reflexos nos olhos e poros da pele).",
      },
    ],
    accordions: [
      {
        id: "upscale-diff",
        title: "Qual a diferença entre Upscale Comum e Creative Upscaler?",
        content: "Upscalers tradicionais apenas interpolam pixels vizinhos, gerando imagens embaçadas ou com efeito aquarela. O Creative Upscaler utiliza difusão reversa para pintar novos detalhes realistas compatíveis com a iluminação da cena.",
      },
    ],
    proTip: "Passe suas criações pelo Upscaler 4K antes de veicular anúncios pagos no Meta Ads ou YouTube para obter CTR muito superior.",
  },

  "/dashboard/flow": {
    route: "/dashboard/flow",
    title: "VORIXA FLOW Studio",
    subtitle: "Canvas infinito para encadear múltiplos modelos em sequências criativas completas sem trabalho manual.",
    icon: Boxes,
    color: "from-cyan-500 via-indigo-600 to-violet-600",
    badgeText: "Canvas Infinito",
    steps: [
      {
        title: "1. Adicione os Nós Criativos",
        description: "Insira nós de Prompt, Imagem, Vídeo, LipSync ou Upscale no canvas através do menu lateral.",
      },
      {
        title: "2. Conecte as Portas com Cabos Coloridos",
        description: "Arraste da saída (lado direito) de um nó para a entrada (lado esquerdo) do próximo (ex: Imagem → Vídeo).",
      },
      {
        title: "3. Dispare a Execução do Pipeline",
        description: "Clique em 'Executar Pipeline'. O motor resolve dependências automaticamente e processa cada nó na sequência correta.",
      },
    ],
    accordions: [
      {
        id: "flow-colors",
        title: "O que significam as cores dos conectores?",
        content: "🟣 Roxo: Texto/Prompt | 🔵 Ciano: Imagem | 🟢 Verde: Vídeo | 🟡 Âmbar: Áudio. Conectores de cores compatíveis garantem que o dado certo seja entregue à entrada do próximo motor.",
      },
      {
        id: "flow-credits",
        title: "Como funciona a cobrança de créditos no FLOW?",
        content: "O sistema orça o custo total dos nós com IA antes do início. Caso algum nó do pipeline falhe durante a geração, todos os nós seguintes são cancelados e 100% dos créditos não utilizados voltam imediatamente para o seu saldo.",
      },
      {
        id: "flow-cycle",
        title: "O que significa o erro 'Ciclo Detectado'?",
        content: "Os dados no FLOW devem fluir sempre para frente (Origem → Processamento → Destino). Se você conectar a saída de um nó de volta em um nó anterior criando um loop infinito, o sistema bloqueará o disparo para proteger seus créditos.",
      },
    ],
    proTip: "Use a roda do mouse para dar zoom in/out e clique e arraste com o botão esquerdo no fundo para navegar livremente pelo canvas.",
  },

  "/dashboard/credits": {
    route: "/dashboard/credits",
    title: "Planos & Créditos",
    subtitle: "Gerencie sua carteira digital, compre recargas avulsas por Pix/Cartão e audite seu extrato contábil.",
    icon: Coins,
    color: "from-amber-500 via-yellow-500 to-amber-600",
    badgeText: "Carteira Digital",
    steps: [
      {
        title: "1. Créditos Sem Prazo de Validade",
        description: "Você não perde créditos ao final do mês. Eles permanecem vinculados à sua conta até que você decida utilizá-los.",
      },
      {
        title: "2. Liberação Automática em Segundos",
        description: "Pagamentos processados via Pix com chave copia e cola/QR Code ou Cartão de Crédito com compensação imediata.",
      },
      {
        title: "3. Transparência & Estorno em Falhas",
        description: "Toda inferência que não entrega a mídia esperada estorna os créditos instantaneamente para a sua carteira.",
      },
    ],
    accordions: [
      {
        id: "cred-packages",
        title: "Quais pacotes oferecem bônus gratuitos?",
        content: "O pacote Profissional inclui 50 créditos bônus (total 550 créditos) e o pacote Criador Pro inclui 150 créditos bônus (total 1.150 créditos), reduzindo o custo médio por geração.",
      },
    ],
    proTip: "Consulte a tabela de transações abaixo dos pacotes para visualizar a data, hora, motor acionado e créditos debitados de cada geração.",
  },

  "/dashboard/library": {
    route: "/dashboard/library",
    title: "Galeria & Biblioteca de Criações",
    subtitle: "Acesse todas as suas fotos e vídeos gerados, filtre por tipo de mídia e baixe em resolução original.",
    icon: FolderKanban,
    color: "from-indigo-500 to-violet-600",
    badgeText: "Seus Ativos",
    steps: [
      {
        title: "1. Filtre por Mídia ou Palavra-Chave",
        description: "Alterne rapidamente entre Todos os Ativos, Apenas Imagens, Apenas Vídeos ou busque por termos do prompt.",
      },
      {
        title: "2. Pré-Visualização e Reprodução Contínua",
        description: "Passe o cursor sobre os vídeos para assistir ao preview instantâneo sem precisar abrir uma nova página.",
      },
      {
        title: "3. Reutilização de Prompts & Ações",
        description: "Clique em qualquer card para inspecionar parâmetros, copiar o prompt original, baixar em alta definição ou enviar para o Flow.",
      },
    ],
    accordions: [
      {
        id: "lib-download",
        title: "Os arquivos baixados possuem marcas d'água?",
        content: "Não. Todas as mídias salvas na sua galeria pertencem a você e são disponibilizadas na resolução máxima sem marcas d'água, com licença de uso comercial completa.",
      },
    ],
    proTip: "Marque com estrela suas melhores criações para encontrá-las facilmente na aba 'Favoritos'.",
  },

  "/dashboard/help": {
    route: "/dashboard/help",
    title: "Central de Ajuda & Suporte",
    subtitle: "Tire dúvidas no FAQ interativo, acompanhe o status dos clusters de IA ou abra um chamado com especialistas.",
    icon: HelpCircle,
    color: "from-cyan-500 to-blue-600",
    badgeText: "Atendimento",
    steps: [
      {
        title: "1. Busca Rápida no FAQ",
        description: "Pesquise por dúvidas sobre créditos, faturamento, modelos recomendados e direitos comerciais.",
      },
      {
        title: "2. WhatsApp Oficial",
        description: "Fale diretamente com nossa equipe técnica para atendimento em tempo real sobre contas e recargas.",
      },
      {
        title: "3. Abertura de Chamados",
        description: "Envie mensagens detalhadas pelo formulário para receber resposta formal por e-mail em até 2 horas úteis.",
      },
    ],
    accordions: [
      {
        id: "help-servers",
        title: "Como verificar se os servidores de IA estão operacionais?",
        content: "O card 'Saúde dos Motores de IA' exibe o status de disponibilidade em tempo real e o tempo médio de fila na GPU da fal.ai (~ 2.4 segundos).",
      },
    ],
    proTip: "Antes de abrir um chamado, verifique o FAQ clicando nas categorias 'Créditos', 'Imagens' ou 'Vídeos'. Quase todas as respostas comuns já estão documentadas.",
  },

  "/dashboard/admin": {
    route: "/dashboard/admin",
    title: "Painel Administrativo",
    subtitle: "Métricas gerenciais, faturamento, auditoria de custos da nuvem, SEO dinâmico e ajustes de saldo.",
    icon: ShieldCheck,
    color: "from-cyan-500 to-indigo-600",
    badgeText: "Gestão Master",
    steps: [
      {
        title: "1. Métricas de Receita e Consumo",
        description: "Monitore o volume faturado em centavos, contagem de pagamentos pagos e custo estimado de nuvem.",
      },
      {
        title: "2. Branding & SEO Dinâmico",
        description: "Edite o título do site, meta descrições e URL do favicon em tempo real diretamente pelo banco de dados.",
      },
      {
        title: "3. Ajuste de Créditos com Idempotência",
        description: "Conceda bônus ou debite créditos de qualquer usuário com justificativa registrada no Ledger contábil.",
      },
    ],
    accordions: [
      {
        id: "adm-idemp",
        title: "O que é a chave de idempotência no ajuste manual?",
        content: "A chave única impede que duplo clique ou oscilação de rede execute a mesma concessão de créditos duas vezes. Se você reenviar a mesma chave, o sistema informa '200 OK (Já processado)' sem duplicar saldo.",
      },
    ],
    proTip: "Esta rota é estritamente restrita a administradores e possui tag noindex para proteção contra mecanismos de busca.",
  },
};
