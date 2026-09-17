import pg from 'pg';
const { Pool } = pg;

async function syncAll() {
  const dbNames = ['maintenx-os', 'maintenxos'];

  for (const dbName of dbNames) {
    const pool = new Pool({
      connectionString: `postgresql://postgres:hitesha2004@localhost:5432/${dbName}`
    });

    try {
      const res = await pool.query('SELECT count(*) FROM public.exceptions');
      console.log(`DB "${dbName}" exceptions count:`, res.rows[0].count);

      const validTenant = '5bce8458-909a-4dd2-b221-614c32ac7c89';
      const validPlant = '83c90534-4761-495c-b2bf-6a61de2260c4';

      await pool.query(`
        INSERT INTO public.exceptions (tenant_id, plant_id, exception_code, severity, module, title, description, status, reported_at)
        VALUES ($1, $2, 'EXC-888', 'P1', 'PRODUCTION', 'Raw material stockout: Capper Station 12-Head (CP-102)', 'Cap feed line low inventory alert', 'ACTIVE', NOW())
        ON CONFLICT DO NOTHING
      `, [validTenant, validPlant]);

      const updated = await pool.query('SELECT count(*) FROM public.exceptions');
      console.log(`DB "${dbName}" updated exceptions count:`, updated.rows[0].count);
    } catch (err: any) {
      console.error(`Error syncing DB ${dbName}:`, err.message);
    }

    await pool.end();
  }
}

syncAll();
