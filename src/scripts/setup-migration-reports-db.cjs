const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres:root@localhost:5432/maintenxos'
});

async function run() {
  const client = await pool.connect();
  try {
    console.log('Starting Migration and System Reports table creation...');

    // 1. Data Migration Batches Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.data_migration_batches (
        id VARCHAR(64) PRIMARY KEY,
        tenant_id VARCHAR(64),
        target VARCHAR(255) NOT NULL,
        connector VARCHAR(255) NOT NULL,
        transferred VARCHAR(100) NOT NULL,
        conformity VARCHAR(50) NOT NULL,
        status VARCHAR(100) NOT NULL,
        records_count INT DEFAULT 0,
        details JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ public.data_migration_batches table created/verified.');

    // Seed initial migration batches if empty
    const { rows: existingBatches } = await client.query(`SELECT count(*) as cnt FROM public.data_migration_batches;`);
    if (parseInt(existingBatches[0].cnt, 10) === 0) {
      console.log('Seeding initial migration batches...');
      await client.query(`
        INSERT INTO public.data_migration_batches (id, target, connector, transferred, conformity, status, records_count)
        VALUES
          ('RUN-2026-0819-01', 'Item & SKU Master Tables', 'FlowState ERP SQL Connector', '1,420 / 1,420 rows', '98.6%', 'Committed & Verified', 1420),
          ('RUN-2026-0818-04', 'Bill of Materials (BOM) Multi-Level', 'CSV Bulk File Staging', '640 / 650 rows', '98.4%', 'Committed & Verified', 640),
          ('RUN-2026-0817-02', 'Machine Asset Register & Line Mappings', 'SAP Plant Maintenance Export', '390 / 390 rows', '100.0%', 'Committed & Verified', 390)
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log('✅ Migration batches seeded.');
    } else {
      console.log(`ℹ️ Migration batches already have ${existingBatches[0].cnt} records.`);
    }

    // 2. System Reports Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.system_governance_reports (
        id VARCHAR(64) PRIMARY KEY,
        tenant_id VARCHAR(64),
        title VARCHAR(255) NOT NULL,
        uptime VARCHAR(50) NOT NULL,
        db_storage VARCHAR(50) NOT NULL,
        api_latency VARCHAR(50) NOT NULL,
        licenses_used INT DEFAULT 13,
        licenses_total INT DEFAULT 100,
        tier VARCHAR(100) DEFAULT 'ENTERPRISE TIER ACTIVE',
        edge_health VARCHAR(100) DEFAULT '99.99% HEALTH',
        status VARCHAR(50) DEFAULT 'PUBLISHED',
        generated_by VARCHAR(128) DEFAULT 'Alexander Vance',
        metrics JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ public.system_governance_reports table created/verified.');

    // Seed initial reports if empty
    const { rows: existingReports } = await client.query(`SELECT count(*) as cnt FROM public.system_governance_reports;`);
    if (parseInt(existingReports[0].cnt, 10) === 0) {
      console.log('Seeding initial system reports...');
      await client.query(`
        INSERT INTO public.system_governance_reports (id, title, uptime, db_storage, api_latency, licenses_used, licenses_total, status, generated_by)
        VALUES
          ('REP-2026-09-01', 'Monthly Infrastructure Health & SLA Audit', '99.98%', '31 MB', '22 ms', 13, 100, 'PUBLISHED', 'Alexander Vance'),
          ('REP-2026-08-15', 'Mid-Quarter SOC2 Compliance & Storage Snapshot', '99.95%', '28 MB', '35 ms', 13, 100, 'AUDITED', 'Alexander Vance'),
          ('REP-2026-08-01', 'Edge Telemetry & Gateway Performance Audit', '99.92%', '24 MB', '18 ms', 12, 100, 'ARCHIVED', 'Alexander Vance')
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log('✅ System governance reports seeded.');
    } else {
      console.log(`ℹ️ System reports already have ${existingReports[0].cnt} records.`);
    }

  } catch (err) {
    console.error('Error setting up tables:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
