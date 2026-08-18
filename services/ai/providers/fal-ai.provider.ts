import { fal } from "@fal-ai/client";
import { IAIProvider, AISubmitPayload } from "../ai-provider.interface";
import prisma from "@/lib/prisma";

export class FalAIProvider implements IAIProvider {
  constructor() {
    // A chave FAL_KEY é lida automaticamente do ambiente por process.env.FAL_KEY,
    // mas também podemos definir explicitamente no construtor
    if (process.env.FAL_KEY) {
      fal.config({
        credentials: process.env.FAL_KEY,
      });
    }
  }

  async submitJob(payload: AISubmitPayload): Promise<{ providerJobId: string }> {
    try {
      const result = await fal.queue.submit(payload.modelTechnicalName, {
        input: payload.inputs,
        webhookUrl: payload.webhookUrl,
      });

      if (!result.request_id) {
        throw new Error("Não foi retornado um request_id válido do fal.ai.");
      }

      return { providerJobId: result.request_id };
    } catch (error: any) {
      throw new Error(`Erro ao enviar job para fal.ai: ${error.message}`);
    }
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
