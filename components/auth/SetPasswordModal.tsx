"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, ShieldAlert, KeyRound } from "lucide-react";
import { toast } from "sonner";

export function SetPasswordModal() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem. Digite novamente.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Não foi possível cadastrar a senha.");
        return;
      }

      setIsSuccess(true);
      toast.success("Senha cadastrada com sucesso!");

      setTimeout(() => {
        // Recarregar a página para atualizar o estado da sessão no dashboard
        router.refresh();
      }, 1200);
    } catch (err) {
      toast.error("Servidor instável. Tente novamente em alguns instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl border border-[#1E202E] bg-[#0A0B0E] p-6 md:p-8 shadow-2xl space-y-6">
        {/* Glow Superior */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-48 bg-gradient-to-r from-violet-600/30 via-indigo-500/20 to-cyan-500/30 blur-2xl pointer-events-none rounded-full" />

        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-500/30 text-violet-400 shadow-inner">
            <KeyRound className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black font-heading tracking-tight text-white">
            Configure sua Senha
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Você entrou com o Google! Para sua segurança e permitir o login tradicional com E-mail + Senha no futuro, defina uma senha de acesso.
          </p>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-200">
              Senha configurada com sucesso!
            </p>
            <p className="text-xs text-slate-400">
              Liberando acesso ao seu Dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-violet-400" />
                <span>Nova Senha</span>
              </label>
              <input
                type="password"
                required
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#1E202E] bg-[#070709] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-violet-400" />
                <span>Confirmar Nova Senha</span>
              </label>
              <input
                type="password"
                required
                placeholder="Repita a senha digitada"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-[#1E202E] bg-[#070709] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all font-sans"
              />
            </div>

            <div className="rounded-xl bg-violet-950/20 border border-violet-900/30 p-3 text-[11px] text-violet-300 flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span>
                Com esta senha, você poderá acessar o VORTIXIA de qualquer dispositivo mesmo sem estar conectado à sua conta Google.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-500 py-3.5 text-sm font-bold font-heading text-white shadow-lg shadow-violet-600/25 hover:opacity-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Gravando Senha..." : "Salvar Senha e Acessar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
