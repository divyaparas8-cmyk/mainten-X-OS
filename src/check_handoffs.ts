import pg from 'pg';
const { Pool } = pg;

async function checkHandoffs() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  try {
    const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'pm_shift_handoffs'");
    console.log('PM_SHIFT_HANDOFFS COLS:', cols.rows.map(r => r.column_name));

    const rows = await pool.query("SELECT * FROM public.pm_shift_handoffs ORDER BY created_at DESC");
    console.log('PM_SHIFT_HANDOFFS ROWS:', rows.rows);
  } catch (err: any) {
    console.error('Error:', err.message);
  }

  await pool.end();
}

checkHandoffs();
