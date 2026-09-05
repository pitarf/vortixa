"use client";

import React, { useState, useEffect } from "react";
import { Coins, Play, Sparkles, AlertCircle, CheckCircle2, Download, RotateCcw, AlertTriangle, ArrowRight, Wand2, Maximize2, X, Eye } from "lucide-react";
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
  const [error, setError] = useState<string>("");

  // Modal de Aviso de Prompt Básico
  const [showBasicWarningModal, setShowBasicWarningModal] = useState(false);
  const [pendingExecution, setPendingExecution] = useState(false);

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
        const currentTool = data.tools.find((t: any) => t.slug === toolSlug);
        setTool(currentTool);
      }
    } catch (err) {
      console.error("Erro ao buscar configurações:", err);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [toolSlug]);

  const setInputVal = (key: string, val: any) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  // Dispara a geração com verificação prévia de prompt básico
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
    setStep("Preparando");

    const cost = customCost !== undefined ? customCost : (tool?.model?.creditCost || 0);
    if (creditMode !== "UNLIMITED" && balance < cost) {
      toast.error("Saldo insuficiente de créditos.");
      setError("Você não possui créditos suficientes para realizar esta geração.");
      setGenerating(false);
      return;
    }

    try {
      setStep("Enviando");
      // Gera uma chave de idempotência temporária no cliente para proteção contra cliques
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
        throw new Error(errData.error || "Falha ao iniciar geração.");
      }

      const activeJob = await res.json();
      setJob(activeJob);
      setStep("Na fila");

      // Inicia Polling de Status
      startPolling(activeJob.id);
    } catch (err: any) {
      setError(err.message || "Não foi possível concluir a geração.");
      setGenerating(false);
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
          toolType: toolSlug.includes("video") ? "video" : "image",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setInputVal("prompt", data.optimizedPrompt);
        setShowBasicWarningModal(false);
        toast.success("Prompt aprimorado com sucesso! Agora você pode gerar.");
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
          setStep("Processando");
        } else if (currentJob.status === "COMPLETED") {
          setStep("Finalizando");
          clearInterval(interval);
          setStep("Concluído");
          setGenerating(false);
          fetchConfig(); // Atualiza saldo
          toast.success("Mídia gerada com sucesso!");
        } else if (currentJob.status === "FAILED") {
          clearInterval(interval);
          setStep("Falhou");
          setError(currentJob.error || "A geração falhou no provedor de IA.");
          setGenerating(false);
          fetchConfig(); // Restaura saldo se houve reembolso
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
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-violet-400" />
          <span>{title}</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Configurações */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Parâmetros da Geração
            </h2>

            {/* Injeta os inputs customizados */}
            {children({ setInputVal, inputs })}

            {/* Resumo de Custos e Botão */}
            <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-violet-950/40 border border-violet-800/50 flex items-center justify-center text-violet-400">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Custo Estimado</div>
                  <div className="text-lg font-black text-foreground flex items-center gap-1.5">
                    {creditMode === "UNLIMITED" ? (
                      <span className="text-sm font-semibold text-cyan-400">ILIMITADO</span>
                    ) : (
                      <>
                        {cost} <span className="text-xs font-normal text-slate-400">créditos</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleInitiateGenerate}
                disabled={generating || !hasCredits || !tool}
                className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl px-8 py-3.5 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-violet-950/30 cursor-pointer"
                style={{ minHeight: "44px" }}
              >
                {generating ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{step}...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>Iniciar Geração</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Lado Direito: Saldo e Preview / Resultados */}
        <div className="space-y-6">
          {/* Card de Saldo */}
          <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Seu Saldo</div>
              <div className="text-xl font-black text-foreground mt-1">
                {creditMode === "UNLIMITED" ? "Ilimitado" : `${balance} créditos`}
              </div>
            </div>
            {creditMode !== "UNLIMITED" && (
              <a
                href="/dashboard/credits"
                className="bg-muted hover:bg-slate-800 border border-border text-xs font-bold text-violet-400 hover:text-white rounded-lg px-4 py-2 transition-all"
                style={{ minHeight: "44px", display: "flex", alignItems: "center" }}
              >
                Comprar
              </a>
            )}
          </div>

          {/* Card de Status / Visualizador de Resultados */}
          <div className="bg-card border border-border rounded-2xl p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
            {generating ? (
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full border-4 border-violet-950 border-t-violet-500 animate-spin mx-auto" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{step}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Processando sua mídia assincronamente. Por favor, aguarde.
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-full bg-red-950/30 border border-red-800/50 flex items-center justify-center text-red-400 mx-auto">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Falha na Geração</h3>
                  <p className="text-xs text-slate-500 mt-2 px-4">{error}</p>
                </div>
              </div>
            ) : job?.status === "COMPLETED" && job.outputs?.length > 0 ? (
              (() => {
                const rawOutput = job.outputs[0];
                const outputUrl = typeof rawOutput === "string" ? rawOutput : rawOutput?.fileUrl || "";
                const isVideo = outputUrl.endsWith(".mp4") || outputUrl.includes("/video/");

                return (
                  <div className="w-full space-y-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mx-auto">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Geração Concluída!</h3>
                      <p className="text-xs text-slate-500 mt-1">Sua mídia está pronta abaixo.</p>
                    </div>

                    <div 
                      onClick={() => setFullscreenMedia({ url: outputUrl, isVideo })}
                      className="group relative mt-4 rounded-xl overflow-hidden border border-border bg-black max-h-[400px] cursor-pointer"
                    >
                      {isVideo ? (
                        <video src={outputUrl} controls className="w-full h-auto max-h-[360px]" />
                      ) : (
                        <img src={outputUrl} alt="Resultado Gerado" className="w-full h-auto object-cover max-h-[360px] transition-transform duration-300 group-hover:scale-[1.02]" />
                      )}

                      {/* Hover Overlay com Dica de Clique para Expandir */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="px-3 py-1.5 rounded-xl bg-black/75 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                          <Maximize2 className="w-3.5 h-3.5 text-violet-400" />
                          <span>Clique para Ampliar</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setFullscreenMedia({ url: outputUrl, isVideo })}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-violet-400" />
                        <span>Visualizar em Tela Cheia</span>
                      </button>

                      <a
                        href={outputUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-md shadow-violet-600/20"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Arquivo</span>
                      </a>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="space-y-3 text-slate-500">
                <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto text-slate-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Aguardando Parâmetros</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
                    Preencha os campos ao lado e clique em iniciar para renderizar.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Aviso de Prompt Básico / Genérico */}
      {showBasicWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-foreground">
                Seu prompt parece muito básico
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                "Prompts muito genéricos tendem a não ter o resultado esperado. Procure melhorar o seu prompt com mais detalhes de cena, iluminação ou estilo."
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted border border-border text-xs text-slate-300 font-mono italic">
              "{inputs.prompt}"
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleAutoOptimizePrompt}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
              >
                <Wand2 className="w-4 h-4 text-cyan-200" />
                <span>Aprimorar com IA e Ajustar</span>
              </button>

              <button
                type="button"
                onClick={executeGeneration}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-foreground hover:bg-muted transition-all cursor-pointer"
              >
                <span>Enviar assim mesmo</span>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[92vh] rounded-3xl bg-slate-950 border border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col"
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">Visualização em Alta Resolução</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase">
                  {fullscreenMedia.isVideo ? "VÍDEO" : "IMAGEM"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={fullscreenMedia.url}
                  download={`vorixa-render-${Date.now()}.${fullscreenMedia.isVideo ? "mp4" : "jpg"}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </a>

                <button
                  type="button"
                  onClick={() => setFullscreenMedia(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Fechar (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mídia em Tamanho Completo */}
            <div className="p-4 flex items-center justify-center bg-black/50 overflow-auto max-h-[80vh]">
              {fullscreenMedia.isVideo ? (
                <video
                  src={fullscreenMedia.url}
                  controls
                  autoPlay
                  className="max-h-[75vh] w-auto rounded-xl shadow-2xl"
                />
              ) : (
                <img
                  src={fullscreenMedia.url}
                  alt="Visualização Completa"
                  className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
