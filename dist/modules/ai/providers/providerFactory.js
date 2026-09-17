"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIProviderFactory = void 0;
const openAi_provider_js_1 = require("./openAi.provider.js");
const gemini_provider_js_1 = require("./gemini.provider.js");
const claude_provider_js_1 = require("./claude.provider.js");
const mock_provider_js_1 = require("./mock.provider.js");
class AIProviderFactory {
    static getProvider() {
        const providerType = (process.env.AI_PROVIDER || "mock").toLowerCase().trim();
        const apiKey = (process.env.AI_API_KEY || "").trim();
        const model = (process.env.AI_MODEL || "").trim();
        // If no valid real API key is configured or user specified mock, use the MockAIProvider
        const isPlaceholderKey = !apiKey ||
            apiKey === "YOUR_AI_API_KEY_HERE" ||
            apiKey === "YOUR_KEY_HERE" ||
            apiKey.includes("placeholder");
        if (providerType === "mock" || isPlaceholderKey) {
            return new mock_provider_js_1.MockAIProvider();
        }
        switch (providerType) {
            case "openai":
                return new openAi_provider_js_1.OpenAIProvider(apiKey, model || "gpt-4o-mini");
            case "gemini":
                return new gemini_provider_js_1.GeminiProvider(apiKey, model || "gemini-1.5-flash");
            case "claude":
                return new claude_provider_js_1.ClaudeProvider(apiKey, model || "claude-3-5-sonnet-20241022");
            default:
                console.warn(`[AI Provider Factory] Unknown provider '${providerType}', falling back to Mock AI`);
                return new mock_provider_js_1.MockAIProvider();
        }
    }
}
exports.AIProviderFactory = AIProviderFactory;
//# sourceMappingURL=providerFactory.js.map