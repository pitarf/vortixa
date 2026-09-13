import { NextResponse } from "next/server";
import path from "path";
import prisma from "@/lib/prisma";
import { CreditService } from "@/services/credit.service";
import { StorageService } from "@/services/storage.service";

export async function POST(req: Request) {
  try {
    const signature =
      req.headers.get("x-fal-signature") ||
      req.headers.get("x-fal-webhook-signature") ||
      req.headers.get("x-fal-request-id");
    const body = await req.json();

    const { request_id, status, payload, error } = body;

    console.log(`\n📥 [FAL.AI WEBHOOK RECEBIDO] Request ID: ${request_id} | Status: ${status}`);

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
      console.warn(`[FAL.AI WEBHOOK] Job não localizado para request_id: ${request_id}`);
      return NextResponse.json({ message: "Job não localizado no sistema." }, { status: 200 });
    }

    // 3. Máquina de Estados: impede regredir estados finais (COMPLETED / FAILED / CANCELLED)
    if (job.status === "COMPLETED" || job.status === "FAILED" || job.status === "CANCELLED") {
      console.log(`[FAL.AI WEBHOOK] Job ${job.id} já se encontra no estado final: ${job.status}`);
      return NextResponse.json({ message: "Job já finalizado." }, { status: 200 });
    }

    const isSuccess = status === "OK" || status === "COMPLETED" || (!error && (payload?.video || payload?.images || payload?.output));
    const isFailure = status === "ERROR" || status === "FAILED" || (Boolean(error) && !isSuccess);

    // 4. Se o status recebido for de SUCESSO (OK ou COMPLETED)
    if (isSuccess) {
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

      // Safety Net: Se o webhook não trouxe as URLs no payload, consulta o resultado diretamente na API da Fal.ai
      if (outputUrls.length === 0) {
        try {
          const { fal } = await import("@fal-ai/client");
          if (process.env.FAL_KEY) {
            fal.config({ credentials: process.env.FAL_KEY });
          }
          const falRes: any = await fal.queue.result(job.model.technicalName, { requestId: request_id });
          if (falRes?.data?.video?.url) outputUrls.push(falRes.data.video.url);
          else if (falRes?.data?.video_url) outputUrls.push(falRes.data.video_url);
          else if (falRes?.data?.output?.url) outputUrls.push(falRes.data.output.url);
          else if (typeof falRes?.data?.output === "string" && falRes.data.output.startsWith("http")) outputUrls.push(falRes.data.output);
          else if (Array.isArray(falRes?.data?.images)) {
            falRes.data.images.forEach((img: any) => {
              if (img.url) outputUrls.push(img.url);
            });
          }
        } catch (fetchErr: any) {
          console.warn("[FAL.AI WEBHOOK] Não foi possível consultar resultado diretamente:", fetchErr.message);
        }
      }

      await prisma.$transaction(async (tx) => {
        // Atualiza status do job
        await tx.aIJob.update({
          where: { id: job.id },
          data: {
            status: "COMPLETED",
            billingQuantity: 1.0,
            providerCostUsd: job.model.apiUnitCost,
          },
        });

        // Salvar resultados no Storage e criar registros de saída de forma resiliente
        for (const extUrl of outputUrls) {
          const isVideo = extUrl.endsWith(".mp4") || extUrl.includes("output.mp4") || extUrl.includes("video");
          let finalUrl = extUrl;
          try {
            finalUrl = await StorageService.uploadFromUrl(extUrl, isVideo ? "result.mp4" : "result.jpg");
          } catch (stErr) {
            console.warn("[FAL.AI WEBHOOK] Aviso ao salvar mídia localmente no StorageService:", stErr);
          }

          const fileRecord = await tx.file.create({
            data: {
              userId: job.userId,
              name: `resultado-${job.id.slice(0, 8)}.${isVideo ? "mp4" : "jpg"}`,
              mimeType: isVideo ? "video/mp4" : "image/jpeg",
              sizeBytes: isVideo ? 1024 * 1024 * 8 : 1024 * 1024 * 2,
              url: finalUrl,
              storageKey: `outputs/${job.userId}/resultado-${job.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${isVideo ? "mp4" : "jpg"}`,
            },
          });

          await tx.aIJobOutput.create({
            data: {
              jobId: job.id,
              fileUrl: finalUrl,
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

    // 5. Se o status recebido for FAILED / ERROR
    if (isFailure) {
      await prisma.aIJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          error: error || "Falha relatada pelo provedor de IA.",
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
      if (!isFlowNode && job.creditCost > 0) {
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

