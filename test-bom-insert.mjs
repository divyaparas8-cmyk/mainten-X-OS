import pg from 'pg';
import { readFileSync } from 'fs';

const envPath = 'd:/kiaan/MaintenX-OS/backend/.env';
const lines = readFileSync(envPath, 'utf8').split('\n');
const env = {};
for (const line of lines) {
  const [k, ...rest] = line.split('=');
  if (k && rest.length) env[k.trim()] = rest.join('=').trim();
}

const client = new pg.Client({ connectionString: env.DATABASE_URL });
await client.connect();

try {
  // Get first tenant and first sku
  const tRes = await client.query("SELECT id FROM public.tenants LIMIT 1");
  const tenantId = tRes.rows[0].id;

  const sRes = await client.query("SELECT id FROM public.skus LIMIT 1");
  const skuId = sRes.rows[0].id;

  console.log("Using tenantId:", tenantId, "skuId:", skuId);

  const insRes = await client.query(`
    INSERT INTO public.boms (
      tenant_id, sku_id, bom_number, name, version, batch_size, batch_uom, yield_percent, status, approval_status, created_by, is_default
    )
    VALUES (
      $1, $2, 'BOM-TEST-01', 'Test Recipe Formula', 'R1', 10000, 'Liters', 99.2, 'Active', 'Approved', 'Alexander Vance', true
    )
    RETURNING *
  `, [tenantId, skuId]);

  console.log("Inserted BOM:", insRes.rows[0]);

  const bomId = insRes.rows[0].id;
  const itemRes = await client.query(`
    INSERT INTO public.bom_items (
      bom_id, component_sku_id, component_name, sku_code, quantity, scrap_percentage, uom, sequence, stage
    )
    VALUES (
      $1, $2, 'Test Liquid Sugar', 'ING-1001', 500, 0.5, 'Liters', 1, 'MIXING'
    )
    RETURNING *
  `, [bomId, skuId]);

  console.log("Inserted BOM Item:", itemRes.rows[0]);

  // Clean up test rows
  await client.query("DELETE FROM public.bom_items WHERE bom_id = $1", [bomId]);
  await client.query("DELETE FROM public.boms WHERE id = $1", [bomId]);
  console.log("Cleaned up test rows successfully!");
} catch (e) {
  console.error("Test failed:", e.message);
}

await client.end();
