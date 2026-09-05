import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { FlowExecutionService, FlowExecutionError } from "@/services/flow-execution.service";
import { z } from "zod";

const cancelFlowSchema = z.object({
  flowExecutionId: z.string().min(1, "flowExecutionId é obrigatório."),
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

    const body = await req.json();
    const parsed = cancelFlowSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const execution = await FlowExecutionService.cancelExecution(session.user.id, parsed.data.flowExecutionId);
    return NextResponse.json(execution);
  } catch (err: any) {
    const statusCode = err instanceof FlowExecutionError ? err.statusCode : 400;
    return NextResponse.json(
      { error: err.message || "Erro ao cancelar execução.", code: err.code || "CANCEL_ERROR" },
      { status: statusCode }
    );
  }
}
