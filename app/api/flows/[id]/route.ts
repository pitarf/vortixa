import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { FlowService, FlowError } from "@/services/flow.service";
import { z } from "zod";

const updateFlowSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  viewport: z.record(z.string(), z.any()).optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
}).strict();

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await context.params;
    const flow = await FlowService.getFlowById(session.user.id, id);

    return NextResponse.json(flow);
  } catch (err: any) {
    const statusCode = err instanceof FlowError ? err.statusCode : 500;
    return NextResponse.json({ error: err.message || "Erro ao buscar fluxo." }, { status: statusCode });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const parsed = updateFlowSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await FlowService.updateFlow(session.user.id, id, parsed.data);
    return NextResponse.json(updated);
  } catch (err: any) {
    const statusCode = err instanceof FlowError ? err.statusCode : 400;
    return NextResponse.json({ error: err.message || "Erro ao atualizar fluxo." }, { status: statusCode });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await context.params;
    const result = await FlowService.deleteFlow(session.user.id, id);

    return NextResponse.json(result);
  } catch (err: any) {
    const statusCode = err instanceof FlowError ? err.statusCode : 400;
    return NextResponse.json({ error: err.message || "Erro ao excluir fluxo." }, { status: statusCode });
  }
}
