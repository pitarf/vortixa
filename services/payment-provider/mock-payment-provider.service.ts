import { PaymentProvider, PaymentCheckoutRequest, PaymentCheckoutResponse } from "./payment-provider.interface";

export class MockPaymentProvider implements PaymentProvider {
  private simulateFailure = false;

  constructor(simulateFailure = false) {
    this.simulateFailure = simulateFailure;
  }

  async createCheckoutSession(request: PaymentCheckoutRequest): Promise<PaymentCheckoutResponse> {
    if (this.simulateFailure) {
      throw new Error("Erro na conexão com o gateway de pagamentos.");
    }

    // Identificador único gerado de forma pseudo-aleatória simulando a resposta do provedor
    const gatewayTxId = `mock_tx_${request.orderId}_${Date.now()}`;
    
    // URL simulada de checkout
    const checkoutUrl = `https://checkout.mockgateway.com/pay/${gatewayTxId}`;

    return {
      gatewayTxId,
      checkoutUrl,
    };
  }

  async verifyWebhookSignature(rawBody: string, signature: string): Promise<boolean> {
    // Validação mockada simples de assinatura
    if (!signature || signature === "invalid_sig") {
      return false;
    }
    return true;
  }
}
