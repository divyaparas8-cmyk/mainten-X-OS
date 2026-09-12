import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read .env manually
const envPath = 'd:/kiaan/MaintenX-OS/backend/.env';
const env = {};
try {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const [k, ...rest] = line.split('=');
    if (k && rest.length) env[k.trim()] = rest.join('=').trim();
  }
} catch(e) {}

const connStr = env.DATABASE_URL;
console.log('Connecting with:', connStr ? connStr.replace(/:([^:@]+)@/, ':***@') : 'NO DATABASE_URL FOUND');

const client = new pg.Client({ connectionString: connStr });

try {
  await client.connect();
  
  console.log('\n=== SKUS IN DB ===');
  const skus = await client.query('SELECT id, tenant_id, sku_code, name, category, is_active FROM public.skus ORDER BY created_at DESC LIMIT 10');
  console.table(skus.rows);
  
  console.log('\n=== TENANTS ===');
  const tenants = await client.query('SELECT id, name FROM public.tenants LIMIT 5');
  console.table(tenants.rows);
  
  console.log('\n=== USERS (first 5) ===');
  const users = await client.query('SELECT id, email, tenant_id FROM public.users LIMIT 5');
  console.table(users.rows);
  
} catch(e) {
  console.error('ERROR:', e.message);
} finally {
  await client.end();
}
