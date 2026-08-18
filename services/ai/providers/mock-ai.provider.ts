import { IAIProvider, AISubmitPayload } from "../ai-provider.interface";

export class MockAIProvider implements IAIProvider {
  async submitJob(payload: AISubmitPayload): Promise<{ providerJobId: string }> {
    const mockRequestId = `mock-req-${Math.random().toString(36).substring(2, 11)}`;

    // Simula a chamada assíncrona do webhook de retorno após 2 segundos
    setTimeout(async () => {
      try {
        // Envia o payload simulado de COMPLETED de volta para o endpoint do webhook
        const response = await fetch(payload.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-fal-signature": "mock-signature-for-development",
          },
          body: JSON.stringify({
            request_id: mockRequestId,
            status: "COMPLETED",
            payload: {
              images: [
                {
                  url: "https://queue.fal.run/files/mock-image.png",
                  width: 1024,
                  height: 1024,
                },
              ],
              video: {
                url: "https://queue.fal.run/files/mock-video.mp4",
              },
            },
            error: null,
          }),
        });

        if (!response.ok) {
          console.error(`Mock Webhook respondeu com erro HTTP: ${response.status}`);
        }
      } catch (err) {
        console.error("Erro no envio do Mock Webhook em background:", err);
      }
    }, 2000);

    return { providerJobId: mockRequestId };
  }

  async cancelJob(providerJobId: string): Promise<boolean> {
    console.log(`Mock: Job ${providerJobId} cancelado.`);
    return true;
  }
}
