import { pool } from "../config/database.js";

export async function runQaDispositionMigration() {
  const client = await pool.connect();
  try {
    console.log("🚀 Starting database migration for QA Disposition modules (Release, Rework, Reject, Downgrade)...");

    // 1. Create public.qa_disposition_records table IF NOT EXISTS
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.qa_disposition_records (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        plant_id UUID,
        disposition_type VARCHAR(50) NOT NULL,
        batch_id VARCHAR(100) NOT NULL,
        hold_id VARCHAR(100),
        lot_number VARCHAR(100),
        protocol VARCHAR(255),
        instruction_notes TEXT,
        status VARCHAR(50) DEFAULT 'COMPLETED',
        authorized_by VARCHAR(150) DEFAULT 'Dr. Rachel Thorne (QA Lead)',
        authorized_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_qa_disposition_tenant ON public.qa_disposition_records(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_qa_disposition_batch ON public.qa_disposition_records(batch_id);
    `);
    console.log("✅ Verified public.qa_disposition_records table");

    // Fetch existing tenants
    const tenantRows = await client.query(`SELECT id FROM public.tenants;`);
    const tenantIds: (string | null)[] = tenantRows.rows.map(r => r.id);
    if (!tenantIds.includes(null)) tenantIds.push(null);

    // 2. Ensure initial quarantine record exists in public.quality_holds for all tenants
    for (const tid of tenantIds) {
      const existingHold = await client.query(`
        SELECT id FROM public.quality_holds 
        WHERE (tenant_id = $1 OR ($1 IS NULL AND tenant_id IS NULL))
          AND (hold_id = 'BLK-101' OR batch = 'BAT-2026-0890')
        LIMIT 1;
      `, [tid]);

      if (existingHold.rows.length === 0) {
        console.log(`🌱 Seeding initial quarantine hold BLK-101 for tenant ${tid || 'null'} into public.quality_holds...`);
        await client.query(`
          INSERT INTO public.quality_holds (
            tenant_id, hold_id, batch, lot_number, reason, severity, status, held_by_name, date, hold_at
          ) VALUES (
            $1, 'BLK-101', 'BAT-2026-0890', 'LOT-ORG-442', 'CCP Pasteurizer temp excursion to 82.9°C (Minimum threshold: 83.1°C)', 'HIGH', 'HOLD', 'Maria Santos (QA Lead)', '2026-08-31', '2026-08-31 10:00:00'
          );
        `, [tid]);
      }
    }
    console.log("✅ Verified and ensured public.quality_holds has disposition candidates");

  } catch (err) {
    console.error("❌ QA Disposition migration failed:", err);
    throw err;
  } finally {
    client.release();
  }
}

if (process.argv[1] && process.argv[1].includes("migrate-qa-disposition")) {
  runQaDispositionMigration()
    .then(() => {
      console.log("Disposition migration finished.");
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
