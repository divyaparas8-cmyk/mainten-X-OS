"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
async function main() {
    const result = await database_js_1.pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    console.log("PostgreSQL Tables in public schema:");
    console.log(JSON.stringify(result.rows.map((r) => r.table_name), null, 2));
    await database_js_1.pool.end();
}
main().catch(console.error);
