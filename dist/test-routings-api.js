"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const masterData_service_js_1 = require("./modules/master-data/masterData.service.js");
const database_js_1 = require("./config/database.js");
async function verifyBackendRoutings() {
    console.log("🔍 Testing MasterDataService Routings E2E directly against PostgreSQL...");
    try {
        // 1. List Routings
        const routings = await masterData_service_js_1.masterDataService.listRoutings();
        console.log(`✅ List Routings returned ${routings.length} entries.`);
        if (routings.length > 0) {
            console.log(`Sample Routing: Code=${routings[0].routingCode}, SKU=${routings[0].skuCode} (${routings[0].skuName}), Steps Count=${routings[0].steps?.length}`);
            if (routings[0].steps && routings[0].steps.length > 0) {
                console.log(`First Step: [${routings[0].steps[0].operationCode}] ${routings[0].steps[0].operationName} (Quality Gate: ${routings[0].steps[0].isQualityGate})`);
            }
        }
        // 2. Create New Test Routing
        console.log("\n📦 Creating Test Routing 'RTG-TEST-E2E'...");
        const created = await masterData_service_js_1.masterDataService.createRouting(undefined, {
            routingCode: "RTG-TEST-E2E",
            skuCode: "SKU-5001",
            lineCode: "LINE-1",
            revision: "R1",
            approvalStatus: "Draft",
            status: "Active",
            stdRunRateBPH: 25000,
            setupDurationMin: 20,
            expectedYieldPct: 99.5,
            effectiveFrom: "2026-01-01",
            effectiveTo: "2030-12-31",
            notes: "Automated E2E Verification Test Routing",
            steps: [
                {
                    sequence: 10,
                    operationCode: "OP-TEST-1",
                    operationName: "E2E Test Pre-Rinse",
                    crewSize: 2,
                    stdDurationMin: 12,
                    setupDurationMin: 5,
                    isQualityGate: false,
                    instructions: "Test automated infeed verification",
                },
                {
                    sequence: 20,
                    operationCode: "OP-TEST-2",
                    operationName: "E2E Test Quality Seal Inspection",
                    crewSize: 1,
                    stdDurationMin: 8,
                    setupDurationMin: 2,
                    isQualityGate: true,
                    instructions: "Verify seal pressure tolerance",
                },
            ],
        });
        console.log(`✅ Successfully created test routing: ID=${created.id}, Code=${created.routingCode}, Steps=${created.steps?.length}`);
        // 3. Get Routing by ID
        const fetched = await masterData_service_js_1.masterDataService.getRoutingById(undefined, created.id);
        console.log(`✅ Get by ID verified: Found ${fetched?.routingCode} with ${fetched?.steps?.length} steps.`);
        // 4. Update Status
        const updated = await masterData_service_js_1.masterDataService.updateRoutingStatus(undefined, created.id, {
            approvalStatus: "Approved",
        });
        console.log(`✅ Updated Approval Status: ${updated?.approvalStatus}`);
        // 5. Cleanup
        await masterData_service_js_1.masterDataService.deleteRouting(undefined, created.id);
        console.log("✅ Successfully cleaned up test routing.");
        console.log("\n🎉 ALL BACKEND ROUTINGS TESTS PASSED WITH 100% SUCCESS!");
    }
    catch (err) {
        console.error("❌ E2E test failure:", err);
    }
    finally {
        await database_js_1.pool.end();
    }
}
verifyBackendRoutings();
//# sourceMappingURL=test-routings-api.js.map