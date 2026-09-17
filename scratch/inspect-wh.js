const { Client } = require('pg');

async function main() {
  const c = new Client({ connectionString: 'postgresql://postgres:root@localhost:5432/maintenxos' });
  await c.connect();

  const res = await c.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log("ALL TABLES IN maintenxos:");
  console.log(res.rows.map(r => r.table_name));

  // Check warehouses
  const wh = await c.query('SELECT * FROM warehouses').catch(e => ({ error: e.message }));
  console.log("WAREHOUSES:", wh.rows || wh.error);

  // Check location_bins
  const bins = await c.query('SELECT * FROM location_bins').catch(e => ({ error: e.message }));
  console.log("LOCATION_BINS:", bins.rows || bins.error);

  await c.end();
}

main().catch(console.error);
