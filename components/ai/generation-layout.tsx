"use client";

import React, { useState, useEffect } from "react";
import {
  Coins,
  Play,
  AlertCircle,
  Download,
  AlertTriangle,
  ArrowRight,
  Wand2,
  Maximize2,
  X,
  Eye,
  Sparkles,
  Cpu,
  Sliders,
  Tv,
} from "lucide-react";
import { toast } from "sonner";
import { PromptEngine } from "@/services/ai/prompt-engine.service";

interface GenerationLayoutProps {
  toolSlug: string;
  title: string;
  description: string;
  selectedModelId?: string;
  customCost?: number;
  initialInputs?: Record<string, any>;
  children: (params: {
    setInputVal: (key: string, val: any) => void;
    inputs: Record<string, any>;
  }) => React.ReactNode;
}

export function GenerationLayout({
  toolSlug,
  title,
  description,
  selectedModelId,
  customCost,
  initialInputs = {},
  children,
}: GenerationLayoutProps) {
  const [balance, setBalance] = useState<number>(0);
  const [creditMode, setCreditMode] = useState<string>("LIMITED");
  const [tool, setTool] = useState<any>(null);
  const [inputs, setInputs] = useState<Record<string, any>>(initialInputs);
  const [generating, setGenerating] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [step, setStep] = useState<string>("");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Aba ativa no mobile: "config" ou "result"
  const [mobileTab, setMobileTab] = useState<"config" | "result">("config");

  // Modal de Aviso de Prompt Básico
  const [showBasicWarningModal, setShowBasicWarningModal] = useState(false);

  // Modal de Visualização em Tela Cheia (Lightbox)
  const [fullscreenMedia, setFullscreenMedia] = useState<{ url: string; isVideo: boolean } | null>(null);

  // Busca configurações e saldos do backend
  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/tools/config");
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
        setCreditMode(data.creditMode);
        const currentTool = data.tools?.find((t: any) => t.slug === toolSlug);
        setTool(currentTool);
      }
    } catch (err) {
      console.error("Erro ao buscar configurações:", err);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [toolSlug]);

  // Cronômetro suave durante a geração
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (generating) {
      setElapsedSeconds(0);
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [generating]);

  // Fechamento de Lightbox com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreenMedia(null);
        setShowBasicWarningModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const setInputVal = (key: string, val: any) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const handleInitiateGenerate = () => {
    const promptText = inputs.prompt || "";
    if (typeof promptText === "string" && promptText.trim()) {
      const analysis = PromptEngine.analyzePromptDensity(promptText);
      if (analysis.isBasic) {
        setShowBasicWarningModal(true);
        return;
      }
    }
    executeGeneration();
  };

  const executeGeneration = async () => {
    setShowBasicWarningModal(false);
    if (generating) return;

    setError("");
    setGenerating(true);
    setStep("Conectando ao cluster neural");
    setStepIndex(1);

    // Em mobile, comuta suavemente para a aba de Resultado para acompanhar o progresso
    setMobileTab("result");

    const cost = customCost !== undefined ? customCost : (tool?.model?.creditCost || 0);
    if (creditMode !== "UNLIMITED" && balance < cost) {
      toast.error(`Saldo insuficiente. Você possui ${balance} créditos e a geração requer ${cost}.`);
      setError("Você não possui créditos suficientes para realizar esta geração.");
      setGenerating(false);
      return;
    }

    try {
      setStep("Alocando tensores e inicializando GPU");
      setStepIndex(1);

      const idempotencyKey = `idemp-${toolSlug}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug,
          modelId: selectedModelId,
          inputs,
          idempotencyKey,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Falha ao iniciar geração no cluster.");
      }

      const activeJob = await res.json();
      setJob(activeJob);
      setStep("Calculando matrizes e iluminação volumétrica");
      setStepIndex(2);

      startPolling(activeJob.id);
    } catch (err: any) {
      setError(err.message || "Não foi possível concluir a geração.");
      setGenerating(false);
      setStepIndex(0);
      toast.error(err.message || "Erro ao processar mídia.");
    }
  };

  const handleAutoOptimizePrompt = async () => {
    const currentPrompt = inputs.prompt || "";
    if (!currentPrompt.trim()) return;

    try {
      const res = await fetch("/api/tools/optimize-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt,
          enhanceQuality: true,
          toolType: toolSlug.includes("video") || toolSlug.includes("motion") ? "video" : "image",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setInputVal("prompt", data.optimizedPrompt);
        setShowBasicWarningModal(false);
        toast.success("Prompt enriquecido com iluminação e textura cinematográfica!");
      }
    } catch (e) {
      toast.error("Erro ao aprimorar prompt.");
    }
  };

  const startPolling = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tools/job/${jobId}`);
        if (!res.ok) return;

        const currentJob = await res.json();
        setJob(currentJob);

        if (currentJob.status === "PROCESSING") {
          setStep("Renderizando pixels em alta fidelidade");
          setStepIndex(2);
        } else if (currentJob.status === "COMPLETED") {
          setStep("Aplicando color grading e finalizando");
          setStepIndex(3);
          clearInterval(interval);
          setTimeout(() => {
            setGenerating(false);
            fetchConfig();
            toast.success("Mídia cinematográfica gerada com sucesso!");
          }, 600);
        } else if (currentJob.status === "FAILED") {
          clearInterval(interval);
          setStep("Falhou");
          setStepIndex(0);
          setError(currentJob.error || "A geração falhou no provedor de IA.");
          setGenerating(false);
          fetchConfig();
          toast.error("A geração falhou na GPU. Seus créditos foram preservados.");
        }
      } catch (err) {
        console.error("Erro no polling:", err);
      }
    }, 1500);
  };

  const effectiveCost = customCost !== undefined ? customCost : (tool?.model?.creditCost || 0);
  const cost = effectiveCost;
  const hasCredits = creditMode === "UNLIMITED" || balance >= cost;

  return (
    <div className="w-full space-y-5 sm:space-y-6 max-w-[1700px] mx-auto pb-16 overflow-x-hidden font-sans">
      {/* 1. Header Minimalista Contemporâneo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E202E] pb-4 sm:pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-950/40 border border-violet-800/40 text-[11px] font-mono font-semibold text-violet-400 mb-1">
            <Sparkles className="h-3 w-3" />
            <span>ESTÚDIO CRIATIVO VORIXA</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5 font-heading">
            <span>{title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Badge de Saldo Rápido no Header */}
        <div className="flex items-center gap-3 bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-2.5 px-4 self-start sm:self-auto shadow-sm">
          <div className="h-9 w-9 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
            <Coins className="h-4 w-4" />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase font-mono text-slate-400">Saldo Disponível</div>
            <div className="text-sm font-bold text-white font-mono">
              {creditMode === "UNLIMITED" ? (
                <span className="text-cyan-400">Ilimitado</span>
              ) : (
                `${balance} créditos`
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Seletor de Abas Móvel Inteligente (Configurar vs Resultado) - lg:hidden */}
      <div className="flex lg:hidden items-center p-1.5 bg-[#0D0E12] border border-[#1E202E] rounded-2xl w-full gap-1.5 shadow-md">
        <button
          type="button"
          onClick={() => setMobileTab("config")}
          className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer touch-manipulation select-none ${
            mobileTab === "config"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Configurar</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("result")}
          className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer touch-manipulation select-none relative ${
            mobileTab === "result"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                generating
                  ? "bg-amber-400 animate-ping"
                  : job?.status === "COMPLETED"
                  ? "bg-emerald-400"
                  : "bg-slate-500"
              }`}
            />
            <Tv className="w-4 h-4" />
            <span>Resultado</span>
          </div>
          {generating && (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
              {elapsedSeconds}s
            </span>
          )}
        </button>
      </div>

      {/* 3. Grid Principal Responsivo: 2 Colunas no Desktop e Abas Alternáveis no Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
        {/* Coluna da Esquerda: Formulário e Parâmetros */}
        <div
          className={`w-full lg:col-span-7 space-y-6 ${
            mobileTab === "config" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-4 sm:p-6 lg:p-7 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#1E202E]/80 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Parâmetros de Geração
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500">GPU Cluster Active</span>
            </div>

            {/* Injeta os inputs customizados */}
            <div className="space-y-6">{children({ setInputVal, inputs })}</div>

            {/* Resumo de Custos e Botão Principal de Disparo */}
            <div className="border-t border-[#1E202E] pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 bg-[#070709] border border-[#1E202E] rounded-2xl p-3 px-4">
                <div className="h-10 w-10 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Custo Estimado</div>
                  <div className="text-base font-bold text-white font-mono flex items-center gap-1.5">
                    {creditMode === "UNLIMITED" ? (
                      <span className="text-cyan-400">ILIMITADO</span>
                    ) : (
                      <>
                        {cost} <span className="text-xs font-normal text-slate-400 font-sans">créditos</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleInitiateGenerate}
                disabled={generating || !hasCredits}
                className="min-h-[48px] px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-violet-950/40 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] select-none touch-manipulation"
              >
                {generating ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processando ({elapsedSeconds}s)...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current text-white" />
                    <span>Iniciar Geração</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Coluna da Direita: Galeria / Preview com Aspect-Ratio Fixo sem CLS */}
        <div
          className={`w-full lg:col-span-5 lg:sticky lg:top-6 space-y-4 ${
            mobileTab === "result" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 relative backdrop-blur-xl">
            {/* Header da Galeria */}
            <div className="flex items-center justify-between border-b border-[#1E202E]/80 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    generating
                      ? "bg-amber-400 animate-ping"
                      : job?.status === "COMPLETED"
                      ? "bg-emerald-400"
                      : "bg-slate-500"
                  }`}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  {generating
                    ? "Processando em Nuvem"
                    : job?.status === "COMPLETED"
                    ? "Mídia Renderizada"
                    : "Área de Preview"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Alta Fidelidade</span>
            </div>

            {/* Visualizador Digital / Canvas Central com Aspect Ratio Fixo (Zero CLS) */}
            <div className="relative rounded-2xl overflow-hidden border border-[#1E202E] bg-[#070709] w-full aspect-video min-h-[280px] sm:min-h-[360px] max-h-[460px] flex flex-col items-center justify-center p-3 text-center group">
              {generating ? (
                /* Stepper Elegante com Animação de Pulso Suave */
                <div className="w-full max-w-sm space-y-5 p-4 animate-in fade-in duration-300">
                  <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 animate-pulse">
                    <div className="h-full w-full bg-[#070709] rounded-2xl flex items-center justify-center">
                      <Cpu className="h-8 w-8 text-cyan-400 animate-spin" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white font-heading">{step}</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Tempo decorrido:{" "}
                      <span className="text-cyan-400 font-semibold">{elapsedSeconds}s</span> (est. ~15-30s)
                    </p>
                  </div>

                  {/* Stepper Visual de 3 Fases */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                      <span className={stepIndex >= 1 ? "text-violet-400 font-bold" : "text-slate-600"}>
                        1. Fila GPU
                      </span>
                      <span className={stepIndex >= 2 ? "text-indigo-400 font-bold" : "text-slate-600"}>
                        2. Inferência
                      </span>
                      <span className={stepIndex >= 3 ? "text-cyan-400 font-bold" : "text-slate-600"}>
                        3. Master
                      </span>
                    </div>

                    <div className="w-full bg-[#13141B] rounded-full h-2 overflow-hidden border border-[#1E202E]">
                      <div
                        className="bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{
                          width:
                            stepIndex === 1 ? "35%" : stepIndex === 2 ? "75%" : stepIndex === 3 ? "100%" : "15%",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : error ? (
                /* Estado de Erro Amigável */
                <div className="space-y-3 p-6 animate-in fade-in">
                  <div className="h-12 w-12 rounded-2xl bg-red-950/30 border border-red-800/50 flex items-center justify-center text-red-400 mx-auto">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">Falha na Renderização</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">{error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={executeGeneration}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-bold bg-[#13141B] border border-[#1E202E] hover:border-violet-500 text-slate-300 hover:text-white transition-all cursor-pointer touch-manipulation active:scale-[0.98]"
                  >
                    Tentar Novamente
                  </button>
                </div>
              ) : job?.status === "COMPLETED" && job.outputs?.length > 0 ? (
                /* Mídia Renderizada */
                (() => {
                  const rawOutput = job.outputs[0];
                  const outputUrl = typeof rawOutput === "string" ? rawOutput : rawOutput?.fileUrl || "";
                  const isVideo =
                    outputUrl.endsWith(".mp4") || outputUrl.includes("/video/") || outputUrl.includes(".webm");

                  return (
                    <div className="w-full h-full flex flex-col justify-between animate-in fade-in duration-300">
                      <div
                        onClick={() => setFullscreenMedia({ url: outputUrl, isVideo })}
                        className="group/frame relative w-full h-full flex items-center justify-center cursor-pointer overflow-hidden rounded-xl bg-black"
                      >
                        {isVideo ? (
                          <video
                            src={outputUrl}
                            controls
                            playsInline
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <img
                            src={outputUrl}
                            alt="Resultado Gerado"
                            className="w-full h-full object-contain transition-transform duration-500 group-hover/frame:scale-[1.02]"
                          />
                        )}

                        {/* Overlay com Efeito Vidro Fosco ao Hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/frame:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                          <div className="px-4 py-2 rounded-2xl bg-black/80 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-md">
                            <Maximize2 className="w-4 h-4 text-cyan-400" />
                            <span>Ampliar em Galeria</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* Estado Vazio - Aguardando Parâmetros */
                <div className="space-y-3 p-6 text-slate-500">
                  <div className="w-14 h-14 rounded-2xl bg-[#13141B] border border-[#1E202E] flex items-center justify-center mx-auto text-slate-400 shadow-inner">
                    <Wand2 className="w-7 h-7 text-violet-400/80" />
                  </div>
                  <div className="space-y-1 max-w-xs mx-auto">
                    <h3 className="text-sm font-bold text-slate-300">Aguardando Parâmetros</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Configure os campos no painel ao lado e inicie para renderizar sua arte digital.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botões de Ação de Alta Definição quando houver Mídia Renderizada */}
            {job?.status === "COMPLETED" && job.outputs?.length > 0 && (
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full animate-in fade-in">
                {(() => {
                  const rawOutput = job.outputs[0];
                  const outputUrl = typeof rawOutput === "string" ? rawOutput : rawOutput?.fileUrl || "";
                  const isVideo =
                    outputUrl.endsWith(".mp4") || outputUrl.includes("/video/") || outputUrl.includes(".webm");

                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => setFullscreenMedia({ url: outputUrl, isVideo })}
                        className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#13141B] hover:bg-[#1A1C26] text-slate-200 border border-[#1E202E] hover:border-slate-700 transition-all cursor-pointer active:scale-[0.98] touch-manipulation"
                      >
                        <Eye className="w-4 h-4 text-violet-400" />
                        <span>Tela Cheia</span>
                      </button>

                      <a
                        href={outputUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={`vorixa-${toolSlug}-${Date.now()}.${isVideo ? "mp4" : "jpg"}`}
                        className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white transition-all shadow-md shadow-violet-600/20 active:scale-[0.98] touch-manipulation"
                      >
                        <Download className="w-4 h-4" />
                        <span>Baixar Arquivo</span>
                      </a>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Aviso de Prompt Básico */}
      {showBasicWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-white font-heading">
                Seu prompt pode ser enriquecido
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prompts muito concisos podem não atingir o padrão cinematográfico esperado. Nossa IA pode adicionar texturas, iluminação de estúdio e grading profissional automaticamente.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#070709] border border-[#1E202E] text-xs text-slate-300 font-mono italic break-words max-h-28 overflow-y-auto">
              "{inputs.prompt}"
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleAutoOptimizePrompt}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white shadow-lg shadow-violet-600/30 transition-all cursor-pointer active:scale-[0.98] touch-manipulation"
              >
                <Wand2 className="w-4 h-4 text-cyan-200" />
                <span>Otimizar com IA e Renderizar</span>
              </button>

              <button
                type="button"
                onClick={executeGeneration}
                className="w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#13141B] transition-all cursor-pointer touch-manipulation"
              >
                <span>Enviar como está</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lightbox de Visualização em Tela Cheia */}
      {fullscreenMedia && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setFullscreenMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full max-h-[94vh] rounded-3xl bg-[#0D0E12] border border-[#1E202E] shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col"
          >
            {/* Header do Lightbox */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#1E202E] bg-[#070709]/80">
              <div className="flex items-center gap-2.5">
                <span className="text-xs sm:text-sm font-bold text-white font-heading truncate">
                  Galeria de Alta Resolução
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase shrink-0">
                  {fullscreenMedia.isVideo ? "VÍDEO CINEMÁTICO" : "IMAGEM RAW"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={fullscreenMedia.url}
                  download={`vorixa-render-${Date.now()}.${fullscreenMedia.isVideo ? "mp4" : "jpg"}`}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-sm touch-manipulation cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </a>

                <button
                  type="button"
                  onClick={() => setFullscreenMedia(null)}
                  className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center touch-manipulation"
                  title="Fechar (ESC)"
                  aria-label="Fechar visualização em tela cheia"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mídia em Tamanho Completo */}
            <div className="p-3 sm:p-4 flex items-center justify-center bg-black/60 overflow-auto max-h-[82vh]">
              {fullscreenMedia.isVideo ? (
                <video
                  src={fullscreenMedia.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[78vh] w-auto rounded-2xl shadow-2xl"
                />
              ) : (
                <img
                  src={fullscreenMedia.url}
                  alt="Visualização Completa"
                  className="max-h-[78vh] w-auto object-contain rounded-2xl shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
