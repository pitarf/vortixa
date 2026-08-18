import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
  utmContent: z.string().optional().nullable(),
  utmTerm: z.string().optional().nullable(),
  referrer: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado em nossa base." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash,
          name: validatedData.name,
          role: "USER",
          utmSource: validatedData.utmSource,
          utmMedium: validatedData.utmMedium,
          utmCampaign: validatedData.utmCampaign,
          utmContent: validatedData.utmContent,
          utmTerm: validatedData.utmTerm,
          referrer: validatedData.referrer,
        },
      });

      await tx.creditBalance.create({
        data: {
          userId: newUser.id,
          balance: 10, // 10 créditos de boas-vindas
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: newUser.id,
          amount: 10,
          type: "BONUS",
          description: "Boas-vindas",
        },
      });

      return newUser;
    });

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 }
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
