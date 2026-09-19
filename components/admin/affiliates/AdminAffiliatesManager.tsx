"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Users,
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  ExternalLink,
  Edit2,
  DollarSign,
  TrendingUp,
  Percent,
  AlertCircle,
  ShieldCheck,
  Filter,
} from "lucide-react";

export function AdminAffiliatesManager() {
  const [subTab, setSubTab] = useState<"payouts" | "affiliates">("payouts");

  // Saques
  const [payouts, setPayouts] = useState<any[]>([]);
  const [payoutFilter, setPayoutFilter] = useState<string>("PENDING");
  const [loadingPayouts, setLoadingPayouts] = useState(false);

  // Afiliados & Desconto de Cupons
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loadingAffiliates, setLoadingAffiliates] = useState(false);
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(10);
  const [inputDiscount, setInputDiscount] = useState<string>("10");
  const [savingGlobalDiscount, setSavingGlobalDiscount] = useState(false);

  // Modal de Aprovação / Rejeição
  const [selectedPayout, setSelectedPayout] = useState<any | null>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [proofUrl, setProofUrl] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Modal de Edição de Taxa de Afiliado VIP
  const [selectedAffiliate, setSelectedAffiliate] = useState<any | null>(null);
  const [editRatePercent, setEditRatePercent] = useState<string>("");
  const [isSavingRate, setIsSavingRate] = useState(false);

  const fetchPayouts = async () => {
    try {
      setLoadingPayouts(true);
      const res = await fetch(`/api/admin/affiliates/payouts?status=${payoutFilter}&limit=50`);
      if (!res.ok) throw new Error("Erro ao carregar solicitações de saque.");
      const data = await res.json();
      setPayouts(data.payouts || []);
    } catch (err: any) {
      toast.error(err.message || "Erro ao consultar saques.");
    } finally {
      setLoadingPayouts(false);
    }
  };

  const fetchAffiliates = async () => {
    try {
      setLoadingAffiliates(true);
      const res = await fetch(`/api/admin/affiliates?search=${encodeURIComponent(search)}&limit=50`);
      if (!res.ok) throw new Error("Erro ao carregar lista de afiliados.");
      const data = await res.json();
      setAffiliates(data.affiliates || []);
      if (typeof data.defaultDiscountPercent === "number") {
        setGlobalDiscountPercent(data.defaultDiscountPercent);
        setInputDiscount(data.defaultDiscountPercent.toString());
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao consultar afiliados.");
    } finally {
      setLoadingAffiliates(false);
    }
  };

  const handleSaveGlobalDiscount = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseInt(inputDiscount, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 50) {
      toast.error("O percentual de desconto deve ser um número inteiro entre 1% e 50%.");
      return;
    }

    try {
      setSavingGlobalDiscount(true);
      const res = await fetch("/api/admin/affiliates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultDiscountPercent: parsed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar porcentagem de desconto.");

      setGlobalDiscountPercent(parsed);
      toast.success(data.message || `Desconto dos cupons de afiliados atualizado para ${parsed}%!`);
    } catch (err: any) {
      toast.error(err.message || "Falha ao atualizar desconto global de cupons.");
    } finally {
      setSavingGlobalDiscount(false);
    }
  };

  useEffect(() => {
    if (subTab === "payouts") {
      fetchPayouts();
    } else {
      fetchAffiliates();
    }
  }, [subTab, payoutFilter]);

  const handleProcessPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;

    try {
      setIsProcessingAction(true);
      const res = await fetch("/api/admin/affiliates/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payoutId: selectedPayout.id,
          action: actionType,
          proofUrl: proofUrl.trim() || undefined,
          adminNotes: adminNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao processar saque.");

      toast.success(data.message || "Ação executada com sucesso!");
      setSelectedPayout(null);
      setProofUrl("");
      setAdminNotes("");
      fetchPayouts();
    } catch (err: any) {
      toast.error(err.message || "Falha ao processar saque.");
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleSaveCommissionRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAffiliate) return;

    const rateNum = parseFloat(editRatePercent.replace(",", "."));
    if (isNaN(rateNum) || rateNum <= 0 || rateNum > 70) {
      toast.error("A porcentagem de comissão deve estar entre 1% e 70%.");
      return;
    }

    try {
      setIsSavingRate(true);
      const res = await fetch("/api/admin/affiliates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateId: selectedAffiliate.id,
          commissionRate: rateNum / 100,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao atualizar taxa.");

      toast.success(`Taxa de comissão de ${selectedAffiliate.code} atualizada para ${rateNum}%!`);
      setSelectedAffiliate(null);
      fetchAffiliates();
    } catch (err: any) {
      toast.error(err.message || "Falha ao salvar taxa.");
    } finally {
      setIsSavingRate(false);
    }
  };

  const handleToggleStatus = async (affiliate: any) => {
    const nextStatus = affiliate.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateId: affiliate.id,
          status: nextStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao atualizar status.");

      toast.success(`Afiliado ${affiliate.code} agora está ${nextStatus === "ACTIVE" ? "Ativo" : "Pausado"}.`);
      fetchAffiliates();
    } catch (err: any) {
      toast.error(err.message || "Falha ao atualizar status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header com Abas Internas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E202E] pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSubTab("payouts")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === "payouts"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "bg-[#13141B] text-slate-400 hover:text-white border border-[#1E202E]"
            }`}
          >
            Solicitações de Saque Pix
          </button>
          <button
            onClick={() => setSubTab("affiliates")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === "affiliates"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "bg-[#13141B] text-slate-400 hover:text-white border border-[#1E202E]"
            }`}
          >
            Lista de Afiliados Cadastrados
          </button>
        </div>

        <button
          onClick={() => (subTab === "payouts" ? fetchPayouts() : fetchAffiliates())}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#13141B] text-slate-400 hover:text-white border border-[#1E202E] text-xs font-semibold self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Recarregar</span>
        </button>
      </div>

      {/* SUB-ABA 1: SAQUES PIX */}
      {subTab === "payouts" && (
        <div className="space-y-4">
          {/* Filtros de Status de Saque */}
          <div className="flex gap-2">
            {[
              { label: "Pendentes (Aguardando Pix)", value: "PENDING" },
              { label: "Pagos (Concluídos)", value: "PAID" },
              { label: "Recusados", value: "REJECTED" },
              { label: "Todos", value: "ALL" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setPayoutFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  payoutFilter === f.value
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-[#13141B] text-slate-400 border border-[#1E202E] hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loadingPayouts ? (
            <div className="py-16 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Carregando solicitações de saque...</span>
            </div>
          ) : payouts.length === 0 ? (
            <div className="py-16 text-center bg-[#0D0E12] border border-[#1E202E] rounded-2xl space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Nenhum saque encontrado neste filtro</p>
              <p className="text-xs text-slate-500">Todas as solicitações de transferência Pix estão em dia.</p>
            </div>
          ) : (
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl overflow-hidden divide-y divide-[#1E202E] shadow-xl">
              {payouts.map((p) => (
                <div key={p.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-heading">
                        {p.affiliate?.user?.name || "Afiliado"} ({p.affiliate?.user?.email})
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {p.affiliate?.code}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                      <span>Chave Pix: <strong className="text-emerald-400 font-mono">{p.pixKey}</strong> ({p.pixKeyType})</span>
                      <span>•</span>
                      <span>Solicitado em: {new Date(p.requestedAt).toLocaleString("pt-BR")}</span>
                    </div>

                    {p.proofUrl && (
                      <div className="text-xs text-slate-400">
                        Comprovante: <span className="font-mono text-cyan-400">{p.proofUrl}</span>
                      </div>
                    )}
                    {p.adminNotes && (
                      <div className="text-xs text-slate-500 italic">
                        Observação: {p.adminNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-black text-white font-heading">
                        {((p.amountCents || 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        p.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : p.status === "REJECTED"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}>
                        {p.status === "PAID" ? "Liquidado ✅" : p.status === "REJECTED" ? "Recusado ❌" : "Pendente ⏳"}
                      </span>
                    </div>

                    {p.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPayout(p);
                            setActionType("APPROVE");
                          }}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                        >
                          Aprovar Pix
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPayout(p);
                            setActionType("REJECT");
                          }}
                          className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-600/30 text-xs font-bold transition-all cursor-pointer"
                        >
                          Recusar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-ABA 2: LISTA DE AFILIADOS */}
      {subTab === "affiliates" && (
        <div className="space-y-4">
          {/* Card de Configuração: Desconto do Cupom de Vendedor / Afiliado */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D0E12] border border-[#1E202E] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Desconto do Cupom de Vendedor / Afiliado
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Global Ativo: {globalDiscountPercent}% OFF
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Define a porcentagem de desconto que qualquer código de afiliado/vendedor concede aos clientes na compra dos planos na Home e Checkout.
              </p>
            </div>

            <form onSubmit={handleSaveGlobalDiscount} className="flex items-center gap-2 self-start md:self-auto">
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={inputDiscount}
                  onChange={(e) => setInputDiscount(e.target.value)}
                  className="w-24 bg-[#13141B] border border-[#1E202E] rounded-xl px-3 py-2 text-xs text-white text-center font-bold outline-none focus:border-purple-500"
                  placeholder="10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none">
                  %
                </span>
              </div>
              <button
                type="submit"
                disabled={savingGlobalDiscount}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {savingGlobalDiscount ? "Salvando..." : "Salvar %"}
              </button>
            </form>
          </div>

          {/* Barra de Busca */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar afiliado por código, nome ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchAffiliates()}
                className="w-full bg-[#0D0E12] border border-[#1E202E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 outline-none"
              />
            </div>
            <button
              onClick={fetchAffiliates}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 cursor-pointer"
            >
              Buscar
            </button>
          </div>

          {loadingAffiliates ? (
            <div className="py-16 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Carregando afiliados...</span>
            </div>
          ) : affiliates.length === 0 ? (
            <div className="py-16 text-center bg-[#0D0E12] border border-[#1E202E] rounded-2xl space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-300">Nenhum afiliado encontrado</p>
            </div>
          ) : (
            <div className="bg-[#0D0E12] border border-[#1E202E] rounded-2xl overflow-hidden divide-y divide-[#1E202E] shadow-xl">
              {affiliates.map((aff) => (
                <div key={aff.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-heading">
                        {aff.user?.name || "Afiliado"}
                      </span>
                      <span className="text-xs text-slate-500">({aff.user?.email})</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {aff.customCode ? `${aff.customCode} (${aff.code})` : aff.code}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                      <span>Indicados: <strong className="text-white">{aff._count?.referrals || 0}</strong></span>
                      <span>•</span>
                      <span>Compras geradas: <strong className="text-white">{aff._count?.commissions || 0}</strong></span>
                      <span>•</span>
                      <span>Chave Pix: <strong className="text-slate-300 font-mono">{aff.pixKey || "Não cadastrada"}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 justify-between md:justify-end">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Saldo Disponível:</div>
                      <div className="text-sm font-black text-emerald-400 font-heading">
                        {((aff.balanceCents || 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Total Ganho: {((aff.totalEarningsCents || 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                    </div>

                    {/* Taxa de Comissão */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAffiliate(aff);
                          setEditRatePercent((aff.commissionRate * 100).toString());
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-slate-300 border border-[#1E202E] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        title="Alterar porcentagem VIP"
                      >
                        <Percent className="w-3.5 h-3.5 text-amber-400" />
                        <span>{Math.round(aff.commissionRate * 100)}%</span>
                        <Edit2 className="w-3 h-3 text-slate-500 ml-1" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(aff)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          aff.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        {aff.status === "ACTIVE" ? "Ativo" : "Pausado"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de Confirmação de Saque Pix */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                {actionType === "APPROVE" ? "Confirmar Transferência Pix" : "Recusar Solicitação de Saque"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Afiliado: <strong className="text-white">{selectedPayout.affiliate?.user?.name}</strong> • Valor:{" "}
                <strong className="text-emerald-400">
                  {((selectedPayout.amountCents || 0) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </strong>
              </p>
            </div>

            <div className="bg-[#070709] border border-[#1E202E] rounded-xl p-3.5 space-y-1 text-xs text-slate-300">
              <div>Chave Pix: <strong className="text-white font-mono">{selectedPayout.pixKey}</strong></div>
              <div>Tipo: <strong className="text-white">{selectedPayout.pixKeyType}</strong></div>
            </div>

            <form onSubmit={handleProcessPayout} className="space-y-4">
              {actionType === "APPROVE" ? (
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    ID / Comprovante da Transação Pix (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: E1234567820260913... ou URL do comprovante"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 outline-none font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Motivo da Rejeição (Visível ao afiliado)
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Ex: Chave Pix inválida ou divergente. Por favor, atualize seus dados."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full bg-[#070709] border border-[#1E202E] rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:border-rose-500 outline-none resize-none"
                  />
                  <span className="text-[10px] text-amber-400 mt-1 block">
                    ⚠️ Ao recusar, o saldo de R$ {((selectedPayout.amountCents || 0) / 100).toFixed(2)} será estornado automaticamente para a conta do afiliado.
                  </span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayout(null)}
                  className="flex-1 py-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-slate-300 text-xs font-bold border border-[#1E202E] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessingAction}
                  className={`flex-1 py-3 rounded-xl text-white text-xs font-bold shadow-lg transition-all cursor-pointer ${
                    actionType === "APPROVE"
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                      : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/20"
                  }`}
                >
                  {isProcessingAction
                    ? "Processando..."
                    : actionType === "APPROVE"
                    ? "Confirmar Pagamento"
                    : "Confirmar Rejeição"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Alteração de Taxa de Comissão VIP */}
      {selectedAffiliate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0D0E12] border border-[#1E202E] rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-white font-heading">Ajustar Comissão do Afiliado</h3>
              <p className="text-xs text-slate-400 mt-1">
                Afiliado: <strong className="text-white">{selectedAffiliate.user?.name}</strong> ({selectedAffiliate.code})
              </p>
            </div>

            <form onSubmit={handleSaveCommissionRate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Porcentagem de Comissão (%)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 20"
                  value={editRatePercent}
                  onChange={(e) => setEditRatePercent(e.target.value)}
                  className="w-full bg-[#070709] border border-[#1E202E] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:border-amber-500 outline-none font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Defina um valor entre 1% e 70%. O padrão do sistema é 15%.
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAffiliate(null)}
                  className="flex-1 py-3 rounded-xl bg-[#13141B] hover:bg-[#1E202E] text-slate-300 text-xs font-bold border border-[#1E202E] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingRate || !editRatePercent}
                  className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/20 cursor-pointer"
                >
                  {isSavingRate ? "Salvando..." : "Salvar Taxa"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
