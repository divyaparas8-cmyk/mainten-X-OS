const { Client } = require('pg');

async function setup() {
  const client = new Client({ connectionString: 'postgres://postgres:root@localhost:5432/maintenxos' });
  await client.connect();
  console.log('Connected to PostgreSQL database maintenxos');

  // 1. MISSING DATA
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.data_health_missing (
      id VARCHAR(100) PRIMARY KEY,
      tenant_id UUID,
      table_name VARCHAR(255) NOT NULL,
      record_key VARCHAR(255) NOT NULL,
      field_name VARCHAR(255) NOT NULL,
      suggestion TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Open',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const missingCount = await client.query('SELECT count(*) FROM public.data_health_missing');
  if (parseInt(missingCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO public.data_health_missing (id, table_name, record_key, field_name, suggestion, status) VALUES
      ('MD-01', 'Item Master', 'SKU-5003 (Ginger Beer)', 'Standard Unit Cost', 'Set standard cost to $0.38', 'Open'),
      ('MD-02', 'Work Centers', 'WC-103 (Labeler)', 'Operator Manning Standard', 'Assign standard crew = 2', 'Open'),
      ('MD-03', 'Allergen Matrix', 'FAM-02 (Tonics)', 'CIP Protocol Linkage', 'Link to CIP-01 (Hot Caustic)', 'Open')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Seeded baseline Missing Data records');
  }

  // 2. DUPLICATES
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.data_health_duplicates (
      id VARCHAR(100) PRIMARY KEY,
      tenant_id UUID,
      entity_type VARCHAR(255) NOT NULL,
      primary_record VARCHAR(255) NOT NULL,
      duplicate_record VARCHAR(255) NOT NULL,
      similarity VARCHAR(50) NOT NULL DEFAULT '95% Match',
      status VARCHAR(50) NOT NULL DEFAULT 'Potential Duplicate',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const dupCount = await client.query('SELECT count(*) FROM public.data_health_duplicates');
  if (parseInt(dupCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO public.data_health_duplicates (id, entity_type, primary_record, duplicate_record, similarity, status) VALUES
      ('DUP-01', 'Raw Ingredient', 'ING-1001 (Liquid Cane Sugar)', 'ING-9004 (Liquid Cane Sugar 67 Bx)', '98% Match', 'Potential Duplicate'),
      ('DUP-02', 'Customer Account', 'CUST-401 (Whole Foods Market)', 'CUST-499 (Whole Foods Direct TX)', '92% Match', 'Potential Duplicate')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Seeded baseline Duplicates records');
  }

  // 3. INVALID REFERENCES
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.data_health_invalid_references (
      id VARCHAR(100) PRIMARY KEY,
      tenant_id UUID,
      parent_table VARCHAR(255) NOT NULL,
      referenced_field VARCHAR(255) NOT NULL DEFAULT 'Foreign Key ID',
      foreign_id VARCHAR(255) NOT NULL,
      issue TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Broken Key',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const invCount = await client.query('SELECT count(*) FROM public.data_health_invalid_references');
  if (parseInt(invCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO public.data_health_invalid_references (id, parent_table, referenced_field, foreign_id, issue, status) VALUES
      ('REF-01', 'BOM Recipe (BOM-5002)', 'Ingredient Key', 'ING-9901 (Non-existent)', 'Orphaned Foreign Key Reference', 'Broken Key'),
      ('REF-02', 'Work Orders (WO-8812)', 'Asset Reference', 'EQ-999 (Missing Machine)', 'Orphaned Machine Target Key', 'Broken Key')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Seeded baseline Invalid References records');
  }

  // 4. BROKEN RELATIONSHIPS
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.data_health_broken_relationships (
      id VARCHAR(100) PRIMARY KEY,
      tenant_id UUID,
      from_entity VARCHAR(255) NOT NULL,
      to_entity VARCHAR(255) NOT NULL,
      relationship VARCHAR(255) NOT NULL,
      issue TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Unlinked',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const brkCount = await client.query('SELECT count(*) FROM public.data_health_broken_relationships');
  if (parseInt(brkCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO public.data_health_broken_relationships (id, from_entity, to_entity, relationship, issue, status) VALUES
      ('REL-101', 'Production Routing (RTG-02)', 'Work Center (WC-04)', 'Step 4 Seamer Operation', 'Work Center unattached to Line 3', 'Unlinked'),
      ('REL-102', 'SKU-5001 (Citrus Soda)', 'Changeover Matrix', 'SMED Standard Definition', 'Missing cleanout transition row to SKU-5003', 'Unlinked')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Seeded baseline Broken Relationships records');
  }

  // 5. STALE RECORDS
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.data_health_stale_records (
      id VARCHAR(100) PRIMARY KEY,
      tenant_id UUID,
      name VARCHAR(255) NOT NULL,
      table_name VARCHAR(255) NOT NULL,
      last_produced VARCHAR(100) NOT NULL,
      inventory_on_hand VARCHAR(50) NOT NULL DEFAULT '0',
      status VARCHAR(50) NOT NULL DEFAULT 'Stale / Obsolete',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const staleCount = await client.query('SELECT count(*) FROM public.data_health_stale_records');
  if (parseInt(staleCount.rows[0].count) === 0) {
    await client.query(`
      INSERT INTO public.data_health_stale_records (id, name, table_name, last_produced, inventory_on_hand, status) VALUES
      ('STL-01', 'SKU-4008 (Seasonal Spiced Soda 2024)', 'Item Master', '248 Days Ago', '0', 'Stale / Obsolete'),
      ('STL-02', 'BOM-4008 (Spiced Formula v1)', 'BOM Master', '248 Days Ago', '0', 'Stale / Obsolete'),
      ('STL-03', 'VEND-88 (Legacy Glass Supplier)', 'Vendor Master', '310 Days Ago', '0', 'Inactive Vendor')
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Seeded baseline Stale Records');
  }

  console.log('=== All 5 Data Health PostgreSQL Tables Created & Verified! ===');
  await client.end();
}

setup().catch(console.error);
