import { IAIProvider, AICompletionResult } from "./aiProvider.interface.js";

export class OpenAIProvider implements IAIProvider {
  name = "OpenAI";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "gpt-4o-mini") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateCompletion(query: string, systemContext: string): Promise<AICompletionResult> {
    const url = "https://api.openai.com/v1/chat/completions";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content: `You are the MaintenX OS Operational Intelligence Assistant for manufacturing plants.
Use the following real-time factory context to answer the operator or manager accurately and concisely.
If the answer cannot be determined from the context, state clearly what data is missing.
Ground-Truth Context:
${systemContext}`,
            },
            {
              role: "user",
              content: query,
            },
          ],
          temperature: 0.2,
          max_tokens: 500,
        }),
        signal: AbortSignal.timeout(15000), // 15-second timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI HTTP ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as any;
      const reply = data.choices?.[0]?.message?.content?.trim() || "No response received from OpenAI.";

      return {
        reply,
        tag: "LLM Analytical Response",
        confidence: 0.95,
        sources: ["OpenAI LLM Engine", "Real-Time Telemetry DB"],
        provider: "OpenAI",
        modelUsed: this.model,
      };
    } catch (err: any) {
      console.error("[OpenAI Provider Error]:", err.message);
      throw new Error(`AI Provider Failure (OpenAI): ${err.message}`);
    }
  }
}
