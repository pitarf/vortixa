import prisma from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export interface CreateOrderInput {
  packageId: string;
}

export class OrderService {
  /**
   * Cria um novo pedido congelando os valores comerciais atuais do catálogo.
   * Utiliza apenas o packageId enviado pelo usuário, buscando as regras comerciais no banco.
   * Evita mass assignment limpando qualquer outro campo no payload de entrada.
   */
  static async createOrder(userId: string, input: CreateOrderInput): Promise<any> {
    const { packageId } = input;

    // 1. Busca pacote comercial seguro direto do backend (única fonte de verdade)
    const creditPackage = await prisma.creditPackage.findUnique({
      where: { id: packageId },
    });

    if (!creditPackage) {
      throw new Error("Pacote de créditos não encontrado.");
    }

    if (!creditPackage.status) {
      throw new Error("Este pacote está temporariamente desativado.");
    }

    // 2. Criação do Order com congelamento de valores (Snapshot)
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          packageId: creditPackage.id,
          amountCents: creditPackage.priceCents,
          creditsGranted: creditPackage.credits + creditPackage.bonusCredits,
          status: PaymentStatus.PENDING,
        },
      });

      return order;
    });
  }

  /**
   * Retorna estatísticas financeiras consolidadas para fins de auditoria administrativa.
   * Separa rigidamente créditos vendidos, consumidos, custo de IA e margem da plataforma.
   */
  static async getFinancialStats(): Promise<any> {
    const payments = await prisma.payment.findMany({
      where: { status: "PAID" },
      select: { amountCents: true, creditsGranted: true },
    });

    const totalRevenueCents = payments.reduce((acc, p) => acc + p.amountCents, 0);
    const totalCreditsSold = payments.reduce((acc, p) => acc + p.creditsGranted, 0);

    // Soma do custo estimado de todas as execuções de IA concluídas
    const aiJobs = await prisma.aIJob.findMany({
      where: { status: "COMPLETED" },
      select: { providerCostUsd: true, creditCost: true },
    });

    // Custo estimado do provedor de IA convertido de USD para centavos fictícios (ex: R$ 5,50 por dólar fixado para fins de margem)
    const USD_TO_BRL_CENT_PARITY = 550; // R$ 5,50 em centavos
    const totalEstimatedProviderCostCents = Math.round(
      aiJobs.reduce((acc, j) => acc + (j.providerCostUsd || 0), 0) * USD_TO_BRL_CENT_PARITY
    );

    const totalCreditsConsumed = aiJobs.reduce((acc, j) => acc + (j.creditCost || 0), 0);

    // Margem calculada: Receita - Custo Estimado
    const estimatedMarginCents = totalRevenueCents - totalEstimatedProviderCostCents;

    return {
      totalRevenueCents,
      totalCreditsSold,
      totalCreditsConsumed,
      totalEstimatedProviderCostCents,
      estimatedMarginCents,
    };
  }
}
