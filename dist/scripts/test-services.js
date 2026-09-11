"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
const tenants_js_1 = require("../db/schema/tenants.js");
const production_service_js_1 = require("../modules/production/production.service.js");
const quality_service_js_1 = require("../modules/quality/quality.service.js");
const warehouse_service_js_1 = require("../modules/warehouse/warehouse.service.js");
const maintenance_service_js_1 = require("../modules/maintenance/maintenance.service.js");
async function testAllServices() {
    console.log("=== TESTING ALL CORE SERVICES WITH REAL POSTGRESQL DATA ===");
    const [t] = await database_js_1.db.select().from(tenants_js_1.tenants).limit(1);
    if (!t) {
        console.error("❌ No tenant found in DB!");
        return;
    }
    console.log(`Tenant: ${t.name} (ID: ${t.id})`);
    // 1. Production Orders
    try {
        const orders = await production_service_js_1.productionService.listOrders(t.id);
        console.log(`✅ productionService.listOrders: SUCCESS (${orders.length} orders found)`);
        if (orders.length > 0) {
            console.log(`   Sample: Order #${orders[0].orderNumber} (SKU: ${orders[0].sku?.skuCode})`);
        }
    }
    catch (err) {
        console.error(`❌ productionService.listOrders FAILED:`, err.message);
    }
    // 2. Production Batches
    try {
        const batches = await production_service_js_1.productionService.listBatches(t.id);
        console.log(`✅ productionService.listBatches: SUCCESS (${batches.length} batches found)`);
        if (batches.length > 0) {
            console.log(`   Sample: Batch #${batches[0].batchNumber} (Status: ${batches[0].status})`);
        }
    }
    catch (err) {
        console.error(`❌ productionService.listBatches FAILED:`, err.message);
    }
    // 3. QA Release Queue
    try {
        const queue = await quality_service_js_1.qualityService.listQaReleaseQueue(t.id);
        console.log(`✅ qualityService.listQaReleaseQueue: SUCCESS (${queue.length} batches in QA queue)`);
    }
    catch (err) {
        console.error(`❌ qualityService.listQaReleaseQueue FAILED:`, err.message);
    }
    // 4. Warehouse Lots
    try {
        const lots = await warehouse_service_js_1.warehouseService.listLots(t.id);
        console.log(`✅ warehouseService.listLots: SUCCESS (${lots.length} lots found)`);
        if (lots.length > 0) {
            console.log(`   Sample: Lot #${lots[0].lotNumber} (SKU: ${lots[0].sku?.skuCode || lots[0].skuId})`);
        }
    }
    catch (err) {
        console.error(`❌ warehouseService.listLots FAILED:`, err.message);
    }
    // 5. Warehouse Transactions
    try {
        const txs = await warehouse_service_js_1.warehouseService.listTransactions(t.id);
        console.log(`✅ warehouseService.listTransactions: SUCCESS (${txs.length} transactions found)`);
    }
    catch (err) {
        console.error(`❌ warehouseService.listTransactions FAILED:`, err.message);
    }
    // 6. Maintenance Work Orders
    try {
        const wos = await maintenance_service_js_1.maintenanceService.listWorkOrders(t.id);
        console.log(`✅ maintenanceService.listWorkOrders: SUCCESS (${wos.length} work orders found)`);
        if (wos.length > 0) {
            console.log(`   Sample: WO #${wos[0].woNumber} (Title: ${wos[0].title})`);
        }
    }
    catch (err) {
        console.error(`❌ maintenanceService.listWorkOrders FAILED:`, err.message);
    }
    await database_js_1.pool.end();
}
testAllServices().catch(console.error);
//# sourceMappingURL=test-services.js.map