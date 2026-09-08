"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Coins,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Send,
  Video,
  Image as ImageIcon,
  Boxes,
  Clock,
  Activity,
  AlertCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

interface FAQItem {
  id: string;
  category: "Geral" | "Créditos" | "Imagens" | "Vídeos" | "Flow";
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "credits-work",
    category: "Créditos",
    question: "Como funcionam os créditos da plataforma?",
    answer:
      "Cada geração consome uma quantidade específica de créditos conforme o poder computacional do motor selecionado (ex: FLUX.1 Turbo consome 1 crédito, ByteDance Seedance 2.0 consome 20 créditos). Seus créditos comprados nunca expiram e ficam sempre vinculados à sua conta.",
  },
  {
    id: "generation-refund",
    category: "Créditos",
    question: "O que acontece se uma geração falhar?",
    answer:
      "O VORIXA possui proteção financeira automática e atômica. Se um motor de IA retornar timeout ou erro de renderização, seus créditos são imediatamente estornados para o seu saldo sem que você precise solicitar ao suporte.",
  },
  {
    id: "best-image-model",
    category: "Imagens",
    question: "Qual o melhor modelo de imagem para pessoas reais e fotorrealismo?",
    answer:
      "Para fotorrealismo humano extremo e fidelidade anatômica, recomendamos o Google Imagen 3 / Nano Banana Pro. Para manter rigorosamente a mesma pessoa e barba a partir de uma foto de referência, selecione o FLUX PuLID (Mesmo Rosto).",
  },
  {
    id: "video-sound",
    category: "Vídeos",
    question: "Quais modelos de vídeo já possuem áudio e som sincronizados?",
    answer:
      "O modelo ByteDance Seedance 2.0 gera vídeo cinematográfico com física hiper-realista e efeitos sonoros/áudio sincronizados nativamente direto do prompt. Para modelos como Wan 2.1 e Kling 2.1, você pode ativar a opção One-Shot LipSync para adicionar narração neural em Português.",
  },
  {
    id: "flow-usage",
    category: "Flow",
    question: "O que é o VORIXA FLOW e como utilizá-lo?",
    answer:
      "O VORIXA FLOW é um estúdio de nós visuais infinitos onde você pode encadear fluxos criativos completos (ex: gerar uma imagem base, conectar para vídeo e depois aplicar upscale 4K). Ele orquestra os nós automaticamente sem você precisar refazer downloads manuais.",
  },
  {
    id: "payment-methods",
    category: "Créditos",
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos Pix com liberação instantânea e Cartão de Crédito (Visa, Mastercard, Elo, Hipercard e American Express). Os créditos são adicionados automaticamente em segundos assim que a transação for confirmada pelo gateway seguro.",
  },
  {
    id: "commercial-rights",
    category: "Geral",
    question: "Tenho direitos comerciais sobre as imagens e vídeos gerados?",
    answer:
      "Sim! Todo o conteúdo gerado por você na plataforma VORIXA possui licença de uso comercial completa, permitindo utilização em publicidades, YouTube, redes sociais, clientes e e-commerce.",
  },
];

const CATEGORIES = ["Todos", "Geral", "Créditos", "Imagens", "Vídeos", "Flow"] as const;

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>("credits-work");

  // Formulário de Contato / Chamado
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Dúvida Geral");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCat = selectedCategory === "Todos" || faq.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleSendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error("Por favor, preencha o assunto e a descrição da sua mensagem.");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast.success("Mensagem enviada com sucesso! Nossa equipe entrará em contato em até 2 horas úteis.");
      setTicketSubject("");
      setTicketMessage("");
    } catch (err) {
      toast.error("Servidor instável. Tente novamente em alguns instantes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* 1. Header Principal e Busca Inteligente */}
      <div className="relative overflow-hidden rounded-3xl border border-[#1E202E] bg-[#0D0E12] p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-violet-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
            <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
            <span>Central de Atendimento e FAQ</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading">
            Como podemos te ajudar hoje?
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Tire suas dúvidas sobre motores generativos, compra e estorno de créditos, ou abra um chamado direto com nossos especialistas.
          </p>

          {/* Campo de Busca Rápida no FAQ */}
          <div className="relative pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque por 'créditos', 'vídeo com áudio', 'faturamento'..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#070709] border border-[#1E202E] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 px-2 py-1 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cards de Acesso Rápido / Canais Diretos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WhatsApp Suporte */}
        <a
          href="https://wa.me/5511999999999?text=Olá,%20preciso%20de%20ajuda%20com%20minha%20conta%20no%20VORIXA"
          target="_blank"
          rel="noopener noreferrer"
          className="p-5 rounded-2xl border border-[#1E202E] bg-[#0D0E12] hover:border-emerald-500/50 transition-all group shadow-xl flex flex-col justify-between space-y-4 cursor-pointer"
        >
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white font-heading">
              WhatsApp Oficial
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Atendimento rápido para dúvidas sobre pagamentos, ativação de planos e suporte técnico imediato.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <span>Iniciar conversa</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </a>

        {/* Status Operacional dos Servidores */}
        <div className="p-5 rounded-2xl border border-[#1E202E] bg-[#0D0E12] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                <Activity className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                100% Operacional
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-heading">
              Saúde dos Motores de IA
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              FLUX, ByteDance Seedance 2.0, Google Imagen 3 e Wan 2.1 com tempo de resposta ideal em tempo real.
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Tempo médio de fila: ~ 2.4s</span>
          </div>
        </div>

        {/* Guia e Manuais Técnicos */}
        <Link
          href="/dashboard/changelog"
          className="p-5 rounded-2xl border border-[#1E202E] bg-[#0D0E12] hover:border-violet-500/50 transition-all group shadow-xl flex flex-col justify-between space-y-4 cursor-pointer"
        >
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-violet-950/60 border border-violet-800/60 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white font-heading">
              Guia de Versões & Atualizações
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Acompanhe as últimas otimizações de custos, novos modelos adicionados e recursos lançados no VORIXA.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-violet-400">
            <span>Ver changelog completo</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* 3. Seção FAQ com Filtro de Categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Perguntas Frequentes (FAQ)</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {filteredFaqs.length} {filteredFaqs.length === 1 ? "tópico" : "tópicos"}
            </span>
          </div>

          {/* Filtro por Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                    : "bg-[#070709] border border-[#1E202E] text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Acordeão de Perguntas e Respostas */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-[#1E202E] text-slate-500">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-semibold">Nenhuma pergunta encontrada para sua busca.</p>
                <p className="text-xs mt-1">Tente pesquisar com outros termos ou envie uma mensagem no formulário ao lado.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? "border-violet-500/40 bg-[#070709] shadow-md"
                        : "border-[#1E202E] bg-[#0D0E12] hover:border-slate-700"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#13141B] text-slate-400 border border-[#1E202E]">
                          {faq.category}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {faq.question}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-violet-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-[#1E202E]/60 text-xs sm:text-sm text-slate-300 leading-relaxed animate-in fade-in-50 duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 4. Formulário de Envio de Chamado / Mensagem */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-[#1E202E] bg-[#0D0E12] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400">
                <Mail className="w-4 h-4" />
                <span>Envie sua Mensagem</span>
              </div>
              <h3 className="text-base font-bold text-white font-heading">
                Abrir Chamado com o Suporte
              </h3>
              <p className="text-xs text-slate-400">
                Preencha os dados abaixo e entraremos em contato diretamente no seu e-mail cadastrado.
              </p>
            </div>

            <form onSubmit={handleSendTicket} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Assunto da Mensagem
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Ex: Dúvida sobre ativação de créditos via Pix"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070709] border border-[#1E202E] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Categoria
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070709] border border-[#1E202E] text-xs sm:text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="Dúvida Geral" className="bg-[#0D0E12] text-white">Dúvida Geral</option>
                  <option value="Faturamento e Pagamentos" className="bg-[#0D0E12] text-white">Faturamento e Pagamentos (Pix / Cartão)</option>
                  <option value="Geração de Imagens" className="bg-[#0D0E12] text-white">Geração de Imagens (FLUX / Imagen 3)</option>
                  <option value="Geração de Vídeos" className="bg-[#0D0E12] text-white">Geração de Vídeos (Seedance / Wan 2.1)</option>
                  <option value="VORIXA FLOW" className="bg-[#0D0E12] text-white">VORIXA FLOW Canvas</option>
                  <option value="Sugestão de Recursos" className="bg-[#0D0E12] text-white">Sugestão de Recursos e Novos Modelos</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">
                  Como podemos ajudar? (Detalhes)
                </label>
                <textarea
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  rows={4}
                  placeholder="Descreva detalhadamente o ocorrido ou sua dúvida..."
                  required
                  className="w-full p-3.5 rounded-xl bg-[#070709] border border-[#1E202E] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white shadow-md shadow-violet-600/20 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
                style={{ minHeight: "44px" }}
              >
                {isSubmitting ? (
                  <span>Enviando chamado...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Mensagem</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
