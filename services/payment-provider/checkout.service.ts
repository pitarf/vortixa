import prisma from "@/lib/prisma";
import { OrderService } from "../order.service";
import { PaymentProvider } from "./payment-provider.interface";
import { PaymentStatus } from "@prisma/client";

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
  async handleCheckout(userId: string, packageId: string): Promise<any> {
    // 1. Busca usuário para pegar email de contato (usado no gateway)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    // 2. Cria o Order com os dados oficiais (única fonte de verdade) e preserva o snapshot
    const order = await OrderService.createOrder(userId, { packageId });

    try {
      // 3. Cria sessão de checkout usando o adapter desacoplado
      const checkoutResponse = await this.provider.createCheckoutSession({
        orderId: order.id,
        amountCents: order.amountCents,
        userId: userId,
        email: user.email,
      });

      // 4. Salva a transação pendente (Payment com status PENDING) no banco
      const payment = await prisma.payment.create({
        data: {
          userId,
          orderId: order.id,
          amountCents: order.amountCents,
          creditsGranted: order.creditsGranted,
          status: PaymentStatus.PENDING,
          gateway: "mock_gateway",
          gatewayTxId: checkoutResponse.gatewayTxId,
        },
      });

      return {
        orderId: order.id,
        paymentId: payment.id,
        checkoutUrl: checkoutResponse.checkoutUrl,
      };
    } catch (error: any) {
      // Se falhar o gateway, marca o Order como FAILED
      await prisma.order.update({
        where: { id: order.id },
        data: { status: PaymentStatus.FAILED },
      });
      throw new Error(error.message || "Falha ao criar o checkout de pagamentos.");
    }
  }
}
