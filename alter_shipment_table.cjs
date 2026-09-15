const { Client } = require('pg');

async function main() {
  const client = new Client('postgresql://postgres:root@localhost:5432/maintenxos');
  await client.connect();

  console.log('Altering public.shipment_orders table...');
  await client.query(`
    ALTER TABLE public.shipment_orders 
      ADD COLUMN IF NOT EXISTS order_number VARCHAR(100),
      ADD COLUMN IF NOT EXISTS finished_goods VARCHAR(255),
      ADD COLUMN IF NOT EXISTS batch_lot VARCHAR(100),
      ADD COLUMN IF NOT EXISTS quantity VARCHAR(100),
      ADD COLUMN IF NOT EXISTS destination VARCHAR(255),
      ADD COLUMN IF NOT EXISTS trailer_no VARCHAR(100),
      ADD COLUMN IF NOT EXISTS seal_no VARCHAR(100),
      ADD COLUMN IF NOT EXISTS bol_number VARCHAR(100),
      ADD COLUMN IF NOT EXISTS tracking_milestones JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

    CREATE INDEX IF NOT EXISTS idx_shipment_orders_ship_no ON public.shipment_orders(shipment_number);
    CREATE INDEX IF NOT EXISTS idx_shipment_orders_customer ON public.shipment_orders(customer_name);
  `);

  console.log('Columns successfully added to shipment_orders!');

  const cols = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'shipment_orders'
    ORDER BY ordinal_position;
  `);
  console.log('Updated columns in shipment_orders:', cols.rows);

  const count = await client.query('SELECT count(*) FROM public.shipment_orders');
  console.log('Current rows in shipment_orders:', count.rows[0]);

  await client.end();
}

main().catch(err => {
  console.error('Error altering table:', err);
  process.exit(1);
});
