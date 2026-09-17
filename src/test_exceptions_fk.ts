import pg from 'pg';
const { Pool } = pg;

async function testFK() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  try {
    const tenants = await pool.query('SELECT id, name FROM public.tenants LIMIT 5');
    console.log('TENANTS:', tenants.rows);

    const plants = await pool.query('SELECT id, name FROM public.plants LIMIT 5');
    console.log('PLANTS:', plants.rows);

    // Try dummy insert with fake UUIDs to see if it throws FK error
    try {
      await pool.query(`
        INSERT INTO public.exceptions (tenant_id, plant_id, exception_code, severity, module, title, description, status, reported_at)
        VALUES ('aa3183d2-709b-42a8-add1-b2e4b2d873b0', 'bead41e2-b735-41b8-bd00-bdba1682fb6a', 'EXC-TEST', 'P1', 'PRODUCTION', 'Test Title', 'Test Desc', 'ACTIVE', NOW())
      `);
      console.log('Dummy insert SUCCESS');
    } catch (err: any) {
      console.error('❌ Dummy insert FAILED:', err.message);
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  }

  await pool.end();
}

testFK();
