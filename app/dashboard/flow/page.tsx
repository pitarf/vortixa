"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Boxes,
  Play,
  Clock,
  Sparkles,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface FlowItem {
  id: string;
  name: string;
  description?: string | null;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  _count?: {
    nodes?: number;
    connections?: number;
    executions?: number;
  };
}

export default function FlowListingPage() {
  const router = useRouter();
  const [flows, setFlows] = useState<FlowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchFlows = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/flows");
      if (res.ok) {
        const data = await res.json();
        setFlows(data.flows || []);
      }
    } catch (err) {
      toast.error("Erro ao carregar seus fluxos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const handleCreateNewFlow = async () => {
    try {
      setIsCreating(true);
      const res = await fetch("/api/flows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Novo Fluxo Criativo",
          description: "Fluxo de inteligência artificial generativa.",
        }),
      });

      if (res.ok) {
        const newFlow = await res.json();
        toast.success("Fluxo criado com sucesso!");
        router.push(`/dashboard/flow/${newFlow.id}`);
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao criar novo fluxo.");
      }
    } catch (e) {
      toast.error("Falha ao comunicar com o servidor.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteFlow = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm("Tem certeza de que deseja remover este fluxo?")) return;

    try {
      const res = await fetch(`/api/flows/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.info("Fluxo excluído.");
        setFlows(flows.filter((f) => f.id !== id));
      }
    } catch {
      toast.error("Erro ao excluir fluxo.");
    }
  };

  const filteredFlows = flows.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.description && f.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Boxes className="w-4 h-4" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight font-heading">
              VORIXA FLOW Studio
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Crie pipelines inteligentes encadeando prompts, imagens FLUX, vídeos Kling e upscale 4K.
          </p>
        </div>

        <button
          onClick={handleCreateNewFlow}
          disabled={isCreating}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 hover:opacity-90 text-white text-xs md:text-sm font-bold shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Criar Novo Flow</span>
        </button>
      </div>

      {/* Busca & Filtros */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar fluxos criados..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-all"
          />
        </div>
      </div>

      {/* Grid de Flows */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
          <span>Carregando seus fluxos...</span>
        </div>
      ) : filteredFlows.length === 0 ? (
        <div className="py-20 rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Sparkles className="w-7 h-7 stroke-[1.5]" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-sm font-bold text-slate-200">Nenhum fluxo encontrado</h3>
            <p className="text-xs text-slate-400">
              Comece criando seu primeiro pipeline criativo encadeando modelos de IA.
            </p>
          </div>
          <button
            onClick={handleCreateNewFlow}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Criar Primeiro Flow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFlows.map((flow) => (
            <Link
              key={flow.id}
              href={`/dashboard/flow/${flow.id}`}
              className="group relative rounded-3xl bg-slate-950/80 hover:bg-slate-900/60 border border-slate-800/80 hover:border-violet-500/50 p-5 space-y-4 transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono text-violet-300 uppercase font-semibold">
                    {flow.status}
                  </span>

                  <button
                    onClick={(e) => handleDeleteFlow(e, flow.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
                    title="Excluir Flow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-100 group-hover:text-violet-300 transition-colors line-clamp-1">
                  {flow.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {flow.description || "Sem descrição informada."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <div className="flex items-center gap-3">
                  <span>{flow._count?.nodes || 0} nós</span>
                  <span>•</span>
                  <span>{flow._count?.executions || 0} execuções</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
