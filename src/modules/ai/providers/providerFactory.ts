import { IAIProvider } from "./aiProvider.interface.js";
import { OpenAIProvider } from "./openAi.provider.js";
import { GeminiProvider } from "./gemini.provider.js";
import { ClaudeProvider } from "./claude.provider.js";
import { MockAIProvider } from "./mock.provider.js";

export class AIProviderFactory {
  static getProvider(): IAIProvider {
    const providerType = (process.env.AI_PROVIDER || "mock").toLowerCase().trim();
    const apiKey = (process.env.AI_API_KEY || "").trim();
    const model = (process.env.AI_MODEL || "").trim();

    // If no valid real API key is configured or user specified mock, use the MockAIProvider
    const isPlaceholderKey =
      !apiKey ||
      apiKey === "YOUR_AI_API_KEY_HERE" ||
      apiKey === "YOUR_KEY_HERE" ||
      apiKey.includes("placeholder");

    if (providerType === "mock" || isPlaceholderKey) {
      return new MockAIProvider();
    }

    switch (providerType) {
      case "openai":
        return new OpenAIProvider(apiKey, model || "gpt-4o-mini");
      case "gemini":
        return new GeminiProvider(apiKey, model || "gemini-1.5-flash");
      case "claude":
        return new ClaudeProvider(apiKey, model || "claude-3-5-sonnet-20241022");
      default:
        console.warn(`[AI Provider Factory] Unknown provider '${providerType}', falling back to Mock AI`);
        return new MockAIProvider();
    }
  }
}
