"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Flame,
  Sparkles,
  Coins,
  Play,
  RefreshCw,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  ShieldCheck,
  Crown,
  Eye,
  Lock,
  Download,
  ChevronLeft,
  ChevronRight,
  Zap,
  Boxes,
  Maximize2,
  Check,
} from "lucide-react";
import { AgeVerificationModal } from "@/components/tools/hot/AgeVerificationModal";

interface HotModel {
  id: string;
  name: string;
  badge: string;
  type: "image" | "video";
  cost: number;
  description: string;
  speed: string;
  requiresImage?: boolean;
}

const HOT_MODELS: HotModel[] = [
  {
    id: "wavespeed/wan-2.2/text-to-image-realism",
    name: "VORIXA HyperReal (Foto Realista 8K)",
    badge: "Máximo Fotorrealismo 👑",
    type: "image",
    cost: 4,
    description: "Motor WAN 2.2 com foco em pele crua, micro-texturas reais, iluminação natural e zero aspecto de plástico ou 3D.",
    speed: "~ 8s",
    requiresImage: false,
  },
  {
    id: "wavespeed/chroma",
    name: "VORIXA Chroma (Nudez Total)",
    badge: "100% Sem Censura 🔞",
    type: "image",
    cost: 3,
    description: "Motor sem travas com calibração fotográfica para nudez explícita, anatomia natural e detalhes íntimos.",
    speed: "~ 6s",
    requiresImage: false,
  },
  {
    id: "wavespeed/wan-2.2-spicy",
    name: "VORIXA Motion Hot (Vídeo +18 Fluido)",
    badge: "Alta Eficiência 🎥",
    type: "video",
    cost: 15,
    description: "Animação de fotos e movimentos corporais explícitos sem filtros. Rápido e ultra-estável.",
    speed: "~ 30s",
    requiresImage: true,
  },
  {
    id: "wavespeed/minimax-h3-spicy",
    name: "VORIXA Live Voice Hot (Vídeo com Áudio)",
    badge: "Com Áudio Nativo 🔊",
    type: "video",
    cost: 18,
    description: "Gera clipes de vídeo sem censura com animação expressiva e áudio ambiente/gemidos nativos.",
    speed: "~ 35s",
    requiresImage: true,
  },
  {
    id: "wavespeed/seedance-2.5-spicy",
    name: "VORIXA Ultra Cinema Hot (Vídeo 4K)",
    badge: "Qualidade Máxima 👑",
    type: "video",
    cost: 30,
    description: "Motor cinematográfico pesado para movimentos complexos e alta definição anatômica.",
    speed: "~ 50s",
    requiresImage: true,
  },
];

const HOT_PROMPT_SUGGESTIONS = [
  "Mulher deslumbrante em lingerie de seda preta ao lado de uma janela iluminada pelo luar, iluminação suave e dramática, retrato fotográfico ultra realista 8k.",
  "Modelo fitness em ensaio sensual na praia ao pôr do sol, biquíni molhado, gotas de água brilhando na pele, foto cinematográfica de alta definição.",
  "Retrato íntimo de uma jovem mulher em um quarto sofisticado, iluminação dourada e calorosa, textura de pele natural, pose elegante e provocante.",
];

export default function HotGenerationClient() {
  const router = useRouter();

  // Verificação de Maioridade no LocalStorage
  const [hasVerifiedAge, setHasVerifiedAge] = useState<boolean>(false);
  const [isCheckingAge, setIsCheckingAge] = useState<boolean>(true);

  // Estados de Saldo
  const [balance, setBalance] = useState<number>(2480);
  const [creditMode, setCreditMode] = useState<string>("LIMITED");

  // Estados do Formulário
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [selectedModel, setSelectedModel] = useState<HotModel>(HOT_MODELS[0]);
  const [prompt, setPrompt] = useState<string>(HOT_PROMPT_SUGGESTIONS[0]);
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>("");
  const [isUploadingRef, setIsUploadingRef] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<string>("9:16");
  const [duration, setDuration] = useState<string>("5");
  const [resolution, setResolution] = useState<string>("720p");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStepText, setActiveStepText] = useState<string>("");
  const [resultMediaUrl, setResultMediaUrl] = useState<string>("");
  const [historyItems, setHistoryItems] = useState<Array<{ id: string; url: string; mimeType?: string; name?: string }>>([]);
  const [activeHistoryIndex, setActiveHistoryIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Carrega histórico de gerações recentes do usuário
  const loadRecentHistory = async () => {
    try {
      const res = await fetch("/api/library?limit=24");
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const list = data.items
            .filter((it: any) => Boolean(it.url))
            .map((it: any) => ({
              id: it.id,
              url: it.url,
              mimeType: it.mimeType,
              name: it.name,
            }));
          setHistoryItems(list);
          if (list[0] && !resultMediaUrl) {
            setResultMediaUrl(list[0].url);
          }
        }
      }
    } catch {}
  };

  useEffect(() => {
    const verified = localStorage.getItem("vorixa_age_verified_18");
    if (verified === "true") {
      setHasVerifiedAge(true);
    }
    setIsCheckingAge(false);

    // Carrega Saldo do Usuário
    fetch("/api/tools/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.balance !== undefined) setBalance(data.balance);
        if (data.creditMode) setCreditMode(data.creditMode);
      })
      .catch(() => {});

    loadRecentHistory();
  }, []);

  const handleDownload = async () => {
    if (!resultMediaUrl) return;
    try {
      toast.info("Iniciando download...");
      const res = await fetch(resultMediaUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const ext = resultMediaUrl.endsWith(".mp4") ? "mp4" : "jpg";
      a.download = `vorixa-hot-${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download concluído com sucesso!");
    } catch {
      window.open(resultMediaUrl, "_blank");
    }
  };

  const handleSetReference = (urlToUse?: string) => {
    const targetUrl = urlToUse || resultMediaUrl;
    if (!targetUrl) {
      toast.error("Nenhuma foto disponível para definir como referência.");
      return;
    }
    if (targetUrl.endsWith(".mp4")) {
      toast.error("Apenas fotos/imagens podem ser usadas como referência visual.");
      return;
    }
    setReferenceImageUrl(targetUrl);
    toast.success("Foto definida como referência para o próximo prompt!");
    const el = document.getElementById("hot-reference-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleVary = () => {
    handleSetReference();
  };

  const handleUpscale = () => {
    if (!resultMediaUrl) return;
    router.push(`/dashboard/tools/upscale?sourceUrl=${encodeURIComponent(resultMediaUrl)}`);
  };

  const handleSendToFlow = () => {
    if (!resultMediaUrl) return;
    router.push(`/dashboard/flow?assetUrl=${encodeURIComponent(resultMediaUrl)}`);
  };

  const handleConfirmAge = () => {
    localStorage.setItem("vorixa_age_verified_18", "true");
    setHasVerifiedAge(true);
    toast.success("Acesso confirmado. Bem-vindo ao Gerador Hot (+18).");
  };

  const handleCancelAge = () => {
    router.push("/dashboard");
  };

  // Upload de Imagem de Referência
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      if (!res.ok) throw new Error("Falha no upload da foto.");
      const data = await res.json();
      setReferenceImageUrl(data.url);
      toast.success("Foto de referência anexada com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro no upload.");
    } finally {
      setIsUploadingRef(false);
    }
  };

  // Disparo de Geração
  const handleGenerate = async () => {
    if (isGenerating) return;
    if (!prompt.trim() && !referenceImageUrl) {
      toast.error("Insira a descrição ou anexe uma foto de referência.");
      return;
    }

    // Para modelos de vídeo, uma foto de referência é obrigatória para animar
    if (selectedModel.type === "video" && !referenceImageUrl) {
      toast.error("Para gerar vídeos sem censura (+18), selecione ou anexe uma foto de referência para ser animada.");
      const el = document.getElementById("hot-reference-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Cálculo de créditos conforme duração e qualidade (480p, 720p, 1080p, 4k)
    let multiplier = 1;
    if (selectedModel.type === "video") {
      if (duration === "10") multiplier *= 1.8;
      if (duration === "15") multiplier *= 2.5;
      if (resolution === "1080p") multiplier *= 1.5;
      if (resolution === "4k") multiplier *= 2.5;
    }
    const cost = Math.round(selectedModel.cost * multiplier);

    if (creditMode !== "UNLIMITED" && balance < cost) {
      toast.error(`Saldo insuficiente (${balance} créditos disponíveis. Custo: ${cost}).`);
      return;
    }

    try {
      setIsGenerating(true);
      setActiveStepText("Conectando ao cluster neural VORIXA sem censura");

      const inputs: Record<string, any> = {
        prompt,
        aspect_ratio: aspectRatio,
        duration,
        resolution,
      };

      if (referenceImageUrl) {
        inputs.image_url = referenceImageUrl;
        inputs.image = referenceImageUrl;
        inputs.reference_image_url = referenceImageUrl;
      }

      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: selectedModel.type === "video" ? "wan-video" : "gerador-imagem",
          modelId: selectedModel.id,
          inputs,
          idempotencyKey: `hot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Falha ao iniciar geração no cluster neural.");
      }

      const job = await res.json();
      toast.info("Processando nos servidores neurais VORIXA...");

      // Polling de acompanhamento do Job
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        try {
          const pollRes = await fetch(`/api/tools/job/${job.id}`);
          if (pollRes.ok) {
            const data = await pollRes.json();
            if (data.status === "COMPLETED") {
              clearInterval(interval);
              setIsGenerating(false);
              setActiveStepText("");
              const url = data.outputs?.[0]?.fileUrl || "";
              setResultMediaUrl(url);
              loadRecentHistory();
              toast.success("Conteúdo renderizado com sucesso!");
            } else if (data.status === "FAILED") {
              clearInterval(interval);
              setIsGenerating(false);
              setActiveStepText("");
              toast.error(data.error || "A geração falhou na GPU.");
            } else {
              setActiveStepText(
                attempts < 4
                  ? "Desativando filtros e carregando pesos anatômicos"
                  : attempts < 8
                  ? "Renderizando microtexturas corporais e iluminação"
                  : "Finalizando codificação sem censura"
              );
            }
          }
        } catch {}

        if (attempts > 90) {
          clearInterval(interval);
          setIsGenerating(false);
          setActiveStepText("");
          toast.error("Tempo limite de resposta excedido.");
        }
      }, 3000);
    } catch (err: any) {
      setIsGenerating(false);
      setActiveStepText("");
      toast.error(err.message || "Erro ao processar criação.");
    }
  };

  if (isCheckingAge) {
    return <div className="min-h-screen bg-[#070709]" />;
  }

  return (
    <>
      {!hasVerifiedAge && (
        <AgeVerificationModal
          onConfirm={handleConfirmAge}
          onCancel={handleCancelAge}
        />
      )}

      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Cabeçalho Visual da Ferramenta */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/40 via-[#0D0E12] to-purple-950/30 border border-rose-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
                <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                <span>VORIXA NEURAL • MODO SEM CENSURA (+18)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                Gerador Hot & Sensual
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Crie ensaios sensuais, fotos boudoir e animações realistas sem censura com motores treinados em anatomia humana precisa.
              </p>
            </div>

            {/* Saldo de Créditos */}
            <div className="flex items-center gap-3 bg-[#13141B]/90 border border-rose-500/20 px-4 py-2.5 rounded-2xl shrink-0">
              <Coins className="w-5 h-5 text-rose-400" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Seu Saldo</span>
                <span className="text-sm font-black text-white font-mono">
                  {creditMode === "UNLIMITED" ? "Ilimitado 👑" : `${balance} créditos`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de 2 Colunas: Configurações à Esquerda e Visualizador à Direita */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Coluna Esquerda (Controles) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Card 1: Tipo de Mídia (Foto vs Vídeo) */}
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
              <label className="text-xs font-bold text-slate-300 block">1. Formato de Conteúdo</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#070709] border border-[#1E202E] rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMediaType("image");
                    setSelectedModel(HOT_MODELS[0]);
                  }}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    mediaType === "image"
                      ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Foto Sensual (+18)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaType("video");
                    setSelectedModel(HOT_MODELS[2]);
                  }}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    mediaType === "video"
                      ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Vídeo Sensual (+18)</span>
                </button>
              </div>
            </div>

            {/* Card 2: Seleção do Modelo Neural */}
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
              <label className="text-xs font-bold text-slate-300 block">2. Motor VORIXA Neural</label>
              <div className="grid grid-cols-1 gap-2.5">
                {HOT_MODELS.filter((m) => m.type === mediaType).map((model) => {
                  const isSelected = selectedModel.id === model.id;
                  return (
                    <div
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-rose-950/20 border-rose-500/50 shadow-sm"
                          : "bg-[#070709] border-[#1E202E] hover:border-slate-700"
                      }`}
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white">{model.name}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            {model.badge}
                          </span>
                          {model.requiresImage && (
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider flex items-center gap-1 shadow-xs">
                              📷 Requer Imagem
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{model.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-rose-400 block">
                          {model.cost} cr
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{model.speed}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 3: Foto de Referência (Usar como Referência) */}
            <div
              id="hot-reference-section"
              className={`bg-[#0D0E12] border rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl transition-all ${
                referenceImageUrl
                  ? "border-rose-500/50 bg-gradient-to-b from-rose-950/20 to-[#0D0E12]"
                  : selectedModel.type === "video"
                  ? "border-amber-500/50 bg-gradient-to-b from-amber-950/15 to-[#0D0E12]"
                  : "border-[#1E202E]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    <span>3. Foto de Referência</span>
                  </label>
                  {referenceImageUrl ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Referência Ativa
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        selectedModel.type === "video"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
                          : "text-slate-500 bg-[#13141B]"
                      }`}
                    >
                      {selectedModel.type === "video" ? "Obrigatório para Vídeo" : "Opcional"}
                    </span>
                  )}
                </div>

                {referenceImageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setReferenceImageUrl("");
                      toast.info("Foto de referência removida.");
                    }}
                    className="text-slate-400 hover:text-rose-400 text-xs font-medium cursor-pointer flex items-center gap-1 min-h-[32px] px-2 rounded-lg hover:bg-rose-950/30 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remover</span>
                  </button>
                )}
              </div>

              {/* Se houver foto de referência selecionada */}
              {referenceImageUrl ? (
                <div className="p-3 rounded-xl bg-[#070709] border border-rose-500/30 flex items-center gap-3">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-rose-500/50 shrink-0 bg-black shadow-md shadow-rose-950/40">
                    <img
                      src={referenceImageUrl}
                      alt="Referência Ativa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center p-0.5">
                      <span className="text-[9px] font-mono text-rose-300 font-bold tracking-wider">GUIA</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Foto Guia Definida</span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                        Pronta
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {selectedModel.type === "video"
                        ? "Esta imagem será animada com movimentos corporais sem censura."
                        : "Usada como modelo de anatomia, pose e iluminação no próximo prompt."}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <label className="px-2.5 py-1.5 rounded-lg bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all">
                        {isUploadingRef ? (
                          <RefreshCw className="w-3 h-3 animate-spin text-rose-400" />
                        ) : (
                          <Upload className="w-3 h-3 text-rose-400" />
                        )}
                        <span>Trocar Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadImage}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setResultMediaUrl(referenceImageUrl);
                          setIsFullscreen(true);
                        }}
                        className="px-2 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#13141B] cursor-pointer text-[11px] font-semibold flex items-center gap-1"
                        title="Ver foto em tela cheia"
                      >
                        <Maximize2 className="w-3 h-3 text-cyan-400" />
                        <span>Ver Foto</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Estado Vazio: Slot de Upload ou Selecionar Recente */
                <div className="space-y-2.5">
                  {selectedModel.type === "video" && (
                    <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        Vídeos sem censura animam uma foto de base. Carregue uma imagem ou clique em <strong>"Usar como Referência"</strong> em qualquer foto recente ao lado.
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="flex-1 border-2 border-dashed border-[#1E202E] hover:border-rose-500/60 rounded-xl p-3 sm:p-4 flex items-center justify-center gap-2.5 text-slate-400 hover:text-slate-200 transition-all cursor-pointer min-h-[56px] bg-[#070709] group">
                      {isUploadingRef ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-rose-400 shrink-0" />
                      ) : (
                        <Upload className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform shrink-0" />
                      )}
                      <div className="text-left">
                        <span className="text-xs font-bold block text-slate-300 group-hover:text-white">
                          Carregar Foto do Seu Dispositivo
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">PNG, JPG ou WebP até 50MB</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="hidden"
                      />
                    </label>

                    {/* Atalho para pegar a última foto gerada se houver */}
                    {historyItems.some((it) => !it.url.endsWith(".mp4")) && (
                      <button
                        type="button"
                        onClick={() => {
                          const lastImg = historyItems.find((it) => !it.url.endsWith(".mp4"));
                          if (lastImg) {
                            handleSetReference(lastImg.url);
                          }
                        }}
                        className="px-3 py-2.5 rounded-xl bg-[#13141B] hover:bg-rose-950/30 border border-[#1E202E] hover:border-rose-500/40 text-slate-300 hover:text-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[56px]"
                        title="Usar a imagem gerada mais recente como referência"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="text-left">
                          <span className="block text-[11px]">Usar Última Foto</span>
                          <span className="block text-[9px] font-mono text-slate-500">Geração Recente</span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Card 4: Descrição e Prompt */}
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">4. Prompt & Estética Desejada</label>
                <div className="flex gap-1.5">
                  {HOT_PROMPT_SUGGESTIONS.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPrompt(HOT_PROMPT_SUGGESTIONS[i])}
                      className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#13141B] text-slate-400 hover:text-rose-300 border border-[#1E202E] cursor-pointer"
                    >
                      Ideia #{i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Descreva a modelo, a lingerie, o ambiente, a pose e a iluminação desejada..."
                className="w-full bg-[#070709] border border-[#1E202E] rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:border-rose-500 outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Card 5: Proporção e Duração */}
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 block">Proporção</label>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-[#070709] border border-[#1E202E] rounded-xl">
                    {["9:16", "16:9", "1:1"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setAspectRatio(r)}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          aspectRatio === r ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedModel.type === "video" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 block">Duração</label>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-[#070709] border border-[#1E202E] rounded-xl">
                      {["5", "8", "10"].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDuration(d)}
                          className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            duration === d ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {d}s
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Seletor de Qualidade / Resolução (Exclusivo para Vídeos Hot) */}
              {selectedModel.type === "video" && (
                <div className="space-y-1.5 pt-2 border-t border-[#1E202E]/60">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-400 block">Qualidade de Renderização</label>
                    <span className="text-[10px] text-rose-400 font-mono">
                      {resolution === "480p" && "Rápido / Econômico"}
                      {resolution === "720p" && "HD Padrão (Recomendado)"}
                      {resolution === "1080p" && "Full HD Máxima Nitidez"}
                      {resolution === "4k" && "Ultra HD 4K Máximo"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#070709] border border-[#1E202E] rounded-xl">
                    {["480p", "720p", "1080p", "4k"].map((res) => {
                      const isSelected = resolution === res;
                      return (
                        <button
                          key={res}
                          type="button"
                          onClick={() => setResolution(res)}
                          className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            isSelected ? "bg-rose-600 text-white shadow-md shadow-rose-600/30" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {res}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Barra de Ação e Disparo */}
            <div className="bg-[#0D0E12] border border-rose-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Custo Estimado</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {(() => {
                      let multiplier = 1;
                      if (selectedModel.type === "video") {
                        if (duration === "10") multiplier *= 1.8;
                        if (duration === "15") multiplier *= 2.5;
                        if (resolution === "1080p") multiplier *= 1.5;
                        if (resolution === "4k") multiplier *= 2.5;
                      }
                      return Math.round(selectedModel.cost * multiplier);
                    })()} créditos
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="py-3.5 px-6 rounded-xl text-xs font-extrabold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:opacity-95 text-white shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                style={{ minHeight: "44px" }}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{activeStepText || "Renderizando..."}</span>
                  </>
                ) : selectedModel.requiresImage && !referenceImageUrl ? (
                  <>
                    <Upload className="w-4 h-4 text-amber-300" />
                    <span>Selecione uma Foto para Gerar (+18)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Gerar Sem Censura (+18)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Coluna Direita (Player / Preview + Gerações Recentes) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E202E] pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-bold text-white tracking-wide">Área de Exibição</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">Privado & Criptografado</span>
                  {resultMediaUrl && (
                    <button
                      type="button"
                      onClick={() => setIsFullscreen(true)}
                      className="p-1.5 rounded-lg bg-[#070709] border border-[#1E202E] hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="Tela Cheia"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Viewport Principal */}
              <div className="relative aspect-[9/16] w-full max-h-[540px] bg-[#070709] border border-[#1E202E] rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
                {isGenerating ? (
                  <div className="text-center p-6 space-y-3 animate-in fade-in">
                    <div className="w-12 h-12 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin mx-auto" />
                    <p className="text-xs font-bold text-white">{activeStepText}</p>
                    <p className="text-[10px] text-slate-500">Aguarde a GPU processar a imagem sem censura</p>
                  </div>
                ) : resultMediaUrl ? (
                  resultMediaUrl.endsWith(".mp4") || selectedModel.type === "video" ? (
                    <video
                      src={resultMediaUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={resultMediaUrl}
                      alt="Resultado Hot"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-500">
                    <Eye className="w-8 h-8 mx-auto opacity-30 text-rose-400" />
                    <p className="text-xs font-medium">Nenhum conteúdo gerado ainda.</p>
                    <p className="text-[10px]">Configure o prompt e clique em Gerar Sem Censura (+18).</p>
                  </div>
                )}
              </div>

              {/* Barra de Ações Rápidas da Mídia Ativa (Baixar, Usar como Referência, Upscale 4K, No Canvas) */}
              {Boolean(resultMediaUrl) && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1E202E]">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer min-h-[44px] touch-manipulation active:scale-[0.98]"
                    title="Baixar em alta resolução"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Baixar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetReference(resultMediaUrl)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-950/40 border border-rose-500/50 hover:border-rose-400 hover:bg-rose-950/60 text-rose-200 hover:text-white text-xs font-bold transition-all cursor-pointer min-h-[44px] touch-manipulation active:scale-[0.98] shadow-sm shadow-rose-950/40"
                    title="Usar esta foto como referência para o próximo prompt ou animação de vídeo"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">Usar como Referência</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUpscale}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer min-h-[44px] touch-manipulation active:scale-[0.98]"
                    title="Melhorar qualidade em 4K"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Upscale 4K</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendToFlow}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer min-h-[44px] touch-manipulation active:scale-[0.98]"
                    title="Abrir no Canvas VORIXA FLOW"
                  >
                    <Boxes className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">No Canvas</span>
                  </button>
                </div>
              )}

              {/* Seção de Gerações Recentes do Usuário */}
              {historyItems.length > 0 && (
                <div className="space-y-2.5 pt-3 border-t border-[#1E202E]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                      Gerações Recentes
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const prev = activeHistoryIndex > 0 ? activeHistoryIndex - 1 : historyItems.length - 1;
                          setActiveHistoryIndex(prev);
                          setResultMediaUrl(historyItems[prev].url);
                        }}
                        className="p-1.5 rounded-lg bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-300 hover:text-white cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Anterior"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = activeHistoryIndex < historyItems.length - 1 ? activeHistoryIndex + 1 : 0;
                          setActiveHistoryIndex(next);
                          setResultMediaUrl(historyItems[next].url);
                        }}
                        className="p-1.5 rounded-lg bg-[#070709] border border-[#1E202E] hover:border-slate-600 text-slate-300 hover:text-white cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Próxima"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Grid de Miniaturas Clicáveis */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
                    {historyItems.map((item, idx) => {
                      const isActive = resultMediaUrl === item.url;
                      const isVid = item.mimeType?.includes("video") || item.url.endsWith(".mp4");
                      const isCurrentRef = referenceImageUrl === item.url;
                      return (
                        <div
                          key={item.id || idx}
                          className={`relative rounded-xl overflow-hidden border aspect-square transition-all group min-h-[52px] ${
                            isActive
                              ? "border-rose-500 shadow-md shadow-rose-500/30 ring-2 ring-rose-500 scale-[1.02]"
                              : "border-[#1E202E] hover:border-slate-600 opacity-80 hover:opacity-100"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveHistoryIndex(idx);
                              setResultMediaUrl(item.url);
                            }}
                            className="w-full h-full block cursor-pointer"
                            title="Visualizar mídia"
                          >
                            {isVid ? (
                              <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                                <video src={item.url} className="w-full h-full object-cover" muted />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                                </div>
                              </div>
                            ) : (
                              <img
                                src={item.url}
                                alt={item.name || `Geração ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                loading="lazy"
                              />
                            )}
                          </button>

                          {/* Badge de Referência Ativa */}
                          {isCurrentRef && (
                            <div className="absolute top-1 left-1 bg-rose-600/90 backdrop-blur-xs text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow z-10 pointer-events-none">
                              REF
                            </div>
                          )}

                          {/* Botão Hover de Usar como Referência (Apenas para Imagens) */}
                          {!isVid && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetReference(item.url);
                              }}
                              className={`absolute bottom-1 inset-x-1 py-1 rounded bg-black/85 hover:bg-rose-600 text-[9px] font-bold text-white transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 z-10 cursor-pointer shadow ${
                                isCurrentRef ? "!opacity-100 !bg-rose-600" : ""
                              }`}
                              title="Definir esta foto como referência"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{isCurrentRef ? "Ref Ativa" : "Usar Ref"}</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Tela Cheia */}
      {isFullscreen && Boolean(resultMediaUrl) && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-3 sm:p-6 backdrop-blur-md overscroll-contain"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full flex items-center justify-between pb-3 max-w-6xl">
            <span className="text-xs font-mono text-slate-400">Visualização Completa (Sem Censura)</span>
            <div className="flex items-center gap-2">
              {!resultMediaUrl.endsWith(".mp4") && (
                <button
                  type="button"
                  onClick={() => handleSetReference(resultMediaUrl)}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-500/60 hover:border-rose-400 text-rose-200 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Definir esta foto como referência ativa"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Usar como Referência</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl bg-[#0D0E12] border border-[#1E202E] hover:border-slate-700 text-slate-300 hover:text-white transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Baixar</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-[#0D0E12] border border-[#1E202E] hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center max-w-6xl max-h-[85vh] w-full overflow-hidden rounded-2xl bg-black">
            {resultMediaUrl.endsWith(".mp4") || selectedModel.type === "video" ? (
              <video
                src={resultMediaUrl}
                controls
                autoPlay
                loop
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
              />
            ) : (
              <img
                src={resultMediaUrl}
                alt="Fullscreen Preview"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
