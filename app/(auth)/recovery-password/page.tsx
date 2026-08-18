"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Toaster, toast } from "sonner";

export default function RecoveryPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, preencha o campo de e-mail.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/recovery-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Ocorreu um erro ao processar a solicitação.");
        return;
      }

      toast.success("E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.");
    } catch (err) {
      toast.error("Servidor instável. Tente novamente em alguns instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(240,10%,2%)] px-4 font-sans text-[hsl(0,0%,100%)]">
      <Toaster position="top-right" richColors />

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,rgba(168,85,247,0.03)_50%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 rounded-2xl border border-[hsl(240,6%,12%)] bg-[hsl(240,10%,4%)] p-8 shadow-2xl relative z-10">
        <div className="text-center">
          <h2 className="font-heading text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-[linear-gradient(135deg,hsl(262,83%,58%)_0%,hsl(224,100%,54%)_50%,hsl(180,100%,50%)_100%)]">
            VORIXA
          </h2>
          <p className="mt-2 text-sm text-[hsl(240,5%,65%)]">
            Insira seu e-mail para recuperar o acesso à sua conta.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRecovery}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[hsl(240,5%,65%)]">
              Endereço de E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full rounded-lg border border-[hsl(240,6%,12%)] bg-[hsl(240,10%,2%)] px-4 py-3 text-sm text-[hsl(0,0%,100%)] placeholder-[hsl(240,5%,35%)] focus:border-[hsl(224,100%,54%)] focus:outline-none focus:ring-1 focus:ring-[hsl(224,100%,54%)] transition-colors"
              placeholder="nome@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium bg-[hsl(224,100%,54%)] text-white hover:bg-[hsl(224,100%,48%)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(224,100%,54%)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {isLoading ? "Enviando..." : "Enviar Instruções"}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-[hsl(240,5%,65%)] mt-8">
          Lembrou a senha?{" "}
          <Link href="/login" className="text-[hsl(180,100%,50%)] hover:underline font-semibold">
            Voltar para o Login
          </Link>
        </p>
      </div>
    </div>
  );
}
