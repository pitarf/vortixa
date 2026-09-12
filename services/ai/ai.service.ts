import prisma from "@/lib/prisma";
import { CreditService } from "../credit.service";
import { AIProviderFactory } from "./ai-provider.factory";
import { JobStatus } from "@prisma/client";
import { PromptEngine } from "./prompt-engine.service";

export interface AISubmitRequest {
  userId: string;
  toolSlug: string;
  modelId?: string;
  inputs: Record<string, any>;
  idempotencyKey?: string;
}

export class AIService {
  /**
   * Submete um novo job de geração de IA de forma segura, transacional e idempotente.
   */
  static async submitJob(request: AISubmitRequest) {
    // 1. Validar Ferramenta
    const tool = await prisma.aITool.findUnique({
      where: { slug: request.toolSlug },
      include: { model: true },
    });

    if (!tool) {
      throw new Error("Ferramenta de IA não cadastrada ou inativa.");
    }
    if (!tool.status) {
      throw new Error("Esta ferramenta está temporariamente desativada.");
    }

    // Se o cliente especificou um modelId alternativo, resolvemos dinamicamente com validação estrita
    let targetModel = tool.model;
    if (request.modelId && request.modelId !== tool.model.id) {
      let customModel = await prisma.aIModel.findUnique({
        where: { id: request.modelId },
      });
      if (!customModel) {
        customModel = await prisma.aIModel.findFirst({
          where: { technicalName: request.modelId },
        });
      }
      if (!customModel) {
        throw new Error(`O modelo solicitado (${request.modelId}) não foi encontrado no sistema.`);
      }
      if (!customModel.status) {
        throw new Error(`O modelo ${customModel.name} está temporariamente desativado.`);
      }
      targetModel = customModel;
    }

    if (!targetModel.status) {
      throw new Error(`O modelo ${targetModel.name} está temporariamente desativado.`);
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

    // Cálculo dinâmico de custo: Duração (10s = 2x) e Qualidade (Kling Pro/Alta = 1.5x)
    const isVideo = request.toolSlug.includes("video") || targetModel.technicalName.includes("video") || targetModel.technicalName.includes("wan") || targetModel.technicalName.includes("luma") || targetModel.technicalName.includes("seedance") || targetModel.technicalName.includes("minimax");
    const is10s = String(request.inputs?.duration) === "10";
    const durationMultiplier = (isVideo && is10s) ? 2 : 1;

    // Kling em modo Alta / Pro (1080p = 1.5x) e 4K Ultra (2.0x)
    const isKling = targetModel.technicalName.includes("kling");
    const is4K = request.inputs?.quality === "ultra4k" || request.inputs?.resolution === "4k" || request.inputs?.resolution === "4K";
    const isHighQuality = request.inputs?.quality === "high" || request.inputs?.mode === "pro" || request.inputs?.resolution === "1080p";
    const qualityMultiplier = isKling
      ? is4K
        ? 2.0
        : isHighQuality
        ? 1.5
        : 1.0
      : 1.0;

    const totalMultiplier = durationMultiplier * qualityMultiplier;
    const cost = Math.round(targetModel.creditCost * totalMultiplier);
    const apiUnitCost = targetModel.apiUnitCost * totalMultiplier;

    // 3. Verificar saldo de créditos
    const hasCredits = await CreditService.hasEnoughCredits(request.userId, cost);
    if (!hasCredits) {
      throw new Error(`Saldo insuficiente de créditos. Custo necessário: ${cost} créditos.`);
    }

    // 4. Criar o registro do Job em PENDING no banco
    const job = await prisma.aIJob.create({
      data: {
        userId: request.userId,
        modelId: targetModel.id,
        toolId: tool.id,
        status: "PENDING",
        creditCost: cost,
        apiUnitCost: apiUnitCost,
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

      // 7. Processar e enriquecer prompt (se presente) com a IA da fal.ai (LLM) e fallback
      const processedInputs = { ...request.inputs };
      const hasReferenceImage = Boolean(
        processedInputs.image_url ||
        processedInputs.image ||
        processedInputs.reference_image_url ||
        processedInputs.prompt_image_url ||
        (Array.isArray(processedInputs.image_urls) && processedInputs.image_urls.length > 0) ||
        (typeof processedInputs.image_urls === "string" && processedInputs.image_urls.trim().length > 0)
      );

      if (processedInputs.prompt && typeof processedInputs.prompt === "string") {
        // [TESTE TEMPORÁRIO]: Desativada otimização/tradução para envio 100% puro do prompt original
        /*
        const shouldOptimize = !processedInputs.is_prompt_optimized && !processedInputs.skip_prompt_optimization;

        if (shouldOptimize) {
          const optimized = await PromptEngine.optimizeAsync(processedInputs.prompt, {
            enhanceQuality: true,
            toolType: request.toolSlug.includes("video") ? "video" : "image",
            style: processedInputs.style,
            hasReferenceImage,
          });
          processedInputs.prompt = optimized.optimizedPrompt;

          // Registra o prompt otimizado no Ledger/JobInputs para auditoria
          if (optimized.optimizedPrompt !== request.inputs.prompt) {
            await prisma.aIJobInput.create({
              data: {
                jobId: job.id,
                key: "optimized_prompt",
                value: optimized.optimizedPrompt,
              },
            }).catch(() => {});
          }
        }
        */
      }

      // 8. Submeter ao Provedor (Factory escolhe Live Fal.ai, WaveSpeed ou Mock)
      const provider = AIProviderFactory.getProvider(targetModel.technicalName);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3005";
      const webhookUrl = `${baseUrl}/api/webhooks/fal`;

      const result = await provider.submitJob({
        jobId: job.id,
        modelTechnicalName: targetModel.technicalName,
        inputs: processedInputs,
        webhookUrl,
      });

      // 8. Atualizar status para PROCESSING, salvar request ID e snapshots financeiros
      const updatedJob = await prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: "PROCESSING",
          providerJobId: result.providerJobId,
          billingUnit: targetModel.billingUnit || "GENERATION",
          billingQuantity: 1.0,
          providerCostUsd: targetModel.apiUnitCost,
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
