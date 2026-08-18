import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreditService } from "@/services/credit.service";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const balance = await CreditService.getBalance(session.user.id);
    const userRecord = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isUnlimited: true },
    });

    const tools = await prisma.aITool.findMany({
      where: { status: true },
      include: {
        model: true,
      },
    });

    return NextResponse.json({
      balance,
      creditMode: userRecord?.isUnlimited ? "UNLIMITED" : "LIMITED",
      tools,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
