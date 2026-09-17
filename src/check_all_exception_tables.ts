import pg from 'pg';
const { Pool } = pg;

async function checkPmExceptions() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  try {
    const cols1 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'exceptions'");
    console.log('EXCEPTIONS COLS:', cols1.rows.map(r => r.column_name));

    const cols2 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'pm_exceptions'");
    console.log('PM_EXCEPTIONS COLS:', cols2.rows.map(r => r.column_name));

    const rows1 = await pool.query("SELECT * FROM public.exceptions");
    console.log('EXCEPTIONS ROWS:', rows1.rows);

    const rows2 = await pool.query("SELECT * FROM public.pm_exceptions");
    console.log('PM_EXCEPTIONS ROWS:', rows2.rows);
  } catch (err: any) {
    console.error('Error:', err.message);
  }

  await pool.end();
}

checkPmExceptions();
