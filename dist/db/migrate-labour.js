"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateLabourAndSanitation = migrateLabourAndSanitation;
const database_js_1 = require("../config/database.js");
async function migrateLabourAndSanitation() {
    console.log("🚀 Running migration for labour_standards, sanitation_classes, and allergen_rules...");
    const client = await database_js_1.pool.connect();
    try {
        await client.query("BEGIN");
        // 1. labour_standards table
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.labour_standards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        standard_id VARCHAR(50),
        line_id VARCHAR(50),
        line_name VARCHAR(255),
        standard_crew INTEGER DEFAULT 8,
        std_labor_hours_per_1k_units NUMERIC DEFAULT 2.0,
        direct_cost_per_hour VARCHAR(50) DEFAULT '$25.00',
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE UNIQUE INDEX IF NOT EXISTS idx_labour_standards_standard_id ON public.labour_standards(standard_id);
      CREATE INDEX IF NOT EXISTS idx_labour_standards_line_id ON public.labour_standards(line_id);
    `);
        // 2. sanitation_classes table
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.sanitation_classes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        class_id VARCHAR(50),
        sanitation_id VARCHAR(50),
        code VARCHAR(50),
        name VARCHAR(255),
        sanitation_class VARCHAR(255),
        description TEXT,
        duration_min INTEGER DEFAULT 45,
        wash_duration_min INTEGER DEFAULT 45,
        cleaning_method VARCHAR(255),
        cleaning_level VARCHAR(100),
        risk_level VARCHAR(100),
        applicable_products TEXT,
        chemical_agent VARCHAR(255),
        validation_method VARCHAR(255),
        frequency VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE UNIQUE INDEX IF NOT EXISTS idx_sanitation_classes_class_id ON public.sanitation_classes(class_id);
      CREATE INDEX IF NOT EXISTS idx_sanitation_classes_sanitation_id ON public.sanitation_classes(sanitation_id);
    `);
        // 3. allergen_rules table
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.allergen_rules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rule_id VARCHAR(50),
        allergen_id VARCHAR(50),
        allergen_type VARCHAR(100),
        allergen_name VARCHAR(255),
        sku_id VARCHAR(50),
        sku_code VARCHAR(50),
        risk_level VARCHAR(100),
        cleaning_protocol TEXT,
        protocol TEXT,
        changeover_restriction TEXT,
        verification_test VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE UNIQUE INDEX IF NOT EXISTS idx_allergen_rules_rule_id ON public.allergen_rules(rule_id);
      CREATE INDEX IF NOT EXISTS idx_allergen_rules_sku_code ON public.allergen_rules(sku_code);
    `);
        await client.query("COMMIT");
        console.log("✅ Tables and indexes for labour_standards, sanitation_classes, and allergen_rules verified!");
    }
    catch (err) {
        await client.query("ROLLBACK");
        console.error("❌ Migration error:", err);
        throw err;
    }
    finally {
        client.release();
    }
}
if (process.argv[1]?.includes("migrate-labour")) {
    migrateLabourAndSanitation()
        .then(() => process.exit(0))
        .catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
//# sourceMappingURL=migrate-labour.js.map