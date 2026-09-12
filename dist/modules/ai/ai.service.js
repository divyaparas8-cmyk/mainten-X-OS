"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AIService = void 0;
const providerFactory_js_1 = require("./providers/providerFactory.js");
const operationalContext_js_1 = require("./context/operationalContext.js");
class AIService {
    insights = [
        {
            id: "ai-ins-1",
            category: "Energy & OEE",
            title: "Line 2 Pasteurizer Thermal Modulation Optimization",
            impact: "Projected $4,850 / mo energy savings with zero throughput loss",
            confidence: "94.2%",
            action: "Reduce boiler reheat dwell from 28s to 22s during steady-state pasteurization",
            status: "Proposed",
        },
        {
            id: "ai-ins-2",
            category: "Predictive Maintenance",
            title: "Capper Head Spindle #4 Bearing Vibration Spike",
            impact: "Prevents unplanned line stoppage estimated at 45 minutes",
            confidence: "91.8%",
            action: "Dispatch L2 lubrication tech during upcoming 14:30 changeover window",
            status: "Proposed",
        },
        {
            id: "ai-ins-3",
            category: "Schedule Attainment",
            title: "Line 1 Speed Calibration for Citrus Batch",
            impact: "Recovers 12 minutes lost to morning micro-stops",
            confidence: "88.6%",
            action: "Increase BPH throttling by +3.5% for final 2 hours of Shift A",
            status: "Approved",
        },
    ];
    async listInsights() {
        return this.insights;
    }
    async approveInsight(id) {
        const item = this.insights.find((i) => i.id === id);
        if (item)
            item.status = "Approved";
        return item || { id, status: "Approved" };
    }
    async rejectInsight(id) {
        const item = this.insights.find((i) => i.id === id);
        if (item)
            item.status = "Rejected";
        return item || { id, status: "Rejected" };
    }
    async chatQuery(query, tenantId) {
        if (!query || !query.trim()) {
            throw new Error("Query cannot be empty");
        }
        // 1. Build ground-truth operational context from active factory state
        const systemContext = await operationalContext_js_1.OperationalContextBuilder.buildContext(tenantId);
        // 2. Obtain configured AI provider adapter
        const provider = providerFactory_js_1.AIProviderFactory.getProvider();
        try {
            // 3. Generate completion with context grounding
            const result = await provider.generateCompletion(query.trim(), systemContext);
            return {
                query: query.trim(),
                reply: result.reply,
                tag: result.tag,
                confidence: result.confidence,
                sources: result.sources || ["Operational SCADA Gateway", "CMMS Telemetry DB"],
                provider: result.provider,
                modelUsed: result.modelUsed,
                timestamp: new Date().toISOString(),
            };
        }
        catch (err) {
            console.warn(`[AIService] Provider ${provider.name} failed, falling back to heuristic engine:`, err.message);
            // Seamless fallback to heuristic engine if external API throws error (e.g. invalid key or network timeout)
            const fallbackProvider = providerFactory_js_1.AIProviderFactory.getProvider(); // or MockAIProvider
            const mockResult = await (new (await import("./providers/mock.provider.js")).MockAIProvider()).generateCompletion(query.trim(), systemContext);
            return {
                query: query.trim(),
                reply: mockResult.reply,
                tag: mockResult.tag,
                confidence: 0.90,
                sources: ["MaintenX Fallback Operational Engine", "PostgreSQL Local Cache"],
                provider: `Fallback Engine (${err.message.includes("401") ? "Invalid API Key" : "Connection Timeout"})`,
                timestamp: new Date().toISOString(),
            };
        }
    }
}
exports.AIService = AIService;
exports.aiService = new AIService();
//# sourceMappingURL=ai.service.js.map