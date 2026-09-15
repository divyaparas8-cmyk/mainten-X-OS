const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenxos' });

async function inspect() {
  await client.connect();

  console.log('--- PRODUCTION ORDERS ---');
  const po = await client.query("SELECT id, order_number, line_id, status, target_quantity, produced_quantity, scrap_quantity FROM production_orders LIMIT 5;");
  console.log(po.rows);

  console.log('--- PRODUCTION LINES ---');
  const pl = await client.query("SELECT id, name, code, speed_bpm FROM production_lines LIMIT 5;");
  console.log(pl.rows);

  console.log('--- WORK ORDERS ---');
  const wo = await client.query("SELECT id, work_order_number, priority, status FROM work_orders LIMIT 5;");
  console.log(wo.rows);

  console.log('--- QUALITY HOLDS ---');
  const qh = await client.query("SELECT id, lot_number, reason, status FROM quality_holds LIMIT 5;");
  console.log(qh.rows);

  console.log('--- STAFF ---');
  const st = await client.query("SELECT count(*) FROM staff;");
  console.log('Total staff count:', st.rows[0]);

  await client.end();
}

inspect().catch(console.error);
