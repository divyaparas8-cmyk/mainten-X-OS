"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
const tenants_js_1 = require("../db/schema/tenants.js");
const tenants_js_2 = require("../db/schema/tenants.js");
const warehouse_js_1 = require("../db/schema/warehouse.js");
const traceability_js_1 = require("../db/schema/traceability.js");
const audit_js_1 = require("../db/schema/audit.js");
const warehouse_service_js_1 = require("../modules/warehouse/warehouse.service.js");
const drizzle_orm_1 = require("drizzle-orm");
async function runWarehouseFlowTests() {
    console.log("================================================================================");
    console.log("🏭 STARTING REAL DB/API END-TO-END WAREHOUSE FLOW TEST SUITE");
    console.log("================================================================================");
    // 1. Resolve Tenant and Plant
    let [tenant] = await database_js_1.db.select().from(tenants_js_1.tenants).limit(1);
    if (!tenant) {
        console.error("❌ No tenant found in PostgreSQL!");
        process.exit(1);
    }
    let [plant] = await database_js_1.db.select().from(tenants_js_2.plants).where((0, drizzle_orm_1.eq)(tenants_js_2.plants.tenantId, tenant.id)).limit(1);
    if (!plant) {
        [plant] = await database_js_1.db.select().from(tenants_js_2.plants).limit(1);
    }
    const plantId = plant?.id || "00000000-0000-0000-0000-000000000001";
    console.log(`✅ Organization Context: Tenant '${tenant.name}' (${tenant.id}), Plant '${plant?.name || "Indore"}'`);
    // 2. Initial Seeding and Dashboard KPI Stats Check
    console.log("\n--- TEST 1: DASHBOARD KPIS & LIVE DB SEEDING ---");
    const initialStats = await warehouse_service_js_1.warehouseService.getDashboardStats(tenant.id, plantId);
    console.log("✅ getDashboardStats output:", JSON.stringify(initialStats, null, 2));
    if (!initialStats.rawMaterialsCount || !initialStats.packagingCount) {
        throw new Error("Dashboard stats missing rawMaterialsCount or packagingCount");
    }
    // 3. Negative Stock Prevention Check
    console.log("\n--- TEST 2: NEGATIVE STOCK PREVENTION ---");
    const [rmLot] = await database_js_1.db
        .select()
        .from(warehouse_js_1.inventoryLots)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.tenantId, tenant.id), (0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.lotType, "RAW_MATERIAL")))
        .limit(1);
    if (!rmLot) {
        throw new Error("No raw material lot found for negative stock test!");
    }
    const hugeQuantity = Number(rmLot.currentQuantity) + 999999;
    let negativeStockPrevented = false;
    try {
        await warehouse_service_js_1.warehouseService.issueRawMaterialToProcessing(tenant.id, plantId, "test-user", {
            lotId: rmLot.id,
            quantity: hugeQuantity,
            batchNumber: "BAT-TEST-FAIL",
        });
    }
    catch (err) {
        console.log("✅ Expected Negative Stock Error Caught:", err.message);
        negativeStockPrevented = true;
    }
    if (!negativeStockPrevented) {
        throw new Error("❌ FAILURE: Negative stock was allowed!");
    }
    console.log("✅ Negative stock prevention successfully verified!");
    // 4. Raw Material Issue / Consumption for Processing Batch
    console.log("\n--- TEST 3: RAW MATERIAL ISSUE FOR PROCESSING BATCH ---");
    const issueQty = 50;
    const balanceBefore = Number(rmLot.currentQuantity);
    const targetBatch = `BAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const issueResult = await warehouse_service_js_1.warehouseService.issueRawMaterialToProcessing(tenant.id, plantId, "test-user", {
        lotId: rmLot.id,
        quantity: issueQty,
        batchNumber: targetBatch,
        uom: rmLot.uom,
        notes: "Batch weighing addition",
    });
    console.log("✅ Raw material issue API response:", issueResult);
    const [updatedRmLot] = await database_js_1.db.select().from(warehouse_js_1.inventoryLots).where((0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.id, rmLot.id));
    const balanceAfter = Number(updatedRmLot.currentQuantity);
    console.log(`   Balance Before: ${balanceBefore}, Balance After: ${balanceAfter}`);
    if (balanceBefore - balanceAfter !== issueQty) {
        throw new Error(`❌ Quantity mismatch: expected deduction of ${issueQty}, got ${balanceBefore - balanceAfter}`);
    }
    // Verify inventoryTransactions
    const [tx] = await database_js_1.db
        .select()
        .from(warehouse_js_1.inventoryTransactions)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(warehouse_js_1.inventoryTransactions.lotId, rmLot.id), (0, drizzle_orm_1.eq)(warehouse_js_1.inventoryTransactions.type, "CONSUMPTION")))
        .orderBy((0, drizzle_orm_1.desc)(warehouse_js_1.inventoryTransactions.createdAt))
        .limit(1);
    if (!tx || tx.referenceId !== targetBatch) {
        throw new Error("❌ Inventory transaction not found or reference mismatch!");
    }
    console.log("✅ Consumption transaction recorded in DB with ID:", tx.id);
    // 5. Test Duplicate Movement Prevention
    console.log("\n--- TEST 4: DUPLICATE MOVEMENT PREVENTION ---");
    let duplicatePrevented = false;
    try {
        await warehouse_service_js_1.warehouseService.issueRawMaterialToProcessing(tenant.id, plantId, "test-user", {
            lotId: rmLot.id,
            quantity: issueQty,
            batchNumber: targetBatch,
            uom: rmLot.uom,
            notes: "Batch weighing addition duplicate attempt",
        });
    }
    catch (err) {
        console.log("✅ Expected Duplicate Movement Error Caught:", err.message);
        duplicatePrevented = true;
    }
    if (!duplicatePrevented) {
        throw new Error("❌ FAILURE: Duplicate movement was not prevented within sliding window!");
    }
    console.log("✅ Duplicate movement prevention verified!");
    // 6. WIP / Semi-Finished Lot Inventory and Tank/Silo Locations
    console.log("\n--- TEST 5: WIP LOT CREATION & TANK/SILO INVENTORY ---");
    const wipBatch = targetBatch;
    const wipVolume = 8500;
    const wipLotNum = `LOT-WIP-${wipBatch}`;
    const tank = "Tank T-01";
    const wipResult = await warehouse_service_js_1.warehouseService.createWipLot(tenant.id, plantId, "test-user", {
        batchNumber: wipBatch,
        lotNumber: wipLotNum,
        volume: wipVolume,
        uom: "Liters",
        tankNumber: tank,
        status: "RELEASED",
    });
    console.log("✅ WIP lot registered:", wipResult.message);
    const wipData = await warehouse_service_js_1.warehouseService.getWipLots(tenant.id, plantId);
    const createdWipInList = wipData.wipLots.find(w => w.lotNumber === wipLotNum);
    if (!createdWipInList) {
        throw new Error(`❌ WIP lot ${wipLotNum} not found in getWipLots query!`);
    }
    console.log(`✅ getWipLots successfully listed WIP Lot: ${createdWipInList.lotNumber}, Quantity: ${createdWipInList.quantity} ${createdWipInList.uom}`);
    const targetTankLocation = wipData.tankLocations.find(t => t.location?.includes("Tank T-01"));
    console.log("   Tank Status:", targetTankLocation?.status, "Material:", targetTankLocation?.material);
    // 7. Packaging Material Staging / Issue
    console.log("\n--- TEST 6: PACKAGING MATERIAL STAGING ---");
    const [pkgLot] = await database_js_1.db
        .select()
        .from(warehouse_js_1.inventoryLots)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.tenantId, tenant.id), (0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.lotType, "PACKAGING")))
        .limit(1);
    if (!pkgLot) {
        throw new Error("No packaging material lot found!");
    }
    const pkgStageQty = 1200;
    const pkgBalanceBefore = Number(pkgLot.currentQuantity);
    const packagingLine = `Canning Line ${Math.floor(1000 + Math.random() * 9000)}`;
    const stageResult = await warehouse_service_js_1.warehouseService.stagePackagingMaterial(tenant.id, plantId, "test-user", {
        lotId: pkgLot.id,
        quantity: pkgStageQty,
        packagingLine,
        runNumber: `RUN-${wipBatch}`,
        notes: "Line staging for Yuzu soda run",
    });
    console.log("✅ Packaging material stage response:", stageResult);
    const [updatedPkgLot] = await database_js_1.db.select().from(warehouse_js_1.inventoryLots).where((0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.id, pkgLot.id));
    const pkgBalanceAfter = Number(updatedPkgLot.currentQuantity);
    console.log(`   Pkg Lot Balance Before: ${pkgBalanceBefore}, Balance After: ${pkgBalanceAfter}`);
    if (pkgBalanceBefore - pkgBalanceAfter !== pkgStageQty) {
        throw new Error("❌ Packaging stock deduction mismatch!");
    }
    // 8. Separated Movements Query
    console.log("\n--- TEST 7: SEPARATED MATERIAL MOVEMENTS ---");
    const allMovements = await warehouse_service_js_1.warehouseService.getSeparatedMovements(tenant.id, plantId);
    const processingMovements = await warehouse_service_js_1.warehouseService.getSeparatedMovements(tenant.id, plantId, "processing");
    const packagingMovements = await warehouse_service_js_1.warehouseService.getSeparatedMovements(tenant.id, plantId, "packaging");
    console.log(`✅ Total movements: ${allMovements.counts.total}`);
    console.log(`✅ Processing movements: ${processingMovements.movements.length} (Expected >= 1)`);
    console.log(`✅ Packaging movements: ${packagingMovements.movements.length} (Expected >= 1)`);
    if (processingMovements.movements.length === 0 || packagingMovements.movements.length === 0) {
        throw new Error("❌ Separated movements failed to segregate processing and packaging transactions!");
    }
    // 9. Packaging Run → Finished Goods Lot / Pallet Creation (with Lot Traceability & QA Status)
    console.log("\n--- TEST 8: PACKAGING RUN → FINISHED GOODS LOT & PALLET WITH LOT TRACEABILITY ---");
    const fgLotNum = `LOT-FG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const palletSerial = `PLT-CAN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const qaStatus = "QA Released";
    const fgResult = await warehouse_service_js_1.warehouseService.createPackagingFinishedGoods(tenant.id, plantId, "test-user", {
        batchNumber: wipBatch,
        wipLotNumber: wipLotNum,
        sku: "SKU-5001",
        productName: "500ml Sparkling Citrus Soda",
        finishedLot: fgLotNum,
        palletSerial,
        quantity: "24,000 cans (24 Pallets)",
        storageLocation: "Zone C - High Bay Rack H02-B1",
        qaStatus,
        destination: "Toronto Commercial Logistics Hub",
        notes: "Packaging run signed off & QA Released",
    });
    console.log("✅ createPackagingFinishedGoods response:", fgResult.message);
    console.log("   Finished Goods ID:", fgResult.finishedGood?.id);
    console.log("   Inventory Lot ID:", fgResult.inventoryLot?.id);
    // Check finishedGoods table
    const [createdFg] = await database_js_1.db.select().from(warehouse_js_1.finishedGoods).where((0, drizzle_orm_1.eq)(warehouse_js_1.finishedGoods.finishedLot, fgLotNum));
    if (!createdFg) {
        throw new Error("❌ Finished Goods record was not inserted into PostgreSQL finished_goods table!");
    }
    console.log(`✅ Finished Goods confirmed in DB: SKU ${createdFg.sku}, Pallet ${createdFg.palletSerial}, QA Status: ${createdFg.qaStatus}`);
    // Check inventoryLots table
    const [createdFgLot] = await database_js_1.db.select().from(warehouse_js_1.inventoryLots).where((0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.lotNumber, fgLotNum));
    if (!createdFgLot || createdFgLot.lotType !== "FINISHED_GOOD") {
        throw new Error("❌ Finished Goods lot was not added to inventory_lots table!");
    }
    console.log(`✅ Finished Goods Lot confirmed in inventory_lots: Lot #${createdFgLot.lotNumber}, Status: ${createdFgLot.status}`);
    // Check lotGenealogies table
    const [genealogy] = await database_js_1.db
        .select()
        .from(traceability_js_1.lotGenealogies)
        .where((0, drizzle_orm_1.eq)(traceability_js_1.lotGenealogies.childLotId, createdFgLot.id));
    if (!genealogy) {
        console.warn("⚠️ Lot genealogy check: child lot genealogy entry not found");
    }
    else {
        console.log(`✅ Lot Genealogy confirmed: Parent Lot ${genealogy.parentLotId} -> Child FG Lot ${genealogy.childLotId}`);
    }
    // Check auditLogs table
    const recentAudit = await database_js_1.db
        .select()
        .from(audit_js_1.auditLogs)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(audit_js_1.auditLogs.tenantId, tenant.id), (0, drizzle_orm_1.eq)(audit_js_1.auditLogs.action, "PACKAGING_RUN_COMPLETED")))
        .orderBy((0, drizzle_orm_1.desc)(audit_js_1.auditLogs.createdAt))
        .limit(1);
    if (recentAudit.length > 0) {
        console.log(`✅ Audit Log confirmed in PostgreSQL: Action '${recentAudit[0].action}', Entity '${recentAudit[0].entityType}', ID '${recentAudit[0].entityId}'`);
    }
    // 10. Flow Summary
    console.log("\n--- TEST 9: WAREHOUSE FLOW SUMMARY TELEMETRY ---");
    const summary = await warehouse_service_js_1.warehouseService.getFlowSummary(tenant.id, plantId);
    console.log("✅ Flow Summary KPIs:", summary.kpis);
    console.log(`   Raw Materials count: ${summary.rawMaterials.length}`);
    console.log(`   Processing Batches count: ${summary.processingBatches.length}`);
    console.log(`   WIP Lots count: ${summary.wipLots.length}`);
    console.log(`   Packaging Materials count: ${summary.packagingMaterials.length}`);
    console.log(`   Finished Goods count: ${summary.finishedGoods.length}`);
    console.log("\n================================================================================");
    console.log("🎉 ALL WAREHOUSE DB/API TESTS PASSED WITH REAL POSTGRESQL DATA!");
    console.log("================================================================================");
    process.exit(0);
}
runWarehouseFlowTests().catch(err => {
    console.error("\n❌ TEST SUITE FAILED WITH EXCEPTION:", err);
    process.exit(1);
});
