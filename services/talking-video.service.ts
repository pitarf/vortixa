import prisma from "@/lib/prisma";
import { CreditService } from "./credit.service";
import { TTSService } from "./tts.service";
import { fal } from "@fal-ai/client";
import { StorageService } from "./storage.service";

export interface TalkingVideoRequest {
  userId: string;
  videoModelId?: string; // ex: fal-ai/kling-video/v2.1/pro/image-to-video
  prompt: string;
  imageUrl?: string;
  speechText?: string;
  audioUrl?: string;
  voice?: string;
  duration?: string;
  idempotencyKey?: string;
}

export interface TalkingVideoResult {
  jobId: string;
  videoUrl?: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  totalCost: number;
}

/**
 * Orquestrador de Vídeo com Fala Integrada (One-Shot Talking Video).
 * Executa o pipeline automatizado em 1 clique:
 * 1. Síntese de Fala Neural PT-BR (ou reutilização de áudio existente).
 * 2. Geração do Vídeo Base (Kling 2.1 Pro, Luma Ray 2, Wan 2.1, etc.).
 * 3. Sincronia Labial Pro (LatentSync) unindo a mídia de vídeo e o áudio.
 * 4. Registro no Ledger de Créditos e Storage com atomicidade.
 */
export class TalkingVideoService {
  /**
   * Calcula o custo total combinado em créditos.
   */
  static async calculateTotalCost(videoModelId: string, hasSpeech: boolean): Promise<number> {
    const videoModel = await prisma.aIModel.findUnique({
      where: { id: videoModelId },
    });

    const videoCost = videoModel?.creditCost || 10;
    // LipSync (8 créditos) + TTS (1 crédito se gerado por texto)
    const audioLipSyncCost = hasSpeech ? 9 : 0;
    return videoCost + audioLipSyncCost;
  }

  /**
   * Processa a criação e orquestração do vídeo falante.
   */
  static async createTalkingVideoJob(request: TalkingVideoRequest) {
    const {
      userId,
      videoModelId = "fal-ai/kling-video/v2.1/pro/image-to-video",
      prompt,
      imageUrl,
      speechText,
      audioUrl,
      voice = "pt-BR-FranciscaNeural",
      duration = "5",
      idempotencyKey,
    } = request;

    const hasAudioPipeline = Boolean((speechText && speechText.trim()) || audioUrl);

    // 1. Resolver modelo de vídeo (por id ou technicalName)
    let model = await prisma.aIModel.findFirst({
      where: {
        OR: [
          { id: videoModelId },
          { technicalName: videoModelId },
        ],
        status: true,
      },
      include: { tools: true },
    });

    if (!model) {
      model = await prisma.aIModel.findFirst({
        where: { technicalName: { contains: "kling" }, status: true },
        include: { tools: true },
      });
    }

    if (!model || !model.status) {
      throw new Error("Motor de vídeo indisponível no momento.");
    }

    // Ferramenta associada (imagem-video)
    const tool = model.tools[0] || (await prisma.aITool.findFirst({ where: { slug: "imagem-video" } }));
    if (!tool) {
      throw new Error("Ferramenta de vídeo não configurada no sistema.");
    }

    // 2. Cálculo do Custo Total Transacional
    const videoCost = model.creditCost;
    const additionalCost = hasAudioPipeline ? (speechText ? 9 : 8) : 0;
    const totalCost = videoCost + additionalCost;

    // 3. Validação de Saldo
    const hasEnough = await CreditService.hasEnoughCredits(userId, totalCost);
    if (!hasEnough) {
      throw new Error(`Saldo insuficiente. São necessários ${totalCost} créditos para gerar o vídeo falante completo.`);
    }

    // 4. Criação do Job Principal
    const job = await prisma.aIJob.create({
      data: {
        userId,
        modelId: model.id,
        toolId: tool.id,
        status: "PENDING",
        creditCost: totalCost,
        apiUnitCost: model.apiUnitCost,
        idempotencyKey: idempotencyKey || null,
        billingUnit: "TALKING_VIDEO_BUNDLE",
        billingQuantity: 1.0,
      },
    });

    // Salvar inputs para auditoria e histórico
    await prisma.aIJobInput.createMany({
      data: [
        { jobId: job.id, key: "prompt", value: prompt || "" },
        { jobId: job.id, key: "image_url", value: imageUrl || "" },
        { jobId: job.id, key: "speech_text", value: speechText || "" },
        { jobId: job.id, key: "voice", value: voice },
        { jobId: job.id, key: "duration", value: String(duration) },
        { jobId: job.id, key: "is_talking_video", value: hasAudioPipeline ? "true" : "false" },
      ],
    });

    // 5. Debitar créditos no Ledger
    await CreditService.consumeCredits(userId, totalCost, "talking-video", job.id);

    // Se estiver em modo mock ou teste vitest, conclui de forma simulada e rápida
    if (process.env.VITEST === "true" || process.env.AI_PROVIDER_MODE === "mock") {
      const mockResultUrl = "/media/landing/hero/hero_main.mp4";
      const completedJob = await prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: "COMPLETED",
          providerJobId: `mock-talking-${job.id.slice(0, 8)}`,
        },
        include: { outputs: true },
      });

      await prisma.aIJobOutput.create({
        data: {
          jobId: job.id,
          fileUrl: mockResultUrl,
        },
      });

      return {
        ...completedJob,
        outputs: [{ fileUrl: mockResultUrl }],
      };
    }

    // 6. Atualizar para PROCESSING e delegar ao worker assíncrono
    const updatedJob = await prisma.aIJob.update({
      where: { id: job.id },
      data: { status: "PROCESSING" },
    });

    // Dispara a orquestração em background
    this.runPipelineInBackground(job.id, {
      userId,
      prompt,
      imageUrl,
      speechText,
      audioUrl,
      voice,
      duration,
      videoModelTechnicalName: model.technicalName,
      totalCost,
    }).catch(async (err) => {
      console.error(`[TalkingVideoService] Erro crítico no pipeline do Job ${job.id}:`, err);
      await prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          error: err.message || "Erro na geração do vídeo falante.",
        },
      });
      await CreditService.refundCredits(userId, totalCost, job.id);
    });

    return updatedJob;
  }

  /**
   * Executa os passos pesados de IA (Vídeo -> Áudio/TTS -> LatentSync LipSync).
   */
  private static async runPipelineInBackground(jobId: string, params: {
    userId: string;
    prompt: string;
    imageUrl?: string;
    speechText?: string;
    audioUrl?: string;
    voice?: string;
    duration?: string;
    videoModelTechnicalName: string;
    totalCost: number;
  }) {
    if (!process.env.FAL_KEY) {
      throw new Error("Chave da API da fal.ai não configurada.");
    }
    fal.config({ credentials: process.env.FAL_KEY });

    console.log(`\n🎬 [TALKING VIDEO PIPELINE INICIADO] Job ID: ${jobId}`);

    // Passo A: Gerar Áudio Neural se texto foi enviado
    let finalAudioUrl = params.audioUrl;
    if (!finalAudioUrl && params.speechText && params.speechText.trim()) {
      console.log(`[Talking Video] Passo 1: Sintetizando áudio neural com texto: "${params.speechText.slice(0, 40)}..."`);
      const ttsResult = await TTSService.synthesizeSpeech({
        text: params.speechText.trim(),
        voice: params.voice || "pt-BR-FranciscaNeural",
      });
      finalAudioUrl = ttsResult.audioUrl;
    }

    // Passo B: Gerar Vídeo Base
    console.log(`[Talking Video] Passo 2: Gerando vídeo base com modelo ${params.videoModelTechnicalName}...`);
    const videoInput: any = {
      prompt: params.prompt || "A realistic human looking at camera, speaking naturally, high quality portrait",
      duration: String(params.duration || "5"),
    };
    if (params.imageUrl) {
      videoInput.image_url = params.imageUrl;
      videoInput.prompt_image_url = params.imageUrl;
    }

    const videoRes = await fal.subscribe(params.videoModelTechnicalName, {
      input: videoInput,
      pollInterval: 2500,
      timeout: 180000,
    });

    const baseVideoUrl = (videoRes.data as any)?.video?.url || (videoRes.data as any)?.video_url;
    if (!baseVideoUrl) {
      throw new Error("O motor de vídeo não retornou o arquivo de vídeo renderizado.");
    }
    console.log(`[Talking Video] Vídeo base renderizado com sucesso: ${baseVideoUrl}`);

    // Se NÃO foi solicitado áudio de fala, o vídeo base já é o resultado final
    if (!finalAudioUrl) {
      await this.completeJob(jobId, params.userId, baseVideoUrl);
      return;
    }

    // Se o áudio for local (ex: /uploads/...), enviar para fal.storage para ser acessível pela nuvem
    if (finalAudioUrl && finalAudioUrl.startsWith("/")) {
      const fs = await import("fs/promises");
      const path = await import("path");
      const fullPath = path.join(process.cwd(), "public", finalAudioUrl);
      const fileBuffer = await fs.readFile(fullPath);
      const uploadedAudio = await fal.storage.upload(new Blob([fileBuffer]));
      finalAudioUrl = uploadedAudio;
      console.log(`[Talking Video] Áudio local enviado para fal.storage: ${finalAudioUrl}`);
    }

    // Passo C: Sincronia Labial Pro (LatentSync)
    console.log(`[Talking Video] Passo 3: Executando sincronia labial com fal-ai/latentsync...`);
    const lipsyncRes = await fal.subscribe("fal-ai/latentsync", {
      input: {
        video_url: baseVideoUrl,
        audio_url: finalAudioUrl,
      },
      pollInterval: 2500,
      timeout: 180000,
    });

    const finalSyncedVideoUrl = (lipsyncRes.data as any)?.video?.url || (lipsyncRes.data as any)?.video_url;
    if (!finalSyncedVideoUrl) {
      throw new Error("A sincronia labial falhou ao produzir o vídeo final.");
    }

    console.log(`🎉 [Talking Video] Vídeo Falante Concluído com Sucesso: ${finalSyncedVideoUrl}`);
    await this.completeJob(jobId, params.userId, finalSyncedVideoUrl);
  }

  /**
   * Finaliza o job, salva a mídia no Storage e registra auditoria.
   */
  private static async completeJob(jobId: string, userId: string, videoUrl: string) {
    let localUrl = videoUrl;
    try {
      localUrl = await StorageService.uploadFromUrl(videoUrl, "talking_video.mp4");
    } catch (stErr) {
      console.warn("[TalkingVideoService] Aviso ao persistir no Storage local:", stErr);
    }

    await prisma.$transaction(async (tx) => {
      await tx.aIJob.update({
        where: { id: jobId },
        data: {
          status: "COMPLETED",
          billingQuantity: 1.0,
        },
      });

      const file = await tx.file.create({
        data: {
          userId,
          name: `talking-video-${jobId.slice(0, 8)}.mp4`,
          mimeType: "video/mp4",
          sizeBytes: 1024 * 1024 * 3,
          url: localUrl,
          storageKey: `outputs/${userId}/talking-video-${jobId}.mp4`,
        },
      });

      await tx.aIJobOutput.create({
        data: {
          jobId,
          fileUrl: localUrl,
          fileId: file.id,
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: "TALKING_VIDEO_COMPLETED",
          details: `Vídeo falante one-shot gerado com sucesso (Job ${jobId})`,
        },
      });
    });
  }
}
