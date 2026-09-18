"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProcessingPackaging = seedProcessingPackaging;
const database_js_1 = require("../config/database.js");
async function seedProcessingPackaging() {
    const client = await database_js_1.pool.connect();
    try {
        console.log("🚀 Seeding Processing + Packaging Data for Command Center & CI/Engineer...");
        // 1. Storage Resources (Holding Tanks & WIP Buffers)
        await client.query(`
      DELETE FROM storage_resources WHERE resource_code IN ('HT-101', 'HT-102', 'ST-201', 'SILO-01');
      INSERT INTO storage_resources (
        id, resource_id, resource_code, name, resource_type, plant_id, plant_name, zone,
        capacity_unit, total_capacity, capacity, current_occupancy, temperature_zone, status
      ) VALUES
      (
        gen_random_uuid(), 'RES-TK-101', 'HT-101', 'Holding Tank 01 — Organic Orange Juice',
        'Aseptic Holding Tank', 'PLT-01', 'Indore Plant', 'Processing WIP Buffer',
        'Liters', 20000, '20,000 Liters', '16,400 L (82%)', 'Chilled (2°C - 4°C)', 'Active'
      ),
      (
        gen_random_uuid(), 'RES-TK-102', 'HT-102', 'Holding Tank 02 — Mango Nectar Blend',
        'Jacketed Storage Tank', 'PLT-01', 'Indore Plant', 'Processing WIP Buffer',
        'Liters', 15000, '15,000 Liters', '12,300 L (82%)', 'Chilled (2°C - 4°C)', 'Active'
      ),
      (
        gen_random_uuid(), 'RES-TK-201', 'ST-201', 'Aseptic Surge Tank 01 — Line 1 Feed',
        'Buffer Surge Vessel', 'PLT-01', 'Indore Plant', 'Packaging Infeed Zone',
        'Liters', 5000, '5,000 Liters', '4,100 L (82%)', 'Cold Sterile (4°C)', 'Active'
      ),
      (
        gen_random_uuid(), 'RES-TK-301', 'SILO-01', 'Bulk Liquid Sugar & Invert Silo',
        'Stainless Storage Silo', 'PLT-01', 'Indore Plant', 'Raw Influx Storage',
        'Liters', 50000, '50,000 Liters', '38,500 L (77%)', 'Ambient (20°C - 24°C)', 'Active'
      );
    `);
        // 2. Machine Telemetry (Processing Equipment + Packaging Machinery)
        await client.query(`
      INSERT INTO pm_machine_telemetry (
        id, plant_id, machine_code, name, line_id, stage, status, speed_bph, rated_speed_bph,
        target_count, produced_count, scrap_count, runtime_hours, downtime_minutes,
        efficiency_percent, current_order, operator, process_parameters
      ) VALUES
      (
        'MC-PROC-01', 'PLT-01', 'PROC-MIX-01', 'High-Shear Batch Mixer 01', 'LINE-PROC-01',
        'PROCESSING', 'RUNNING', 1800, 2000, 15000, 12500, 0, '6.50', 12, '95.40',
        'BATCH-ORG-401', 'Vikram Patel',
        '{"batchId": "BATCH-ORG-401", "recipeStep": "Step 3: Thermal Hold 85°C", "temperatureC": 85.2, "targetTempC": 85.0, "pressureBar": 2.1, "agitationRpm": 1800, "ccpStatus": "PASSED", "ccpLimit": "Min 82.0°C", "timeRemainingMin": 22}'::jsonb
      ),
      (
        'MC-PROC-02', 'PLT-01', 'PROC-PAST-01', 'HTST Pasteurizer Unit 01', 'LINE-PROC-01',
        'PROCESSING', 'RUNNING', 4500, 5000, 20000, 18200, 0, '7.10', 8, '97.20',
        'BATCH-ORG-402', 'Ananya Singh',
        '{"batchId": "BATCH-ORG-402", "recipeStep": "Continuous Heat Exchanger", "temperatureC": 92.4, "targetTempC": 92.0, "pressureBar": 3.4, "flowRateLph": 4500, "ccpStatus": "PASSED", "ccpLimit": "89.0 - 95.0°C", "timeRemainingMin": 40}'::jsonb
      ),
      (
        'MC-PROC-03', 'PLT-01', 'PROC-COOK-01', 'Vacuum Deaerator & Cooker', 'LINE-PROC-01',
        'PROCESSING', 'RUNNING', 3200, 3500, 10000, 9800, 0, '6.80', 15, '94.00',
        'BATCH-ORG-403', 'Sunil Rao',
        '{"batchId": "BATCH-ORG-403", "recipeStep": "Vacuum Extraction -0.85 bar", "temperatureC": 68.0, "targetTempC": 68.0, "vacuumBar": -0.85, "ccpStatus": "PASSED", "timeRemainingMin": 15}'::jsonb
      ),
      (
        'MC-PACK-01', 'PLT-01', 'PACK-FILL-01', 'Rotary Aseptic Monobloc Filler', 'LINE-1',
        'PACKAGING', 'RUNNING', 6000, 6000, 30000, 28400, 180, '6.80', 18, '94.20',
        'PO-2026-8801', 'Elena Rostova',
        '{"runId": "RUN-PET-500ML", "speedBpm": 100, "fillVolumeMl": 500, "torqueNm": 1.82, "rejectRatePct": 0.63}'::jsonb
      ),
      (
        'MC-PACK-02', 'PLT-01', 'PACK-CAPP-01', 'High-Speed Capper & Vision Inspector', 'LINE-1',
        'PACKAGING', 'RUNNING', 6000, 6000, 30000, 28350, 50, '6.70', 12, '96.10',
        'PO-2026-8801', 'Carlos Mendez',
        '{"runId": "RUN-PET-500ML", "visionPassPct": 99.8, "capTorqueMinNm": 1.6, "capTorqueMaxNm": 2.0}'::jsonb
      ),
      (
        'MC-PACK-03', 'PLT-01', 'PACK-CART-01', 'Automatic Case Packer & Palletizer', 'LINE-1',
        'PACKAGING', 'RUNNING', 500, 550, 2500, 2360, 12, '6.50', 25, '92.50',
        'PO-2026-8801', 'David Kim',
        '{"casesPerHour": 480, "casesPerPallet": 72, "stretchWrapStatus": "SECURED"}'::jsonb
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        stage = EXCLUDED.stage,
        status = EXCLUDED.status,
        speed_bph = EXCLUDED.speed_bph,
        target_count = EXCLUDED.target_count,
        produced_count = EXCLUDED.produced_count,
        scrap_count = EXCLUDED.scrap_count,
        efficiency_percent = EXCLUDED.efficiency_percent,
        process_parameters = EXCLUDED.process_parameters;
    `);
        // 3. Hour-by-Hour Pitch Logs (Processing batches + Packaging units)
        await client.query(`
      INSERT INTO pm_hb_logs (
        id, plant_id, pitch_id, hour_window, target_units, actual_units, delta, cumulative_delta,
        stage, variance_reason, corrective_action, shift_code, logged_date
      ) VALUES
      (
        'HB-PROC-01', 'PLT-01', 'PITCH-PROC-01', '06:00 - 07:00', 5000, 5100, 100, 100,
        'PROCESSING', 'None - Nominal Batch Heating', 'Maintain steam valve position', 'Shift A', CURRENT_DATE::text
      ),
      (
        'HB-PROC-02', 'PLT-01', 'PITCH-PROC-02', '07:00 - 08:00', 5000, 4950, -50, 50,
        'PROCESSING', 'Brix adjustment delay in mixing', 'Agitation speed elevated to 1800 rpm', 'Shift A', CURRENT_DATE::text
      ),
      (
        'HB-PROC-03', 'PLT-01', 'PITCH-PROC-03', '08:00 - 09:00', 5000, 5200, 200, 250,
        'PROCESSING', 'Fast pasteurization throughput', 'Continuous transfer to Buffer Tank HT-101', 'Shift A', CURRENT_DATE::text
      ),
      (
        'HB-PROC-04', 'PLT-01', 'PITCH-PROC-04', '09:00 - 10:00', 5000, 5050, 50, 300,
        'PROCESSING', 'Stable Thermal Curve', 'Hold for bottling packaging transfer', 'Shift A', CURRENT_DATE::text
      ),
      (
        'HB-PACK-01', 'PLT-01', 'PITCH-PACK-01', '06:00 - 07:00', 6000, 5850, -150, -150,
        'PACKAGING', 'Filler infeed starwheel minor jam', 'De-jammed and guide rails sanitized', 'Shift A', CURRENT_DATE::text
      ),
      (
        'HB-PACK-02', 'PLT-01', 'PITCH-PACK-02', '07:00 - 08:00', 6000, 6100, 100, -50,
        'PACKAGING', 'Nominal Line Speed', 'Speed tuned to 102 BPM', 'Shift A', CURRENT_DATE::text
      ),
      (
        'HB-PACK-03', 'PLT-01', 'PITCH-PACK-03', '08:00 - 09:00', 6000, 6050, 50, 0,
        'PACKAGING', 'Steady Running Pace', 'Label reel auto-spliced successfully', 'Shift A', CURRENT_DATE::text
      ),
      (
        'HB-PACK-04', 'PLT-01', 'PITCH-PACK-04', '09:00 - 10:00', 6000, 6200, 200, 200,
        'PACKAGING', 'Ahead of Shift Target', 'Allergen changeover prep queued for end of shift', 'Shift A', CURRENT_DATE::text
      )
      ON CONFLICT (id) DO UPDATE SET
        target_units = EXCLUDED.target_units,
        actual_units = EXCLUDED.actual_units,
        delta = EXCLUDED.delta,
        cumulative_delta = EXCLUDED.cumulative_delta,
        stage = EXCLUDED.stage,
        variance_reason = EXCLUDED.variance_reason,
        corrective_action = EXCLUDED.corrective_action;
    `);
        // 4. Exception Control Tower Logs (Processing + Packaging)
        await client.query(`
      INSERT INTO pm_exceptions (
        id, plant_id, title, stage, severity, category, asset_or_order,
        impact_description, owner, escalation_level, status
      ) VALUES
      (
        'EX-PROC-01', 'PLT-01', 'Pasteurizer CCP Divert Valve Pressure Fluctuation', 'PROCESSING', 'P2',
        'Quality Deviation', 'PROC-PAST-01',
        'Steam manifold regulator hunting caused ±1.5°C swing near CCP threshold. Divert valve triggered for 45 seconds.',
        'Dr. Priya Sharma (QA Lead)', 'L2 - Plant Quality Manager', 'Active'
      ),
      (
        'EX-PROC-02', 'PLT-01', 'Batch Mixer 01 High Motor Amperage Alert', 'PROCESSING', 'P3',
        'Equipment Deviation', 'PROC-MIX-01',
        'Viscous pectin addition caused motor load spike to 92% rated capacity. Rheology stabilized.',
        'Vikram Patel (Process Operator)', 'L1 - Shift Supervisor', 'Active'
      ),
      (
        'EX-PACK-01', 'PLT-01', 'Filler Infeed Starwheel Jam & Micro-Stops', 'PACKAGING', 'P1',
        'Equipment Stoppage', 'PACK-FILL-01',
        'PET bottle preform distortion caused starwheel jam, losing 18 minutes production time.',
        'Elena Rostova (Packaging Lead)', 'L1 - Shift Supervisor', 'Active'
      ),
      (
        'EX-PACK-02', 'PLT-01', 'Cap Vision Reject Rate Threshold Exceeded', 'PACKAGING', 'P2',
        'Quality Deviation', 'PACK-CAPP-01',
        'Optical inspection rejecting 1.2% caps due to supplier liner ovality. Lot quarantined.',
        'Carlos Mendez (Capper Op)', 'L2 - Plant Quality Manager', 'Active'
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        stage = EXCLUDED.stage,
        severity = EXCLUDED.severity,
        category = EXCLUDED.category,
        impact_description = EXCLUDED.impact_description,
        status = EXCLUDED.status;
    `);
        // 5. CI Reliability Records (Processing vs Packaging)
        await client.query(`
      INSERT INTO ci_reliability_records (
        id, asset_id, asset_name, line_id, line_name, plant_id, stage,
        failures_count, total_downtime_min, mtbf_hrs, mttr_min, last_failure_date,
        failure_category, criticality, is_bad_actor, bad_actor_reason
      ) VALUES
      (
        'REL-PROC-01', 'PROC-PUMP-01', 'High-Pressure Homogenizer Pump 01', 'LINE-PROC-01', 'Processing Hall', 'PLT-01', 'PROCESSING',
        4, 180, 160, 45, CURRENT_DATE::text,
        'Hydraulic Valve & Cavitation Seal Wear', 'Critical', true,
        'Cavitation seal degradation and repeated pressure fluctuations in homogenization head exceeding wear tolerance'
      ),
      (
        'REL-PROC-02', 'PROC-PAST-01', 'HTST Plate Heat Exchanger Pasteurizer', 'LINE-PROC-01', 'Processing Hall', 'PLT-01', 'PROCESSING',
        1, 30, 480, 30, CURRENT_DATE::text,
        'Plate Scaling & Thermal Valve Hunting', 'Critical', false, null
      ),
      (
        'REL-PROC-03', 'PROC-MIX-01', 'High-Shear Batch Blending Tank', 'LINE-PROC-01', 'Processing Hall', 'PLT-01', 'PROCESSING',
        2, 50, 360, 25, CURRENT_DATE::text,
        'Mechanical Seal Flush Leakage', 'High', false, null
      ),
      (
        'REL-PACK-01', 'PACK-FILL-01', 'Rotary Aseptic Monobloc Filler', 'LINE-1', 'Bottling Line 1', 'PLT-01', 'PACKAGING',
        6, 108, 95, 18, CURRENT_DATE::text,
        'Nozzle Diaphragm Micro-Stop Jams', 'Critical', true,
        'Drip sensor optical misalignment causing high-frequency micro-stops exceeding 15 events per shift'
      ),
      (
        'REL-PACK-02', 'PACK-CAPP-01', 'Magnetic Chuck Capping Turret', 'LINE-1', 'Bottling Line 1', 'PLT-01', 'PACKAGING',
        2, 30, 240, 15, CURRENT_DATE::text,
        'Cap Chute Jam on High-Speed Run', 'High', false, null
      ),
      (
        'REL-PACK-03', 'PACK-CART-01', 'High-Speed Automatic Case Packer', 'LINE-1', 'Bottling Line 1', 'PLT-01', 'PACKAGING',
        3, 66, 185, 22, CURRENT_DATE::text,
        'Pneumatic Suction Cup Vacuum Loss', 'Medium', false, null
      )
      ON CONFLICT (id) DO UPDATE SET
        asset_name = EXCLUDED.asset_name,
        stage = EXCLUDED.stage,
        failures_count = EXCLUDED.failures_count,
        total_downtime_min = EXCLUDED.total_downtime_min,
        mtbf_hrs = EXCLUDED.mtbf_hrs,
        mttr_min = EXCLUDED.mttr_min,
        is_bad_actor = EXCLUDED.is_bad_actor,
        bad_actor_reason = EXCLUDED.bad_actor_reason;
    `);
        // 6. CI Loss Records (Processing Yield Loss vs Packaging Scrap Loss)
        await client.query(`
      INSERT INTO ci_losses (
        id, category, plant_id, line_id, asset_id, stage, event_name,
        hours_lost, units_lost, financial_impact_usd, trend, date
      ) VALUES
      (
        'LOSS-YLD-01', 'Yield Loss', 'PLT-01', 'LINE-PROC-01', 'PROC-PAST-01', 'PROCESSING',
        'Pasteurizer Start-Up Heel & Pipe Line Residual Flush',
        '1.20', 450, 540.00, 'Warning', CURRENT_DATE::text
      ),
      (
        'LOSS-YLD-02', 'Yield Loss', 'PLT-01', 'LINE-PROC-01', 'PROC-COOK-01', 'PROCESSING',
        'Evaporator Thermal Concentration Mass-Balance Shrinkage',
        '0.80', 620, 744.00, 'Tracked', CURRENT_DATE::text
      ),
      (
        'LOSS-YLD-03', 'Yield Loss', 'PLT-01', 'LINE-PROC-01', 'PROC-MIX-01', 'PROCESSING',
        'Recipe Ingredient Scaling Deviation & Batch Re-blend',
        '2.50', 800, 960.00, 'Critical', CURRENT_DATE::text
      ),
      (
        'LOSS-SCP-01', 'Scrap / Rework Loss', 'PLT-01', 'LINE-1', 'PACK-FILL-01', 'PACKAGING',
        'Defective Preform Blow-Molding Neck Cracking Defect',
        '0.50', 310, 248.00, 'Warning', CURRENT_DATE::text
      ),
      (
        'LOSS-SCP-02', 'Scrap / Rework Loss', 'PLT-01', 'LINE-1', 'PACK-CAPP-01', 'PACKAGING',
        'Capper High-Torque Stripped Threads & Cocked Caps',
        '0.40', 180, 162.00, 'Tracked', CURRENT_DATE::text
      ),
      (
        'LOSS-SCP-03', 'Scrap / Rework Loss', 'PLT-01', 'LINE-1', 'PACK-CART-01', 'PACKAGING',
        'Case Packer Outer Shipper Corrugate Infeed Crushing',
        '0.30', 45, 90.00, 'Tracked', CURRENT_DATE::text
      )
      ON CONFLICT (id) DO UPDATE SET
        category = EXCLUDED.category,
        stage = EXCLUDED.stage,
        event_name = EXCLUDED.event_name,
        hours_lost = EXCLUDED.hours_lost,
        units_lost = EXCLUDED.units_lost,
        financial_impact_usd = EXCLUDED.financial_impact_usd;
    `);
        // 7. RCA Investigations (Processing vs Packaging)
        await client.query(`
      INSERT INTO ci_rca_investigations (
        id, plant_id, title, stage, asset_id, asset_name, line_id, line_name,
        severity, status, current_phase, problem_statement, lead_investigator, event_date
      ) VALUES
      (
        'RCA-2026-002', 'PLT-01', 'Pasteurizer Thermal Hold Temperature Under-Shoot During High Flow',
        'PROCESSING', 'PROC-PAST-01', 'HTST Plate Heat Exchanger Pasteurizer', 'LINE-PROC-01', 'Processing Hall',
        'Critical', 'In Progress', 'Hypothesis & Tests',
        'Steam modulating valve hunting caused 0.4°C temperature drop below CCP minimum 82.0°C during high-flow recipe, triggering auto-divert.',
        'Suresh Menon (Process Engineer)', CURRENT_DATE::text
      ),
      (
        'RCA-2026-001', 'PLT-01', 'Capper Infeed Jam on Line 1 Due to Optical Sensor Blindness',
        'PACKAGING', 'PACK-CAPP-01', 'Magnetic Chuck Capping Turret', 'LINE-1', 'Bottling Line 1',
        'High', 'Root Cause Validated', 'Occurrence Cause',
        'Cap orientation optical sensor blinded by washdown foam residue, causing false queue backups and line stops.',
        'Elena Rostova (Packaging Lead)', CURRENT_DATE::text
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        stage = EXCLUDED.stage,
        severity = EXCLUDED.severity,
        status = EXCLUDED.status,
        current_phase = EXCLUDED.current_phase,
        problem_statement = EXCLUDED.problem_statement;
    `);
        console.log("✅ Processing + Packaging database seed finished successfully!");
    }
    catch (err) {
        console.error("❌ Error seeding Processing + Packaging data:", err);
        throw err;
    }
    finally {
        client.release();
    }
}
if (process.argv[1]?.includes("seedProcessingPackaging")) {
    seedProcessingPackaging().then(() => process.exit(0)).catch(() => process.exit(1));
}
