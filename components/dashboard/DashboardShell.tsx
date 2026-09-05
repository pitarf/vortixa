"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Zap,
  Wand2,
  Boxes,
  Film,
  Image as ImageIcon,
  Video,
  Activity,
  Navigation,
  Layers,
  Coins,
  Star,
  Share2,
  Settings,
  HelpCircle,
  ShieldCheck,
  LogOut,
  Search,
  Bell,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Check,
  ExternalLink,
  Bot,
  User as UserIcon,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ProviderModeSwitch } from "@/components/layout/ProviderModeSwitch";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
  userBalance: number;
  isUnlimited: boolean;
}

export function DashboardShell({
  children,
  user,
  userBalance,
  isUnlimited,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Atalho de teclado global: Cmd + K / Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fecha dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/library?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const notifications = [
    {
      id: "1",
      title: "Kling AI 1.5 disponível!",
      desc: "Agora renderizando vídeos em 1080p a 60fps com estabilização cinemática.",
      time: "Há 10 min",
      read: false,
    },
    {
      id: "2",
      title: "Renderização 4K Concluída",
      desc: "Seu workflow 'Cyberpunk Hypercar' finalizou o upscale.",
      time: "Há 1 hora",
      read: false,
    },
    {
      id: "3",
      title: "Bônus de Créditos Creditado",
      desc: "Você recebeu 500 créditos promocionais de boas-vindas.",
      time: "Há 1 dia",
      read: true,
    },
  ];

  const creativeSuiteItems = [
    {
      name: "Studio CREATE",
      href: "/dashboard/create",
      icon: Wand2,
      badge: "NOVO",
      color: "text-violet-400",
    },
    {
      name: "VORIXA FLOW",
      href: "/dashboard/flow",
      icon: Boxes,
      badge: "Canvas",
      color: "text-cyan-400",
    },
    {
      name: "Build with AI",
      href: "/dashboard/flow?mode=ai",
      icon: Sparkles,
      badge: "✦ AI",
      color: "text-pink-400",
    },
  ];

  const engineItems = [
    { name: "FLUX.1 (Imagem)", href: "/dashboard/tools/image", icon: ImageIcon, color: "text-violet-400" },
    { name: "Kling AI (Vídeo)", href: "/dashboard/tools/video", icon: Video, color: "text-cyan-400" },
    { name: "LivePortrait (LipSync)", href: "/dashboard/tools/lipsync", icon: Navigation, color: "text-emerald-400" },
    { name: "Motion Control", href: "/dashboard/tools/motion", icon: Activity, color: "text-fuchsia-400" },
    { name: "Upscale 4K", href: "/dashboard/tools/upscale", icon: Layers, color: "text-amber-400" },
  ];

  const libraryItems = [
    { name: "Meus Ativos", href: "/dashboard/library", icon: Film },
    { name: "Favoritos", href: "/dashboard/library?tab=favorites", icon: Star },
    { name: "Compartilhados", href: "/dashboard/library?tab=shared", icon: Share2 },
  ];

  const systemItems = [
    { name: "Planos & Créditos", href: "/dashboard/credits", icon: Coins, highlight: true },
    { name: "Configurações", href: "/dashboard/settings", icon: Settings },
    { name: "Ajuda & Suporte", href: "https://docs.vorixa.com", icon: HelpCircle, external: true },
    ...(user?.role === "ADMIN"
      ? [{ name: "Painel Admin", href: "/dashboard/admin", icon: ShieldCheck, admin: true }]
      : []),
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Logo VORIXA CREATIVE OS */}
        <div className="px-3 pt-2 pb-1 flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-all">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent font-heading">
                  VORIXA
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                  OS 2.5
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                CREATIVE SUITE
              </span>
            </div>
          </Link>

          {/* Botão fechar mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#13141B]"
            aria-label="Fechar menu lateral"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Botão Início Principal */}
        <div className="px-1">
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              pathname === "/dashboard"
                ? "bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-transparent text-white border-l-2 border-violet-500 shadow-[inset_0_0_12px_rgba(99,102,241,0.15)]"
                : "text-slate-400 hover:text-white hover:bg-[#13141B]/80"
            }`}
            style={{ minHeight: "44px" }}
          >
            <div className="h-7 w-7 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Zap className="h-4 w-4" />
            </div>
            <span>Início (Dashboard)</span>
          </Link>
        </div>

        {/* Seção: Creative Suite */}
        <div>
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Creative Suite
          </div>
          <nav className="space-y-1">
            {creativeSuiteItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? "bg-violet-600/15 text-white border border-violet-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#13141B]/70"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${item.color} group-hover:scale-110 transition-transform`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-[9px] font-mono font-bold text-violet-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Seção: Motores de IA */}
        <div>
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Motores de IA
          </div>
          <nav className="space-y-1">
            {engineItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? "bg-[#13141B] text-white border border-[#1E202E]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#13141B]/50"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <item.icon className={`h-4 w-4 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Seção: Biblioteca */}
        <div>
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Biblioteca
          </div>
          <nav className="space-y-1">
            {libraryItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#13141B] text-white border border-[#1E202E]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#13141B]/50"
                  }`}
                  style={{ minHeight: "44px" }}
                >
                  <item.icon className="h-4 w-4 text-emerald-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Seção: Sistema */}
        <div>
          <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Sistema
          </div>
          <nav className="space-y-1">
            {systemItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  item.admin
                    ? "text-cyan-400 hover:bg-cyan-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#13141B]/50"
                }`}
                style={{ minHeight: "44px" }}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-slate-400" />
                  <span>{item.name}</span>
                </div>
                {item.external && <ExternalLink className="h-3 w-3 text-slate-500" />}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer da Sidebar: Perfil do Usuário */}
      <div className="pt-4 border-t border-[#1E202E] mt-6">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-[#0D0E12] border border-[#1E202E]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Avatar"}
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <span>{(user?.name || "U")[0]?.toUpperCase()}</span>
              )}
              {/* Indicador de Status Online */}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#070709]" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-slate-200 truncate">
                {user?.name || "Criador VORIXA"}
              </span>
              <span className="text-[10px] font-mono text-violet-400">
                Plano Creator Pro
              </span>
            </div>
          </div>

          <Link
            href="/api/auth/signout"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Encerrar Sessão"
            aria-label="Encerrar Sessão"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 flex flex-col font-sans selection:bg-violet-500/30 selection:text-white antialiased">
      {/* =========================================================================
          TOPBAR / HEADER FIXO ADAPTATIVO
         ========================================================================= */}
      <header className="h-16 border-b border-[#1E202E] bg-[#070709]/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
        {/* Lado Esquerdo: Mobile Trigger & Campo de Busca Global */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2.5 rounded-xl bg-[#0D0E12] border border-[#1E202E] text-slate-400 hover:text-white"
            aria-label="Abrir menu de navegação"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo Mobile */}
          <Link href="/dashboard" className="lg:hidden flex items-center gap-2 mr-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white">
              <Zap className="h-4 w-4 fill-current" />
            </div>
          </Link>

          {/* Campo de Busca Global Elegante e Translúcido */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 hidden sm:block">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar seus projetos, prompts ou ativos... [ ⌘ K ]"
              className="w-full pl-10 pr-12 py-2 rounded-2xl bg-[#0D0E12]/80 border border-[#1E202E] hover:border-violet-500/40 focus:border-violet-500 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner"
              style={{ minHeight: "44px" }}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#13141B] border border-[#1E202E] text-slate-400 pointer-events-none">
              ⌘ K
            </kbd>
          </form>
        </div>

        {/* Lado Direito: Status de IA, Créditos Dourados, Notificações, Tema e Avatar */}
        <div className="flex items-center gap-2.5 md:gap-3.5">
          {/* Status dos Motores de IA */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D0E12] border border-[#1E202E] text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-slate-300 font-semibold text-[11px]">Motores Online</span>
          </div>

          {/* Switch de Modo Turbo vs Simulação */}
          <div className="hidden md:block">
            <ProviderModeSwitch />
          </div>

          {/* Badge de Créditos Dourado Elegante */}
          <Link
            href="/dashboard/credits"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/15 border border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.12)] transition-all group cursor-pointer"
            style={{ minHeight: "44px" }}
            title="Clique para gerenciar ou adquirir créditos"
          >
            <div className="h-6 w-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Coins className="h-3.5 w-3.5" />
            </div>
            <div className="text-left">
              <span className="text-[9px] text-amber-300 uppercase font-mono block leading-none font-bold">
                Saldo
              </span>
              <span className="text-xs font-extrabold text-amber-200 group-hover:text-amber-100 transition-colors">
                {isUnlimited ? "ILIMITADO" : `${userBalance.toLocaleString("pt-BR")} créditos`}
              </span>
            </div>
          </Link>

          {/* Sino de Notificações */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2.5 rounded-2xl bg-[#0D0E12] border border-[#1E202E] hover:border-violet-500/50 text-slate-400 hover:text-white transition-all cursor-pointer"
              style={{ minHeight: "44px", minWidth: "44px" }}
              aria-label="Abrir notificações"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-[#070709] animate-pulse" />
            </button>

            {/* Popover de Notificações */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-[#0D0E12] border border-[#1E202E] shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E202E]">
                  <span className="text-xs font-bold text-white font-heading">Notificações</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 font-bold">
                    3 Novas
                  </span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        n.read
                          ? "bg-[#13141B]/40 border-transparent text-slate-400"
                          : "bg-[#13141B] border-[#1E202E] text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{n.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#1E202E] text-center">
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-[11px] font-mono text-violet-400 hover:text-violet-300 font-bold"
                  >
                    Marcar todas como lidas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Alternador de Tema */}
          <ThemeToggle />

          {/* Avatar com Dropdown de Ações */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="relative flex items-center gap-2 p-1 rounded-2xl bg-[#0D0E12] border border-[#1E202E] hover:border-violet-500/50 transition-all cursor-pointer"
              style={{ minHeight: "44px" }}
              aria-label="Menu do usuário"
            >
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Avatar"}
                    className="h-full w-full object-cover rounded-xl"
                  />
                ) : (
                  <span>{(user?.name || "U")[0]?.toUpperCase()}</span>
                )}
              </div>
              <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#070709]" />
            </button>

            {/* Menu Popover do Usuário */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-3xl bg-[#0D0E12] border border-[#1E202E] shadow-2xl p-2 z-50 space-y-1">
                <div className="p-3 border-b border-[#1E202E]">
                  <div className="text-xs font-bold text-white truncate">{user?.name || "Criador"}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email || "usuario@vorixa.com"}</div>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-mono bg-violet-500/20 text-violet-300 font-bold">
                    Plano Creator Pro
                  </span>
                </div>
                <Link
                  href="/dashboard/credits"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-[#13141B]"
                >
                  <Coins className="h-4 w-4 text-amber-400" />
                  <span>Comprar Créditos</span>
                </Link>
                <Link
                  href="/dashboard/library"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-[#13141B]"
                >
                  <Film className="h-4 w-4 text-emerald-400" />
                  <span>Meus Ativos</span>
                </Link>
                <div className="border-t border-[#1E202E] my-1" />
                <Link
                  href="/api/auth/signout"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Encerrar Sessão</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          CONTAINER PRINCIPAL: SIDEBAR FIXA + CONTEÚDO ROLÁVEL
         ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Lateral Desktop */}
        <aside className="w-64 border-r border-[#1E202E] bg-[#070709] p-4 hidden lg:flex flex-col justify-between overflow-y-auto">
          {renderSidebarContent()}
        </aside>

        {/* Drawer Mobile Deslizante */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop escuro com blur */}
            <div
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            />
            {/* Gaveta */}
            <div className="relative w-72 max-w-[85%] bg-[#070709] border-r border-[#1E202E] p-4 flex flex-col justify-between z-10 h-full overflow-y-auto">
              {renderSidebarContent()}
            </div>
          </div>
        )}

        {/* Área Central de Conteúdo */}
        <main className="flex-1 bg-[#070709] p-3 sm:p-5 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}