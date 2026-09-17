"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
const audit_js_1 = require("../db/schema/audit.js");
async function main() {
    console.log("Clearing dummy audit logs from PostgreSQL...");
    const result = await database_js_1.db.delete(audit_js_1.auditLogs);
    console.log("Successfully deleted all dummy audit logs from audit_logs table.");
    process.exit(0);
}
main().catch((err) => {
    console.error("Error deleting audit logs:", err);
    process.exit(1);
});
