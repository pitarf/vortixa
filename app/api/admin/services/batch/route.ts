import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

type BatchAction = "activate" | "deactivate" | "adjust_credits_percentage" | "set_fixed_credits";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado. Apenas administradores." }, { status: 403 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Payload JSON inválido." }, { status: 400 });
    }

    const { serviceIds, action, value } = body;

    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return NextResponse.json(
        { error: "Nenhum serviço selecionado para a operação em lote." },
        { status: 400 }
      );
    }

    const validActions: BatchAction[] = [
      "activate",
      "deactivate",
      "adjust_credits_percentage",
      "set_fixed_credits",
    ];

    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Ação inválida. Ações permitidas: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    // Buscar modelos existentes correspondentes
    const existingModels = await prisma.aIModel.findMany({
      where: { id: { in: serviceIds } },
    });

    if (existingModels.length === 0) {
      return NextResponse.json(
        { error: "Nenhum dos serviços especificados foi encontrado no sistema." },
        { status: 404 }
      );
    }

    let updatedCount = 0;

    if (action === "activate") {
      const result = await prisma.aIModel.updateMany({
        where: { id: { in: serviceIds } },
        data: { status: true },
      });
      // Sincronizar ferramentas
      await prisma.aITool.updateMany({
        where: { modelId: { in: serviceIds } },
        data: { status: true },
      });
      updatedCount = result.count;
    } else if (action === "deactivate") {
      const result = await prisma.aIModel.updateMany({
        where: { id: { in: serviceIds } },
        data: { status: false },
      });
      // Sincronizar ferramentas
      await prisma.aITool.updateMany({
        where: { modelId: { in: serviceIds } },
        data: { status: false },
      });
      updatedCount = result.count;
    } else if (action === "set_fixed_credits") {
      const fixedValue = Number(value);
      if (isNaN(fixedValue) || fixedValue < 0 || !Number.isInteger(fixedValue)) {
        return NextResponse.json(
          { error: "O valor fixo de créditos deve ser um número inteiro maior ou igual a zero." },
          { status: 400 }
        );
      }

      const result = await prisma.aIModel.updateMany({
        where: { id: { in: serviceIds } },
        data: { creditCost: fixedValue },
      });
      updatedCount = result.count;
    } else if (action === "adjust_credits_percentage") {
      const percentage = Number(value);
      if (isNaN(percentage) || !Number.isFinite(percentage)) {
        return NextResponse.json(
          { error: "A porcentagem de reajuste deve ser um número válido (ex: 10 para +10% ou -10 para -10%)." },
          { status: 400 }
        );
      }

      // Atualizar individualmente para calcular proporcionalmente cada modelo
      for (const model of existingModels) {
        const factor = 1 + percentage / 100;
        let newCredits = Math.round(model.creditCost * factor);
        if (newCredits < 0) newCredits = 0;

        await prisma.aIModel.update({
          where: { id: model.id },
          data: { creditCost: newCredits },
        });
        updatedCount++;
      }
    }

    // Registrar log de auditoria da ação em lote
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "BATCH_UPDATE_SERVICES",
        details: JSON.stringify({
          action,
          serviceIds,
          value,
          updatedCount,
        }),
      },
    });

    const actionDescriptions: Record<BatchAction, string> = {
      activate: "ativados",
      deactivate: "desativados",
      adjust_credits_percentage: `reajustados em ${value}%`,
      set_fixed_credits: `definidos para ${value} créditos`,
    };

    const actionText = (actionDescriptions as Record<string, string>)[action] || "atualizados";

    return NextResponse.json({
      message: `${updatedCount} serviço(s) foram ${actionText} com sucesso!`,
      affectedCount: updatedCount,
    });
  } catch (error: any) {
    console.error("Erro na operação em lote de serviços:", error);
    return NextResponse.json({ error: "Erro interno ao processar operação em lote." }, { status: 500 });
  }
}
