import { pool } from "../config/database.js";

async function cleanAndSeed() {
  const client = await pool.connect();
  try {
    // 1. Delete junk dummy items ('dfghj', 'sdf', etc.)
    await client.query(`
      DELETE FROM public.preop_checks 
      WHERE name IN ('dfghj', 'sdf', 'test', 'demo') OR name LIKE '%sdf%' OR name LIKE '%dfghj%';
    `);
    console.log("🧹 Cleaned junk dummy rows from preop_checks");

    // 2. Fetch all tenants
    const { rows: tenants } = await client.query("SELECT id, name FROM public.tenants;");
    
    // 3. For each tenant, if preop_checks is empty, seed clean standard HACCP checkpoints
    const standardCheckpoints = [
      {
        category: "Sanitation & ATP Swab",
        name: "Filler Nozzles & Bell Housing ATP Hygiene Swab",
        spec: "< 10 RLU (Zero microbial residue)",
        criticality: "Critical GMP",
        method: "Luminescence Swab"
      },
      {
        category: "Mechanical Clearance",
        name: "Physical Inspection of Filler Nozzle Seals & O-Rings",
        spec: "No cracks, food-grade EPDM intact",
        criticality: "Critical Safety",
        method: "Visual & Tactile"
      },
      {
        category: "Process Instrumentation",
        name: "Pasteurizer Pipeline Pressure & Temp Sensor Calibration",
        spec: "4.2 Bar ± 0.2 • 72.4°C baseline",
        criticality: "CCP Calibration",
        method: "Digital Telemetry"
      },
      {
        category: "Line Clearance",
        name: "Packaging Line 1 Clean of Raw Debris, Prior Labels & Tools",
        spec: "100% Cleared (Zero Foreign Material)",
        criticality: "GMP Hygiene",
        method: "360° Line Walkthrough"
      },
      {
        category: "Chemical Residuals",
        name: "CIP Caustic & Peracetic Acid (PAA) Rinse Strip Test",
        spec: "0.0 ppm PAA Residual (Neutral pH 7.0)",
        criticality: "Chemical Safety",
        method: "Colorimetric Strip"
      },
      {
        category: "Foreign Body Prevention",
        name: "In-line Conveyor Metal Detector & Reject Gate Test",
        spec: "1.5mm Fe, 2.0mm Non-Fe, 2.5mm SS test wands",
        criticality: "CCP-2 Critical Gate",
        method: "Test Wand Ingestion"
      }
    ];

    for (const t of tenants) {
      const countRes = await client.query(`SELECT COUNT(*)::int as count FROM public.preop_checks WHERE tenant_id = $1;`, [t.id]);
      if (countRes.rows[0].count === 0) {
        console.log(`🌱 Seeding 6 standard HACCP checkpoints for tenant ${t.name} (${t.id})...`);
        for (const s of standardCheckpoints) {
          await client.query(`
            INSERT INTO public.preop_checks (tenant_id, category, name, spec, criticality, method, passed, notes, line_name, batch_number)
            VALUES ($1, $2, $3, $4, $5, $6, NULL, '', 'LINE-2 (abc)', 'BAT-2026-ORD2511');
          `, [t.id, s.category, s.name, s.spec, s.criticality, s.method]);
        }
      }

      // Also ensure allergen_audits has tenant_id set or records for each tenant
      const algCount = await client.query(`SELECT COUNT(*)::int as count FROM public.allergen_audits WHERE tenant_id = $1;`, [t.id]);
      if (algCount.rows[0].count === 0) {
        console.log(`🌱 Seeding initial allergen audits for tenant ${t.name} (${t.id})...`);
        await client.query(`
          INSERT INTO public.allergen_audits (tenant_id, name, sku, line, test_method, target_allergen, status, auditor, timestamp_str)
          VALUES
          ($1, 'Costco Orange Juice Run (Allergen: Soy free)', 'SKU-ORJ-330', 'Line 1 Aseptic Bottling', 'Lateral Flow Strip (Neogen)', 'Soy Free (<2.5 ppm)', 'PENDING AUDIT', 'Dr. Rachel Thorne', 'Today, 11:20 AM'),
          ($1, 'Trader Joe''s Almond Milk Swap (Allergen: Tree Nut)', 'SKU-ALM-1000', 'Line 2 High-Speed Can Line', 'ELISA Swab Assay', 'Nut Cleanse (0 ppm residue)', 'AUDIT CLEARED', 'Marcus Vance', 'Today, 09:15 AM'),
          ($1, 'Oat Beverage Batch Clearance (Gluten Free)', 'SKU-OAT-500', 'Line 3 Tetra Pak Carton Loop', 'R5 Gliadin Rapid Strip', 'Gluten Free (<5 ppm)', 'AUDIT CLEARED', 'Dr. Rachel Thorne', 'Today, 07:45 AM');
        `, [t.id]);
      }

      // Also ensure sanitation_cip_steps has tenant_id
      const sanCount = await client.query(`SELECT COUNT(*)::int as count FROM public.sanitation_cip_steps WHERE tenant_id = $1;`, [t.id]);
      if (sanCount.rows[0].count === 0) {
        console.log(`🌱 Seeding initial CIP steps for tenant ${t.name} (${t.id})...`);
        await client.query(`
          INSERT INTO public.sanitation_cip_steps (tenant_id, step_order, phase, equipment, spec, chemical, target_value, completed, log_value)
          VALUES
          ($1, 1, '1. Pre-Rinse Cycle', 'Main Filler Bowl & Intake Manifold', 'Warm RO Water @ 45°C - 55°C • 10 mins', 'Treated Reverse Osmosis Water', 'Turbidity < 5 NTU', true, 'Rinse time: 10 mins • Clear effluent'),
          ($1, 2, '2. Alkaline Caustic Wash', 'Valves, Filling Nozzles & Flow Meters', '2.5% NaOH (Sodium Hydroxide) @ 75°C - 85°C • 20 mins', 'Diversey Caustic CIP Blend', 'Conductivity > 45 mS/cm', true, 'Concentration: 2.52% • Temp: 81.4°C'),
          ($1, 3, '3. Intermediate Water Rinse', 'Product Contact Lines & Manifold Loop', 'Ambient RO Water until pH 7.0 neutral • 8 mins', 'Sterile RO Flush', 'pH 6.8 - 7.2 neutral', true, 'pH verified: 7.02 (Neutralized)'),
          ($1, 4, '4. Acid Wash (Scale Removal)', 'Plate Heat Exchanger & Pasteurizer Tubes', '1.2% Nitric/Phosphoric Acid @ 60°C • 15 mins', 'Food-Grade Descaler Acid', 'Conductivity 18 - 22 mS/cm', true, 'Acid loop: 1.2% • Temp: 62.0°C'),
          ($1, 5, '5. Sanitizer Cold Disinfection', 'All Aseptic Product Filling Heads', '150 - 200 ppm Peracetic Acid (PAA) @ 20°C • 10 mins', 'Peracetic Acid (PAA 15%)', '150 - 200 ppm titration', false, ''),
          ($1, 6, '6. Final Sterile Air Purge', 'Nozzle Tips & Conveyor Enclosure', 'HEPA Filtered Class 100 Air Blowdown • 5 mins', '0.2 Micron Filtered Air', 'Zero Moisture Residue', false, '');
        `, [t.id]);
      }

      // Also ensure sanitation_cip_config has tenant_id
      const cfgCount = await client.query(`SELECT COUNT(*)::int as count FROM public.sanitation_cip_config WHERE tenant_id = $1;`, [t.id]);
      if (cfgCount.rows[0].count === 0) {
        await client.query(`
          INSERT INTO public.sanitation_cip_config (tenant_id, loop, protocol, operator, chemical_wash, sanitizer, status)
          VALUES ($1, 'CIP Loop 01 (Rotary Filler & Intake Manifold)', '5-Step Full Thermal & Chemical CIP Cycle', 'Dr. Rachel Thorne (QA Lead)', 'Caustic 2.5% • 81.4°C', 'PAA Sanitizer: 180 ppm Target', 'CYCLE IN PROGRESS');
        `, [t.id]);
      }
    }

    console.log("✅ Finished cleaning and seeding tables!");
  } finally {
    client.release();
    process.exit(0);
  }
}

cleanAndSeed().catch(e => { console.error(e); process.exit(1); });
