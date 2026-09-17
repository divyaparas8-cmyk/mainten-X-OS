import pg from 'pg';
const { Pool } = pg;

async function listExceptions() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  try {
    const res = await pool.query('SELECT id, exception_code, severity, module, title, description, status, reported_at FROM public.exceptions ORDER BY reported_at DESC');
    console.log('TOTAL EXCEPTIONS COUNT:', res.rows.length);
    console.log('EXCEPTIONS LIST:', res.rows);
  } catch (err: any) {
    console.error('Error fetching exceptions:', err.message);
  }

  await pool.end();
}

listExceptions();
