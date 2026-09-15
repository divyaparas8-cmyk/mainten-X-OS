const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: 'postgresql://postgres:root@localhost:5432/maintenxos' });
  await client.connect();
  
  const tables = ['quality_specs', 'ccp_limits', 'assets', 'storage_resources'];
  for (const t of tables) {
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = $1
    `, [t]);
    
    if (res.rows.length === 0) {
      console.log(`Table '${t}' DOES NOT EXIST!`);
    } else {
      const cols = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [t]);
      console.log(`Table '${t}' EXISTS with ${cols.rows.length} columns:`);
      console.log(cols.rows.map(c => `${c.column_name} (${c.data_type})`).join(', '));
    }
  }

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
