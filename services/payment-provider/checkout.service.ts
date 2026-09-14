import prisma from "@/lib/prisma";
import { OrderService } from "../order.service";
import { PaymentProvider } from "./payment-provider.interface";
import { PaymentStatus } from "@prisma/client";

export interface CheckoutResult {
  orderId: string;
  paymentId: string;
  checkoutUrl: string;
  amountCents: number;
  creditsGranted: number;
  gateway: string;
  pixCode?: string;
  pixQrCode?: string;
}

export class CheckoutService {
  private provider: PaymentProvider;

  constructor(provider: PaymentProvider) {
    this.provider = provider;
  }

  /**
   * Cria um Checkout de forma estrita e segura.
   * Não confia em nenhum parâmetro de preço ou créditos enviados pelo cliente.
   * Valida sessão segura e vincula o usuário correspondente de forma atômica.
   */
  async handleCheckout(
    userId: string,
    packageId: string,
    paymentMethod?: "pix" | "credit_card" | "all" | string,
    cpf?: string
  ): Promise<CheckoutResult> {
    // 1. Busca usuário para pegar email de contato e nome (usados no gateway)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, isBlocked: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    if (user.isBlocked) {
      throw new Error("Sua conta está suspensa. Entre em contato com o suporte.");
    }

    // 2. Cria o Order com os dados oficiais (única fonte de verdade) e preserva o snapshot
    const order = await OrderService.createOrder(userId, { packageId });

    // Busca detalhes do pacote para enviar título descritivo ao gateway
    const pkg = await prisma.creditPackage.findUnique({
      where: { id: packageId },
      select: { name: true, description: true },
    });

    try {
      // 3. Cria sessão de checkout usando o adapter desacoplado
      const checkoutResponse = await this.provider.createCheckoutSession({
        orderId: order.id,
        amountCents: order.amountCents,
        userId: userId,
        email: user.email,
        name: user.name || "Cliente VORIXA",
        cpf: cpf,
        title: pkg ? `VORIXA - Pacote ${pkg.name}` : "Pacote de Créditos VORIXA",
        description: pkg?.description || "Créditos para geração de IA na plataforma VORIXA",
        paymentMethod,
      });

      // 4. Salva a transação pendente (Payment com status PENDING) no banco
      const payment = await prisma.payment.create({
        data: {
          userId,
          orderId: order.id,
          amountCents: order.amountCents,
          creditsGranted: order.creditsGranted,
          status: PaymentStatus.PENDING,
          gateway: this.provider.name || "mock_gateway",
          gatewayTxId: checkoutResponse.gatewayTxId,
        },
      });

      return {
        orderId: order.id,
        paymentId: payment.id,
        checkoutUrl: checkoutResponse.checkoutUrl,
        amountCents: payment.amountCents,
        creditsGranted: payment.creditsGranted,
        gateway: payment.gateway,
        pixCode: checkoutResponse.pixCode,
        pixQrCode: checkoutResponse.pixQrCode,
      };
    } catch (error: any) {
      // Se falhar o gateway, marca o Order como FAILED
      await prisma.order.update({
        where: { id: order.id },
        data: { status: PaymentStatus.FAILED },
      });
      throw new Error(error.message || "Erro na conexão com o gateway de pagamentos.");
    }
  }
}
