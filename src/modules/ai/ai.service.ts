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
    }
  ];

  async listInsights() {
    return this.insights;
  }

  async approveInsight(id: string) {
    const item = this.insights.find(i => i.id === id);
    if (item) item.status = "Approved";
    return item || { id, status: "Approved" };
  }

  async rejectInsight(id: string) {
    const item = this.insights.find(i => i.id === id);
    if (item) item.status = "Rejected";
    return item || { id, status: "Rejected" };
  }

  async chatQuery(query: string) {
    const q = (query || "").toLowerCase();
    let reply = "Based on live telemetry for Indore Plant 01: Overall OEE is trending at 86.4% across all 3 active lines. Pacing target is 99.6% attained with 0 critical P1 alarms.";
    let tag = "Plant Performance Overview";

    if (q.includes("oee") || q.includes("efficiency")) {
      reply = "Line 1 is leading with 88.2% OEE, Line 3 is at 87.0%, and Line 2 is recovering at 84.1% post-pasteurizer calibration. Availability rate is 92.4%.";
      tag = "OEE Analysis";
    } else if (q.includes("downtime") || q.includes("stop") || q.includes("loss")) {
      reply = "Shift A experienced 18 mins downtime on Line 1 due to cap conveyor photoeye glare (resolved), and 24 mins SMED changeover on Line 2. Total financial impact is estimated at $3,675.";
      tag = "Downtime Breakdown";
    } else if (q.includes("bottle") || q.includes("order") || q.includes("schedule")) {
      reply = "Master Production Schedule currently has 6 active runs. Order PO-2026-001 (500ml Sparkling Citrus) is 67% complete with 32,150 bottles produced.";
      tag = "Schedule Attainment";
    }

    return {
      query,
      reply,
      tag,
      timestamp: new Date().toISOString(),
    };
  }
}

export const aiService = new AIService();
