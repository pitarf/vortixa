import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";
import { VorexPayProvider } from "@/services/payment-provider/vorexpay.provider";
import { PaymentProviderFactory } from "@/services/payment-provider/payment-provider.factory";

describe("VorexPayProvider Unit & Integration Tests", () => {
  const mockApiKey = "sb_publishable_test_key";
  const mockSecretKey = "sk_live_test_secret_12345";
  const mockWebhookSecret = "whsec_test_vorex_secret";
  const mockApiUrl = "https://uayfvfryypcooochsxlc.supabase.co/functions/v1/api-gateway";

  beforeEach(() => {
    vi.restoreAllMocks();
    PaymentProviderFactory.reset();
  });

  it("deve inicializar com o nome 'vorexpay' e ser resolvido pela PaymentProviderFactory", () => {
    const provider = PaymentProviderFactory.getProvider("vorexpay");
    expect(provider).toBeInstanceOf(VorexPayProvider);
    expect(provider.name).toBe("vorexpay");
  });

  it("deve criar sessão de checkout em modo fallback quando secretKey for placeholder", async () => {
    const provider = new VorexPayProvider(mockApiKey, "sua-chave-api", mockWebhookSecret, mockApiUrl);
    const result = await provider.createCheckoutSession({
      orderId: "ord_test_001",
      amountCents: 5000,
      userId: "user_123",
      email: "cliente@vorixa.ai",
      title: "VORIXA - Pacote Starter",
      paymentMethod: "pix",
    });

    expect(result.gatewayTxId).toContain("vorex_tx_ord_test_001");
    expect(result.checkoutUrl).toContain("ord_test_001");
    expect(result.pixCode).toBeDefined();
    expect(result.pixCode).toContain("br.gov.bcb.pix");
  });

  it("deve chamar a API da Vorexpay (POST /payments) com headers e payload esperados em live/mocked", async () => {
    const provider = new VorexPayProvider(mockApiKey, mockSecretKey, mockWebhookSecret, mockApiUrl);

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        id: "vorex_pay_abc123",
        amount: 100.0,
        status: "pending",
        payment_method: "pix",
        pix_copy_paste: "00020126...pix_code...",
        pix_qr_code: "data:image/png;base64,mockqr",
        fee_amount: 2.5,
        net_amount: 97.5,
      }),
    });
    global.fetch = mockFetch;

    const result = await provider.createCheckoutSession({
      orderId: "ord_live_999",
      amountCents: 10000,
      userId: "usr_456",
      email: "pagador@teste.com",
      title: "VORIXA Pro",
      paymentMethod: "pix",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${mockApiUrl}/payments`,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          apikey: mockApiKey,
          "X-API-Secret-Key": mockSecretKey,
          "Content-Type": "application/json",
          "Idempotency-Key": "ord_live_999",
        }),
      })
    );

    const sentBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(sentBody.amount_in_cents).toBe(10000);
    expect(sentBody.payment_method).toBe("pix");
    expect(sentBody.customer_email).toBe("pagador@teste.com");

    expect(result.gatewayTxId).toBe("vorex_pay_abc123");
    expect(result.pixCode).toBe("00020126...pix_code...");
    expect(result.pixQrCode).toBe("data:image/png;base64,mockqr");
  });

  it("deve validar assinatura HMAC SHA-256 válida gerada com VOREXPAY_WEBHOOK_SECRET", async () => {
    const provider = new VorexPayProvider(mockApiKey, mockSecretKey, mockWebhookSecret, mockApiUrl);

    const rawBody = JSON.stringify({
      event: "PAYMENT_CONFIRMED",
      id: "pay_xyz789",
      status: "paid",
      amount: 100.0,
    });

    const validSignature = crypto
      .createHmac("sha256", mockWebhookSecret)
      .update(rawBody)
      .digest("hex");

    const isValid = await provider.verifyWebhookSignature(rawBody, validSignature, {
      "x-webhook-signature": validSignature,
    });

    expect(isValid).toBe(true);
  });

  it("deve rejeitar assinatura forjada ou payload adulterado", async () => {
    const provider = new VorexPayProvider(mockApiKey, mockSecretKey, mockWebhookSecret, mockApiUrl);

    const rawBody = JSON.stringify({
      event: "PAYMENT_CONFIRMED",
      id: "pay_xyz789",
      status: "paid",
    });

    const forgedSignature = "0000000000000000000000000000000000000000000000000000000000000000";

    const isValid = await provider.verifyWebhookSignature(rawBody, forgedSignature, {
      "x-webhook-signature": forgedSignature,
    });

    expect(isValid).toBe(false);

    // Payload adulterado com assinatura do body original
    const tamperedBody = JSON.stringify({
      event: "PAYMENT_CONFIRMED",
      id: "pay_xyz789",
      status: "paid",
      amount: 999999, // adulteração
    });

    const isTamperedValid = await provider.verifyWebhookSignature(tamperedBody, forgedSignature);
    expect(isTamperedValid).toBe(false);
  });

  it("deve consultar detalhes do pagamento via GET /payments/:id", async () => {
    const provider = new VorexPayProvider(mockApiKey, mockSecretKey, mockWebhookSecret, mockApiUrl);

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: "pay_xyz789",
        status: "paid",
        external_id: "ord_123",
        amount: 100.0,
        customer_email: "cliente@teste.com",
      }),
    });
    global.fetch = mockFetch;

    const details = await provider.getPaymentDetails("pay_xyz789");

    expect(mockFetch).toHaveBeenCalledWith(
      `${mockApiUrl}/payments/pay_xyz789`,
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          apikey: mockApiKey,
          "X-API-Secret-Key": mockSecretKey,
        }),
      })
    );

    expect(details).toEqual(
      expect.objectContaining({
        id: "pay_xyz789",
        status: "paid",
        externalReference: "ord_123",
        transactionAmount: 100.0,
        payerEmail: "cliente@teste.com",
      })
    );
  });
});
