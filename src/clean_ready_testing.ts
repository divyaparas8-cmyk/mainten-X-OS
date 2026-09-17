import pg from 'pg';
const { Pool } = pg;

async function cleanAllTests() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  try {
    await pool.query("DELETE FROM public.digital_signatures WHERE entity_type = 'EMERGENCY_MAINTENANCE_CALL'");
    await pool.query("DELETE FROM public.exceptions WHERE exception_code LIKE 'EXC-%'");
    await pool.query("DELETE FROM public.pm_exceptions WHERE id LIKE 'EX-%' OR id LIKE 'EXC-%'");

    console.log('Database cleaned and ready for live user testing!');
  } catch (err: any) {
    console.error('Clean error:', err.message);
  }

  await pool.end();
}

cleanAllTests();
