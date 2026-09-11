"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
async function catalogTables() {
    const res = await database_js_1.pool.query(`
    SELECT 
      t.table_name,
      COUNT(c.column_name) as col_count
    FROM information_schema.tables t
    JOIN information_schema.columns c 
      ON t.table_name = c.table_name AND t.table_schema = c.table_schema
    WHERE t.table_schema = 'public'
    GROUP BY t.table_name
    ORDER BY t.table_name;
  `);
    const fkRes = await database_js_1.pool.query(`
    SELECT
      tc.table_name, 
      kcu.column_name, 
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name 
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public'
    ORDER BY tc.table_name, kcu.column_name;
  `);
    const fksByTable = new Map();
    for (const row of fkRes.rows) {
        const list = fksByTable.get(row.table_name) || [];
        list.push(`${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`);
        fksByTable.set(row.table_name, list);
    }
    console.log("=== CATALOG OF ALL 55 POSTGRESQL TABLES ===");
    for (const row of res.rows) {
        const fks = fksByTable.get(row.table_name) || [];
        console.log(`\n📦 TABLE: ${row.table_name} (${row.col_count} columns)`);
        if (fks.length > 0) {
            console.log(`   Foreign Keys (${fks.length}):`);
            fks.forEach(f => console.log(`     ↳ ${f}`));
        }
        else {
            console.log(`   Foreign Keys: None (Root/Base entity)`);
        }
    }
    await database_js_1.pool.end();
}
catalogTables().catch(console.error);
//# sourceMappingURL=catalog-55-tables.js.map