import React from "react";
import { Sparkles, Image, Video, User, LogOut, Navigation, Menu, Activity } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { name: "Geração de Imagem", href: "/dashboard/tools/image", icon: Image },
    { name: "Imagem para Vídeo", href: "/dashboard/tools/video", icon: Video },
    { name: "Motion Control", href: "/dashboard/tools/motion", icon: Activity },
    { name: "Lip Sync", href: "/dashboard/tools/lipsync", icon: Navigation },
    { name: "Video Upscale", href: "/dashboard/tools/upscale", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans">
      {/* Header Fixo */}
      <header className="h-16 border-b border-slate-900 bg-black/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-black shadow-lg shadow-violet-500/20">
            V
          </div>
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            VORIXA
          </span>
        </div>

        {/* Links Rápidos / Info do Usuário */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <div className="h-4 w-px bg-slate-900" />
          <Link
            href="/login"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
            style={{ minHeight: "44px" }}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Lateral (Desktop) */}
        <aside className="w-full md:w-64 border-r border-slate-900 bg-slate-950/20 p-4 space-y-2 hidden md:block">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-4">
            Ferramentas de IA
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all group"
                style={{ minHeight: "44px" }}
              >
                <item.icon className="h-5 w-5 text-slate-500 group-hover:text-violet-400 transition-colors" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Sidebar Compacto Mobile (Horizontal Drawer) */}
        <div className="md:hidden border-b border-slate-900 bg-slate-950/40 p-2 flex items-center overflow-x-auto gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 transition-all border border-slate-900"
              style={{ minHeight: "44px" }}
            >
              <item.icon className="h-4 w-4 text-slate-500" />
              <span>{item.name.split(" ")[0]}</span>
            </Link>
          ))}
        </div>

        {/* Conteúdo Principal */}
        <main className="flex-1 bg-black p-2 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
