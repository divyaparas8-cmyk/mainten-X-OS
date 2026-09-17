import pg from 'pg';
const { Pool } = pg;

async function cleanHandoffTest() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  try {
    await pool.query("DELETE FROM public.pm_shift_handoffs WHERE id LIKE 'HO-%'");
    await pool.query("DELETE FROM public.digital_signatures WHERE entity_type = 'SHIFT_HANDOFF'");

    console.log('Cleaned test handoffs from DB!');
  } catch (err: any) {
    console.error('Clean error:', err.message);
  }

  await pool.end();
}

cleanHandoffTest();
