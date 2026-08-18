import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const recoverySchema = z.object({
  email: z.string().email("E-mail inválido."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = recoverySchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Este e-mail não está cadastrado em nossa base." },
        { status: 404 }
      );
    }

    // Mock de envio de e-mail de recuperação
    return NextResponse.json(
      { message: "Instruções de recuperação enviadas para o seu e-mail." },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Servidor instável. Tente novamente em alguns instantes." },
      { status: 500 }
    );
  }
}
