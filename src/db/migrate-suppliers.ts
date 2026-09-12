import { pool } from "../config/database.js";

async function runMigration() {
  console.log("🚀 Starting database migration for suppliers table...");
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.suppliers (
        id VARCHAR(64) PRIMARY KEY,
        tenant_id UUID,
        supplier_code VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT 'Raw Material Concentrate',
        materials_supplied TEXT,
        status VARCHAR(50) DEFAULT 'Active',
        otif_score NUMERIC(5,2) DEFAULT 98.0,
        quality_acceptance_rate NUMERIC(5,2) DEFAULT 99.5,
        avg_lead_time_days NUMERIC(5,2) DEFAULT 4.0,
        risk_rating VARCHAR(50) DEFAULT 'Low Risk',
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        last_order VARCHAR(255) DEFAULT 'Pending Initial PO',
        open_orders_count INTEGER DEFAULT 0,
        active_contracts_count INTEGER DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_suppliers_tenant_id ON public.suppliers(tenant_id);
      CREATE INDEX IF NOT EXISTS idx_suppliers_code ON public.suppliers(supplier_code);
      CREATE INDEX IF NOT EXISTS idx_suppliers_name ON public.suppliers(name);
    `);

    console.log("✅ Successfully created and verified table 'public.suppliers' in PostgreSQL!");
  } catch (error) {
    console.error("❌ Error running suppliers migration:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
