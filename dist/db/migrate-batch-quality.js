"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBatchQualityMigration = runBatchQualityMigration;
const database_js_1 = require("../config/database.js");
async function runBatchQualityMigration() {
    const client = await database_js_1.pool.connect();
    try {
        console.log("🚀 Starting database migration for Batch Quality modules (Review, History, Records)...");
        // 1. Create public.batch_quality_reviews table IF NOT EXISTS
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.batch_quality_reviews (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        plant_id UUID,
        batch_number VARCHAR(100) NOT NULL,
        recipe_name VARCHAR(255) NOT NULL,
        current_step VARCHAR(255) NOT NULL,
        step_number INT DEFAULT 1,
        total_steps INT DEFAULT 5,
        progress_percent INT DEFAULT 0,
        line VARCHAR(150) DEFAULT 'Line 1 (Aseptic Bottling)',
        ccp_status VARCHAR(100) DEFAULT 'PASSED (83.5°C)',
        qa_status VARCHAR(100) DEFAULT 'QA REVIEW IN PROGRESS',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_batch_quality_reviews_tenant ON public.batch_quality_reviews(tenant_id);
    `);
        console.log("✅ Verified public.batch_quality_reviews table");
        // 2. Create public.batch_history table IF NOT EXISTS
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.batch_history (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        plant_id UUID,
        batch_id VARCHAR(100) NOT NULL,
        recipe VARCHAR(255) NOT NULL,
        line VARCHAR(150) NOT NULL,
        pallets VARCHAR(150) NOT NULL,
        date VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'RELEASED',
        coa_url VARCHAR(255) DEFAULT 'COA-BAT-2026-0888.pdf',
        auditor VARCHAR(150) DEFAULT 'Dr. Rachel Thorne',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_batch_history_tenant ON public.batch_history(tenant_id);
    `);
        console.log("✅ Verified public.batch_history table");
        // 3. Create public.batch_quality_records table IF NOT EXISTS
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.batch_quality_records (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        plant_id UUID,
        record_id VARCHAR(50) NOT NULL,
        batch VARCHAR(100) NOT NULL,
        type VARCHAR(255) NOT NULL,
        result VARCHAR(50) DEFAULT 'PASS',
        date VARCHAR(50) NOT NULL,
        officer VARCHAR(150) DEFAULT 'Dr. Rachel Thorne',
        details TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_batch_quality_records_tenant ON public.batch_quality_records(tenant_id);
    `);
        console.log("✅ Verified public.batch_quality_records table");
        // Fetch existing tenants
        const tenantRows = await client.query(`SELECT id FROM public.tenants;`);
        const tenantIds = tenantRows.rows.map(r => r.id);
        if (!tenantIds.includes(null))
            tenantIds.push(null);
        // 4. Seed operational records into public.batch_quality_reviews if empty
        const reviewCountRes = await client.query(`SELECT COUNT(*)::int as count FROM public.batch_quality_reviews;`);
        console.log(`📊 Current batch_quality_reviews count: ${reviewCountRes.rows[0].count}`);
        if (reviewCountRes.rows[0].count === 0) {
            console.log("🌱 Seeding initial operational records into public.batch_quality_reviews...");
            for (const tid of tenantIds) {
                await client.query(`
          INSERT INTO public.batch_quality_reviews (
            tenant_id, batch_number, recipe_name, current_step, step_number, total_steps, progress_percent, line, ccp_status, qa_status
          ) VALUES 
          (
            $1, 'BAT-2026-0890', 'Sparkling Citrus Soda 500ml', 'Phase 4: Carbonation & Chilling', 4, 5, 75, 'Line 1 (Aseptic Bottling)', 'PASSED (83.5°C)', 'QA REVIEW IN PROGRESS'
          ),
          (
            $1, 'BAT-2026-0891', 'Cold Brew Espresso 330ml Can', 'Phase 2: Syrup Blending & Extraction', 2, 6, 33, 'Line 2 (High-Speed Canner)', 'IN SPEC', 'SAMPLING SCHEDULED'
          ),
          (
            $1, 'BAT-2026-0892', 'Sparkling Blood Orange Soda', 'Phase 1: Water Treatment & Mineral Dosing', 1, 5, 0, 'Line 1 (Aseptic Bottling)', 'PRE-OP CLEARED', 'PENDING COMMENCEMENT'
          ),
          (
            $1, 'BAT-2026-0893', 'Almond Milk Latte Carton 250ml', 'Phase 1: Raw Emulsification', 1, 6, 0, 'Line 3 (Tetra Pak)', 'ALLERGEN AUDITED', 'LINE CLEARED'
          ),
          (
            $1, 'BAT-2026-0894', 'Premium Tonic Water Craft Keg 50L', 'Phase 1: Botanical Infusion', 1, 4, 0, 'Line 4 (Kegging)', 'TANK SANITIZED', 'STANDBY'
          );
        `, [tid]);
            }
            console.log("✅ Seeded initial operational batch quality reviews");
        }
        // 5. Seed operational records into public.batch_history if empty
        const historyCountRes = await client.query(`SELECT COUNT(*)::int as count FROM public.batch_history;`);
        console.log(`📊 Current batch_history count: ${historyCountRes.rows[0].count}`);
        if (historyCountRes.rows[0].count === 0) {
            console.log("🌱 Seeding initial operational records into public.batch_history...");
            for (const tid of tenantIds) {
                await client.query(`
          INSERT INTO public.batch_history (
            tenant_id, batch_id, recipe, line, pallets, date, status, coa_url, auditor
          ) VALUES 
          (
            $1, 'BAT-2026-0888', 'Organic Orange Juice 1L Bottle', 'Line 1 (Aseptic Bottling)', '24 Pallets (28,800 Units)', '2026-08-30', 'RELEASED', 'COA-BAT-2026-0888.pdf', 'Dr. Rachel Thorne'
          ),
          (
            $1, 'BAT-2026-0889', 'Organic Orange Juice 500ml Bottle', 'Line 1 (Aseptic Bottling)', '18 Pallets (32,400 Units)', '2026-08-30', 'RELEASED', 'COA-BAT-2026-0889.pdf', 'Dr. Rachel Thorne'
          ),
          (
            $1, 'BAT-2026-0887', 'Cold Brew Espresso 330ml Aluminum Can', 'Line 2 (High-Speed Canner)', '30 Pallets (45,000 Units)', '2026-08-28', 'RELEASED', 'COA-BAT-2026-0887.pdf', 'Marcus Vance'
          );
        `, [tid]);
            }
            console.log("✅ Seeded initial operational batch history records");
        }
        // 6. Seed operational records into public.batch_quality_records if empty
        const recordCountRes = await client.query(`SELECT COUNT(*)::int as count FROM public.batch_quality_records;`);
        console.log(`📊 Current batch_quality_records count: ${recordCountRes.rows[0].count}`);
        if (recordCountRes.rows[0].count === 0) {
            console.log("🌱 Seeding initial operational records into public.batch_quality_records...");
            for (const tid of tenantIds) {
                await client.query(`
          INSERT INTO public.batch_quality_records (
            tenant_id, record_id, batch, type, result, date, officer, details
          ) VALUES 
          (
            $1, 'REC-001', 'BAT-2026-0888', 'CCP Thermal Pasteurization Logs', 'PASS', '2026-08-30', 'Dr. Rachel Thorne', 'Measured 83.5°C continuous flow for 45 mins'
          ),
          (
            $1, 'REC-002', 'BAT-2026-0889', 'Digital Refractometer Brix Assay', 'PASS', '2026-08-30', 'Marcus Vance', 'Measured 11.85 °Bx (Target: 11.6 - 12.2 °Bx)'
          ),
          (
            $1, 'REC-003', 'BAT-2026-0890', 'Pre-Op Sanitation & Line Clearance', 'PASS', '2026-09-02', 'Dr. Rachel Thorne', 'All 6 checkpoints verified 100% clean, 0 ppm allergen'
          ),
          (
            $1, 'REC-004', 'BAT-2026-0890', 'Can Seam Overlap Tolerance Test', 'PASS', '2026-09-02', 'Marcus Vance', 'Double seam overlap 1.22mm (Min: 1.10mm)'
          ),
          (
            $1, 'REC-005', 'BAT-2026-0891', 'End-of-Line Metal Detector Audit', 'PASS', '2026-09-02', 'Dr. Rachel Thorne', 'Fe 2.0mm, Non-Fe 2.5mm, SS 3.0mm challenge wands passed'
          );
        `, [tid]);
            }
            console.log("✅ Seeded initial operational batch quality records");
        }
        console.log("🎉 Batch Quality database migration completed successfully!");
    }
    catch (error) {
        console.error("❌ Error running Batch Quality migration:", error);
        throw error;
    }
    finally {
        client.release();
    }
}
