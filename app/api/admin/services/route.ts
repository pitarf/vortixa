import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CurrencyService } from "@/services/currency.service";

/**
 * Categoriza o serviço com base no nome do modelo, ferramenta ou slug técnico.
 */
function inferCategory(modelName: string, technicalName: string, tools: Array<{ name: string; slug: string }>): string {
  const combined = `${modelName} ${technicalName} ${tools.map(t => `${t.name} ${t.slug}`).join(" ")}`.toLowerCase();

  if (combined.includes("hot") || combined.includes("+18") || combined.includes("nsfw") || combined.includes("adult")) {
    return "Hot +18";
  }
  if (combined.includes("motion") || combined.includes("camera") || combined.includes("dance")) {
    return "Motion";
  }
  if (combined.includes("upscale") || combined.includes("upscaler") || combined.includes("enhance")) {
    return "Upscale";
  }
  if (combined.includes("lipsync") || combined.includes("lip-sync") || combined.includes("omnihuman") || combined.includes("sync-v2") || combined.includes("avatar")) {
    return "LipSync";
  }
  if (
    combined.includes("video") ||
    combined.includes("seedance") ||
    combined.includes("kling") ||
    combined.includes("luma") ||
    combined.includes("wan") ||
    combined.includes("minimax") ||
    combined.includes("i2v") ||
    combined.includes("t2v")
  ) {
    return "Vídeo";
  }
  return "Imagem";
}

/**
 * Extrai variações suportadas (duração, resolução/aspect ratio) deduzidas pelo modelo/ferramentas.
 */
function getServiceVariations(category: string, billingUnit?: string | null) {
  if (category === "Vídeo") {
    return {
      durations: ["5s", "10s"],
      qualities: ["720p", "1080p"],
      aspectRatios: ["16:9", "9:16", "1:1"],
      unit: billingUnit || "SEGUNDO",
    };
  }
  if (category === "LipSync") {
    return {
      durations: ["5s - 60s"],
      qualities: ["HD Áudio & Vídeo"],
      aspectRatios: ["9:16", "16:9"],
      unit: billingUnit || "SEGUNDO",
    };
  }
  if (category === "Upscale") {
    return {
      durations: ["Vídeo Original"],
      qualities: ["2x (1080p)", "4x (4K)"],
      aspectRatios: ["Nativo"],
      unit: billingUnit || "VÍDEO",
    };
  }
  if (category === "Motion") {
    return {
      durations: ["5s", "10s"],
      qualities: ["1080p Motion"],
      aspectRatios: ["16:9", "9:16"],
      unit: billingUnit || "EXECUÇÃO",
    };
  }
  return {
    durations: ["Estático"],
    qualities: ["1K", "2K", "4K Ultra"],
    aspectRatios: ["1:1", "16:9", "9:16", "4:3"],
    unit: billingUnit || "IMAGEM",
  };
}

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Sessão inválida ou expirada." }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso não autorizado. Apenas administradores." }, { status: 403 });
    }

    // Obter cotação atual do dólar
    const dollarRate = await CurrencyService.getUsdToBrlRate();

    // Buscar todos os modelos com seus provedores e ferramentas vinculadas
    const models = await prisma.aIModel.findMany({
      include: {
        provider: true,
        tools: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            description: true,
          },
        },
      },
      orderBy: [
        { status: "desc" },
        { name: "asc" },
      ],
    });

    const services = models.map((model) => {
      const category = inferCategory(model.name, model.technicalName, model.tools);
      const variations = getServiceVariations(category, model.billingUnit);
      const estimatedCostBrl = Number((model.apiUnitCost * dollarRate).toFixed(4));

      return {
        id: model.id,
        name: model.name,
        technicalName: model.technicalName,
        providerId: model.providerId,
        providerName: model.provider?.name || "fal.ai",
        category,
        creditCost: model.creditCost,
        apiUnitCostUsd: model.apiUnitCost,
        estimatedCostBrl,
        status: model.status,
        version: model.version,
        billingUnit: model.billingUnit,
        tools: model.tools,
        variations,
      };
    });

    return NextResponse.json({
      dollarRate,
      dollarRateFormatted: `R$ ${dollarRate.toFixed(2).replace(".", ",")}`,
      totalServices: services.length,
      activeServices: services.filter((s) => s.status).length,
      services,
    });
  } catch (error: any) {
    console.error("Erro ao listar serviços de IA:", error);
    return NextResponse.json({ error: "Erro interno ao carregar catálogo de serviços." }, { status: 500 });
  }
}
