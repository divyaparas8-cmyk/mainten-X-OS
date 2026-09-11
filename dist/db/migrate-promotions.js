"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
async function runMigration() {
    console.log("🚀 Starting database migration for promotion_campaigns...");
    try {
        await database_js_1.pool.query(`
      CREATE TABLE IF NOT EXISTS "promotion_campaigns" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "plant_id" uuid NOT NULL REFERENCES "plants"("id") ON DELETE CASCADE,
        "name" varchar(255) NOT NULL,
        "sku_id" uuid NOT NULL REFERENCES "skus"("id") ON DELETE RESTRICT,
        "uplift_percent" numeric(5, 2) NOT NULL,
        "incremental_units" numeric(14, 2) DEFAULT 0.00,
        "start_date" timestamp NOT NULL,
        "end_date" timestamp NOT NULL,
        "channel" varchar(100) DEFAULT 'Wholesale Club Flyer',
        "status" varchar(50) DEFAULT 'SCHEDULED' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS "idx_promotions_tenant_plant" ON "promotion_campaigns"("tenant_id", "plant_id");
      CREATE INDEX IF NOT EXISTS "idx_promotions_sku" ON "promotion_campaigns"("sku_id");
    `);
        console.log("✅ Successfully created table 'promotion_campaigns' and indexes in PostgreSQL!");
    }
    catch (error) {
        console.error("❌ Error running migration for promotion_campaigns:", error);
        process.exit(1);
    }
    finally {
        await database_js_1.pool.end();
    }
}
runMigration();
//# sourceMappingURL=migrate-promotions.js.map