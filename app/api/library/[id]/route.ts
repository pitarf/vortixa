import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

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

    // Busca o output garantindo ownership
    const output = await prisma.aIJobOutput.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!output || output.job.userId !== session.user.id) {
      return NextResponse.json({ error: "Ativo não encontrado ou sem permissão." }, { status: 404 });
    }

    // Exclui o output e o arquivo associado
    await prisma.$transaction(async (tx) => {
      await tx.aIJobOutput.delete({
        where: { id },
      });
      if (output.fileId) {
        await tx.file.delete({
          where: { id: output.fileId },
        }).catch(() => {});
      }
    });

    return NextResponse.json({ success: true, message: "Ativo removido com sucesso." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
