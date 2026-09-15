"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Coins,
  Flame,
  Zap,
  Check,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  RefreshCw,
  Clock,
  CreditCard,
  Sparkles,
  Lock,
  Star,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";

import {
  PaymentCheckoutModal,
  CreditPackageSummary,
  CardData,
} from "@/components/credits/PaymentCheckoutModal";
import { PaymentPixModal } from "@/components/credits/PaymentPixModal";
import { PaymentSuccessModal } from "@/components/credits/PaymentSuccessModal";
import { PaymentFailureModal } from "@/components/credits/PaymentFailureModal";

interface CreditPackageData {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  priceCents: number;
  bonusCredits: number;
  status: boolean;
  displayOrder: number;
  isPopular?: boolean;
  isBestValue?: boolean;
  badgeText?: string;
}

interface UserCreditInfo {
  balance: number;
  isUnlimited: boolean;
  name?: string | null;
  email?: string | null;
}

function CreditsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<UserCreditInfo>({ balance: 0, isUnlimited: false });
  const [packages, setPackages] = useState<CreditPackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Estados dos Modais de Pagamento
  const [selectedPackage, setSelectedPackage] = useState<CreditPackageData | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [activePixCode, setActivePixCode] = useState<string | null>(null);
  const [activePixQrCode, setActivePixQrCode] = useState<string | null>(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successDetails, setSuccessDetails] = useState<any>(null);

  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [failureReason, setFailureReason] = useState<string | null>(null);

  const defaultPackages: CreditPackageData[] = [
    {
      id: "pkg-test",
      name: "Plano Teste",
      description: "Pacote promocional para validação rápida de fluxo de pagamentos e ferramentas de IA.",
      credits: 50,
      priceCents: 990,
      bonusCredits: 0,
      status: true,
      displayOrder: 0,
      badgeText: "TESTE R$ 9,90",
    },
    {
      id: "pkg-100",
      name: "Iniciante",
      description: "Ideal para experimentar os motores neurais e criar seus primeiros conteúdos sem compromisso.",
      credits: 100,
      priceCents: 1990,
      bonusCredits: 0,
      status: true,
      displayOrder: 1,
      isPopular: false,
    },
    {
      id: "pkg-500",
      name: "Profissional",
      description: "O plano mais escolhido por criadores de conteúdo e agências para escala contínua com excelente custo-benefício.",
      credits: 500,
      priceCents: 7990,
      bonusCredits: 50,
      status: true,
      displayOrder: 2,
      isPopular: true,
      badgeText: "MAIS ESCOLHIDO",
    },
    {
      id: "pkg-1000",
      name: "Criador Pro",
      description: "Para estúdios e criadores de alta escala com geração em massa de vídeos cinemáticos e avatares sincronizados.",
      credits: 1000,
      priceCents: 14990,
      bonusCredits: 150,
      status: true,
      displayOrder: 3,
      isBestValue: true,
      badgeText: "MELHOR VALOR",
    },
    {
      id: "pkg-2500",
      name: "Studio Ultra",
      description: "Capacidade máxima de renderização prioritária para produções publicitárias, cinema e pipelines automatizados.",
      credits: 2500,
      priceCents: 34990,
      bonusCredits: 500,
      status: true,
      displayOrder: 4,
      isPopular: false,
      badgeText: "MÁXIMA POTÊNCIA",
    },
  ];

  const fetchCreditsData = async () => {
    try {
      setLoading(true);
      const [pkgsRes, userRes] = await Promise.all([
        fetch("/api/payments/packages").catch(() => null),
        fetch("/api/admin/users?limit=1").catch(() => null),
      ]);

      if (pkgsRes && pkgsRes.ok) {
        const pkgsData = await pkgsRes.json();
        if (Array.isArray(pkgsData) && pkgsData.length > 0) {
          setPackages(pkgsData);
        } else if (pkgsData.packages && Array.isArray(pkgsData.packages)) {
          setPackages(pkgsData.packages);
        } else {
          setPackages(defaultPackages);
        }
      } else {
        setPackages(defaultPackages);
      }

      if (userRes && userRes.ok) {
        const userData = await userRes.json();
        if (userData?.currentUserBalance !== undefined) {
          setUserInfo({
            balance: userData.currentUserBalance,
            isUnlimited: !!userData.isUnlimited,
            name: userData.currentUserName || "Criador VORTIXIA",
          });
        }
      }
    } catch {
      setPackages(defaultPackages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditsData();
  }, []);

  // Trata parâmetros de retorno do Gateway de pagamento
  useEffect(() => {
    const status = searchParams.get("status");
    const orderId = searchParams.get("orderId");
    const paymentId = searchParams.get("payment_id") || searchParams.get("paymentId");

    if (status === "success" || status === "approved") {
      const fetchStatus = async () => {
        let credits = 500;
        let amountCents = 7990;
        let newBal = userInfo.balance + 500;

        if (paymentId) {
          try {
            const res = await fetch(`/api/payments/status/${paymentId}`);
            if (res.ok) {
              const data = await res.json();
              if (data.creditsGranted) credits = data.creditsGranted;
              if (data.amountCents) amountCents = data.amountCents;
              if (data.currentBalance !== undefined) newBal = data.currentBalance;
            }
          } catch (e) {
            console.warn("Erro ao obter dados dinâmicos do pagamento:", e);
          }
        }

        setSuccessDetails({
          paymentId: paymentId || orderId || "tx-confirmada",
          orderId: orderId || undefined,
          credits,
          amountCents,
          newBalance: newBal,
        });
        setIsSuccessModalOpen(true);
        fetchCreditsData();
      };

      fetchStatus();
      router.replace("/dashboard/credits");
    } else if (status === "failure" || status === "rejected") {
      setFailureReason("O pagamento foi cancelado ou não aprovado pela instituição financeira.");
      setIsFailureModalOpen(true);
      router.replace("/dashboard/credits");
    } else if (status === "pending" || status === "in_process") {
      toast.info("Pagamento em análise pelo gateway. Seus créditos serão liberados assim que aprovado.", {
        duration: 6000,
      });
      router.replace("/dashboard/credits");
    }
  }, [searchParams, router]);

  const handleOpenCheckout = (pkg: CreditPackageData) => {
    setSelectedPackage(pkg);
    setIsCheckoutModalOpen(true);
  };

  const handleProceedCheckout = async (
    selectedMethod: "pix" | "card",
    cpf?: string,
    cardData?: CardData
  ) => {
    if (!selectedPackage || isProcessingCheckout) return;

    try {
      setIsProcessingCheckout(true);
      toast.loading("Iniciando sessão de pagamento segura...", { id: "checkout-toast" });

      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          paymentMethod: selectedMethod === "pix" ? "pix" : "credit_card",
          cpf: cpf,
          cardNumber: cardData?.cardNumber,
          cardHolderName: cardData?.cardHolderName,
          cardExpiryMonth: cardData?.cardExpiryMonth,
          cardExpiryYear: cardData?.cardExpiryYear,
          cardCcv: cardData?.cardCcv,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao iniciar compra.", { id: "checkout-toast" });
        return;
      }

      setIsCheckoutModalOpen(false);

      if (selectedMethod === "pix") {
        setActivePaymentId(data.paymentId);
        setActiveOrderId(data.orderId);
        setActivePixCode(data.pixCode || null);
        setActivePixQrCode(data.pixQrCode || null);
        setIsPixModalOpen(true);
        toast.success("Código Pix gerado com sucesso! Conclua o pagamento no seu banco.", { id: "checkout-toast" });
      } else {
        if (data.checkoutUrl) {
          toast.success("Redirecionando para o ambiente seguro...", { id: "checkout-toast" });
          setTimeout(() => {
            window.location.href = data.checkoutUrl;
          }, 600);
        } else {
          toast.success("Transação enviada com sucesso!", { id: "checkout-toast" });
          fetchCreditsData();
        }
      }
    } catch {
      toast.error("Erro de comunicação com o servidor de pagamentos.", { id: "checkout-toast" });
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handlePaymentApproved = (details: any) => {
    setSuccessDetails(details);
    setIsSuccessModalOpen(true);
    fetchCreditsData();
  };

  const formatBRL = (cents: number) => {
    return (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const faqItems = [
    {
      question: "Os créditos possuem data de validade?",
      answer: "Não. Todos os créditos adquiridos no VORTIXIA são vitalícios e nunca expiram. Você pode usá-los hoje, no mês seguinte ou ao longo do ano sem qualquer perda de saldo.",
    },
    {
      question: "Quais as formas de pagamento aceitas?",
      answer: "Aceitamos Pix Instantâneo com liquidação e liberação automatizada em até 3 segundos via Vorexpay. O pagamento via Cartão de Crédito está temporariamente em manutenção para melhorias de integração.",
    },
    {
      question: "O que acontece se uma geração de vídeo ou imagem falhar?",
      answer: "Nosso sistema opera sobre a arquitetura Ledger Zero Trust com estorno automático. Se um motor de IA falhar ou rejeitar o processamento, os créditos são imediatamente devolvidos ao seu saldo sem necessidade de abrir suporte.",
    },
    {
      question: "Posso utilizar meus créditos em todas as ferramentas?",
      answer: "Sim! Os mesmos créditos são válidos universalmente para FLUX Imagem, Kling AI Vídeo, Wan 2.1, Luma Ray 2, LatentSync LipSync, Síntese de Voz TTS e no VORTIXIA FLOW Canvas.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 pb-16 sm:pb-20 px-3 sm:px-4 lg:px-6">
      {/* Modais de Fluxo de Pagamento */}
      <PaymentCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        packageData={selectedPackage}
        onProceed={handleProceedCheckout}
        isProcessing={isProcessingCheckout}
      />

      <PaymentPixModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        paymentId={activePaymentId}
        orderId={activeOrderId}
        packageData={selectedPackage}
        pixCode={activePixCode}
        qrCodeBase64={activePixQrCode}
        onPaymentApproved={handlePaymentApproved}
        onPaymentFailed={(reason) => {
          setFailureReason(reason || null);
          setIsFailureModalOpen(true);
        }}
      />

      <PaymentSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        orderDetails={successDetails}
      />

      <PaymentFailureModal
        isOpen={isFailureModalOpen}
        onClose={() => setIsFailureModalOpen(false)}
        onRetry={() => {
          setIsFailureModalOpen(false);
          if (selectedPackage) {
            setIsCheckoutModalOpen(true);
          }
        }}
        reason={failureReason}
      />

      {/* 1. Header & Hero com Fintech Card Glassmorphism Fluido */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#13141B] via-[#0D0E12] to-[#070709] border border-[#1E202E] p-4 xs:p-6 sm:p-8 md:p-10 shadow-2xl">
        {/* Glows de Fundo */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3.5 max-w-2xl text-center lg:text-left w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-mono font-semibold">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>SISTEMA FINANCEIRO VORTIXIA</span>
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-heading leading-tight">
              Recarga & Carteira{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
                Digital
              </span>
            </h1>
            <p className="text-slate-400 text-xs xs:text-sm md:text-base leading-relaxed">
              Adquira créditos pré-pagos sob demanda para alimentar seus motores de IA: imagens hiper-realistas, cenas cinemáticas Kling, dublagem labial e motion control. Sem mensalidades forçadas, renovações automáticas ou expiração de saldo.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 xs:gap-3 sm:gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Liberação em 3s</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Saldo Sem Expiração</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Estorno em Falhas</span>
              </div>
            </div>
          </div>

          {/* Fintech Card Revolut / Apple Card Glassmorphism 100% Adaptativo */}
          <div className="w-full max-w-md mx-auto lg:mx-0 shrink-0">
            <div className="relative rounded-3xl p-4 xs:p-5 sm:p-6 bg-gradient-to-br from-[#1E202E]/90 via-[#0D0E12] to-[#070709] border border-violet-500/30 shadow-[0_0_50px_rgba(139,92,246,0.15)] backdrop-blur-xl overflow-hidden group hover:border-violet-400/60 transition-all duration-300 min-h-[195px] sm:min-h-[215px] flex flex-col justify-between">
              {/* Textura Geométrica Holográfica Sutil */}
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-gradient-to-br from-violet-600/30 to-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between flex-1 gap-4">
                {/* Linha Superior: Logo VORTIXIA + Chip EMV + NFC */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Chip Metálico EMV com Escalonamento Flexível */}
                    <div className="w-9 h-6 xs:w-10 xs:h-7 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/60 p-1 flex flex-col justify-between shadow-inner shrink-0">
                      <div className="w-full h-0.5 bg-amber-700/50 rounded" />
                      <div className="w-full h-0.5 bg-amber-700/50 rounded" />
                    </div>
                    {/* Símbolo Contactless NFC */}
                    <Wifi className="w-4 h-4 xs:w-5 xs:h-5 text-slate-400 rotate-90 shrink-0" />
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#13141B] border border-violet-500/30 text-violet-300 text-[9px] xs:text-[10px] font-mono font-bold tracking-wider truncate">
                    VORTIXIA BLACK TITANIUM
                  </div>
                </div>

                {/* Linha Central: Saldo Consolidado */}
                <div className="my-auto py-1">
                  <span className="text-[10px] xs:text-[11px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">
                    SALDO DISPONÍVEL NA CARTEIRA
                  </span>
                  <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                    <span className="text-2xl xs:text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-violet-300 font-mono tracking-tight break-all">
                      {userInfo.isUnlimited ? "ILIMITADO" : userInfo.balance.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-xs xs:text-sm font-bold text-violet-400 font-mono">
                      créditos
                    </span>
                  </div>
                </div>

                {/* Linha Inferior: Dados do Titular e Status */}
                <div className="pt-2.5 border-t border-[#1E202E]/80 flex items-center justify-between text-[10px] xs:text-[11px] font-mono text-slate-400 gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block truncate">
                      Titular da Conta
                    </span>
                    <span className="text-white font-bold tracking-wide truncate block">
                      {userInfo.name || "CRIADOR VORTIXIA"}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Validade</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      VITALÍCIO
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pilares Financeiros no Rodapé do Banner (1 col celular, 2 tablet, 4 desktop) */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#1E202E]/70 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300 p-2.5 rounded-2xl bg-[#070709]/50 border border-[#1E202E]/50">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white truncate">Liberação Imediata</span>
              <span className="text-[11px] text-slate-500 truncate">Pix aprovado em 3 segundos</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300 p-2.5 rounded-2xl bg-[#070709]/50 border border-[#1E202E]/50">
            <Lock className="h-4 w-4 text-cyan-400 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white truncate">Criptografia SSL 256</span>
              <span className="text-[11px] text-slate-500 truncate">Checkout bancário seguro</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300 p-2.5 rounded-2xl bg-[#070709]/50 border border-[#1E202E]/50">
            <Clock className="h-4 w-4 text-violet-400 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white truncate">Créditos Sem Fim</span>
              <span className="text-[11px] text-slate-500 truncate">Saldo nunca expira</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300 p-2.5 rounded-2xl bg-[#070709]/50 border border-[#1E202E]/50">
            <RefreshCw className="h-4 w-4 text-amber-400 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white truncate">Estorno Automático</span>
              <span className="text-[11px] text-slate-500 truncate">Garantia Zero Trust</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid de Pacotes de Créditos (1 Col Mobile, 2 Cols Tablet, 4 Cols Desktop) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Zap className="h-4 w-4 text-amber-400" />
              Tabela de Pacotes Sob Demanda
            </div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
              Escolha a Quantidade Ideal de Créditos
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Quanto maior o pacote, menor o custo por crédito e maior o volume de bônus gratuitos liberados instantaneamente.
            </p>
          </div>
        </div>

        {/* GRID ADAPTATIVO: Distribuição harmoniosa na tela sem colunas vazias */}
        <div
          className={`grid gap-5 sm:gap-6 items-stretch w-full ${
            packages.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : packages.length === 2
              ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
              : packages.length === 3
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
              : packages.length === 4
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          }`}
        >
          {packages.map((pkg) => {
            const totalCredits = pkg.credits + pkg.bonusCredits;
            const unitCost = (pkg.priceCents / 100 / totalCredits).toFixed(2);
            const isTest = pkg.id === "pkg-test" || pkg.priceCents === 990;
            const isPopular = (pkg.isPopular || pkg.id === "pkg-500") && !isTest;
            const isBestValue = (pkg.isBestValue || pkg.id === "pkg-1000") && !isTest;
            const hasBadge = isTest || isPopular || isBestValue;

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-3xl p-5 sm:p-6 transition-all duration-300 group ${
                  hasBadge ? "pt-8 sm:pt-8" : ""
                } ${
                  isTest
                    ? "bg-gradient-to-b from-[#1c180e] via-[#120f09] to-[#070709] border-2 border-amber-500/80 shadow-[0_0_35px_rgba(245,158,11,0.2)] hover:border-amber-400 hover:scale-[1.01]"
                    : isPopular
                    ? "bg-gradient-to-b from-[#161824] via-[#0E1017] to-[#070709] border-2 border-violet-500 shadow-[0_0_40px_rgba(139,92,246,0.22)] hover:border-violet-400 hover:scale-[1.01]"
                    : isBestValue
                    ? "bg-gradient-to-b from-[#101924] via-[#0B1017] to-[#070709] border-2 border-cyan-500/80 shadow-[0_0_35px_rgba(6,182,212,0.18)] hover:border-cyan-400 hover:scale-[1.01]"
                    : "bg-[#0D0E12] border border-[#1E202E] hover:border-slate-700 hover:bg-[#13141B]"
                }`}
              >
                {/* Badge Luminosa no Topo (Posicionamento Seguro sem Colisão) */}
                {isTest && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 sm:px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center gap-1.5 whitespace-nowrap z-20">
                    <Sparkles className="h-3.5 w-3.5 fill-current text-white shrink-0" />
                    <span>{pkg.badgeText || "TESTE R$ 9,90"}</span>
                  </div>
                )}

                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 sm:px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-violet-600/40 flex items-center gap-1.5 whitespace-nowrap z-20">
                    <Flame className="h-3.5 w-3.5 fill-current text-amber-300 shrink-0" />
                    <span>{pkg.badgeText || "MAIS POPULAR"}</span>
                  </div>
                )}

                {isBestValue && !isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 sm:px-4 py-1 rounded-full bg-gradient-to-r from-cyan-600 to-teal-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-cyan-600/40 flex items-center gap-1.5 whitespace-nowrap z-20">
                    <Star className="h-3.5 w-3.5 fill-current text-amber-300 shrink-0" />
                    <span>{pkg.badgeText || "MELHOR VALOR"}</span>
                  </div>
                )}

                <div>
                  {/* Nome do Pacote & Bônus */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-violet-300 transition-colors font-heading">
                      {pkg.name}
                    </h3>
                    {pkg.bonusCredits > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold tracking-tight">
                        +{pkg.bonusCredits} BÔNUS
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-2 min-h-[32px] sm:min-h-[36px] leading-relaxed">
                    {pkg.description || "Gerações liberadas em todos os motores criativos."}
                  </p>

                  {/* Preço em Destaque */}
                  <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[#1E202E]">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-2xl xs:text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                        {formatBRL(pkg.priceCents)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                      pagamento único sob demanda
                    </span>

                    {/* Créditos Totais e Custo Unitário */}
                    <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                      <div className="px-3 py-1 rounded-xl bg-[#13141B] border border-[#1E202E] text-xs font-mono font-bold text-violet-300 flex items-center gap-1.5">
                        <Coins className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>{totalCredits.toLocaleString("pt-BR")} créditos</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono font-semibold">
                        ≈ R$ {unitCost}/cr
                      </span>
                    </div>
                  </div>

                  {/* Poder de Fogo / Mídias Estimadas */}
                  <div className="mt-5 sm:mt-6 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="leading-snug">{totalCredits} imagens com FLUX Schnell</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="leading-snug">Até {Math.floor(totalCredits / 10)} vídeos cinemáticos Kling</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="leading-snug">{Math.floor(totalCredits / 8)} gerações de Lip Sync</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="leading-snug">Acesso total ao VORTIXIA FLOW Canvas</span>
                    </div>
                  </div>
                </div>

                {/* Botão de Compra CTA Touch Target Mínimo de 48px */}
                <div className="mt-6 sm:mt-7">
                  <button
                    type="button"
                    onClick={() => handleOpenCheckout(pkg)}
                    style={{ minHeight: "48px" }}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-lg duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                      isPopular
                        ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-violet-600/30 hover:shadow-violet-600/50 active:scale-[0.98]"
                        : isBestValue
                        ? "bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white shadow-cyan-600/30 hover:shadow-cyan-600/50 active:scale-[0.98]"
                        : isTest
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-[0.98]"
                        : "bg-[#13141B] hover:bg-[#1E202E] text-slate-100 border border-[#1E202E] hover:border-slate-700 active:scale-[0.98]"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Selecionar</span>
                    <ArrowRight className="h-4 w-4 opacity-75 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Dúvidas Frequentes sobre Créditos (FAQ Acordeão Acessível) */}
      <div className="rounded-3xl bg-[#0D0E12] border border-[#1E202E] p-5 sm:p-8 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-violet-400 text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            Transparência Total
          </div>
          <h3 className="text-lg sm:text-2xl font-bold text-white font-heading">
            Perguntas Frequentes sobre Créditos & Cobrança
          </h3>
        </div>

        <div className="divide-y divide-[#1E202E]">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-2.5 sm:py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  style={{ minHeight: "48px" }}
                  className="w-full flex items-center justify-between text-left gap-4 text-xs sm:text-sm font-semibold text-white hover:text-violet-300 transition-colors cursor-pointer py-1.5 focus:outline-none"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-violet-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed pr-4 sm:pr-6 animate-in fade-in duration-200">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CreditsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      }
    >
      <CreditsContent />
    </Suspense>
  );
}
