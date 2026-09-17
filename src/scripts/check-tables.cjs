const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:root@localhost:5432/maintenxos' });

(async () => {
  try {
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
    console.log("TABLES:", res.rows.map(r => r.table_name));

    // Also check audit_logs count and structure
    const auditRes = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'audit_logs';");
    console.log("AUDIT_LOGS COLUMNS:", auditRes.rows);

    // Also check tenants settings structure
    const tenantRes = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tenants';");
    console.log("TENANTS COLUMNS:", tenantRes.rows);

  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await client.end();
  }
})();
