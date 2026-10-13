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

    const { name, status, creditCost, apiUnitCost } = body;

    const updateData: {
      name?: string;
      status?: boolean;
      creditCost?: number;
      apiUnitCost?: number;
    } = {};

    // Validação e sanitização do nome de exibição do modelo/serviço
    if (name !== undefined && name !== null) {
      if (typeof name !== "string") {
        return NextResponse.json(
          { error: "O nome do serviço deve ser um texto válido." },
          { status: 400 }
        );
      }

      const sanitizedName = name
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (sanitizedName.length < 2 || sanitizedName.length > 100) {
        return NextResponse.json(
          { error: "O nome do serviço deve ter entre 2 e 100 caracteres." },
          { status: 400 }
        );
      }

      updateData.name = sanitizedName;
    }

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
        { error: "Nenhum campo para atualização foi enviado (name, status, creditCost ou apiUnitCost)." },
        { status: 400 }
      );
    }

    const existingModel = await prisma.aIModel.findUnique({
      where: { id },
    });

    if (!existingModel) {
      return NextResponse.json({ error: "Serviço não encontrado no catálogo." }, { status: 404 });
    }

    // Execução atômica no banco via transação Prisma
    const updatedModel = await prisma.$transaction(async (tx) => {
      const model = await tx.aIModel.update({
        where: { id },
        data: updateData,
        include: {
          provider: true,
          tools: true,
        },
      });

      // Se o status do modelo foi alterado, manter ferramentas vinculadas em sincronia
      if (typeof status === "boolean") {
        await tx.aITool.updateMany({
          where: { modelId: id },
          data: { status },
        });
      }

      // Se o nome do modelo foi alterado, atualizar também o nome das ferramentas associadas
      if (updateData.name) {
        await tx.aITool.updateMany({
          where: { modelId: id },
          data: { name: updateData.name },
        });
      }

      // Registrar log de auditoria com rastreabilidade de mudanças
      await tx.auditLog.create({
        data: {
          userId: admin.id,
          action: "UPDATE_SERVICE_CONFIG",
          details: JSON.stringify({
            serviceId: id,
            serviceName: existingModel.name,
            changes: updateData,
            ...(updateData.name && {
              oldName: existingModel.name,
              newName: updateData.name,
            }),
          }),
        },
      });

      return model;
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
