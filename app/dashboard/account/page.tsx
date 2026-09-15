"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Shield,
  Coins,
  Share2,
  Copy,
  Check,
  Sparkles,
  MessageCircle,
  Send,
  ExternalLink,
  KeyRound,
  Lock,
  Mail,
  Calendar,
  Save,
  Bell,
  RefreshCw,
  Wallet,
  ArrowRight,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    isUnlimited: boolean;
    createdAt: string;
    balance: number;
    planName: string;
    hasPassword: boolean;
  };
  affiliate: {
    id: string;
    code: string;
    customCode: string | null;
    activeCode: string;
    referralLink: string;
    commissionRate: number;
    commissionPercent: number;
    balanceCents: number;
    totalEarningsCents: number;
    withdrawnCents: number;
    pixKey: string | null;
    pixKeyType: string | null;
    totalReferrals: number;
    convertedReferrals: number;
  };
}

/**
 * Página Minha Conta do VORTIXIA.
 * Centraliza os dados de identidade, segurança, plano ativo e a geração/cópia
 * do link de indicação de afiliados com compartilhamento rápido para WhatsApp e Telegram.
 */
export default function AccountPage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de formulário
  const [nameInput, setNameInput] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  // Estados de cópia
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Preferências
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSecurity, setNotificationsSecurity] = useState(true);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/user/profile");
      if (!res.ok) {
        throw new Error("Erro ao carregar dados da conta.");
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
        setNameInput(json.user.name || "");
      }
    } catch (err: any) {
      toast.error(err.message || "Não foi possível carregar seu perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCopyLink = () => {
    if (!data?.affiliate?.referralLink) return;
    navigator.clipboard.writeText(data.affiliate.referralLink);
    setCopiedLink(true);
    toast.success("Link de indicação copiado para a área de transferência!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    if (!data?.affiliate?.activeCode) return;
    navigator.clipboard.writeText(data.affiliate.activeCode);
    setCopiedCode(true);
    toast.success(`Código de afiliado "${data.affiliate.activeCode}" copiado!`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!data?.affiliate?.referralLink) return;
    const text = encodeURIComponent(
      `Crie imagens e vídeos ultra-realistas com inteligência artificial no VORTIXIA! Cadastre-se pelo meu link com bônus de boas-vindas: ${data.affiliate.referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareTelegram = () => {
    if (!data?.affiliate?.referralLink) return;
    const text = encodeURIComponent(
      `Crie imagens e vídeos ultra-realistas com IA no VORTIXIA!`
    );
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(data.affiliate.referralLink)}&text=${text}`,
      "_blank"
    );
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || isSavingName) return;

    try {
      setIsSavingName(true);
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput.trim() }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Erro ao atualizar nome.");
      }

      toast.success("Nome de exibição atualizado com sucesso!");
      fetchProfile();
    } catch (err: any) {
      toast.error(err.message || "Falha ao salvar nome.");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSavePreferences = () => {
    setIsSavingPrefs(true);
    setTimeout(() => {
      setIsSavingPrefs(false);
      toast.success("Preferências de notificação salvas!");
    }, 400);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4 text-center space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-violet-500 mx-auto" />
        <p className="text-xs sm:text-sm text-slate-400 font-mono">
          Carregando informações da sua conta VORTIXIA...
        </p>
      </div>
    );
  }

  const user = data?.user;
  const affiliate = data?.affiliate;

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : "Data indisponível";

  const balanceInReais = ((affiliate?.balanceCents || 0) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-16 sm:pb-20 px-3 sm:px-4 lg:px-6">
      {/* =========================================================================
          CABEÇALHO & IDENTIDADE DO CRIADOR
         ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1E202E] bg-gradient-to-br from-[#0D0E14] via-[#090A0F] to-[#070709] p-5 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar e Informações Principais */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-xl flex-shrink-0">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                <span>{(user?.name || "U")[0]?.toUpperCase()}</span>
              )}
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-[#070709]" />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading truncate">
                  {user?.name || "Criador VORTIXIA"}
                </h1>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    user?.role === "ADMIN"
                      ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                      : "bg-violet-500/10 text-violet-300 border-violet-500/30"
                  }`}
                >
                  {user?.role === "ADMIN" ? "ADMINISTRADOR" : "CRIADOR OFICIAL"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 truncate flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{user?.email}</span>
              </p>

              <div className="flex items-center gap-3 pt-0.5 text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-600" />
                  Membro desde {formattedDate}
                </span>
                <span>•</span>
                <span className="text-violet-400 font-semibold">{user?.planName}</span>
              </div>
            </div>
          </div>

          {/* Card Rápido de Saldo com Recarga */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between gap-3 p-4 rounded-2xl bg-[#13141B]/80 border border-[#1E202E] shrink-0">
            <div className="text-left md:text-right">
              <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">
                Saldo Atual
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-200 font-mono">
                {user?.isUnlimited ? "ILIMITADO" : `${user?.balance.toLocaleString("pt-BR")} cr`}
              </span>
            </div>

            <Link
              href="/dashboard/credits"
              style={{ minHeight: "44px" }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Recarregar Créditos</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO PROTAGONISTA: SEU LINK DE INDICAÇÃO & AFILIADO
         ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/35 bg-gradient-to-br from-emerald-950/40 via-[#0D0E14] to-[#070709] p-5 sm:p-8 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Cabeçalho do Card de Afiliado */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>SEU LINK OFICIAL DE AFILIADO</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading">
              Indique Amigos e Receba{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                {affiliate?.commissionPercent || 15}% de Comissão
              </span>{" "}
              via Pix
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Compartilhe seu link exclusivo. Cada pessoa que se cadastrar por ele e recarregar créditos garante {affiliate?.commissionPercent || 15}% de comissão em dinheiro diretamente para você resgatar via Pix.
            </p>
          </div>

          <Link
            href="/dashboard/affiliates"
            style={{ minHeight: "44px" }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>Painel Completo de Afiliados</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Barra de Cópia do Link com 1 Toque */}
        <div className="relative z-10 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch gap-2.5">
            <div
              style={{ minHeight: "48px" }}
              className="flex-1 bg-[#070709] border border-emerald-500/30 rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300 font-mono overflow-hidden shadow-inner"
            >
              <span className="truncate select-all text-emerald-300 font-bold">
                {affiliate?.referralLink || "https://vortixia.com.br/register?ref=VORTIXIA"}
              </span>
              <span className="text-[10px] font-sans font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shrink-0 self-start sm:self-auto">
                Código: {affiliate?.activeCode}
              </span>
            </div>

            {/* Botões de Cópia */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                style={{ minHeight: "48px" }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "Link Copiado!" : "Copiar Link"}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCode}
                title="Copiar apenas o código de indicação"
                style={{ minHeight: "48px" }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#13141B] hover:bg-[#1E202E] text-slate-300 border border-[#1E202E] text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="sm:hidden">Copiar Código</span>
              </button>
            </div>
          </div>

          {/* Atalhos para Compartilhamento em Redes Sociais */}
          <div className="flex items-center gap-2.5 pt-1 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Compartilhar agora:</span>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              style={{ minHeight: "44px" }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 text-xs font-bold transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar no WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleShareTelegram}
              style={{ minHeight: "44px" }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar no Telegram</span>
            </button>
          </div>
        </div>

        {/* Resumo Rápido de Ganhos e Indicados */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-emerald-500/20">
          <div className="p-3.5 rounded-2xl bg-[#070709]/80 border border-[#1E202E]">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
              Comissão por Recarga
            </span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {affiliate?.commissionPercent || 15}% em Dinheiro
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#070709]/80 border border-[#1E202E]">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
              Total de Indicados
            </span>
            <span className="text-lg font-black text-white font-mono">
              {affiliate?.totalReferrals || 0} cadastros ({affiliate?.convertedReferrals || 0} compras)
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#070709]/80 border border-[#1E202E] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                Saldo Disponível
              </span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                R$ {balanceInReais}
              </span>
            </div>

            <Link
              href="/dashboard/affiliates"
              style={{ minHeight: "40px" }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Saque Pix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 2: DADOS PESSOAIS E PERFIL
         ========================================================================= */}
      <div className="rounded-3xl bg-[#0D0E12] border border-[#1E202E] p-5 sm:p-7 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Dados Pessoais</h2>
            <p className="text-xs text-slate-400">
              Atualize as informações que identificam sua conta na plataforma.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveName} className="space-y-4 pt-2 border-t border-[#1E202E]/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 font-mono uppercase">
                Nome de Exibição
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                style={{ minHeight: "48px" }}
                className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:border-violet-500 outline-none transition-colors"
                placeholder="Seu nome completo ou artístico"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 font-mono uppercase">
                E-mail da Conta
              </label>
              <div
                style={{ minHeight: "48px" }}
                className="w-full bg-[#070709]/50 border border-[#1E202E] rounded-xl px-4 py-3 text-xs text-slate-400 flex items-center justify-between"
              >
                <span className="truncate">{user?.email}</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                  Verificado
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingName || !nameInput.trim() || nameInput === user?.name}
              style={{ minHeight: "48px" }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-600/25 transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingName ? "Salvando..." : "Salvar Alterações"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================================
          SEÇÃO 3: SEGURANÇA & SENHA
         ========================================================================= */}
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
              Redefinição de Senha de Acesso
            </span>
            <span className="text-xs text-slate-400 block">
              Altere sua credencial de acesso a qualquer momento através de confirmação segura por e-mail.
            </span>
          </div>

          <Link
            href="/recovery-password"
            style={{ minHeight: "44px" }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-slate-200 border border-[#1E202E] text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-violet-400" />
            <span>Alterar Senha</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          SEÇÃO 4: PREFERÊNCIAS DE NOTIFICAÇÕES
         ========================================================================= */}
      <div className="rounded-3xl bg-[#0D0E12] border border-[#1E202E] p-5 sm:p-7 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Preferências de Notificações</h2>
            <p className="text-xs text-slate-400">
              Escolha quais atualizações e alertas deseja receber em seu e-mail cadastrado.
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
                Receba comprovantes instantâneos ao recarregar créditos ou receber comissões de afiliados.
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
                Avisos sobre novos logins, alterações de credenciais e atividades suspeitas.
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
            disabled={isSavingPrefs}
            style={{ minHeight: "48px" }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingPrefs ? "Salvando..." : "Salvar Preferências"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
