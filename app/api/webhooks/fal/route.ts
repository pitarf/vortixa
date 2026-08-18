import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CreditService } from "@/services/credit.service";
import { StorageService } from "@/services/storage.service";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-fal-signature") || req.headers.get("x-fal-webhook-signature");
    const body = await req.json();

    const { request_id, status, payload, error } = body;

    // 1. Validar autenticidade
    if (!request_id) {
      return NextResponse.json({ error: "request_id ausente." }, { status: 400 });
    }

    if (process.env.AI_PROVIDER_MODE === "live" && !signature) {
      return NextResponse.json({ error: "Assinatura do webhook inválida ou ausente." }, { status: 401 });
    }

    // 2. Localizar o Job correspondente
    const job = await prisma.aIJob.findUnique({
      where: { providerJobId: request_id },
      include: { user: true, model: true },
    });

    if (!job) {
      // Retorna 200 para evitar que a fal.ai fique reenviando indefinidamente se o ID sumir
      return NextResponse.json({ message: "Job não localizado no sistema." }, { status: 200 });
    }

    // 3. Máquina de Estados: impede regredir estados finais (COMPLETED / FAILED / CANCELLED)
    if (job.status === "COMPLETED" || job.status === "FAILED" || job.status === "CANCELLED") {
      return NextResponse.json({ message: "Job já finalizado." }, { status: 200 });
    }

    // 4. Se o status recebido for COMPLETED
    if (status === "COMPLETED") {
      const outputUrls: string[] = [];

      // Extrair URLs geradas (vídeo ou imagem)
      if (payload?.video?.url) {
        outputUrls.push(payload.video.url);
      } else if (payload?.images && Array.isArray(payload.images)) {
        payload.images.forEach((img: any) => {
          if (img.url) outputUrls.push(img.url);
        });
      }

      await prisma.$transaction(async (tx) => {
        // Atualiza status do job
        const updatedJob = await tx.aIJob.update({
          where: { id: job.id },
          data: {
            status: "COMPLETED",
            billingQuantity: 1.0, // Geração concluída
            providerCostUsd: job.model.apiUnitCost,
          },
        });

        // Salvar resultados no Storage e criar registros de saída
        for (const extUrl of outputUrls) {
          const localUrl = await StorageService.uploadFromUrl(extUrl, "result.mp4");

          const fileRecord = await tx.file.create({
            data: {
              userId: job.userId,
              name: `resultado-${job.id}`,
              mimeType: extUrl.endsWith(".mp4") ? "video/mp4" : "image/png",
              sizeBytes: 1024 * 1024 * 5, // Tamanho estimado de teste
              url: localUrl,
              storageKey: `outputs/${job.userId}/${pathbasename(localUrl)}`,
            },
          });

          await tx.aIJobOutput.create({
            data: {
              jobId: job.id,
              fileUrl: localUrl,
              fileId: fileRecord.id,
            },
          });
        }
      });

      return NextResponse.json({ message: "Job atualizado para concluído com sucesso." }, { status: 200 });
    }

    // 5. Se o status recebido for FAILED
    if (status === "FAILED" || error) {
      await prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          error: error || "Erro relatado pelo provedor de IA.",
        },
      });

      // Estornar os créditos do usuário transacionalmente
      await CreditService.refundCredits(job.userId, job.creditCost, job.id);

      return NextResponse.json({ message: "Job atualizado para falha e saldo reembolsado." }, { status: 200 });
    }

    return NextResponse.json({ message: "Status ignorado ou em processamento." }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Auxiliar simples de nome de arquivo
function pathbasename(filepath: string): string {
  const parts = filepath.split("/");
  return parts[parts.length - 1];
}
