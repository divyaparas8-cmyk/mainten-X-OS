const { Client } = require('pg');

async function check() {
  const client = new Client({ connectionString: 'postgresql://postgres:root@localhost:5432/maintenxos' });
  await client.connect();

  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND (
        table_name ILIKE '%pick%' 
        OR table_name ILIKE '%pallet%' 
        OR table_name ILIKE '%container%'
      );
  `);
  console.log('Matching tables in DB:', tables.rows.map(r => r.table_name));

  for (const t of tables.rows.map(r => r.table_name)) {
    const cols = await client.query('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1;', [t]);
    const cnt = await client.query(`SELECT count(*) FROM "${t}";`);
    console.log(`TABLE ${t} (count: ${cnt.rows[0].count}):`, cols.rows.map(c => `${c.column_name} (${c.data_type})`));
  }
  await client.end();
}

check().catch(console.error);
