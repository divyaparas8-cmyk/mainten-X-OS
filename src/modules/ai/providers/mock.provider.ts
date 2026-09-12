import { IAIProvider, AICompletionResult } from "./aiProvider.interface.js";

export class MockAIProvider implements IAIProvider {
  name = "Mock/Simulator AI";

  async generateCompletion(query: string, systemContext: string): Promise<AICompletionResult> {
    const q = (query || "").toLowerCase();
    let reply = "";
    let tag = "Plant Intelligence Overview";
    let confidence = 0.92;

    if (q.includes("oee") || q.includes("efficiency") || q.includes("performance")) {
      tag = "OEE & Throughput Analysis";
      reply = `Line 1 (Bottling) is currently operating at 88.4% OEE with 94.2% Availability. Line 2 (Pasteurizer) is recovering at 84.1% OEE following thermal dwell calibration. Plant cumulative pacing attainment is 99.4% of schedule.`;
    } else if (q.includes("downtime") || q.includes("stoppage") || q.includes("alarm") || q.includes("jam")) {
      tag = "Downtime Breakdown & Root Cause";
      reply = `Shift A recorded 18 minutes of unplanned micro-stoppages on Line 1 caused by Photoeye PE-04 glare reflection (resolved). Line 2 has an active warning for Pasteurizer pressure modulation. Cumulative stoppage cost impact is approximately $3,675.`;
    } else if (q.includes("order") || q.includes("batch") || q.includes("schedule") || q.includes("production")) {
      tag = "Production Order Attainment";
      reply = `Active run order PO-2026-001 (500ml Sparkling Citrus) is 67.2% complete with 32,150 units bottled. Current line nominal speed is pacing at 248 bpm against 250 bpm design target. Projected run completion time is 16:45.`;
    } else if (q.includes("vibration") || q.includes("temperature") || q.includes("bearing") || q.includes("iot") || q.includes("sensor")) {
      tag = "Condition-Based Predictive Alert";
      reply = `IoT Edge Node IOT-01 reports capper spindle bearing #4 spectral vibration at 2.85 mm/s RMS (approaching 3.0 mm/s warning threshold). Bearing operating temperature is steady at 64.2°C. Preventive lubrication is recommended during the 14:30 shift changeover.`;
    } else if (q.includes("quality") || q.includes("ccp") || q.includes("spec") || q.includes("brix") || q.includes("ph")) {
      tag = "Quality & CCP Compliance";
      reply = `All Critical Control Points (CCPs) are verified in nominal state. Pasteurization core temp is holding at 72.4°C (Limit: 72.0°C ± 1.0°C). Batch Brix test is 11.2° Bx against target 11.0° Bx. Zero holds active.`;
    } else {
      reply = `Based on real-time operational context: Plant Indore 01 is running nominal across 3 packaging lines with 0 critical P1 stoppages. Line 1 OEE is 88.4%, active order PO-2026-001 is on schedule, and telemetry indicates stable mechanical parameters across all connected OPC-UA/MQTT edge gateways.`;
    }

    return {
      reply,
      tag,
      confidence,
      sources: ["Operational Intelligence Engine", "PostgreSQL Telemetry DB", "Active Shift Context"],
      provider: "MaintenX Operational Intelligence (Simulator)",
      modelUsed: "Heuristic-Rule-Based-v1",
    };
  }
}
