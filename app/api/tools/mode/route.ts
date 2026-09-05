import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const setting = await prisma.systemSetting.findUnique({
      where: { key: "ai_provider_mode" },
    });

    const currentMode = setting?.value || process.env.AI_PROVIDER_MODE || "live";

    return NextResponse.json({ mode: currentMode });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const { mode } = body;

    if (mode !== "live" && mode !== "mock") {
      return NextResponse.json({ error: "Modo inválido. Use 'live' ou 'mock'." }, { status: 400 });
    }

    // Salva no banco de dados
    await prisma.systemSetting.upsert({
      where: { key: "ai_provider_mode" },
      update: { value: mode },
      create: { key: "ai_provider_mode", value: mode },
    });

    // Também atualiza a variável em tempo de execução
    process.env.AI_PROVIDER_MODE = mode;

    console.log(`\n🔀 [MODO DE IA ALTERADO]: ${mode.toUpperCase()} (pelo usuário ${session.user.email})`);

    return NextResponse.json({ success: true, mode });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
