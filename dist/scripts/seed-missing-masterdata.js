"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("../config/database.js");
async function seed() {
    const client = await database_js_1.pool.connect();
    try {
        const tenantRes = await client.query("SELECT id FROM public.tenants LIMIT 1");
        const tenantId = tenantRes.rows[0]?.id || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const plantRes = await client.query("SELECT id FROM public.plants LIMIT 1");
        const plantId = plantRes.rows[0]?.id || "bead41e2-b735-41b8-bd00-bdba1682fb6a";
        const skuRes = await client.query("SELECT id FROM public.skus LIMIT 1");
        const skuId = skuRes.rows[0]?.id || "ad766a63-81be-4f2a-8b9c-b86435003a00";
        console.log("Using Tenant:", tenantId, "Plant:", plantId, "SKU:", skuId);
        // 1. Seed Labour Standards into public.ci_standards
        const labourStandards = [
            {
                id: "LBR-01",
                title: "Line 1 — Aseptic Bottling",
                type: "Labour Standard",
                version: "10", // standard crew size
                line_id: "LIN-01",
                owner: "2.38", // std labor hours per 1k units
                approved_by: "$24.50", // direct blended cost per hour
                status: "Active"
            },
            {
                id: "LBR-02",
                title: "Line 2 — Formulation & Pasteurizer",
                type: "Labour Standard",
                version: "6",
                line_id: "LIN-02",
                owner: "1.85",
                approved_by: "$28.00",
                status: "Active"
            },
            {
                id: "LBR-03",
                title: "Line 3 — Canning Line",
                type: "Labour Standard",
                version: "8",
                line_id: "LIN-03",
                owner: "2.15",
                approved_by: "$24.50",
                status: "Active"
            }
        ];
        for (const ls of labourStandards) {
            await client.query(`
        INSERT INTO public.ci_standards (
          id, title, type, version, plant_id, line_id, owner, status, effective_date, review_date, approved_by, created_at
        ) VALUES (
          $1, $2, $3, $4, 'PLT-01', $5, $6, $7, '2026-01-01', '2027-01-01', $8, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          version = EXCLUDED.version,
          line_id = EXCLUDED.line_id,
          owner = EXCLUDED.owner,
          approved_by = EXCLUDED.approved_by,
          status = EXCLUDED.status;
      `, [ls.id, ls.title, ls.type, ls.version, ls.line_id, ls.owner, ls.status, ls.approved_by]);
        }
        console.log("Seeded ci_standards (Labour Standards)");
        // 2. Seed Workforce Staff into public.staff
        const workforce = [
            {
                employee_code: "EMP-001",
                name: "Alexander Vance",
                designation: "System Administrator & CI Lead",
                shift_code: "SHIFT_A",
                phone: "+1-555-0192",
                certifications: JSON.stringify(["5-Why RCA", "DMAIC Six Sigma", "LOTO", "HACCP", "Alignment", "Level 4 (Master / Trainer)", "IT & Continuous Improvement", "Indore Plant"])
            },
            {
                employee_code: "EMP-002",
                name: "Robert Thorne",
                designation: "Plant Manager",
                shift_code: "SHIFT_A",
                phone: "+1-555-0193",
                certifications: JSON.stringify(["OEE Loss Elimination", "Capacity Planning", "Level 4 (Master / Trainer)", "Plant Operations", "Indore Plant"])
            },
            {
                employee_code: "EMP-003",
                name: "Sarah Jenkins",
                designation: "QA / QC Manager",
                shift_code: "SHIFT_A",
                phone: "+1-555-0194",
                certifications: JSON.stringify(["HACCP CCP Monitoring", "CoA Batch Release", "Level 4 (Master / Trainer)", "Quality Assurance", "Indore Plant"])
            },
            {
                employee_code: "EMP-004",
                name: "David Chen",
                designation: "Senior Electrical & Automation Engineer",
                shift_code: "SHIFT_B",
                phone: "+1-555-0195",
                certifications: JSON.stringify(["Allen-Bradley PLC", "SCADA Architecture", "Level 3 (Senior Technician)", "Engineering & Reliability", "Indore Plant"])
            },
            {
                employee_code: "EMP-005",
                name: "Elena Rostova",
                designation: "Lead Beverage Processing Operator",
                shift_code: "SHIFT_B",
                phone: "+1-555-0196",
                certifications: JSON.stringify(["Autonomous Maintenance", "Sanitation CIP", "Level 2 (Autonomous Operator)", "Production & Bottling", "Indore Plant"])
            }
        ];
        for (const w of workforce) {
            const existing = await client.query("SELECT id FROM public.staff WHERE employee_code = $1", [w.employee_code]);
            if (existing.rows.length === 0) {
                await client.query(`
          INSERT INTO public.staff (
            tenant_id, plant_id, employee_code, name, designation, shift_code, phone, is_available, certifications, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, true, $8, NOW()
          );
        `, [tenantId, plantId, w.employee_code, w.name, w.designation, w.shift_code, w.phone, w.certifications]);
            }
            else {
                await client.query(`
          UPDATE public.staff
          SET name = $1, designation = $2, certifications = $3
          WHERE employee_code = $4;
        `, [w.name, w.designation, w.certifications, w.employee_code]);
            }
        }
        console.log("Seeded public.staff (Workforce & Skills)");
        // 3. Seed Quality Specs into public.quality_specs
        const specs = [
            {
                parameter_name: "Soluble Solids (Brix)",
                target_value: "10.500",
                min_tolerance: "10.300",
                max_tolerance: "10.700",
                uom: "°Bx",
                is_ccp: true
            },
            {
                parameter_name: "Dissolved Carbonation",
                target_value: "3.800",
                min_tolerance: "3.600",
                max_tolerance: "4.000",
                uom: "Vol CO2",
                is_ccp: false
            },
            {
                parameter_name: "pH Acidity Level",
                target_value: "2.850",
                min_tolerance: "2.700",
                max_tolerance: "3.000",
                uom: "pH",
                is_ccp: true
            },
            {
                parameter_name: "Net Fill Volume",
                target_value: "500.000",
                min_tolerance: "495.000",
                max_tolerance: "505.000",
                uom: "mL",
                is_ccp: false
            }
        ];
        for (const s of specs) {
            const existing = await client.query("SELECT id FROM public.quality_specs WHERE parameter_name = $1", [s.parameter_name]);
            if (existing.rows.length === 0) {
                await client.query(`
          INSERT INTO public.quality_specs (
            tenant_id, sku_id, parameter_name, target_value, min_tolerance, max_tolerance, uom, is_ccp, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, NOW()
          );
        `, [tenantId, skuId, s.parameter_name, s.target_value, s.min_tolerance, s.max_tolerance, s.uom, s.is_ccp]);
            }
            else {
                await client.query(`
          UPDATE public.quality_specs
          SET target_value = $1, min_tolerance = $2, max_tolerance = $3, uom = $4, is_ccp = $5
          WHERE parameter_name = $6;
        `, [s.target_value, s.min_tolerance, s.max_tolerance, s.uom, s.is_ccp, s.parameter_name]);
            }
        }
        console.log("Seeded public.quality_specs");
        // 4. Seed Storage Locations into public.warehouses
        const whs = [
            { code: "WH-RM-01", name: "Raw Material Warehouse Room A", type: "WAREHOUSE ROOM" },
            { code: "WH-RCK-101", name: "High-Bay Heavy Rack Array R-101 to R-110", type: "RACKS SYSTEM" },
            { code: "WH-CRT-05", name: "Mobile Clean CIP Transport Carts (5-Set)", type: "MOBILE CARTS" },
            { code: "WH-AUST-01", name: "Cold Storage Staging Vault 1", type: "COLD VAULT" }
        ];
        for (const w of whs) {
            const existing = await client.query("SELECT id FROM public.warehouses WHERE code = $1", [w.code]);
            if (existing.rows.length === 0) {
                await client.query(`
          INSERT INTO public.warehouses (
            tenant_id, plant_id, code, name, type, is_active
          ) VALUES (
            $1, $2, $3, $4, $5, true
          );
        `, [tenantId, plantId, w.code, w.name, w.type]);
            }
            else {
                await client.query(`
          UPDATE public.warehouses SET name = $1, type = $2 WHERE code = $3;
        `, [w.name, w.type, w.code]);
            }
        }
        console.log("Seeded public.warehouses (Storage Resources)");
    }
    finally {
        client.release();
        await database_js_1.pool.end();
    }
}
seed().catch(console.error);
//# sourceMappingURL=seed-missing-masterdata.js.map