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

      // Sanitização específica por família de modelo fal.ai
      if (payload.modelTechnicalName.includes("flux/schnell")) {
        // FLUX Schnell aceita no máximo 12 steps (recomendado: 4)
        if (modelInputs.num_inference_steps) {
          modelInputs.num_inference_steps = Math.min(Number(modelInputs.num_inference_steps) || 4, 12);
        } else {
          modelInputs.num_inference_steps = 4;
        }
        delete modelInputs.guidance_scale;
      }

      // Modelos de Imagem que exigem aspect_ratio no lugar de image_size (ou aceitam aspect_ratio nativo)
      const requiresAspectRatio = payload.modelTechnicalName.includes("ideogram") || 
                                  payload.modelTechnicalName.includes("ultra") || 
                                  payload.modelTechnicalName.includes("nano-banana") ||
                                  payload.modelTechnicalName.includes("flux-pro");

      if (requiresAspectRatio) {
        const ratioMap: Record<string, string> = {
          "1:1": "1:1",
          "16:9": "16:9",
          "9:16": "9:16",
          "4:3": "4:3",
          "3:4": "3:4",
          "3:2": "3:2",
          "2:3": "2:3",
          "21:9": "21:9",
          "9:21": "9:21",
          square_hd: "1:1",
          square: "1:1",
          landscape_16_9: "16:9",
          portrait_16_9: "9:16",
          landscape_4_3: "4:3",
          portrait_4_3: "3:4",
          landscape_3_2: "3:2",
          portrait_3_2: "2:3",
        };

        const rawRatio = modelInputs.aspect_ratio || modelInputs.image_size || "16:9";
        modelInputs.aspect_ratio = ratioMap[rawRatio] || "16:9";
        delete modelInputs.image_size;
      }

      // Remover metadados internos da VORIXA que não fazem parte do schema da fal.ai
      delete modelInputs.style;
      delete modelInputs.resolution;

      // Kling AI (v1.5, v2.1 Pro/Master, etc.): mapeia variações de imagem e duração
      if (payload.modelTechnicalName.includes("kling")) {
        if (modelInputs.image_url && !modelInputs.prompt_image_url) {
          modelInputs.prompt_image_url = modelInputs.image_url;
        }
        if (modelInputs.prompt_image_url && !modelInputs.image_url) {
          modelInputs.image_url = modelInputs.prompt_image_url;
        }
        if (modelInputs.image && !modelInputs.prompt_image_url) {
          modelInputs.prompt_image_url = modelInputs.image;
        }
        if (modelInputs.duration) {
          modelInputs.duration = String(modelInputs.duration); // "5" ou "10"
        }
      }

      // Luma Dream Machine (Ray 2 / Ray 2 Flash), Wan 2.1 & Minimax Video: suporte flexível a image_url / prompt_image_url
      if (
        payload.modelTechnicalName.includes("luma") ||
        payload.modelTechnicalName.includes("wan") ||
        payload.modelTechnicalName.includes("minimax")
      ) {
        if (modelInputs.prompt_image_url && !modelInputs.image_url) {
          modelInputs.image_url = modelInputs.prompt_image_url;
        }
        if (modelInputs.image_url && !modelInputs.prompt_image_url) {
          modelInputs.prompt_image_url = modelInputs.image_url;
        }
      }

      // Sync / LatentSync LipSync: mapeia vídeo/imagem e áudio com todos os aliases
      if (
        payload.modelTechnicalName.includes("sync") ||
        payload.modelTechnicalName.includes("liveportrait") ||
        payload.modelTechnicalName.includes("latentsync")
      ) {
        // Redirecionamento preventivo de endpoints descontinuados da fal.ai
        if (payload.modelTechnicalName === "fal-ai/sync-v2" || payload.modelTechnicalName === "fal-ai/sync") {
          console.warn(`[FalAIProvider] Redirecionando modelo descontinuado ${payload.modelTechnicalName} para fal-ai/latentsync`);
          payload.modelTechnicalName = "fal-ai/latentsync";
        }

        // Vídeo ou Imagem de entrada
        const videoInput = modelInputs.video_url || modelInputs.video || modelInputs.face_video_url;
        const imageInput = modelInputs.image_url || modelInputs.image || modelInputs.face_image_url;
        const audioInput = modelInputs.audio_url || modelInputs.audio || modelInputs.driving_audio_url || modelInputs.audio_file;

        if (videoInput) {
          modelInputs.video = videoInput;
          modelInputs.video_url = videoInput;
        }
        if (imageInput) {
          modelInputs.image = imageInput;
          modelInputs.image_url = imageInput;
        }
        if (audioInput) {
          modelInputs.audio = audioInput;
          modelInputs.audio_url = audioInput;
          modelInputs.driving_audio_url = audioInput;
        }
      }

      // Kling Motion Control: mapeia personagem (image_url, character_image_url, image) e vídeo/pose de referência
      if (payload.modelTechnicalName.includes("motion-control")) {
        const charImg = modelInputs.character_image_url || modelInputs.image_url || modelInputs.image;
        const refVid = modelInputs.reference_video_url || modelInputs.video_url || modelInputs.video || modelInputs.pose_reference_url || modelInputs.pose_video_url;

        if (charImg) {
          modelInputs.character_image_url = charImg;
          modelInputs.image_url = charImg;
          modelInputs.image = charImg;
        }
        if (refVid) {
          modelInputs.reference_video_url = refVid;
          modelInputs.video_url = refVid;
          modelInputs.video = refVid;
        }
      }

      // Creative Upscaler: scale_factor e scale
      if (payload.modelTechnicalName.includes("upscaler") || payload.modelTechnicalName.includes("upscale")) {
        if (modelInputs.scale_factor) {
          modelInputs.scale = Number(modelInputs.scale_factor) || 2;
        } else if (!modelInputs.scale) {
          modelInputs.scale = 2;
        }
        if (modelInputs.video_url && !modelInputs.video) {
          modelInputs.video = modelInputs.video_url;
        }
        if (modelInputs.image_url && !modelInputs.image) {
          modelInputs.image = modelInputs.image_url;
        }
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

      // Inicia polling em background como safety-net resiliente (funciona tanto em localhost quanto em produção se o webhook atrasar)
      this.pollFalResultInBackground(result.request_id, payload.jobId, payload.modelTechnicalName);

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

          // Extrai URLs geradas reais (imagens ou vídeos)
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
          if ((finalResult.data as any)?.video_url) {
            outputUrls.push((finalResult.data as any).video_url);
          }
          if ((finalResult.data as any)?.output?.url) {
            outputUrls.push((finalResult.data as any).output.url);
          }
          if (typeof (finalResult.data as any)?.output === "string" && (finalResult.data as any).output.startsWith("http")) {
            outputUrls.push((finalResult.data as any).output);
          }

          const job = await prisma.aIJob.findUnique({ where: { id: jobId } });
          if (job && job.status !== "COMPLETED" && outputUrls.length > 0) {
            const { StorageService } = await import("@/services/storage.service");

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
                let finalUrl = realUrl;
                try {
                  finalUrl = await StorageService.uploadFromUrl(realUrl, isVideo ? "result.mp4" : "result.jpg");
                } catch (stErr) {
                  console.warn("Aviso ao salvar mídia localmente no StorageService:", stErr);
                }

                const file = await tx.file.create({
                  data: {
                    userId: job.userId,
                    name: `vorixa-render-${job.id.slice(0, 8)}.${isVideo ? "mp4" : "jpg"}`,
                    mimeType: isVideo ? "video/mp4" : "image/jpeg",
                    sizeBytes: 1024 * 1024 * 2,
                    url: finalUrl,
                    storageKey: `outputs/${job.userId}/vorixa-${job.id}.${isVideo ? "mp4" : "jpg"}`,
                  },
                });

                await tx.aIJobOutput.create({
                  data: {
                    jobId: job.id,
                    fileUrl: finalUrl,
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
