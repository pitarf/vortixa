import React from "react";
import { Sparkles, Image, Video, Activity, Navigation, Wand2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const tools = [
    {
      name: "Geração de Imagem",
      description: "Crie imagens impressionantes a partir de descrições textuais usando FLUX.",
      icon: Image,
      href: "/dashboard/tools/image",
      cost: "1 crédito",
      color: "from-violet-500 to-indigo-500",
    },
    {
      name: "Imagem para Vídeo",
      description: "Transforme imagens estáticas em animações cinemáticas fluidas de 5s ou 10s.",
      icon: Video,
      href: "/dashboard/tools/video",
      cost: "10 créditos",
      color: "from-cyan-500 to-blue-500",
    },
    {
      name: "Motion Control",
      description: "Transfira movimentos e poses de um vídeo de referência para qualquer personagem.",
      icon: Activity,
      href: "/dashboard/tools/motion",
      cost: "15 créditos",
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      name: "Lip Sync",
      description: "Sincronize com perfeição a fala de qualquer vídeo com um arquivo de áudio de entrada.",
      icon: Navigation,
      href: "/dashboard/tools/lipsync",
      cost: "8 créditos",
      color: "from-emerald-500 to-teal-500",
    },
    {
      name: "Video Upscale",
      description: "Aumente a resolução e nitidez de seus vídeos gerados com inteligência artificial.",
      icon: Sparkles,
      href: "/dashboard/tools/upscale",
      cost: "5 créditos",
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
          <Wand2 className="h-7 w-7 text-violet-500 dark:text-violet-400" />
          Seu Estúdio Criativo
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Selecione uma das ferramentas abaixo para iniciar suas gerações de mídia por inteligência artificial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block bg-card border border-border rounded-2xl p-6 hover:border-violet-500/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            style={{ minHeight: "44px" }}
          >
            {/* Efeito Hover de Luz */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-500/10 to-transparent blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div className="flex items-start gap-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${tool.color} p-2.5 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/10`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-violet-600 dark:text-violet-400 font-semibold font-mono">Custo: {tool.cost}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
