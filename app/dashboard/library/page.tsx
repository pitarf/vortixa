"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Film,
  Search,
  Download,
  Boxes,
  Trash2,
  Maximize2,
  Clock,
  Wand2,
  Loader2,
  Copy,
  Check,
  Zap,
  X
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
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Fecha modal com Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
        setItemToDelete(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        toast.success("Ativo removido com sucesso!");
        setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
        setItemToDelete(null);
        if (selectedItem?.id === itemToDelete.id) {
          setSelectedItem(null);
        }
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

      toast.success("Mídia carregada com sucesso no VORIXA FLOW!");
      router.push(`/dashboard/flow/${flow.id}`);
    } catch (e: any) {
      toast.error(e.message || "Não foi possível abrir no Flow.");
    }
  };

  const copyPromptText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    toast.success("Prompt copiado para a área de transferência!");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header com Estética Studio Premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E202E] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30">
              <Film className="h-5 w-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-heading">
              Galeria & Biblioteca de Ativos
            </h1>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
              {stats.total} Arquivos
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Sua galeria unificada de gerações de IA, renderizações de flows e mídias prontas para exportação em alta resolução.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/create")}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold text-white shadow-xl shadow-violet-600/30 transition-all cursor-pointer touch-manipulation active:scale-[0.98] min-h-[48px] w-full sm:w-auto"
        >
          <Wand2 className="h-4 w-4" />
          <span>Criar Novo Ativo no Studio</span>
        </button>
      </div>

      {/* Barra de Filtros & Busca Mobile-First */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0D0E12] border border-[#1E202E] rounded-2xl p-3 shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none snap-x">
          {[
            { label: "Todos", val: "all", count: stats.total },
            { label: "Vídeos", val: "video", count: stats.videos },
            { label: "Imagens", val: "image", count: stats.images },
          ].map((t) => (
            <button
              key={t.val}
              type="button"
              onClick={() => setTypeFilter(t.val)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 touch-manipulation min-h-[44px] snap-start whitespace-nowrap ${
                typeFilter === t.val
                  ? "bg-[#13141B] border border-emerald-500/50 text-emerald-400 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{t.label}</span>
              <span className="px-2 py-0.5 rounded-md bg-[#070709] text-[10px] font-mono text-slate-400 border border-[#1E202E]">
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1 md:w-72">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por prompt, estilo ou ferramenta..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#13141B] border border-[#1E202E] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors min-h-[44px]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] border border-[#1E202E] text-xs font-bold text-slate-300 transition-all cursor-pointer min-h-[44px] touch-manipulation"
          >
            Filtrar
          </button>
        </form>
      </div>

      {/* Grid de Ativos Adaptativo: 1 col mobile, 2 cols tablet, 3-4 cols desktop */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
          <span className="text-xs font-mono text-slate-400">Carregando seus arquivos...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-[#1E202E] rounded-3xl p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto my-12 bg-[#0D0E12]/60">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <Film className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-heading">Sua biblioteca está vazia</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nenhuma mídia encontrada com os filtros selecionados. Crie imagens ou vídeos no Studio CREATE e eles aparecerão automaticamente aqui.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/dashboard/create")}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-600/30 min-h-[48px] w-full sm:w-auto"
          >
            Gerar no Studio CREATE
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {items.map((item) => {
            const hasSafeUrl = isSafeMediaUrl(item.url);
            return (
              <div
                key={item.id}
                className="group relative bg-[#0D0E12] border border-[#1E202E] hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                {/* Visualizador de Mídia */}
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  {item.status === "PROCESSING" || item.status === "PENDING" ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
                      <span className="text-[10px] font-mono text-slate-400">Renderizando...</span>
                    </div>
                  ) : item.status === "FAILED" ? (
                    <div className="text-center p-3">
                      <span className="text-[10px] font-mono text-red-400 block font-bold">FALHA NO MOTOR</span>
                      <span className="text-[9px] text-slate-500 line-clamp-2">{item.error || "Erro de renderização"}</span>
                    </div>
                  ) : hasSafeUrl ? (
                    item.mediaType === "video" ? (
                      <video
                        src={item.url}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onMouseOver={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                        onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.prompt || "Ativo VORIXA"}
                        onClick={() => setSelectedItem(item)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div className="text-[10px] font-mono text-slate-500">Mídia protegida</div>
                  )}

                  {/* Badges de Tipo e Modelo */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold text-white uppercase">
                      {item.mediaType}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-[9px] font-mono font-bold text-emerald-300">
                      {item.modelName}
                    </span>
                  </div>

                  {/* Overlay de Ações Rápidas em Desktop */}
                  {hasSafeUrl && item.status === "COMPLETED" && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center gap-2 p-2">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Visualizar em Tela Cheia"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                      <a
                        href={item.url}
                        download="vorixa-asset"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Baixar arquivo"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleOpenInFlow(item)}
                        className="p-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg shadow-violet-600/30"
                        title="Abrir no VORIXA FLOW"
                      >
                        <Boxes className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Metadados do Ativo */}
                <div className="p-3.5 space-y-2">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {item.toolName}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {item.prompt || "Geração procedural sem prompt textual."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1E202E] flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Botão de toque rápido no mobile para inspecionar */}
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white bg-[#070709] border border-[#1E202E] transition-colors min-h-[36px]"
                        title="Ver detalhes"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer min-h-[36px]"
                        title="Excluir da biblioteca"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Exclusão */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-heading">Remover ativo da biblioteca?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Esta ação removerá o registro e a URL da sua galeria. Os créditos utilizados na geração não serão impactados.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-xs font-bold text-slate-300 transition-all cursor-pointer min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteItem}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-all cursor-pointer min-h-[44px] shadow-lg shadow-red-600/30"
              >
                {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Theater Cinematográfico em Tela Cheia Responsivo */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-[#0D0E12] border border-[#1E202E] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90dvh]"
          >
            {/* Header do Lightbox */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#1E202E] bg-[#070709]">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-300 flex-shrink-0">
                  {selectedItem.modelName}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white font-heading truncate">
                  {selectedItem.toolName}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-slate-400 hover:text-white transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Fechar (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Visualizador de Alta Resolução com Controles Táteis */}
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[240px] sm:min-h-[400px] p-2">
              {selectedItem.mediaType === "video" ? (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  className="max-h-[55dvh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              ) : (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.prompt}
                  className="max-h-[55dvh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              )}
            </div>

            {/* Painel Inferior de Metadados e Ações com Scroll Interno */}
            <div className="p-3.5 sm:p-5 bg-[#0D0E12] border-t border-[#1E202E] space-y-3 sm:space-y-4 overflow-y-auto max-h-[35dvh]">
              {selectedItem.prompt && (
                <div className="bg-[#070709] border border-[#1E202E] rounded-2xl p-3 sm:p-4 flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Prompt Criativo</span>
                    <p className="text-xs text-slate-200 leading-relaxed break-words">{selectedItem.prompt}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyPromptText(selectedItem.prompt)}
                    className="p-2.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-slate-300 transition-colors flex-shrink-0 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Copiar Prompt"
                  >
                    {copiedPrompt ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center justify-between sm:justify-start gap-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-violet-400" />
                    <span>{new Date(selectedItem.createdAt).toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    <span>{selectedItem.creditCost} cr</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenInFlow(selectedItem)}
                    className="flex-1 sm:flex-initial px-4 sm:px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] shadow-lg shadow-violet-600/30"
                  >
                    <Boxes className="h-4 w-4" />
                    <span>Abrir no Flow</span>
                  </button>
                  <a
                    href={selectedItem.url}
                    download="vorixa-asset"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-4 sm:px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] shadow-lg shadow-emerald-600/30"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
