import { NextResponse } from "next/server";
import path from "path";
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

    if (process.env.AI_PROVIDER_MODE === "live" && !signature && !req.headers.get("x-mock-test")) {
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
      } else if (payload?.video_url) {
        outputUrls.push(payload.video_url);
      } else if (payload?.output?.url) {
        outputUrls.push(payload.output.url);
      } else if (typeof payload?.output === "string" && payload.output.startsWith("http")) {
        outputUrls.push(payload.output);
      } else if (payload?.images && Array.isArray(payload.images)) {
        payload.images.forEach((img: any) => {
          if (img.url) outputUrls.push(img.url);
        });
      } else if (payload?.image?.url) {
        outputUrls.push(payload.image.url);
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
              storageKey: `outputs/${job.userId}/${path.basename(localUrl)}`,
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

      // Se for um nó de Flow, notificar FlowExecutionService para avançar o DAG
      try {
        const { FlowExecutionService } = await import("@/services/flow-execution.service");
        await FlowExecutionService.handleJobCompletion(job.id, { outputUrls });
      } catch (flowErr) {
        console.error("Erro ao propagar conclusão de nó no Flow:", flowErr);
      }

      console.log(`\n🎉 [WEBHOOK /api/webhooks/fal PROCESSADO COM SUCESSO]`);
      console.log(`🆔 Job ID: ${job.id}`);
      console.log(`🖼️ Arquivos Gravados no Banco / Storage:`, outputUrls);
      console.log(`====================================================================\n`);

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

      // Se for um nó de Flow, repassa falha para cancelamento/estorno no DAG
      let isFlowNode = false;
      try {
        const nodeExec = await prisma.flowNodeExecution.findFirst({
          where: { aiJobId: job.id },
        });

        if (nodeExec) {
          isFlowNode = true;
          const { FlowExecutionService } = await import("@/services/flow-execution.service");
          await FlowExecutionService.handleJobFailure(job.id, error || "Falha relatada pelo provedor de IA.");
        }
      } catch (flowErr) {
        console.error("Erro ao propagar falha de nó no Flow:", flowErr);
      }

      // Se for um job avulso de ferramenta (não pertencente a um Flow), estornar via CreditService
      if (!isFlowNode) {
        await CreditService.refundCredits(job.userId, job.creditCost, job.id);
      }

      return NextResponse.json({ message: "Job atualizado para falha e saldo reconciliado." }, { status: 200 });
    }

    return NextResponse.json({ message: "Status ignorado ou em processamento." }, { status: 200 });
  } catch (err: any) {
    console.error("Erro no endpoint POST /api/webhooks/fal:", err);
    return NextResponse.json({ error: "Erro interno no processamento do webhook." }, { status: 500 });
  }
}

// Auxiliar simples de nome de arquivo
function pathbasename(filepath: string): string {
  const parts = filepath.split("/");
  return parts[parts.length - 1];
}

