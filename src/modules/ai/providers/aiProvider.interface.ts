export interface AICompletionResult {
  reply: string;
  tag: string;
  confidence?: number;
  sources?: string[];
  provider: string;
  modelUsed?: string;
}

export interface IAIProvider {
  name: string;
  generateCompletion(query: string, systemContext: string): Promise<AICompletionResult>;
}
