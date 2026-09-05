import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { FlowService, FlowError } from "@/services/flow.service";
import { z } from "zod";

const createNodeSchema = z.object({
  nodeType: z.string().min(1, "O tipo do nó é obrigatório.").max(50),
  toolSlug: z.string().max(100).optional().nullable(),
  title: z.string().min(1, "O título do nó é obrigatório.").max(100),
  positionX: z.number(),
  positionY: z.number(),
  config: z.record(z.string(), z.any()).optional().nullable(),
}).strict();

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { id: flowId } = await context.params;
    const body = await req.json();
    const parsed = createNodeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const node = await FlowService.createNode(session.user.id, flowId, parsed.data);
    return NextResponse.json(node, { status: 201 });
  } catch (err: any) {
    const statusCode = err instanceof FlowError ? err.statusCode : 400;
    return NextResponse.json({ error: err.message || "Erro ao adicionar nó ao fluxo." }, { status: statusCode });
  }
}
