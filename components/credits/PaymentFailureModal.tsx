"use client";

import React from "react";
import {
  AlertCircle,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

export interface PaymentFailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  reason?: string | null;
}

export function PaymentFailureModal({
  isOpen,
  onClose,
  onRetry,
  reason,
}: PaymentFailureModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="failure-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full h-full sm:h-auto max-w-lg rounded-none sm:rounded-3xl bg-[#0D0E12] border-0 sm:border border-rose-500/40 shadow-[0_0_80px_rgba(244,63,94,0.15)] overflow-hidden flex flex-col max-h-none sm:max-h-[92vh]">
        {/* Glow Superior Suave */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mt-20" />

        <div className="relative z-10 p-5 sm:p-8 flex flex-col items-center text-center space-y-5 sm:space-y-6 overflow-y-auto overscroll-contain flex-1">
          {/* Ícone de Alerta */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl">
            <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          {/* Título & Mensagem */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              PAGAMENTO NÃO CONCLUÍDO
            </div>
            <h3
              id="failure-modal-title"
              className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading"
            >
              Não Foi Possível Concluir a Compra
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {reason ||
                "A transação foi cancelada, expirou ou não obteve confirmação da instituição financeira. Não se preocupe: nenhuma cobrança foi efetuada."}
            </p>
          </div>

          {/* Dicas para Resolução */}
          <div className="w-full rounded-2xl bg-[#070709] border border-[#1E202E] p-4 text-left space-y-2 text-xs text-slate-300">
            <span className="font-bold text-slate-200 block text-[11px] font-mono uppercase tracking-wider">
              O que você pode fazer:
            </span>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
              <li>
                Para pagamentos via Pix, realize a transferência dentro dos 15 minutos de validade do QR Code.
              </li>
              <li>
                Certifique-se de copiar o código Pix integral ou escanear a chave QR diretamente no app do seu banco.
              </li>
              <li>
                Recomendamos tentar novamente gerando uma nova chave do <strong>Pix Instantâneo (Vorexpay)</strong> para compensação em menos de 3 segundos.
              </li>
            </ul>
          </div>

          {/* Botões de Ação com Touch Target >= 48px */}
          <div className="w-full space-y-2.5 pt-1">
            <button
              type="button"
              onClick={onRetry}
              style={{ minHeight: "50px" }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-violet-600/30 transition-all active:scale-[0.99] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tentar Novamente Agora</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{ minHeight: "48px" }}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              Voltar aos Pacotes de Créditos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
