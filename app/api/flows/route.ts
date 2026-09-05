import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { FlowService, FlowError } from "@/services/flow.service";
import { z } from "zod";

const createFlowSchema = z.object({
  name: z.string().min(1, "O nome do fluxo é obrigatório.").max(100, "O nome deve ter no máximo 100 caracteres."),
  description: z.string().max(500, "A descrição deve ter no máximo 500 caracteres.").optional().nullable(),
  viewport: z.record(z.string(), z.any()).optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
}).strict();

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as any;
    const search = searchParams.get("search") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 20;

    const result = await FlowService.listFlows(session.user.id, {
      status,
      search,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Erro no endpoint GET /api/flows:", err);
    return NextResponse.json({ error: err.message || "Erro ao listar fluxos." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createFlowSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const flow = await FlowService.createFlow(session.user.id, parsed.data);
    return NextResponse.json(flow, { status: 201 });
  } catch (err: any) {
    console.error("Erro no endpoint POST /api/flows:", err);
    const statusCode = err instanceof FlowError ? err.statusCode : 400;
    return NextResponse.json({ error: err.message || "Erro ao criar fluxo." }, { status: statusCode });
  }
}
