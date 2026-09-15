import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreditService } from "@/services/credit.service";
import { FALLBACK_MARKETPLACE_MODELS } from "@/lib/marketplace-models";

/**
 * POST /api/models/purchase-prompt
 * Desbloqueia e adquire o Master Prompt de um modelo da Vitrine.
 * 
 * Regras de Negócio e Segurança:
 * 1. Autoridade do Servidor: Preço resolvido exclusivamente pelo backend via DB/Fallback.
 * 2. Sessão Segura: Autenticação via auth() do NextAuth.
 * 3. Atomicidade: Débito concorrente via CreditService.deduct() com bloqueio pessimista (FOR UPDATE).
 * 4. Bypass Legítimo: Usuários ADMIN ou isUnlimited === true recebem acesso gratuito imediato.
 */
export async function POST(req: Request) {
  try {
    // 1. Validar autenticação segura da sessão do servidor
    const session = await auth();
    if (!session || !session.user || (!session.user.id && !session.user.email)) {
      return NextResponse.json(
        { error: "Sessão expirada ou não autenticada. Faça login para continuar." },
        { status: 401 }
      );
    }

    // 2. Validar payload de entrada
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição inválido. Esperado formato JSON." },
        { status: 400 }
      );
    }

    const { modelId } = body || {};
    if (!modelId || typeof modelId !== "string" || !modelId.trim()) {
      return NextResponse.json(
        { error: "O parâmetro modelId é obrigatório." },
        { status: 400 }
      );
    }

    const trimmedModelId = modelId.trim();

    // 3. Resolver modelo pelo banco de dados ou pelo catálogo local
    let model: any = null;
    try {
      model = await prisma.marketplaceModel.findFirst({
        where: {
          OR: [{ id: trimmedModelId }, { slug: trimmedModelId }],
          status: true,
        },
      });
    } catch (dbErr) {
      console.warn("Aviso: Consulta ao banco Prisma falhou, recorrendo ao catálogo local:", dbErr);
    }

    if (!model) {
      model = FALLBACK_MARKETPLACE_MODELS.find(
        (m) => (m.id === trimmedModelId || m.slug === trimmedModelId) && m.status !== false
      );
    }

    if (!model || !model.promptTrigger) {
      return NextResponse.json(
        { error: "Modelo não encontrado ou sem Master Prompt cadastrado para comercialização." },
        { status: 404 }
      );
    }

    // 4. Determinar preço com autoridade do servidor
    const promptPrice = typeof model.creditsPricePerGen === "number" && model.creditsPricePerGen > 0
      ? model.creditsPricePerGen
      : 5;

    // 5. Buscar usuário comprador e verificar privilégios ilimitados (ADMIN ou isUnlimited)
    const userRecord = await prisma.user.findFirst({
      where: {
        OR: [
          ...(session.user.id ? [{ id: session.user.id }] : []),
          ...(session.user.email ? [{ email: session.user.email }] : []),
        ],
      },
      select: { id: true, role: true, isUnlimited: true, isBlocked: true },
    });

    if (!userRecord) {
      return NextResponse.json({ error: "Usuário não localizado." }, { status: 404 });
    }

    if (userRecord.isBlocked) {
      return NextResponse.json(
        { error: "Sua conta está suspensa. Entre em contato com o suporte." },
        { status: 403 }
      );
    }

    const isExempt = userRecord.role === "ADMIN" || Boolean(userRecord.isUnlimited);

    if (isExempt) {
      return NextResponse.json({
        success: true,
        prompt: model.promptTrigger,
        modelName: model.name,
        freeAccess: true,
        creditsDebited: 0,
        message: "Acesso liberado pelo seu plano ilimitado!",
      });
    }

    // 6. Verificar saldo antes do bloqueio
    const currentBalance = await CreditService.getBalance(userRecord.id);
    if (currentBalance < promptPrice) {
      return NextResponse.json(
        {
          error: `Saldo insuficiente de créditos para desbloquear este prompt. Necessário: ${promptPrice} créditos, Saldo atual: ${currentBalance}.`,
        },
        { status: 400 }
      );
    }

    // 7. Débito atômico via CreditService.deduct com lock pessimista
    let newBalance: number;
    try {
      newBalance = await CreditService.deduct({
        userId: userRecord.id,
        amount: promptPrice,
        type: "GENERATION_DEBIT",
        description: `Aquisição de Master Prompt: ${model.name}`,
      });
    } catch (deductErr: any) {
      const errMsg = deductErr?.message || "Falha ao processar débito de créditos.";
      if (errMsg.includes("Saldo insuficiente")) {
        return NextResponse.json(
          { error: "Saldo insuficiente de créditos para adquirir este prompt." },
          { status: 400 }
        );
      }
      throw deductErr;
    }

    return NextResponse.json({
      success: true,
      prompt: model.promptTrigger,
      modelName: model.name,
      creditsDebited: promptPrice,
      newBalance,
      message: "Master Prompt desbloqueado com sucesso!",
    });
  } catch (error: any) {
    console.error("Erro interno ao processar compra de prompt do modelo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao processar o desbloqueio do prompt." },
      { status: 500 }
    );
  }
}
