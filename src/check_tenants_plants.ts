import pg from 'pg';
const { Pool } = pg;

async function checkTenantsAndPlants() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  try {
    const tenants = await pool.query('SELECT id, name FROM public.tenants');
    console.log('TENANTS:', tenants.rows);

    const plants = await pool.query('SELECT id, name, tenant_id FROM public.plants');
    console.log('PLANTS:', plants.rows);
  } catch (err: any) {
    console.error('Error:', err.message);
  }

  await pool.end();
}

checkTenantsAndPlants();
