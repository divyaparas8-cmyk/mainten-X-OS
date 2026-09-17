"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQualityEventsMigration = runQualityEventsMigration;
const database_js_1 = require("../config/database.js");
async function runQualityEventsMigration() {
    const client = await database_js_1.pool.connect();
    try {
        console.log("🚀 Starting database migration for Quality Events (Deviations, NCRs, Holds, Investigations)...");
        // 1. Upgrade public.deviations table (do NOT drop or recreate existing table)
        await client.query(`
      ALTER TABLE public.deviations ALTER COLUMN tenant_id DROP NOT NULL;
      ALTER TABLE public.deviations ALTER COLUMN plant_id DROP NOT NULL;
      ALTER TABLE public.deviations ALTER COLUMN reported_by DROP NOT NULL;
      ALTER TABLE public.deviations DROP CONSTRAINT IF EXISTS deviations_reported_by_users_id_fk;
      ALTER TABLE public.deviations DROP CONSTRAINT IF EXISTS deviations_plant_id_plants_id_fk;
      ALTER TABLE public.deviations DROP CONSTRAINT IF EXISTS deviations_tenant_id_tenants_id_fk;
      ALTER TABLE public.deviations ADD COLUMN IF NOT EXISTS hold_id VARCHAR(100);
      ALTER TABLE public.deviations ADD COLUMN IF NOT EXISTS reported_by_name VARCHAR(150);
      ALTER TABLE public.deviations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    `);
        console.log("✅ Verified and upgraded public.deviations table");
        // 2. Upgrade public.quality_holds table (do NOT drop or recreate existing table)
        await client.query(`
      ALTER TABLE public.quality_holds ALTER COLUMN tenant_id DROP NOT NULL;
      ALTER TABLE public.quality_holds ALTER COLUMN plant_id DROP NOT NULL;
      ALTER TABLE public.quality_holds ALTER COLUMN batch_id DROP NOT NULL;
      ALTER TABLE public.quality_holds ALTER COLUMN hold_by DROP NOT NULL;
      ALTER TABLE public.quality_holds DROP CONSTRAINT IF EXISTS quality_holds_hold_by_users_id_fk;
      ALTER TABLE public.quality_holds DROP CONSTRAINT IF EXISTS quality_holds_plant_id_plants_id_fk;
      ALTER TABLE public.quality_holds DROP CONSTRAINT IF EXISTS quality_holds_batch_id_batches_id_fk;
      ALTER TABLE public.quality_holds DROP CONSTRAINT IF EXISTS quality_holds_tenant_id_tenants_id_fk;
      ALTER TABLE public.quality_holds ADD COLUMN IF NOT EXISTS hold_id VARCHAR(100);
      ALTER TABLE public.quality_holds ADD COLUMN IF NOT EXISTS batch VARCHAR(100);
      ALTER TABLE public.quality_holds ADD COLUMN IF NOT EXISTS held_by_name VARCHAR(150);
      ALTER TABLE public.quality_holds ADD COLUMN IF NOT EXISTS notes TEXT;
      ALTER TABLE public.quality_holds ADD COLUMN IF NOT EXISTS date VARCHAR(50);
      ALTER TABLE public.quality_holds ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      ALTER TABLE public.quality_holds ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    `);
        console.log("✅ Verified and upgraded public.quality_holds table");
        // 3. Create public.ncrs table IF NOT EXISTS
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.ncrs (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        plant_id UUID,
        ncr_number VARCHAR(50) NOT NULL,
        part VARCHAR(255) NOT NULL,
        reason TEXT NOT NULL,
        severity VARCHAR(50) DEFAULT 'HIGH',
        status VARCHAR(50) DEFAULT 'PENDING QA REVIEW',
        disposition VARCHAR(100) DEFAULT 'QUARANTINED',
        reported_by VARCHAR(150) DEFAULT 'Dr. Rachel Evans',
        date VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_ncrs_tenant ON public.ncrs(tenant_id);
    `);
        console.log("✅ Verified public.ncrs table");
        // 4. Create public.quality_investigations table IF NOT EXISTS
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.quality_investigations (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        plant_id UUID,
        inv_number VARCHAR(50) NOT NULL,
        dev_id VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        finding TEXT DEFAULT '',
        action TEXT DEFAULT '',
        status VARCHAR(50) DEFAULT 'Pending',
        lead_investigator VARCHAR(150) DEFAULT 'Dr. Rachel Evans',
        target_date VARCHAR(50),
        root_cause_category VARCHAR(100) DEFAULT 'MECHANICAL',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_quality_investigations_tenant ON public.quality_investigations(tenant_id);
    `);
        console.log("✅ Verified public.quality_investigations table");
        // Fetch existing tenants
        const tenantRows = await client.query(`SELECT id FROM public.tenants;`);
        const tenantIds = tenantRows.rows.map(r => r.id);
        if (!tenantIds.includes(null))
            tenantIds.push(null);
        // 5. Seed deviations if table is empty
        const devCountRes = await client.query(`SELECT COUNT(*)::int as count FROM public.deviations;`);
        console.log(`📊 Current deviations count: ${devCountRes.rows[0].count}`);
        if (devCountRes.rows[0].count === 0) {
            console.log("🌱 Seeding initial operational records into public.deviations...");
            for (const tid of tenantIds) {
                await client.query(`
          INSERT INTO public.deviations (
            tenant_id, deviation_number, title, description, category, severity, status, hold_id, reported_by_name
          ) VALUES 
          (
            $1,
            'DEV-802',
            'Pasteurizer Heat Exchanger Thermal Excursion to 82.9°C',
            'Automated RTD sensor triggered low temperature excursion alert (target 83.1°C, recorded 82.9°C for 14 seconds) on Line 1 pasteurization infeed loop during high-speed run.',
            'THERMAL_PROCESS',
            'CRITICAL',
            'Under Investigation',
            'HLD-501',
            'Dr. Rachel Thorne'
          ),
          (
            $1,
            'DEV-803',
            'Double Seam Seamer B-04 Flange Thickness Variance',
            'Optical vision seam inspection detected 0.18mm flange variance exceeding upper tolerance limit (+0.12mm) during 330ml can run.',
            'PACKAGING_SEAM',
            'MAJOR',
            'Resolved & Closed',
            'HLD-502',
            'Arthur Sterling'
          );
        `, [tid]);
            }
            console.log("✅ Seeded initial operational deviations");
        }
        // 6. Seed quality_holds if table is empty
        const holdCountRes = await client.query(`SELECT COUNT(*)::int as count FROM public.quality_holds;`);
        console.log(`📊 Current quality_holds count: ${holdCountRes.rows[0].count}`);
        if (holdCountRes.rows[0].count === 0) {
            console.log("🌱 Seeding initial operational records into public.quality_holds...");
            for (const tid of tenantIds) {
                await client.query(`
          INSERT INTO public.quality_holds (
            tenant_id, hold_id, lot_number, batch, reason, severity, status, held_by_name, date
          ) VALUES 
          (
            $1,
            'HLD-501',
            'LOT-ORG-442',
            'BAT-2026-ORD2511',
            'Pasteurizer temp excursion below 83.1°C limit (linked to DEV-802)',
            'CRITICAL',
            'ACTIVE_HOLD',
            'Dr. Rachel Thorne (QA Lead)',
            '2026-09-02'
          ),
          (
            $1,
            'HLD-502',
            'LOT-CAN-981',
            'BAT-2026-ORD2509',
            'Flange width deformation on pallet 04 (linked to NCR-403)',
            'HIGH',
            'RELEASED',
            'Marcus Vance (Packaging Lead)',
            '2026-09-01'
          );
        `, [tid]);
            }
            console.log("✅ Seeded initial operational quality holds");
        }
        // 7. Seed ncrs if table is empty
        const ncrCountRes = await client.query(`SELECT COUNT(*)::int as count FROM public.ncrs;`);
        console.log(`📊 Current ncrs count: ${ncrCountRes.rows[0].count}`);
        if (ncrCountRes.rows[0].count === 0) {
            console.log("🌱 Seeding initial operational records into public.ncrs...");
            for (const tid of tenantIds) {
                await client.query(`
          INSERT INTO public.ncrs (
            tenant_id, ncr_number, part, reason, severity, status, disposition, reported_by, date
          ) VALUES 
          (
            $1,
            'NCR-402',
            'Aseptic Orange Caps (LOT-ORG-442)',
            'Plastic thread dimensions out-of-spec (0.2mm variance)',
            'CRITICAL',
            'PENDING QA REVIEW',
            'QUARANTINED',
            'Dr. Rachel Thorne',
            '2026-09-02'
          ),
          (
            $1,
            'NCR-403',
            'Aluminum End Cans 330ml (LOT-CAN-981)',
            'Flange width deformation on pallet 04',
            'HIGH',
            'REVIEWED',
            'RETURN_TO_VENDOR',
            'Marcus Vance',
            '2026-09-01'
          );
        `, [tid]);
            }
            console.log("✅ Seeded initial operational non-conformance reports");
        }
        // 8. Seed quality_investigations if table is empty
        const invCountRes = await client.query(`SELECT COUNT(*)::int as count FROM public.quality_investigations;`);
        console.log(`📊 Current quality_investigations count: ${invCountRes.rows[0].count}`);
        if (invCountRes.rows[0].count === 0) {
            console.log("🌱 Seeding initial operational records into public.quality_investigations...");
            for (const tid of tenantIds) {
                await client.query(`
          INSERT INTO public.quality_investigations (
            tenant_id, inv_number, dev_id, title, finding, action, status, lead_investigator, target_date, root_cause_category
          ) VALUES 
          (
            $1,
            'INV-901',
            'DEV-802',
            'Root Cause Investigation: Pasteurizer Thermal Excursion',
            'Valve actuator seal fatigue caused brief steam diversion (drop to 82.9°C for 14s)',
            'Preventative valve actuator rebuild & real-time telemetry threshold update',
            'In Progress',
            'Dr. Rachel Thorne',
            '2026-09-18',
            'MECHANICAL'
          );
        `, [tid]);
            }
            console.log("✅ Seeded initial operational investigations");
        }
        console.log("🎉 Quality Events database migration completed successfully!");
    }
    catch (error) {
        console.error("❌ Error running Quality Events migration:", error);
        throw error;
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=migrate-quality-events.js.map