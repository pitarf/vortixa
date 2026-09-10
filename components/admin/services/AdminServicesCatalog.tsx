"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  DollarSign, 
  RefreshCw, 
  Check, 
  SlidersHorizontal, 
  Zap, 
  ShieldAlert, 
  Layers, 
  Layers2, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Video, 
  Image as ImageIcon, 
  Flame, 
  Activity, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  ArrowUpDown
} from "lucide-react";
import { toast } from "sonner";
import { AdminServiceBatchBar } from "./AdminServiceBatchBar";

export interface ServiceTool {
  id: string;
  name: string;
  slug: string;
  status: boolean;
  description: string | null;
}

export interface ServiceItem {
  id: string;
  name: string;
  technicalName: string;
  providerId: string;
  providerName: string;
  category: "Imagem" | "Vídeo" | "LipSync" | "Motion" | "Upscale" | "Hot +18" | string;
  creditCost: number;
  apiUnitCostUsd: number;
  estimatedCostBrl: number;
  status: boolean;
  version?: string | null;
  billingUnit?: string | null;
  tools: ServiceTool[];
  variations: {
    durations: string[];
    qualities: string[];
    aspectRatios: string[];
    unit: string;
  };
}

const CATEGORIES = [
  "Todos",
  "Imagem",
  "Vídeo",
  "LipSync",
  "Motion",
  "Upscale",
  "Hot +18",
];

export function AdminServicesCatalog() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [dollarRate, setDollarRate] = useState<number>(5.60);
  const [lastRateUpdate, setLastRateUpdate] = useState<string>("");
  const [rateSource, setRateSource] = useState<string>("api");

  const [loading, setLoading] = useState(true);
  const [refreshingRate, setRefreshingRate] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Filtros e Busca
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Seleção Múltipla para Ações em Lote
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Estado temporário dos créditos sendo editados (inline inputs)
  const [creditDrafts, setCreditDrafts] = useState<Record<string, number>>({});
  const [apiCostDrafts, setApiCostDrafts] = useState<Record<string, number>>({});

  // Carregar Cotação do Dólar
  const fetchDollarRate = async (forceRefresh = false) => {
    try {
      setRefreshingRate(true);
      const res = await fetch(`/api/admin/currency/dollar-rate${forceRefresh ? "?refresh=true" : ""}`);
      if (res.ok) {
        const data = await res.json();
        setDollarRate(data.rate);
        setLastRateUpdate(data.lastUpdated);
        setRateSource(data.source);
        if (forceRefresh) {
          toast.success(`Cotação atualizada: R$ ${data.rate.toFixed(2).replace(".", ",")}`);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar cotação do dólar:", e);
    } finally {
      setRefreshingRate(false);
    }
  };

  // Carregar Serviços
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
        if (data.dollarRate) {
          setDollarRate(data.dollarRate);
        }
        // Inicializar rascunhos de créditos e custos
        const initialCredits: Record<string, number> = {};
        const initialApiCosts: Record<string, number> = {};
        (data.services || []).forEach((s: ServiceItem) => {
          initialCredits[s.id] = s.creditCost;
          initialApiCosts[s.id] = s.apiUnitCostUsd;
        });
        setCreditDrafts(initialCredits);
        setApiCostDrafts(initialApiCosts);
      } else {
        toast.error("Erro ao carregar catálogo de serviços de IA.");
      }
    } catch (e) {
      toast.error("Erro de conexão ao buscar serviços.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchDollarRate(false);
  }, []);

  // Recalcular custos quando o dólar mudar
  const displayServices = useMemo(() => {
    return services.map((s) => {
      const currentApiCost = apiCostDrafts[s.id] !== undefined ? apiCostDrafts[s.id] : s.apiUnitCostUsd;
      const estimatedCostBrl = Number((currentApiCost * dollarRate).toFixed(4));
      return {
        ...s,
        estimatedCostBrl,
      };
    });
  }, [services, dollarRate, apiCostDrafts]);

  // Filtragem dos Serviços
  const filteredServices = useMemo(() => {
    return displayServices.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.technicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tools.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.slug.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "Todos" || service.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesStatus =
        statusFilter === "all" ? true : statusFilter === "active" ? service.status : !service.status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [displayServices, searchQuery, selectedCategory, statusFilter]);

  // Manipular toggle de status individual (Ativar / Desativar)
  const handleToggleStatus = async (service: ServiceItem) => {
    const newStatus = !service.status;
    try {
      setSavingId(service.id);
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, status: newStatus } : s))
        );
        toast.success(newStatus ? `Serviço "${service.name}" ativado!` : `Serviço "${service.name}" desativado.`);
      } else {
        toast.error(json.error || "Falha ao alternar status do serviço.");
      }
    } catch {
      toast.error("Erro de conexão ao alterar status.");
    } finally {
      setSavingId(null);
    }
  };

  // Salvar alterações de crédito e custo de API individuais
  const handleSavePricing = async (serviceId: string) => {
    const draftCredit = creditDrafts[serviceId];
    const draftApiCost = apiCostDrafts[serviceId];

    try {
      setSavingId(serviceId);
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creditCost: draftCredit,
          apiUnitCost: draftApiCost,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) =>
            s.id === serviceId
              ? {
                  ...s,
                  creditCost: Number(draftCredit),
                  apiUnitCostUsd: Number(draftApiCost),
                  estimatedCostBrl: Number((draftApiCost * dollarRate).toFixed(4)),
                }
              : s
          )
        );
        toast.success("Precificação atualizada com sucesso!");
      } else {
        toast.error(json.error || "Erro ao salvar precificação.");
      }
    } catch {
      toast.error("Erro ao salvar precificação.");
    } finally {
      setSavingId(null);
    }
  };

  // Selecionar / Desmarcar todos os filtrados
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredServices.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Toggle seleção individual
  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card: Cotação USD e Métricas Gerais */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-violet-950/30 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Layers2 className="h-4 w-4" />
            Catálogo de Serviços de Inteligência Artificial
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Gerenciamento de Modelos & Precificação
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure custos por chamada, créditos debitados de clientes e monitore a margem com a cotação oficial.
          </p>
        </div>

        {/* Badge Dinâmico do Dólar do Dia */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-violet-500/30 rounded-2xl p-3 sm:px-4 sm:py-3 shadow-inner">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Cotação USD/BRL
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-emerald-400 font-mono">
                R$ {dollarRate.toFixed(2).replace(".", ",")}
              </span>
              <span className="text-[10px] text-slate-500">
                {rateSource === "api" ? "(Tempo Real)" : "(Cache)"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchDollarRate(true)}
            disabled={refreshingRate}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800 ml-1"
            title="Atualizar cotação agora"
          >
            <RefreshCw className={`h-4 w-4 ${refreshingRate ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Barra de Filtros, Categorias e Pesquisa */}
      <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 space-y-4">
        {/* Categorias Pills com Rolagem Horizontal Suave */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                    : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
                style={{ minHeight: "38px" }}
              >
                {cat === "Imagem" && <ImageIcon className="h-3.5 w-3.5" />}
                {cat === "Vídeo" && <Video className="h-3.5 w-3.5" />}
                {cat === "Hot +18" && <Flame className="h-3.5 w-3.5 text-rose-400" />}
                {cat === "Motion" && <Activity className="h-3.5 w-3.5" />}
                {cat === "LipSync" && <Sparkles className="h-3.5 w-3.5" />}
                {cat === "Upscale" && <TrendingUp className="h-3.5 w-3.5" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Linha de Busca e Filtro de Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Input de Busca */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome do modelo, motor fal.ai ou ferramenta..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              style={{ minHeight: "44px" }}
            />
          </div>

          {/* Filtro de Ativos / Inativos */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === "all" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Todos ({displayServices.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === "active" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400 hover:text-white"
              }`}
            >
              Ativos ({displayServices.filter((s) => s.status).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("inactive")}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === "inactive" ? "bg-rose-500/20 text-rose-300" : "text-slate-400 hover:text-white"
              }`}
            >
              Inativos ({displayServices.filter((s) => !s.status).length})
            </button>
          </div>
        </div>
      </div>

      {/* Visualização Mobile em Cards Empilháveis (Oculto em telas sm e maiores) */}
      <div className="space-y-3 sm:hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 bg-slate-950/60 border border-slate-900 rounded-2xl">
            <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
            <p className="text-slate-400 text-xs">Carregando catálogo de serviços...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs bg-slate-950/60 border border-slate-900 rounded-2xl">
            Nenhum serviço encontrado para os filtros selecionados.
          </div>
        ) : (
          filteredServices.map((service) => {
            const isSelected = selectedIds.includes(service.id);
            const isSaving = savingId === service.id;
            const draftCredit = creditDrafts[service.id] ?? service.creditCost;
            const draftApiCost = apiCostDrafts[service.id] ?? service.apiUnitCostUsd;
            const isDirty = draftCredit !== service.creditCost || draftApiCost !== service.apiUnitCostUsd;

            return (
              <div
                key={service.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isSelected
                    ? "bg-violet-950/30 border-violet-500/50 shadow-lg shadow-violet-950/30"
                    : "bg-slate-950/80 border-slate-900"
                }`}
              >
                {/* Header do Card Mobile de Serviço */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(service.id)}
                        aria-label={`Selecionar serviço ${service.name}`}
                        className="rounded border-slate-700 text-violet-600 focus:ring-violet-500 h-5 w-5 bg-slate-900 cursor-pointer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">
                        {service.name}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 truncate">
                        {service.technicalName}
                      </div>
                      {service.tools.length > 0 && (
                        <div className="text-[10px] text-violet-400 mt-0.5 truncate">
                          {service.tools.map((t) => t.name).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-slate-800 text-slate-300 border border-slate-700/50">
                      {service.category}
                    </span>
                    {/* Toggle Switch com min-h 44px de área de clique */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(service)}
                      disabled={isSaving}
                      className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                      title={service.status ? "Desativar serviço" : "Ativar serviço"}
                    >
                      <span className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        service.status ? "bg-emerald-500" : "bg-slate-800"
                      } disabled:opacity-50`}>
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            service.status ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Grid de Custos e Precificação Mobile */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 space-y-1">
                    <span className="text-[10px] text-slate-500 font-medium block">Custo da API</span>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-mono text-xs">$</span>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        value={draftApiCost}
                        onChange={(e) =>
                          setApiCostDrafts({
                            ...apiCostDrafts,
                            [service.id]: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500 transition-colors min-h-[36px]"
                      />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono block">
                      ~ R$ {(draftApiCost * dollarRate).toFixed(4).replace(".", ",")}
                    </span>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 space-y-1">
                    <span className="text-[10px] text-slate-500 font-medium block">Cobrança Cliente</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={draftCredit}
                        onChange={(e) =>
                          setCreditDrafts({
                            ...creditDrafts,
                            [service.id]: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white font-bold text-center focus:outline-none focus:border-violet-500 transition-colors min-h-[36px]"
                      />
                      <span className="text-slate-400 text-[11px] font-semibold">cr</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {service.variations.durations.slice(0, 2).join(", ")}
                    </span>
                  </div>
                </div>

                {/* Botão de Salvar Alterações se houver diferença no Mobile */}
                {isDirty && (
                  <button
                    type="button"
                    onClick={() => handleSavePricing(service.id)}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-violet-600/20 disabled:opacity-50 min-h-[44px] cursor-pointer"
                  >
                    {isSaving ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span>Salvar Alterações de Preço</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Lista de Modelos / Tabela Responsiva (Desktop & Tablet: sm em diante) */}
      <div className="hidden sm:block bg-slate-950/60 border border-slate-900 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 text-violet-500 animate-spin" />
            <p className="text-slate-400 text-xs">Carregando catálogo de serviços...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            Nenhum serviço encontrado para os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto overscroll-x-contain">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredServices.length > 0 &&
                        selectedIds.length === filteredServices.length
                      }
                      onChange={handleSelectAll}
                      aria-label="Selecionar todos os serviços"
                      className="rounded border-slate-700 text-violet-600 focus:ring-violet-500 h-4 w-4 bg-slate-900 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Provedor & Motor</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Variações</th>
                  <th className="py-3 px-4">Custo API</th>
                  <th className="py-3 px-4">Custo Estimado</th>
                  <th className="py-3 px-4">Créditos</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/80 text-xs">
                {filteredServices.map((service) => {
                  const isSelected = selectedIds.includes(service.id);
                  const isSaving = savingId === service.id;
                  const draftCredit = creditDrafts[service.id] ?? service.creditCost;
                  const draftApiCost = apiCostDrafts[service.id] ?? service.apiUnitCostUsd;
                  const isDirty = draftCredit !== service.creditCost || draftApiCost !== service.apiUnitCostUsd;

                  return (
                    <tr
                      key={service.id}
                      className={`hover:bg-slate-900/40 transition-colors ${
                        isSelected ? "bg-violet-950/20" : ""
                      }`}
                    >
                      {/* Checkbox de Seleção */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(service.id)}
                          className="rounded border-slate-700 text-violet-600 focus:ring-violet-500 h-4 w-4 bg-slate-900 cursor-pointer"
                        />
                      </td>

                      {/* Nome do Motor & Provedor */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm">
                            {service.name}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400 truncate max-w-xs">
                            {service.technicalName}
                          </span>
                          {service.tools.length > 0 && (
                            <span className="text-[10px] text-violet-400 mt-0.5">
                              {service.tools.map((t) => t.name).join(", ")}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Categoria */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-slate-800 text-slate-300 border border-slate-700/50">
                          {service.category}
                        </span>
                      </td>

                      {/* Variações */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-0.5 text-[11px] text-slate-400">
                          <div>
                            <span className="text-slate-500 font-medium">Duração:</span>{" "}
                            {service.variations.durations.join(", ")}
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Qualidade:</span>{" "}
                            {service.variations.qualities.join(", ")}
                          </div>
                        </div>
                      </td>

                      {/* Custo API (USD) com Edição Rápida */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-500 font-mono">$</span>
                          <input
                            type="number"
                            step="0.001"
                            min="0"
                            value={draftApiCost}
                            onChange={(e) =>
                              setApiCostDrafts({
                                ...apiCostDrafts,
                                [service.id]: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                          />
                        </div>
                      </td>

                      {/* Custo Estimado em R$ (Calculado com Dólar do Dia) */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col font-mono">
                          <span className="font-bold text-emerald-400">
                            R$ {(draftApiCost * dollarRate).toFixed(4).replace(".", ",")}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            / {service.variations.unit.toLowerCase()}
                          </span>
                        </div>
                      </td>

                      {/* Custo em Créditos (Input Inline com Salvar Rápido) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={draftCredit}
                            onChange={(e) =>
                              setCreditDrafts({
                                ...creditDrafts,
                                [service.id]: parseInt(e.target.value, 10) || 0,
                              })
                            }
                            className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-bold text-center focus:outline-none focus:border-violet-500 transition-colors"
                          />
                          <span className="text-slate-400 text-[11px] font-semibold">cr</span>
                        </div>
                      </td>

                      {/* Switch / Toggle de Status On/Off */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(service)}
                          disabled={isSaving}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            service.status ? "bg-emerald-500" : "bg-slate-800"
                          } disabled:opacity-50`}
                          title={service.status ? "Desativar serviço" : "Ativar serviço"}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              service.status ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Botão de Salvar Alterações se houver diferença */}
                      <td className="py-3 px-4 text-right">
                        {isDirty ? (
                          <button
                            type="button"
                            onClick={() => handleSavePricing(service.id)}
                            disabled={isSaving}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold transition-all shadow-md shadow-violet-600/20 disabled:opacity-50"
                          >
                            {isSaving ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                            <span>Salvar</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">
                            Sincronizado
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Barra de Ações em Massa (Batch Bar Flutuante) */}
      <AdminServiceBatchBar
        selectedCount={selectedIds.length}
        totalCount={filteredServices.length}
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        onSuccess={() => {
          fetchServices();
        }}
      />
    </div>
  );
}
