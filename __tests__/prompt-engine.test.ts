import { describe, it, expect } from "vitest";
import { PromptEngine } from "@/services/ai/prompt-engine.service";

describe("VORIXA Contextual Story Director Engine Dynamic Tests", () => {
  it("should preserve specific user customizations like red hair, leather jacket and street context", () => {
    const customPrompt = "Uma mulher de cabelo vermelho com jaqueta de couro preta segurando um copo de café em frente a uma cafeteria moderna";
    const result = PromptEngine.optimize(customPrompt, { toolType: "image" });

    // Deve traduzir EXATAMENTE as características personalizadas do usuário
    expect(result.optimizedPrompt).toContain("vibrant red hair");
    expect(result.optimizedPrompt).toContain("textured leather jacket");
    expect(result.optimizedPrompt).toContain("takeaway coffee cup");
    expect(result.optimizedPrompt).toContain("contemporary modern specialty coffee shop");
    // Deve injetar apenas a física de realismo sem engessar a pessoa
    expect(result.optimizedPrompt).toContain("visible micropores");
    expect(result.optimizedPrompt).toContain("Sony A7 IV 85mm f/1.4 GM lens");
    expect(result.optimizedPrompt).toContain("zero plastic skin");
  });

  it("should preserve blond hair, blue eyes and beach sunset setting", () => {
    const blondePrompt = "Um homem de cabelo loiro e olhos azuis na praia ao pôr do sol";
    const result = PromptEngine.optimize(blondePrompt, { toolType: "image" });

    expect(result.optimizedPrompt).toContain("natural blonde hair");
    expect(result.optimizedPrompt).toContain("blue");
    expect(result.optimizedPrompt).toContain("sunny tropical beach");
    expect(result.optimizedPrompt).toContain("visible micropores");
  });

  it("should detect basic prompts and trigger isBasic: true", () => {
    const basicPrompt = "Uma mulher";
    const density = PromptEngine.analyzePromptDensity(basicPrompt);
    expect(density.isBasic).toBe(true);
    expect(density.reason).toContain("Prompts muito genéricos");
  });

  it("should preserve speech scripts in quotes cleanly", () => {
    const videoPrompt = 'Uma mulher anunciando: "Experimente o novo café premium" com iluminação de cinema';
    const result = PromptEngine.optimize(videoPrompt, { toolType: "video" });

    expect(result.preservedSpeech).toBe("Experimente o novo café premium");
    expect(result.optimizedPrompt).toContain('"Experimente o novo café premium"');
  });
});
