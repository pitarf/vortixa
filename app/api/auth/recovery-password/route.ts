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

    // Para evitar enumeração de usuários (OWASP), se não existir usuário, retorna sucesso genérico
    if (!user) {
      return NextResponse.json(
        { message: "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação." },
        { status: 200 }
      );
    }

    // Gerar token criptográfico seguro com validade de 1 hora
    const crypto = await import("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hora

    // Deletar tokens antigos deste e-mail para evitar colisões
    await prisma.verificationToken.deleteMany({
      where: { identifier: validatedData.email },
    });

    // Salvar novo token de verificação no banco
    await prisma.verificationToken.create({
      data: {
        identifier: validatedData.email,
        token,
        expires,
      },
    });

    // Disparar e-mail real com a identidade visual do VORTIXIA via SMTP Hostinger
    const { EmailService } = await import("@/services/email.service");
    await EmailService.sendPasswordRecovery(validatedData.email, token);

    return NextResponse.json(
      { message: "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação." },
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
