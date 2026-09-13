import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentLedgerService } from "@/services/payment-ledger.service";
import { PaymentProviderFactory } from "@/services/payment-provider/payment-provider.factory";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const queryProvider = url.searchParams.get("provider") || undefined;
    const queryDataId = url.searchParams.get("data.id") || url.searchParams.get("id") || undefined;
    const queryTopic = url.searchParams.get("type") || url.searchParams.get("topic") || undefined;

    const stripeSig = req.headers.get("stripe-signature");
    const mpSig = req.headers.get("x-signature");
    const vorexSig = req.headers.get("x-vorexpay-signature") || req.headers.get("x-webhook-signature");
    const genericSig = req.headers.get("signature");

    const signature = stripeSig || mpSig || vorexSig || genericSig || "";

    const headersMap: Record<string, string | string[] | undefined> = {
      "x-signature": mpSig || undefined,
      "stripe-signature": stripeSig || undefined,
      "x-vorexpay-signature": vorexSig || undefined,
      "x-webhook-signature": req.headers.get("x-webhook-signature") || undefined,
      "x-request-id": req.headers.get("x-request-id") || undefined,
      "data-id": queryDataId,
    };

    let rawBody = await req.text();
    let payload: any = {};

    if (rawBody && rawBody.trim().length > 0) {
      try {
        payload = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
      }
    } else if (queryDataId) {
      // Suporte a IPN/Notificação via query params do Mercado Pago quando o body vem vazio
      payload = {
        action: "payment.updated",
        data: { id: queryDataId },
        type: queryTopic || "payment",
      };
      rawBody = JSON.stringify(payload);
    } else {
      return NextResponse.json({ error: "Payload vazio." }, { status: 400 });
    }

    let providerName = queryProvider;
    if (!providerName) {
      if (stripeSig || payload?.type?.startsWith("checkout.session.") || payload?.type?.startsWith("charge.")) {
        providerName = "stripe";
      } else if (mpSig || payload?.action?.startsWith("payment.") || payload?.type === "payment" || queryDataId) {
        providerName = "mercadopago";
      } else if (vorexSig || payload?.gateway === "vorexpay" || payload?.event?.startsWith("PAYMENT_") || payload?.event?.startsWith("TRANSFER_")) {
        providerName = "vorexpay";
      }
    }

    const provider = PaymentProviderFactory.getProvider(providerName);

    let eventId = payload.eventId || payload.id;
    let paymentId = payload.paymentId;
    let gatewayTxId = payload.gatewayTxId;
    let rawStatus = payload.status;
    let normalizedStatus: "PAID" | "REFUNDED" | "PENDING" | "FAILED" | string = "";

    // Normalização Stripe
    if (payload.type && (payload.type.startsWith("checkout.session.") || payload.type.startsWith("charge.") || payload.type.startsWith("payment_intent."))) {
      eventId = payload.id;
      const stripeObj = payload.data?.object || {};
      gatewayTxId = stripeObj.id || gatewayTxId;
      paymentId = stripeObj.metadata?.paymentId || paymentId;
      const orderId = stripeObj.client_reference_id || stripeObj.metadata?.orderId;

      if (payload.type === "checkout.session.completed" || payload.type === "payment_intent.succeeded") {
        normalizedStatus = "PAID";
      } else if (payload.type === "charge.refunded") {
        normalizedStatus = "REFUNDED";
      } else if (payload.type === "payment_intent.payment_failed") {
        normalizedStatus = "FAILED";
      }

      if (!paymentId && (gatewayTxId || orderId)) {
        const paymentRecord = await prisma.payment.findFirst({
          where: {
            OR: [
              gatewayTxId ? { gatewayTxId } : {},
              orderId ? { orderId } : {},
            ],
          },
        });
        if (paymentRecord) {
          paymentId = paymentRecord.id;
          gatewayTxId = paymentRecord.gatewayTxId;
        }
      }
    }

    // Normalização Mercado Pago (Webhook e IPN)
    if (payload.action || payload.type === "payment" || queryDataId || providerName === "mercadopago") {
      const mpDataId = String(payload.data?.id || payload.id || queryDataId || "");
      eventId = String(payload.id || payload.data?.id || queryDataId || `mp_evt_${Date.now()}`);

      // 1. Status pré-definido no payload (ex: mocks e testes unitários)
      if (payload.data?.status === "approved" || payload.status === "approved" || payload.status === "PAID") {
        normalizedStatus = "PAID";
      } else if (payload.data?.status === "refunded" || payload.status === "refunded" || payload.status === "REFUNDED") {
        normalizedStatus = "REFUNDED";
      } else if (payload.data?.status === "rejected" || payload.data?.status === "cancelled" || payload.status === "FAILED") {
        normalizedStatus = "FAILED";
      } else if (payload.data?.status === "pending" || payload.data?.status === "in_process" || payload.status === "PENDING") {
        normalizedStatus = "PENDING";
      }

      let externalRef = payload.external_reference || payload.data?.external_reference;

      // 2. Se o status ou external_reference não estiverem presentes no payload, consulta a API do Mercado Pago
      if ((!normalizedStatus || !externalRef) && mpDataId && typeof provider.getPaymentDetails === "function") {
        const mpDetails = await provider.getPaymentDetails(mpDataId);
        if (mpDetails) {
          if (!normalizedStatus) {
            if (mpDetails.status === "approved") {
              normalizedStatus = "PAID";
            } else if (mpDetails.status === "refunded") {
              normalizedStatus = "REFUNDED";
            } else if (mpDetails.status === "rejected" || mpDetails.status === "cancelled") {
              normalizedStatus = "FAILED";
            } else if (mpDetails.status === "pending" || mpDetails.status === "in_process") {
              normalizedStatus = "PENDING";
            }
          }
          if (!externalRef && mpDetails.externalReference) {
            externalRef = mpDetails.externalReference;
          }
        }
      }

      // Se ainda não definiu status mas a ação é de pagamento, padrão para status fornecido ou PENDING
      if (!normalizedStatus && payload.action?.startsWith("payment.")) {
        normalizedStatus = payload.status || "PENDING";
      }

      // Localiza o Payment no banco pelo external_reference (orderId) ou mpDataId (gatewayTxId)
      if (!paymentId) {
        const paymentRecord = await prisma.payment.findFirst({
          where: {
            OR: [
              ...(externalRef ? [{ orderId: externalRef }] : []),
              ...(mpDataId ? [{ gatewayTxId: mpDataId }] : []),
              ...(gatewayTxId ? [{ gatewayTxId }] : []),
            ],
          },
        });
        if (paymentRecord) {
          paymentId = paymentRecord.id;
          gatewayTxId = paymentRecord.gatewayTxId;
        }
      }
    }

    // Normalização Vorexpay (eventos PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_APPROVED, etc.)
    if (providerName === "vorexpay" || vorexSig || payload?.event?.startsWith("PAYMENT_") || payload?.gateway === "vorexpay") {
      eventId = String(payload.eventId || payload.id || `vorex_evt_${Date.now()}`);
      const vorexTxId = String(payload.id || payload.gatewayTxId || payload.external_id || "");

      if (
        payload.event === "PAYMENT_CONFIRMED" ||
        payload.event === "PAYMENT_RECEIVED" ||
        payload.event === "PAYMENT_APPROVED" ||
        payload.status === "paid" ||
        payload.status === "PAID"
      ) {
        normalizedStatus = "PAID";
      } else if (
        payload.event === "PAYMENT_REFUNDED" ||
        payload.status === "refunded" ||
        payload.status === "REFUNDED"
      ) {
        normalizedStatus = "REFUNDED";
      } else if (
        payload.event === "PAYMENT_FAILED" ||
        payload.status === "failed" ||
        payload.status === "FAILED"
      ) {
        normalizedStatus = "FAILED";
      }

      if (!paymentId) {
        const paymentRecord = await prisma.payment.findFirst({
          where: {
            OR: [
              ...(vorexTxId ? [{ gatewayTxId: vorexTxId }] : []),
              ...(payload.external_id ? [{ orderId: payload.external_id }] : []),
              ...(payload.client_reference ? [{ orderId: payload.client_reference }] : []),
              ...(gatewayTxId ? [{ gatewayTxId }] : []),
            ],
          },
        });
        if (paymentRecord) {
          paymentId = paymentRecord.id;
          gatewayTxId = paymentRecord.gatewayTxId;
        }
      }
    }

    if (!normalizedStatus && rawStatus) {
      normalizedStatus = rawStatus;
    }

    if (!eventId || (!paymentId && !gatewayTxId) || !normalizedStatus) {
      return NextResponse.json({ error: "Parâmetros obrigatórios ausentes." }, { status: 400 });
    }

    const isSignatureValid = await provider.verifyWebhookSignature(rawBody, signature, headersMap);

    if (process.env.PAYMENT_PROVIDER_MODE === "live" && !isSignatureValid) {
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }

    // Validação de idempotência rigorosa com PaymentWebhook
    const existingWebhook = await prisma.paymentWebhook.findUnique({
      where: { gatewayEventId: eventId },
    });

    if (existingWebhook && existingWebhook.processed) {
      return NextResponse.json({ message: "Evento de pagamento já processado anteriormente." }, { status: 200 });
    }

    if (!existingWebhook) {
      try {
        await prisma.paymentWebhook.create({
          data: {
            gateway: provider.name || "vorexpay",
            gatewayEventId: eventId,
            payload: rawBody,
            processed: false,
          },
        });
      } catch (err: any) {
        if (err.code === "P2002") {
          return NextResponse.json({ message: "Evento de pagamento em processamento ou já processado." }, { status: 200 });
        }
        throw err;
      }
    }

    let payment = null;
    if (paymentId) {
      payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });
    } else if (gatewayTxId) {
      payment = await prisma.payment.findUnique({
        where: { gatewayTxId },
      });
      if (payment) {
        paymentId = payment.id;
      }
    }

    if (!payment) {
      return NextResponse.json({ error: "Pagamento não localizado." }, { status: 404 });
    }

    // Processamento transacional via PaymentLedgerService
    if (normalizedStatus === "PAID") {
      await PaymentLedgerService.confirmPayment(payment.id, gatewayTxId || payment.gatewayTxId, eventId);
    } else if (normalizedStatus === "REFUNDED") {
      await PaymentLedgerService.refundPayment(payment.id);
    } else if (normalizedStatus === "PENDING" || normalizedStatus === "FAILED") {
      return NextResponse.json({ message: "Status ignorado de forma idempotente." }, { status: 200 });
    } else {
      return NextResponse.json({ error: `Status de pagamento inválido ou não suportado: ${normalizedStatus}` }, { status: 400 });
    }

    await prisma.paymentWebhook.update({
      where: { gatewayEventId: eventId },
      data: { processed: true },
    });

    return NextResponse.json({ message: "Webhook processado com sucesso." }, { status: 200 });
  } catch (err: any) {
    console.error("Erro no processamento do webhook de pagamentos:", err);
    if (err.message && err.message.includes("Mismatched gatewayTxId")) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno no servidor de pagamentos." }, { status: 500 });
  }
}
