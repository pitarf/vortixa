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
        // Modelos de Edição de Imagem (Image-Edit com preservação de identidade)
        "minimax-h3/image-edit": "wavespeed-ai/minimax-h3/image-edit",
        "wavespeed-ai/minimax-h3/image-edit": "wavespeed-ai/minimax-h3/image-edit",
        "qwen-image/edit": "wavespeed-ai/qwen-image/edit",
        "wavespeed-ai/qwen-image/edit": "wavespeed-ai/qwen-image/edit",
        "qwen-image/edit-plus": "wavespeed-ai/qwen-image/edit-plus",
        "wavespeed-ai/qwen-image/edit-plus": "wavespeed-ai/qwen-image/edit-plus",
        "hidream-o1-image/edit": "wavespeed-ai/hidream-o1-image/edit",
        "wavespeed-ai/hidream-o1-image/edit": "wavespeed-ai/hidream-o1-image/edit",
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

      // Injeção de realismo fotográfico exclusiva para modelos realistas (ex: WAN 2.2 Text-to-Image)
      // O Chroma é modelo de estética 3D/videogame, não devendo receber injeção de câmera raw e 'no CGI'
      let finalPrompt = payload.inputs.prompt || "";
      if (!modelPath.includes("video") && !modelPath.includes("edit") && !modelPath.includes("chroma")) {
        // Enfatiza microtextura, pele crua, poros, iluminação natural e elimina estética plástica/render
        if (!finalPrompt.includes("pores") && !finalPrompt.includes("raw photo")) {
          finalPrompt = `${finalPrompt}, authentic raw photograph, natural unairbrushed skin texture, visible fine pores and subtle imperfections, realistic soft ambient lighting, shot on 35mm lens f/1.8, documentary boudoir style, no plastic skin, no CGI render, no doll look, 8k uhd`;
        }
      }

      // Mapeamento e adaptação dos inputs rigorosamente aderente ao schema Pydantic da WaveSpeed
      const bodyPayload: Record<string, any> = {
        prompt: finalPrompt,
      };

      const imgUrl = payload.inputs.image || payload.inputs.image_url || payload.inputs.reference_image_url;

      // Mapeamento e adaptação de dimensões (aspect ratio -> size em pixels "LARGURA*ALTURA")
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

      if (modelPath.includes("minimax-h3/image-edit")) {
        // Schema do MiniMax H3 Image Edit:
        // Obrigatórios: prompt (string), images (array de URLs, 1 a 9)
        // Opcionais: aspect_ratio (enum), resolution ("1k" | "2k"), output_format, seed
        // PROIBIDO: size, negative_prompt, ou resolutions fora do enum ["1k", "2k"]
        if (!imgUrl) {
          throw new Error("O motor MiniMax Edit requer uma foto de referência obrigatória para edição.");
        }
        bodyPayload.images = [imgUrl];

        const validAspectRatios = ["1:1", "1:2", "2:1", "1:3", "3:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "9:21", "21:9"];
        bodyPayload.aspect_ratio = validAspectRatios.includes(ratio) ? ratio : "9:16";

        const resInput = String(payload.inputs.resolution || "").toLowerCase();
        bodyPayload.resolution = (resInput === "2k" || resInput === "1080p" || resInput === "4k") ? "2k" : "1k";

        // Referenciar <Picture 1> para guiar a atenção do MiniMax H3 conforme documentação oficial
        if (!finalPrompt.includes("<Picture 1>")) {
          bodyPayload.prompt = `<Picture 1> ${finalPrompt}`;
        }
      } else if (modelPath.includes("hidream-o1-image/edit") || modelPath.includes("qwen-image/edit-plus")) {
        // Schema do HiDream O1 Edit e Qwen Edit Plus: prompt, images (array), size
        if (!imgUrl) {
          throw new Error("Este motor de edição requer uma foto de referência obrigatória.");
        }
        bodyPayload.images = [imgUrl];
        bodyPayload.size = resolvedSize;
      } else if (modelPath.includes("qwen-image/edit")) {
        // Schema do Qwen Image Edit: prompt, image (string), size
        if (!imgUrl) {
          throw new Error("Este motor de edição requer uma foto de referência obrigatória.");
        }
        bodyPayload.image = imgUrl;
        bodyPayload.size = resolvedSize;
      } else if (modelPath.includes("video") || modelPath.includes("spicy")) {
        // Modelos de Vídeo (WAN 2.2, MiniMax H3 Spicy, Seedance 2.5)
        if (imgUrl) bodyPayload.image = imgUrl;
        const resInput = payload.inputs.resolution || "720p";
        if (modelPath.includes("wan-2.2") && (resInput === "1080p" || resInput === "4k")) {
          bodyPayload.resolution = "720p";
        } else if (modelPath.includes("minimax") && resInput === "720p") {
          bodyPayload.resolution = "768p";
        } else {
          bodyPayload.resolution = resInput;
        }
        bodyPayload.duration = parseInt(String(payload.inputs.duration), 10) || 5;
      } else {
        // Modelos de Texto para Imagem (Chroma, WAN 2.2 Text-to-Image, etc.)
        bodyPayload.size = resolvedSize;
        if (payload.inputs.negative_prompt) {
          bodyPayload.negative_prompt = payload.inputs.negative_prompt;
        }
      }

      if (payload.inputs.seed !== undefined && payload.inputs.seed !== "") {
        bodyPayload.seed = Number(payload.inputs.seed);
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
        const errJson: any = await res.json().catch(() => ({}));
        console.error("[WaveSpeedAIProvider] Erro retornado pela API HTTP", res.status, errJson);
        const detailMsg =
          errJson.message ||
          errJson.error ||
          (Array.isArray(errJson.detail)
            ? errJson.detail.map((d: any) => `${d.loc ? d.loc.slice(-1) : ''}: ${d.msg || JSON.stringify(d)}`).join('; ')
            : typeof errJson.detail === 'string'
            ? errJson.detail
            : null) ||
          `HTTP ${res.status}`;
        throw new Error(`Falha no cluster neural VORTIXIA: ${detailMsg}`);
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
      const isCustomMsg = err.message?.includes("requer uma foto de referência") || err.message?.startsWith("Falha no cluster neural");
      throw new Error(isCustomMsg ? err.message : `Falha no cluster neural VORTIXIA: ${err.message}`);
    }
  }

  async cancelJob(providerJobId: string): Promise<boolean> {
    console.log(`[WaveSpeedAIProvider] Cancelar job ${providerJobId}`);
    return true;
  }

  /**
   * Monitora o status da predição na WaveSpeed e atualiza o banco de dados do VORTIXIA
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
