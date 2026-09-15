const { Client } = require('pg');

async function list() {
  const client = new Client({ connectionString: 'postgres://postgres:root@localhost:5432/maintenxos' });
  await client.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
  console.log('All public tables:', res.rows.map(r => r.table_name));
  await client.end();
}

list().catch(console.error);
