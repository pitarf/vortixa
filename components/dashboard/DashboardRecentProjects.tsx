"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  MoreVertical,
  Film,
  Download,
  Boxes,
  Maximize2,
  Trash2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export interface ProjectItem {
  id: string;
  title: string;
  model: string;
  duration?: string;
  timeAgo: string;
  mediaType: "video" | "image";
  thumbnailUrl: string;
  mediaUrl: string;
}

interface DashboardRecentProjectsProps {
  projects: ProjectItem[];
}

export function DashboardRecentProjects({ projects }: DashboardRecentProjectsProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [lightboxProject, setLightboxProject] = useState<ProjectItem | null>(null);

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link da mídia copiado para a área de transferência!");
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E202E] pb-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white font-heading">
            Seus últimos projetos
          </h2>
          <p className="text-xs text-slate-400">
            Acompanhe o status de suas gerações e retome suas produções.
          </p>
        </div>

        <Link
          href="/dashboard/library"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-violet-300 font-mono transition-colors"
        >
          <span>Ver todos os projetos</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid de Projetos Widescreen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group relative rounded-2xl bg-[#0D0E12] border border-[#1E202E] hover:border-violet-500/50 overflow-hidden transition-all duration-300 flex flex-col justify-between"
          >
            {/* Thumbnail / Mídia Widescreen */}
            <div
              onClick={() => setLightboxProject(project)}
              className="relative aspect-video bg-black/80 flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {project.mediaType === "video" ? (
                <video
                  src={project.mediaUrl}
                  poster={project.thumbnailUrl}
                  muted
                  loop
                  playsInline
                  onMouseOver={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                  onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}

              {/* Botão de Play Central em Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="h-11 w-11 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Badges de Duração & Tipo */}
              {project.duration && (
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white">
                  {project.duration}
                </span>
              )}

              {/* Badge do Modelo */}
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold text-violet-300">
                {project.model}
              </span>
            </div>

            {/* Metadados e Menu de 3 Pontos */}
            <div className="p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 truncate">
                  <h4
                    onClick={() => setLightboxProject(project)}
                    className="text-xs font-bold text-slate-200 hover:text-violet-300 transition-colors truncate cursor-pointer"
                  >
                    {project.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{project.timeAgo}</span>
                  </div>
                </div>

                {/* Botão Menu 3 Pontos */}
                <div className="relative">
                  <button
                    onClick={(e) => toggleMenu(project.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#13141B] transition-colors cursor-pointer"
                    aria-label="Opções do projeto"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenuId === project.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 bottom-full mb-1 w-44 rounded-2xl bg-[#0D0E12] border border-[#1E202E] shadow-2xl p-1.5 z-30 space-y-0.5"
                    >
                      <button
                        onClick={() => {
                          setLightboxProject(project);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-[#13141B] text-left"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Visualizar</span>
                      </button>

                      <a
                        href={project.mediaUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-[#13141B] text-left"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Baixar Mídia</span>
                      </a>

                      <Link
                        href="/dashboard/flow"
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-violet-300 hover:bg-violet-600/10 text-left"
                      >
                        <Boxes className="h-3.5 w-3.5" />
                        <span>Abrir no Flow</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal de Mídia em Tela Cheia */}
      {lightboxProject && (
        <div
          onClick={() => setLightboxProject(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#0D0E12] border border-[#1E202E] rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4 cursor-default"
          >
            <div className="aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center">
              {lightboxProject.mediaType === "video" ? (
                <video
                  src={lightboxProject.mediaUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={lightboxProject.mediaUrl}
                  alt={lightboxProject.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{lightboxProject.title}</h3>
                <span className="text-xs font-mono text-slate-400">{lightboxProject.model}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={lightboxProject.mediaUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white flex items-center gap-1.5"
                  style={{ minHeight: "44px" }}
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setLightboxProject(null)}
                  className="px-4 py-2 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-slate-300"
                  style={{ minHeight: "44px" }}
                >
                  Fechar (Esc)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}