import { IAIProvider, AICompletionResult } from "./aiProvider.interface.js";
export declare class GeminiProvider implements IAIProvider {
    name: string;
    private apiKey;
    private model;
    constructor(apiKey: string, model?: string);
    generateCompletion(query: string, systemContext: string): Promise<AICompletionResult>;
}
//# sourceMappingURL=gemini.provider.d.ts.map