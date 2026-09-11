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
    chatQuery(query: string): Promise<{
        query: string;
        reply: string;
        tag: string;
        timestamp: string;
    }>;
}
export declare const aiService: AIService;
//# sourceMappingURL=ai.service.d.ts.map