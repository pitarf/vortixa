import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// Chaves de branding permitidas e validadas
const ALLOWED_KEYS = [
  "siteTitle",
  "siteDescription",
  "siteKeywords",
  "faviconUrl",
  "ogImageUrl",
];

// Helper para sanitizar strings e prevenir ataques de injeção ou caracteres de controle perigosos
function sanitizeValue(key: string, val: string): string {
  if (typeof val !== "string") return "";
  const trimmed = val.trim();

  // Validação de URLs (favicon e open graph)
  if (key === "faviconUrl" || key === "ogImageUrl") {
    if (trimmed && !trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      throw new Error(`URL inválida para o campo ${key}. Deve ser uma URL absoluta ou caminho relativo.`);
    }
  }

  // Limita tamanho para evitar abusos de armazenamento
  if (trimmed.length > 500) {
    throw new Error(`O valor para ${key} excede o limite máximo permitido de 500 caracteres.`);
  }

  return trimmed;
}

export async function GET() {
  try {
    // Configurações de branding são públicas para permitir que o cliente renderize os metadados
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: { in: ALLOWED_KEYS },
      },
    });

    const brandingMap: Record<string, string> = {
      siteTitle: "VORIXA - Plataforma de Criação de Vídeo e Imagem por IA",
      siteDescription: "Gere imagens, vídeos e animações com inteligência artificial de ponta.",
      siteKeywords: "ia, video generator, motion control, lip sync, imagem ia",
      faviconUrl: "/favicon.ico",
      ogImageUrl: "https://vorixa.com/og-image.jpg",
    };

    for (const setting of settings) {
      brandingMap[setting.key] = setting.value;
    }

    return NextResponse.json(brandingMap);
  } catch (err: any) {
    console.error("Erro ao buscar configurações de branding:", err);
    return NextResponse.json({ error: "Erro interno ao carregar configurações de branding." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    // 1. RBAC estrito via sessão do servidor
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
    }

    const body = await req.json();

    // 2. Proteção contra Mass Assignment: extrai e atualiza estritamente as chaves permitidas
    const updates: { key: string; value: string }[] = [];

    for (const key of ALLOWED_KEYS) {
      if (body[key] !== undefined) {
        const sanitized = sanitizeValue(key, body[key]);
        updates.push({ key, value: sanitized });
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "Nenhuma chave válida de branding fornecida para atualização." }, { status: 400 });
    }

    // 3. Execução transacional de atualização e registro de auditoria com autoria do servidor
    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        await tx.systemSetting.upsert({
          where: { key: update.key },
          create: { key: update.key, value: update.value },
          update: { value: update.value },
        });
      }

      // Registra a autoria segura no AuditLog
      await tx.auditLog.create({
        data: {
          userId: admin.id,
          action: "UPDATE_BRANDING_SETTINGS",
          details: `Atualizadas as chaves: ${updates.map((u) => u.key).join(", ")}`,
        },
      });
    });

    return NextResponse.json({ message: "Configurações de branding atualizadas com sucesso." });
  } catch (err: any) {
    console.error("Erro ao atualizar configurações de branding:", err);
    return NextResponse.json({ error: err.message || "Erro interno no servidor." }, { status: 400 });
  }
}
