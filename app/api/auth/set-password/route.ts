import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const setPasswordSchema = z.object({
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  confirmPassword: z.string().min(6, "A confirmação de senha é obrigatória."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Sessão não autenticada ou expirada." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = setPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Dados inválidos." },
        { status: 400 }
      );
    }

    const { password } = validated.data;

    // Buscar usuário para garantir integridade
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, passwordHash: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado na base de dados." },
        { status: 404 }
      );
    }

    // Criptografar nova senha com salt seguro (12 rounds)
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Senha configurada com sucesso! Agora você pode acessar com Google ou E-mail + Senha.",
    });
  } catch (error: any) {
    console.error("❌ [SET_PASSWORD_ERROR]:", error);
    return NextResponse.json(
      { error: "Servidor instável ao gravar nova senha. Tente novamente em alguns instantes." },
      { status: 500 }
    );
  }
}
