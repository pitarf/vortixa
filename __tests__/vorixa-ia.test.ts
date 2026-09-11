import { describe, it, expect, vi } from "vitest";
import { VorixaIAService } from "@/services/ai/vorixa-ia.service";

describe("VORIXA IA - Dynamic Pricing & Script Engine Tests", () => {
  describe("Tabela de Preços e Margem de Lucro", () => {
    it("deve calcular corretamente os preços de 720p para 5s, 10s e 30s", () => {
      const p5 = VorixaIAService.calculatePrice("5", "720p");
      expect(p5.credits).toBe(15);
      expect(p5.apiUnitCostUsd).toBe(0.28);
      expect(p5.durationSeconds).toBe(5);

      const p10 = VorixaIAService.calculatePrice("10", "720p");
      expect(p10.credits).toBe(25);
      expect(p10.apiUnitCostUsd).toBe(0.56);
      expect(p10.durationSeconds).toBe(10);

      const p30 = VorixaIAService.calculatePrice("30", "720p");
      expect(p30.credits).toBe(65);
      expect(p30.apiUnitCostUsd).toBe(1.69);
      expect(p30.durationSeconds).toBe(30);
    });

    it("deve calcular corretamente os preços de 1080p para 5s, 10s e 30s", () => {
      const p5 = VorixaIAService.calculatePrice("5", "1080p");
      expect(p5.credits).toBe(25);
      expect(p5.apiUnitCostUsd).toBe(0.58);

      const p10 = VorixaIAService.calculatePrice("10", "1080p");
      expect(p10.credits).toBe(45);
      expect(p10.apiUnitCostUsd).toBe(1.15);

      const p30 = VorixaIAService.calculatePrice("30", "1080p");
      expect(p30.credits).toBe(120);
      expect(p30.apiUnitCostUsd).toBe(3.45);
    });

    it("deve calcular corretamente os preços de 4K para 5s, 10s e 30s", () => {
      const p5 = VorixaIAService.calculatePrice("5", "4k");
      expect(p5.credits).toBe(35);
      expect(p5.apiUnitCostUsd).toBe(0.65);

      const p10 = VorixaIAService.calculatePrice("10", "4k");
      expect(p10.credits).toBe(60);
      expect(p10.apiUnitCostUsd).toBe(1.25);

      const p30 = VorixaIAService.calculatePrice("30", "4k");
      expect(p30.credits).toBe(150);
      expect(p30.apiUnitCostUsd).toBe(3.60);
    });
  });

  describe("Motor de Roteiro Inteligente (Script & Tone Engine)", () => {
    it("deve preservar diálogos explícitos entre aspas enviados pelo usuário", async () => {
      const res = await VorixaIAService.extractOrGenerateSpeechScript(
        'Mulher em estúdio dizendo: "Olá pessoal, este é o novo lançamento exclusivo do Vorixa!"'
      );
      expect(res.script).toBe("Olá pessoal, este é o novo lançamento exclusivo do Vorixa!");
    });

    it("deve gerar roteiro de moda em PT-BR para comandos como 'faça essa modelo falar e indicar essa roupa'", async () => {
      const res5s = await VorixaIAService.extractOrGenerateSpeechScript("faça essa modelo falar e indicar essa roupa", 5);
      expect(res5s.script).toContain("look");
      expect(res5s.script.length).toBeGreaterThan(20);

      const res10s = await VorixaIAService.extractOrGenerateSpeechScript("faça essa modelo falar e indicar essa roupa", 10);
      expect(res10s.script).toContain("look");
      expect(res10s.script.length).toBeGreaterThan(res5s.script.length);
    });

    it("deve gerar roteiro de produto comercial para comandos de produto/lançamento", async () => {
      const res = await VorixaIAService.extractOrGenerateSpeechScript("apresente esse produto com entusiasmo", 5);
      expect(res.script).toContain("novidade exclusiva");
    });
  });
});
