import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentLedgerService } from "@/services/payment-ledger.service";
import { PaymentProviderFactory } from "@/services/payment-provider/payment-provider.factory";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const queryProvider = url.searchParams.get("provider") || undefined;

    const stripeSig = req.headers.get("stripe-signature");
    const mpSig = req.headers.get("x-signature");
    const vorexSig = req.headers.get("x-vorexpay-signature");
    const genericSig = req.headers.get("signature");

    const signature = stripeSig || mpSig || vorexSig || genericSig || "";

    const headersMap: Record<string, string | string[] | undefined> = {
      "x-signature": mpSig || undefined,
      "stripe-signature": stripeSig || undefined,
      "x-vorexpay-signature": vorexSig || undefined,
      "x-request-id": req.headers.get("x-request-id") || undefined,
      "data-id": url.searchParams.get("data.id") || undefined,
    };

    const rawBody = await req.text();
    if (!rawBody) {
      return NextResponse.json({ error: "Payload vazio." }, { status: 400 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
    }

    let providerName = queryProvider;
    if (!providerName) {
      if (stripeSig || payload?.type?.startsWith("checkout.session.") || payload?.type?.startsWith("charge.")) {
        providerName = "stripe";
      } else if (mpSig || payload?.action?.startsWith("payment.") || payload?.type === "payment") {
        providerName = "mercadopago";
      } else if (vorexSig || payload?.gateway === "vorexpay") {
        providerName = "mock_gateway";
      }
    }

    const provider = PaymentProviderFactory.getProvider(providerName);

    let eventId = payload.eventId || payload.id;
    let paymentId = payload.paymentId;
    let gatewayTxId = payload.gatewayTxId;
    let rawStatus = payload.status;
    let normalizedStatus: "PAID" | "REFUNDED" | "PENDING" | "FAILED" | string = "";

    // Normalização Stripe
    if (payload.type) {
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

    // Normalização Mercado Pago
    if (payload.action || payload.type === "payment") {
      eventId = String(payload.id || payload.data?.id || `mp_evt_${Date.now()}`);
      const mpDataId = String(payload.data?.id || payload.id || "");
      gatewayTxId = mpDataId || gatewayTxId;

      if (payload.action === "payment.created" || payload.action === "payment.updated") {
        if (payload.data?.status === "approved") {
          normalizedStatus = "PAID";
        } else if (payload.data?.status === "refunded") {
          normalizedStatus = "REFUNDED";
        } else if (payload.data?.status === "rejected") {
          normalizedStatus = "FAILED";
        } else {
          normalizedStatus = payload.status || "PAID";
        }
      }

      if (!paymentId && gatewayTxId) {
        const paymentRecord = await prisma.payment.findFirst({
          where: {
            OR: [
              { gatewayTxId },
              { orderId: payload.external_reference || payload.data?.external_reference },
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
