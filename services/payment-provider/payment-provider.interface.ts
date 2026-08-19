export interface PaymentCheckoutRequest {
  orderId: string;
  amountCents: number;
  userId: string;
  email: string;
}

export interface PaymentCheckoutResponse {
  gatewayTxId: string;
  checkoutUrl: string;
}

export interface PaymentProvider {
  /**
   * Cria uma sessão ou link de checkout no provedor externo.
   */
  createCheckoutSession(request: PaymentCheckoutRequest): Promise<PaymentCheckoutResponse>;

  /**
   * Valida e decodifica a assinatura de um webhook recebido do gateway.
   */
  verifyWebhookSignature(rawBody: string, signature: string): Promise<boolean>;
}
