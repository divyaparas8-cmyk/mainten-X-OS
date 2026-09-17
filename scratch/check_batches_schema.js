import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function test() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'batches';
    `);
    console.log("Batches columns:", res.rows);

    const skuRes = await client.query(`SELECT id, sku_code, name FROM public.skus LIMIT 5;`);
    console.log("Sample SKUs:", skuRes.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    client.release();
    pool.end();
  }
}

test();
