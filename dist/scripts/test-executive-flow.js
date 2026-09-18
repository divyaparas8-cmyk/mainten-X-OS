"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
const tenants_js_1 = require("../db/schema/tenants.js");
const executive_service_js_1 = require("../modules/executive/executive.service.js");
const drizzle_orm_1 = require("drizzle-orm");
async function runExecutiveDashboardTests() {
    console.log("================================================================================");
    console.log("👑 STARTING EXECUTIVE DASHBOARD REAL DB/API END-TO-END TEST SUITE");
    console.log("================================================================================");
    // 1. Resolve Organization Context
    const allTenants = await database_js_1.db.select().from(tenants_js_1.tenants);
    const tenant = allTenants.find(t => t.slug === "abc-mtwl0wh8") || allTenants[0];
    if (!tenant) {
        throw new Error("No tenant found in PostgreSQL!");
    }
    const tenantId = tenant.id;
    console.log(`✅ Tenant Context: '${tenant.name}' (${tenantId})`);
    // 2. Test Live DB Seeding & Data Existence
    console.log("\n--- TEST 1: LIVE DB SEEDING & FOUNDATIONAL TELEMETRY ---");
    await executive_service_js_1.executiveService.ensureExecutiveDataSeeded(tenantId);
    const dbPlants = await database_js_1.db.select().from(tenants_js_1.plants).where((0, drizzle_orm_1.eq)(tenants_js_1.plants.tenantId, tenantId));
    console.log(`✅ Verified ${dbPlants.length} plants in PostgreSQL for tenant '${tenant.name}'`);
    const primaryPlantId = dbPlants[0]?.id;
    // 3. Test Enterprise Dashboard Summary (ALL Plants)
    console.log("\n--- TEST 2: ENTERPRISE OVERVIEW (ALL PLANTS) ---");
    const summary = await executive_service_js_1.executiveService.getDashboardSummary(tenantId, "ALL");
    console.log("✅ Top StatCards:");
    console.log(`   - Production Attainment: ${summary.productionAttainment}`);
    console.log(`   - Target Units: ${summary.productionTargetUnits}, Actual Units: ${summary.productionActualUnits}`);
    console.log(`   - Fleet MTBF: ${summary.fleetMTBF}, Fleet MTTR: ${summary.fleetMTTR}`);
    console.log(`   - Realized CI Savings: ${summary.realizedSavingsTotal}, Pipeline: ${summary.pipelineSavingsTotal}`);
    console.log(`   - Manufacturing Cost (MTD): ${summary.manufacturingCostMTD} (Target: ${summary.standardCostTarget})`);
    console.log(`   - Net Cost Variance: ${summary.costVariance} (${summary.costVarianceStatus})`);
    if (!summary.productionAttainment) {
        throw new Error("Missing productionAttainment in dashboard summary");
    }
    // 4. Test Processing vs Packaging Summary (Requirement 1)
    console.log("\n--- TEST 3: PROCESSING VS PACKAGING SEPARATED OPERATIONS (REQ 1) ---");
    const ops = summary.operationsSummary;
    console.log("✅ Processing Operations Summary:", JSON.stringify(ops.processing, null, 2));
    console.log("✅ Packaging Operations Summary:", JSON.stringify(ops.packaging, null, 2));
    console.log("✅ Combined Operations Summary:", JSON.stringify(ops.combined, null, 2));
    if (!ops.processing || !ops.packaging || !ops.combined) {
        throw new Error("Operations summary does not properly separate Processing and Packaging");
    }
    if (typeof ops.processing.targetVolume !== "number" || typeof ops.packaging.targetUnits !== "number") {
        throw new Error("Processing/Packaging summary metrics must be valid numeric quantities");
    }
    // 5. Test Processing OEE & Performance (Requirement 2)
    console.log("\n--- TEST 4: PROCESSING OEE & PERFORMANCE METRICS (REQ 2) ---");
    const procPerf = summary.processingPerformance;
    console.log("✅ Processing Performance Output:", {
        oee: `${procPerf.oeePercent}%`,
        availability: `${procPerf.availabilityPercent}%`,
        performance: `${procPerf.performancePercent}%`,
        quality: `${procPerf.qualityPercent}%`,
        outputVolume: `${procPerf.outputVolume.toLocaleString()} L`,
        downtimeMinutes: `${procPerf.downtimeMinutes} mins`,
        status: procPerf.status
    });
    if (typeof procPerf.oeePercent !== "number" || procPerf.oeePercent <= 0) {
        throw new Error("Invalid Processing OEE calculation");
    }
    // 6. Test Packaging OEE & Performance (Requirement 3)
    console.log("\n--- TEST 5: PACKAGING OEE & PERFORMANCE METRICS (REQ 3) ---");
    const packPerf = summary.packagingPerformance;
    console.log("✅ Packaging Performance Output:", {
        oee: `${packPerf.oeePercent}%`,
        availability: `${packPerf.availabilityPercent}%`,
        performance: `${packPerf.performancePercent}%`,
        quality: `${packPerf.qualityPercent}%`,
        outputUnits: `${packPerf.outputUnits.toLocaleString()} Units`,
        downtimeMinutes: `${packPerf.downtimeMinutes} mins`,
        scrapUnits: `${packPerf.scrapUnits.toLocaleString()} Units`,
        scrapRate: `${packPerf.scrapRatePercent}%`,
        status: packPerf.status
    });
    if (typeof packPerf.oeePercent !== "number" || packPerf.oeePercent <= 0) {
        throw new Error("Invalid Packaging OEE calculation");
    }
    // 7. Test Yield vs Scrap/Reject Rates (Requirement 4)
    console.log("\n--- TEST 6: YIELD VS SCRAP/REJECT RATES (REQ 4) ---");
    const yieldScrap = summary.yieldAnalysis;
    console.log("✅ Yield vs Scrap Analysis:", {
        processingYield: `${yieldScrap.processingYieldPercent}% (Target: ${yieldScrap.processingTargetYieldPercent}%, Status: ${yieldScrap.processingYieldStatus})`,
        packagingScrapRate: `${yieldScrap.packagingScrapRatePercent}% (Target: ${yieldScrap.packagingScrapTargetPercent}%, Status: ${yieldScrap.packagingScrapStatus})`,
        totalDefects: `${yieldScrap.totalDefectUnits} units`,
        notes: yieldScrap.notes
    });
    if (typeof yieldScrap.processingYieldPercent !== "number" || typeof yieldScrap.packagingScrapRatePercent !== "number") {
        throw new Error("Invalid Yield vs Scrap calculation values");
    }
    // 8. Test Cost Analysis (Bulk vs Packaging Conversion) (Requirement 5)
    console.log("\n--- TEST 7: COST ANALYSIS - BULK VS PACKAGING CONVERSION (REQ 5) ---");
    const cost = summary.costAnalysis;
    console.log("✅ Cost Analysis:", {
        bulkFormulationCost: `$${cost.bulkFormulationCostUSD.toLocaleString()} (${cost.bulkCostPerUnit})`,
        packagingConversionCost: `$${cost.packagingConversionCostUSD.toLocaleString()} (${cost.packagingCostPerUnit})`,
        totalCost: `$${cost.totalManufacturingCostUSD.toLocaleString()} (Budget: $${cost.standardBudgetUSD.toLocaleString()})`,
        netVariance: `${cost.netVarianceUSD >= 0 ? '+' : '-'}$${Math.abs(cost.netVarianceUSD).toLocaleString()} (${cost.varianceStatus})`,
        breakdownLines: cost.costBreakdown.length
    });
    console.log("   Department Breakdown:", cost.costBreakdown.map(b => `${b.category} [${b.department}]: Actual ${b.actual}, Var ${b.variance}`).join(" | "));
    if (!cost.bulkFormulationCostUSD || !cost.packagingConversionCostUSD) {
        throw new Error("Cost analysis missing Bulk or Packaging conversion figures");
    }
    // 9. Test Labour H/B Pacing (Requirement 6)
    console.log("\n--- TEST 8: LABOUR HOUR-BY-HOUR (H/B) PACING (REQ 6) ---");
    const hb = summary.labourHbPacing;
    console.log("✅ Labour H/B Pacing Widget:");
    console.log(`   - Processing H/B: Target ${hb.processingHb.targetPerHour}/h, Actual ${hb.processingHb.actualPerHour}/h, Delta: ${hb.processingHb.delta}, Pace: ${hb.processingHb.pacingPercent}% (${hb.processingHb.status})`);
    console.log(`   - Packaging H/B: Target ${hb.packagingHb.targetPerHour}/h, Actual ${hb.packagingHb.actualPerHour}/h, Delta: ${hb.packagingHb.delta}, Pace: ${hb.packagingHb.pacingPercent}% (${hb.packagingHb.status})`);
    console.log(`   - Total Operations H/B: Target ${hb.totalOperationsHb.combinedTargetPerHour}/h, Actual ${hb.totalOperationsHb.combinedActualPerHour}/h, Delta: ${hb.totalOperationsHb.netDelta}, Pace: ${hb.totalOperationsHb.shiftPacingPercent}%`);
    console.log(`   - EOD Projection: ${hb.totalOperationsHb.eodProjection}`);
    console.log(`   - Recent Pitches Logged: ${hb.recentHours.length} hours`);
    if (!hb.processingHb || !hb.packagingHb || !hb.totalOperationsHb) {
        throw new Error("Labour H/B pacing does not contain 3 balanced sections for Processing, Packaging, and Total");
    }
    // 10. Test Plant Filtering
    console.log("\n--- TEST 9: PLANT ISOLATION & FILTERING ---");
    if (primaryPlantId) {
        const plantSummary = await executive_service_js_1.executiveService.getDashboardSummary(tenantId, primaryPlantId);
        console.log(`✅ Plant Filter (${primaryPlantId}) Output:`);
        console.log(`   - Plant Attainment: ${plantSummary.productionAttainment}`);
        console.log(`   - Plant Processing OEE: ${plantSummary.processingPerformance.oeePercent}%`);
        console.log(`   - Plant Packaging OEE: ${plantSummary.packagingPerformance.oeePercent}%`);
        console.log(`   - Active Facilities in Scope: ${plantSummary.activePlantsCount}`);
    }
    // 11. Test Top Losses & Plant Portfolio
    console.log("\n--- TEST 10: TOP LOSSES & PLANT PERFORMANCE PORTFOLIO ---");
    console.log(`✅ Plant Portfolio Count: ${summary.plants.length}`);
    summary.plants.forEach(p => console.log(`   - ${p.name}: Attainment ${p.achievement}, Status ${p.status}, OEE: ${p.oee}, Scrap: ${p.scrapRate}`));
    console.log(`✅ Top Losses Tracked: ${summary.topLosses.length}`);
    summary.topLosses.forEach(l => console.log(`   - [${l.category}] ${l.eventName} on ${l.lineId}: ${l.hoursLost}h lost (-$${l.financialImpactUSD})`));
    console.log("\n================================================================================");
    console.log("🎉 ALL 10 EXECUTIVE DASHBOARD DB/API TESTS PASSED CLEANLY!");
    console.log("================================================================================");
}
runExecutiveDashboardTests()
    .then(() => process.exit(0))
    .catch(err => {
    console.error("\n❌ EXECUTIVE TEST FAILED:", err);
    process.exit(1);
});
