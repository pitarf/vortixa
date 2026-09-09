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
}

const HOT_MODELS: HotModel[] = [
  {
    id: "wavespeed/pony-diffusion-v6-xl",
    name: "Pony Diffusion V6 XL (Sem Censura)",
    badge: "O Mais Popular 🔥",
    type: "image",
    cost: 3,
    description: "Modelo referência mundial para poses sensuais, lingerie, boudoir e nudez anatômica precisa.",
    speed: "~ 8s",
  },
  {
    id: "wavespeed/flux-uncensored-dev",
    name: "FLUX.1 Uncensored (Fotorrealismo)",
    badge: "Pele Real 👑",
    type: "image",
    cost: 4,
    description: "Fotorrealismo extremo no estilo criadora OnlyFans/Instagram com textura de pele real.",
    speed: "~ 14s",
  },
  {
    id: "wavespeed/wan-2.1-uncensored-i2v",
    name: "Wan 2.1 Motion Hot (Vídeo Sem Censura)",
    badge: "Vídeo 18+ 🎥",
    type: "video",
    cost: 15,
    description: "Dê vida e movimento fluido a fotos sensuais sem travas ou filtros de censura.",
    speed: "~ 45s",
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
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStepText, setActiveStepText] = useState<string>("");
  const [resultMediaUrl, setResultMediaUrl] = useState<string>("");

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
  }, []);

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
      toast.success("Foto de referência anexada!");
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

    const durationMultiplier = selectedModel.type === "video" && duration === "10" ? 2 : 1;
    const cost = selectedModel.cost * durationMultiplier;

    if (creditMode !== "UNLIMITED" && balance < cost) {
      toast.error(`Saldo insuficiente (${balance} créditos disponíveis. Custo: ${cost}).`);
      return;
    }

    try {
      setIsGenerating(true);
      setActiveStepText("Conectando ao cluster WaveSpeed AI sem censura");

      const inputs: Record<string, any> = {
        prompt,
        aspect_ratio: aspectRatio,
        duration,
      };

      if (referenceImageUrl) {
        inputs.image_url = referenceImageUrl;
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
        throw new Error(err.error || "Falha ao iniciar geração na WaveSpeed.");
      }

      const job = await res.json();
      toast.info("Processando no cluster da WaveSpeed AI...");

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
                <span>WAVESPEED AI • MODO SEM CENSURA (+18)</span>
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

            {/* Card 2: Seleção do Modelo da WaveSpeed */}
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
              <label className="text-xs font-bold text-slate-300 block">2. Motor WaveSpeed AI</label>
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
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{model.name}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            {model.badge}
                          </span>
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

            {/* Card 3: Descrição e Foto de Referência */}
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">3. Prompt & Estética Desejada</label>
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
                className="w-full bg-[#070709] border border-[#1E202E] rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:border-rose-500 outline-none transition-colors resize-none"
              />

              {/* Upload de Referência */}
              <div className="pt-2 border-t border-[#1E202E]/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-lg bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer transition-all">
                    {isUploadingRef ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span>{referenceImageUrl ? "Trocar Foto Guia" : "Anexar Foto de Modelo Guia"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      className="hidden"
                    />
                  </label>

                  {referenceImageUrl && (
                    <button
                      type="button"
                      onClick={() => setReferenceImageUrl("")}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 cursor-pointer"
                      title="Remover foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <span className="text-[11px] text-slate-500 font-mono">
                  {referenceImageUrl ? "Foto ativa ✅" : "Opcional"}
                </span>
              </div>
            </div>

            {/* Card 4: Proporção e Duração */}
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
                    <div className="grid grid-cols-2 gap-1 p-1 bg-[#070709] border border-[#1E202E] rounded-xl">
                      {["5", "10"].map((d) => (
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
                    {selectedModel.cost * (selectedModel.type === "video" && duration === "10" ? 2 : 1)} créditos
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
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Gerar Sem Censura (+18)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Coluna Direita (Player / Preview) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-wide">Área de Exibição</span>
                <span className="text-[10px] font-mono text-slate-400">Privado & Criptografado</span>
              </div>

              {/* Viewport Principal */}
              <div className="relative aspect-[9/16] w-full max-h-[580px] bg-[#070709] border border-[#1E202E] rounded-2xl overflow-hidden flex items-center justify-center">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
