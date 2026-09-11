export declare class AIService {
    private insights;
    listInsights(): Promise<{
        id: string;
        category: string;
        title: string;
        impact: string;
        confidence: string;
        action: string;
        status: string;
    }[]>;
    approveInsight(id: string): Promise<{
        id: string;
        category: string;
        title: string;
        impact: string;
        confidence: string;
        action: string;
        status: string;
    } | {
        id: string;
        status: string;
    }>;
    rejectInsight(id: string): Promise<{
        id: string;
        category: string;
        title: string;
        impact: string;
        confidence: string;
        action: string;
        status: string;
    } | {
        id: string;
        status: string;
    }>;
    chatQuery(query: string, tenantId?: string): Promise<{
        query: string;
        reply: string;
        tag: string;
        confidence: number | undefined;
        sources: string[];
        provider: string;
        modelUsed: string | undefined;
        timestamp: string;
    } | {
        query: string;
        reply: string;
        tag: string;
        confidence: number;
        sources: string[];
        provider: string;
        timestamp: string;
        modelUsed?: undefined;
    }>;
}
export declare const aiService: AIService;
//# sourceMappingURL=ai.service.d.ts.map