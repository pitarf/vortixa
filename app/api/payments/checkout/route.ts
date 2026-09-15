import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CheckoutService } from "@/services/payment-provider/checkout.service";
import { PaymentProviderFactory } from "@/services/payment-provider/payment-provider.factory";
import { isValidDocument, cleanDocument } from "@/lib/document-validator";

const VALID_PAYMENT_METHODS = ["pix", "credit_card", "all"] as const;
type PaymentMethod = (typeof VALID_PAYMENT_METHODS)[number];

export async function POST(req: Request) {
  try {
    // 1. Obter usuário autenticado via auth()
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Sessão inválida ou expirada. Faça login para continuar." },
        { status: 401 }
      );
    }

    // 2. Validar que o usuário não está bloqueado no banco
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, isBlocked: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { error: "Sua conta está suspensa. Entre em contato com o suporte." },
        { status: 403 }
      );
    }

    // 3. Ler e validar o corpo da requisição
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição JSON inválido." },
        { status: 400 }
      );
    }

    const {
      packageId,
      paymentMethod,
      provider: requestedProvider,
      cpf,
      cardNumber,
      cardHolderName,
      cardExpiryMonth,
      cardExpiryYear,
      cardCcv,
    } = body || {};

    if (!packageId || typeof packageId !== "string" || packageId.trim().length === 0) {
      return NextResponse.json(
        { error: "Identificador do pacote de créditos não informado ou inválido." },
        { status: 400 }
      );
    }

    // Validação opcional de paymentMethod ('pix' | 'credit_card' | 'all')
    let validatedPaymentMethod: PaymentMethod | undefined = undefined;
    if (paymentMethod !== undefined && paymentMethod !== null) {
      if (typeof paymentMethod !== "string" || !VALID_PAYMENT_METHODS.includes(paymentMethod as PaymentMethod)) {
        return NextResponse.json(
          { error: "Método de pagamento inválido. Valores aceitos: 'pix', 'credit_card' ou 'all'." },
          { status: 400 }
        );
      }
      validatedPaymentMethod = paymentMethod as PaymentMethod;
    }

    // Validação do Documento (CPF / CNPJ)
    const cleanDoc = typeof cpf === "string" ? cleanDocument(cpf) : undefined;
    if (cleanDoc && cleanDoc.length > 0) {
      const docValidation = isValidDocument(cleanDoc);
      if (!docValidation.isValid) {
        return NextResponse.json(
          { error: docValidation.error || "CPF ou CNPJ inválido." },
          { status: 400 }
        );
      }
    }

    // 4. Instancia o adaptador dinamicamente via PaymentProviderFactory
    const provider = PaymentProviderFactory.getProvider(
      typeof requestedProvider === "string" ? requestedProvider : undefined
    );

    // Vorexpay e Velana exigem estritamente CPF/CNPJ válido em modo de produção
    const isLiveVorexpay =
      provider.name === "vorexpay" &&
      process.env.PAYMENT_PROVIDER_MODE === "live" &&
      !process.env.VITEST;

    if (isLiveVorexpay && (!cleanDoc || cleanDoc.length === 0)) {
      return NextResponse.json(
        { error: "O CPF ou CNPJ do pagador é obrigatório para emissão de cobranças via Vorexpay." },
        { status: 400 }
      );
    }

    // Pagamento com Cartão de Crédito temporariamente suspenso
    if (validatedPaymentMethod === "credit_card") {
      return NextResponse.json(
        {
          error:
            "O pagamento via Cartão de Crédito está temporariamente em manutenção. Por favor, utilize a opção 'Pix Instantâneo' para aprovação e liberação imediata dos seus créditos.",
        },
        { status: 400 }
      );
    }

    const checkoutService = new CheckoutService(provider);

    // 5. Executa criação do checkout congelando valores do banco de dados (Snapshot seguro)
    const result = await checkoutService.handleCheckout(
      session.user.id,
      packageId.trim(),
      validatedPaymentMethod,
      cleanDoc,
      {
        cardNumber,
        cardHolderName,
        cardExpiryMonth,
        cardExpiryYear,
        cardCcv,
      }
    );

    // 6. Retorno padronizado em JSON com suporte a camelCase e snake_case
    return NextResponse.json({
      success: true,
      checkoutUrl: result.checkoutUrl,
      orderId: result.orderId,
      paymentId: result.paymentId,
      amountCents: result.amountCents,
      creditsGranted: result.creditsGranted,
      gateway: result.gateway,
      pixCode: result.pixCode,
      pixQrCode: result.pixQrCode,
      pix_copy_paste: result.pixCode,
      pix_qr_code: result.pixQrCode,
    });
  } catch (error: any) {
    console.error("Erro na rota de checkout:", error);
    return NextResponse.json(
      { error: error.message || "Falha ao iniciar processo de checkout." },
      { status: 400 }
    );
  }
}
