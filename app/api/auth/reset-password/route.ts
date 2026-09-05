import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token inválido ou ausente.'),
  newPassword: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres.'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = resetPasswordSchema.parse(body);

    const verification = await prisma.verificationToken.findFirst({
      where: {
        token: validatedData.token,
        expires: { gt: new Date() },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'Token de recuperação inválido ou expirado. Solicite uma nova redefinição.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: verification.identifier },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado.' },
        { status: 404 }
      );
    }

    const passwordHash = await bcrypt.hash(validatedData.newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.verificationToken.deleteMany({
        where: { identifier: verification.identifier },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso! Você já pode fazer login.',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Erro ao redefinir senha:', error);
    return NextResponse.json(
      { error: 'Servidor instável. Tente novamente em alguns instantes.' },
      { status: 500 }
    );
  }
}
