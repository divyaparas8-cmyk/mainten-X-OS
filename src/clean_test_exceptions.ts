import pg from 'pg';
const { Pool } = pg;

async function cleanTestRecords() {
  const dbNames = ['maintenx-os', 'maintenxos'];

  for (const dbName of dbNames) {
    const pool = new Pool({
      connectionString: `postgresql://postgres:hitesha2004@localhost:5432/${dbName}`
    });

    try {
      const res = await pool.query("DELETE FROM public.exceptions WHERE exception_code IN ('EXC-999', 'EXC-888', 'EXC-594', 'EXC-TEST')");
      console.log(`Cleaned test rows from DB "${dbName}":`, res.rowCount);

      const remaining = await pool.query('SELECT exception_code, title FROM public.exceptions');
      console.log(`Remaining rows in "${dbName}":`, remaining.rows);
    } catch (err: any) {
      console.error(`Error cleaning DB ${dbName}:`, err.message);
    }

    await pool.end();
  }
}

cleanTestRecords();
