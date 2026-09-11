import { pool } from "../config/database.js";

async function runMigration() {
  console.log("🚀 Starting database migration for changeover_rules...");
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.changeover_rules (
        id VARCHAR(64) PRIMARY KEY,
        matrix_id VARCHAR(64),
        from_sku_id VARCHAR(64),
        from_sku_code VARCHAR(64),
        from_family VARCHAR(128),
        to_sku_id VARCHAR(64),
        to_sku_code VARCHAR(64),
        to_family VARCHAR(128),
        changeover_duration_min INTEGER DEFAULT 30,
        sanitation_class VARCHAR(255),
        allergen_cleaning_required BOOLEAN DEFAULT FALSE,
        notes TEXT,
        status VARCHAR(32) DEFAULT 'Active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_changeover_matrix_id ON public.changeover_rules(matrix_id);
      CREATE INDEX IF NOT EXISTS idx_changeover_from_sku ON public.changeover_rules(from_sku_code);
      CREATE INDEX IF NOT EXISTS idx_changeover_to_sku ON public.changeover_rules(to_sku_code);
    `);

    // Seed default records if table is empty
    const { rows } = await pool.query(`SELECT COUNT(*)::int as count FROM public.changeover_rules;`);
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO public.changeover_rules (
          id, matrix_id, from_sku_id, from_sku_code, from_family, to_sku_id, to_sku_code, to_family,
          changeover_duration_min, sanitation_class, allergen_cleaning_required, notes, status
        ) VALUES 
        (
          'CO-01', 'CO-01', 'SKU-001', 'SKU-5001', 'Sparkling Flavors', 'SKU-001', 'SKU-5001', 'Sparkling Flavors',
          0, 'None (Same SKU Continuous)', false, 'No changeover downtime required for identical formulation batch continuation.', 'Active'
        ),
        (
          'CO-02', 'CO-02', 'SKU-001', 'SKU-5001', 'Sparkling Flavors', 'SKU-002', 'SKU-5002', 'Tonics & Mixers',
          45, 'Class B - Warm Water Flush & Syrup Line Rinse', false, 'Requires syrup manifold rinse and bottle capper starwheel size change from 500ml to 1L.', 'Active'
        ),
        (
          'CO-03', 'CO-03', 'SKU-001', 'SKU-5001', 'Sparkling Flavors', 'SKU-004', 'SKU-5004', 'Energy Drinks',
          60, 'Class A - Full CIP Sterilization', true, 'Mandatory deep CIP due to caffeine and high-taurine flavor carryover risk.', 'Active'
        );
      `);
      console.log("🌱 Seeded standard transition rules into public.changeover_rules!");
    }

    console.log("✅ Successfully created and verified table 'public.changeover_rules' in PostgreSQL!");
  } catch (error) {
    console.error("❌ Error running migration:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
