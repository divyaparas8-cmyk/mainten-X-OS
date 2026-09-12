import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://postgres:aashi%401234@localhost:5432/maintenxos'
});

async function main() {
  const res = await pool.query(
    "SELECT id, action, entity_type, entity_id, user_id, ip_address, created_at, old_values, new_values FROM audit_logs WHERE entity_type = 'Plan' ORDER BY created_at DESC"
  );
  console.log("PLAN AUDIT LOGS COUNT:", res.rows.length);
  console.table(res.rows.map(r => ({
    id: r.id,
    action: r.action,
    entityId: r.entity_id,
    createdAt: r.created_at,
    details: r.new_values ? JSON.stringify(r.new_values).substring(0, 50) : ''
  })));
  await pool.end();
}

main().catch(console.error);
