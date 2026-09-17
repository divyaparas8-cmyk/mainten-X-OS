const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:aashi%401234@localhost:5432/maintenxos'
  });
  await client.connect();

  console.log('Connected to database maintenxos.');

  // 1. Create table pm_schedule_versions
  console.log('\n--- Creating pm_schedule_versions table (if not exists) ---');
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.pm_schedule_versions (
      id uuid DEFAULT gen_random_uuid() NOT NULL,
      tenant_id uuid NOT NULL,
      plant_id uuid,
      version_id character varying(100) NOT NULL,
      title character varying(255) NOT NULL,
      status character varying(50) DEFAULT 'Draft'::character varying NOT NULL,
      created_by character varying(255) DEFAULT 'Elena Rostova (Lead Planner)'::character varying,
      orders_count integer DEFAULT 4,
      total_planned_hours numeric(8,2) DEFAULT 80.00,
      utilization_percent numeric(5,2) DEFAULT 90.00,
      reason text,
      changes_description text,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now(),
      CONSTRAINT pm_schedule_versions_pkey PRIMARY KEY (id)
    );
  `);
  console.log('✅ pm_schedule_versions table ensured.');

  // 2. Create table service_risks
  console.log('\n--- Creating service_risks table (if not exists) ---');
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.service_risks (
      id uuid DEFAULT gen_random_uuid() NOT NULL,
      tenant_id uuid NOT NULL,
      plant_id uuid,
      risk_code character varying(50) NOT NULL,
      customer character varying(255) NOT NULL,
      order_ref character varying(100),
      risk_title text NOT NULL,
      potential_penalty character varying(255),
      financial_exposure numeric(12,2) DEFAULT 0.00,
      severity character varying(50) DEFAULT 'High Risk'::character varying,
      impact text,
      recommendation text,
      is_mitigated boolean DEFAULT false,
      mitigated_at timestamp without time zone,
      mitigated_by character varying(255),
      created_at timestamp without time zone DEFAULT now(),
      updated_at timestamp without time zone DEFAULT now(),
      CONSTRAINT service_risks_pkey PRIMARY KEY (id)
    );
  `);
  console.log('✅ service_risks table ensured.');

  // 3. Insert seed data for pm_schedule_versions with ON CONFLICT DO NOTHING
  console.log('\n--- Populating pm_schedule_versions seed data (safe from duplicates) ---');
  const resPm = await client.query(`
    INSERT INTO public.pm_schedule_versions (
      id, tenant_id, plant_id, version_id, title, status, created_by,
      orders_count, total_planned_hours, utilization_percent, reason,
      changes_description, created_at, updated_at
    ) VALUES 
    (
      'e44b2157-101b-4ca3-b0d8-a28390e8f8c6',
      '5bce8458-909a-4dd2-b221-614c32ac7c89',
      '83c90534-4761-495c-b2bf-6a61de2260c4',
      'V4.2',
      'Master Weekly Production Schedule V4.2',
      'Published',
      'Alexander Vance (Lead Scheduler)',
      4,
      78.50,
      88.00,
      'Optimized Line 1 changeovers & scheduled Aseptic CIP rinse.',
      'Initial approved shop-floor baseline for Week 36.',
      '2026-09-17 15:52:46.920759+05:30',
      '2026-09-17 15:52:46.920759+05:30'
    ),
    (
      '07de6d05-8919-4abf-8d2c-9c989a50b7af',
      '5bce8458-909a-4dd2-b221-614c32ac7c89',
      '83c90534-4761-495c-b2bf-6a61de2260c4',
      'V4.3-DRAFT',
      'Draft Production Schedule Revision V4.3',
      'Validated',
      'Alexander Vance (Lead Scheduler)',
      5,
      94.00,
      92.00,
      'Incorporated Whole Foods urgent demand PO-WF-88901 into Line 1.',
      '+1 Production run added on Line 1. Changeover gap adjusted.',
      '2026-09-17 15:52:46.920759+05:30',
      '2026-09-17 15:52:46.920759+05:30'
    )
    ON CONFLICT (id) DO NOTHING
    RETURNING id;
  `);
  console.log(`✅ pm_schedule_versions rows inserted: ${resPm.rowCount}`);

  // 4. Insert seed data for service_risks with ON CONFLICT DO NOTHING
  console.log('\n--- Populating service_risks seed data (safe from duplicates) ---');
  const resRisks = await client.query(`
    INSERT INTO public.service_risks (
      id, tenant_id, plant_id, risk_code, customer, order_ref, risk_title,
      potential_penalty, financial_exposure, severity, impact, recommendation,
      is_mitigated, mitigated_at, mitigated_by, created_at, updated_at
    ) VALUES
    (
      '43918a45-806b-4a37-b4db-5e62ddee631d',
      '5bce8458-909a-4dd2-b221-614c32ac7c89',
      NULL,
      'RSK-01',
      'Kroger Mid-Atlantic',
      'PO-KR-99321',
      '28mm Tamper-Evident HDPE Cap Shortage Risk',
      '$14,500 (OTIF SLA Clause 4.2)',
      14500.00,
      'High Risk',
      'Late Delivery on 24,000 Bottles Tonic Water',
      'Authorize expedited air-freight shipment from secondary packaging vendor.',
      false,
      NULL,
      NULL,
      '2026-09-17 15:52:32.833843',
      '2026-09-17 15:52:32.833843'
    ),
    (
      '052321da-f3e4-461d-9747-8996ebafe45e',
      '5bce8458-909a-4dd2-b221-614c32ac7c89',
      NULL,
      'RSK-02',
      'Whole Foods Market',
      'PO-WF-88901',
      'Line 1 High-Capacity Scheduling Compression',
      '$8,200',
      8200.00,
      'Medium Risk',
      'Potential 6-hour delay during Friday changeover window',
      'Pre-stage sterile wash CIP fluids 2 hours before run completion.',
      false,
      NULL,
      NULL,
      '2026-09-17 15:52:32.833843',
      '2026-09-17 15:52:32.833843'
    )
    ON CONFLICT (id) DO NOTHING
    RETURNING id;
  `);
  console.log(`✅ service_risks rows inserted: ${resRisks.rowCount}`);

  // 5. Add columns qr_code, critical_score, stage to assets, downtime_logs, exceptions, pm_schedules, work_orders safely
  console.log('\n--- Ensuring missing columns from dump (safe IF NOT EXISTS) ---');
  await client.query(`
    ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS qr_code text;
    ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS critical_score integer DEFAULT 50;
    ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS stage text DEFAULT 'PACKAGING';
    ALTER TABLE public.downtime_logs ADD COLUMN IF NOT EXISTS stage text DEFAULT 'PACKAGING';
    ALTER TABLE public.exceptions ADD COLUMN IF NOT EXISTS stage text DEFAULT 'PACKAGING';
    ALTER TABLE public.pm_schedules ADD COLUMN IF NOT EXISTS stage text DEFAULT 'PACKAGING';
    ALTER TABLE public.work_orders ADD COLUMN IF NOT EXISTS stage text DEFAULT 'PACKAGING';
  `);
  console.log('✅ Columns verified / added.');

  // 6. Verify total tables count in database
  const countRes = await client.query(`
    SELECT count(*) as total_tables
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  `);
  console.log('\n========================================');
  console.log(`🎉 Total tables now in maintenxos: ${countRes.rows[0].total_tables}`);
  console.log('========================================\n');

  await client.end();
}

main().catch(err => {
  console.error('Error during migration:', err);
  process.exit(1);
});
