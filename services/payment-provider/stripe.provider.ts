import crypto from "crypto";
import { PaymentProvider, PaymentCheckoutRequest, PaymentCheckoutResponse } from "./payment-provider.interface";

export class StripeProvider implements PaymentProvider {
  readonly name: string = "stripe";
  private secretKey: string;
  private webhookSecret: string;

  constructor(secretKey?: string, webhookSecret?: string) {
    this.secretKey = secretKey || process.env.STRIPE_SECRET_KEY || "";
    this.webhookSecret = webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || "";
  }

  async createCheckoutSession(request: PaymentCheckoutRequest): Promise<PaymentCheckoutResponse> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!this.secretKey) {
      if (process.env.PAYMENT_PROVIDER_MODE === "live" && !process.env.VITEST) {
        throw new Error("STRIPE_SECRET_KEY não configurada no ambiente.");
      }
      const gatewayTxId = `cs_test_${request.orderId}_${Date.now()}`;
      const checkoutUrl = `https://checkout.stripe.com/c/pay/${gatewayTxId}`;
      return { gatewayTxId, checkoutUrl };
    }

    try {
      const params = new URLSearchParams();
      params.append("payment_method_types[0]", "card");
      params.append("mode", "payment");
      params.append("customer_email", request.email);
      params.append("client_reference_id", request.orderId);
      params.append("metadata[orderId]", request.orderId);
      params.append("metadata[userId]", request.userId);
      params.append("line_items[0][price_data][currency]", "brl");
      params.append("line_items[0][price_data][product_data][name]", request.title || "Pacote de Créditos VORIXA");
      if (request.description) {
        params.append("line_items[0][price_data][product_data][description]", request.description);
      }
      params.append("line_items[0][price_data][unit_amount]", String(request.amountCents));
      params.append("line_items[0][quantity]", "1");
      params.append("success_url", `${appUrl}/dashboard/credits?status=success&session_id={CHECKOUT_SESSION_ID}&orderId=${request.orderId}`);
      params.append("cancel_url", `${appUrl}/dashboard/credits?status=cancelled&orderId=${request.orderId}`);

      const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Idempotency-Key": request.orderId,
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Erro na API do Stripe (${response.status}): ${errorBody}`);
      }

      const session = await response.json();
      return {
        gatewayTxId: session.id,
        checkoutUrl: session.url || `https://checkout.stripe.com/c/pay/${session.id}`,
      };
    } catch (error: any) {
      throw new Error(error.message || "Falha na comunicação com o Stripe.");
    }
  }

  async verifyWebhookSignature(
    rawBody: string,
    signature: string,
    headers?: Record<string, string | string[] | undefined>
  ): Promise<boolean> {
    if (!signature || signature === "invalid_sig") {
      return false;
    }

    if (!this.webhookSecret) {
      if (process.env.PAYMENT_PROVIDER_MODE !== "live") {
        return true;
      }
      return false;
    }

    try {
      const parts = signature.split(",").reduce((acc: Record<string, string>, part) => {
        const [k, v] = part.trim().split("=");
        if (k && v) {
          if (!acc[k]) acc[k] = v;
        }
        return acc;
      }, {});

      const timestamp = parts["t"];
      const v1 = parts["v1"];

      if (!timestamp || !v1) {
        const expected = crypto
          .createHmac("sha256", this.webhookSecret)
          .update(rawBody)
          .digest("hex");

        return signature === expected;
      }

      const signedPayload = `${timestamp}.${rawBody}`;
      const expectedSignature = crypto
        .createHmac("sha256", this.webhookSecret)
        .update(signedPayload)
        .digest("hex");

      const expectedBuffer = Buffer.from(expectedSignature, "utf8");
      const signatureBuffer = Buffer.from(v1, "utf8");

      if (expectedBuffer.length !== signatureBuffer.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
    } catch {
      return false;
    }
  }
}
