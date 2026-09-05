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

  it("should correctly inject technical directives for all visual styles", () => {
    const prompt = "Um robô em uma metrópole";

    // Cinemático
    const cinematic = PromptEngine.optimize(prompt, { toolType: "image", style: "cinematic" });
    expect(cinematic.optimizedPrompt).toContain("cinematic 2.39:1 anamorphic composition");
    expect(cinematic.optimizedPrompt).toContain("Hollywood cinematic color grade");

    // Fotorrealista
    const photo = PromptEngine.optimize(prompt, { toolType: "image", style: "photorealistic" });
    expect(photo.optimizedPrompt).toContain("Sony A7R IV 85mm f/1.4 GM lens");
    expect(photo.optimizedPrompt).toContain("authentic skin micropores");

    // Anime
    const anime = PromptEngine.optimize(prompt, { toolType: "image", style: "anime" });
    expect(anime.optimizedPrompt).toContain("Makoto Shinkai and Ufotable key visual");
    expect(anime.optimizedPrompt).toContain("cel-shaded illustration");

    // 3D Render (Octane)
    const octane = PromptEngine.optimize(prompt, { toolType: "image", style: "octane3d" });
    expect(octane.optimizedPrompt).toContain("3D Octane and Redshift render");
    expect(octane.optimizedPrompt).toContain("Cinema 4D");

    // Cyberpunk
    const cyberpunk = PromptEngine.optimize(prompt, { toolType: "image", style: "cyberpunk" });
    expect(cyberpunk.optimizedPrompt).toContain("cyberpunk dystopian aesthetic");
    expect(cyberpunk.optimizedPrompt).toContain("neon lights");
  });
});
