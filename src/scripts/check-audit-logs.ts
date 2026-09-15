import { pool } from "../config/database.js";

async function main() {
  const res = await pool.query("SELECT id, action, entity_type, entity_id, created_at FROM audit_logs ORDER BY created_at DESC;");
  console.log("Total audit_logs rows:", res.rows.length);
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}

main().catch(console.error);
