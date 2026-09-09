"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  X, 
  Calendar, 
  Mail, 
  AtSign, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCw, 
  Search, 
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

export interface BookingData {
  id: string;
  userId: string;
  modelId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  notes?: string | null;
  amountCents?: number | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image?: string | null;
  };
  model: {
    id: string;
    name: string;
    slug: string;
    type: "AI" | "REAL";
    category: string;
    avatarUrl: string;
    bookingPriceCents?: number | null;
    contactEmail?: string | null;
    instagramHandle?: string | null;
    location?: string | null;
  };
}

interface AdminBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModelId?: string | null;
}

export function AdminBookingsModal({
  isOpen,
  onClose,
  initialModelId,
}: AdminBookingsModalProps) {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (initialModelId) params.append("modelId", initialModelId);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/admin/models/bookings?${params.toString()}`);
      if (!res.ok) {
        toast.error("Erro ao carregar solicitações de reservas.");
        return;
      }
      const data = await res.json();
      setBookings(data.bookings || []);
      if (data.counts) {
        setCounts(data.counts);
      }
    } catch (err) {
      console.error(err);
      toast.error("Falha ao comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, initialModelId, search]);

  useEffect(() => {
    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen, fetchBookings]);

  if (!isOpen) return null;

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingId(bookingId);
      const res = await fetch(`/api/admin/models/bookings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao atualizar status.");
        return;
      }

      toast.success(data.message || `Status atualizado para ${newStatus}!`);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus as any } : b))
      );
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar proposta.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatCurrency = (cents?: number | null) => {
    if (!cents && cents !== 0) return "A combinar";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Propostas & Contratação de Modelos (Casting)
              </h2>
              <p className="text-xs text-neutral-400">
                Gerencie solicitações de contratação de modelos reais feitas pelos clientes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 bg-neutral-950/40 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {[
                { id: "ALL", label: `Todos (${counts.total})` },
                { id: "PENDING", label: `Pendentes (${counts.pending})` },
                { id: "APPROVED", label: `Aprovados (${counts.approved})` },
                { id: "REJECTED", label: `Rejeitados (${counts.rejected})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition min-h-[38px] ${
                    statusFilter === tab.id
                      ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Busca */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por cliente, modelo ou nota..."
                className="w-full pl-9 pr-3.5 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition min-h-[40px]"
              />
            </div>

            <button
              onClick={fetchBookings}
              disabled={loading}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition min-h-[40px] min-w-[40px] flex items-center justify-center self-end sm:self-auto"
              title="Atualizar lista"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Lista de Reservas com Scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {loading && bookings.length === 0 ? (
            <div className="py-16 text-center text-neutral-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-500 opacity-60" />
              <p className="text-sm">Carregando propostas de contratação...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-16 text-center text-neutral-400 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/20">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-neutral-600" />
              <p className="text-sm font-medium text-neutral-300">Nenhuma proposta encontrada</p>
              <p className="text-xs text-neutral-500 mt-1">
                Quando os usuários solicitarem cachê ou contratação de modelos reais, as propostas aparecerão aqui.
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              const isUpdating = updatingId === booking.id;

              return (
                <div
                  key={booking.id}
                  className="p-4 sm:p-5 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-xl transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Modelo & Cliente */}
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={booking.model.avatarUrl || "/placeholder-avatar.png"}
                        alt={booking.model.name}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-800 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">
                            {booking.model.name}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {booking.model.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                          <span>Cliente: <strong className="text-neutral-300">{booking.user.name || "Sem Nome"}</strong> ({booking.user.email})</span>
                        </div>
                      </div>
                    </div>

                    {/* Orçamento e Status Badge */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-neutral-500 font-semibold block">
                          Orçamento Proposto
                        </span>
                        <span className="text-sm font-bold text-emerald-400">
                          {formatCurrency(booking.amountCents)}
                        </span>
                      </div>

                      <div className="h-6 w-px bg-neutral-800" />

                      <div>
                        {booking.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5" /> Pendente
                          </span>
                        )}
                        {booking.status === "APPROVED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Aprovada
                          </span>
                        )}
                        {booking.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle className="w-3.5 h-3.5" /> Recusada
                          </span>
                        )}
                        {booking.status === "COMPLETED" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Concluída
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notas / Briefing do Usuário */}
                  {booking.notes && (
                    <div className="p-3 bg-neutral-900 border border-neutral-800/80 rounded-lg text-xs text-neutral-300 flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-neutral-400 block mb-0.5">Briefing do Contratante:</span>
                        <p className="whitespace-pre-line text-neutral-300">{booking.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Contato do Modelo e Ações */}
                  <div className="pt-2 border-t border-neutral-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4 text-neutral-400">
                      {booking.model.instagramHandle && (
                        <span className="flex items-center gap-1 text-neutral-300">
                          <AtSign className="w-3.5 h-3.5 text-pink-400" />
                          @{booking.model.instagramHandle}
                        </span>
                      )}
                      {booking.model.contactEmail && (
                        <span className="flex items-center gap-1 text-neutral-300">
                          <Mail className="w-3.5 h-3.5 text-blue-400" />
                          {booking.model.contactEmail}
                        </span>
                      )}
                      {booking.model.location && (
                        <span className="flex items-center gap-1 text-neutral-300">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {booking.model.location}
                        </span>
                      )}
                      <span className="text-neutral-500">
                        {new Date(booking.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Botões de Ação para Aprovar / Rejeitar */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {booking.status !== "APPROVED" && (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(booking.id, "APPROVED")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-semibold border border-emerald-500/30 transition min-h-[38px] flex items-center gap-1 text-xs disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Aprovar
                        </button>
                      )}

                      {booking.status !== "REJECTED" && (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(booking.id, "REJECTED")}
                          className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-semibold border border-rose-500/30 transition min-h-[38px] flex items-center gap-1 text-xs disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Recusar
                        </button>
                      )}

                      {booking.status === "APPROVED" && (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(booking.id, "COMPLETED")}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-semibold border border-blue-500/30 transition min-h-[38px] flex items-center gap-1 text-xs disabled:opacity-50"
                        >
                          Marcar Concluído
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
