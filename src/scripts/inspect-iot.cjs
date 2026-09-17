const { Client } = require('pg');

async function check() {
  const client = new Client({ connectionString: 'postgres://postgres:root@localhost:5432/maintenxos' });
  await client.connect();
  const cols = await client.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns 
    WHERE table_name = 'iot_gateways'
    ORDER BY ordinal_position
  `);
  console.log('iot_gateways columns:', cols.rows);
  const rows = await client.query('SELECT * FROM public.iot_gateways');
  console.log('iot_gateways rows count:', rows.rows.length);
  await client.end();
}

check().catch(console.error);
