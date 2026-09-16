"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("d:/Kiaan Project/Maintance os/MaintenX-OS/backend/src/config/database.js");
async function main() {
    const res = await database_js_1.pool.query("SELECT id, action, entity_type, entity_id, created_at FROM audit_logs ORDER BY created_at DESC;");
    console.log("Total audit_logs rows:", res.rows.length);
    console.log(JSON.stringify(res.rows, null, 2));
    await database_js_1.pool.end();
}
main().catch(console.error);
//# sourceMappingURL=check-audit-logs.js.map