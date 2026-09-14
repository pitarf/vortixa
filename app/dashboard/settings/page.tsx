"use client";

import React, { useState } from "react";
import {
  User,
  Shield,
  Bell,
  KeyRound,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  Save,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Página de Configurações da Conta e Preferências do Usuário no VORIXA.
 * Permite visualizar informações do perfil, alterar senha e definir preferências de notificação.
 */
export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSecurity, setNotificationsSecurity] = useState(true);

  const handleSavePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Preferências salvas com sucesso!");
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 px-3 sm:px-4 lg:px-6">
      {/* Cabeçalho */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          Central de Controle
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
          Configurações da Conta
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Gerencie seu perfil, preferências de notificações e credenciais de segurança.
        </p>
      </div>

      {/* Seção 1: Segurança & Autenticação */}
      <div className="rounded-3xl bg-[#0D0E12] border border-[#1E202E] p-5 sm:p-7 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Segurança & Senha</h2>
            <p className="text-xs text-slate-400">
              Mantenha sua conta protegida com autenticação criptografada.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1E202E]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs sm:text-sm font-semibold text-white block">
              Redefinição de Senha
            </span>
            <span className="text-xs text-slate-400 block">
              Altere sua senha de acesso a qualquer momento através de confirmação por e-mail.
            </span>
          </div>

          <a
            href="/recovery-password"
            style={{ minHeight: "44px" }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-slate-200 border border-[#1E202E] text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-violet-400" />
            Alterar Senha
          </a>
        </div>
      </div>

      {/* Seção 2: Preferências de Notificações */}
      <div className="rounded-3xl bg-[#0D0E12] border border-[#1E202E] p-5 sm:p-7 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Notificações</h2>
            <p className="text-xs text-slate-400">
              Escolha quais atualizações e alertas deseja receber por e-mail.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1E202E]/60 space-y-4">
          <label className="flex items-center justify-between gap-4 cursor-pointer p-3 rounded-2xl hover:bg-white/[0.02] transition-colors">
            <div className="space-y-0.5">
              <span className="text-xs sm:text-sm font-semibold text-white block">
                Alertas de Pagamento e Créditos
              </span>
              <span className="text-xs text-slate-400 block">
                Receba comprovantes instantâneos ao recarregar pacotes ou receber bônus.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEmail}
              onChange={(e) => setNotificationsEmail(e.target.checked)}
              className="w-5 h-5 accent-violet-600 rounded cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-center justify-between gap-4 cursor-pointer p-3 rounded-2xl hover:bg-white/[0.02] transition-colors">
            <div className="space-y-0.5">
              <span className="text-xs sm:text-sm font-semibold text-white block">
                Alertas de Segurança
              </span>
              <span className="text-xs text-slate-400 block">
                Avisos sobre novos logins, alterações de senha e atividades suspeitas.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationsSecurity}
              onChange={(e) => setNotificationsSecurity(e.target.checked)}
              className="w-5 h-5 accent-violet-600 rounded cursor-pointer shrink-0"
            />
          </label>
        </div>

        <div className="pt-4 border-t border-[#1E202E]/60 flex justify-end">
          <button
            type="button"
            onClick={handleSavePreferences}
            disabled={isSaving}
            style={{ minHeight: "48px" }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Salvando..." : "Salvar Preferências"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
