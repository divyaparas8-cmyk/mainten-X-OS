import { pool } from "../config/database.js";

export async function runQualitySanitationMigration() {
  console.log("🚀 Starting database migration for Quality & Sanitation modules...");
  const client = await pool.connect();
  try {
    // 1. Ensure preop_checks table exists with required columns
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.preop_checks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL,
        plant_id UUID,
        line_id UUID,
        line_name VARCHAR(150),
        batch_id UUID,
        batch_number VARCHAR(150),
        category VARCHAR(150) NOT NULL,
        name VARCHAR(255) NOT NULL,
        spec VARCHAR(255) NOT NULL,
        criticality VARCHAR(100) DEFAULT 'Critical GMP' NOT NULL,
        method VARCHAR(150),
        passed BOOLEAN DEFAULT NULL,
        notes TEXT DEFAULT '',
        inspector_name VARCHAR(150) DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_preop_checks_tenant ON public.preop_checks(tenant_id);
    `);
    console.log("✅ Verified public.preop_checks table");

    // 2. Create sanitation_cip_steps and sanitation_cip_config tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.sanitation_cip_steps (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        phase VARCHAR(255) NOT NULL,
        equipment VARCHAR(255) NOT NULL,
        spec TEXT NOT NULL,
        chemical VARCHAR(255) NOT NULL,
        target_value VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT NULL,
        log_value TEXT DEFAULT '',
        step_order INT DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.sanitation_cip_config (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        loop VARCHAR(255) NOT NULL,
        protocol VARCHAR(255) NOT NULL,
        operator VARCHAR(255) NOT NULL,
        chemical_wash VARCHAR(255) DEFAULT 'Caustic 2.5% • 81.4°C',
        sanitizer VARCHAR(255) DEFAULT 'PAA Sanitizer: 180 ppm Target',
        status VARCHAR(64) DEFAULT 'CYCLE IN PROGRESS',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_sanitation_cip_steps_tenant ON public.sanitation_cip_steps(tenant_id);
    `);
    console.log("✅ Verified public.sanitation_cip_steps & public.sanitation_cip_config tables");

    // 3. Create allergen_audits table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.allergen_audits (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(100),
        line VARCHAR(150),
        test_method VARCHAR(255) NOT NULL,
        target_allergen VARCHAR(255) NOT NULL,
        status VARCHAR(64) DEFAULT 'PENDING AUDIT',
        auditor VARCHAR(150),
        timestamp_str VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_allergen_audits_tenant ON public.allergen_audits(tenant_id);
    `);
    console.log("✅ Verified public.allergen_audits table");

    // 4. Create line_readiness table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.line_readiness (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        line VARCHAR(255) NOT NULL,
        line_code VARCHAR(50) NOT NULL,
        safety VARCHAR(50) DEFAULT 'PASSED',
        sanitation VARCHAR(50) DEFAULT 'PASSED',
        mechanical VARCHAR(50) DEFAULT 'PASSED',
        status VARCHAR(50) DEFAULT 'READY',
        speed_target VARCHAR(50),
        last_inspection VARCHAR(100) DEFAULT 'Just now',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_line_readiness_tenant ON public.line_readiness(tenant_id);
    `);
    console.log("✅ Verified public.line_readiness table");

    // 5. Create cleaning_verifications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.cleaning_verifications (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        verified BOOLEAN DEFAULT FALSE,
        atp_test_result VARCHAR(100) DEFAULT '4.2 RLU (PASSED)',
        microbial_residue VARCHAR(100) DEFAULT '0.00% Zero Trace',
        target_limit VARCHAR(100) DEFAULT '<10 RLU',
        loop VARCHAR(255) DEFAULT 'CIP Loop 01',
        notes TEXT DEFAULT '',
        verified_at TIMESTAMP WITH TIME ZONE,
        verified_by VARCHAR(150) DEFAULT 'Dr. Rachel Thorne',
        status VARCHAR(64) DEFAULT 'PENDING',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_cleaning_verifications_tenant ON public.cleaning_verifications(tenant_id);
    `);
    console.log("✅ Verified public.cleaning_verifications table");

    // Check preop_checks count
    const preopRes = await client.query(`SELECT COUNT(*)::int as count FROM public.preop_checks;`);
    console.log(`📊 Current preop_checks count: ${preopRes.rows[0].count}`);

    // Check sanitation_cip_steps count
    const sanRes = await client.query(`SELECT COUNT(*)::int as count FROM public.sanitation_cip_steps;`);
    console.log(`📊 Current sanitation_cip_steps count: ${sanRes.rows[0].count}`);
    if (sanRes.rows[0].count === 0) {
      console.log("🌱 Seeding initial CIP steps into sanitation_cip_steps...");
      await client.query(`
        INSERT INTO public.sanitation_cip_steps (step_order, phase, equipment, spec, chemical, target_value, completed, log_value)
        VALUES
        (1, '1. Pre-Rinse Cycle', 'Main Filler Bowl & Intake Manifold', 'Warm RO Water @ 45°C - 55°C • 10 mins', 'Treated Reverse Osmosis Water', 'Turbidity < 5 NTU', true, 'Rinse time: 10 mins • Clear effluent'),
        (2, '2. Alkaline Caustic Wash', 'Valves, Filling Nozzles & Flow Meters', '2.5% NaOH (Sodium Hydroxide) @ 75°C - 85°C • 20 mins', 'Diversey Caustic CIP Blend', 'Conductivity > 45 mS/cm', true, 'Concentration: 2.52% • Temp: 81.4°C'),
        (3, '3. Intermediate Water Rinse', 'Product Contact Lines & Manifold Loop', 'Ambient RO Water until pH 7.0 neutral • 8 mins', 'Sterile RO Flush', 'pH 6.8 - 7.2 neutral', true, 'pH verified: 7.02 (Neutralized)'),
        (4, '4. Acid Wash (Scale Removal)', 'Plate Heat Exchanger & Pasteurizer Tubes', '1.2% Nitric/Phosphoric Acid @ 60°C • 15 mins', 'Food-Grade Descaler Acid', 'Conductivity 18 - 22 mS/cm', true, 'Acid loop: 1.2% • Temp: 62.0°C'),
        (5, '5. Sanitizer Cold Disinfection', 'All Aseptic Product Filling Heads', '150 - 200 ppm Peracetic Acid (PAA) @ 20°C • 10 mins', 'Peracetic Acid (PAA 15%)', '150 - 200 ppm titration', false, ''),
        (6, '6. Final Sterile Air Purge', 'Nozzle Tips & Conveyor Enclosure', 'HEPA Filtered Class 100 Air Blowdown • 5 mins', '0.2 Micron Filtered Air', 'Zero Moisture Residue', false, '');
      `);
      console.log("✅ Seeded initial CIP steps into database");
    }

    const cfgRes = await client.query(`SELECT COUNT(*)::int as count FROM public.sanitation_cip_config;`);
    if (cfgRes.rows[0].count === 0) {
      await client.query(`
        INSERT INTO public.sanitation_cip_config (loop, protocol, operator, chemical_wash, sanitizer, status)
        VALUES (
          'CIP Loop 01 (Rotary Filler & Intake Manifold)',
          '5-Step Full Thermal & Chemical CIP Cycle',
          'Dr. Rachel Thorne (QA Lead)',
          'Caustic 2.5% • 81.4°C',
          'PAA Sanitizer: 180 ppm Target',
          'CYCLE IN PROGRESS'
        );
      `);
      console.log("✅ Seeded initial CIP configuration into database");
    }

    // Check allergen_audits count
    const algRes = await client.query(`SELECT COUNT(*)::int as count FROM public.allergen_audits;`);
    console.log(`📊 Current allergen_audits count: ${algRes.rows[0].count}`);
    if (algRes.rows[0].count === 0) {
      console.log("🌱 Seeding initial operational audits into allergen_audits...");
      await client.query(`
        INSERT INTO public.allergen_audits (name, sku, line, test_method, target_allergen, status, auditor, timestamp_str)
        VALUES
        ('Costco Orange Juice Run (Allergen: Soy free)', 'SKU-ORJ-330', 'Line 1 Aseptic Bottling', 'Lateral Flow Strip (Neogen)', 'Soy Free (<2.5 ppm)', 'PENDING AUDIT', 'Dr. Rachel Thorne', 'Today, 11:20 AM'),
        ('Trader Joe''s Almond Milk Swap (Allergen: Tree Nut)', 'SKU-ALM-1000', 'Line 2 High-Speed Can Line', 'ELISA Swab Assay', 'Nut Cleanse (0 ppm residue)', 'AUDIT CLEARED', 'Marcus Vance', 'Today, 09:15 AM'),
        ('Oat Beverage Batch Clearance (Gluten Free)', 'SKU-OAT-500', 'Line 3 Tetra Pak Carton Loop', 'R5 Gliadin Rapid Strip', 'Gluten Free (<5 ppm)', 'AUDIT CLEARED', 'Dr. Rachel Thorne', 'Today, 07:45 AM');
      `);
      console.log("✅ Seeded initial operational audits into database");
    }

    // Check line_readiness count
    const lrdRes = await client.query(`SELECT COUNT(*)::int as count FROM public.line_readiness;`);
    console.log(`📊 Current line_readiness count: ${lrdRes.rows[0].count}`);
    if (lrdRes.rows[0].count === 0) {
      console.log("🌱 Seeding initial operational packaging lines into line_readiness...");
      await client.query(`
        INSERT INTO public.line_readiness (line, line_code, safety, sanitation, mechanical, status, speed_target, last_inspection)
        VALUES
        ('Line 1 (Aseptic Bottling & Rotary Filler 580 BPM)', 'LINE-01', 'PASSED', 'PASSED', 'PASSED', 'READY', '580 BPM', '10 mins ago'),
        ('Line 2 (High-Speed Aluminum Canner 800 CPM)', 'LINE-02', 'PASSED', 'PASSED', 'PASSED', 'READY', '800 CPM', '25 mins ago'),
        ('Line 3 (Tetra Pak Aseptic Carton 250ml)', 'LINE-03', 'PASSED', 'PENDING', 'PASSED', 'NOT READY', '350 CPM', '1 hour ago'),
        ('Line 4 (Stainless Kegging & Bulk Racking)', 'LINE-04', 'PASSED', 'PASSED', 'PASSED', 'READY', '120 BPH', '40 mins ago');
      `);
      console.log("✅ Seeded initial line_readiness into database");
    }

    // Check cleaning_verifications count
    const clnRes = await client.query(`SELECT COUNT(*)::int as count FROM public.cleaning_verifications;`);
    console.log(`📊 Current cleaning_verifications count: ${clnRes.rows[0].count}`);
    if (clnRes.rows[0].count === 0) {
      console.log("🌱 Seeding initial record into cleaning_verifications...");
      await client.query(`
        INSERT INTO public.cleaning_verifications (verified, atp_test_result, microbial_residue, target_limit, loop, notes, status, verified_by)
        VALUES (false, '4.2 RLU (PASSED)', '0.00% Zero Trace', '<10 RLU', 'CIP Loop 01', '', 'PENDING', 'Dr. Rachel Thorne');
      `);
      console.log("✅ Seeded initial cleaning_verifications into database");
    }

  } catch (err: any) {
    console.error("❌ Migration error:", err.message);
    throw err;
  } finally {
    client.release();
  }
}

if (process.argv[1]?.includes("migrate-quality-sanitation")) {
  runQualitySanitationMigration()
    .then(() => {
      console.log("🎉 Quality & Sanitation DB Migration completed successfully!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}
