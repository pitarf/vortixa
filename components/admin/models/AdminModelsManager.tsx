"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Plus, 
  Sparkles, 
  User, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Flame, 
  Calendar, 
  RefreshCw, 
  Layers,
  Coins,
  DollarSign,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { AdminModelFormModal, MarketplaceModelData } from "./AdminModelFormModal";
import { AdminBookingsModal } from "./AdminBookingsModal";

interface AdminModelsMetrics {
  totalModels: number;
  activeCount: number;
  inactiveCount: number;
  aiCount: number;
  realCount: number;
  totalBookings: number;
}

export function AdminModelsManager() {
  const [models, setModels] = useState<MarketplaceModelData[]>([]);
  const [metrics, setMetrics] = useState<AdminModelsMetrics>({
    totalModels: 0,
    activeCount: 0,
    inactiveCount: 0,
    aiCount: 0,
    realCount: 0,
    totalBookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Filtros e busca
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modelToEdit, setModelToEdit] = useState<MarketplaceModelData | null>(null);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [selectedBookingModelId, setSelectedBookingModelId] = useState<string | null>(null);

  // Confirmação de exclusão
  const [modelToDelete, setModelToDelete] = useState<MarketplaceModelData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchModels = useCallback(async (pageToFetch = page) => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (selectedType !== "ALL") params.append("type", selectedType);
      if (selectedCategory !== "ALL") params.append("category", selectedCategory);
      if (selectedStatus !== "ALL") params.append("status", selectedStatus);
      params.append("page", pageToFetch.toString());
      params.append("limit", "20");

      const res = await fetch(`/api/admin/models?${params.toString()}`);
      if (!res.ok) {
        toast.error("Erro ao carregar modelos da vitrine.");
        return;
      }

      const data = await res.json();
      setModels(data.models || []);
      if (data.metrics) {
        setMetrics(data.metrics);
      }
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro de conexão ao buscar modelos.");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [search, selectedType, selectedCategory, selectedStatus, page]);

  useEffect(() => {
    fetchModels(page);
  }, [fetchModels, page]);

  // Alteração rápida de status (Ativo / Inativo)
  const handleToggleStatus = async (model: MarketplaceModelData) => {
    if (!model.id) return;
    try {
      setUpdatingStatusId(model.id);
      const newStatus = !model.status;

      const res = await fetch(`/api/admin/models/${model.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao atualizar status do modelo.");
        return;
      }

      toast.success(
        newStatus
          ? `Modelo "${model.name}" ativado com sucesso!`
          : `Modelo "${model.name}" pausado com sucesso!`
      );

      setModels((prev) =>
        prev.map((m) => (m.id === model.id ? { ...m, status: newStatus } : m))
      );
      setMetrics((prev) => ({
        ...prev,
        activeCount: newStatus ? prev.activeCount + 1 : prev.activeCount - 1,
        inactiveCount: newStatus ? prev.inactiveCount - 1 : prev.inactiveCount + 1,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Falha ao comunicar com o servidor.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Excluir Modelo
  const handleConfirmDelete = async () => {
    if (!modelToDelete?.id) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/models/${modelToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao excluir modelo.");
        return;
      }

      toast.success(data.message || "Modelo excluído com sucesso!");
      setModelToDelete(null);
      fetchModels(page);
    } catch (err) {
      console.error(err);
      toast.error("Falha ao excluir modelo.");
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenEdit = (model: MarketplaceModelData) => {
    setModelToEdit(model);
    setIsFormModalOpen(true);
  };

  const handleOpenCreate = () => {
    setModelToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenBookings = (modelId?: string) => {
    setSelectedBookingModelId(modelId || null);
    setIsBookingsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Cards de Métricas Consolidadas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <span className="text-xs text-neutral-400 font-medium">Total de Modelos</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-white">{metrics.totalModels}</span>
            <Layers className="w-4 h-4 text-neutral-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <span className="text-xs text-emerald-400 font-medium">Modelos Ativos</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-emerald-400">{metrics.activeCount}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <span className="text-xs text-neutral-400 font-medium">Pausados / Inativos</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-neutral-400">{metrics.inactiveCount}</span>
            <XCircle className="w-4 h-4 text-neutral-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <span className="text-xs text-violet-400 font-medium">Modelos de IA</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-violet-400">{metrics.aiCount}</span>
            <Sparkles className="w-4 h-4 text-violet-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <span className="text-xs text-sky-400 font-medium">Modelos Reais</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-sky-400">{metrics.realCount}</span>
            <User className="w-4 h-4 text-sky-500" />
          </div>
        </div>

        <div 
          onClick={() => handleOpenBookings()}
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 cursor-pointer transition flex flex-col justify-between group"
        >
          <span className="text-xs text-amber-400 font-medium">Total de Reservas</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-amber-400 group-hover:scale-105 transition-transform">
              {metrics.totalBookings}
            </span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Barra Superior: Busca, Filtros e Ações */}
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Busca Instantânea */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar por nome, slug, tags ou biografia..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500 transition min-h-[44px]"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleOpenBookings()}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 font-semibold text-sm transition min-h-[44px] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              Ver Propostas ({metrics.totalBookings})
            </button>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-violet-600/25 min-h-[44px] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Modelo
            </button>

            <button
              onClick={() => fetchModels(page)}
              disabled={refreshing}
              className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center border border-neutral-700"
              title="Recarregar"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-violet-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Filtros em linha */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800/60">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros:</span>
          </div>

          {/* Filtro por Tipo */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500 transition min-h-[38px]"
          >
            <option value="ALL">Todos os Tipos</option>
            <option value="AI">Somente IA</option>
            <option value="REAL">Somente Reais</option>
          </select>

          {/* Filtro por Categoria */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500 transition min-h-[38px]"
          >
            <option value="ALL">Todas as Categorias</option>
            <option value="FASHION">Moda & Fashion</option>
            <option value="COMMERCIAL">Comercial</option>
            <option value="FITNESS">Fitness</option>
            <option value="LIFESTYLE">Lifestyle</option>
            <option value="CORPORATE">Corporativo</option>
            <option value="AVATAR">Avatar Virtual</option>
            <option value="HOT_18">Hot (+18)</option>
            <option value="GAMES">Games & Cosplay</option>
          </select>

          {/* Filtro por Status */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500 transition min-h-[38px]"
          >
            <option value="ALL">Status: Todos</option>
            <option value="active">Somente Ativos</option>
            <option value="inactive">Somente Pausados</option>
          </select>

          {(selectedType !== "ALL" || selectedCategory !== "ALL" || selectedStatus !== "ALL" || search) && (
            <button
              onClick={() => {
                setSelectedType("ALL");
                setSelectedCategory("ALL");
                setSelectedStatus("ALL");
                setSearch("");
                setPage(1);
              }}
              className="text-xs text-neutral-400 hover:text-white underline ml-auto py-1"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Visualização Mobile em Cards Empilháveis (Oculto em telas sm e maiores) */}
      <div className="space-y-3 sm:hidden">
        {loading && models.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-violet-500 opacity-60" />
            <p className="text-sm">Carregando catálogo de modelos...</p>
          </div>
        ) : models.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <Layers className="w-10 h-10 mx-auto mb-3 text-neutral-600" />
            <p className="text-base font-semibold text-neutral-300">Nenhum modelo encontrado</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Nenhum modelo corresponde aos critérios de busca ou filtros selecionados.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition min-h-[44px]"
            >
              Cadastrar Primeiro Modelo
            </button>
          </div>
        ) : (
          models.map((model) => {
            const isUpdating = updatingStatusId === model.id;

            return (
              <div
                key={model.id}
                className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700/80 flex-shrink-0">
                      <img
                        src={model.avatarUrl || "/placeholder-avatar.png"}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                      {model.isHot18 && (
                        <div className="absolute top-0 right-0 p-0.5 bg-rose-600 text-white rounded-bl-lg">
                          <Flame className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-white text-sm truncate">
                          {model.name}
                        </span>
                        {model.isFeatured && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Destaque
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-500 font-mono block truncate">
                        /{model.slug}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                      model.type === "AI"
                        ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {model.type === "AI" ? (
                      <>
                        <Sparkles className="w-3 h-3" /> IA
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3" /> Real
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/80">
                  <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/60">
                    <span className="text-[10px] text-neutral-400 font-medium block">Categoria</span>
                    <span className="text-xs text-white font-medium">{model.category}</span>
                  </div>

                  <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/60">
                    <span className="text-[10px] text-neutral-400 font-medium block">Preço</span>
                    {model.type === "AI" ? (
                      <span className="text-xs text-violet-300 font-bold">{model.creditsPricePerGen || 5} cr/gen</span>
                    ) : (
                      <span className="text-xs text-emerald-400 font-bold">
                        {model.bookingPriceCents ? `R$ ${(model.bookingPriceCents / 100).toFixed(2)}` : "A combinar"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 gap-2">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleToggleStatus(model)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition min-h-[44px] cursor-pointer ${
                      model.status
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                        : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${model.status ? "bg-emerald-400" : "bg-neutral-500"}`} />
                    <span>{model.status ? "Ativo" : "Pausado"}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {model.type === "REAL" && (
                      <button
                        onClick={() => handleOpenBookings(model.id)}
                        className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                        title="Ver Reservas"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenEdit(model)}
                      className="p-2.5 rounded-xl text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                      title="Editar Modelo"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setModelToDelete(model)}
                      className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/20 bg-rose-500/10 border border-rose-500/20 transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                      title="Excluir Modelo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Tabela Administrativa (Desktop & Tablet: sm em diante) */}
      <div className="hidden sm:block bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        {loading && models.length === 0 ? (
          <div className="py-20 text-center text-neutral-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-violet-500 opacity-60" />
            <p className="text-sm">Carregando catálogo de modelos...</p>
          </div>
        ) : models.length === 0 ? (
          <div className="py-20 text-center text-neutral-400">
            <Layers className="w-10 h-10 mx-auto mb-3 text-neutral-600" />
            <p className="text-base font-semibold text-neutral-300">Nenhum modelo encontrado</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Nenhum modelo corresponde aos critérios de busca ou filtros selecionados.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition min-h-[40px]"
            >
              Cadastrar Primeiro Modelo
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto overscroll-x-contain">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Modelo</th>
                  <th className="py-3.5 px-3">Tipo & Categoria</th>
                  <th className="py-3.5 px-3">Precificação</th>
                  <th className="py-3.5 px-3">Reservas</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-sm text-neutral-300">
                {models.map((model) => {
                  const isUpdating = updatingStatusId === model.id;

                  return (
                    <tr
                      key={model.id}
                      className="hover:bg-neutral-800/40 transition group"
                    >
                      {/* Avatar & Nome */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700/80 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={model.avatarUrl || "/placeholder-avatar.png"}
                              alt={model.name}
                              className="w-full h-full object-cover"
                            />
                            {model.isHot18 && (
                              <div className="absolute top-0 right-0 p-0.5 bg-rose-600 text-white rounded-bl-lg" title="Conteúdo Hot 18+">
                                <Flame className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white group-hover:text-violet-400 transition">
                                {model.name}
                              </span>
                              {model.isFeatured && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Destaque
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-neutral-500 font-mono block">
                              /{model.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tipo & Categoria */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              model.type === "AI"
                                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            {model.type === "AI" ? (
                              <>
                                <Sparkles className="w-3 h-3" /> IA
                              </>
                            ) : (
                              <>
                                <User className="w-3 h-3" /> Real
                              </>
                            )}
                          </span>
                          <span className="block text-xs text-neutral-400">
                            {model.category}
                          </span>
                        </div>
                      </td>

                      {/* Precificação */}
                      <td className="py-3.5 px-3">
                        {model.type === "AI" ? (
                          <div className="flex items-center gap-1.5 text-xs text-violet-300 font-medium">
                            <Coins className="w-3.5 h-3.5 text-violet-400" />
                            <span>{model.creditsPricePerGen || 5} créditos/gen</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            <span>
                              {model.bookingPriceCents
                                ? `R$ ${(model.bookingPriceCents / 100).toFixed(2)}/diária`
                                : "Cachê a combinar"}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Reservas */}
                      <td className="py-3.5 px-3">
                        {model.type === "REAL" ? (
                          <button
                            onClick={() => handleOpenBookings(model.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>{model.totalBookings || 0} propostas</span>
                          </button>
                        ) : (
                          <span className="text-xs text-neutral-500">—</span>
                        )}
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="py-3.5 px-3">
                        <button
                          disabled={isUpdating}
                          onClick={() => handleToggleStatus(model)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition min-h-[34px] ${
                            model.status
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              model.status ? "bg-emerald-400" : "bg-neutral-500"
                            }`}
                          />
                          {model.status ? "Ativo" : "Pausado"}
                        </button>
                      </td>

                      {/* Ações (Editar, Excluir) */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(model)}
                            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                            title="Editar Modelo"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setModelToDelete(model)}
                            className="p-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                            title="Excluir Modelo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-neutral-800 bg-neutral-950/40 flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              Página {page} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-40 transition min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white disabled:opacity-40 transition min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Formulário (Criação / Edição) */}
      <AdminModelFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={() => fetchModels(page)}
        modelToEdit={modelToEdit}
      />

      {/* Modal de Bookings / Casting */}
      <AdminBookingsModal
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        initialModelId={selectedBookingModelId}
      />

      {/* Modal de Confirmação de Exclusão */}
      {modelToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2 rounded-xl bg-rose-500/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Excluir Modelo</h3>
            </div>
            <p className="text-sm text-neutral-300">
              Tem certeza que deseja excluir o modelo{" "}
              <strong className="text-white">&ldquo;{modelToDelete.name}&rdquo;</strong>? Esta
              ação removerá o registro da vitrine e cancelará as reservas vinculadas.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={deleting}
                onClick={() => setModelToDelete(null)}
                className="px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-sm font-medium transition min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition min-h-[44px] flex items-center gap-2"
              >
                {deleting ? "Excluindo..." : "Confirmar Exclusão"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
