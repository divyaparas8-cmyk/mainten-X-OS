import { pool } from "../config/database.js";

async function runMigration() {
  console.log("🚀 Starting database migration for labour_allocations...");
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.labour_allocations (
        id VARCHAR(64) PRIMARY KEY,
        tenant_id UUID,
        plant_id VARCHAR(64) DEFAULT 'PLT-01',
        shift VARCHAR(50) DEFAULT 'Shift A',
        line VARCHAR(255) NOT NULL,
        line_id VARCHAR(64),
        required INTEGER NOT NULL DEFAULT 1,
        assigned INTEGER NOT NULL DEFAULT 0,
        supervisor VARCHAR(255) NOT NULL,
        supervisor_id VARCHAR(64),
        status VARCHAR(50) DEFAULT 'Full Coverage',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_labour_allocations_shift ON public.labour_allocations(shift);
      CREATE INDEX IF NOT EXISTS idx_labour_allocations_line ON public.labour_allocations(line);
    `);

    // Seed initial records if table is empty
    const { rows } = await pool.query(`SELECT COUNT(*)::int as count FROM public.labour_allocations;`);
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO public.labour_allocations (
          id, shift, line, required, assigned, supervisor, status, notes
        ) VALUES 
        (
          'ALC-01', 'Shift A', 'Line 1 — Aseptic Bottling', 10, 10, 'Marcus Vance', 'Full Coverage', 'Standard nominal staffing for high-speed aseptic bottling line.'
        ),
        (
          'ALC-02', 'Shift A', 'Line 2 — Formulation & CIP', 6, 6, 'Elena Rostova', 'Full Coverage', 'Sanitation and continuous formulation staffing active.'
        ),
        (
          'ALC-03', 'Shift A', 'Line 3 — Canning & Seaming', 8, 8, 'David Kim', 'Full Coverage', 'High-speed canning line with automated seamer operators.'
        ),
        (
          'ALC-04', 'Shift A', 'Quality & In-Line Testing Lab', 4, 4, 'Sarah Jenkins', 'Full Coverage', 'In-line QA and microbiological testing specialists present.'
        );
      `);
      console.log("🌱 Seeded initial line labour allocations into public.labour_allocations!");
    }

    console.log("✅ Successfully created and verified table 'public.labour_allocations' in PostgreSQL!");
  } catch (error) {
    console.error("❌ Error running migration:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
