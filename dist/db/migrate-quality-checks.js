"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQualityChecksMigration = runQualityChecksMigration;
const database_js_1 = require("../config/database.js");
async function runQualityChecksMigration() {
    const client = await database_js_1.pool.connect();
    try {
        console.log("🚀 Starting database migration for Quality Checks modules (CCP, Process Checks, Specifications)...");
        // 1. Upgrade public.ccp_checks table (do NOT drop or recreate)
        await client.query(`
      ALTER TABLE public.ccp_checks ALTER COLUMN tenant_id DROP NOT NULL;
      ALTER TABLE public.ccp_checks ALTER COLUMN plant_id DROP NOT NULL;
      ALTER TABLE public.ccp_checks ALTER COLUMN batch_id DROP NOT NULL;
      ALTER TABLE public.ccp_checks ALTER COLUMN line_id DROP NOT NULL;
      ALTER TABLE public.ccp_checks DROP CONSTRAINT IF EXISTS ccp_checks_plant_id_plants_id_fk;
      ALTER TABLE public.ccp_checks DROP CONSTRAINT IF EXISTS ccp_checks_operator_id_users_id_fk;
      ALTER TABLE public.ccp_checks DROP CONSTRAINT IF EXISTS ccp_checks_line_id_production_lines_id_fk;
      ALTER TABLE public.ccp_checks DROP CONSTRAINT IF EXISTS ccp_checks_batch_id_batches_id_fk;
      ALTER TABLE public.ccp_checks ADD COLUMN IF NOT EXISTS batch_number VARCHAR(100);
      ALTER TABLE public.ccp_checks ADD COLUMN IF NOT EXISTS line_name VARCHAR(150);
      ALTER TABLE public.ccp_checks ADD COLUMN IF NOT EXISTS operator VARCHAR(150);
      ALTER TABLE public.ccp_checks ADD COLUMN IF NOT EXISTS equipment VARCHAR(150);
      ALTER TABLE public.ccp_checks ADD COLUMN IF NOT EXISTS location VARCHAR(150);
      ALTER TABLE public.ccp_checks ADD COLUMN IF NOT EXISTS test_method VARCHAR(255);
      ALTER TABLE public.ccp_checks ADD COLUMN IF NOT EXISTS critical_limit VARCHAR(255);
      ALTER TABLE public.ccp_checks ADD COLUMN IF NOT EXISTS corrective_action TEXT;
    `);
        console.log("✅ Verified and upgraded public.ccp_checks table");
        // 2. Create public.process_checks table if not exists
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.process_checks (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        name VARCHAR(255) NOT NULL,
        parameter VARCHAR(255) NOT NULL,
        target VARCHAR(255) NOT NULL,
        actual VARCHAR(255) NOT NULL,
        line VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'OK',
        timestamp_str VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_process_checks_tenant ON public.process_checks(tenant_id);
    `);
        console.log("✅ Verified public.process_checks table");
        // 3. Upgrade public.quality_specs table if columns missing (do NOT recreate)
        await client.query(`
      ALTER TABLE public.quality_specs ALTER COLUMN tenant_id DROP NOT NULL;
      ALTER TABLE public.quality_specs ALTER COLUMN sku_id DROP NOT NULL;
      ALTER TABLE public.quality_specs ALTER COLUMN parameter_name DROP NOT NULL;
      ALTER TABLE public.quality_specs ALTER COLUMN target_value DROP NOT NULL;
      ALTER TABLE public.quality_specs ALTER COLUMN min_tolerance DROP NOT NULL;
      ALTER TABLE public.quality_specs ALTER COLUMN max_tolerance DROP NOT NULL;
      ALTER TABLE public.quality_specs ALTER COLUMN uom DROP NOT NULL;
      ALTER TABLE public.quality_specs ADD COLUMN IF NOT EXISTS range VARCHAR(255);
      ALTER TABLE public.quality_specs ADD COLUMN IF NOT EXISTS ccp VARCHAR(50);
      ALTER TABLE public.quality_specs ADD COLUMN IF NOT EXISTS sku VARCHAR(255);
    `);
        console.log("✅ Verified public.quality_specs table");
        // Fetch existing tenants
        const tenantRows = await client.query(`SELECT id FROM public.tenants;`);
        const tenantIds = tenantRows.rows.map(r => r.id);
        if (!tenantIds.includes(null))
            tenantIds.push(null);
        // 4. Seed operational CCP checks if empty
        const ccpRes = await client.query(`SELECT COUNT(*)::int as count FROM public.ccp_checks;`);
        console.log(`📊 Current ccp_checks count: ${ccpRes.rows[0].count}`);
        if (ccpRes.rows[0].count === 0) {
            console.log("🌱 Seeding initial operational CCP checks into ccp_checks...");
            for (const tid of tenantIds) {
                await client.query(`
          INSERT INTO public.ccp_checks (
            tenant_id, ccp_code, ccp_name, target_value, actual_value, uom, status, 
            batch_number, line_name, operator, equipment, location, test_method, critical_limit, notes
          ) VALUES 
          (
            $1,
            'CCP-01', 
            'Pasteurizer HTST Critical Limit Temperature', 
            83.1, 
            83.5, 
            '°C', 
            'PASS', 
            'BAT-2026-ORD2511', 
            'Line 1 Bottling & Canning (250 BPM)', 
            'Arthur Sterling (Plant Manager)', 
            'Plate Heat Exchanger Pasteurizer', 
            'Line 1 — Infeed Pasteurization Loop', 
            'Automated RTD Sensor & QA Titration', 
            '≥ 83.1°C for minimum 15 seconds', 
            'Thermal hold step compliant. Sensor calibrated.'
          ),
          (
            $1,
            'CCP-02', 
            'End-of-Line Metal Detection Sensitivity', 
            0, 
            0, 
            'unit', 
            'PASS', 
            'BAT-2026-ORD2511', 
            'Line 1 Bottling & Canning (250 BPM)', 
            'Arthur Sterling (Plant Manager)', 
            'Mettler Toledo In-Line Metal Detector', 
            'Line 1 — Packaging Outfeed', 
            'Calibrated Test Wand Challenge (Fe 2.0mm, Non-Fe 2.5mm, SS 3.0mm)', 
            'Zero metal contamination reject', 
            'Hourly challenge wands passed with immediate pneumatic reject.'
          ),
          (
            $1,
            'CCP-03', 
            'Can Double Seam Hermetic Seal Verification', 
            1.10, 
            1.25, 
            'mm', 
            'PASS', 
            'BAT-2026-ORD2511', 
            'Line 2 High-Speed Can Line', 
            'Dr. Rachel Thorne (QA Lead)', 
            'CMC-KUHNKE Vision Seam Gauge', 
            'Line 2 — Rotary Seamer Head', 
            'Optical Cross-Section Seam Scope', 
            'Seam Overlap ≥ 1.10mm', 
            'Double seam overlap and tightness 100% verified.'
          );
        `, [tid]);
            }
            console.log("✅ Seeded initial operational CCP checks");
        }
        // 5. Seed operational Process checks if empty
        const procRes = await client.query(`SELECT COUNT(*)::int as count FROM public.process_checks;`);
        console.log(`📊 Current process_checks count: ${procRes.rows[0].count}`);
        if (procRes.rows[0].count === 0) {
            console.log("🌱 Seeding initial operational parameters into process_checks...");
            await client.query(`
        INSERT INTO public.process_checks (name, parameter, target, actual, line, status, timestamp_str)
        VALUES
        ('Blending agitator speed (Tank TK-02)', 'Agitator Speed', '450 RPM', '448 RPM', 'Line 1 - Blending Area', 'OK', '14:15'),
        ('Intake Manifold Header Pressure', 'Header Pressure', '3.2 - 3.8 bar', '3.52 bar', 'Line 1 - Infeed', 'OK', '13:45'),
        ('Carbonation Dissolved CO2 Level', 'CO2 Gas Volume', '3.60 - 3.80 Vol', '3.71 Vol', 'Line 2 - Carbonator', 'OK', '13:10'),
        ('Bottle Rinser De-aerated Water Flush', 'Rinse Temp & Flow', '≥65°C • 12 LPM', '66.4°C • 12.2 LPM', 'Line 1 - Rinser', 'OK', '12:30');
      `);
            console.log("✅ Seeded initial operational parameters into process_checks");
        }
        // 6. Seed operational Quality Specifications if empty
        const specRes = await client.query(`SELECT COUNT(*)::int as count FROM public.quality_specs;`);
        console.log(`📊 Current quality_specs count: ${specRes.rows[0].count}`);
        if (specRes.rows[0].count === 0) {
            console.log("🌱 Seeding initial master specifications into quality_specs...");
            await client.query(`
        INSERT INTO public.quality_specs (
          parameter, range, sku, ccp, uom, min, max, is_ccp, status, criticality, approval_status
        ) VALUES
        ('Brix Sugar Level (Concentration)', '11.6 - 12.2 °Bx', 'Sparkling Citrus & Cola 500ml', 'No', '°Bx', '11.6', '12.2', false, 'ACTIVE', 'STANDARD', 'APPROVED'),
        ('Pasteurizer Heat Exchanger Temperature', '≥ 83.1 °C', 'All Bottled / Aseptic SKUs', 'Yes (CCP-01)', '°C', '83.1', '88.0', true, 'ACTIVE', 'CRITICAL', 'APPROVED'),
        ('Net Volume Fill Tolerance', '330.0 ± 2.5 ml', '330ml Aluminum Cans', 'No', 'ml', '327.5', '332.5', false, 'ACTIVE', 'STANDARD', 'APPROVED'),
        ('Dissolved Carbon Dioxide (CO2)', '3.60 - 3.80 Vol', 'Sparkling Sodas', 'No', 'Vol', '3.60', '3.80', false, 'ACTIVE', 'STANDARD', 'APPROVED'),
        ('End-of-Line Metal Detector Sensitivity', 'Fe 2.0mm / Non-Fe 2.5mm / SS 3.0mm', 'All Packaged SKUs', 'Yes (CCP-02)', 'mm', '0', '0', true, 'ACTIVE', 'CRITICAL', 'APPROVED');
      `);
            console.log("✅ Seeded initial master specifications into quality_specs");
        }
        console.log("🎉 Quality Checks DB Migration finished successfully!");
    }
    catch (err) {
        console.error("❌ Migration error in quality checks:", err.message);
        throw err;
    }
    finally {
        client.release();
    }
}
if (process.argv[1]?.includes("migrate-quality-checks")) {
    runQualityChecksMigration()
        .then(() => process.exit(0))
        .catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=migrate-quality-checks.js.map