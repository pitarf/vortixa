"use client";

import React, { useState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [utms, setUtms] = useState<Record<string, string | null>>({});
  const router = useRouter();

  useEffect(() => {
    // Capture UTMs from URL
    const searchParams = new URLSearchParams(window.location.search);
    const capturedUtms = {
      utmSource: searchParams.get("utm_source"),
      utmMedium: searchParams.get("utm_medium"),
      utmCampaign: searchParams.get("utm_campaign"),
      utmContent: searchParams.get("utm_content"),
      utmTerm: searchParams.get("utm_term"),
      referrer: typeof document !== "undefined" ? document.referrer : null,
    };
    setUtms(capturedUtms);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (!agreeTerms) {
      toast.error("Você precisa aceitar os Termos de Uso e a Política de Privacidade (LGPD) para continuar.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          ...utms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Ocorreu um erro no cadastro.");
        return;
      }

      toast.success("Cadastro efetuado! Realizando login automático...");

      // Auto login after registration
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginRes?.error) {
        startTransition(() => {
          router.push("/login");
        });
      } else {
        startTransition(() => {
          router.push("/dashboard");
        });
      }
    } catch (err) {
      toast.error("Servidor instável. Tente novamente em alguns instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(240,10%,2%)] px-4 font-sans text-[hsl(0,0%,100%)]">
      <Toaster position="top-right" richColors />

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,rgba(168,85,247,0.03)_50%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 rounded-2xl border border-[hsl(240,6%,12%)] bg-[hsl(240,10%,4%)] p-8 shadow-2xl relative z-10">
        <div className="text-center">
          <h2 className="font-heading text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-[linear-gradient(135deg,hsl(262,83%,58%)_0%,hsl(224,100%,54%)_50%,hsl(180,100%,50%)_100%)]">
            VORTIXIA
          </h2>
          <p className="mt-2 text-sm text-[hsl(240,5%,65%)]">
            Crie sua conta para começar a gerar mídias com IA.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[hsl(240,5%,65%)]">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                required
                className="mt-1 block w-full rounded-lg border border-[hsl(240,6%,12%)] bg-[hsl(240,10%,2%)] px-4 py-3 text-sm text-[hsl(0,0%,100%)] placeholder-[hsl(240,5%,35%)] focus:border-[hsl(224,100%,54%)] focus:outline-none focus:ring-1 focus:ring-[hsl(224,100%,54%)] transition-colors"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-[hsl(240,5%,65%)]">
                Senha (mínimo 6 caracteres)
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full rounded-lg border border-[hsl(240,6%,12%)] bg-[hsl(240,10%,2%)] px-4 py-3 text-sm text-[hsl(0,0%,100%)] placeholder-[hsl(240,5%,35%)] focus:border-[hsl(224,100%,54%)] focus:outline-none focus:ring-1 focus:ring-[hsl(224,100%,54%)] transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Checkbox de Aceite dos Termos de Uso e LGPD */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[hsl(240,10%,2%)] border border-[hsl(240,6%,12%)]">
            <input
              id="agreeTerms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[hsl(240,6%,25%)] bg-[hsl(240,10%,4%)] text-[hsl(224,100%,54%)] focus:ring-[hsl(224,100%,54%)] cursor-pointer"
            />
            <label htmlFor="agreeTerms" className="text-xs text-[hsl(240,5%,65%)] leading-relaxed cursor-pointer select-none">
              Li e concordo com os{" "}
              <Link
                href="/termos"
                target="_blank"
                className="text-[hsl(224,100%,65%)] hover:underline font-semibold"
              >
                Termos de Uso
              </Link>{" "}
              e confirmo o tratamento dos meus dados conforme a{" "}
              <Link
                href="/termos#lgpd"
                target="_blank"
                className="text-[hsl(180,100%,50%)] hover:underline font-semibold"
              >
                Política de Privacidade (LGPD)
              </Link>.
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium bg-[hsl(224,100%,54%)] text-white hover:bg-[hsl(224,100%,48%)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(224,100%,54%)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {isLoading ? "Criando Conta..." : "Cadastrar com E-mail"}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[hsl(240,6%,12%)]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[hsl(240,10%,4%)] px-2 text-[hsl(240,5%,65%)]">OU</span>
          </div>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-[hsl(240,6%,12%)] bg-[hsl(240,10%,2%)] text-sm font-medium hover:bg-[hsl(240,4%,12%)] transition-all duration-300 hover:scale-[1.02]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Cadastrar com Google
          </button>
        </div>

        <p className="text-center text-xs text-[hsl(240,5%,65%)] mt-8">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-[hsl(180,100%,50%)] hover:underline font-semibold">
            Faça Login
          </Link>
        </p>
      </div>
    </div>
  );
}
