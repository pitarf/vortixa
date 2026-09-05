"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Film,
  Image as ImageIcon,
  Video,
  Music,
  Search,
  SlidersHorizontal,
  Download,
  Boxes,
  Trash2,
  Maximize2,
  Clock,
  Wand2,
  Layers,
  ArrowUpRight,
  Loader2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { isSafeMediaUrl } from "@/lib/flow-utils";

interface LibraryItem {
  id: string;
  jobId: string;
  url: string;
  mediaType: "image" | "video" | "audio";
  toolSlug: string;
  toolName: string;
  modelName: string;
  prompt: string;
  inputs: Record<string, any>;
  status: "COMPLETED" | "PROCESSING" | "PENDING" | "FAILED";
  creditCost: number;
  createdAt: string;
  error?: string | null;
}

interface Stats {
  total: number;
  images: number;
  videos: number;
  completed: number;
  processing: number;
}

export default function LibraryPage() {
  const router = useRouter();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, images: 0, videos: 0, completed: 0, processing: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Filtros
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [toolFilter, setToolFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  // Modal / Preview / Delete
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<LibraryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLibrary = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (toolFilter !== "ALL") params.append("tool", toolFilter);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/library?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setStats(data.stats || { total: 0, images: 0, videos: 0, completed: 0, processing: 0 });
      }
    } catch (e) {
      toast.error("Erro ao carregar a biblioteca de mídias.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [typeFilter, toolFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLibrary();
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/library/${itemToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Ativo removido da biblioteca.");
        setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
        setItemToDelete(null);
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao remover ativo.");
      }
    } catch {
      toast.error("Falha ao comunicar com o servidor.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenInFlow = async (item: LibraryItem) => {
    try {
      const res = await fetch("/api/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Flow - ${item.toolName}`,
          description: `Fluxo criado a partir do ativo ${item.id}.`,
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar fluxo.");
      const flow = await res.json();

      const nodeType = item.mediaType === "video" ? "video" : "image";

      await fetch(`/api/flows/${flow.id}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeType,
          title: item.toolName,
          positionX: 300,
          positionY: 200,
          toolSlug: item.toolSlug,
          config: {
            prompt: item.prompt,
            output_url: item.url,
          },
        }),
      });

      toast.success("Mídia carregada no VORIXA FLOW!");
      router.push(`/dashboard/flow/${flow.id}`);
    } catch (e: any) {
      toast.error(e.message || "Não foi possível abrir no Flow.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E202E] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <Film className="h-5 w-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-heading">
              Library & Ativos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase">
              {stats.total} Arquivos
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Sua galeria unificada de gerações de IA, mídias renderizadas em flows e arquivos prontos para exportação.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/create")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-xs font-bold text-white shadow-lg shadow-violet-600/20 transition-all cursor-pointer"
          style={{ minHeight: "44px" }}
        >
          <Wand2 className="h-4 w-4" />
          <span>Criar no Studio</span>
        </button>
      </div>

      {/* Barra de Filtros & Busca */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-3">
        {/* Filtro por Tipo */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {[
            { label: "Todos", val: "all", count: stats.total },
            { label: "Vídeos", val: "video", count: stats.videos },
            { label: "Imagens", val: "image", count: stats.images },
          ].map((t) => (
            <button
              key={t.val}
              onClick={() => setTypeFilter(t.val)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                typeFilter === t.val
                  ? "bg-[#13141B] border border-emerald-500/50 text-emerald-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              style={{ minHeight: "38px" }}
            >
              <span>{t.label}</span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#070709] text-[10px] font-mono text-slate-400">
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Busca por Prompt / Nome */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por prompt ou ferramenta..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#13141B] border border-[#1E202E] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              style={{ minHeight: "38px" }}
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-semibold text-slate-300 transition-all cursor-pointer"
            style={{ minHeight: "38px" }}
          >
            Filtrar
          </button>
        </form>
      </div>

      {/* Grid de Ativos */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
          <span className="text-xs font-mono text-slate-400">Carregando sua biblioteca...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-[#1E202E] rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto my-12 bg-[#0D0E12]/50">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Film className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-heading">Sua biblioteca está vazia</h3>
            <p className="text-xs text-slate-400">
              Nenhuma mídia encontrada com os filtros selecionados. Comece criando uma nova imagem ou vídeo no Studio.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/create")}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
            style={{ minHeight: "44px" }}
          >
            Gerar no Studio CREATE
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const hasSafeUrl = isSafeMediaUrl(item.url);
            return (
              <div
                key={item.id}
                className="group relative bg-[#0D0E12] border border-[#1E202E] hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
              >
                {/* Mídia / Preview */}
                <div className="relative aspect-video bg-black/80 flex items-center justify-center overflow-hidden">
                  {item.status === "PROCESSING" || item.status === "PENDING" ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
                      <span className="text-[10px] font-mono text-slate-400">Renderizando...</span>
                    </div>
                  ) : item.status === "FAILED" ? (
                    <div className="text-center p-3">
                      <span className="text-[10px] font-mono text-red-400 block font-bold">FALHA</span>
                      <span className="text-[9px] text-slate-500 line-clamp-2">{item.error || "Erro na IA"}</span>
                    </div>
                  ) : hasSafeUrl ? (
                    item.mediaType === "video" ? (
                      <video
                        src={item.url}
                        muted
                        loop
                        playsInline
                        onMouseOver={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                        onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.prompt || "Ativo VORIXA"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )
                  ) : (
                    <div className="text-[10px] font-mono text-slate-500">Mídia protegida</div>
                  )}

                  {/* Badge de Tipo */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold text-white uppercase">
                      {item.mediaType}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[9px] font-mono font-bold text-emerald-300">
                      {item.modelName}
                    </span>
                  </div>

                  {/* Overlay de Ações Rápidas em Hover */}
                  {hasSafeUrl && item.status === "COMPLETED" && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                        title="Visualizar em Tela Cheia"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                      <a
                        href={item.url}
                        download="vorixa-media"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                        title="Baixar arquivo"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleOpenInFlow(item)}
                        className="p-2.5 rounded-xl bg-violet-600/80 hover:bg-violet-600 text-white transition-all cursor-pointer"
                        title="Abrir no VORIXA FLOW"
                      >
                        <Boxes className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Metadados e Rodapé do Card */}
                <div className="p-3 space-y-2">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {item.toolName}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.prompt || "Geração sem prompt textual."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1E202E] flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
                    </div>

                    <button
                      onClick={() => setItemToDelete(item)}
                      className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Excluir da biblioteca"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Remover ativo da biblioteca?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Esta ação removerá o registro da mídia gerada. Os créditos utilizados não serão impactados.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-xs font-bold text-slate-300 transition-all cursor-pointer"
                style={{ minHeight: "44px" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteItem}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-all cursor-pointer"
                style={{ minHeight: "44px" }}
              >
                {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização Expandida */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#0D0E12] border border-[#1E202E] rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4 cursor-default"
          >
            <div className="aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center">
              {selectedItem.mediaType === "video" ? (
                <video src={selectedItem.url} controls autoPlay loop className="w-full h-full object-contain" />
              ) : (
                <img src={selectedItem.url} alt={selectedItem.prompt} className="w-full h-full object-contain" />
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">{selectedItem.toolName}</div>
                <div className="text-xs text-slate-400 font-mono">{selectedItem.modelName}</div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedItem.url}
                  download="vorixa-asset"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-white flex items-center gap-1.5"
                  style={{ minHeight: "44px" }}
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setSelectedItem(null)}
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
