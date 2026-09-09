import { IAIProvider, AISubmitPayload } from "../ai-provider.interface";
import prisma from "@/lib/prisma";

export class WaveSpeedAIProvider implements IAIProvider {
  private apiKey: string;
  private baseUrl = "https://api.wavespeed.ai/api/v3";

  constructor() {
    this.apiKey = process.env.WAVESPEED_API_KEY || "";
  }

  async submitJob(payload: AISubmitPayload): Promise<{ providerJobId: string }> {
    console.log(`\n================== [WAVESPEED AI REQUEST] ==================`);
    console.log(`📡 Modelo Técnico: ${payload.modelTechnicalName}`);
    console.log(`📝 Inputs:`, JSON.stringify(payload.inputs, null, 2));

    // Se a chave não estiver configurada ou estiver em mock
    if (!this.apiKey || process.env.AI_PROVIDER_MODE === "mock" || process.env.VITEST === "true") {
      console.warn("[WaveSpeedAIProvider] WAVESPEED_API_KEY ausente ou modo MOCK ativo. Simulando retorno.");
      const mockTaskId = `ws-mock-${Math.random().toString(36).substring(2, 10)}`;
      
      setTimeout(async () => {
        try {
          const isVideo = payload.modelTechnicalName.includes("video");
          const mediaUrl = isVideo 
            ? "/media/landing/hero/hero_main.mp4" 
            : "/media/landing/gallery/editorial_fashion.jpg";

          await prisma.$transaction(async (tx) => {
            await tx.aIJob.update({
              where: { id: payload.jobId },
              data: {
                status: "COMPLETED",
                providerJobId: mockTaskId,
                billingQuantity: 1.0,
                providerCostUsd: 0.025,
              },
            });

            const file = await tx.file.create({
              data: {
                userId: (await tx.aIJob.findUnique({ where: { id: payload.jobId }, select: { userId: true } }))?.userId || "",
                name: `wavespeed-hot-${payload.jobId.slice(0, 8)}.${isVideo ? "mp4" : "jpg"}`,
                mimeType: isVideo ? "video/mp4" : "image/jpeg",
                sizeBytes: 1024 * 1024 * 3,
                url: mediaUrl,
                storageKey: `outputs/hot/${payload.jobId}.${isVideo ? "mp4" : "jpg"}`,
              },
            });

            await tx.aIJobOutput.create({
              data: {
                jobId: payload.jobId,
                fileId: file.id,
                fileUrl: mediaUrl,
              },
            });
          });
        } catch (e) {
          console.error("[WaveSpeedAIProvider] Erro na simulação mock:", e);
        }
      }, 2000);

      return { providerJobId: mockTaskId };
    }

    // Requisição real à API da WaveSpeed
    try {
      const endpoint = `${this.baseUrl}/${payload.modelTechnicalName.replace(/^wavespeed\//, "")}`;

      // Mapeamento e adaptação dos inputs para a API da WaveSpeed
      const bodyPayload: Record<string, any> = {
        prompt: payload.inputs.prompt || "",
      };

      if (payload.inputs.image_url || payload.inputs.image) {
        bodyPayload.image_url = payload.inputs.image_url || payload.inputs.image;
      }

      if (payload.inputs.aspect_ratio || payload.inputs.size) {
        bodyPayload.size = payload.inputs.size || payload.inputs.aspect_ratio;
      }

      if (payload.inputs.negative_prompt) {
        bodyPayload.negative_prompt = payload.inputs.negative_prompt;
      }

      if (payload.inputs.seed) {
        bodyPayload.seed = payload.inputs.seed;
      }

      if (payload.inputs.duration) {
        bodyPayload.duration = payload.inputs.duration;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Erro da WaveSpeed API: HTTP ${res.status}`);
      }

      const data = await res.json();
      const taskId = data.id || data.task_id || data.prediction_id;

      if (!taskId) {
        throw new Error("A WaveSpeed não retornou um ID de tarefa válido.");
      }

      // Inicia polling assíncrono para capturar resultado
      this.pollTaskResult(taskId, payload.jobId);

      return { providerJobId: taskId };
    } catch (err: any) {
      console.error("[WaveSpeedAIProvider] Falha ao submeter job:", err);
      throw new Error(`Falha na conexão com WaveSpeed AI: ${err.message}`);
    }
  }

  async cancelJob(providerJobId: string): Promise<boolean> {
    console.log(`[WaveSpeedAIProvider] Cancelar job ${providerJobId}`);
    return true;
  }

  /**
   * Monitora o status da predição na WaveSpeed e atualiza o banco de dados do VORIXA
   */
  private async pollTaskResult(taskId: string, jobId: string) {
    const resultUrl = `${this.baseUrl}/predictions/${taskId}/result`;
    let attempts = 0;
    const maxAttempts = 60; // até 5 minutos

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(resultUrl, {
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        const status = (data.status || data.state || "").toLowerCase();

        if (status === "completed" || status === "succeeded") {
          clearInterval(interval);
          const outputUrl = data.outputs?.[0] || data.output?.url || data.result_url || data.url;

          if (outputUrl) {
            const isVideo = outputUrl.endsWith(".mp4") || outputUrl.includes("video");
            
            await prisma.$transaction(async (tx) => {
              await tx.aIJob.update({
                where: { id: jobId },
                data: {
                  status: "COMPLETED",
                  providerJobId: taskId,
                },
              });

              const job = await tx.aIJob.findUnique({ where: { id: jobId }, select: { userId: true } });

              const file = await tx.file.create({
                data: {
                  userId: job?.userId || "",
                  name: `wavespeed-${taskId.slice(0, 8)}.${isVideo ? "mp4" : "jpg"}`,
                  mimeType: isVideo ? "video/mp4" : "image/jpeg",
                  sizeBytes: 1024 * 1024 * 2,
                  url: outputUrl,
                  storageKey: `outputs/hot/${taskId}.${isVideo ? "mp4" : "jpg"}`,
                },
              });

              await tx.aIJobOutput.create({
                data: {
                  jobId,
                  fileId: file.id,
                  fileUrl: outputUrl,
                },
              });
            });
          }
        } else if (status === "failed" || status === "cancelled" || status === "timeout") {
          clearInterval(interval);
          await prisma.aIJob.update({
            where: { id: jobId },
            data: {
              status: "FAILED",
              error: data.error || "Geração rejeitada ou falha de inferência no cluster WaveSpeed.",
            },
          });
        }
      } catch (pollErr) {
        console.warn(`[WaveSpeedAIProvider] Erro ao consultar status da task ${taskId}:`, pollErr);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        await prisma.aIJob.update({
          where: { id: jobId },
          data: {
            status: "FAILED",
            error: "Tempo limite de resposta excedido no cluster WaveSpeed.",
          },
        });
      }
    }, 4000);
  }
}
