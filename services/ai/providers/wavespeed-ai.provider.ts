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
      // Mapeamento para os caminhos exatos de endpoint da WaveSpeed AI API v3
      let modelPath = payload.modelTechnicalName.replace(/^wavespeed\//, "");
      
      // Mapeamento de compatibilidade para modelos oficiais da WaveSpeed
      const endpointMap: Record<string, string> = {
        // Modelos de imagem 100% sem censura (Uncensored / NSFW)
        "wan-2.2/text-to-image-realism": "wavespeed-ai/wan-2.2/text-to-image-realism",
        "wavespeed-ai/wan-2.2/text-to-image-realism": "wavespeed-ai/wan-2.2/text-to-image-realism",
        "flux-uncensored-dev": "wavespeed-ai/chroma",
        "wavespeed-ai/flux-uncensored-dev": "wavespeed-ai/chroma",
        "pony-diffusion-v6-xl": "wavespeed-ai/chroma",
        "wavespeed-ai/pony-diffusion-v6-xl": "wavespeed-ai/chroma",
        "chroma": "wavespeed-ai/chroma",
        "wavespeed-ai/chroma": "wavespeed-ai/chroma",
        // Vídeo Spicy (Sem Censura / Nudez)
        "wan-2.2-spicy": "wavespeed-ai/wan-2.2-spicy/image-to-video",
        "wavespeed-ai/wan-2.2-spicy": "wavespeed-ai/wan-2.2-spicy/image-to-video",
        "minimax-h3-spicy": "wavespeed-ai/minimax-h3/image-to-video-spicy",
        "wavespeed-ai/minimax-h3-spicy": "wavespeed-ai/minimax-h3/image-to-video-spicy",
        "seedance-2.5-spicy": "bytedance/seedance-2.5/image-to-video-spicy",
        "wavespeed-ai/seedance-2.5-spicy": "bytedance/seedance-2.5/image-to-video-spicy",
        "wan-2.1-uncensored-i2v": "wavespeed-ai/wan-2.2-spicy/image-to-video",
        "wavespeed-ai/wan-2.1-uncensored-i2v": "wavespeed-ai/wan-2.2-spicy/image-to-video",
        "minimax-spicy": "wavespeed-ai/minimax-h3/image-to-video-spicy",
        "vidu-spicy": "vidu/q3/image-to-video-spicy",
      };

      if (endpointMap[modelPath]) {
        modelPath = endpointMap[modelPath];
      } else if (endpointMap[payload.modelTechnicalName]) {
        modelPath = endpointMap[payload.modelTechnicalName];
      }

      const endpoint = `${this.baseUrl}/${modelPath}`;

      // Injeção de realismo fotográfico: remove o aspecto plástico de pele lisa (plastic/doll look)
      let finalPrompt = payload.inputs.prompt || "";
      if (!modelPath.includes("video")) {
        // Enfatiza microtextura, pele crua, poros, iluminação natural e elimina estética plástica/render
        if (!finalPrompt.includes("pores") && !finalPrompt.includes("raw photo")) {
          finalPrompt = `${finalPrompt}, authentic raw photograph, natural unairbrushed skin texture, visible fine pores and subtle imperfections, realistic soft ambient lighting, shot on 35mm lens f/1.8, documentary boudoir style, no plastic skin, no CGI render, no doll look, 8k uhd`;
        }
      }

      // Mapeamento e adaptação dos inputs para a API
      const bodyPayload: Record<string, any> = {
        prompt: finalPrompt,
      };

      // Para modelos de vídeo (ex: seedance spicy, wan spicy), o campo costuma ser "image" e não "image_url"
      const imgUrl = payload.inputs.image_url || payload.inputs.image || payload.inputs.reference_image_url;
      if (imgUrl) {
        bodyPayload.image_url = imgUrl;
        bodyPayload.image = imgUrl; // Seedance Spicy exige "image"
      }

      // Mapeamento e adaptação de dimensões (aspect ratio -> size em pixels "LARGURA*ALTURA")
      // A WaveSpeed exige o formato de pixels (ex: 768*1344 para 9:16, 1344*768 para 16:9, 1024*1024 para 1:1)
      const ratio = String(payload.inputs.aspect_ratio || payload.inputs.size || "9:16").trim();
      let resolvedSize = "768*1344"; // Padrão 9:16 Vertical
      if (ratio === "16:9") {
        resolvedSize = "1344*768";
      } else if (ratio === "1:1") {
        resolvedSize = "1024*1024";
      } else if (ratio === "9:16") {
        resolvedSize = "768*1344";
      } else if (ratio.includes("*") || ratio.includes("x")) {
        resolvedSize = ratio.replace("x", "*");
      }

      // Se for modelo de imagem (ex: chroma), passar size
      if (!modelPath.includes("video")) {
        bodyPayload.size = resolvedSize;
      } else {
        // Se for modelo de vídeo, passar resolution e duration como número inteiro
        const resInput = payload.inputs.resolution || "720p";
        // MiniMax H3 aceita 480p, 540p, 768p, 1080p
        // Seedance 2.5 aceita 480p, 720p, 1080p, 4k
        // WAN 2.2 aceita 480p, 720p
        if (modelPath.includes("wan-2.2") && (resInput === "1080p" || resInput === "4k")) {
          bodyPayload.resolution = "720p"; // WAN 2.2 max é 720p
        } else if (modelPath.includes("minimax") && resInput === "720p") {
          bodyPayload.resolution = "768p"; // MiniMax usa 768p em vez de 720p
        } else {
          bodyPayload.resolution = resInput;
        }
      }

      if (payload.inputs.negative_prompt) {
        bodyPayload.negative_prompt = payload.inputs.negative_prompt;
      }

      if (payload.inputs.seed !== undefined) {
        bodyPayload.seed = Number(payload.inputs.seed);
      }

      if (payload.inputs.duration !== undefined) {
        // WaveSpeed exige número inteiro para duration (ex: 5 em vez de "5")
        bodyPayload.duration = parseInt(String(payload.inputs.duration), 10) || 5;
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
      console.log("[WaveSpeedAIProvider] Resposta da API:", JSON.stringify(data, null, 2));

      // A WaveSpeed pode retornar { id: "..." } ou encapsulado em { data: { id: "..." } }
      const taskId =
        data.data?.id ||
        data.data?.prediction_id ||
        data.data?.task_id ||
        data.id ||
        data.prediction_id ||
        data.task_id;

      if (!taskId) {
        throw new Error(
          `A WaveSpeed não retornou um ID de tarefa válido. Resposta recebida: ${JSON.stringify(data)}`
        );
      }

      // Inicia polling assíncrono para capturar resultado
      this.pollTaskResult(taskId, payload.jobId);

      return { providerJobId: taskId };
    } catch (err: any) {
      console.error("[WaveSpeedAIProvider] Falha ao submeter job:", err);
      throw new Error(`Falha no cluster neural VORIXA: ${err.message}`);
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

        const json = await res.json();
        // A WaveSpeed pode retornar status e outputs tanto na raiz quanto encapsulado em json.data
        const data = json.data || json;
        const status = (data.status || data.state || json.status || "").toLowerCase();

        if (status === "completed" || status === "succeeded") {
          clearInterval(interval);
          const outputs = data.outputs || json.outputs || [];
          const outputUrl =
            outputs[0] ||
            data.output?.url ||
            data.result_url ||
            data.url ||
            json.url;

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
          const failedJob = await prisma.aIJob.findUnique({
            where: { id: jobId },
            select: { userId: true, creditCost: true },
          });

          await prisma.aIJob.update({
            where: { id: jobId },
            data: {
              status: "FAILED",
              error: data.error || data.message || "Geração rejeitada ou falha de inferência no cluster neural.",
            },
          });

          // Reembolsa os créditos do usuário
          if (failedJob && failedJob.creditCost > 0) {
            const { CreditService } = await import("@/services/credit.service");
            await CreditService.refundCredits(failedJob.userId, failedJob.creditCost, jobId).catch(() => {});
          }
        }
      } catch (pollErr) {
        console.warn(`[WaveSpeedAIProvider] Erro ao consultar status da task ${taskId}:`, pollErr);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        const timeoutJob = await prisma.aIJob.findUnique({
          where: { id: jobId },
          select: { userId: true, creditCost: true },
        });

        await prisma.aIJob.update({
          where: { id: jobId },
          data: {
            status: "FAILED",
            error: "Tempo limite de resposta excedido no cluster WaveSpeed.",
          },
        });

        if (timeoutJob && timeoutJob.creditCost > 0) {
          const { CreditService } = await import("@/services/credit.service");
          await CreditService.refundCredits(timeoutJob.userId, timeoutJob.creditCost, jobId).catch(() => {});
        }
      }
    }, 4000);
  }
}
