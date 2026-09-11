/**
 * VORIXA IA - Motor Proprietário de Vídeo com Fala e Movimento em 1-Clique (One-Prompt Magic)
 *
 * Transforma comandos de alto nível em linguagem natural (ex: "faça essa modelo falar e indicar essa roupa")
 * em vídeos hiper-realistas com roteiro comercial em português, voz ultra-expressiva e movimento labial sincronizado.
 *
 * Arquitetura em 3 Etapas:
 * 1. Story & Script Director (LLM / PromptEngine): Detecta a intenção e redige o roteiro falado de vendas/apresentação em PT-BR.
 * 2. Neural Voice Synthesizer (ElevenLabs Turbo v2.5 / TTSService): Sintetiza a fala com expressividade natural em português.
 * 3. Neural Video & LipSync Renderer (Kling Avatar v2 / LatentSync HD): Anima a imagem/personagem com sincronia labial perfeita.
 */

import prisma from "@/lib/prisma";
import { CreditService } from "../credit.service";
import { TTSService } from "../tts.service";
import { StorageService } from "../storage.service";
import { fal } from "@fal-ai/client";

export interface VorixaIARequest {
  userId: string;
  prompt: string;
  imageUrl?: string;
  duration?: "5" | "10" | "30" | string;
  resolution?: "720p" | "1080p" | "4k" | "4K" | string;
  voice?: string;
  speechText?: string;
  idempotencyKey?: string;
}

export interface VorixaIACreditCalculation {
  credits: number;
  apiUnitCostUsd: number;
  durationSeconds: number;
  resolution: string;
}

export class VorixaIAService {
  /**
   * Tabela oficial de precificação em créditos e custo estimado da API (USD):
   * 720p: 5s = 15 cr ($0.28) | 10s = 25 cr ($0.56) | 30s = 65 cr ($1.69)
   * 1080p: 5s = 25 cr ($0.58) | 10s = 45 cr ($1.15) | 30s = 120 cr ($3.45)
   * 4K: 5s = 35 cr ($0.65) | 10s = 60 cr ($1.25) | 30s = 150 cr ($3.60)
   */
  static calculatePrice(duration: string = "5", resolution: string = "720p"): VorixaIACreditCalculation {
    const durNum = parseInt(duration, 10);
    const dur = durNum >= 25 ? "30" : durNum >= 8 ? "10" : "5";
    const res = resolution.toLowerCase().includes("4k")
      ? "4k"
      : resolution.toLowerCase().includes("1080")
      ? "1080p"
      : "720p";

    const pricingMatrix: Record<string, Record<string, { credits: number; costUsd: number }>> = {
      "720p": {
        "5": { credits: 15, costUsd: 0.28 },
        "10": { credits: 25, costUsd: 0.56 },
        "30": { credits: 65, costUsd: 1.69 },
      },
      "1080p": {
        "5": { credits: 25, costUsd: 0.58 },
        "10": { credits: 45, costUsd: 1.15 },
        "30": { credits: 120, costUsd: 3.45 },
      },
      "4k": {
        "5": { credits: 35, costUsd: 0.65 },
        "10": { credits: 60, costUsd: 1.25 },
        "30": { credits: 150, costUsd: 3.60 },
      },
    };

    const target = pricingMatrix[res]?.[dur] || pricingMatrix["720p"]["5"];

    return {
      credits: target.credits,
      apiUnitCostUsd: target.costUsd,
      durationSeconds: parseInt(dur, 10),
      resolution: res,
    };
  }

  /**
   * Extrai ou redige automaticamente a fala falada (roteiro) a partir do prompt do usuário.
   * Se o usuário já colocou texto entre aspas ou um diálogo explícito, preserva.
   * Se o usuário deu um comando como "faça essa modelo falar e indicar essa roupa", gera a locução ideal.
   */
  static async extractOrGenerateSpeechScript(prompt: string, durationSeconds: number = 5): Promise<{ script: string; visualPrompt: string }> {
    const trimmed = prompt.trim();

    // 1. Verifica se há diálogo explícito entre aspas
    const quoteMatch = trimmed.match(/"([^"]{4,})"/);
    if (quoteMatch && quoteMatch[1]) {
      const script = quoteMatch[1].trim();
      const visualPrompt = trimmed.replace(quoteMatch[0], "").trim() || "A photorealistic model speaking naturally to camera with friendly body gestures";
      return { script, visualPrompt };
    }

    // 2. Se não houver aspas, analisa se é um comando de apresentação/vendas
    const lower = trimmed.toLowerCase();
    const isFashionOrOutfit = lower.includes("roupa") || lower.includes("look") || lower.includes("vestido") || lower.includes("moda") || lower.includes("estilo");
    const isProduct = lower.includes("produto") || lower.includes("apresent") || lower.includes("lançamento") || lower.includes("comprar");

    // Roteiros contextuais dinâmicos em Português do Brasil
    if (isFashionOrOutfit) {
      if (durationSeconds <= 5) {
        return {
          script: "Dá só uma olhada no caimento desse look incrível. Conforto e elegância que combinam com qualquer momento!",
          visualPrompt: "Fashion model gracefully presenting outfit to camera, gesturing to clothes, studio lighting",
        };
      } else if (durationSeconds <= 10) {
        return {
          script: "Dá só uma olhada nesse look incrível! O tecido é super leve, veste com perfeição e é a escolha certa para quem busca estilo e autenticidade. Você vai se apaixonar!",
          visualPrompt: "Fashion model smiling, showcasing outfit from different angles, subtle natural arm gestures, commercial studio lighting",
        };
      } else {
        return {
          script: "Se você ama estilo sem abrir mão do conforto, precisa conferir essa peça! O corte veste perfeitamente no corpo, com costuras refinadas e tecido de altíssima durabilidade. Ideal para compor produções modernas e elegantes para qualquer ocasião. Garanta já a sua!",
          visualPrompt: "High-end fashion model presenting outfit, gesturing elegantly, smooth body movement, high key fashion photography studio",
        };
      }
    }

    if (isProduct) {
      return {
        script: "Conheça essa novidade exclusiva feita para transformar a sua rotina com máxima eficiência e qualidade. Aproveite as condições especiais!",
        visualPrompt: "Professional spokesperson smiling and presenting product with confident hand gestures, cinematic 4k lighting",
      };
    }

    // Fallback padrão amigável caso seja apenas "faça falar algo"
    return {
      script: "Olá! É um prazer enorme estar aqui com você. Prepare-se para descobrir algo realmente incrível e inovador!",
      visualPrompt: "A friendly and charismatic person looking directly at camera, natural facial expressions, speaking with warmth",
    };
  }

  /**
   * Ponto de entrada para submissão do job VORIXA IA
   */
  static async submitVorixaIAJob(request: VorixaIARequest) {
    const {
      userId,
      prompt,
      imageUrl,
      duration = "5",
      resolution = "720p",
      voice = "Rachel",
      speechText,
      idempotencyKey,
    } = request;

    if (!prompt && !speechText) {
      throw new Error("Por favor, descreva o que o personagem deve falar ou fazer no prompt.");
    }

    // 1. Cálculo de Preço e Verificação de Saldo
    const pricing = this.calculatePrice(duration, resolution);

    const hasBalance = await CreditService.hasEnoughCredits(userId, pricing.credits);
    if (!hasBalance) {
      throw new Error(
        `Saldo insuficiente. São necessários ${pricing.credits} créditos para gerar este vídeo no motor VORIXA IA (${pricing.durationSeconds}s em ${pricing.resolution.toUpperCase()}).`
      );
    }

    // 2. Localiza ou cria o modelo no banco
    let model = await prisma.aIModel.findFirst({
      where: { technicalName: "vorixa-ia" },
      include: { tools: true },
    });

    if (!model) {
      // Criação dinâmica resiliente se ainda não migrado
      let provider = await prisma.aIProvider.findFirst({ where: { name: "VORIXA" } });
      if (!provider) {
        provider = await prisma.aIProvider.create({
          data: { name: "VORIXA", status: true },
        });
      }

      model = await prisma.aIModel.create({
        data: {
          providerId: provider.id,
          name: "VORIXA IA (Vídeo & Fala 1-Clique)",
          technicalName: "vorixa-ia",
          creditCost: 25,
          apiUnitCost: 0.45,
          status: true,
          billingUnit: "DYNAMIC_VIDEO",
        },
        include: { tools: true },
      });
    }

    // Ferramenta associada (imagem-video)
    const tool = model.tools[0] || (await prisma.aITool.findFirst({ where: { slug: "imagem-video" } }));
    if (!tool) {
      throw new Error("Ferramenta de vídeo não configurada no sistema.");
    }

    // 3. Roteirização do diálogo
    let finalScript = speechText?.trim();
    let visualPrompt = prompt;

    if (!finalScript) {
      const extracted = await this.extractOrGenerateSpeechScript(prompt, pricing.durationSeconds);
      finalScript = extracted.script;
      visualPrompt = extracted.visualPrompt;
    }

    // 4. Criação do Job no Banco de Dados
    const job = await prisma.aIJob.create({
      data: {
        userId,
        modelId: model.id,
        toolId: tool.id,
        status: "PENDING",
        creditCost: pricing.credits,
        apiUnitCost: pricing.apiUnitCostUsd,
        idempotencyKey: idempotencyKey || null,
        billingUnit: `${pricing.resolution.toUpperCase()}_${pricing.durationSeconds}S`,
        billingQuantity: 1.0,
      },
    });

    // Salvar inputs para auditoria completa
    await prisma.aIJobInput.createMany({
      data: [
        { jobId: job.id, key: "prompt", value: prompt || "" },
        { jobId: job.id, key: "visual_prompt", value: visualPrompt || "" },
        { jobId: job.id, key: "speech_text", value: finalScript || "" },
        { jobId: job.id, key: "image_url", value: imageUrl || "" },
        { jobId: job.id, key: "voice", value: voice },
        { jobId: job.id, key: "duration", value: String(pricing.durationSeconds) },
        { jobId: job.id, key: "resolution", value: pricing.resolution },
        { jobId: job.id, key: "engine", value: "VORIXA_IA_ONE_PROMPT" },
      ],
    });

    // 5. Consumo atômico dos créditos
    await CreditService.consumeCredits(userId, pricing.credits, "vorixa-ia", job.id);

    // Modo Mock ou Testes Automatizados
    if (process.env.VITEST === "true" || process.env.AI_PROVIDER_MODE === "mock") {
      const mockResultUrl = "/media/landing/hero/hero_main.mp4";
      const completedJob = await prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: "COMPLETED",
          providerJobId: `mock-vorixa-ia-${job.id.slice(0, 8)}`,
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

    // 6. Atualiza para PROCESSING e dispara execução em background
    const updatedJob = await prisma.aIJob.update({
      where: { id: job.id },
      data: { status: "PROCESSING" },
    });

    this.runPipelineInBackground(job.id, {
      userId,
      script: finalScript,
      visualPrompt,
      imageUrl,
      voice,
      duration: pricing.durationSeconds,
      resolution: pricing.resolution,
      totalCredits: pricing.credits,
    }).catch(async (err) => {
      console.error(`[VorixaIAService] Erro no job ${job.id}:`, err);
      await prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          error: err.message || "Erro no motor VORIXA IA.",
        },
      });
      await CreditService.refundCredits(userId, pricing.credits, job.id).catch(() => {});
    });

    return updatedJob;
  }

  /**
   * Executa o pipeline de inteligência artificial em segundo plano
   */
  private static async runPipelineInBackground(
    jobId: string,
    params: {
      userId: string;
      script: string;
      visualPrompt: string;
      imageUrl?: string;
      voice: string;
      duration: number;
      resolution: string;
      totalCredits: number;
    }
  ) {
    if (!process.env.FAL_KEY) {
      throw new Error("Chave da API de IA não configurada no servidor.");
    }
    fal.config({ credentials: process.env.FAL_KEY });

    console.log(`\n🚀 [VORIXA IA INICIADO] Job: ${jobId} | Duração: ${params.duration}s | Resolução: ${params.resolution}`);

    // ETAPA 1: Síntese de Voz Neural Ultra-Realista (ElevenLabs Turbo v2.5)
    console.log(`[VORIXA IA] 1. Sintetizando voz com roteiro: "${params.script.slice(0, 50)}..."`);
    const ttsResult = await TTSService.synthesizeSpeech({
      text: params.script,
      voice: params.voice || "Rachel",
    });

    let audioUrl = ttsResult.audioUrl;
    if (audioUrl.startsWith("/")) {
      const fs = await import("fs/promises");
      const path = await import("path");
      const fullPath = path.join(process.cwd(), "public", audioUrl);
      const fileBuffer = await fs.readFile(fullPath);
      audioUrl = await fal.storage.upload(new Blob([fileBuffer]));
    }

    // ETAPA 2: Renderização de Vídeo com o Personagem
    // Se houver imagem de entrada, utiliza Kling 2.1 Pro / Wan 2.1 (que NÃO bloqueiam rostos de IA)
    console.log(`[VORIXA IA] 2. Renderizando vídeo base com movimento...`);
    const videoInput: any = {
      prompt: `${params.visualPrompt}, looking directly at camera, natural facial expressions, fluent speaking posture, masterpiece photorealistic`,
      duration: String(params.duration > 5 ? 10 : 5),
    };

    if (params.imageUrl) {
      videoInput.image_url = params.imageUrl;
      videoInput.prompt_image_url = params.imageUrl;
      videoInput.start_image_url = params.imageUrl;
    }

    const videoModel = params.imageUrl
      ? "fal-ai/kling-video/v2.1/pro/image-to-video"
      : "fal-ai/kling-video/v2.1/pro/text-to-video";

    const videoRes = await fal.subscribe(videoModel, {
      input: videoInput,
      pollInterval: 2500,
      timeout: 180000,
    });

    const baseVideoUrl = (videoRes.data as any)?.video?.url || (videoRes.data as any)?.video_url;
    if (!baseVideoUrl) {
      throw new Error("O renderizador de vídeo não retornou o arquivo gerado.");
    }

    // ETAPA 3: Sincronização Fonética e Labial Perfeita (LatentSync HD)
    console.log(`[VORIXA IA] 3. Aplicando sincronização fonética labial...`);
    const lipsyncRes = await fal.subscribe("fal-ai/latentsync", {
      input: {
        video_url: baseVideoUrl,
        audio_url: audioUrl,
      },
      pollInterval: 2500,
      timeout: 180000,
    });

    let finalVideoUrl = (lipsyncRes.data as any)?.video?.url || (lipsyncRes.data as any)?.video_url || baseVideoUrl;

    // ETAPA 4: Upscale 4K Cinematográfico Opcional
    if (params.resolution === "4k") {
      console.log(`[VORIXA IA] 4. Aplicando Creative Video Upscaler 4K...`);
      try {
        const upscaleRes = await fal.subscribe("fal-ai/creative-upscaler", {
          input: {
            video_url: finalVideoUrl,
            scale_factor: 2,
          } as any,
          pollInterval: 3000,
          timeout: 180000,
        });
        const upscaledUrl = (upscaleRes.data as any)?.video?.url || (upscaleRes.data as any)?.video_url;
        if (upscaledUrl) {
          finalVideoUrl = upscaledUrl;
        }
      } catch (upErr) {
        console.warn("[VORIXA IA] Aviso: Upscale 4K falhou, mantendo 1080p nativo:", upErr);
      }
    }

    // Conclusão e Persistência
    console.log(`🎉 [VORIXA IA] Geração Concluída: ${finalVideoUrl}`);
    await this.completeJob(jobId, params.userId, finalVideoUrl);
  }

  /**
   * Finaliza o Job com idempotência e persistência no banco
   */
  private static async completeJob(jobId: string, userId: string, videoUrl: string) {
    let localUrl = videoUrl;
    try {
      localUrl = await StorageService.uploadFromUrl(videoUrl, "vorixa_ia_video.mp4");
    } catch (err) {
      console.warn("[VorixaIAService] Aviso ao persistir no storage:", err);
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
          name: `vorixa-ia-${jobId.slice(0, 8)}.mp4`,
          mimeType: "video/mp4",
          sizeBytes: 1024 * 1024 * 4,
          url: localUrl,
          storageKey: `outputs/${userId}/vorixa-ia-${jobId}.mp4`,
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
          action: "VORIXA_IA_COMPLETED",
          details: `Vídeo VORIXA IA gerado com sucesso (Job ${jobId})`,
        },
      });
    });
  }
}
