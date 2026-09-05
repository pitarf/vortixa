import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { FlowService, FlowError } from "@/services/flow.service";
import { z } from "zod";

const updateNodeSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  positionX: z.number().optional(),
  positionY: z.number().optional(),
  config: z.record(z.string(), z.any()).optional().nullable(),
  toolSlug: z.string().max(100).optional().nullable(),
  nodeType: z.string().max(50).optional(),
}).strict();

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string; nodeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { id: flowId, nodeId } = await context.params;
    const body = await req.json();
    const parsed = updateNodeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updatedNode = await FlowService.updateNode(session.user.id, flowId, nodeId, parsed.data);
    return NextResponse.json(updatedNode);
  } catch (err: any) {
    const statusCode = err instanceof FlowError ? err.statusCode : 400;
    return NextResponse.json({ error: err.message || "Erro ao atualizar nó." }, { status: statusCode });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string; nodeId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { id: flowId, nodeId } = await context.params;
    const result = await FlowService.deleteNode(session.user.id, flowId, nodeId);

    return NextResponse.json(result);
  } catch (err: any) {
    const statusCode = err instanceof FlowError ? err.statusCode : 400;
    return NextResponse.json({ error: err.message || "Erro ao remover nó." }, { status: statusCode });
  }
}
