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

console.log("Adding missing columns to public.boms and public.bom_items...");
await client.query(`
  ALTER TABLE public.boms ADD COLUMN IF NOT EXISTS bom_number varchar(100);
  ALTER TABLE public.boms ADD COLUMN IF NOT EXISTS approval_status varchar(50) DEFAULT 'Draft';
  ALTER TABLE public.boms ADD COLUMN IF NOT EXISTS created_by varchar(100) DEFAULT 'Alexander Vance';

  ALTER TABLE public.bom_items ALTER COLUMN component_sku_id DROP NOT NULL;
  ALTER TABLE public.bom_items ADD COLUMN IF NOT EXISTS component_name varchar(255);
  ALTER TABLE public.bom_items ADD COLUMN IF NOT EXISTS sku_code varchar(50);
`);

console.log("Columns added successfully!");

const bomsCols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'boms'");
console.table(bomsCols.rows);

const biCols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bom_items'");
console.table(biCols.rows);

await client.end();
