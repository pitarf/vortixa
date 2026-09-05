import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "image" | "video" | "audio"
    const tool = searchParams.get("tool"); // slug
    const search = searchParams.get("search");

    // Busca os AIJobs concluídos do usuário com outputs e modelo
    const jobs = await prisma.aIJob.findMany({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
        ...(tool && tool !== "ALL" ? { tool: { slug: tool } } : {}),
      },
      include: {
        tool: true,
        model: true,
        inputs: true,
        outputs: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const items: any[] = [];
    let imageCount = 0;
    let videoCount = 0;

    for (const job of jobs) {
      if (!job.outputs || job.outputs.length === 0) continue;

      const promptInput = job.inputs.find((i) => i.key === "prompt");
      const promptText = promptInput?.value || "";

      // Filtro de busca textual
      if (search && !promptText.toLowerCase().includes(search.toLowerCase()) && !job.tool.name.toLowerCase().includes(search.toLowerCase())) {
        continue;
      }

      for (const out of job.outputs) {
        const isVideo = out.fileUrl.endsWith(".mp4") || job.model.technicalName.includes("video") || job.model.technicalName.includes("motion");
        const mediaType = isVideo ? "video" : "image";

        if (mediaType === "video") videoCount++;
        else imageCount++;

        if (type && type !== "all" && mediaType !== type) {
          continue;
        }

        const inputsMap: Record<string, any> = {};
        job.inputs.forEach((inp) => {
          inputsMap[inp.key] = inp.value;
        });

        items.push({
          id: out.id,
          jobId: job.id,
          url: out.fileUrl,
          mediaType,
          toolSlug: job.tool.slug,
          toolName: job.tool.name,
          modelName: job.model.name,
          prompt: promptText,
          inputs: inputsMap,
          status: job.status,
          creditCost: job.creditCost,
          createdAt: job.createdAt.toISOString(),
          error: job.error,
        });
      }
    }

    return NextResponse.json({
      items,
      stats: {
        total: items.length,
        images: imageCount,
        videos: videoCount,
        completed: items.length,
        processing: 0,
      },
    });
  } catch (err: any) {
    console.error("Erro na API /api/library:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
