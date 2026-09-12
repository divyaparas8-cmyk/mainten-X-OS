import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:aashi%401234@localhost:5432/maintenxos'
});

async function main() {
  const roleDefs = [
    { code: 'admin', name: 'Company Administrator', description: 'Full company governance, master data, security, user administration' },
    { code: 'master_admin', name: 'Master Admin', description: 'Platform Chief Administrator & SuperAdmin' },
    { code: 'plant_manager', name: 'Plant Manager', description: 'Plant operations, OEE, planning, cross-functional oversight' },
    { code: 'planner', name: 'Planner / Scheduler', description: 'Lead Production & Demand Scheduler' },
    { code: 'warehouse', name: 'Warehouse / Receiver', description: 'Warehouse, Receiving & Logistics Manager' },
    { code: 'maintenance', name: 'Maintenance', description: 'Senior Reliability Technician & Maintenance Lead' },
    { code: 'supervisor', name: 'Operations Supervisor', description: 'Shift Operations & Workforce Supervisor' },
    { code: 'line_lead', name: 'Line Lead', description: 'Line Lead - Packaging & Bottling' },
    { code: 'operator', name: 'Line Operator', description: 'Certified HMI Line Operator' },
    { code: 'quality', name: 'Quality / QA', description: 'Quality Assurance & Food Safety Lead' },
    { code: 'ci_engineer', name: 'CI / Engineering', description: 'Continuous Improvement & RCA Engineer' },
    { code: 'executive', name: 'Executive', description: 'Chief Operating Officer & Enterprise Executive' },
  ];

  for (const r of roleDefs) {
    const existing = await pool.query('SELECT id FROM roles WHERE code = $1', [r.code]);
    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO roles (code, name, description, is_system) VALUES ($1, $2, $3, true)',
        [r.code, r.name, r.description]
      );
      console.log('Inserted role:', r.code);
    }
  }

  // Get admin role ID
  const adminRole = await pool.query('SELECT id FROM roles WHERE code = $1', ['admin']);
  const adminRoleId = adminRole.rows[0]?.id;
  console.log('Admin Role ID:', adminRoleId);

  // Link all current users to admin role
  const allUsers = await pool.query('SELECT id, email FROM users');
  for (const u of allUsers.rows) {
    await pool.query(
      'INSERT INTO user_roles ("userId", "roleId") VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [u.id, adminRoleId]
    );
    console.log('Linked user', u.email, 'to admin role');
  }

  const check = await pool.query('SELECT u.email, r.code, r.name FROM users u JOIN user_roles ur ON u.id = ur."userId" JOIN roles r ON ur."roleId" = r.id');
  console.log('All user roles in DB:', check.rows);

  await pool.end();
}

main().catch(console.error);
