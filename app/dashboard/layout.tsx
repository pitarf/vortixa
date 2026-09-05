import React from "react";
import {
  Sparkles,
  Image,
  Video,
  User,
  LogOut,
  Navigation,
  Activity,
  Boxes,
  Film,
  Wand2,
  Coins,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreditService } from "@/services/credit.service";

import { ProviderModeSwitch } from "@/components/layout/ProviderModeSwitch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let userBalance = 0;
  let isUnlimited = false;

  if (session?.user?.id) {
    try {
      userBalance = await CreditService.getBalance(session.user.id);
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { isUnlimited: true },
      });
      isUnlimited = !!user?.isUnlimited;
    } catch {
      // Fallback gracioso caso banco esteja inacessível
    }
  }

  const primaryMenuItems = [
    {
      name: "Studio CREATE",
      href: "/dashboard/create",
      icon: Wand2,
      badge: "NOVO",
      color: "text-violet-400",
    },
    {
      name: "VORIXA Flow",
      href: "/dashboard/flow",
      icon: Boxes,
      badge: "Canvas",
      color: "text-cyan-400",
    },
    {
      name: "Library",
      href: "/dashboard/library",
      icon: Film,
      badge: "Ativos",
      color: "text-emerald-400",
    },
  ];

  const toolMenuItems = [
    { name: "FLUX Imagem", href: "/dashboard/tools/image", icon: Image },
    { name: "Kling Vídeo", href: "/dashboard/tools/video", icon: Video },
    { name: "Motion Control", href: "/dashboard/tools/motion", icon: Activity },
    { name: "Lip Sync", href: "/dashboard/tools/lipsync", icon: Navigation },
    { name: "Video Upscale", href: "/dashboard/tools/upscale", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-violet-500/30 selection:text-white">
      {/* Header Fixo Adaptativo */}
      <header className="h-16 border-b border-border bg-background/90 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black shadow-lg shadow-violet-600/25 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-wider bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent font-heading">
                VORTIXIA
              </span>
              <span className="text-[9px] font-mono tracking-widest text-violet-500 dark:text-violet-400 font-semibold uppercase -mt-1">
                AI Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Informações do Usuário & Saldo */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Switch Modo Real vs Mock */}
          <ProviderModeSwitch />

          {/* Alternador de Tema Claro / Escuro */}
          <ThemeToggle />

          {/* Badge de Saldo */}
          <Link
            href="/dashboard/credits"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border hover:border-violet-500/50 transition-all group"
            style={{ minHeight: "44px" }}
          >
            <div className="h-6 w-6 rounded-lg bg-violet-600/20 text-violet-500 dark:text-violet-400 flex items-center justify-center">
              <Coins className="h-3.5 w-3.5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block leading-none">Saldo</span>
              <span className="text-xs font-bold text-foreground group-hover:text-violet-500 transition-colors">
                {isUnlimited ? "ILIMITADO" : `${userBalance} créditos`}
              </span>
            </div>
          </Link>

          <div className="h-5 w-px bg-border" />

          {/* Sair */}
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/60"
            style={{ minHeight: "44px" }}
            title="Encerrar sessão"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Lateral Desktop */}
        <aside className="w-full md:w-64 border-r border-border bg-card/60 p-4 space-y-6 hidden md:block">
          {/* Menu Principal */}
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-3 mb-2.5">
              Creative Suite
            </div>
            <nav className="space-y-1">
              {primaryMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-foreground hover:bg-slate-100 dark:hover:bg-[#13141B] border border-transparent hover:border-border transition-all group"
                  style={{ minHeight: "44px" }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${item.color} group-hover:scale-110 transition-transform`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono text-violet-600 dark:text-violet-400">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Ferramentas Individuais */}
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-3 mb-2.5">
              Motores Individuais
            </div>
            <nav className="space-y-1">
              {toolMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-[#13141B]/70 transition-all group"
                  style={{ minHeight: "44px" }}
                >
                  <item.icon className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-violet-500 transition-colors" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Gestão e Admin */}
          <div className="pt-4 border-t border-border">
            <div className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-3 mb-2.5">
              Sistema & Gestão
            </div>
            <nav className="space-y-1">
              <Link
                href="/dashboard/credits"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-[#13141B]/70 transition-all group"
                style={{ minHeight: "44px" }}
              >
                <Coins className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-amber-500 transition-colors" />
                <span>Comprar Créditos</span>
              </Link>
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-[#13141B]/70 transition-all group"
                style={{ minHeight: "44px" }}
              >
                <ShieldCheck className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-cyan-500 transition-colors" />
                <span>Painel Admin</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Menu Mobile Horizontal com toque suave */}
        <div className="md:hidden border-b border-border bg-card p-2 flex items-center overflow-x-auto gap-2 scrollbar-none">
          {primaryMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-foreground bg-background border border-border"
              style={{ minHeight: "44px" }}
            >
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span>{item.name}</span>
            </Link>
          ))}
          {toolMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 bg-background border border-border"
              style={{ minHeight: "44px" }}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.name.split(" ")[0]}</span>
            </Link>
          ))}
        </div>

        {/* Conteúdo Principal */}
        <main className="flex-1 bg-background p-3 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
