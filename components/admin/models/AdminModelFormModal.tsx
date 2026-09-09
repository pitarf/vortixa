"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Sparkles, 
  User, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Flame, 
  Check
} from "lucide-react";
import { toast } from "sonner";

export interface MarketplaceModelData {
  id?: string;
  name: string;
  slug: string;
  type: "AI" | "REAL";
  category: "FASHION" | "COMMERCIAL" | "FITNESS" | "LIFESTYLE" | "CORPORATE" | "AVATAR" | "HOT_18" | "GAMES";
  bio?: string | null;
  avatarUrl: string;
  coverUrl?: string | null;
  gallery?: string[];
  tags?: string[];
  promptTrigger?: string | null;
  referenceFaceUrl?: string | null;
  loraModelId?: string | null;
  instagramHandle?: string | null;
  location?: string | null;
  contactEmail?: string | null;
  bookingPriceCents?: number | null;
  creditsPricePerGen?: number;
  status?: boolean;
  isFeatured?: boolean;
  isHot18?: boolean;
  totalBookings?: number;
}

interface AdminModelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  modelToEdit?: MarketplaceModelData | null;
}

const CATEGORIES: Array<{ value: MarketplaceModelData["category"]; label: string }> = [
  { value: "FASHION", label: "Moda & Fashion" },
  { value: "COMMERCIAL", label: "Comercial & Publicidade" },
  { value: "FITNESS", label: "Fitness & Saúde" },
  { value: "LIFESTYLE", label: "Lifestyle & Casual" },
  { value: "CORPORATE", label: "Corporativo & Negócios" },
  { value: "AVATAR", label: "Avatar & Virtual" },
  { value: "HOT_18", label: "Sensual & Hot (+18)" },
  { value: "GAMES", label: "Games & Cosplay" },
];

export function AdminModelFormModal({
  isOpen,
  onClose,
  onSuccess,
  modelToEdit,
}: AdminModelFormModalProps) {
  const isEditing = Boolean(modelToEdit?.id);

  const [formData, setFormData] = useState<Partial<MarketplaceModelData>>({
    name: "",
    slug: "",
    type: "AI",
    category: "FASHION",
    bio: "",
    avatarUrl: "",
    coverUrl: "",
    gallery: [],
    tags: [],
    promptTrigger: "",
    referenceFaceUrl: "",
    loraModelId: "",
    instagramHandle: "",
    location: "",
    contactEmail: "",
    bookingPriceCents: 50000, // R$ 500,00 padrão
    creditsPricePerGen: 5,
    status: true,
    isFeatured: false,
    isHot18: false,
  });

  const [galleryInput, setGalleryInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  // Preenche dados ao abrir/editar
  useEffect(() => {
    if (modelToEdit) {
      setFormData({
        ...modelToEdit,
        gallery: modelToEdit.gallery || [],
        tags: modelToEdit.tags || [],
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        type: "AI",
        category: "FASHION",
        bio: "",
        avatarUrl: "",
        coverUrl: "",
        gallery: [],
        tags: [],
        promptTrigger: "",
        referenceFaceUrl: "",
        loraModelId: "",
        instagramHandle: "",
        location: "",
        contactEmail: "",
        bookingPriceCents: 50000,
        creditsPricePerGen: 5,
        status: true,
        isFeatured: false,
        isHot18: false,
      });
    }
  }, [modelToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto-gerar slug a partir do nome
  const handleNameChange = (newName: string) => {
    setFormData((prev) => {
      const autoSlug = !isEditing
        ? newName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : prev.slug;

      return {
        ...prev,
        name: newName,
        slug: autoSlug,
      };
    });
  };

  const handleAddGalleryItem = () => {
    const trimmed = galleryInput.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
      setFormData((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), trimmed],
      }));
      setGalleryInput("");
    } catch {
      toast.error("Por favor insira uma URL válida.");
    }
  };

  const handleRemoveGalleryItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed) return;
    if (formData.tags?.includes(trimmed)) {
      toast.warning("Esta tag já foi adicionada.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), trimmed],
    }));
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error("O nome do modelo é obrigatório.");
      return;
    }

    if (!formData.avatarUrl?.trim()) {
      toast.error("A URL da foto de avatar é obrigatória.");
      return;
    }

    try {
      setSaving(true);
      const url = isEditing
        ? `/api/admin/models/${modelToEdit?.id}`
        : `/api/admin/models`;

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "Erro ao salvar modelo.");
        return;
      }

      toast.success(
        isEditing
          ? "Modelo atualizado com sucesso!"
          : "Novo modelo cadastrado com sucesso!"
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro de conexão ao salvar modelo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${formData.type === "AI" ? "bg-violet-500/20 text-violet-400" : "bg-emerald-500/20 text-emerald-400"}`}>
              {formData.type === "AI" ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? `Editar Modelo: ${modelToEdit?.name}` : "Cadastrar Novo Modelo"}
              </h2>
              <p className="text-xs text-neutral-400">
                Configure os metadados para IA gerativa ou casting de modelo real
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

        {/* Formulário com scroll */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-neutral-200">
          {/* Seletor do Tipo (IA vs REAL) */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-neutral-950 border border-neutral-800 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, type: "AI" }))}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition min-h-[44px] ${
                formData.type === "AI"
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Modelo de IA (Generativo)
            </button>
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, type: "REAL" }))}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition min-h-[44px] ${
                formData.type === "REAL"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              Modelo Real (Casting / Presencial)
            </button>
          </div>

          {/* Dados Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Nome do Modelo *
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Alana Fox, Lucas Vance..."
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Slug / Identificador URL *
              </label>
              <input
                type="text"
                required
                value={formData.slug || ""}
                onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                placeholder="alana-fox"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition font-mono min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Categoria Principal
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value as any }))}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition min-h-[44px]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                {formData.type === "AI" ? "Custo em Créditos (Por Foto/Geração)" : "Cachê Diário Estimado (R$)"}
              </label>
              {formData.type === "AI" ? (
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={formData.creditsPricePerGen || 5}
                    onChange={(e) => setFormData((p) => ({ ...p, creditsPricePerGen: parseInt(e.target.value, 10) || 1 }))}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition min-h-[44px]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-medium">
                    créditos
                  </span>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-medium">
                    R$
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={(formData.bookingPriceCents || 0) / 100}
                    onChange={(e) => setFormData((p) => ({ ...p, bookingPriceCents: Math.round(parseFloat(e.target.value || "0") * 100) }))}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition min-h-[44px]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Biografia */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Biografia & Descrição do Perfil
            </label>
            <textarea
              rows={3}
              value={formData.bio || ""}
              onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Descreva as características do modelo, estilo de ensaio, nichos de atuação..."
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition resize-none"
            />
          </div>

          {/* Seção Mídias (Avatar, Capa e Galeria) */}
          <div className="border-t border-neutral-800 pt-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-violet-400" />
              Mídias & Imagens
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Avatar / Foto Principal (URL) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={formData.avatarUrl || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, avatarUrl: e.target.value }))}
                    placeholder="https://.../avatar.jpg"
                    className="flex-1 px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition min-h-[44px]"
                  />
                  {formData.avatarUrl && (
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-neutral-700 flex-shrink-0 bg-neutral-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Imagem de Capa / Header (URL Opcional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.coverUrl || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, coverUrl: e.target.value }))}
                    placeholder="https://.../cover.jpg"
                    className="flex-1 px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition min-h-[44px]"
                  />
                  {formData.coverUrl && (
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-neutral-700 flex-shrink-0 bg-neutral-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Galeria de Fotos / Amostras */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Galeria / Amostras de Trabalho (URLs)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddGalleryItem())}
                  placeholder="Cole uma URL de imagem e clique em adicionar..."
                  className="flex-1 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryItem}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition min-h-[44px] flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>

              {formData.gallery && formData.gallery.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 p-2 bg-neutral-950 border border-neutral-800 rounded-xl">
                  {formData.gallery.map((url, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Amostra ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryItem(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Configurações Específicas para IA */}
          {formData.type === "AI" && (
            <div className="border-t border-neutral-800 pt-5 space-y-4">
              <h3 className="text-sm font-bold text-violet-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Configurações do Motor de IA
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Gatilho de Prompt (Trigger Word)
                  </label>
                  <input
                    type="text"
                    value={formData.promptTrigger || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, promptTrigger: e.target.value }))}
                    placeholder="Ex: ohwx woman, cks man"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition font-mono min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    ID do LoRA / Modelo Treinado
                  </label>
                  <input
                    type="text"
                    value={formData.loraModelId || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, loraModelId: e.target.value }))}
                    placeholder="Ex: fal-ai/lora-12345"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition font-mono min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Rosto de Referência (Face Swap URL)
                  </label>
                  <input
                    type="url"
                    value={formData.referenceFaceUrl || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, referenceFaceUrl: e.target.value }))}
                    placeholder="https://.../reference-face.jpg"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Configurações Específicas para Modelo Real */}
          {formData.type === "REAL" && (
            <div className="border-t border-neutral-800 pt-5 space-y-4">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Dados de Contato & Casting (Modelo Real)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Instagram (@handle)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">@</span>
                    <input
                      type="text"
                      value={(formData.instagramHandle || "").replace(/^@/, "")}
                      onChange={(e) => setFormData((p) => ({ ...p, instagramHandle: e.target.value.replace(/^@/, "") }))}
                      placeholder="perfilmodelo"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Localização (Cidade/UF)
                  </label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                    placeholder="São Paulo, SP"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Email de Contato / Assessoria
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail || ""}
                    onChange={(e) => setFormData((p) => ({ ...p, contactEmail: e.target.value }))}
                    placeholder="contato@agencia.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="border-t border-neutral-800 pt-5 space-y-3">
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Tags / Palavras-chave
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Ex: loira, moreno, streetwear, editorial..."
                className="flex-1 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 transition min-h-[44px]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition min-h-[44px]"
              >
                Adicionar Tag
              </button>
            </div>

            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-800 border border-neutral-700 rounded-full text-xs text-neutral-200"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-400 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Opções de Ativação / Destaque / Hot 18+ */}
          <div className="border-t border-neutral-800 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl cursor-pointer hover:border-neutral-700 transition">
              <input
                type="checkbox"
                checked={Boolean(formData.status)}
                onChange={(e) => setFormData((p) => ({ ...p, status: e.target.checked }))}
                className="w-4 h-4 text-emerald-500 rounded border-neutral-700 focus:ring-emerald-500/20 bg-neutral-900"
              />
              <div>
                <span className="text-sm font-bold text-white block">Status Ativo</span>
                <span className="text-xs text-neutral-400">Visível publicamente na vitrine</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl cursor-pointer hover:border-neutral-700 transition">
              <input
                type="checkbox"
                checked={Boolean(formData.isFeatured)}
                onChange={(e) => setFormData((p) => ({ ...p, isFeatured: e.target.checked }))}
                className="w-4 h-4 text-amber-500 rounded border-neutral-700 focus:ring-amber-500/20 bg-neutral-900"
              />
              <div>
                <span className="text-sm font-bold text-white block">Destaque</span>
                <span className="text-xs text-neutral-400">Exibir no topo da vitrine</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl cursor-pointer hover:border-neutral-700 transition">
              <input
                type="checkbox"
                checked={Boolean(formData.isHot18)}
                onChange={(e) => setFormData((p) => ({ ...p, isHot18: e.target.checked }))}
                className="w-4 h-4 text-rose-500 rounded border-neutral-700 focus:ring-rose-500/20 bg-neutral-900"
              />
              <div>
                <span className="text-sm font-bold text-rose-400 block flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Conteúdo Hot (+18)
                </span>
                <span className="text-xs text-neutral-400">Exige confirmação de idade</span>
              </div>
            </label>
          </div>

          {/* Rodapé com botões de ação */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3 sticky bottom-0 bg-neutral-900/95 backdrop-blur py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-neutral-300 font-medium text-sm transition min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-violet-600/25 flex items-center gap-2 min-h-[44px] disabled:opacity-50"
            >
              {saving ? (
                <>Salvando...</>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {isEditing ? "Salvar Alterações" : "Criar Modelo"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
