"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("./config/database.js");
const index_js_1 = require("./db/schema/index.js");
const drizzle_orm_1 = require("drizzle-orm");
async function main() {
    const [warehouseUser] = await database_js_1.db.select().from(index_js_1.users).where((0, drizzle_orm_1.eq)(index_js_1.users.email, "warehouse@maintenx.com"));
    console.log("Warehouse User Tenant:", warehouseUser?.tenantId, "Plant:", warehouseUser?.plantId);
    const lots = await database_js_1.db.select().from(index_js_1.inventoryLots);
    console.log("Lots in DB:", lots.map(l => ({ id: l.id, tenantId: l.tenantId, lotNumber: l.lotNumber })));
    const txs = await database_js_1.db.select().from(index_js_1.inventoryTransactions);
    console.log("Transactions in DB:", txs.map(t => ({ id: t.id, tenantId: t.tenantId, type: t.type })));
    process.exit(0);
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=check_tenant_match.js.map