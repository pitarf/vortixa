import "dotenv/config";
import { describe, it, expect, beforeEach, vi } from "vitest";
import prisma from "@/lib/prisma";
import { CreditService } from "@/services/credit.service";
import { POST as handleGenerate } from "@/app/api/tools/generate/route";
import { auth } from "@/auth";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

describe("One-Shot Talking Video Pipeline (Vídeo com Fala Integrada)", () => {
  let user: any;

  beforeEach(async () => {
    await prisma.creditTransaction.deleteMany();
    await prisma.aIJobOutput.deleteMany();
    await prisma.aIJobInput.deleteMany();
    await prisma.aIJob.deleteMany();
    await prisma.user.deleteMany();

    user = await prisma.user.create({
      data: {
        name: "Talking Video Tester",
        email: "talking.video@vorixa.com",
        role: "USER",
        isUnlimited: false,
      },
    });

    await prisma.creditBalance.create({
      data: {
        userId: user.id,
        balance: 50,
      },
    });
  });

  it("1. Deve rejeitar usuário sem saldo para o pacote combinado de vídeo + fala", async () => {
    // Reduz saldo para 5 créditos (Kling 15 + Talking Video 9 = 24 necessários)
    await prisma.creditBalance.update({
      where: { userId: user.id },
      data: { balance: 5 },
    });

    const { auth } = await import("@/auth");
    (auth as any).mockResolvedValueOnce({ user: { id: user.id } });

    const req = new Request("http://localhost:3000/api/tools/generate", {
      method: "POST",
      body: JSON.stringify({
        toolSlug: "imagem-video",
        modelId: "fal-ai/kling-video/v2.1/pro/image-to-video",
        inputs: {
          prompt: "Uma modelo elegante falando naturalmente",
          speech_text: "Olá a todos! Sejam bem-vindos à plataforma.",
          voice: "pt-BR-FranciscaNeural",
          is_talking_video: true,
        },
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Saldo insuficiente");
  });

  it("2. Deve orquestrar vídeo + fala neural debitando créditos atômicos no Ledger", async () => {
    const { auth } = await import("@/auth");
    (auth as any).mockResolvedValueOnce({ user: { id: user.id } });

    const balanceBefore = await CreditService.getBalance(user.id);
    expect(balanceBefore).toBe(50);

    const req = new Request("http://localhost:3000/api/tools/generate", {
      method: "POST",
      body: JSON.stringify({
        toolSlug: "imagem-video",
        modelId: "fal-ai/kling-video/v2.1/pro/image-to-video",
        inputs: {
          prompt: "Apresentador de terno em estúdio moderno falando com o público",
          speech_text: "A Vorixa é o maior ecossistema de geração audiovisual com inteligência artificial.",
          voice: "pt-BR-AntonioNeural",
          is_talking_video: true,
        },
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.id).toBeDefined();
    // Kling 2.1 Pro cadastrado com 10 cr + Fala & LipSync (9 cr) = 19 créditos
    expect(data.creditCost).toBe(19);

    // Conferir saldo após o débito (50 - 19 = 31)
    const balanceAfter = await CreditService.getBalance(user.id);
    expect(balanceAfter).toBe(31);

    // Conferir histórico no Ledger
    const tx = await prisma.creditTransaction.findFirst({
      where: { userId: user.id, type: "GENERATION_DEBIT" },
    });
    expect(tx).toBeDefined();
    expect(tx?.amount).toBe(-19);
  });
});
