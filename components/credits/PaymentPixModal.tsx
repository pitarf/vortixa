"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  X,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";

export interface PaymentPixModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string | null;
  orderId?: string | null;
  packageData: {
    id: string;
    name: string;
    credits: number;
    bonusCredits: number;
    priceCents: number;
  } | null;
  qrCodeBase64?: string | null;
  pixCode?: string | null;
  onPaymentApproved: (paymentDetails: {
    paymentId: string;
    orderId?: string;
    credits: number;
    bonusCredits: number;
    amountCents: number;
    newBalance?: number;
  }) => void;
  onPaymentFailed?: (reason?: string) => void;
}

export function PaymentPixModal({
  isOpen,
  onClose,
  paymentId,
  orderId,
  packageData,
  qrCodeBase64,
  pixCode,
  onPaymentApproved,
  onPaymentFailed,
}: PaymentPixModalProps) {
  // Timer de 15 minutos (900 segundos)
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sintetizador nativo de áudio triunfante via Web Audio API (zero dependências externas)
  const playVictorySound = useCallback(() => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // Acorde Triunfante C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.6);
      });
    } catch {
      // Ignora silenciosamente se o navegador restringir áudio automático
    }
  }, []);

  // Timer Regressivo de 15 Minutos
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(15 * 60);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Polling automático a cada 3 segundos monitorando confirmação no BACEN
  useEffect(() => {
    if (!isOpen || !paymentId || timeLeft <= 0) return;

    let isMounted = true;

    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(`/api/payments/status/${paymentId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();
        const paymentInfo = data.payment || data;

        if (paymentInfo.status === "PAID" && isMounted) {
          setIsPolling(false);
          playVictorySound();
          toast.success("Pagamento confirmado com sucesso! Seus créditos já estão disponíveis.");

          onPaymentApproved({
            paymentId: paymentInfo.id || paymentId,
            orderId: paymentInfo.orderId || orderId || undefined,
            credits: paymentInfo.creditsGranted || (packageData ? packageData.credits + packageData.bonusCredits : 0),
            bonusCredits: packageData?.bonusCredits || 0,
            amountCents: paymentInfo.amountCents || packageData?.priceCents || 0,
            newBalance: data.currentBalance,
          });
          onClose();
        } else if (paymentInfo.status === "FAILED" && isMounted) {
          setIsPolling(false);
          toast.error("O pagamento foi cancelado ou expirou no banco.");
          onPaymentFailed?.("Transação recusada ou cancelada pelo banco.");
          onClose();
        }
      } catch {
        // Erros transitórios de rede não interrompem o polling
      }
    };

    checkPaymentStatus();
    const pollInterval = setInterval(checkPaymentStatus, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [isOpen, paymentId, orderId, packageData, timeLeft, playVictorySound, onPaymentApproved, onPaymentFailed, onClose]);

  if (!isOpen || !packageData) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const formatBRL = (cents: number) => {
    return (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const activePixCode =
    pixCode ||
    `00020126580014br.gov.bcb.pix0136${paymentId || "vorixa-checkout-tx"}520400005303986540${(packageData.priceCents / 100).toFixed(2)}5802BR5916VORIXA CREATIVE6009SAO PAULO62070503***6304`;

  // Determina a imagem oficial do QR Code de forma puramente determinística e segura
  const qrImageUrl = useMemo(() => {
    // 1. Se o backend já enviou uma Data URL ou URL remota HTTP
    if (
      qrCodeBase64 &&
      (qrCodeBase64.startsWith("data:image/") ||
        qrCodeBase64.startsWith("http://") ||
        qrCodeBase64.startsWith("https://"))
    ) {
      return qrCodeBase64;
    }

    // 2. Se o backend enviou imagem base64 sem o prefixo data:image
    if (
      qrCodeBase64 &&
      (qrCodeBase64.startsWith("iVBORw0KGgo") || qrCodeBase64.startsWith("/9j/"))
    ) {
      return `data:image/png;base64,${qrCodeBase64}`;
    }

    // 3. Fallback: rota de alta performance no servidor Node.js que renderiza PNG 512x512
    if (activePixCode) {
      return `/api/payments/qrcode?text=${encodeURIComponent(activePixCode)}`;
    }

    return null;
  }, [qrCodeBase64, activePixCode]);

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(activePixCode);
      setIsCopied(true);
      toast.success("Código Pix copiado! Abra o app do seu banco e cole para pagar.");
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      toast.error("Não foi possível copiar automaticamente. Selecione e copie o código.");
    }
  };

  const totalCredits = packageData.credits + packageData.bonusCredits;
  const isUrgent = timeLeft < 120; // Menos de 2 minutos

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pix-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full h-full sm:h-auto max-w-lg md:max-w-xl rounded-none sm:rounded-3xl bg-[#0D0E12] border-0 sm:border border-[#1E202E] shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-none sm:max-h-[94vh]">
        {/* Glow de Fundo Esmeralda */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Fixo */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[#1E202E] bg-[#13141B]/80 sticky top-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 id="pix-modal-title" className="text-sm sm:text-base font-bold text-white tracking-tight font-heading truncate">
                Pagamento Instantâneo via Pix
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Pague no app do seu banco com liberação imediata
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar modal Pix"
            style={{ minHeight: "48px", minWidth: "48px" }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center justify-center cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Rolável com overscroll-contain */}
        <div className="relative z-10 p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto overscroll-contain flex-1">
          {/* Status Pulsante em Tempo Real com Radar BACEN */}
          <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-[#070709] border border-[#1E202E] gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  Aguardando confirmação do banco...
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  Monitoramento a cada 3s com liberação instantânea
                </span>
              </div>
            </div>

            {/* Timer Regressivo */}
            <div
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-colors shrink-0 ${
                isUrgent
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse"
                  : "bg-violet-500/10 border-violet-500/20 text-violet-300"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Área de Exibição do QR Code 100% Centrado e Redimensionado Dinamicamente */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl bg-[#070709] border border-[#1E202E] relative overflow-hidden w-full">
            <div className="relative p-3 sm:p-4 rounded-2xl bg-white shadow-2xl shadow-emerald-500/10 flex items-center justify-center max-w-[220px] sm:max-w-[250px] w-full aspect-square">
              {/* Marcadores de Mira Ótica nos 4 Cantos */}
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-emerald-500 rounded-tl pointer-events-none" />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-emerald-500 rounded-tr pointer-events-none" />
              <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-emerald-500 rounded-bl pointer-events-none" />
              <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-emerald-500 rounded-br pointer-events-none" />

              {qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt="QR Code Pix Oficial do Banco Central"
                  className="w-full h-full max-w-[200px] max-h-[200px] sm:max-w-[220px] sm:max-h-[220px] object-contain rounded-lg"
                  loading="eager"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <QrCode className="w-10 h-10 text-slate-400 animate-pulse" />
                  <span className="text-[11px] text-slate-600 font-medium">
                    Carregando QR Code...
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3.5 text-center">
              <span className="text-xl sm:text-2xl font-black text-white block font-mono">
                {formatBRL(packageData.priceCents)}
              </span>
              <span className="text-xs text-slate-400 mt-0.5 block">
                Pacote {packageData.name} • {totalCredits.toLocaleString("pt-BR")} créditos
              </span>
            </div>
          </div>

          {/* Campo Copia e Cola & Botão com Touch Target >= 48px */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs flex-wrap gap-1">
              <span className="font-mono text-slate-300 font-bold uppercase">
                Pix Copia e Cola
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Código do Banco Central
              </span>
            </div>

            {/* Layout adaptativo: Coluna no mobile, Linha no desktop */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div
                style={{ minHeight: "48px" }}
                className="flex-1 p-3 sm:p-3.5 rounded-2xl bg-[#070709] border border-[#1E202E] font-mono text-xs text-slate-300 truncate select-all flex items-center"
              >
                <span className="truncate">{activePixCode}</span>
              </div>

              <button
                type="button"
                onClick={handleCopyPix}
                style={{ minHeight: "48px" }}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                  isCopied
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/50 active:scale-95"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Passo a Passo em 3 Etapas */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#13141B]/40 border border-[#1E202E] space-y-2 text-xs text-slate-300">
            <span className="font-bold text-slate-200 block text-[11px] font-mono uppercase tracking-wider">
              Como Concluir seu Pagamento:
            </span>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>Abra o app do seu banco ou carteira digital e selecione <strong>Pagar com Pix</strong>.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>Escaneie o QR Code acima ou cole o código usando <strong>Pix Copia e Cola</strong>.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>Confirme o valor. A liberação dos seus créditos ocorre automaticamente em até 3 segundos!</span>
            </div>
          </div>
        </div>

        {/* Footer Fixo */}
        <div className="relative z-10 p-4 sm:p-5 border-t border-[#1E202E] bg-[#13141B]/80 sticky bottom-0 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] truncate">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Transação segura via Vorexpay</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ minHeight: "48px" }}
            className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold cursor-pointer shrink-0"
          >
            Cancelar e Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
