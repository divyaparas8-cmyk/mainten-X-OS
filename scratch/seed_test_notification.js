import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:hitesha2004@localhost:5432/maintenx-os"
});

async function run() {
  try {
    const tRes = await pool.query(`SELECT id FROM public.tenants LIMIT 1`);
    const tenantId = tRes.rows[0]?.id || '5bce8458-909a-4dd2-b221-614c32ac7c89';
    const pRes = await pool.query(`SELECT id FROM public.plants LIMIT 1`);
    const plantId = pRes.rows[0]?.id || '83c90534-4761-495c-b2bf-6a61de2260c4';

    console.log("Inserting sample live notification into public.notifications...");
    await pool.query(`
      INSERT INTO public.notifications (tenant_id, plant_id, title, message, category, severity, is_read, link_url, created_at)
      VALUES ($1, $2, 'Live Test Alert: Line 1 Sanitation Clearance', 'QA Team has cleared Line 1 for organic juice processing batch.', 'system', 'INFO', false, '/operator/dashboard', NOW())
    `, [tenantId, plantId]);

    const res = await pool.query(`SELECT * FROM public.notifications ORDER BY created_at DESC;`);
    console.log("Current notifications in public.notifications:");
    console.log(res.rows);

    await pool.end();
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
