import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function checkTenants() {
  const client = await pool.connect();
  try {
    const tenantsRes = await client.query(`SELECT id, name FROM public.tenants LIMIT 5;`);
    console.log("Tenants in DB:", tenantsRes.rows);

    const plantsRes = await client.query(`SELECT id, name, tenant_id FROM public.plants LIMIT 5;`);
    console.log("Plants in DB:", plantsRes.rows);
  } finally {
    client.release();
    pool.end();
  }
}

checkTenants();
