import { pool } from "./config/database.js";

export async function migrateMasterAdmin() {
  console.log("=== [MIGRATION] Starting Master Admin Database Migration ===");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Audit Logs adjustment: allow null tenant_id for platform-level Super Admin activities
    console.log("Adjusting audit_logs table for platform-wide actions...");
    await client.query(`
      ALTER TABLE audit_logs ALTER COLUMN tenant_id DROP NOT NULL;
    `);

    // 2. Plans Table
    console.log("Creating 'plans' table if not exists...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS plans (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subtitle TEXT,
        price_monthly NUMERIC(12, 2) NOT NULL DEFAULT 0,
        price_annual NUMERIC(12, 2) NOT NULL DEFAULT 0,
        currency VARCHAR(10) NOT NULL DEFAULT 'CAD',
        duration VARCHAR(50) NOT NULL DEFAULT 'Unlimited',
        user_limit INTEGER NOT NULL DEFAULT 10,
        access_level VARCHAR(50) NOT NULL DEFAULT 'Standard',
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        is_popular BOOLEAN NOT NULL DEFAULT false,
        cta_text VARCHAR(100) NOT NULL DEFAULT 'Choose Plan',
        modules JSONB NOT NULL DEFAULT '[]'::jsonb,
        features JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_plans_status ON plans(status);
    `);

    // 3. Support Tickets Table
    console.log("Creating 'support_tickets' table if not exists...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
        company_name VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'Open',
        priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
        assigned_to VARCHAR(255),
        resolution TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_tickets_tenant ON support_tickets(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
      CREATE INDEX IF NOT EXISTS idx_tickets_priority ON support_tickets(priority);
    `);

    // 4. Platform Settings Table
    console.log("Creating 'platform_settings' table if not exists...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS platform_settings (
        id VARCHAR(100) PRIMARY KEY DEFAULT 'global',
        platform_name VARCHAR(255) NOT NULL DEFAULT 'MaintenX-OS',
        support_email VARCHAR(255) NOT NULL DEFAULT 'support@maintenx.com',
        require_2fa BOOLEAN NOT NULL DEFAULT true,
        enforce_strong_passwords BOOLEAN NOT NULL DEFAULT true,
        log_all_ips BOOLEAN NOT NULL DEFAULT true,
        maintenance_mode BOOLEAN NOT NULL DEFAULT false,
        maintenance_message TEXT,
        default_currency VARCHAR(10) NOT NULL DEFAULT 'CAD',
        smtp_config JSONB DEFAULT '{}'::jsonb,
        branding JSONB DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // 5. Tenant Modules Table
    console.log("Creating 'tenant_modules' table if not exists...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenant_modules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        module_key VARCHAR(100) NOT NULL,
        is_enabled BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT tenant_module_unique UNIQUE (tenant_id, module_key)
      );
      CREATE INDEX IF NOT EXISTS idx_tenant_modules_tenant ON tenant_modules(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_tenant_modules_key ON tenant_modules(module_key);
    `);

    // Seed default plans if empty
    const { rows: planRows } = await client.query("SELECT COUNT(*) as count FROM plans");
    if (parseInt(planRows[0].count, 10) === 0) {
      console.log("Seeding canonical Master Admin pricing plans...");
      await client.query(`
        INSERT INTO plans (id, name, subtitle, price_monthly, price_annual, currency, duration, user_limit, access_level, status, is_popular, cta_text, modules, features)
        VALUES
        (
          'plant-pilot',
          'Plant Pilot',
          'Free 7-Day Evaluation',
          0,
          0,
          'CAD',
          '7 Days',
          5,
          'Trial',
          'Active',
          false,
          'Start Free Pilot',
          '["produce"]'::jsonb,
          '["1 Packaging or Bottling Line", "Operator HMI Touchscreen Console", "Micro-Stop & Downtime Logging", "Standard Shift OEE Metrics", "Community Knowledge Base"]'::jsonb
        ),
        (
          'individual-modules',
          'Individual Modules',
          'Single Dedicated Line',
          1499,
          14990,
          'CAD',
          'Unlimited',
          10,
          'Standard',
          'Active',
          false,
          'Choose Modules',
          '["produce", "verify"]'::jsonb,
          '["Everything in Plant Pilot", "OPC-UA & MQTT SCADA Ingest", "Inline CCP Quality Gate Validation", "PM Checklist & Work Order Dispatch", "10 Concurrent Operator Logins"]'::jsonb
        ),
        (
          'bundles',
          'Bundles',
          'Full Multi-Line Bottling Plant',
          3499,
          34990,
          'CAD',
          'Unlimited',
          50,
          'Advanced',
          'Active',
          true,
          'Launch Bundles',
          '["plan", "produce", "verify", "maintain", "move"]'::jsonb,
          '["Everything in Individual Modules", "Unlimited Production & Packaging Lines", "Dynamic APS Capacity Scheduler", "Governed AI Shift Recovery & Bottlenecks", "Spare Parts & Lot Traceability", "Dedicated 24/7 Support Engineer"]'::jsonb
        ),
        (
          'maintenx-complete',
          'MaintenX OS Complete',
          'Multi-Facility Corporate Cloud',
          5499,
          54990,
          'CAD',
          'Unlimited',
          999,
          'Full',
          'Active',
          false,
          'Contact Enterprise',
          '["plan", "produce", "verify", "maintain", "move", "people", "improve", "intelligence"]'::jsonb,
          '["Multi-Plant Executive Portfolio", "21 CFR Part 11 Electronic Signatures", "Custom ERP & MES API Connectors", "On-Premises or Sovereign Private Cloud", "99.99% Guaranteed Availability SLA"]'::jsonb
        )
      `);
    }

    // Seed default platform settings if not exists
    const { rows: settingsRows } = await client.query("SELECT COUNT(*) as count FROM platform_settings WHERE id = 'global'");
    if (parseInt(settingsRows[0].count, 10) === 0) {
      console.log("Seeding default global platform settings...");
      await client.query(`
        INSERT INTO platform_settings (id, platform_name, support_email, require_2fa, enforce_strong_passwords, log_all_ips, maintenance_mode, maintenance_message, default_currency, smtp_config, branding)
        VALUES (
          'global',
          'MaintenX-OS',
          'support@maintenx.com',
          true,
          true,
          true,
          false,
          'Scheduled maintenance in progress. Please check back shortly.',
          'CAD',
          '{"host": "smtp.maintenx.com", "port": 587, "secure": false, "user": "notifications@maintenx.com"}'::jsonb,
          '{"logo": "/maintenx-logo.svg", "copyright": "© 2026 MaintenX OS. All rights reserved."}'::jsonb
        )
      `);
    }

    // Seed module entitlements for existing tenants if not present
    const { rows: tenantList } = await client.query("SELECT id, name FROM tenants");
    const coreModules = ["plan", "produce", "verify", "maintain", "move", "people", "improve", "intelligence"];
    
    for (const t of tenantList) {
      for (const m of coreModules) {
        await client.query(`
          INSERT INTO tenant_modules (tenant_id, module_key, is_enabled)
          VALUES ($1, $2, true)
          ON CONFLICT (tenant_id, module_key) DO NOTHING
        `, [t.id, m]);
      }
    }

    // Seed initial support tickets if table is empty
    const { rows: ticketRows } = await client.query("SELECT COUNT(*) as count FROM support_tickets");
    if (parseInt(ticketRows[0].count, 10) === 0 && tenantList.length > 0) {
      console.log("Seeding initial support tickets...");
      const primaryTenant = tenantList[0];
      await client.query(`
        INSERT INTO support_tickets (id, tenant_id, company_name, subject, description, status, priority, assigned_to)
        VALUES
        ('TKT-1042', $1, $2, 'Cannot access CI module from plant 2', 'Operator stations in packaging cannot view RCA board.', 'Open', 'High', 'Elena Vance'),
        ('TKT-1043', $1, $2, 'Billing cycle adjustment request', 'Requesting annual billing switch from monthly.', 'In Progress', 'Medium', 'Elena Vance'),
        ('TKT-1044', $1, $2, 'Inquiry on additional plant licenses', 'Planning third manufacturing facility expansion.', 'Resolved', 'Low', 'Elena Vance')
      `, [primaryTenant.id, primaryTenant.name]);
    }

    await client.query("COMMIT");
    console.log("✅ [MIGRATION] Master Admin Database Migration completed successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ [MIGRATION FAILED] Master Admin migration error:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Run directly if called as a script
if (process.argv[1]?.includes("migrate-master-admin")) {
  migrateMasterAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
