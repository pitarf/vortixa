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
  RefreshCw,
  Clock,
  CreditCard,
  Layers,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import {
  PaymentCheckoutModal,
  CreditPackageSummary,
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
}

interface CreditTransactionData {
  id: string;
  amount: number;
  type: "PURCHASE" | "GENERATION_DEBIT" | "GENERATION_REFUND" | "BONUS" | "ADMIN_ADJUSTMENT";
  description: string | null;
  createdAt: string;
  jobId: string | null;
  paymentId: string | null;
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
  const [transactions, setTransactions] = useState<CreditTransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Modais de Pagamento
  const [selectedPackage, setSelectedPackage] = useState<CreditPackageData | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [activePixCode, setActivePixCode] = useState<string | null>(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successDetails, setSuccessDetails] = useState<any>(null);

  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [failureReason, setFailureReason] = useState<string | null>(null);

  const defaultPackages: CreditPackageData[] = [
    {
      id: "pkg-100",
      name: "Iniciante",
      description: "Ideal para experimentar os motores e criar seus primeiros conteúdos.",
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
      description: "O pacote mais escolhido por criadores e agências para escala contínua.",
      credits: 500,
      priceCents: 7990,
      bonusCredits: 50,
      status: true,
      displayOrder: 2,
      isPopular: true,
    },
    {
      id: "pkg-1000",
      name: "Criador Pro",
      description: "Para estúdios e criadores de alta escala com geração em massa.",
      credits: 1000,
      priceCents: 14990,
      bonusCredits: 150,
      status: true,
      displayOrder: 3,
      isPopular: false,
    },
  ];

  const fetchCreditsData = async () => {
    try {
      setLoading(true);
      const [pkgsRes, statsRes] = await Promise.all([
        fetch("/api/payments/packages").catch(() => null),
        fetch("/api/admin/stats").catch(() => null),
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

      // Tenta buscar saldo real do usuário
      const userRes = await fetch("/api/admin/users?limit=1").catch(() => null);
      if (userRes && userRes.ok) {
        const userData = await userRes.json();
        if (userData?.currentUserBalance !== undefined) {
          setUserInfo({
            balance: userData.currentUserBalance,
            isUnlimited: !!userData.isUnlimited,
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
      setSuccessDetails({
        paymentId: paymentId || orderId || "tx-confirmada",
        orderId: orderId || undefined,
        credits: 550,
        amountCents: 7990,
        newBalance: userInfo.balance + 550,
      });
      setIsSuccessModalOpen(true);
      fetchCreditsData();
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

  // Abertura do Checkout Modal ao clicar em um pacote
  const handleOpenCheckout = (pkg: CreditPackageData) => {
    setSelectedPackage(pkg);
    setIsCheckoutModalOpen(true);
  };

  // Disparo do Checkout seguro após escolher método
  const handleProceedCheckout = async (selectedMethod: "pix" | "card") => {
    if (!selectedPackage) return;

    try {
      setIsProcessingCheckout(true);
      toast.loading("Gerando sessão de pagamento segura...", { id: "checkout-toast" });

      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          paymentMethod: selectedMethod === "pix" ? "pix" : "credit_card",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao iniciar compra.", { id: "checkout-toast" });
        return;
      }

      setIsCheckoutModalOpen(false);

      if (selectedMethod === "pix") {
        // Abre o modal interativo Pix com polling em tempo real
        setActivePaymentId(data.paymentId);
        setActiveOrderId(data.orderId);
        setActivePixCode(data.pixCode || null);
        setIsPixModalOpen(true);
        toast.success("Código Pix gerado com sucesso! Conclua no app do banco.", { id: "checkout-toast" });
      } else {
        // Redirecionamento para Cartão de Crédito / Checkout Pro
        if (data.checkoutUrl) {
          toast.success("Redirecionando para o ambiente de pagamento...", { id: "checkout-toast" });
          setTimeout(() => {
            window.location.href = data.checkoutUrl;
          }, 600);
        } else {
          toast.error("Link de checkout não retornado pelo gateway.", { id: "checkout-toast" });
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

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
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

      {/* 1. Header & Saldo em Destaque */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#13141B] to-[#0D0E12] border border-[#1E202E] p-6 md:p-10 shadow-2xl">
        {/* Glows de Fundo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono font-medium">
              <Coins className="h-3.5 w-3.5" />
              Recarga e Carteira Digital
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Seu Saldo & Pacotes de Crédito
            </h1>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Adquira créditos pré-pagos sob demanda para gerar imagens, vídeos cinemáticos, sincronização labial e motion control. Sem mensalidades forçadas ou expiração.
            </p>
          </div>

          {/* Card Flutuante de Saldo */}
          <div className="flex-shrink-0 bg-[#070709]/80 backdrop-blur-md border border-[#1E202E] rounded-2xl p-6 flex flex-col items-center justify-center min-w-[220px] text-center shadow-xl group hover:border-violet-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white mb-3 shadow-lg shadow-violet-600/30 group-hover:scale-110 transition-transform">
              <Coins className="h-6 w-6" />
            </div>
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Recarga Rápida
            </span>
            <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-violet-300 mt-1">
              {userInfo.isUnlimited ? "ILIMITADO" : `${userInfo.balance.toLocaleString("pt-BR")}`}
            </span>
            <span className="text-[11px] text-violet-400 font-mono mt-1 font-semibold">
              {userInfo.isUnlimited ? "Acesso Pro Ilimitado" : "Créditos Ativos"}
            </span>
          </div>
        </div>

        {/* Barra de Benefícios Rápidos */}
        <div className="mt-8 pt-6 border-t border-[#1E202E]/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>Liberação Imediata</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Lock className="h-4 w-4 text-cyan-400 flex-shrink-0" />
            <span>Pix e Cartão Seguro</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="h-4 w-4 text-violet-400 flex-shrink-0" />
            <span>Créditos Sem Expiração</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <RefreshCw className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <span>Estorno Automático em Falhas</span>
          </div>
        </div>
      </div>

      {/* 2. Grid de Pacotes de Créditos */}
      <div className="space-y-6">
        <div className="text-center md:text-left space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Escolha o Pacote Ideal
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Selecione a quantidade desejada. Quanto maior o pacote, maior o volume de bônus gratuitos concedidos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const totalCredits = pkg.credits + pkg.bonusCredits;
            const unitCost = (pkg.priceCents / 100 / totalCredits).toFixed(2);
            const isPopular = pkg.isPopular || pkg.bonusCredits === 50 || pkg.id === "pkg-500";

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 md:p-8 transition-all duration-300 group ${
                  isPopular
                    ? "bg-gradient-to-b from-[#13141B] via-[#0D0E12] to-[#070709] border-2 border-violet-500/60 shadow-2xl shadow-violet-500/10 hover:border-violet-400"
                    : "bg-[#0D0E12]/80 border border-[#1E202E] hover:border-slate-700/60 hover:bg-[#13141B]/40"
                }`}
              >
                {/* Badge Mais Popular */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-violet-600/30 flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 fill-current text-amber-300" />
                    Mais Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                      {pkg.name}
                    </h3>
                    {pkg.bonusCredits > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                        +{pkg.bonusCredits} BÔNUS
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-2 min-h-[36px] leading-relaxed">
                    {pkg.description || "Gerações em todos os motores criativos."}
                  </p>

                  {/* Preço e Créditos */}
                  <div className="mt-6 pt-6 border-t border-[#1E202E]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-black text-white">
                        {formatBRL(pkg.priceCents)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">pagamento único</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-xl bg-[#13141B] border border-[#1E202E] text-xs font-mono font-bold text-violet-300 flex items-center gap-1.5">
                        <Coins className="h-3.5 w-3.5 text-amber-400" />
                        {totalCredits.toLocaleString("pt-BR")} créditos
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ≈ R$ {unitCost}/crédito
                      </span>
                    </div>
                  </div>

                  {/* Lista de Recursos */}
                  <div className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>{totalCredits} imagens com FLUX Schnell</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>Até {Math.floor(totalCredits / 10)} vídeos cinemáticos Kling AI</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>Acesso total ao VORIXA FLOW Canvas</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>Fila prioritária com alta velocidade</span>
                    </div>
                  </div>
                </div>

                {/* Botão de Compra */}
                <div className="mt-8">
                  <button
                    onClick={() => handleOpenCheckout(pkg)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold transition-all shadow-lg duration-300 cursor-pointer ${
                      isPopular
                        ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-[1.02]"
                        : "bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-700/50 hover:scale-[1.02]"
                    }`}
                    style={{ minHeight: "44px" }}
                  >
                    <CreditCard className="h-4 w-4" />
                    Comprar {pkg.name}
                    <ArrowUpRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
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
