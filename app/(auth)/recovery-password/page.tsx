"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";

function RecoveryPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleRequestRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Por favor, preencha o seu e-mail.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/recovery-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Ocorreu um erro ao solicitar a recuperação.");
        return;
      }

      setEmailSent(true);
      toast.success("E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.");
    } catch (err) {
      toast.error("Servidor instável. Tente novamente em alguns instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas informadas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Token de recuperação inválido ou expirado.");
        return;
      }

      toast.success("Senha atualizada com sucesso! Redirecionando para o login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      toast.error("Servidor instável. Tente novamente em alguns instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#070709] px-4 py-8 sm:py-12 font-sans text-slate-100 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/15 via-indigo-600/10 to-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md space-y-6 rounded-3xl border border-[#1E202E] bg-[#0D0E12]/85 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl shadow-black/80 relative z-10">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <img
              src="/logos/logo principal.png"
              alt="VORTIXIA"
              className="h-10 sm:h-11 w-auto mx-auto object-contain"
            />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13141B] border border-[#1E202E] text-[11px] font-mono text-violet-300 font-bold">
            <KeyRound className="h-3.5 w-3.5 text-violet-400" />
            <span>RECUPERAÇÃO DE ACESSO</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white">
            {token ? "Redefinir Senha" : "Esqueceu sua senha?"}
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            {token
              ? "Crie uma nova credencial segura para voltar a acessar seu estúdio VORTIXIA."
              : "Digite o e-mail da sua conta para receber o link seguro de recuperação."}
          </p>
        </div>

        {token ? (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="newPassword" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nova Senha (mínimo 6 caracteres)
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#1E202E] bg-[#070709] pl-10 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 focus:outline-none transition-all min-h-[48px]"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer touch-manipulation"
                  aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#1E202E] bg-[#070709] pl-10 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 focus:outline-none transition-all min-h-[48px]"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-600/30 transition-all duration-200 disabled:opacity-50 cursor-pointer touch-manipulation active:scale-[0.98] min-h-[48px]"
            >
              {isLoading ? "Atualizando..." : "Salvar Nova Senha"}
            </button>
          </form>
        ) : emailSent ? (
          <div className="text-center space-y-4 py-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Instruções enviadas!</h3>
              <p className="text-xs text-slate-400">
                Verifique sua caixa de entrada no e-mail <strong className="text-slate-200">{email}</strong> e siga as instruções para redefinir sua senha.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEmailSent(false)}
              className="text-xs text-violet-400 hover:underline font-semibold py-2"
            >
              Enviar para outro e-mail
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleRequestRecovery}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Endereço de E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#1E202E] bg-[#070709] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 focus:outline-none transition-all min-h-[48px]"
                  placeholder="nome@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-600/30 transition-all duration-200 disabled:opacity-50 cursor-pointer touch-manipulation active:scale-[0.98] min-h-[48px]"
            >
              {isLoading ? (
                <span>Enviando link seguro...</span>
              ) : (
                <>
                  <span>Enviar Link de Recuperação</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar para o Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RecoveryPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070709] flex items-center justify-center text-white text-xs font-mono">
          Carregando módulo de segurança...
        </div>
      }
    >
      <RecoveryPasswordContent />
    </Suspense>
  );
}
