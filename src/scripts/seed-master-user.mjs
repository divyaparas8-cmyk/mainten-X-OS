import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:aashi%401234@localhost:5432/maintenxos'
});

async function main() {
  const passwordHash = await bcrypt.hash("Password@123", 10);
  const pinHash = await bcrypt.hash("1234", 10);

  // 1. Get first tenant
  const tenantsRes = await pool.query('SELECT id FROM tenants LIMIT 1');
  let tenantId = tenantsRes.rows[0]?.id;
  if (!tenantId) {
    const newTenant = await pool.query("INSERT INTO tenants (name, slug, plan, status) VALUES ('MaintenX HQ', 'maintenx-hq', 'Plant Pilot', 'ACTIVE') RETURNING id");
    tenantId = newTenant.rows[0].id;
  }

  // 2. Ensure master@maintenx.com exists
  const masterRes = await pool.query("SELECT id FROM users WHERE email = 'master@maintenx.com'");
  if (masterRes.rows.length === 0) {
    await pool.query(
      `INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, digital_signature_pin_hash, is_master_admin, status)
       VALUES ($1, 'master@maintenx.com', $2, 'Elena', 'Vance', $3, true, 'ACTIVE')`,
      [tenantId, passwordHash, pinHash]
    );
    console.log("Created master@maintenx.com user");
  } else {
    await pool.query("UPDATE users SET password_hash = $1, is_master_admin = true WHERE email = 'master@maintenx.com'", [passwordHash]);
    console.log("Updated master@maintenx.com password");
  }

  // 3. Link master user to master_admin role
  const masterUser = await pool.query("SELECT id FROM users WHERE email = 'master@maintenx.com'");
  const masterRole = await pool.query("SELECT id FROM roles WHERE code = 'master_admin'");
  if (masterUser.rows[0] && masterRole.rows[0]) {
    await pool.query('INSERT INTO user_roles ("userId", "roleId") VALUES ($1, $2) ON CONFLICT DO NOTHING', [
      masterUser.rows[0].id,
      masterRole.rows[0].id
    ]);
  }

  console.log("Master Admin user ready!");
  await pool.end();
}

main().catch(console.error);
