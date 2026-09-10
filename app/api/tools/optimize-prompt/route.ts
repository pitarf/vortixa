import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PromptEngine } from "@/services/ai/prompt-engine.service";
import { z } from "zod";

const optimizeSchema = z.object({
  prompt: z.string().min(1, "O prompt não pode estar vazio.").max(2000),
  enhanceQuality: z.boolean().default(true),
  toolType: z.enum(["image", "video", "lipsync", "motion", "upscale"]).default("image"),
  style: z.enum(["cinematic", "photorealistic", "realist", "photographic", "anime", "octane3d", "cyberpunk", "digital-art"]).optional(),
  hasReferenceImage: z.boolean().optional(),
  image_url: z.string().optional(),
  image: z.string().optional(),
  reference_image_url: z.string().optional(),
  image_urls: z.union([z.array(z.string()), z.string()]).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Sessão expirada. Faça login novamente." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = optimizeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos para otimização de prompt.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const hasReferenceImage = parsed.data.hasReferenceImage ?? Boolean(
      parsed.data.image_url ||
      parsed.data.image ||
      parsed.data.reference_image_url ||
      (Array.isArray(parsed.data.image_urls) ? parsed.data.image_urls.length > 0 : parsed.data.image_urls)
    );

    const result = await PromptEngine.optimizeAsync(parsed.data.prompt, {
      enhanceQuality: parsed.data.enhanceQuality,
      toolType: parsed.data.toolType,
      style: parsed.data.style,
      hasReferenceImage,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Erro no endpoint /api/tools/optimize-prompt:", error);
    return NextResponse.json(
      { error: "Falha interna ao otimizar prompt." },
      { status: 500 }
    );
  }
}
