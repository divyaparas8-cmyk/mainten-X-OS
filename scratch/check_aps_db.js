import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
});

async function run() {
  const client = await pool.connect();
  try {
    console.log("Checking public.aps_schedules...");
    const resAps = await client.query(`SELECT count(*) FROM public.aps_schedules;`);
    console.log("aps_schedules count:", resAps.rows[0].count);

    console.log("Checking tenant, plant, line, sku UUIDs...");
    const tenants = await client.query(`SELECT id FROM public.tenants LIMIT 1;`);
    const plants = await client.query(`SELECT id FROM public.plants LIMIT 1;`);
    const lines = await client.query(`SELECT id FROM public.production_lines LIMIT 1;`);
    const skus = await client.query(`SELECT id FROM public.skus LIMIT 1;`);

    console.log("Tenants:", tenants.rows);
    console.log("Plants:", plants.rows);
    console.log("Lines:", lines.rows);
    console.log("SKUs:", skus.rows);

    const versionTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'pm_schedule_versions'
      );
    `);
    console.log("pm_schedule_versions table exists:", versionTableCheck.rows[0].exists);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
