import prisma from "@/lib/prisma";
import { CreditService } from "../credit.service";
import { AIProviderFactory } from "./ai-provider.factory";
import { JobStatus } from "@prisma/client";

export interface AISubmitRequest {
  userId: string;
  toolSlug: string;
  inputs: Record<string, any>;
  idempotencyKey?: string;
}

export class AIService {
  /**
   * Submete um novo job de geração de IA de forma segura, transacional e idempotente.
   */
  static async submitJob(request: AISubmitRequest) {
    // 1. Validar Ferramenta e Modelo associado
    const tool = await prisma.aITool.findUnique({
      where: { slug: request.toolSlug },
      include: { model: true },
    });

    if (!tool) {
      throw new Error("Ferramenta de IA não cadastrada ou inativa.");
    }
    if (!tool.status || !tool.model.status) {
      throw new Error("Esta ferramenta está temporariamente desativada.");
    }

    // 2. Validação de Idempotência
    if (request.idempotencyKey) {
      const existingJob = await prisma.aIJob.findUnique({
        where: { idempotencyKey: request.idempotencyKey },
      });
      if (existingJob) {
        // Se já existe e foi processado ou está rodando, retornamos o job original
        return existingJob;
      }
    }

    const cost = tool.model.creditCost;

    // 3. Verificar saldo de créditos
    const hasCredits = await CreditService.hasEnoughCredits(request.userId, cost);
    if (!hasCredits) {
      throw new Error("Saldo insuficiente de créditos.");
    }

    // 4. Criar o registro do Job em PENDING no banco
    const job = await prisma.aIJob.create({
      data: {
        userId: request.userId,
        modelId: tool.model.id,
        toolId: tool.id,
        status: "PENDING",
        creditCost: cost,
        apiUnitCost: tool.model.apiUnitCost,
        idempotencyKey: request.idempotencyKey || null,
      },
    });

    // 5. Salvar os inputs enviados pelo usuário
    await prisma.aIJobInput.createMany({
      data: Object.entries(request.inputs).map(([key, value]) => ({
        jobId: job.id,
        key,
        value: typeof value === "string" ? value : JSON.stringify(value),
      })),
    });

    let charged = false;
    try {
      // 6. Consumir créditos transacionalmente
      await CreditService.consumeCredits(
        request.userId,
        cost,
        request.toolSlug,
        job.id
      );
      charged = true;

      // 7. Submeter ao Provedor (Factory escolhe Live ou Mock)
      const provider = AIProviderFactory.getProvider();
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const webhookUrl = `${baseUrl}/api/webhooks/fal`;

      const result = await provider.submitJob({
        jobId: job.id,
        modelTechnicalName: tool.model.technicalName,
        inputs: request.inputs,
        webhookUrl,
      });

      // 8. Atualizar status para PROCESSING, salvar request ID e snapshots financeiros
      const updatedJob = await prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: "PROCESSING",
          providerJobId: result.providerJobId,
          billingUnit: tool.model.billingUnit || "GENERATION",
          billingQuantity: 1.0,
          providerCostUsd: tool.model.apiUnitCost,
          creditsReserved: cost,
          creditsCharged: cost,
        },
      });

      return updatedJob;
    } catch (error: any) {
      // Se a submissão falhar, marca o Job como FAILED e estorna créditos caso já tenham sido consumidos
      await prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          error: error.message,
        },
      });

      // Estornar créditos apenas se foram cobrados
      if (charged) {
        await CreditService.refundCredits(request.userId, cost, job.id).catch((err) => {
          console.error(`Falha grave ao tentar estornar créditos do job ${job.id}: ${err.message}`);
        });
      }

      throw new Error(`Falha no motor de IA: ${error.message}`);
    }
  }

  /**
   * Cancela uma geração em andamento.
   */
  static async cancelJob(jobId: string, userId: string): Promise<boolean> {
    const job = await prisma.aIJob.findFirst({
      where: { id: jobId, userId },
      include: { model: true },
    });

    if (!job) {
      throw new Error("Job de IA não encontrado.");
    }

    // Só permite cancelar jobs que estejam em PENDING ou PROCESSING
    if (job.status !== "PENDING" && job.status !== "PROCESSING") {
      return false;
    }

    try {
      const provider = AIProviderFactory.getProvider();
      let providerCancelled = false;

      if (job.providerJobId) {
        providerCancelled = await provider.cancelJob(job.providerJobId);
      }

      await prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: "CANCELLED",
        },
      });

      // Estorna os créditos consumidos
      await CreditService.refundCredits(userId, job.creditCost, job.id);

      return true;
    } catch (error) {
      console.error(`Erro ao cancelar geração: ${error}`);
      return false;
    }
  }
}
