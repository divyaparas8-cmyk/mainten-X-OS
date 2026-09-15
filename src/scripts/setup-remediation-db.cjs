const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:root@localhost:5432/maintenxos' });

async function setup() {
  await client.connect();
  console.log("Connected to PostgreSQL maintenxos");

  await client.query(`
    CREATE TABLE IF NOT EXISTS public.data_health_remediations (
      id VARCHAR(64) PRIMARY KEY,
      tenant_id VARCHAR(64),
      rule VARCHAR(255) NOT NULL,
      affected_table VARCHAR(255) NOT NULL,
      records_healed INTEGER DEFAULT 1,
      status VARCHAR(64) DEFAULT 'Auto-Healed',
      execution_timestamp VARCHAR(64),
      details TEXT,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  `);
  console.log("Created table public.data_health_remediations if not exists.");

  // Seed default records if empty
  const check = await client.query("SELECT count(*) FROM public.data_health_remediations;");
  if (parseInt(check.rows[0].count, 10) === 0) {
    await client.query(`
      INSERT INTO public.data_health_remediations (id, rule, affected_table, records_healed, status, execution_timestamp, details)
      VALUES 
        ('REM-801', 'Missing Unit Cost Heuristic Default', 'Item Master', 1, 'Auto-Healed', 'Today, 10:45 AM', 'Set standard cost to $0.38 for SKU-5003'),
        ('REM-802', 'Orphaned Foreign Key Re-link', 'BOM Master', 1, 'Auto-Healed', 'Today, 10:42 AM', 'Cleaned dangling foreign key reference REF-01'),
        ('REM-803', 'Fuzzy Duplicate Cluster Merge', 'Raw Ingredients', 1, 'Auto-Healed', 'Today, 10:30 AM', 'Merged ING-9004 into primary key ING-1001');
    `);
    console.log("Seeded initial records in data_health_remediations.");
  } else {
    console.log("data_health_remediations already has records:", check.rows[0].count);
  }

  await client.end();
}

setup().catch(err => {
  console.error("Setup error:", err);
  process.exit(1);
});
