const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:aashi%401234@localhost:5432/maintenxos' });
client.connect().then(() => client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")).then(res => {
  console.log(res.rows.map(r => r.table_name).join('\n'));
  client.end();
}).catch(console.error);
