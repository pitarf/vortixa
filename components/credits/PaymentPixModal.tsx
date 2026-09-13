"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Copy,
  Check,
  Clock,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Loader2,
  QrCode,
  ArrowRight,
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

  // Sintetizador de áudio de vitória nativo via Web Audio API (Zero arquivos externos quebrados)
  const playVictorySound = useCallback(() => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Acorde Triunfante)
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
      // Ignora silenciosamente se o navegador bloquear autoplay de áudio
    }
  }, []);

  // Timer Regressivo de 15 minutos
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

  // Polling automático a cada 3 segundos
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
          toast.success("Pagamento aprovado com sucesso! Seus créditos já foram liberados.");

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
        // Erro transitório de rede não interrompe o polling
      }
    };

    // Primeira checagem imediata
    checkPaymentStatus();

    // Polling a cada 3 segundos
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

  // Código Pix mock estilizado se não fornecido pelo gateway
  const activePixCode =
    pixCode ||
    `00020126580014br.gov.bcb.pix0136${paymentId || "vorixa-checkout-tx"}520400005303986540${(packageData.priceCents / 100).toFixed(2)}5802BR5916VORIXA CREATIVE6009SAO PAULO62070503***6304`;

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(activePixCode);
      setIsCopied(true);
      toast.success("Código Pix copiado! Cole no aplicativo do seu banco.");
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      toast.error("Não foi possível copiar automaticamente. Selecione e copie manualmente.");
    }
  };

  const totalCredits = packageData.credits + packageData.bonusCredits;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pix-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg md:max-w-xl rounded-3xl bg-[#0D0E12] border border-[#1E202E] shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[94vh]">
        {/* Glow de fundo esmeralda/ciano */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-[#1E202E] bg-[#13141B]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 id="pix-modal-title" className="text-base font-bold text-white tracking-tight">
                Pagamento Instantâneo via Pix
              </h3>
              <p className="text-xs text-slate-400">
                Pague pelo aplicativo do seu banco para liberação imediata
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar modal Pix"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div className="relative z-10 p-6 space-y-5 overflow-y-auto">
          {/* Status Pulsante em Tempo Real */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#070709] border border-[#1E202E]">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div>
                <span className="text-xs font-bold text-white block">
                  Aguardando confirmação do banco...
                </span>
                <span className="text-[11px] text-slate-400">
                  Polling ativo a cada 3s com detecção em tempo real
                </span>
              </div>
            </div>

            {/* Timer Regressivo de 15 Minutos */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Área do QR Code Visual */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#070709] border border-[#1E202E]">
            <div className="relative p-4 rounded-2xl bg-white shadow-2xl shadow-emerald-500/5 group">
              {qrCodeBase64 ? (
                <img
                  src={
                    qrCodeBase64.startsWith("data:")
                      ? qrCodeBase64
                      : `data:image/png;base64,${qrCodeBase64}`
                  }
                  alt="QR Code Pix"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
              ) : (
                /* Renderizador SVG Limpo e Tecnológico do QR Code */
                <svg
                  viewBox="0 0 200 200"
                  className="w-48 h-48 sm:w-56 sm:h-56 fill-slate-900"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Finder Pattern Top-Left */}
                  <rect x="15" y="15" width="45" height="45" rx="6" fill="#000" />
                  <rect x="23" y="23" width="29" height="29" rx="4" fill="#fff" />
                  <rect x="29" y="29" width="17" height="17" rx="2" fill="#000" />

                  {/* Finder Pattern Top-Right */}
                  <rect x="140" y="15" width="45" height="45" rx="6" fill="#000" />
                  <rect x="148" y="23" width="29" height="29" rx="4" fill="#fff" />
                  <rect x="154" y="29" width="17" height="17" rx="2" fill="#000" />

                  {/* Finder Pattern Bottom-Left */}
                  <rect x="15" y="140" width="45" height="45" rx="6" fill="#000" />
                  <rect x="23" y="148" width="29" height="29" rx="4" fill="#fff" />
                  <rect x="29" y="154" width="17" height="17" rx="2" fill="#000" />

                  {/* Padrão de Bits Pix Estilizados */}
                  <rect x="75" y="20" width="12" height="12" rx="2" />
                  <rect x="95" y="20" width="12" height="12" rx="2" />
                  <rect x="115" y="20" width="12" height="12" rx="2" />
                  <rect x="75" y="45" width="12" height="12" rx="2" />
                  <rect x="105" y="45" width="12" height="12" rx="2" />
                  <rect x="20" y="75" width="12" height="12" rx="2" />
                  <rect x="45" y="75" width="12" height="12" rx="2" />
                  <rect x="145" y="75" width="12" height="12" rx="2" />
                  <rect x="165" y="75" width="12" height="12" rx="2" />
                  <rect x="20" y="95" width="12" height="12" rx="2" />
                  <rect x="45" y="115" width="12" height="12" rx="2" />
                  <rect x="145" y="115" width="12" height="12" rx="2" />
                  <rect x="165" y="95" width="12" height="12" rx="2" />
                  <rect x="75" y="145" width="12" height="12" rx="2" />
                  <rect x="95" y="145" width="12" height="12" rx="2" />
                  <rect x="115" y="165" width="12" height="12" rx="2" />
                  <rect x="145" y="145" width="12" height="12" rx="2" />
                  <rect x="165" y="165" width="12" height="12" rx="2" />

                  {/* Badge Central do Pix */}
                  <circle cx="100" cy="100" r="22" fill="#0D0E12" />
                  <path
                    d="M106.5 95.5L101.5 90.5c-0.8-0.8-2.2-0.8-3 0l-5 5c-0.8 0.8-0.8 2.2 0 3l5 5c0.8 0.8 2.2 0.8 3 0l5-5c0.8-0.8 0.8-2.2 0-3zm-6.5 6.5l-3-3 3-3 3 3-3 3z"
                    fill="#10B981"
                  />
                </svg>
              )}
            </div>

            <div className="mt-4 text-center">
              <span className="text-xl sm:text-2xl font-black text-white block">
                {formatBRL(packageData.priceCents)}
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                Pacote {packageData.name} ({totalCredits.toLocaleString("pt-BR")} créditos)
              </span>
            </div>
          </div>

          {/* Campo Copia e Cola */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300 font-bold uppercase">
                Pix Copia e Cola
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                Clique no botão para copiar
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 rounded-2xl bg-[#070709] border border-[#1E202E] font-mono text-xs text-slate-300 truncate select-all">
                {activePixCode}
              </div>

              <button
                type="button"
                onClick={handleCopyPix}
                style={{ minHeight: "44px" }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
                  isCopied
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/50"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar Código Pix
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Passo a Passo Rápido */}
          <div className="p-4 rounded-2xl bg-[#13141B]/40 border border-[#1E202E] space-y-2 text-xs text-slate-300">
            <span className="font-bold text-slate-200 block text-[11px] font-mono uppercase tracking-wider">
              Como Concluir seu Pagamento:
            </span>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 font-mono text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                1
              </span>
              <span>Abra o app do seu banco ou carteira digital e selecione <strong>Pagar com Pix</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 font-mono text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                2
              </span>
              <span>Aponte a câmera para o QR Code acima ou use a opção <strong>Pix Copia e Cola</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 font-mono text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                3
              </span>
              <span>Confirme o valor. A liberação dos seus créditos ocorre automaticamente em poucos segundos!</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 p-5 border-t border-[#1E202E] bg-[#13141B]/70 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Transação 100% segura Mercado Pago</span>
          </div>

          <button
            onClick={onClose}
            style={{ minHeight: "44px" }}
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold cursor-pointer"
          >
            Cancelar e Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
