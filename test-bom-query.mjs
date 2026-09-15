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
  const result = await client.query(`
    SELECT *
    FROM public.bom_items b
  `);
  console.log("Found BOM Items:", result.rows.length);
  console.log(result.rows);
} catch (e) {
  console.error("Query error:", e.message);
}

await client.end();
