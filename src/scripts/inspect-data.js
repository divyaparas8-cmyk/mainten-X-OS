const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: 'postgresql://postgres:root@localhost:5432/maintenxos' });
  await client.connect();

  const tables = ['quality_specs', 'ccp_limits', 'assets', 'storage_resources'];
  for (const t of tables) {
    const res = await client.query(`SELECT count(*) as count FROM public.${t}`);
    console.log(`${t} count:`, res.rows[0].count);
    const sample = await client.query(`SELECT * FROM public.${t} LIMIT 5`);
    console.log(`${t} sample rows:`, sample.rows);
  }

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
