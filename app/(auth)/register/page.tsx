"use client";

import React, { useState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Gift } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [utms, setUtms] = useState<Record<string, string | null>>({});
  const [referralCode, setReferralCode] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
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

    let ref = searchParams.get("ref") || searchParams.get("referral") || searchParams.get("indicacao");
    
    if (!ref && typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)vorixa_ref=([^;]+)/);
      if (match) {
        ref = decodeURIComponent(match[1]);
      }
    }

    if (ref) {
      const cleanRef = ref.trim().toUpperCase();
      setReferralCode(cleanRef);
      if (typeof document !== "undefined") {
        document.cookie = `vorixa_ref=${encodeURIComponent(cleanRef)}; path=/; max-age=2592000; SameSite=Lax`;
      }
    }
  }, []);

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const passwordScore = getPasswordStrength();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    if (!agreeTerms) {
      toast.error("Você precisa concordar com os Termos de Uso e Política de Privacidade para prosseguir.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          referralCode: referralCode || undefined,
          ...utms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Ocorreu um erro no cadastro.");
        return;
      }

      toast.success("Conta criada com sucesso! Conectando você ao estúdio...");

      const loginRes = await signIn("credentials", {
        email: email.trim(),
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
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#070709] px-4 py-8 sm:py-12 font-sans text-slate-100 relative overflow-hidden">
      {/* Luz Ambiental Cinematográfica */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/15 via-indigo-600/10 to-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md space-y-6 rounded-3xl border border-[#1E202E] bg-[#0D0E12]/85 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl shadow-black/80 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13141B] border border-[#1E202E] text-[11px] font-mono text-emerald-300 font-bold mb-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>CRIAÇÃO DE CONTA PROFISSIONAL</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-white">
            VORIXA
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Cadastre-se gratuitamente e receba créditos para experimentar nossos motores neurais.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nome Completo
            </label>
            <div className="relative">
              <User className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                className="w-full rounded-xl border border-[#1E202E] bg-[#070709] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 focus:outline-none transition-all min-h-[48px]"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Endereço de E-mail
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

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-[#1E202E] bg-[#070709] pl-10 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 focus:outline-none transition-all min-h-[48px]"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Medidor de Força de Senha */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="grid grid-cols-4 gap-1.5">
                  <div className={`h-1 rounded-full ${passwordScore >= 1 ? "bg-rose-500" : "bg-[#1E202E]"}`} />
                  <div className={`h-1 rounded-full ${passwordScore >= 2 ? "bg-amber-500" : "bg-[#1E202E]"}`} />
                  <div className={`h-1 rounded-full ${passwordScore >= 3 ? "bg-cyan-500" : "bg-[#1E202E]"}`} />
                  <div className={`h-1 rounded-full ${passwordScore >= 4 ? "bg-emerald-500" : "bg-[#1E202E]"}`} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Força: {passwordScore <= 1 ? "Fraca" : passwordScore === 2 ? "Razoável" : passwordScore === 3 ? "Boa" : "Excelente"}</span>
                </div>
              </div>
            )}
          </div>

          {/* Código de Indicação com Destaque Visual */}
          <div className="p-3 bg-[#070709] border border-[#1E202E] rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="referralCode" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Gift className="h-3.5 w-3.5 text-emerald-400" />
                <span>Código de Indicação (Opcional)</span>
              </label>
              {referralCode && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  🎁 Bônus Ativo
                </span>
              )}
            </div>
            <input
              id="referralCode"
              type="text"
              className="w-full rounded-xl border border-[#1E202E] bg-[#13141B] px-3.5 py-2.5 text-xs text-white uppercase placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-colors font-mono min-h-[44px]"
              placeholder="Ex: VORIXA-ABC12"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            />
          </div>

          {/* Aceite dos Termos & LGPD */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#070709] border border-[#1E202E]">
            <input
              id="agreeTerms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#1E202E] bg-[#13141B] text-violet-600 focus:ring-violet-500 cursor-pointer min-h-[20px] min-w-[20px]"
            />
            <label htmlFor="agreeTerms" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
              Li e concordo com os{" "}
              <Link href="/termos" target="_blank" className="text-violet-400 hover:underline font-semibold">
                Termos de Uso
              </Link>{" "}
              e confirmo o tratamento dos meus dados conforme a{" "}
              <Link href="/termos#lgpd" target="_blank" className="text-cyan-400 hover:underline font-semibold">
                Política de Privacidade (LGPD)
              </Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !agreeTerms}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer touch-manipulation active:scale-[0.98] min-h-[48px]"
          >
            {isLoading ? (
              <span>Criando sua conta...</span>
            ) : (
              <>
                <span>Cadastrar e Começar</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1E202E]" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-wider">
            <span className="bg-[#0D0E12] px-3 text-slate-500">Ou cadastre com</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#1E202E] bg-[#070709] hover:bg-[#13141B] text-xs font-bold text-slate-200 transition-all duration-200 cursor-pointer touch-manipulation active:scale-[0.98] min-h-[48px]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
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
          <span>Criar com o Google</span>
        </button>

        <p className="text-center text-xs text-slate-400 mt-4">
          Já possui uma conta?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 hover:underline font-bold py-1">
            Fazer Login
          </Link>
        </p>
      </div>
    </div>
  );
}
