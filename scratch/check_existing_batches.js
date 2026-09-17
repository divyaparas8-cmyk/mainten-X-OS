import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function run() {
  try {
    const res = await pool.query(`SELECT * FROM public.batches LIMIT 5;`);
    console.log("Current Batches in DB:", res.rows);

    const poRes = await pool.query(`SELECT * FROM public.production_orders LIMIT 5;`);
    console.log("\nCurrent Production Orders in DB:", poRes.rows);

    await pool.end();
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
