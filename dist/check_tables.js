"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("./config/database.js");
const index_js_1 = require("./db/schema/index.js");
async function main() {
    console.log("=== CHECKING TABLE COUNTS ===");
    try {
        const lots = await database_js_1.db.select().from(index_js_1.inventoryLots);
        console.log("inventoryLots:", lots.length);
    }
    catch (e) {
        console.log("inventoryLots error:", e.message);
    }
    try {
        const tx = await database_js_1.db.select().from(index_js_1.inventoryTransactions);
        console.log("inventoryTransactions:", tx.length);
    }
    catch (e) {
        console.log("inventoryTransactions error:", e.message);
    }
    try {
        const wh = await database_js_1.db.select().from(index_js_1.warehouses);
        console.log("warehouses:", wh.length);
    }
    catch (e) {
        console.log("warehouses error:", e.message);
    }
    try {
        const bins = await database_js_1.db.select().from(index_js_1.locationBins);
        console.log("locationBins:", bins.length);
    }
    catch (e) {
        console.log("locationBins error:", e.message);
    }
    try {
        const ccp = await database_js_1.db.select().from(index_js_1.ccpChecks);
        console.log("ccpChecks:", ccp.length);
    }
    catch (e) {
        console.log("ccpChecks error:", e.message);
    }
    try {
        const b = await database_js_1.db.select().from(index_js_1.batches);
        console.log("batches:", b.length);
    }
    catch (e) {
        console.log("batches error:", e.message);
    }
    try {
        const po = await database_js_1.db.select().from(index_js_1.productionOrders);
        console.log("productionOrders:", po.length);
    }
    catch (e) {
        console.log("productionOrders error:", e.message);
    }
    try {
        const wo = await database_js_1.db.select().from(index_js_1.workOrders);
        console.log("workOrders:", wo.length);
    }
    catch (e) {
        console.log("workOrders error:", e.message);
    }
    try {
        const pm = await database_js_1.db.select().from(index_js_1.pmSchedules);
        console.log("pmSchedules:", pm.length);
    }
    catch (e) {
        console.log("pmSchedules error:", e.message);
    }
    try {
        const sp = await database_js_1.db.select().from(index_js_1.spareParts);
        console.log("spareParts:", sp.length);
    }
    catch (e) {
        console.log("spareParts error:", e.message);
    }
    process.exit(0);
}
main().catch(err => {
    console.error("FATAL:", err);
    process.exit(1);
});
//# sourceMappingURL=check_tables.js.map