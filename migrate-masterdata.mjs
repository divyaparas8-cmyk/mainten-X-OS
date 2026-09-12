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

console.log("Migrating public.production_lines and public.work_centers and other tables...");

await client.query(`
  -- Production Lines
  ALTER TABLE public.production_lines ALTER COLUMN plant_id DROP NOT NULL;
  ALTER TABLE public.production_lines ALTER COLUMN tenant_id DROP NOT NULL;
  ALTER TABLE public.production_lines ADD COLUMN IF NOT EXISTS line_code varchar(100);
  ALTER TABLE public.production_lines ADD COLUMN IF NOT EXISTS rated_speed varchar(100);
  ALTER TABLE public.production_lines ADD COLUMN IF NOT EXISTS rated_speed_bph integer;
  ALTER TABLE public.production_lines ADD COLUMN IF NOT EXISTS type varchar(100);
  ALTER TABLE public.production_lines ADD COLUMN IF NOT EXISTS plant_name varchar(255);
  ALTER TABLE public.production_lines ADD COLUMN IF NOT EXISTS supervisor_name varchar(255);
  ALTER TABLE public.production_lines ADD COLUMN IF NOT EXISTS supervisor_id varchar(100);
  ALTER TABLE public.production_lines ADD COLUMN IF NOT EXISTS rated_oee varchar(50);
  ALTER TABLE public.production_lines ADD COLUMN IF NOT EXISTS current_running_sku varchar(100);
  ALTER TABLE public.production_lines ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone DEFAULT now();

  -- Work Centers
  ALTER TABLE public.work_centers ALTER COLUMN plant_id DROP NOT NULL;
  ALTER TABLE public.work_centers ALTER COLUMN tenant_id DROP NOT NULL;
  ALTER TABLE public.work_centers ADD COLUMN IF NOT EXISTS line_id varchar(100);
  ALTER TABLE public.work_centers ADD COLUMN IF NOT EXISTS line_name varchar(255);
  ALTER TABLE public.work_centers ADD COLUMN IF NOT EXISTS capacity varchar(100);
  ALTER TABLE public.work_centers ADD COLUMN IF NOT EXISTS status varchar(50) DEFAULT 'Active';
  ALTER TABLE public.work_centers ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone DEFAULT now();

  -- Companies
  ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS tax_id varchar(100);
  ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS currency varchar(50);
  ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS hq_location varchar(255);
  ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS fiscal_year_start varchar(50);

  -- Departments
  ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS plant_id varchar(100);
  ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS cost_center varchar(100);
  ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS status varchar(50) DEFAULT 'Active';

  -- Operations
  ALTER TABLE public.operations ADD COLUMN IF NOT EXISTS code varchar(50);
`);

console.log("Migration finished successfully!");
await client.end();
