import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CheckoutService } from "@/services/payment-provider/checkout.service";
import { MockPaymentProvider } from "@/services/payment-provider/mock-payment-provider.service";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Sessão inválida ou expirada. Faça login para continuar." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { packageId } = body;

    if (!packageId || typeof packageId !== "string") {
      return NextResponse.json(
        { error: "Identificador do pacote de créditos não informado." },
        { status: 400 }
      );
    }

    // Instancia o adaptador de pagamentos seguro
    const provider = new MockPaymentProvider();
    const checkoutService = new CheckoutService(provider);

    // Executa criação do checkout congelando valores do banco de dados (Snapshot seguro)
    const result = await checkoutService.handleCheckout(session.user.id, packageId);

    return NextResponse.json({
      success: true,
      checkoutUrl: result.checkoutUrl,
      orderId: result.orderId,
      paymentId: result.paymentId,
    });
  } catch (error: any) {
    console.error("Erro na rota de checkout:", error);
    return NextResponse.json(
      { error: error.message || "Falha ao iniciar processo de checkout." },
      { status: 400 }
    );
  }
}
