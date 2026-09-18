"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMaintenanceMigration = runMaintenanceMigration;
const database_js_1 = require("../config/database.js");
async function runMaintenanceMigration() {
    const client = await database_js_1.pool.connect();
    try {
        console.log("🚀 Starting database migration for Maintenance modules (Assets, PM Schedules, Spare Parts, Notifications)...");
        // 1. Upgrade public.assets table with missing columns
        await client.query(`
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS asset_id VARCHAR(50);
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100);
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS line_name VARCHAR(255);
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS plant_name VARCHAR(255);
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS type VARCHAR(100);
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS criticality VARCHAR(100);
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS critical_level VARCHAR(50) DEFAULT 'CRITICAL_P1';
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS health_score INTEGER DEFAULT 95;
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS health_percent INTEGER DEFAULT 92;
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS rated_speed VARCHAR(100);
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS nameplate_power VARCHAR(50);
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS warranty_expiry VARCHAR(50);
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS operating_hours INTEGER;
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS location VARCHAR(100);
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS mtbf_hours NUMERIC(10, 2) DEFAULT 412.5;
      ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS mttr_hours NUMERIC(10, 2) DEFAULT 1.8;
      UPDATE public.assets SET asset_id = COALESCE(asset_id, asset_code, id::text) WHERE asset_id IS NULL;
      UPDATE public.assets SET serial_number = COALESCE(serial_number, asset_code) WHERE serial_number IS NULL;
    `);
        console.log("✅ Verified and upgraded public.assets table");
        // 2. Upgrade public.spare_parts
        await client.query(`
      ALTER TABLE public.spare_parts ADD COLUMN IF NOT EXISTS linked_assets JSONB DEFAULT '[]'::jsonb;
    `);
        console.log("✅ Verified public.spare_parts table");
        // 3. Upgrade public.notifications
        await client.query(`
      ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_role VARCHAR(50) DEFAULT 'ALL';
      UPDATE public.notifications SET target_role = 'ALL' WHERE target_role IS NULL;
    `);
        console.log("✅ Verified public.notifications table");
        // 4. Upgrade public.pm_schedules
        await client.query(`
      ALTER TABLE public.pm_schedules ADD COLUMN IF NOT EXISTS checklist_template JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE public.pm_schedules ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `);
        console.log("✅ Verified public.pm_schedules table");
        // 5. Upgrade public.work_orders
        await client.query(`
      ALTER TABLE public.work_orders ADD COLUMN IF NOT EXISTS estimated_hours NUMERIC(10, 2) DEFAULT 2.0;
      ALTER TABLE public.work_orders ADD COLUMN IF NOT EXISTS actual_hours NUMERIC(10, 2) DEFAULT 0.0;
    `);
        console.log("✅ Verified public.work_orders table");
        console.log("🎉 Maintenance DB Migration finished successfully!");
    }
    catch (err) {
        console.error("❌ Migration error in maintenance:", err.message);
        // Log but don't crash startup if already exists
    }
    finally {
        client.release();
    }
}
if (process.argv[1]?.includes("migrate-maintenance")) {
    runMaintenanceMigration()
        .then(() => process.exit(0))
        .catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
