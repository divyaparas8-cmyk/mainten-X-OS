import { pool } from "../config/database.js";

async function listAllTables() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT 
        t.table_name,
        COUNT(c.column_name) as col_count
      FROM information_schema.tables t
      LEFT JOIN information_schema.columns c 
        ON t.table_name = c.table_name AND t.table_schema = c.table_schema
      WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
      GROUP BY t.table_name
      ORDER BY t.table_name ASC;
    `);

    console.log(`TOTAL_TABLES_COUNT: ${res.rows.length}`);
    for (let i = 0; i < res.rows.length; i++) {
      const row = res.rows[i];
      console.log(`${i + 1}. ${row.table_name} (${row.col_count} columns)`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

listAllTables().catch(console.error);
