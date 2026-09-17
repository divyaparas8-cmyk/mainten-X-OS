import pg from 'pg';
const { Pool } = pg;

async function seedAssets() {
  const pool = new Pool({
    connectionString: 'postgresql://postgres:hitesha2004@localhost:5432/maintenx-os'
  });

  try {
    const existing = await pool.query("SELECT * FROM public.assets");
    console.log('Existing assets count:', existing.rows.length);

    const defaultAssets = [
      { asset_code: 'FM-001', name: 'Rotary Filling Machine 48-Valve', critical_level: 'Critical A', status: 'Operational' },
      { asset_code: 'CP-102', name: 'Capper Station 12-Head', critical_level: 'Critical A', status: 'Operational' },
      { asset_code: 'LB-204', name: 'Labeler High-Speed B&H', critical_level: 'Critical B', status: 'Operational' },
      { asset_code: 'PK-401', name: 'Case Packer / Palletizer', critical_level: 'Critical B', status: 'Operational' },
      { asset_code: 'CS-501', name: 'CIP Sanitation Skidded Loop', critical_level: 'Critical A', status: 'Operational' }
    ];

    const validTenant = '5bce8458-909a-4dd2-b221-614c32ac7c89';

    for (const a of defaultAssets) {
      const check = await pool.query("SELECT id FROM public.assets WHERE asset_code = $1 OR name = $2", [a.asset_code, a.name]);
      if (check.rows.length === 0) {
        await pool.query(
          "INSERT INTO public.assets (tenant_id, asset_code, name, critical_level, status) VALUES ($1, $2, $3, $4, $5)",
          [validTenant, a.asset_code, a.name, a.critical_level, a.status]
        );
        console.log(`Inserted asset: ${a.name} (${a.asset_code})`);
      } else {
        console.log(`Asset already exists: ${a.name}`);
      }
    }

    const all = await pool.query("SELECT id, asset_code, name FROM public.assets");
    console.log('All DB assets:', all.rows);
  } catch (err: any) {
    console.error('Error seeding assets:', err.message);
  }
  await pool.end();
}

seedAssets();
