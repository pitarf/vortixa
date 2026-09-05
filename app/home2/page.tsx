"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Zap,
  Play,
  Volume2,
  VolumeX,
  Layers,
  Flame,
  ShieldCheck,
  ChevronDown,
  Clock,
  Video,
  Image as ImageIcon,
  Cpu,
  Mic,
  Maximize2,
  Sliders,
  DollarSign,
  Workflow,
  Sparkle,
  Star,
  Copy,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

/**
 * PÁGINA OFICIAL HOME2 — VORIXA 2.0 (VERSÃO DE ALTA CONVERSÃO)
 * 
 * Concepção baseada no Benchmarking de Plataformas Líderes (Octuz AI, Higgsfield, RunwayML, Luma, Kling):
 * - Hero Cinematográfico com Prova Visual Imediata e 100 Créditos Grátis.
 * - Trust Bar com Métricas Auditadas.
 * - Showcase Interativo All-in-One dos 5 Motores de Elite com abas táteis e cópia de prompt.
 * - VORIXA FLOW™ em 3 Passos Claros (Conceito -> Frame Fotorrealista -> Animação & Voz 4K).
 * - Comparador de Custos Radical (5 Assinaturas R$ 1.110/mês vs VORIXA All-in-One R$ 49/mês).
 * - Matriz de Casos de Uso por Nicho de Mercado.
 * - Planos Transparentes com Calculadora de Capacidade.
 * - FAQ com Quebra Total de Objeções (Uso Comercial, Sem Marca d'Água, Nuvem).
 */
export default function Home2Page() {
  // Estados interativos
  const [isHeroMuted, setIsHeroMuted] = useState<boolean>(true);
  const [activeEngine, setActiveEngine] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(id);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  // Dados dos 5 Motores
  const engines = [
    {
      id: "flux",
      name: "FLUX.1 Schnell",
      role: "Geração de Imagens & Conceito",
      badge: "Fotorrealismo 8K",
      tagColor: "border-cyan-500/40 text-cyan-300 bg-cyan-950/60",
      description: "Texturas de pele hiper-realistas, reflexos perfeitos e renderização de textos e logotipos sem aberrações.",
      videoUrl: "/media/landing/hero/hero_main.mp4",
      specs: ["Inferência em 1.2s", "Resolução 1024x1024", "4-12 Diffusion Steps", "Controle de Aspect Ratio"],
      samplePrompt: "Editorial high-fashion portrait, cyberpunk lighting, sharp human eyes with realistic skin texture, 8k studio shot",
    },
    {
      id: "kling",
      name: "Kling AI 1.5 Pro",
      role: "Animação & Movimento de Câmera",
      badge: "Cinema 60 FPS",
      tagColor: "border-violet-500/40 text-violet-300 bg-violet-950/60",
      description: "Física natural de tecidos, fluidos e gravidade real com controle preciso de movimentos de câmera orbitais e pans.",
      videoUrl: "/media/landing/videos/cinematic_hypercar.mp4",
      specs: ["Modo Text & Image-to-Video", "Consistência de Personagem", "Simulação de Gravidade", "Resolução 1080p nativa"],
      samplePrompt: "Futuristic flying hypercar soaring between neon skyscrapers in cyberpunk Tokyo, dynamic speed chase camera",
    },
    {
      id: "lipsync",
      name: "LivePortrait LipSync",
      role: "Influenciadores Virtuais & Voz",
      badge: "Sincronia 99.8%",
      tagColor: "border-pink-500/40 text-pink-300 bg-pink-950/60",
      description: "Transforme qualquer foto estática em um apresentador falante com micro-expressões faciais e sincronia fonética impecável.",
      videoUrl: "/media/landing/videos/lipsync_avatar.mp4",
      specs: ["Zero deformação facial", "Suporte a PT-BR e +30 idiomas", "Micro-expressões de olhos e boca", "Ideal para UGC e Ads"],
      samplePrompt: "Female tech creator speaking directly to camera with expressive micro-movements, high-engagement TikTok UGC style",
    },
    {
      id: "motion",
      name: "Motion Control 60 FPS",
      role: "Transferência de Dança & Gestos",
      badge: "Pose Transfer",
      tagColor: "border-emerald-500/40 text-emerald-300 bg-emerald-950/60",
      description: "Copie coreografias, saltos e gestos de vídeos virais e aplique diretamente a qualquer personagem 3D ou estático.",
      videoUrl: "/media/landing/videos/motion_dancer.mp4",
      specs: ["Rastreamento de esqueleto 3D", "60 FPS fluidez total", "Sem quebra de anatomia", "Viral TikTok & Reels"],
      samplePrompt: "Cybernetic street dancer performing high-energy backflip under volumetric neon rain with glowing trail particles",
    },
    {
      id: "upscale",
      name: "Creative Upscale 4K",
      role: "Masterização & Texturização",
      badge: "Ultra HD 4K",
      tagColor: "border-amber-500/40 text-amber-300 bg-amber-950/60",
      description: "Remova artefatos de compressão, adicione microporos reais e entregue arquivos prontos para veiculação em TV e cinema.",
      videoUrl: "/media/landing/videos/commercial_perfume.mp4",
      specs: ["Upscale 4x sem borrão", "Skin Enhancer de microporos", "Remoção de ruído de IA", "Master 3840x2160"],
      samplePrompt: "Golden luxury perfume bottle rotating in slow motion with fluid droplets and sparkling gold dust in 8k commercial detail",
    },
  ];

  // FAQ
  const faqs = [
    {
      q: "Preciso ter um computador potente ou placa de vídeo para usar o VORIXA?",
      a: "Não! Todo o processamento pesado de inteligência artificial roda 100% em nossos clusters de GPUs NVIDIA na nuvem. Você pode criar vídeos e imagens em 4K até mesmo do seu celular ou de um computador básico.",
    },
    {
      q: "Os vídeos e imagens gerados têm direitos comerciais livres de royalties?",
      a: "Sim. Todo o conteúdo gerado na sua conta pertence 100% a você com direitos comerciais irrestritos. Você pode veicular em anúncios pagos (Meta Ads, TikTok Ads, Google), monetizar no YouTube, vender para clientes ou usar em sua agência.",
    },
    {
      q: "As exportações possuem alguma marca d'água?",
      a: "Zero marcas d'água em todos os planos pagos. Os arquivos são exportados limpos e em resolução máxima.",
    },
    {
      q: "Como o VORIXA substitui 5 assinaturas separadas?",
      a: "Em vez de assinar Midjourney (imagens), Kling/Runway (vídeos), HeyGen (avatares), ElevenLabs (voz) e Topaz (upscale), o VORIXA integra os motores mais potentes do mundo sob uma única assinatura em reais e uma esteira visual conectada.",
    },
    {
      q: "Como funciona a garantia incondicional de 7 dias?",
      a: "Se por qualquer motivo você achar que o VORIXA não atendeu às suas expectativas, basta enviar um e-mail ou mensagem no suporte dentro de 7 dias e devolveremos 100% do valor pago, sem questionamentos.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans selection:bg-violet-500/30 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-violet-950 via-[#0E0F17] to-indigo-950 border-b border-violet-500/20 py-2.5 px-4 text-center text-xs font-medium flex items-center justify-center gap-3">
        <span className="px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 font-mono text-[10px] font-bold uppercase tracking-wider">
          NOVO • VORIXA 2.0
        </span>
        <span className="text-slate-300 hidden sm:inline">
          🚀 Motores Kling 1.5 + LipSync Instantâneo liberados. Crie seus primeiros conteúdos sem pagar nada.
        </span>
        <Link
          href="/register"
          className="text-cyan-400 font-bold hover:text-cyan-300 flex items-center gap-1 transition-colors underline underline-offset-4"
        >
          <span>Experimentar Agora</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 2. HEADER MINIMALISTA COM CTA EM DESTAQUE */}
      <header className="h-20 border-b border-border bg-background/90 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-6 md:px-12">
        <Link href="/home2" className="flex items-center gap-3 group">
          <img
            src="/logos/logo principal.png"
            alt="VORIXA Logo"
            className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950/80 border border-violet-500/30 text-violet-300 font-bold">
            PRO 2.0
          </span>
        </Link>

        {/* Links de Navegação */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <a href="#engines" className="hover:text-foreground transition-colors">Motores de IA</a>
          <a href="#flow" className="hover:text-foreground transition-colors">VORIXA FLOW</a>
          <a href="#comparison" className="hover:text-foreground transition-colors">Comparativo de Economia</a>
          <a href="#usecases" className="hover:text-foreground transition-colors">Casos de Uso</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Planos</a>
          <a href="#faq" className="hover:text-foreground transition-colors">Dúvidas</a>
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-3">
          {/* Alternador de Tema Claro / Escuro */}
          <ThemeToggle />

          <Link
            href="/login"
            className="text-xs font-semibold text-foreground px-4 py-2 rounded-xl bg-card border border-border transition-all hover:bg-slate-200 dark:hover:bg-[#1E202E] min-h-[40px] flex items-center justify-center cursor-pointer"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-xs font-bold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-105 min-h-[40px] cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 text-cyan-200" />
            <span>Criar Conta Gratuita</span>
          </Link>
        </div>
      </header>

      {/* 3. HERO CINEMATOGRÁFICO DE ALTA CONVERSÃO */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-10 relative">
        {/* Glow de Fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-violet-600/15 via-cyan-500/10 to-indigo-600/15 blur-[140px] pointer-events-none -z-10" />

        {/* Headline & Badges Centrais */}
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#13141B] border border-violet-500/30 shadow-inner text-violet-300 text-xs font-mono font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>O Estúdio Audiovisual com IA Mais Completo do Brasil</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black text-white tracking-tight leading-[1.12]">
            Seu Estúdio de Cinema e Criadores Virtuais em uma{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-violet-400 dark:via-purple-300 dark:to-cyan-300 font-serif italic font-normal">
              Única Plataforma.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Esqueça as faturas acumuladas em dólar e a roleta-russa de prompts. Una imagens fotorrealistas em <strong className="text-white">FLUX.1</strong>, vídeos cinematográficos em <strong className="text-white">Kling 1.5</strong>, sincronização labial perfeita e master 4K em minutos.
          </p>

          {/* CTA Principal com Micro-Copy de Alívio */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-violet-600/30 hover:scale-105 transition-all min-h-[52px] w-full sm:w-auto cursor-pointer"
            >
              <Zap className="w-5 h-5 text-cyan-200" />
              <span>Começar Gratuitamente • Ganhe 100 Créditos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#engines"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-all min-h-[52px] w-full sm:w-auto"
            >
              <Play className="w-4 h-4 text-slate-400" />
              <span>Ver Demonstrações dos Motores</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-slate-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Processamento 100% na Nuvem</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Direitos comerciais livres</span>
            </div>
          </div>
        </div>

        {/* Video Player Protagonista com Áudio Opcional */}
        <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden bg-black border border-[#1E202E] shadow-2xl relative aspect-video group">
          <video
            src="/media/landing/hero/hero_main.mp4"
            autoPlay
            loop
            muted={isHeroMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Badges de Destaque no Vídeo */}
          <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
            <span className="px-3 py-1 rounded-lg bg-black/80 border border-violet-500/40 text-violet-300 font-mono text-[10px] font-bold backdrop-blur-md">
              ⚡ LIVE FLUX.1 + KLING PIPELINE
            </span>
            <span className="px-3 py-1 rounded-lg bg-black/80 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold backdrop-blur-md hidden sm:inline">
              60 FPS ULTRA HD
            </span>
          </div>

          {/* Controle de Áudio Discreto */}
          <button
            onClick={() => setIsHeroMuted(!isHeroMuted)}
            className="absolute bottom-4 right-4 bg-black/80 hover:bg-black text-white text-xs font-mono font-medium px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xl backdrop-blur-md transition-all cursor-pointer hover:scale-105 border border-white/10"
          >
            {isHeroMuted ? (
              <>
                <VolumeX className="h-4 w-4 text-slate-400" />
                <span>Ouvir Áudio do Vídeo</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-cyan-400" />
                <span className="text-cyan-300">Som Ativado</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* 4. TRUST & METRICS BAR */}
      <section className="py-8 border-y border-[#1E202E]/60 bg-[#0D0E12]/80">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">+150.000</div>
            <div className="text-xs text-slate-400">Criações Renderizadas</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">99.8%</div>
            <div className="text-xs text-slate-400">Fidelidade em LipSync</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">&lt; 30s</div>
            <div className="text-xs text-slate-400">Tempo Médio de Inferência</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-violet-400 font-mono">100%</div>
            <div className="text-xs text-slate-400">Direitos Comerciais Livres</div>
          </div>
        </div>
      </section>

      {/* 5. SHOWCASE ALL-IN-ONE: OS 5 MOTORES DE ELITE COM ABAS INTERATIVAS */}
      <section id="engines" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono tracking-widest text-violet-400 uppercase font-semibold block">
            TODOS OS MOTORES LÍDERES EM UMA SÓ TELA
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            As IAs mais poderosas do planeta.{" "}
            <span className="font-serif italic font-normal text-slate-300">Sem pular de aba.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
            Selecione um motor abaixo e veja a qualidade real de renderização e as especificações de cada tecnologia.
          </p>
        </div>

        {/* Abas dos 5 Motores */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {engines.map((eng, idx) => (
            <button
              key={eng.id}
              onClick={() => setActiveEngine(idx)}
              className={`px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
                activeEngine === idx
                  ? "bg-violet-600 text-white border-violet-500 shadow-xl scale-105 font-bold"
                  : "bg-card border-border text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-[#13141B]"
              }`}
            >
              <span>{eng.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${activeEngine === idx ? "bg-violet-800 text-white" : "bg-black/20 dark:bg-black/50 text-slate-500 dark:text-slate-400"}`}>
                {eng.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Card do Motor Ativo */}
        <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Lado Esquerdo: Informações e Especificações */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className={`px-3 py-1 rounded-lg border text-[10px] font-mono font-bold uppercase inline-block ${engines[activeEngine].tagColor}`}>
                {engines[activeEngine].badge} • {engines[activeEngine].role}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {engines[activeEngine].name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {engines[activeEngine].description}
              </p>
            </div>

            {/* Bullets Técnicos */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {engines[activeEngine].specs.map((spec, sIdx) => (
                <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-300 bg-[#070709] p-3 rounded-xl border border-[#1E202E]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>

            {/* Prompt de Exemplo Copiável */}
            <div className="bg-[#070709] border border-[#1E202E] p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>PROMPT UTILIZADO:</span>
                <button
                  onClick={() => copyToClipboard(engines[activeEngine].samplePrompt, engines[activeEngine].id)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  {copiedPrompt === engines[activeEngine].id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-300 font-mono italic">
                "{engines[activeEngine].samplePrompt}"
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all hover:scale-105 min-h-[44px]"
              >
                <span>Testar este motor agora</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Lado Direito: Player de Vídeo Estático e Limpo */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-black border border-[#1E202E] aspect-video shadow-2xl flex items-center justify-center">
              <video
                key={engines[activeEngine].videoUrl}
                src={engines[activeEngine].videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. VORIXA FLOW™: DO CONCEITO AO 4K EM 3 PASSOS SIMPLES */}
      <section id="flow" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-semibold block">
            WORKFLOW INTELIGENTE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Do conceito ao vídeo final em{" "}
            <span className="font-serif italic font-normal text-slate-300">3 passos simples.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
            Cada etapa alimenta a próxima automaticamente. Elimine retrabalho e gere peças completas com consistência visual perfeita.
          </p>
        </div>

        {/* 3 Passos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Passo 1 */}
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 space-y-4 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h4 className="text-base font-bold text-white">Defina o Visual Base (FLUX.1)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Escreva o conceito ou use o assistente "Build with AI". O FLUX.1 gera a imagem do personagem ou produto com iluminação de cinema e proporção exata.
              </p>
            </div>
            <div className="p-3 bg-[#070709] border border-[#1E202E] rounded-xl text-[11px] font-mono text-cyan-400">
              ➜ Saída: Frame 8K Estático
            </div>
          </div>

          {/* Passo 2 */}
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 space-y-4 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h4 className="text-base font-bold text-white">Adicione Vida e Expressão (Kling + LipSync)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                O frame anterior ganha movimento de câmera em 60 FPS e sincronização labial direta com seu arquivo de áudio ou locução em português.
              </p>
            </div>
            <div className="p-3 bg-[#070709] border border-[#1E202E] rounded-xl text-[11px] font-mono text-violet-400">
              ➜ Saída: Vídeo com Fala e Movimento
            </div>
          </div>

          {/* Passo 3 */}
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 space-y-4 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h4 className="text-base font-bold text-white">Masterização Instantânea em 4K</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                O upscaler inteligente adiciona poros de pele, remove ruídos de compressão e exporta o arquivo pronto para anúncios no TikTok, Reels ou YouTube.
              </p>
            </div>
            <div className="p-3 bg-[#070709] border border-[#1E202E] rounded-xl text-[11px] font-mono text-emerald-400">
              ➜ Saída: Master Final 4K Ultra HD
            </div>
          </div>
        </div>
      </section>

      {/* 7. COMPARADOR DE CUSTO RADICAL: 5 ASSINATURAS SEPARADAS VS VORIXA */}
      <section id="comparison" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-semibold block">
            ECONOMIA MATEMÁTICA REAL
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Quanto custa criar separado?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Se você fosse assinar cada ferramenta isoladamente em dólar com IOF, este seria o seu custo fixo todo mês:
          </p>
        </div>

        <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl max-w-3xl mx-auto">
          {/* Tabela de Concorrentes */}
          <div className="divide-y divide-[#1E202E]/80">
            {[
              { tool: "Midjourney Pro (Imagens)", cost: "R$ 180 /mês" },
              { tool: "Kling AI Pro / Runway Gen-3 (Vídeos)", cost: "R$ 240 /mês" },
              { tool: "HeyGen / D-ID (Avatares e LipSync)", cost: "R$ 290 /mês" },
              { tool: "ElevenLabs (Voz IA)", cost: "R$ 160 /mês" },
              { tool: "Topaz Video AI (Upscale 4K)", cost: "R$ 240 /mês" },
            ].map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                  <span>{item.tool}</span>
                </div>
                <span className="font-mono text-slate-400">{item.cost}</span>
              </div>
            ))}
          </div>

          {/* Comparativo de Totais */}
          <div className="pt-6 border-t border-[#1E202E] grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#070709] p-6 rounded-2xl border border-red-500/20">
            <div className="text-center sm:text-left space-y-1">
              <div className="text-[10px] font-mono text-red-400 uppercase font-bold">Total Mensal Separado</div>
              <div className="text-3xl font-black text-red-400 line-through font-mono">
                ~R$ 1.110,00 <span className="text-xs font-normal">/mês</span>
              </div>
              <p className="text-[11px] text-slate-400">+ Risco de IOF e variações cambiais</p>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Com o VORIXA All-in-One</div>
              <div className="text-3xl font-black text-white font-mono">
                A partir de R$ 49 <span className="text-xs font-normal text-slate-300">/mês</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold">Economia de mais de 80% todo mês</p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all min-h-[48px]"
            >
              <span>Economizar e Centralizar no VORIXA</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. CASOS DE USO POR NICHO DE MERCADO */}
      <section id="usecases" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono tracking-widest text-violet-400 uppercase font-semibold block">
            APLICAÇÕES PRÁTICAS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Projetado para quem precisa de{" "}
            <span className="font-serif italic font-normal text-slate-300">resultados comerciais.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            {
              title: "E-commerce & Dropshipping",
              desc: "Crie dezenas de variações de vídeos UGC com apresentadores reais para testar criativos em Meta Ads e TikTok sem pagar influencers caros.",
              badge: "Anúncios UGC",
            },
            {
              title: "Agências de Performance",
              desc: "Entregue campanhas completas para clientes em 24h: storyboards, vídeos comerciais de alta fidelidade e dublagem labial impecável.",
              badge: "Escala de Agência",
            },
            {
              title: "Criadores & Canais Dark",
              desc: "Monetize canais virais no TikTok, Shorts e Reels com avatares ultra-realistas e animações 60 FPS sem precisar mostrar o rosto.",
              badge: "Canais Virais",
            },
            {
              title: "Produtoras & Cinema",
              desc: "Gere concept arts fotorrealistas e pré-visualizações cinematográficas em 4K para aprovação imediata de projetos.",
              badge: "Pré-produção 4K",
            },
          ].map((c, idx) => (
            <div key={idx} className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 space-y-3 flex flex-col justify-between hover:border-slate-600 transition-colors">
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded bg-violet-950/80 border border-violet-500/30 text-violet-300 font-mono text-[10px] font-bold uppercase">
                  {c.badge}
                </span>
                <h4 className="text-base font-bold text-white">{c.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. TABELA DE PLANOS & INVESTIMENTO */}
      <section id="pricing" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#13141B] border border-violet-500/30 text-violet-300 text-xs font-mono font-semibold">
            <span>Planos Flexíveis em Reais</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Escolha o plano ideal para a sua produção.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Sem pegadinhas ou cobranças em dólar. Cancele quando quiser com 1 clique.
          </p>

          {/* Seletor Mensal / Anual */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="bg-[#0D0E12] border border-[#1E202E] p-1 rounded-2xl flex items-center">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly" ? "bg-white text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "yearly" ? "bg-white text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Anual</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500 text-white font-mono">
                  -20% OFF
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Grid de 3 Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {/* Plano Creator */}
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">Plano Creator</span>
                <h4 className="text-xl font-bold text-white">Para Criadores Individuais</h4>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                  {billingCycle === "monthly" ? "R$ 49" : "R$ 39"}
                  <span className="text-xs text-slate-400 font-normal"> /mês</span>
                </div>
                <div className="text-xs text-cyan-400 font-mono font-semibold">1.000 Créditos Mensais</div>
              </div>
              <div className="space-y-2.5 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Acesso a todos os 5 motores de IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>~100 Vídeos Kling ou 1.000 Imagens FLUX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Exportações sem marca d'água</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direitos comerciais 100% livres</span>
                </div>
              </div>
            </div>
            <Link
              href="/register"
              className="w-full py-3.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-white font-bold text-xs text-center transition-all min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              Começar com Creator
            </Link>
          </div>

          {/* Plano Pro (Mais Popular) */}
          <div className="bg-[#0E0F17] border-2 border-violet-500/80 rounded-3xl p-8 space-y-6 flex flex-col justify-between relative shadow-[0_0_50px_rgba(139,92,246,0.2)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-md">
              MAIS ESCOLHIDO
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-violet-300 uppercase font-bold">Plano Pro</span>
                <h4 className="text-xl font-bold text-white">Para Afiliados & E-commerce</h4>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                  {billingCycle === "monthly" ? "R$ 119" : "R$ 95"}
                  <span className="text-xs text-slate-400 font-normal"> /mês</span>
                </div>
                <div className="text-xs text-emerald-400 font-mono font-semibold">3.000 Créditos Mensais</div>
              </div>
              <div className="space-y-2.5 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fila prioritária de GPU Turbo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>~300 Vídeos Kling ou 3.000 Imagens FLUX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Acesso ilimitado ao VORIXA FLOW™</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Upscale 4K nativo ilimitado</span>
                </div>
              </div>
            </div>
            <Link
              href="/register"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs text-center shadow-lg shadow-violet-600/30 transition-all hover:scale-105 min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              Assinar Plano Pro
            </Link>
          </div>

          {/* Plano Studio */}
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">Plano Studio</span>
                <h4 className="text-xl font-bold text-white">Para Agências & Produtoras</h4>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                  {billingCycle === "monthly" ? "R$ 289" : "R$ 229"}
                  <span className="text-xs text-slate-400 font-normal"> /mês</span>
                </div>
                <div className="text-xs text-violet-400 font-mono font-semibold">10.000 Créditos Mensais</div>
              </div>
              <div className="space-y-2.5 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Renderização paralela de alta escala</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Geração em lote (Batch Generation)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Suporte prioritário via WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Acesso antecipado a novos modelos</span>
                </div>
              </div>
            </div>
            <Link
              href="/register"
              className="w-full py-3.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-white font-bold text-xs text-center transition-all min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              Assinar Plano Studio
            </Link>
          </div>
        </div>

        {/* Garantia Incondicional de 7 Dias */}
        <div className="p-6 rounded-2xl bg-[#0D0E12] border border-emerald-500/40 max-w-2xl mx-auto text-center space-y-2 flex flex-col items-center shadow-lg">
          <ShieldCheck className="w-8 h-8 text-emerald-400 mb-1" />
          <h4 className="text-sm font-bold text-white">Garantia Incondicional de 7 Dias</h4>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            Experimente o VORIXA sem risco algum. Se você não ficar 100% satisfeito com a qualidade dos vídeos e imagens, devolvemos seu dinheiro integralmente.
          </p>
        </div>
      </section>

      {/* 10. FAQ & QUEBRA DE OBJEÇÕES */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase font-semibold block">
            DÚVIDAS FREQUENTES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <div
              key={idx}
              className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white cursor-pointer"
              >
                <span>{f.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? "rotate-180 text-violet-400" : ""}`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-[#1E202E]/60 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 11. FINAL CTA HOOK DE CONVERSÃO */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-violet-950 via-[#0E0F17] to-indigo-950 border border-violet-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase font-bold block">
              PRONTO PARA REVOLUCIONAR SUA PRODUÇÃO AUDIOVISUAL?
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Crie Seu Primeiro Vídeo Cinematográfico nos Próximos 2 Minutos.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Junte-se a criadores, marcas e agências que já abandonaram a roleta-russa de prompts e economizam milhares de reais todos os meses.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold text-xs sm:text-sm shadow-2xl hover:bg-slate-200 transition-all hover:scale-105 min-h-[50px] w-full sm:w-auto cursor-pointer"
            >
              <Zap className="w-4 h-4 text-violet-600 shrink-0 fill-current" />
              <span className="text-slate-950 font-black">Criar Conta Gratuita e Resgatar 100 Créditos ⚡</span>
            </Link>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Leva menos de 30 segundos • Sem cartão de crédito • Acesso imediato
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="border-t border-[#1E202E]/80 bg-[#070709] py-12 px-6 md:px-12 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/logos/logo principal.png" alt="VORIXA" className="h-7 w-auto" />
          <span className="font-mono text-[11px]">© 2026 VORIXA AI Technologies. Todos os direitos reservados.</span>
        </div>
        <div className="flex items-center gap-6 text-[11px]">
          <a href="#engines" className="hover:text-white transition-colors">Motores</a>
          <a href="#flow" className="hover:text-white transition-colors">Workflows</a>
          <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
          <Link href="/login" className="hover:text-white transition-colors">Entrar</Link>
        </div>
      </footer>
    </div>
  );
}
