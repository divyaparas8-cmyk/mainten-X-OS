import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres:root@localhost:5432/maintenxos",
});

async function setup() {
  try {
    console.log("Setting up approval_rules table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS approval_rules (
        id VARCHAR(50) PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        event VARCHAR(255) NOT NULL,
        tier VARCHAR(100) NOT NULL,
        authorized_roles VARCHAR(255) NOT NULL,
        compliance VARCHAR(150),
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Check count
    const countRes = await pool.query("SELECT COUNT(*) FROM approval_rules");
    const count = parseInt(countRes.rows[0].count, 10);
    console.log("Existing approval_rules count:", count);

    if (count === 0) {
      console.log("Seeding initial approval rules...");
      const tenantRes = await pool.query("SELECT id FROM tenants LIMIT 1");
      const tenantId = tenantRes.rows[0]?.id || null;

      const initialRules = [
        {
          id: "APR-01",
          event: "Finished Goods QA Batch Release (CoA)",
          tier: "Dual Sign-off",
          authorizedRoles: "QA Manager + Plant Manager",
          compliance: "FDA 21 CFR Part 11",
          description: "Dual electronic signature required before finished batch can be dispatched or sold.",
        },
        {
          id: "APR-02",
          event: "Master BOM & Recipe Revision Approval",
          tier: "2-Tier Approval",
          authorizedRoles: "QA Manager + System Admin",
          compliance: "ISO 22000",
          description: "Engineering and formulation revision control with automated audit timestamping.",
        },
        {
          id: "APR-03",
          event: "Capital Asset Decommissioning / Scrap",
          tier: "Executive Sign-off",
          authorizedRoles: "Plant Manager + Corporate Ops",
          compliance: "GAAP Fixed Assets",
          description: "Permanent asset write-off authorization required for capital items over $5,000.",
        },
        {
          id: "APR-04",
          event: "Emergency Schedule Override & Overtime",
          tier: "1-Tier Instant",
          authorizedRoles: "Plant Manager",
          compliance: "Internal Ops Policy",
          description: "Instant single-sign authorization for unscheduled shifts or priority changeovers.",
        },
      ];

      for (const r of initialRules) {
        await pool.query(
          `INSERT INTO approval_rules (id, tenant_id, event, tier, authorized_roles, compliance, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [r.id, tenantId, r.event, r.tier, r.authorizedRoles, r.compliance, r.description]
        );
      }
      console.log("Seeded 4 initial approval rules into PostgreSQL!");
    }

    const finalRes = await pool.query("SELECT * FROM approval_rules");
    console.log("Current approval_rules rows in DB:", finalRes.rows.length);
  } catch (err) {
    console.error("Error setting up approval_rules:", err);
  } finally {
    await pool.end();
  }
}

setup();
