"use client";

import React, { useState, useEffect } from "react";
import { Coins, Play, Sparkles, AlertCircle, CheckCircle2, Download, RotateCcw, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface GenerationLayoutProps {
  toolSlug: string;
  title: string;
  description: string;
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

  const handleGenerate = async () => {
    if (generating) return;

    setError("");
    setGenerating(true);
    setStep("Preparando");

    const cost = tool?.model?.creditCost || 0;
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
        console.error("Erro no polling do Job:", err);
      }
    }, 2500); // Polling controlado a cada 2.5 segundos
  };

  const cost = tool?.model?.creditCost || 0;
  const hasCredits = creditMode === "UNLIMITED" || balance >= cost;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-violet-400" />
          {title}
        </h1>
        <p className="text-slate-400 text-sm mt-1">{description}</p>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Configurações */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 space-y-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Parâmetros da Geração
            </h2>

            {/* Injeta os inputs customizados */}
            {children({ setInputVal, inputs })}

            {/* Resumo de Custos e Botão */}
            <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-violet-950/40 border border-violet-800/50 flex items-center justify-center text-violet-400">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Custo Estimado</div>
                  <div className="text-lg font-black text-white flex items-center gap-1.5">
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
                onClick={handleGenerate}
                disabled={generating || !hasCredits || !tool}
                className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl px-8 py-3.5 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-violet-950/30"
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
          <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Seu Saldo</div>
              <div className="text-xl font-black text-white mt-1">
                {creditMode === "UNLIMITED" ? "Ilimitado" : `${balance} créditos`}
              </div>
            </div>
            {creditMode !== "UNLIMITED" && (
              <a
                href="/dashboard/credits"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-violet-400 hover:text-white rounded-lg px-4 py-2 transition-all"
                style={{ minHeight: "44px", display: "flex", alignItems: "center" }}
              >
                Comprar
              </a>
            )}
          </div>

          {/* Card de Status / Visualizador de Resultados */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
            {generating ? (
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full border-4 border-violet-950 border-t-violet-500 animate-spin mx-auto" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">{step}</p>
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
                  <h3 className="text-sm font-semibold text-slate-200">Falha na Geração</h3>
                  <p className="text-xs text-slate-500 mt-2 px-4">{error}</p>
                </div>
              </div>
            ) : job?.status === "COMPLETED" && job.outputs?.length > 0 ? (
              <div className="w-full space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">Geração Concluída!</h3>

                {/* Render do output de mídia */}
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-black mt-2">
                  {job.outputs[0].fileUrl.endsWith(".mp4") ? (
                    <video src={job.outputs[0].fileUrl} controls className="w-full h-auto" />
                  ) : (
                    <img src={job.outputs[0].fileUrl} alt="Output" className="w-full h-auto" />
                  )}
                </div>

                <a
                  href={job.outputs[0].fileUrl}
                  download={`vorixa-${job.id}`}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-sm rounded-xl py-3 flex items-center justify-center gap-2 transition-all mt-2"
                  style={{ minHeight: "44px" }}
                >
                  <Download className="h-4 w-4" />
                  <span>Baixar Arquivo</span>
                </a>
              </div>
            ) : (
              <div className="space-y-2 text-slate-500">
                <HelpCircle className="h-12 w-12 text-slate-700 mx-auto mb-2 animate-bounce" />
                <h3 className="text-sm font-semibold text-slate-400">Aguardando Parâmetros</h3>
                <p className="text-xs text-slate-500 max-w-[200px] mx-auto">
                  Preencha os campos ao lado e clique em iniciar para renderizar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
