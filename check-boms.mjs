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

const cols = await client.query("SELECT column_name, column_default, is_nullable FROM information_schema.columns WHERE table_name = 'boms'");
console.table(cols.rows);

await client.end();
