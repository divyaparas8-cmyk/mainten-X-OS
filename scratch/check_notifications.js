import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'notifications'
      ORDER BY ordinal_position;
    `);
    console.log("Columns in public.notifications:");
    console.log(res.rows);

    const rows = await pool.query(`SELECT * FROM public.notifications LIMIT 5;`);
    console.log("Sample rows in public.notifications:");
    console.log(rows.rows);

    await pool.end();
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
