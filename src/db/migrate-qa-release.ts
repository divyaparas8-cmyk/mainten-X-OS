import { pool } from "../config/database.js";

export async function runQaReleaseMigration() {
  const client = await pool.connect();
  try {
    console.log("🚀 Starting database migration for QA Release modules (Queue, Review, Approved, Blocked)...");

    // 1. Create public.qa_release_queue table IF NOT EXISTS
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.qa_release_queue (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        plant_id UUID,
        request_id VARCHAR(100) NOT NULL,
        batch_number VARCHAR(100) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        line_name VARCHAR(150) NOT NULL,
        ccp_status VARCHAR(100) DEFAULT '83.5°C (PASS)',
        brix_status VARCHAR(100) DEFAULT '11.9°Bx (OK)',
        allergen_check VARCHAR(100) DEFAULT 'Allergen Clear (0 ppm)',
        preop_check VARCHAR(100) DEFAULT 'PASSED (100% Clean)',
        open_deviations VARCHAR(100) DEFAULT '1 Open (DEV-802)',
        status VARCHAR(100) DEFAULT 'AWAITING QA SIGN-OFF',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_qa_release_queue_tenant ON public.qa_release_queue(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_qa_release_queue_batch ON public.qa_release_queue(batch_number);
    `);
    console.log("✅ Verified public.qa_release_queue table");

    // 2. Create public.qa_approved_releases table IF NOT EXISTS
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.qa_approved_releases (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        plant_id UUID,
        release_code VARCHAR(100) NOT NULL,
        batch_id VARCHAR(100) NOT NULL,
        recipe VARCHAR(255) NOT NULL,
        pallets VARCHAR(150) NOT NULL,
        approved_by VARCHAR(150) NOT NULL,
        release_date VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'APPROVED',
        coa_url VARCHAR(255) DEFAULT 'COA-BAT-2026-0888.pdf',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_qa_approved_releases_tenant ON public.qa_approved_releases(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_qa_approved_releases_batch ON public.qa_approved_releases(batch_id);
    `);
    console.log("✅ Verified public.qa_approved_releases table");

    // Fetch existing tenants
    const tenantRows = await client.query(`SELECT id FROM public.tenants;`);
    const tenantIds: (string | null)[] = tenantRows.rows.map(r => r.id);
    if (!tenantIds.includes(null)) tenantIds.push(null);

    // 3. Seed initial operational records into public.qa_release_queue if empty
    const queueCountRes = await client.query(`SELECT COUNT(*)::int as count FROM public.qa_release_queue;`);
    if (queueCountRes.rows[0].count === 0) {
      console.log("🌱 Seeding initial records into public.qa_release_queue...");
      for (const tid of tenantIds) {
        await client.query(`
          INSERT INTO public.qa_release_queue (
            tenant_id, request_id, batch_number, product_name, line_name, ccp_status, brix_status, allergen_check, preop_check, open_deviations, status
          ) VALUES
          (
            $1, 'REL-101', 'BAT-2026-0889', 'Organic Orange Juice 1L Bottle', 'Line 1 (Aseptic Bottling 580 BPM)', '83.5°C (PASS)', '11.9°Bx (OK)', 'Allergen Clear (0 ppm)', 'PASSED (100% Clean)', '1 Open (DEV-802)', 'AWAITING QA SIGN-OFF'
          ),
          (
            $1, 'REL-102', 'BAT-2026-0891', 'Cold Brew Espresso 330ml Can', 'Line 2 (High-Speed Canner)', 'IN SPEC', '12.4°Bx (OK)', 'Allergen Clear (0 ppm)', 'PASSED (100% Clean)', 'None', 'AWAITING QA SIGN-OFF'
          );
        `, [tid]);
      }
      console.log("✅ Initial records seeded into public.qa_release_queue");
    }

    // 4. Seed initial operational records into public.qa_approved_releases if empty
    const approvedCountRes = await client.query(`SELECT COUNT(*)::int as count FROM public.qa_approved_releases;`);
    if (approvedCountRes.rows[0].count === 0) {
      console.log("🌱 Seeding initial records into public.qa_approved_releases...");
      for (const tid of tenantIds) {
        await client.query(`
          INSERT INTO public.qa_approved_releases (
            tenant_id, release_code, batch_id, recipe, pallets, approved_by, release_date, status, coa_url
          ) VALUES
          (
            $1, 'REL-201', 'BAT-2026-0888', 'Organic Orange Juice 1L Bottle', '24 Pallets (28,800 Units)', 'Maria Santos (QA Lead)', '2026-08-30', 'APPROVED', 'COA-BAT-2026-0888.pdf'
          ),
          (
            $1, 'REL-202', 'BAT-2026-0889', 'Organic Orange Juice 500ml Bottle', '18 Pallets (32,400 Units)', 'Maria Santos (QA Lead)', '2026-08-30', 'APPROVED', 'COA-BAT-2026-0889.pdf'
          );
        `, [tid]);
      }
      console.log("✅ Initial records seeded into public.qa_approved_releases");
    }

    // 5. Check and seed public.quality_holds for BLK-101 / BAT-2026-0890 if missing
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
    console.log("✅ Verified and seeded public.quality_holds");

  } catch (err) {
    console.error("❌ QA Release migration failed:", err);
    throw err;
  } finally {
    client.release();
  }
}

if (process.argv[1] && process.argv[1].includes("migrate-qa-release")) {
  runQaReleaseMigration()
    .then(() => {
      console.log("Migration finished.");
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
