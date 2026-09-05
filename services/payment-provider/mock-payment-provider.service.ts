import { PaymentProvider, PaymentCheckoutRequest, PaymentCheckoutResponse } from "./payment-provider.interface";

export class MockPaymentProvider implements PaymentProvider {
  readonly name: string = "mock_gateway";
  private shouldFail: boolean;

  constructor(shouldFail: boolean = false) {
    this.shouldFail = shouldFail;
  }

  async createCheckoutSession(request: PaymentCheckoutRequest): Promise<PaymentCheckoutResponse> {
    if (this.shouldFail) {
      throw new Error("Erro na conexão com o gateway de pagamentos.");
    }

    const gatewayTxId = `mock_tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const checkoutUrl = `https://checkout.mockgateway.com/pay/${gatewayTxId}`;

    return {
      gatewayTxId,
      checkoutUrl,
    };
  }

  async verifyWebhookSignature(
    rawBody: string,
    signature: string,
    headers?: Record<string, string | string[] | undefined>
  ): Promise<boolean> {
    // Para o mock provider, consideramos válida qualquer assinatura não vazia diferente de "invalid_sig"
    if (!signature || signature === "invalid_sig") {
      return false;
    }
    return true;
  }
}
