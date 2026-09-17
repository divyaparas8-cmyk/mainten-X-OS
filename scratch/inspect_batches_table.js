import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function run() {
  try {
    console.log("--- public.batches columns ---");
    const bCols = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'batches' AND table_schema = 'public';`);
    console.log(bCols.rows.map(r => r.column_name));

    console.log("\n--- public.production_orders columns ---");
    const poCols = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'production_orders' AND table_schema = 'public';`);
    console.log(poCols.rows.map(r => r.column_name));

    await pool.end();
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
