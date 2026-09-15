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

console.log("Migrating public.departments...");

await client.query(`
  ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS dept_head varchar(255);
  ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS operating_shifts varchar(100);
  ALTER TABLE public.departments ALTER COLUMN is_active DROP NOT NULL;
  ALTER TABLE public.departments ALTER COLUMN is_active SET DEFAULT true;
`);

console.log("Migration complete!");
await client.end();
