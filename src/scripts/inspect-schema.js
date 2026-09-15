import pg from 'pg';
const { Client } = pg;

async function check() {
  const c = new Client({ connectionString: 'postgresql://postgres:root@localhost:5432/maintenxos' });
  await c.connect();

  for (const t of ['boms', 'bom_items', 'routings', 'routing_steps']) {
    const res = await c.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [t]);
    console.log(`=== TABLE: ${t} ===`);
    console.log(res.rows);
  }

  const boms = await c.query("SELECT * FROM public.boms");
  console.log("=== EXISTING BOMS IN DB ===");
  console.log(boms.rows);

  await c.end();
}

check().catch(console.error);
