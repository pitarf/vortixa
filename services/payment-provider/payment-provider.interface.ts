export interface PaymentCheckoutRequest {
  orderId: string;
  amountCents: number;
  userId: string;
  email: string;
  title?: string;
  description?: string;
}

export interface PaymentCheckoutResponse {
  gatewayTxId: string;
  checkoutUrl: string;
}

export interface PaymentProvider {
  readonly name: string;

  /**
   * Cria uma sessão ou link de checkout no provedor externo.
   */
  createCheckoutSession(request: PaymentCheckoutRequest): Promise<PaymentCheckoutResponse>;

  /**
   * Valida e decodifica a assinatura de um webhook recebido do gateway.
   */
  verifyWebhookSignature(
    rawBody: string,
    signature: string,
    headers?: Record<string, string | string[] | undefined>
  ): Promise<boolean>;
}
