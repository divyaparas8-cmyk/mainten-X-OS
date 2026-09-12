import { pool } from "../config/database.js";

async function main() {
  const result = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log("PostgreSQL Tables in public schema:");
  console.log(JSON.stringify(result.rows.map((r: any) => r.table_name), null, 2));
  await pool.end();
}

main().catch(console.error);
