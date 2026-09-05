import { fal } from "@fal-ai/client";
import { IAIProvider, AISubmitPayload } from "../ai-provider.interface";
import prisma from "@/lib/prisma";

export class FalAIProvider implements IAIProvider {
  constructor() {
    if (process.env.FAL_KEY) {
      fal.config({
        credentials: process.env.FAL_KEY,
      });
    }
  }

  async submitJob(payload: AISubmitPayload): Promise<{ providerJobId: string }> {
    try {
      console.log(`\n================== [FAL.AI LIVE REAL REQUEST] ==================`);
      console.log(`📡 Modelo Técnico: ${payload.modelTechnicalName}`);
      console.log(`📝 Inputs Enviados:`, JSON.stringify(payload.inputs, null, 2));

      // Em ambiente local de desenvolvimento (localhost), o fal.ai não consegue chamar o webhook de volta
      // Por isso, usamos o fal.queue.submit e iniciamos polling em background para obter o resultado real da fal.ai
      const isLocalhost = payload.webhookUrl.includes("localhost") || payload.webhookUrl.includes("127.0.0.1");

      const modelInputs = { ...payload.inputs };
      const requiresAspectRatio = payload.modelTechnicalName.includes("ideogram") || 
                                  payload.modelTechnicalName.includes("ultra") || 
                                  payload.modelTechnicalName.includes("nano-banana");

      if (requiresAspectRatio && modelInputs.image_size && !modelInputs.aspect_ratio) {
        const sizeMap: Record<string, string> = {
          square_hd: "1:1",
          landscape_16_9: "16:9",
          portrait_16_9: "9:16",
          landscape_4_3: "4:3",
          landscape_3_2: "3:2",
        };
        modelInputs.aspect_ratio = sizeMap[modelInputs.image_size] || "16:9";
      }

      const submitOptions: any = {
        input: modelInputs,
      };

      if (!isLocalhost) {
        submitOptions.webhookUrl = payload.webhookUrl;
      }

      const result = await fal.queue.submit(payload.modelTechnicalName, submitOptions);

      console.log(`✅ [FAL.AI REAL] Job Submetido! Request ID: ${result.request_id}`);
      console.log(`⏳ Aguardando conclusão na GPU da fal.ai...`);
      console.log(`=================================================================\n`);

      if (!result.request_id) {
        throw new Error("Não foi retornado um request_id válido do fal.ai.");
      }

      // Se estiver rodando em localhost, busca o resultado real diretamente da fila da fal.ai
      if (isLocalhost) {
        this.pollFalResultInBackground(result.request_id, payload.jobId, payload.modelTechnicalName);
      }

      return { providerJobId: result.request_id };
    } catch (error: any) {
      console.error(`❌ [FAL.AI ERROR]:`, error.message);
      throw new Error(`Erro ao enviar job para fal.ai: ${error.message}`);
    }
  }

  private async pollFalResultInBackground(requestId: string, jobId: string, model: string) {
    const maxAttempts = 120; // 2 minutos máx
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const statusResult = await fal.queue.status(model, {
          requestId,
          logs: true,
        });

        if (statusResult.status === "COMPLETED") {
          clearInterval(interval);
          let finalResult: any = null;
          try {
            finalResult = await fal.queue.result(model, {
              requestId,
            });
          } catch (resErr: any) {
            console.error(`❌ [AI ERROR RETRIEVING RESULT]:`, resErr.body || resErr.message);
            const errDetail = resErr.body?.detail?.[0]?.msg || resErr.message || "Parâmetros de entrada inválidos para este modelo.";
            const userFriendlyMsg = errDetail.includes("less than or equal") 
              ? "O número de passos de inferência excede o limite suportado pelo modelo."
              : `Não foi possível processar a mídia: ${errDetail}`;

            const job = await prisma.aIJob.findUnique({ where: { id: jobId } });
            
            await prisma.aIJob.update({
              where: { id: jobId },
              data: { status: "FAILED", error: userFriendlyMsg },
            });

            // Estorno de créditos e Log de Auditoria
            if (job && job.creditCost > 0) {
              const { CreditService } = await import("@/services/credit.service");
              await CreditService.refundCredits(job.userId, job.creditCost, job.id);
            }

            if (job) {
              await prisma.auditLog.create({
                data: {
                  userId: job.userId,
                  action: "AI_GENERATION_FAILED",
                  details: `Falha na geração (Job ${jobId}, Modelo ${model}): ${errDetail}`,
                },
              });
            }
            return;
          }

          console.log(`\n🎉 [AI RESULTADO REAL RECEBIDO DA NUVEM] Request ID: ${requestId}`);
          console.log(`📦 Dados Recebidos:`, JSON.stringify(finalResult.data, null, 2));

          // Extrai URLs geradas reais
          const outputUrls: string[] = [];
          if ((finalResult.data as any)?.images && Array.isArray((finalResult.data as any).images)) {
            (finalResult.data as any).images.forEach((img: any) => {
              if (img.url) outputUrls.push(img.url);
            });
          }
          if ((finalResult.data as any)?.image?.url) {
            outputUrls.push((finalResult.data as any).image.url);
          }
          if ((finalResult.data as any)?.video?.url) {
            outputUrls.push((finalResult.data as any).video.url);
          }

          const job = await prisma.aIJob.findUnique({ where: { id: jobId } });
          if (job && outputUrls.length > 0) {
            await prisma.$transaction(async (tx) => {
              await tx.aIJob.update({
                where: { id: job.id },
                data: {
                  status: "COMPLETED",
                  billingQuantity: 1.0,
                },
              });

              for (const realUrl of outputUrls) {
                const isVideo = realUrl.endsWith(".mp4");
                const file = await tx.file.create({
                  data: {
                    userId: job.userId,
                    name: `vorixa-render-${job.id.slice(0, 8)}.${isVideo ? "mp4" : "jpg"}`,
                    mimeType: isVideo ? "video/mp4" : "image/jpeg",
                    sizeBytes: 1024 * 1024 * 2,
                    url: realUrl,
                    storageKey: `outputs/${job.userId}/vorixa-${job.id}.${isVideo ? "mp4" : "jpg"}`,
                  },
                });

                await tx.aIJobOutput.create({
                  data: {
                    jobId: job.id,
                    fileUrl: realUrl,
                    fileId: file.id,
                  },
                });
              }

              await tx.auditLog.create({
                data: {
                  userId: job.userId,
                  action: "AI_GENERATION_COMPLETED",
                  details: `Geração bem-sucedida (Job ${jobId}, Modelo ${model}): ${outputUrls.length} mídia(s) gerada(s)`,
                },
              });
            });

            // Se for nó de Flow, notifica o FlowExecutionService
            try {
              const { FlowExecutionService } = await import("@/services/flow-execution.service");
              await FlowExecutionService.handleJobCompletion(job.id, { outputUrls });
            } catch {}

            console.log(`✅ [AI SUCESSO] Job ${jobId} finalizado com mídias reais da IA!`);
          }
        } else if ((statusResult.status as string) === "FAILED") {
          clearInterval(interval);
          console.error(`❌ [AI FALHA] Job ${requestId} falhou na nuvem.`);
          const job = await prisma.aIJob.findUnique({ where: { id: jobId } });
          await prisma.aIJob.update({
            where: { id: jobId },
            data: { status: "FAILED", error: "Ocorreu uma instabilidade temporária durante a renderização da IA. Seus créditos foram estornados." },
          });

          if (job && job.creditCost > 0) {
            const { CreditService } = await import("@/services/credit.service");
            await CreditService.refundCredits(job.userId, job.creditCost, job.id);
          }

          if (job) {
            await prisma.auditLog.create({
              data: {
                userId: job.userId,
                action: "AI_GENERATION_FAILED",
                details: `Falha na renderização de IA (Job ${jobId}, Modelo ${model})`,
              },
            });
          }
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error(`⏱️ [FAL.AI TIMEOUT] Timeout aguardando ${requestId}`);
        }
      } catch (err: any) {
        console.error("Erro no polling da fal.ai:", err.message);
      }
    }, 2000);
  }

  async cancelJob(providerJobId: string): Promise<boolean> {
    try {
      const job = await prisma.aIJob.findUnique({
        where: { providerJobId },
        include: { model: true },
      });

      if (!job || !job.model) {
        return false;
      }

      await fal.queue.cancel(job.model.technicalName, {
        requestId: providerJobId,
      });

      return true;
    } catch (error) {
      console.error(`Erro ao cancelar job no fal.ai: ${error}`);
      return false;
    }
  }
}
