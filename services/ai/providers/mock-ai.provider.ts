import { IAIProvider, AISubmitPayload } from "../ai-provider.interface";
import prisma from "@/lib/prisma";

export class MockAIProvider implements IAIProvider {
  async submitJob(payload: AISubmitPayload): Promise<{ providerJobId: string }> {
    const mockRequestId = `mock-req-${Math.random().toString(36).substring(2, 11)}`;

    console.log(`\n================== [MOCK AI PROVIDER TESTE] ==================`);
    console.log(`🤖 Modo: MOCK (Simulação Local Sem Custos)`);
    console.log(`📡 Modelo Solicitado: ${payload.modelTechnicalName}`);
    console.log(`📝 Inputs:`, JSON.stringify(payload.inputs, null, 2));
    console.log(`🆔 Gerado Request ID: ${mockRequestId}`);
    console.log(`⏳ Concluindo job diretamente no banco de dados em 1.5s...`);
    console.log(`==============================================================\n`);

    // Atualiza diretamente no banco de dados para 100% de garantia e confiabilidade sem depender de loop de rede local
    setTimeout(async () => {
      try {
        const job = await prisma.aIJob.findFirst({
          where: {
            OR: [
              { id: payload.jobId },
              { providerJobId: mockRequestId },
            ],
          },
        });

        if (job) {
          const isVideo = payload.modelTechnicalName.includes("video") || payload.modelTechnicalName.includes("motion");
          const mediaUrl = isVideo ? "/media/landing/hero/hero_main.mp4" : "/media/landing/hero/hero_main.jpg";

          await prisma.$transaction(async (tx) => {
            await tx.aIJob.update({
              where: { id: job.id },
              data: {
                status: "COMPLETED",
                providerJobId: mockRequestId,
                billingQuantity: 1.0,
                providerCostUsd: 0.003,
              },
            });

            const file = await tx.file.create({
              data: {
                userId: job.userId,
                name: `mock-resultado-${job.id.slice(0, 8)}.${isVideo ? "mp4" : "jpg"}`,
                mimeType: isVideo ? "video/mp4" : "image/jpeg",
                sizeBytes: 1024 * 1024 * 2,
                url: mediaUrl,
                storageKey: `outputs/${job.userId}/mock-${job.id}.${isVideo ? "mp4" : "jpg"}`,
              },
            });

            await tx.aIJobOutput.create({
              data: {
                jobId: job.id,
                fileUrl: mediaUrl,
                fileId: file.id,
              },
            });
          });

          // Se for um nó de Flow, notifica o DAG Engine
          try {
            const { FlowExecutionService } = await import("@/services/flow-execution.service");
            await FlowExecutionService.handleJobCompletion(job.id, { outputUrls: [mediaUrl] });
          } catch {
            // Ignora se não for nó de flow
          }

          console.log(`✅ [MOCK SUCESSO] Job ${job.id} atualizado para COMPLETED com output: ${mediaUrl}`);
        }
      } catch (err: any) {
        console.error("❌ Erro ao concluir job mock no banco:", err.message);
      }
    }, 1500);

    return { providerJobId: mockRequestId };
  }

  async cancelJob(providerJobId: string): Promise<boolean> {
    console.log(`Mock: Job ${providerJobId} cancelado.`);
    return true;
  }
}
