"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
async function runDetailedAudit() {
    const client = await database_js_1.pool.connect();
    try {
        // 1. Get all tables in public schema
        const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
        const tables = tablesRes.rows.map(r => r.table_name);
        // 2. Get PKs
        const pkRes = await client.query(`
      SELECT tc.table_name, kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_schema = 'public';
    `);
        const pksByTable = {};
        for (const row of pkRes.rows) {
            pksByTable[row.table_name] = pksByTable[row.table_name] || [];
            pksByTable[row.table_name].push(row.column_name);
        }
        // 3. Get FKs
        const fkRes = await client.query(`
      SELECT
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public';
    `);
        const fksByTable = {};
        for (const row of fkRes.rows) {
            fksByTable[row.table_name] = fksByTable[row.table_name] || [];
            fksByTable[row.table_name].push(`${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`);
        }
        // 4. Get all columns with types and nullability
        const colRes = await client.query(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);
        const colsByTable = {};
        for (const row of colRes.rows) {
            colsByTable[row.table_name] = colsByTable[row.table_name] || [];
            colsByTable[row.table_name].push({
                name: row.column_name,
                type: row.data_type,
                nullable: row.is_nullable
            });
        }
        // 5. Get row count per table
        const rowCounts = {};
        for (const t of tables) {
            try {
                const cRes = await client.query(`SELECT count(*)::int as c FROM "${t}";`);
                rowCounts[t] = cRes.rows[0].c;
            }
            catch {
                rowCounts[t] = -1;
            }
        }
        const auditData = {
            totalTables: tables.length,
            tables: tables.map(t => {
                const cols = colsByTable[t] || [];
                const hasTenantId = cols.some(c => c.name === 'tenant_id');
                const hasPlantId = cols.some(c => c.name === 'plant_id');
                return {
                    tableName: t,
                    rowCount: rowCounts[t],
                    primaryKey: pksByTable[t] || [],
                    foreignKeys: fksByTable[t] || [],
                    hasTenantId,
                    hasPlantId,
                    columns: cols.map(c => c.name)
                };
            })
        };
        console.log(JSON.stringify(auditData, null, 2));
    }
    finally {
        client.release();
        await database_js_1.pool.end();
    }
}
runDetailedAudit().catch(console.error);
//# sourceMappingURL=audit-73-tables.js.map