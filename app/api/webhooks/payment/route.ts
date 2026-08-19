import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentLedgerService } from "@/services/payment-ledger.service";
import { MockPaymentProvider } from "@/services/payment-provider/mock-payment-provider.service";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-vorexpay-signature") || "";
    
    // Obtém o payload completo como texto bruto para validar a assinatura com segurança
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

    const { eventId, paymentId, gatewayTxId, status, amountCents, creditsGranted } = payload;

    // 1. Validações preliminares obrigatórias de campos de borda
    if (!eventId || !paymentId || !gatewayTxId || !status) {
      return NextResponse.json({ error: "Parâmetros obrigatórios ausentes." }, { status: 400 });
    }

    // 2. Validação criptográfica de assinatura (Adapter do Provedor)
    const provider = new MockPaymentProvider();
    const isSignatureValid = await provider.verifyWebhookSignature(rawBody, signature);

    if (process.env.PAYMENT_PROVIDER_MODE === "live" && !isSignatureValid) {
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }

    // 3. Verifica se o Webhook já foi processado (Idempotência rígida a nível de banco)
    const existingWebhook = await prisma.paymentWebhook.findUnique({
      where: { gatewayEventId: eventId },
    });

    if (existingWebhook && existingWebhook.processed) {
      return NextResponse.json({ message: "Evento de pagamento já processado anteriormente." }, { status: 200 });
    }

    // Grava a intenção de webhook no banco se não existir
    if (!existingWebhook) {
      try {
        await prisma.paymentWebhook.create({
          data: {
            gateway: "vorexpay",
            gatewayEventId: eventId,
            payload: rawBody,
            processed: false,
          },
        });
      } catch (err: any) {
        // Se der erro de Unique Constraint (P2002), significa que outro processo simultâneo acabou de criar
        if (err.code === "P2002") {
          return NextResponse.json({ message: "Evento de pagamento em processamento ou já processado." }, { status: 200 });
        }
        throw err;
      }
    }

    // 4. Valida se o pagamento existe no banco de dados e pertence ao ambiente correto
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Pagamento não localizado." }, { status: 404 });
    }

    // 5. Trata o status do pagamento na máquina de estados
    if (status === "PAID") {
      // Confirmação segura e concessão atômica de créditos
      await PaymentLedgerService.confirmPayment(paymentId, gatewayTxId, eventId);
    } else if (status === "REFUNDED") {
      // Estorno seguro e dedução atômica do Ledger
      await PaymentLedgerService.refundPayment(paymentId);
    } else {
      return NextResponse.json({ message: "Evento recebido sem alteração de estado final." }, { status: 200 });
    }

    // Marca o webhook como processado de forma definitiva
    await prisma.paymentWebhook.update({
      where: { gatewayEventId: eventId },
      data: { processed: true },
    });

    return NextResponse.json({ message: "Webhook processado com sucesso." }, { status: 200 });
  } catch (err: any) {
    console.error("Erro no processamento do webhook de pagamentos:", err);
    // Erros genéricos de resposta para o cliente não exporem credenciais ou segredos
    return NextResponse.json({ error: "Erro interno no servidor de pagamentos." }, { status: 500 });
  }
}
