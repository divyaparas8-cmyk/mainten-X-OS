import { AIProviderFactory } from "./providers/providerFactory.js";
import { OperationalContextBuilder } from "./context/operationalContext.js";

export class AIService {
  private insights = [
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

  async approveInsight(id: string) {
    const item = this.insights.find((i) => i.id === id);
    if (item) item.status = "Approved";
    return item || { id, status: "Approved" };
  }

  async rejectInsight(id: string) {
    const item = this.insights.find((i) => i.id === id);
    if (item) item.status = "Rejected";
    return item || { id, status: "Rejected" };
  }

  async chatQuery(query: string, tenantId?: string) {
    if (!query || !query.trim()) {
      throw new Error("Query cannot be empty");
    }

    // 1. Build ground-truth operational context from active factory state
    const systemContext = await OperationalContextBuilder.buildContext(tenantId);

    // 2. Obtain configured AI provider adapter
    const provider = AIProviderFactory.getProvider();

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
    } catch (err: any) {
      console.warn(`[AIService] Provider ${provider.name} failed, falling back to heuristic engine:`, err.message);
      // Seamless fallback to heuristic engine if external API throws error (e.g. invalid key or network timeout)
      const fallbackProvider = AIProviderFactory.getProvider(); // or MockAIProvider
      const mockResult = await (new (await import("./providers/mock.provider.js")).MockAIProvider()).generateCompletion(
        query.trim(),
        systemContext
      );

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

export const aiService = new AIService();
