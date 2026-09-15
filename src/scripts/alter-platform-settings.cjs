const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:root@localhost:5432/maintenxos' });

(async () => {
  try {
    await client.connect();
    await client.query(`
      ALTER TABLE public.platform_settings 
      ADD COLUMN IF NOT EXISTS security_policies JSONB,
      ADD COLUMN IF NOT EXISTS system_config JSONB;
    `);
    console.log("Added security_policies and system_config to platform_settings if not exists.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await client.end();
  }
})();
