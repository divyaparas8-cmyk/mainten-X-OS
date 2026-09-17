const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:root@localhost:5432/maintenxos' });

(async () => {
  try {
    await client.connect();
    const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'platform_settings';");
    console.log("PLATFORM_SETTINGS COLUMNS:", res.rows);

    const rows = await client.query("SELECT * FROM platform_settings LIMIT 5;");
    console.log("PLATFORM_SETTINGS ROWS:", rows.rows);

  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await client.end();
  }
})();
