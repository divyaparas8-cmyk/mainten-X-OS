import pg from 'pg';
const { Pool } = pg;

async function testValidInsert() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  try {
    const tenantRes = await pool.query('SELECT id FROM public.tenants LIMIT 1');
    const plantRes = await pool.query('SELECT id FROM public.plants LIMIT 1');

    const tenantId = tenantRes.rows[0]?.id;
    const plantId = plantRes.rows[0]?.id;

    console.log('Using tenantId:', tenantId, 'plantId:', plantId);

    const res = await pool.query(`
      INSERT INTO public.exceptions (tenant_id, plant_id, exception_code, severity, module, title, description, status, reported_at)
      VALUES ($1, $2, 'EXC-999', 'P1', 'PRODUCTION', 'Raw material stockout: Capper Station 12-Head', 'Test description of issue', 'ACTIVE', NOW())
      RETURNING *;
    `, [tenantId, plantId]);

    console.log('✅ Inserted row:', res.rows[0]);
  } catch (err: any) {
    console.error('❌ Insert failed:', err.message);
  }

  await pool.end();
}

testValidInsert();
