import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function run() {
  try {
    console.log("--- public.users columns & rows ---");
    const uCols = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'public';`);
    console.log(uCols.rows.map(r => r.column_name));
    const uRows = await pool.query(`SELECT * FROM public.users LIMIT 5;`);
    console.log(uRows.rows);

    console.log("\n--- public.staff columns & rows ---");
    const sCols = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'staff' AND table_schema = 'public';`);
    console.log(sCols.rows.map(r => r.column_name));
    const sRows = await pool.query(`SELECT * FROM public.staff LIMIT 5;`);
    console.log(sRows.rows);

    await pool.end();
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
