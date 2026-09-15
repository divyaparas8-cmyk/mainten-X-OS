const { Client } = require('pg');

async function deleteDummyBatches() {
  const c = new Client({ connectionString: 'postgresql://postgres:root@localhost:5432/maintenxos' });
  await c.connect();

  await c.query('BEGIN');
  const s = await c.query("DELETE FROM public.batch_steps");
  const ccp = await c.query("DELETE FROM public.ccp_checks");
  const lg = await c.query("DELETE FROM public.lot_genealogies");
  const qr = await c.query("DELETE FROM public.qa_releases");
  const qh = await c.query("DELETE FROM public.quality_holds");
  const b = await c.query("DELETE FROM public.batches");
  await c.query('COMMIT');

  console.log('Dummy batches and child rows deleted successfully:');
  console.log({
    batch_steps_deleted: s.rowCount,
    ccp_checks_deleted: ccp.rowCount,
    lot_genealogies_deleted: lg.rowCount,
    qa_releases_deleted: qr.rowCount,
    quality_holds_deleted: qh.rowCount,
    batches_deleted: b.rowCount
  });

  const check = await c.query("SELECT count(*) FROM public.batches");
  console.log('Current rows in public.batches:', check.rows[0].count);

  await c.end();
}

deleteDummyBatches().catch(console.error);
