import { IAIProvider } from "./ai-provider.interface";
import { FalAIProvider } from "./providers/fal-ai.provider";
import { MockAIProvider } from "./providers/mock-ai.provider";

export class AIProviderFactory {
  static getProvider(): IAIProvider {
    const mode = process.env.AI_PROVIDER_MODE || "mock";
    if (mode === "live") {
      return new FalAIProvider();
    }
    return new MockAIProvider();
  }
}
