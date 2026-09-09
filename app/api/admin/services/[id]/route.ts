import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CurrencyService } from "@/services/currency.service";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "ID do serviço/modelo não fornecido." }, { status: 400 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Payload JSON inválido." }, { status: 400 });
    }

    const { status, creditCost, apiUnitCost } = body;

    const updateData: {
      status?: boolean;
      creditCost?: number;
      apiUnitCost?: number;
    } = {};

    if (typeof status === "boolean") {
      updateData.status = status;
    }

    if (creditCost !== undefined && creditCost !== null) {
      const parsedCredits = Number(creditCost);
      if (isNaN(parsedCredits) || parsedCredits < 0 || !Number.isInteger(parsedCredits)) {
        return NextResponse.json(
          { error: "O custo em créditos deve ser um número inteiro maior ou igual a zero." },
          { status: 400 }
        );
      }
      updateData.creditCost = parsedCredits;
    }

    if (apiUnitCost !== undefined && apiUnitCost !== null) {
      const parsedApiCost = Number(apiUnitCost);
      if (isNaN(parsedApiCost) || parsedApiCost < 0) {
        return NextResponse.json(
          { error: "O custo de API em USD deve ser um número válido maior ou igual a zero." },
          { status: 400 }
        );
      }
      updateData.apiUnitCost = Number(parsedApiCost.toFixed(4));
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo para atualização foi enviado (status, creditCost ou apiUnitCost)." },
        { status: 400 }
      );
    }

    const existingModel = await prisma.aIModel.findUnique({
      where: { id },
    });

    if (!existingModel) {
      return NextResponse.json({ error: "Serviço não encontrado no catálogo." }, { status: 404 });
    }

    const updatedModel = await prisma.aIModel.update({
      where: { id },
      data: updateData,
      include: {
        provider: true,
        tools: true,
      },
    });

    // Se o status do modelo foi alterado, manter ferramentas vinculadas em sincronia se desejado
    if (typeof status === "boolean") {
      await prisma.aITool.updateMany({
        where: { modelId: id },
        data: { status },
      });
    }

    // Registrar log de auditoria
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "UPDATE_SERVICE_CONFIG",
        details: JSON.stringify({
          serviceId: id,
          serviceName: existingModel.name,
          changes: updateData,
        }),
      },
    });

    const dollarRate = await CurrencyService.getUsdToBrlRate();
    const estimatedCostBrl = Number((updatedModel.apiUnitCost * dollarRate).toFixed(4));

    return NextResponse.json({
      message: `Serviço "${updatedModel.name}" atualizado com sucesso!`,
      service: {
        id: updatedModel.id,
        name: updatedModel.name,
        technicalName: updatedModel.technicalName,
        status: updatedModel.status,
        creditCost: updatedModel.creditCost,
        apiUnitCostUsd: updatedModel.apiUnitCost,
        estimatedCostBrl,
      },
    });
  } catch (error: any) {
    console.error("Erro ao atualizar serviço:", error);
    return NextResponse.json({ error: "Erro interno ao atualizar configurações do serviço." }, { status: 500 });
  }
}
