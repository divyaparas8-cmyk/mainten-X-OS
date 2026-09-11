"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("./config/database.js");
async function seedPM() {
    console.log("--- Starting Plant Manager Baseline Seeding ---");
    const client = await database_js_1.pool.connect();
    try {
        await client.query("BEGIN");
        // Fetch primary tenant if exists
        const tenantRes = await client.query("SELECT id FROM tenants LIMIT 1;");
        const tenantId = tenantRes.rows[0]?.id || null;
        // 1. Seed H/B Logs (Today's Shift A Pacing)
        await client.query(`
      INSERT INTO pm_hb_logs (id, tenant_id, plant_id, pitch_id, hour_window, target_units, actual_units, delta, cumulative_delta, variance_reason, corrective_action, shift_code, logged_date)
      VALUES 
      ('HB-01', $1, 'PLT-01', 'PITCH-01', '06:00 - 07:00', 3000, 3050, 50, 50, 'Clean startup, smooth pre-heat', 'Maintain line speed at 4,200 BPH', 'Shift A', '2026-09-09'),
      ('HB-02', $1, 'PLT-01', 'PITCH-02', '07:00 - 08:00', 3000, 3020, 20, 70, 'Steady state flow', 'Routine sensor check', 'Shift A', '2026-09-09'),
      ('HB-03', $1, 'PLT-01', 'PITCH-03', '08:00 - 09:00', 3000, 2800, -200, -130, 'Cap chute minor sensor glare micro-stop (8m)', 'Realigned photoeye sensor bracket', 'Shift A', '2026-09-09'),
      ('HB-04', $1, 'PLT-01', 'PITCH-04', '09:00 - 10:00', 3000, 3100, 100, -30, 'Catch-up pacing at +5% speed', 'Operate at 4,350 BPH', 'Shift A', '2026-09-09'),
      ('HB-05', $1, 'PLT-01', 'PITCH-05', '10:00 - 11:00', 3000, 3050, 50, 20, 'Nominal speed recovery achieved', 'Normal operator rotation', 'Shift A', '2026-09-09'),
      ('HB-06', $1, 'PLT-01', 'PITCH-06', '11:00 - 12:00', 3000, 2980, -20, 0, 'Sleeve spool changeover (3 mins)', 'SMED quick splice technique applied', 'Shift A', '2026-09-09'),
      ('HB-07', $1, 'PLT-01', 'PITCH-07', '12:00 - 13:00', 3000, 3010, 10, 10, 'Stable run during lunch staggered break', 'Staggered operator relief', 'Shift A', '2026-09-09'),
      ('HB-08', $1, 'PLT-01', 'PITCH-08', '13:00 - 14:00', 3000, 3040, 40, 50, 'Shift close-out on pace', 'Prep line handover documentation', 'Shift A', '2026-09-09')
      ON CONFLICT (id) DO UPDATE SET 
        target_units = EXCLUDED.target_units,
        actual_units = EXCLUDED.actual_units,
        delta = EXCLUDED.delta,
        cumulative_delta = EXCLUDED.cumulative_delta;
    `, [tenantId]);
        // 2. Seed Master Production Schedule (MPS)
        await client.query(`
      INSERT INTO pm_production_schedules (id, tenant_id, plant_id, sku_name, line_id, line_name, planned_quantity, start_time, end_time, status, locked, attainment_percent)
      VALUES
      ('SCH-101', $1, 'PLT-01', '500ml Sparkling Citrus Drink', 'LIN-01', 'Line 1 — Aseptic Bottling', 48000, '06:00', '14:30', 'Running', true, 99.20),
      ('SCH-102', $1, 'PLT-01', '1L Sparkling Tonic Water', 'LIN-01', 'Line 1 — Aseptic Bottling', 32000, '15:00', '21:30', 'Scheduled', false, 98.00),
      ('SCH-103', $1, 'PLT-01', '250ml Slim Can Energy Drink', 'LIN-02', 'Line 2 — Canning & Pasteurizer', 55000, '06:00', '16:00', 'Running', true, 97.80),
      ('SCH-104', $1, 'PLT-01', '330ml Classic Cola Can', 'LIN-02', 'Line 2 — Canning & Pasteurizer', 40000, '16:30', '23:30', 'Scheduled', false, 98.50),
      ('SCH-105', $1, 'PLT-01', '2L PET Family Pack Lemon-Lime', 'LIN-03', 'Line 3 — High-Speed PET', 36000, '07:00', '15:00', 'Running', false, 96.50),
      ('SCH-106', $1, 'PLT-01', '500ml Zero-Sugar Iced Tea', 'LIN-03', 'Line 3 — High-Speed PET', 28000, '15:30', '22:00', 'Scheduled', false, 99.00)
      ON CONFLICT (id) DO NOTHING;
    `, [tenantId]);
        // 3. Seed Capacity Plans
        await client.query(`
      INSERT INTO pm_capacity_plans (id, tenant_id, plant_id, line_id, line_name, week_code, available_hours, planned_hours, utilization_percent, status)
      VALUES
      ('CAP-01', $1, 'PLT-01', 'LIN-01', 'Line 1 — Aseptic Bottling', '2026-W37', 168.00, 148.50, 88.39, 'Optimal'),
      ('CAP-02', $1, 'PLT-01', 'LIN-02', 'Line 2 — Canning & Pasteurizer', '2026-W37', 168.00, 158.00, 94.05, 'Near Capacity'),
      ('CAP-03', $1, 'PLT-01', 'LIN-03', 'Line 3 — High-Speed PET', '2026-W37', 168.00, 134.00, 79.76, 'Optimal')
      ON CONFLICT (id) DO NOTHING;
    `, [tenantId]);
        // 4. Seed Planning Constraints
        await client.query(`
      INSERT INTO pm_planning_constraints (id, tenant_id, plant_id, constraint_type, rule_description, affected_line, schedule_impact, risk_level, status)
      VALUES
      ('CST-01', $1, 'PLT-01', 'Sanitation / CIP', 'Mandatory 4-hour hot caustic CIP wash cycle required after citrus formulation run.', 'Line 1 — Aseptic Bottling', '+4 Hours Downtime Window', 'High', 'Active'),
      ('CST-02', $1, 'PLT-01', 'Allergen Changeover', 'Strict line sanitization & allergen protein swab check before switching to Almond beverage.', 'Line 2 — Canning & Pasteurizer', '+2.5 Hours Sanitization', 'High', 'Active'),
      ('CST-03', $1, 'PLT-01', 'Tooling Availability', 'Starwheel changeover parts undergoing ultrasonic degreasing in maintenance shop.', 'Line 1 — Aseptic Bottling', 'No 1L Run Before 14:00', 'Medium', 'Active'),
      ('CST-04', $1, 'PLT-01', 'Material Availability', 'Citric acid anhydrous delivery delayed by 4 hours from vendor.', 'Line 3 — High-Speed PET', 'Batching delayed to Shift B', 'Medium', 'Active'),
      ('CST-05', $1, 'PLT-01', 'Preventive Maintenance', 'Scheduled PM-LUB-02 conveyor chain tensioning completed.', 'Line 2 — Canning & Pasteurizer', 'Resolved during changeover', 'Low', 'Resolved')
      ON CONFLICT (id) DO NOTHING;
    `, [tenantId]);
        // 5. Seed Shift Handoffs
        await client.query(`
      INSERT INTO pm_shift_handoffs (id, tenant_id, plant_id, shift_from, shift_to, handed_over_by, received_by, units_produced, scrap_units, notes, signature_status)
      VALUES
      ('SHF-2026-01', $1, 'PLT-01', 'Shift C', 'Shift A', 'Carlos Mendez', 'Thomas Sterling', 44500, 520, 'All 3 lines running smoothly. Line 2 pasteurizer steam valve gasket inspected, zero leaks. Raw water RO tank at 92% capacity.', 'Digitally Signed'),
      ('SHF-2026-02', $1, 'PLT-01', 'Shift A', 'Shift B', 'Thomas Sterling', 'Chloe Dupuis', 48200, 380, 'Line 1 cap conveyor photoeye dusted at 08:30. Recovered pacing by +5% speed boost. Ready for 1L changeover at 14:30.', 'Digitally Signed')
      ON CONFLICT (id) DO NOTHING;
    `, [tenantId]);
        // 6. Seed Machine Telemetry
        await client.query(`
      INSERT INTO pm_machine_telemetry (id, tenant_id, plant_id, machine_code, name, line_id, status, speed_bph, rated_speed_bph, target_count, produced_count, scrap_count, runtime_hours, downtime_minutes, efficiency_percent, current_order, operator)
      VALUES
      ('MCH-01', $1, 'PLT-01', 'MC-FILL-01', 'Rotary Isobaric Bottle Filler #1', 'LIN-01', 'RUNNING', 4250, 4500, 34000, 32150, 180, 7.20, 14, 95.80, 'PO-2026-001', 'Rajesh Sharma'),
      ('MCH-02', $1, 'PLT-01', 'MC-PAST-02', 'HTST Flash Pasteurizer Skid #2', 'LIN-02', 'RUNNING', 3800, 4000, 30000, 28900, 210, 6.80, 22, 93.40, 'PO-2026-003', 'Vikram Patel'),
      ('MCH-03', $1, 'PLT-01', 'MC-PACK-03', 'High-Speed Case Packer & Shrink Tunnel', 'LIN-03', 'RUNNING', 4100, 4200, 28000, 27400, 95, 6.90, 8, 97.20, 'PO-2026-005', 'Anita Rao')
      ON CONFLICT (id) DO NOTHING;
    `, [tenantId]);
        // 7. Seed Exceptions
        await client.query(`
      INSERT INTO pm_exceptions (id, tenant_id, plant_id, title, severity, category, asset_or_order, impact_description, owner, escalation_level, status, resolution_notes)
      VALUES
      ('EX-2026-101', $1, 'PLT-01', 'Line 1 Cap Conveyor Micro-Jam Glare', 'P2', 'Equipment Stoppage', 'MC-FILL-01', 'Photoeye sensor glare caused 18 mins intermittent micro-jam during Shift A.', 'Marcus Vance (Maint Lead)', 'L2 - Engineering', 'Resolved', 'Realigned photoeye bracket with 15-degree tilt and wiped reflector lens.'),
      ('EX-2026-102', $1, 'PLT-01', 'Citric Acid Anhydrous Delayed Shipment', 'P3', 'Raw Material Shortage', 'PO-2026-005', 'Material delivery delayed by 4 hours from chemical supplier. Shift B batching queued.', 'Pooja Verma (Supply Chain)', 'L1 - Shift Supervisor', 'Active', NULL),
      ('EX-2026-103', $1, 'PLT-01', 'Line 2 Pasteurizer Steam Valve Pressure Fluctuation', 'P2', 'Quality Deviation', 'MC-PAST-02', 'Steam header pressure dipped to 2.8 bar momentarily during CIP switchover.', 'David Kim (Lead CI)', 'L2 - Engineering', 'In Review', 'Checking steam trap 04 and pneumatic modulating valve bypass.'),
      ('EX-2026-104', $1, 'PLT-01', 'High-Speed Shrink Film Roll Core Misalignment', 'P3', 'Equipment Stoppage', 'MC-PACK-03', 'Film roll core diameter was 78mm vs 76mm spindle specification.', 'Chloe Dupuis (Supervisor)', 'L1 - Shift Supervisor', 'Resolved', 'Swapped core adapter spindle in 4 mins.')
      ON CONFLICT (id) DO NOTHING;
    `, [tenantId]);
        await client.query("COMMIT");
        console.log("✅ Plant Manager Baseline Seeding completed successfully!");
    }
    catch (err) {
        await client.query("ROLLBACK");
        console.error("❌ Seeding failed:", err);
        throw err;
    }
    finally {
        client.release();
        await database_js_1.pool.end();
    }
}
seedPM().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed-pm.js.map