const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: 'postgresql://postgres:root@localhost:5432/maintenxos' });
  await client.connect();

  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_quality_specs_spec_id ON public.quality_specs(spec_id) WHERE spec_id IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_ccp_limits_number ON public.ccp_limits(ccp_number) WHERE ccp_number IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_assets_asset_id ON public.assets(asset_id) WHERE asset_id IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_assets_code ON public.assets(asset_code) WHERE asset_code IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_storage_resources_code ON public.storage_resources(resource_code) WHERE resource_code IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_storage_resources_res_id ON public.storage_resources(resource_id) WHERE resource_id IS NOT NULL;
  `);

  console.log('Unique indexes verified/created successfully!');
  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
