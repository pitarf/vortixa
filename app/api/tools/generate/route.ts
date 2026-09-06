import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { AIService } from "@/services/ai/ai.service";
import { z } from "zod";

const generateSchema = z.object({
  toolSlug: z.string(),
  modelId: z.string().optional(),
  inputs: z.record(z.string(), z.any()),
  idempotencyKey: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
    }

    // Validação de segurança adicional: tamanho máximo de strings de entrada (limite de 10.000 caracteres)
    for (const key in parsed.data.inputs) {
      const val = parsed.data.inputs[key];
      if (typeof val === "string" && val.length > 10000) {
        return NextResponse.json({ error: "O tamanho do input excede o limite permitido de 10.000 caracteres." }, { status: 400 });
      }
    }

    // Se for uma requisição de vídeo com fala/áudio (One-Shot Talking Video)
    const isTalkingVideo =
      parsed.data.inputs?.is_talking_video === true ||
      Boolean(parsed.data.inputs?.speech_text && parsed.data.inputs.speech_text.trim());

    let job;
    if (isTalkingVideo) {
      const { TalkingVideoService } = await import("@/services/talking-video.service");
      job = await TalkingVideoService.createTalkingVideoJob({
        userId: session.user.id,
        videoModelId: parsed.data.modelId,
        prompt: parsed.data.inputs.prompt || "",
        imageUrl: parsed.data.inputs.image_url || parsed.data.inputs.prompt_image_url,
        speechText: parsed.data.inputs.speech_text,
        audioUrl: parsed.data.inputs.audio_url,
        voice: parsed.data.inputs.voice,
        duration: parsed.data.inputs.duration || "5",
        idempotencyKey: parsed.data.idempotencyKey,
      });
    } else {
      job = await AIService.submitJob({
        userId: session.user.id,
        toolSlug: parsed.data.toolSlug,
        modelId: parsed.data.modelId,
        inputs: parsed.data.inputs,
        idempotencyKey: parsed.data.idempotencyKey,
      });
    }

    console.log(`\n🚀 [POST /api/tools/generate SUCESSO] Job ID: ${job.id} | Status: ${job.status} | Talking: ${isTalkingVideo}`);

    return NextResponse.json(job);
  } catch (err: any) {
    console.error("Erro no endpoint POST /api/tools/generate:", err);
    // Preservar erros de negócio limpos que devem ser mostrados ao usuário
    const isBusinessError = err.message && (
      err.message.includes("crédito") ||
      err.message.includes("saldo") ||
      err.message.includes("desativada") ||
      err.message.includes("Não autorizado") ||
      err.message.includes("excede")
    );
    const msg = isBusinessError ? err.message : "Ocorreu um erro de processamento da geração de IA.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
