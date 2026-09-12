import pg from 'pg';
const client = new pg.Client({ connectionString: 'postgresql://postgres:aashi%401234@localhost:5432/maintenxos' });
await client.connect();

const res = await client.query(`SELECT table_name, column_name, column_default, data_type FROM information_schema.columns WHERE table_name = 'operations' AND column_name = 'id'`);
console.log('operations id:', res.rows);

// Also check if departments has foreign keys or constraints
const fks = await client.query(`
  SELECT conname, contype, pg_get_constraintdef(oid) 
  FROM pg_constraint 
  WHERE conrelid IN ('public.departments'::regclass, 'public.production_lines'::regclass, 'public.work_centers'::regclass, 'public.operations'::regclass, 'public.companies'::regclass)
`);
console.log('constraints:', fks.rows);

await client.end();
