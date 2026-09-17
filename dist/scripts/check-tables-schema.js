"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
async function main() {
    const tables = ['sanitation_classes', 'allergen_rules', 'ci_standards', 'staff', 'quality_specs', 'warehouses', 'ccp_checks'];
    for (const t of tables) {
        const res = await database_js_1.pool.query(`SELECT count(*) FROM public.${t}`);
        console.log(`${t}: ${res.rows[0].count} rows`);
    }
    await database_js_1.pool.end();
}
main().catch(console.error);
//# sourceMappingURL=check-tables-schema.js.map