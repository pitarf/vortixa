export interface PaymentCheckoutRequest {
  orderId: string;
  amountCents: number;
  userId: string;
  email: string;
  title?: string;
  description?: string;
  paymentMethod?: "pix" | "credit_card" | "all" | string;
}

export interface PaymentCheckoutResponse {
  gatewayTxId: string;
  checkoutUrl: string;
}

export interface PaymentDetailsResponse {
  id: string;
  status: string;
  externalReference?: string;
  statusDetail?: string;
  transactionAmount?: number;
  payerEmail?: string;
  raw?: any;
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

  /**
   * Consulta os detalhes de um pagamento no gateway externo (opcional).
   */
  getPaymentDetails?(paymentId: string | number): Promise<PaymentDetailsResponse | null>;
}
