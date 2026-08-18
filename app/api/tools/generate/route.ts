import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { AIService } from "@/services/ai/ai.service";
import { z } from "zod";

const generateSchema = z.object({
  toolSlug: z.string(),
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

    const job = await AIService.submitJob({
      userId: session.user.id,
      toolSlug: parsed.data.toolSlug,
      inputs: parsed.data.inputs,
      idempotencyKey: parsed.data.idempotencyKey,
    });

    return NextResponse.json(job);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
