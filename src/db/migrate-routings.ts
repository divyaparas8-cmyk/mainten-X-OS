import { pool } from "../config/database.js";

async function runMigration() {
  console.log("🚀 Starting database migration for routings & routing_steps...");
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "routings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "tenant_id" uuid NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
        "plant_id" uuid REFERENCES "plants"("id") ON DELETE SET NULL,
        "routing_code" varchar(100) NOT NULL,
        "sku_id" uuid NOT NULL REFERENCES "skus"("id") ON DELETE CASCADE,
        "line_id" uuid REFERENCES "production_lines"("id") ON DELETE SET NULL,
        "revision" varchar(50) DEFAULT 'R1' NOT NULL,
        "approval_status" varchar(50) DEFAULT 'Approved' NOT NULL,
        "status" varchar(50) DEFAULT 'Active' NOT NULL,
        "std_run_rate_bph" integer DEFAULT 12000 NOT NULL,
        "setup_duration_min" integer DEFAULT 45 NOT NULL,
        "expected_yield_pct" numeric(5, 2) DEFAULT '98.50' NOT NULL,
        "effective_from" timestamp,
        "effective_to" timestamp,
        "notes" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "routing_steps" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "routing_id" uuid NOT NULL REFERENCES "routings"("id") ON DELETE CASCADE,
        "sequence" integer DEFAULT 10 NOT NULL,
        "operation_code" varchar(100) NOT NULL,
        "operation_name" varchar(255) NOT NULL,
        "work_center_id" uuid REFERENCES "work_centers"("id") ON DELETE SET NULL,
        "std_duration_min" numeric(10, 2) DEFAULT '15.00',
        "setup_duration_min" numeric(10, 2) DEFAULT '10.00',
        "crew_size" integer DEFAULT 2,
        "is_quality_gate" boolean DEFAULT false NOT NULL,
        "instructions" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );

      CREATE INDEX IF NOT EXISTS "idx_routings_tenant_sku" ON "routings"("tenant_id", "sku_id");
      CREATE INDEX IF NOT EXISTS "idx_routings_tenant_line" ON "routings"("tenant_id", "line_id");
      CREATE INDEX IF NOT EXISTS "idx_routing_steps_routing_id" ON "routing_steps"("routing_id");
      CREATE INDEX IF NOT EXISTS "idx_routing_steps_sequence" ON "routing_steps"("routing_id", "sequence");
    `);

    console.log("✅ Successfully created tables 'routings', 'routing_steps' and their indexes in PostgreSQL!");
  } catch (error) {
    console.error("❌ Error running migration:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
