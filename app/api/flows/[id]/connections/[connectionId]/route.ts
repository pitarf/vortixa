import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { FlowService, FlowError } from "@/services/flow.service";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string; connectionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { id: flowId, connectionId } = await context.params;
    const result = await FlowService.deleteConnection(session.user.id, flowId, connectionId);

    return NextResponse.json(result);
  } catch (err: any) {
    const statusCode = err instanceof FlowError ? err.statusCode : 400;
    return NextResponse.json({ error: err.message || "Erro ao remover conexão." }, { status: statusCode });
  }
}
