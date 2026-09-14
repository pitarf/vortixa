export interface PaymentCheckoutRequest {
  orderId: string;
  amountCents: number;
  userId: string;
  email: string;
  name?: string;
  cpf?: string;
  title?: string;
  description?: string;
  paymentMethod?: "pix" | "credit_card" | "all" | string;
  cardHolderName?: string;
  cardNumber?: string;
  cardExpiryMonth?: string;
  cardExpiryYear?: string;
  cardCcv?: string;
}

export interface PaymentCheckoutResponse {
  gatewayTxId: string;
  checkoutUrl: string;
  pixCode?: string;
  pixQrCode?: string;
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
