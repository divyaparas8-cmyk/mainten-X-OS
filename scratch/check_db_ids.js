import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function checkPlants() {
  const client = await pool.connect();
  try {
    const plantsRes = await client.query(`SELECT id, name, code, tenant_id FROM public.plants LIMIT 5;`);
    console.log("Plants in DB:", plantsRes.rows);

    const posRes = await client.query(`SELECT id, order_number, tenant_id, plant_id, sku_id FROM public.production_orders LIMIT 5;`);
    console.log("Production Orders in DB:", posRes.rows);
  } finally {
    client.release();
    pool.end();
  }
}

checkPlants();
