import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

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
    const execution = await prisma.flowExecution.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        flow: true,
        nodeExecutions: {
          include: {
            flowNode: true,
            aiJob: true,
          },
          orderBy: { createdAt: "asc" },
        },
        creditTransactions: true,
      },
    });

    if (!execution) {
      return NextResponse.json({ error: "Execução não encontrada." }, { status: 404 });
    }

    return NextResponse.json(execution);
  } catch (err: any) {
    console.error("Erro no endpoint GET /api/flows/executions/[id]:", err);
    return NextResponse.json({ error: "Erro ao consultar execução." }, { status: 500 });
  }
}
