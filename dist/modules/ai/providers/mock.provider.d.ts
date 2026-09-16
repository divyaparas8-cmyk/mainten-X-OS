import { IAIProvider, AICompletionResult } from "./aiProvider.interface.js";
export declare class MockAIProvider implements IAIProvider {
    name: string;
    generateCompletion(query: string, systemContext: string): Promise<AICompletionResult>;
}
//# sourceMappingURL=mock.provider.d.ts.map