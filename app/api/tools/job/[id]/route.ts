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

    const job = await prisma.aIJob.findUnique({
      where: { id },
      include: { outputs: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Job não localizado." }, { status: 404 });
    }

    // Validação de Propriedade (Security Ownership Check)
    if (job.userId !== session.user.id) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    return NextResponse.json(job);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
