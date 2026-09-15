const { Client } = require('pg');

async function main() {
  const client = new Client('postgresql://postgres:root@localhost:5432/maintenxos');
  await client.connect();

  const cols = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'shipment_orders'
    ORDER BY ordinal_position;
  `);

  console.log('Columns in shipment_orders:', cols.rows);

  const rows = await client.query('SELECT * FROM public.shipment_orders LIMIT 5');
  console.log('Sample rows in shipment_orders:', rows.rows);

  await client.end();
}

main().catch(console.error);
