const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:aashi%401234@localhost:5432/maintenxos' });
client.connect().then(() => {
  return client.query(`
    ALTER TABLE spare_parts ADD COLUMN IF NOT EXISTS linked_assets text DEFAULT '';
    ALTER TABLE notifications ADD COLUMN IF NOT EXISTS target_role varchar(100) DEFAULT 'ALL';
  `);
}).then(() => {
  console.log('Columns added successfully');
  client.end();
}).catch(err => {
  console.error(err);
  client.end();
});
