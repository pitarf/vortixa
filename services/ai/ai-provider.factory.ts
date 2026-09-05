import { IAIProvider } from "./ai-provider.interface";
import { FalAIProvider } from "./providers/fal-ai.provider";
import { MockAIProvider } from "./providers/mock-ai.provider";
import prisma from "@/lib/prisma";

export class AIProviderFactory {
  static getProvider(): IAIProvider {
    if (process.env.VITEST === "true") {
      return new MockAIProvider();
    }
    const mode = (process.env.AI_PROVIDER_MODE || "live").toLowerCase();
    if (mode === "live") {
      return new FalAIProvider();
    }
    return new MockAIProvider();
  }

  static async getProviderAsync(): Promise<IAIProvider> {
    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { key: "ai_provider_mode" },
      });
      const mode = setting?.value || process.env.AI_PROVIDER_MODE || "live";
      if (mode === "live") {
        return new FalAIProvider();
      }
    } catch {}
    return new MockAIProvider();
  }
}
