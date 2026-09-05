import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { FlowExecutionService, FlowExecutionError } from "@/services/flow-execution.service";
import { z } from "zod";

const executeFlowSchema = z.object({
  idempotencyKey: z.string().optional(),
  initialInputs: z.record(z.string(), z.any()).optional(),
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
    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const parsed = executeFlowSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const result = await FlowExecutionService.executeFlow(session.user.id, flowId, parsed.data);
    return NextResponse.json(result.execution, { status: 200 });
  } catch (err: any) {
    console.error("Erro no endpoint POST /api/flows/[id]/execute:", err);
    const statusCode = err instanceof FlowExecutionError ? err.statusCode : 400;
    return NextResponse.json(
      { error: err.message || "Erro ao iniciar execução do fluxo.", code: err.code || "EXECUTION_ERROR" },
      { status: statusCode }
    );
  }
}
