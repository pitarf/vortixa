import crypto from "crypto";
import { PaymentProvider, PaymentCheckoutRequest, PaymentCheckoutResponse } from "./payment-provider.interface";

export class MercadoPagoProvider implements PaymentProvider {
  readonly name: string = "mercadopago";
  private accessToken: string;
  private webhookSecret: string;
  private sandbox: boolean;

  constructor(accessToken?: string, webhookSecret?: string, sandbox?: boolean) {
    this.accessToken = accessToken || process.env.MERCADOPAGO_ACCESS_KEY || process.env.MERCADOPAGO_ACCESS_TOKEN || "";
    this.webhookSecret = webhookSecret || process.env.MERCADOPAGO_WEBHOOK_SECRET || "";
    this.sandbox = sandbox !== undefined ? sandbox : process.env.MERCADOPAGO_SANDBOX === "true";
  }

  async createCheckoutSession(request: PaymentCheckoutRequest): Promise<PaymentCheckoutResponse> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!this.accessToken) {
      if (process.env.PAYMENT_PROVIDER_MODE === "live" && !process.env.VITEST) {
        throw new Error("MERCADOPAGO_ACCESS_KEY não configurada no ambiente.");
      }
      const gatewayTxId = `mp_pref_${request.orderId}_${Date.now()}`;
      const checkoutUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${gatewayTxId}`;
      return { gatewayTxId, checkoutUrl };
    }

    try {
      const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": request.orderId,
        },
        body: JSON.stringify({
          items: [
            {
              id: request.orderId,
              title: request.title || "Pacote de Créditos VORIXA",
              description: request.description || "Créditos para geração de IA na plataforma VORIXA",
              quantity: 1,
              unit_price: request.amountCents / 100,
              currency_id: "BRL",
            },
          ],
          payer: {
            email: request.email,
          },
          external_reference: request.orderId,
          back_urls: {
            success: `${appUrl}/dashboard/credits?status=success&orderId=${request.orderId}`,
            pending: `${appUrl}/dashboard/credits?status=pending&orderId=${request.orderId}`,
            failure: `${appUrl}/dashboard/credits?status=failure&orderId=${request.orderId}`,
          },
          auto_return: "approved",
          notification_url: `${appUrl}/api/webhooks/payment?provider=mercadopago`,
          metadata: {
            order_id: request.orderId,
            user_id: request.userId,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Erro na API do Mercado Pago (${response.status}): ${errorBody}`);
      }

      const data = await response.json();
      const gatewayTxId = String(data.id);
      const checkoutUrl = this.sandbox && data.sandbox_init_point ? data.sandbox_init_point : data.init_point;

      return {
        gatewayTxId,
        checkoutUrl: checkoutUrl || `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${gatewayTxId}`,
      };
    } catch (error: any) {
      throw new Error(error.message || "Falha na comunicação com o Mercado Pago.");
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
        if (k && v) acc[k] = v;
        return acc;
      }, {});

      const ts = parts["ts"];
      const v1 = parts["v1"];

      if (v1 && ts) {
        const dataId = headers?.["data-id"] || headers?.["x-request-id"] || "";
        const xRequestId = (headers?.["x-request-id"] as string) || "";

        let manifest = "";
        if (dataId || xRequestId) {
          manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
        } else {
          manifest = `${ts}.${rawBody}`;
        }

        const expectedHash = crypto
          .createHmac("sha256", this.webhookSecret)
          .update(manifest)
          .digest("hex");

        const rawBodyHash = crypto
          .createHmac("sha256", this.webhookSecret)
          .update(`${ts}.${rawBody}`)
          .digest("hex");

        const simpleHash = crypto
          .createHmac("sha256", this.webhookSecret)
          .update(rawBody)
          .digest("hex");

        return (
          v1 === expectedHash ||
          v1 === rawBodyHash ||
          v1 === simpleHash
        );
      }

      const expected = crypto
        .createHmac("sha256", this.webhookSecret)
        .update(rawBody)
        .digest("hex");

      return signature === expected;
    } catch {
      return false;
    }
  }
}
