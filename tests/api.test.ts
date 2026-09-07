import { describe, it, expect } from "vitest";
import { buildApp } from "../src/app.js";
import { calculateOEE } from "../src/shared/engines/oeeEngine.js";
import { calculateNetRequirements } from "../src/shared/engines/mrpEngine.js";
import { calculateReliability } from "../src/shared/engines/mtbfEngine.js";
import { calculateExponentialSmoothingForecast } from "../src/shared/engines/forecastEngine.js";
import { buildSampleTraceabilityTree } from "../src/shared/engines/genealogyEngine.js";

describe("MaintenX OS Backend Engine & API Test Suite", () => {
  it("should initialize Fastify app and pass /health check", async () => {
    const app = await buildApp();
    const response = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.status).toBe("ok");
    expect(body.service).toBe("MaintenX OS Backend");
  });

  it("should calculate OEE accurately (Availability × Performance × Quality)", () => {
    const result = calculateOEE({
      plannedProductionMinutes: 480,
      downtimeMinutes: 38,
      idealCycleTimeSeconds: 1.05,
      totalUnitsProduced: 24000,
      goodUnitsProduced: 23800,
    });

    expect(result.availabilityPercent).toBeGreaterThan(90);
    expect(result.performancePercent).toBeGreaterThan(90);
    expect(result.qualityPercent).toBe(99.2);
    expect(result.overallOEEPercent).toBeGreaterThan(85);
  });

  it("should calculate MRP Net Requirements & Shortages correctly", () => {
    const result = calculateNetRequirements({
      demand: 12000,
      availableStock: 4000,
      reservedStock: 1000,
      scheduledReceipts: 2000,
      safetyStock: 1500,
    });

    expect(result.hasShortage).toBe(true);
    expect(result.netRequirement).toBe(8500);
  });

  it("should calculate MTBF and Reliability Availability", () => {
    const result = calculateReliability({
      totalOperatingHours: 720,
      breakdownCount: 3,
      totalRepairHours: 5.4,
    });

    expect(result.mtbfHours).toBe(240);
    expect(result.mttrHours).toBe(1.8);
    expect(result.availabilityPercent).toBeGreaterThan(99);
  });

  it("should calculate Statistical Forecast with Promo Uplift", () => {
    const result = calculateExponentialSmoothingForecast({
      historicalDemand: [10000, 12000, 11500, 13000, 12500],
      alpha: 0.3,
      promoUpliftPercent: 10,
    });

    expect(result.baselineForecast).toBeGreaterThan(11000);
    expect(result.promoUpliftUnits).toBeGreaterThan(1000);
    expect(result.finalForecast).toBe(result.baselineForecast + result.promoUpliftUnits);
    expect(result.mapeAccuracy).toBe(94.6);
  });

  it("should generate 360° Supplier-to-Customer Genealogy Tree", () => {
    const tree = buildSampleTraceabilityTree("LOT-RM-ORG-4402");

    expect(tree.type).toBe("SUPPLIER");
    expect(tree.children?.[0].type).toBe("RAW_LOT");
    expect(tree.children?.[0].code).toBe("LOT-RM-ORG-4402");
    expect(tree.children?.[0].children?.[0].type).toBe("BATCH");
    expect(tree.children?.[0].children?.[0].children?.[0].type).toBe("FINISHED_LOT");
  });
});
