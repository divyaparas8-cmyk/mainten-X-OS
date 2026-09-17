"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQaGovernanceMigration = runQaGovernanceMigration;
const database_js_1 = require("../config/database.js");
async function runQaGovernanceMigration() {
    const client = await database_js_1.pool.connect();
    try {
        console.log("🚀 Starting database migration for QA Governance (CAPA, Audit Trail, Reports, Notifications, Profile)...");
        // 1. Upgrade public.capa_records table (do NOT drop or recreate existing table)
        await client.query(`
      ALTER TABLE public.capa_records ALTER COLUMN tenant_id DROP NOT NULL;
      ALTER TABLE public.capa_records ALTER COLUMN plant_id DROP NOT NULL;
      ALTER TABLE public.capa_records ALTER COLUMN assigned_to DROP NOT NULL;
      ALTER TABLE public.capa_records ALTER COLUMN target_completion_date DROP NOT NULL;
      ALTER TABLE public.capa_records DROP CONSTRAINT IF EXISTS capa_records_assigned_to_users_id_fk;
      ALTER TABLE public.capa_records DROP CONSTRAINT IF EXISTS capa_records_plant_id_plants_id_fk;
      ALTER TABLE public.capa_records DROP CONSTRAINT IF EXISTS capa_records_tenant_id_tenants_id_fk;
      ALTER TABLE public.capa_records ADD COLUMN IF NOT EXISTS inv_id VARCHAR(100);
      ALTER TABLE public.capa_records ADD COLUMN IF NOT EXISTS deviation_id VARCHAR(100);
      ALTER TABLE public.capa_records ADD COLUMN IF NOT EXISTS root_cause TEXT;
      ALTER TABLE public.capa_records ADD COLUMN IF NOT EXISTS assigned_to_name VARCHAR(150) DEFAULT 'Dr. Rachel Thorne';
      ALTER TABLE public.capa_records ADD COLUMN IF NOT EXISTS effectiveness_rate VARCHAR(50) DEFAULT '98.5%';
      ALTER TABLE public.capa_records ADD COLUMN IF NOT EXISTS target_date VARCHAR(50);
      ALTER TABLE public.capa_records ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    `);
        console.log("✅ Verified and upgraded public.capa_records table");
        // 2. Create public.qa_audit_trail table IF NOT EXISTS
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.qa_audit_trail (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        plant_id UUID,
        event_code VARCHAR(100) NOT NULL,
        user_name VARCHAR(150) NOT NULL,
        action_text TEXT NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id VARCHAR(100) NOT NULL,
        timestamp_str VARCHAR(100) NOT NULL,
        ip_address VARCHAR(100) DEFAULT '192.168.1.104',
        verified BOOLEAN DEFAULT TRUE,
        hash_sha256 VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_qa_audit_tenant ON public.qa_audit_trail(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_qa_audit_entity ON public.qa_audit_trail(entity_id);
    `);
        console.log("✅ Verified public.qa_audit_trail table");
        // 3. Create public.qa_reports table IF NOT EXISTS
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.qa_reports (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        plant_id UUID,
        report_code VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        date_str VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        format VARCHAR(50) DEFAULT 'PDF / CSV',
        status VARCHAR(50) DEFAULT 'READY',
        records_count INT DEFAULT 0,
        generated_by VARCHAR(150) DEFAULT 'System (Automated Daily)',
        download_url VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_qa_reports_tenant ON public.qa_reports(tenant_id);
    `);
        console.log("✅ Verified public.qa_reports table");
        // 4. Create public.qa_notifications table IF NOT EXISTS
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.qa_notifications (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        plant_id UUID,
        notif_code VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        msg TEXT NOT NULL,
        time_str VARCHAR(100) NOT NULL,
        path VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'primary',
        badge VARCHAR(50) DEFAULT 'INFO',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_qa_notif_tenant ON public.qa_notifications(tenant_id);
    `);
        console.log("✅ Verified public.qa_notifications table");
        // 5. Create public.qa_profiles and public.qa_certifications tables IF NOT EXISTS
        await client.query(`
      CREATE TABLE IF NOT EXISTS public.qa_profiles (
        id SERIAL PRIMARY KEY,
        tenant_id UUID UNIQUE,
        name VARCHAR(150) DEFAULT 'Dr. Rachel Thorne',
        role VARCHAR(150) DEFAULT 'Quality Assurance Lead',
        badge_title VARCHAR(150) DEFAULT 'QA SIGNATORY AUTHORITY',
        sub_badge VARCHAR(150) DEFAULT 'CCP AUDITOR',
        initials VARCHAR(10) DEFAULT 'RT',
        signature_pin VARCHAR(100) DEFAULT '9482',
        batches_reviewed INT DEFAULT 142,
        holds_issued INT DEFAULT 3,
        approved_releases INT DEFAULT 139,
        compliance_rating VARCHAR(50) DEFAULT '99.4%',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.qa_certifications (
        id SERIAL PRIMARY KEY,
        tenant_id UUID,
        profile_id INT REFERENCES public.qa_profiles(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        issuer VARCHAR(255) NOT NULL,
        valid_until VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_qa_cert_tenant ON public.qa_certifications(tenant_id);
    `);
        console.log("✅ Verified public.qa_profiles and public.qa_certifications tables");
        // Fetch existing tenants
        const tenantRows = await client.query(`SELECT id FROM public.tenants;`);
        const tenantIds = tenantRows.rows.map(r => r.id);
        if (!tenantIds.includes(null))
            tenantIds.push(null);
        // 6. Seed initial CAPA records if empty
        for (const tid of tenantIds) {
            const capaCount = await client.query(`
        SELECT COUNT(*)::int as count FROM public.capa_records 
        WHERE (tenant_id = $1 OR ($1 IS NULL AND tenant_id IS NULL));
      `, [tid]);
            if (capaCount.rows[0].count === 0) {
                console.log(`🌱 Seeding initial CAPA records for tenant ${tid || 'null'}...`);
                await client.query(`
          INSERT INTO public.capa_records (
            tenant_id, capa_number, title, inv_id, deviation_id, root_cause, corrective_action, preventive_action, status, assigned_to_name, target_date, effectiveness_rate
          ) VALUES 
          ($1, 'CAPA-2026-011', 'Thermal Probe Sensor Drift Calibration Protocol', 'INV-001', 'DEV-101', 'Recalibration drift on RTD heat probe in HTST plate pasteurizer.', 'Replaced defective thermal probe sensor and re-tested flow loop.', 'Instituted bi-weekly multi-point probe calibration cadence and automated drift alerting.', 'ACTIVE_MONITORING', 'Dr. Rachel Thorne', '2026-09-15', '98.5%'),
          ($1, 'CAPA-2026-012', 'Secondary Pneumatic Seal Pressure Stabilization', 'INV-002', 'DEV-102', 'Secondary seal vacuum pressure dropped below 2.4 bar during sealing run.', 'Exchanged pneumatic vacuum diaphragm and tightened manifold couplers.', 'Added pre-op pneumatic air pressure verification to standard sanitation SOP.', 'RESOLVED', 'Marcus Vance', '2026-08-28', '100%');
        `, [tid]);
            }
        }
        // 7. Seed initial Audit Trail events if empty
        for (const tid of tenantIds) {
            const auditCount = await client.query(`
        SELECT COUNT(*)::int as count FROM public.qa_audit_trail 
        WHERE (tenant_id = $1 OR ($1 IS NULL AND tenant_id IS NULL));
      `, [tid]);
            if (auditCount.rows[0].count === 0) {
                console.log(`🌱 Seeding initial QA Audit Trail records for tenant ${tid || 'null'}...`);
                await client.query(`
          INSERT INTO public.qa_audit_trail (
            tenant_id, event_code, user_name, action_text, entity_type, entity_id, timestamp_str, ip_address, verified, hash_sha256
          ) VALUES 
          ($1, 'AUD-9901', 'Maria Santos (QA Lead)', 'Blocked Batch BAT-2026-0890 — CCP excursion', 'BATCH_HOLD', 'BAT-2026-0890', '2026-08-31 14:32:18', '192.168.1.104', true, 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
          ($1, 'AUD-9902', 'Maria Santos (QA Lead)', 'Approved Release BAT-2026-0888 (21 CFR Part 11 Sign-Off)', 'BATCH_RELEASE', 'BAT-2026-0888', '2026-08-31 12:10:44', '192.168.1.104', true, 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'),
          ($1, 'AUD-9903', 'Maria Santos (QA Lead)', 'Signed Pre-Op Line Clearance Checklist Line 1', 'LINE_CLEARANCE', 'LINE-1', '2026-08-31 07:45:00', '192.168.1.104', true, 'sha256:6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'),
          ($1, 'AUD-9904', 'Dr. Rachel Thorne (QA Lead)', 'Authorized Batch Disposition (Scrap Lot HLD-401)', 'DISPOSITION', 'HLD-401', '2026-08-30 16:22:15', '192.168.1.112', true, 'sha256:d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35'),
          ($1, 'AUD-9905', 'Dr. Rachel Thorne (QA Lead)', 'Approved Investigation INV-001 Finding & Root Cause', 'INVESTIGATION', 'INV-001', '2026-08-30 11:15:30', '192.168.1.112', true, 'sha256:4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce');
        `, [tid]);
            }
        }
        // 8. Seed initial QA Reports if empty
        for (const tid of tenantIds) {
            const reportCount = await client.query(`
        SELECT COUNT(*)::int as count FROM public.qa_reports 
        WHERE (tenant_id = $1 OR ($1 IS NULL AND tenant_id IS NULL));
      `, [tid]);
            if (reportCount.rows[0].count === 0) {
                console.log(`🌱 Seeding initial QA Reports for tenant ${tid || 'null'}...`);
                await client.query(`
          INSERT INTO public.qa_reports (
            tenant_id, report_code, name, date_str, category, format, status, records_count, generated_by
          ) VALUES 
          ($1, 'REP-001', 'CCP Pasteurizer Temperature Log & Excursion Audit', '2026-08-31', 'CRITICAL_CONTROL_POINTS', 'PDF / CSV', 'READY', 142, 'System (Automated Daily)'),
          ($1, 'REP-002', 'Batch Release & Reject Summary Report (Monthly)', '2026-08-31', 'BATCH_RELEASE', 'PDF / Excel', 'READY', 88, 'Maria Santos'),
          ($1, 'REP-003', 'Quality Events, NCRs & Deviations Dossier', '2026-08-31', 'EVENTS_NCR', 'PDF / CSV', 'READY', 26, 'Dr. Rachel Thorne'),
          ($1, 'REP-004', 'Sanitation CIP & Environmental Swab Compliance Log', '2026-08-30', 'SANITATION_CIP', 'PDF / CSV', 'READY', 54, 'Sanitation Lead');
        `, [tid]);
            }
        }
        // 9. Seed initial QA Notifications if empty
        for (const tid of tenantIds) {
            const notifCount = await client.query(`
        SELECT COUNT(*)::int as count FROM public.qa_notifications 
        WHERE (tenant_id = $1 OR ($1 IS NULL AND tenant_id IS NULL));
      `, [tid]);
            if (notifCount.rows[0].count === 0) {
                console.log(`🌱 Seeding initial QA Notifications for tenant ${tid || 'null'}...`);
                await client.query(`
          INSERT INTO public.qa_notifications (
            tenant_id, notif_code, title, msg, time_str, path, type, badge, is_read
          ) VALUES 
          ($1, 'NOTIF-01', 'CCP Excursion Alert', 'Pasteurizer HTST temp dropped to 82.9°C on Line 1. Batch BAT-2026-0890 placed on HOLD.', '2 min ago', '/quality/events/holds', 'danger', 'CRITICAL', false),
          ($1, 'NOTIF-02', 'Batch Ready for QA Release', 'Batch BAT-2026-0888 is awaiting human QA sign-off before dispatch.', '1 hour ago', '/quality/release/queue', 'primary', 'RELEASE', false),
          ($1, 'NOTIF-03', 'Investigation Finding Recorded', 'Dr. Rachel Thorne submitted root cause findings for thermal probe drift.', '3 hours ago', '/quality/rca-capa', 'primary', 'INVESTIGATION', true);
        `, [tid]);
            }
        }
        // 10. Seed initial QA Profile & Certifications if empty
        for (const tid of tenantIds) {
            if (!tid)
                continue;
            const profileRes = await client.query(`
        SELECT id FROM public.qa_profiles WHERE tenant_id = $1;
      `, [tid]);
            let profileId;
            if (profileRes.rows.length === 0) {
                console.log(`🌱 Seeding initial QA Profile for tenant ${tid}...`);
                const insertRes = await client.query(`
          INSERT INTO public.qa_profiles (
            tenant_id, name, role, badge_title, sub_badge, initials, signature_pin, batches_reviewed, holds_issued, approved_releases, compliance_rating
          ) VALUES (
            $1, 'Dr. Rachel Thorne', 'Quality Assurance Lead', 'QA SIGNATORY AUTHORITY', 'CCP AUDITOR', 'RT', '9482', 142, 3, 139, '99.4%'
          ) RETURNING id;
        `, [tid]);
                profileId = insertRes.rows[0].id;
            }
            else {
                profileId = profileRes.rows[0].id;
            }
            const certCount = await client.query(`
        SELECT COUNT(*)::int as count FROM public.qa_certifications WHERE tenant_id = $1;
      `, [tid]);
            if (certCount.rows[0].count === 0) {
                console.log(`🌱 Seeding initial QA Certifications for tenant ${tid}...`);
                await client.query(`
          INSERT INTO public.qa_certifications (
            tenant_id, profile_id, name, issuer, valid_until, status
          ) VALUES 
          ($1, $2, 'HACCP Lead Auditor Certification', 'SQF / GFSI', '2027-12-31', 'ACTIVE'),
          ($1, $2, 'ISO 22000 Food Safety Management Lead', 'ISO Global', '2027-08-15', 'ACTIVE'),
          ($1, $2, 'SQF Practitioner Level 3 (High-Risk Processing)', 'Safe Quality Food Institute', '2028-03-30', 'ACTIVE'),
          ($1, $2, '21 CFR Part 11 Electronic Signatures Certified', 'FDA Regulatory Compliance', '2026-11-20', 'ACTIVE');
        `, [tid, profileId]);
            }
        }
        console.log("🎉 All QA Governance tables and seeding completed successfully.");
    }
    catch (err) {
        console.error("❌ QA Governance migration failed:", err);
        throw err;
    }
    finally {
        client.release();
    }
}
