import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { FlowService, FlowError } from "@/services/flow.service";
import { z } from "zod";

const createConnectionSchema = z.object({
  sourceNodeId: z.string().min(1, "sourceNodeId é obrigatório."),
  sourceHandle: z.string().min(1, "sourceHandle é obrigatório.").max(100),
  targetNodeId: z.string().min(1, "targetNodeId é obrigatório."),
  targetHandle: z.string().min(1, "targetHandle é obrigatório.").max(100),
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
    const parsed = createConnectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const connection = await FlowService.createConnection(session.user.id, flowId, parsed.data);
    return NextResponse.json(connection, { status: 201 });
  } catch (err: any) {
    const statusCode = err instanceof FlowError ? err.statusCode : 400;
    return NextResponse.json({ error: err.message || "Erro ao criar conexão." }, { status: statusCode });
  }
}
