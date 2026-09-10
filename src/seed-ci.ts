import { pool } from './config/database.js';

async function seedCI() {
  console.log('--- Starting CI Initial Baseline Seeding ---');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Reliability
    await client.query(`
      INSERT INTO ci_reliability_records (id, asset_id, asset_name, line_id, line_name, plant_id, failures_count, total_downtime_min, mtbf_hrs, mttr_min, last_failure_date, failure_category, criticality, is_bad_actor, bad_actor_reason)
      VALUES 
      ('AST-002', 'AST-002', 'HTST Flash Pasteurizer', 'LIN-02', 'Line 2 — Formulation & Pasteurizer', 'PLT-01', 3, 135, 88, 45, '2026-08-28', 'Thermal & Pneumatics', 'Critical', true, 'Repeat Failure Trigger: 3 Breakdowns in 30 days'),
      ('AST-001', 'AST-001', 'Rotary Isobaric Bottle Filler', 'LIN-01', 'Line 1 — Aseptic Bottling', 'PLT-01', 2, 76, 102, 38, '2026-08-25', 'Capping Head & Torque', 'High', true, 'Repeat Failure Trigger: 2 Breakdowns in 30 days'),
      ('AST-004', 'AST-004', 'Sleeve Rotary Labeler & Shrink Tunnel', 'LIN-01', 'Line 1 — Aseptic Bottling', 'PLT-01', 1, 22, 148, 22, '2026-08-14', 'Vision Inspection & Feed', 'Medium', false, 'Standard operational threshold (< 2 failures)'),
      ('AST-005', 'AST-005', 'Automated Case Packer & Palletizer', 'LIN-01', 'Line 1 — Aseptic Bottling', 'PLT-01', 1, 30, 180, 30, '2026-08-10', 'Robotic Grip', 'Medium', false, 'Standard operational threshold (< 2 failures)')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 2. Investigations
    await client.query(`
      INSERT INTO ci_rca_investigations (id, plant_id, title, asset_id, asset_name, line_id, line_name, source_breakdown_id, source_work_order_id, severity, status, current_phase, problem_statement, lead_investigator, team_members, event_date, days_active, why_tree, eight_d)
      VALUES
      (
        'RCA-2026-001',
        'PLT-01',
        'HTST Pasteurizer CCP Temp Excursion & Pneumatic Valve Leak',
        'AST-002',
        'HTST Flash Pasteurizer',
        'LIN-02',
        'Line 2 — Formulation & Pasteurizer',
        'BD-2026-1002',
        'WO-2026-4401',
        'Critical',
        'Root Cause Validated',
        'Occurrence Cause',
        'Temperature dropped below 72.5°C critical limit during shift 2; automatic divert valve failed to fully seal, causing 45 min downtime.',
        'David Kim (Lead CI Engineer)',
        '["Elena Rostova (QA Manager)", "Marcus Vance (Maintenance Lead)", "Carlos Gomez (Tech)"]'::jsonb,
        '2026-08-28',
        3,
        '[
          {"id": "W1", "question": "Why did the pasteurizer temperature drop below 72.5°C?", "answer": "Steam control modulating valve pneumatic diaphragm suffered pressure drop."},
          {"id": "W2", "question": "Why did the pneumatic diaphragm lose pressure?", "answer": "Air supply regulator orifice was partially clogged with desiccant particulate."},
          {"id": "W3", "question": "Why was there desiccant particulate in the air line?", "answer": "Instrument air dryer pre-filter cartridge ruptured due to over-pressure."},
          {"id": "W4", "question": "Why did the pre-filter cartridge rupture without alarm?", "answer": "Differential pressure transmitter (DPT-104) was overdue for annual calibration."},
          {"id": "W5", "question": "Why was calibration missed during PM window?", "answer": "PM task checklist lacked explicit mandatory calibration interval for instrument air sub-skid."}
        ]'::jsonb,
        '{
          "d1Team": "David Kim (Lead), Marcus Vance (Maint), Elena Rostova (QA)",
          "d2Problem": "Temp dropped to 71.8°C; divert valve cycled 6 times under load.",
          "d3Containment": "Isolated Batch BAT-0890 to QA quarantine hold; replaced inline steam regulator.",
          "d4RootCause": "Instrument air desiccant filter rupture caused pneumatic actuator starvation.",
          "d5CorrectiveAction": "Install redundant 0.01 micron sub-filter and upgrade DPT-104 with auto-trip PLC alarm.",
          "d6Implementation": "Pneumatic overhaul completed; PM-AIR-04 calibration standard approved.",
          "d7Prevention": "Update Engineering SOP STD-ENG-003 and add weekly air dewpoint verification.",
          "d8Closure": "Verified 14 days zero temp deviations; $38,200 annual scrap saved."
        }'::jsonb
      ),
      (
        'RCA-2026-002',
        'PLT-01',
        'Rotary Filler Capping Head #4 Slip & Incomplete Seal',
        'AST-001',
        'Rotary Isobaric Bottle Filler',
        'LIN-01',
        'Line 1 — Aseptic Bottling',
        'BD-2026-1001',
        'WO-2026-4402',
        'High',
        'In Progress',
        'Hypothesis & Tests',
        'Cap torque failure rate exceeded 2.5% on spindle 4 due to magnetic clutch slipping during high-speed changeover.',
        'Elena Rostova (QA Manager)',
        '["David Kim (Lead CI)", "Marcus Vance (Maintenance Lead)"]'::jsonb,
        '2026-08-25',
        6,
        '[
          {"id": "W1", "question": "Why did capping spindle 4 slip?", "answer": "Magnetic clutch torque setting drifted from 2.8 Nm to 1.4 Nm."},
          {"id": "W2", "question": "Why did the clutch torque drift?", "answer": "Locking collar set-screw loosened under high vibration during 38,000 BPH run."},
          {"id": "W3", "question": "Why did the set-screw loosen?", "answer": "Thread-locking compound was omitted during previous spindle overhaul."},
          {"id": "W4", "question": "Why was thread-locker omitted?", "answer": "Maintenance work order instructions did not list Loctite 243 as mandatory consumable."},
          {"id": "W5", "question": "Why is consumable not standardized?", "answer": "Spindle rebuild BOM lacked dedicated mechanical fastening sub-assembly specification."}
        ]'::jsonb,
        '{
          "d1Team": "Elena Rostova (QA Lead), Marcus Vance (Maint)",
          "d2Problem": "Cap torque out of tolerance on 12 consecutive samples.",
          "d3Containment": "100% manual visual & torque audit on batch LOT-2026-0825.",
          "d4RootCause": "Spindle 4 magnetic clutch set-screw vibration loosening.",
          "d5CorrectiveAction": "Re-torque all 24 spindles and apply Loctite 243 threadlocker.",
          "d6Implementation": "All spindles audited; torque calibration verified.",
          "d7Prevention": "Update spindle maintenance rebuild standard SOP-CAP-002.",
          "d8Closure": "In progress — awaiting 7-day stability test."
        }'::jsonb
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    // 3. Evidence
    await client.query(`
      INSERT INTO ci_rca_evidence (id, rca_id, type, title, details, file_url, uploaded_by, date)
      VALUES
      ('EVD-01', 'RCA-2026-001', 'SCADA Trend', 'Steam Manifold Pressure & Pasteurizer Temp Plunge Log', 'Recorded pressure plunge from 6.2 bar to 2.8 bar at 10:22 AM on Line 2.', '', 'Marcus Vance', '2026-08-28'),
      ('EVD-02', 'RCA-2026-001', 'Physical Inspection Photo', 'Ruptured Desiccant Pre-filter Cartridge', 'Microscopic particulate clogging observed inside regulator nozzle cavity.', '', 'David Kim', '2026-08-28'),
      ('EVD-03', 'RCA-2026-002', 'Lab Torque Curve', 'Cap Torque Failure Frequency Distribution', '98% of out-of-spec caps isolated specifically to Spindle Station #4.', '', 'Elena Rostova', '2026-08-25')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 4. Hypotheses
    await client.query(`
      INSERT INTO ci_rca_hypotheses (id, rca_id, statement, test_method, evidence_result, validation_status, validated_by, validated_at)
      VALUES
      ('HYP-01', 'RCA-2026-001', 'Pneumatic actuator air supply starvation caused slow divert response.', 'Measure line pressure drop at regulator input during 100% steam call.', 'Pressure dropped from 6.2 bar to 2.8 bar upon valve stroke.', 'Confirmed Root Cause', 'David Kim (Lead CI)', '2026-08-30 14:15'),
      ('HYP-02', 'RCA-2026-001', 'Boiler feed steam boiler water treatment scale caused valve seat binding.', 'Inspect valve stem and seat with borescope.', 'Valve seat was pristine with zero scaling or mechanical scoring.', 'Refuted', 'Marcus Vance', '2026-08-29 11:30'),
      ('HYP-03', 'RCA-2026-002', 'Spindle 4 magnetic clutch set-screw loosened due to lack of threadlocker.', 'Check fastener torque on all 24 spindles using calibrated digital wrench.', 'Spindle 4 fastener was loose at 0.4 Nm (spec: 4.5 Nm).', 'Confirmed Root Cause', 'Elena Rostova', '2026-08-26 16:20')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 5. CAPA Actions
    await client.query(`
      INSERT INTO ci_capa_actions (id, rca_id, project_id, description, action_type, owner, due_date, priority, status, completion_date, evidence_notes, effectiveness_result, verified_by, verified_at)
      VALUES
      ('CAPA-2026-001', 'RCA-2026-001', 'PRJ-CI-001', 'Install redundant 0.01 micron coalescing filter on instrument air supply skid.', 'Corrective', 'Marcus Vance (Maintenance Lead)', '2026-09-10', 'High', 'In Progress', null, 'Procurement PO-SUP-401 placed; technician scheduled for installation.', null, null, null),
      ('CAPA-2026-002', 'RCA-2026-001', 'PRJ-CI-001', 'Update PM-AIR-04 task checklist to include mandatory quarterly differential pressure transmitter calibration.', 'Preventive', 'David Kim (Lead CI)', '2026-09-05', 'High', 'Completed', '2026-08-31', 'PM checklist template revised and uploaded to Master Data.', 'Awaiting 30-day PM execution cycle audit.', null, null),
      ('CAPA-2026-003', 'RCA-2026-002', 'PRJ-CI-002', 'Standardize Loctite 243 threadlocker on all 24 filler capping spindle rebuild procedures.', 'Corrective', 'Marcus Vance (Maintenance Lead)', '2026-08-28', 'High', 'Verified', '2026-08-27', 'All 24 spindles re-torqued and verified with Loctite 243.', 'Zero cap torque deviations observed across 180,000 bottles.', 'Elena Rostova (QA Manager)', '2026-08-29 10:00'),
      ('CAPA-2026-004', 'RCA-2026-002', 'PRJ-CI-002', 'Establish automated torque inspection check in hourly Quality Pitch record.', 'Preventive', 'Elena Rostova (QA Manager)', '2026-08-20', 'Medium', 'In Progress', null, 'Electronic quality sheet draft prepared.', null, null, null)
      ON CONFLICT (id) DO NOTHING;
    `);

    // 6. CI Projects
    await client.query(`
      INSERT INTO ci_projects (id, name, type, plant_id, line_id, asset_id, linked_rca_id, sponsor, owner, start_date, target_date, status, progress, baseline_metric, target_metric, current_metric, projected_savings_annual, realized_savings_ytd, benefit_status, locked_by, locked_at)
      VALUES
      ('PRJ-CI-001', 'OEE & Thermal Stability Optimization — Line 2 Pasteurizer', 'DMAIC 6-Sigma', 'PLT-01', 'LIN-02', 'AST-002', 'RCA-2026-001', 'Plant Operations Director', 'David Kim (Lead CI)', '2026-08-01', '2026-09-30', 'Implementation', 82, '88 hrs MTBF / 45 min MTTR', '> 180 hrs MTBF / < 20 min MTTR', '154 hrs MTBF / 22 min MTTR', 42000, 38200, 'Pending Verification', null, null),
      ('PRJ-CI-002', 'CIP Cycle Time & Water Consumption Reduction', 'Kaizen Event', 'PLT-01', 'LIN-01', 'AST-001', 'RCA-2026-002', 'Sustainability & Operations Lead', 'Marcus Vance (Maintenance Lead)', '2026-07-15', '2026-08-31', 'Completed', 100, '65 min CIP Cycle / 14,000 L Water', '45 min CIP Cycle / 9,500 L Water', '42 min CIP Cycle / 9,100 L Water', 18000, 18000, 'Verified & Locked', 'Sarah Jenkins (Plant Director)', '2026-08-31 16:45'),
      ('PRJ-CI-003', 'Label Application Defect Elimination & Vision Upgrade', 'SMED Rapid Setup', 'PLT-01', 'LIN-01', 'AST-004', null, 'Packaging Department Head', 'Elena Rostova (QA Manager)', '2026-08-10', '2026-09-15', 'In Progress', 65, '1.8% Label Skew Defect Rate', '< 0.2% Defect Rate', '0.4% Defect Rate', 11200, 8400, 'Draft', null, null)
      ON CONFLICT (id) DO NOTHING;
    `);

    // 7. Losses
    await client.query(`
      INSERT INTO ci_losses (id, category, plant_id, line_id, asset_id, event_name, hours_lost, units_lost, financial_impact_usd, linked_rca_id, linked_project_id, trend, date)
      VALUES
      ('LOSS-01', 'Downtime Loss', 'PLT-01', 'LIN-02', 'AST-002', 'Pasteurizer Divert Valve Jam & Thermal Drop', 2.25, 8500, 14200, 'RCA-2026-001', 'PRJ-CI-001', 'Critical', '2026-08-28'),
      ('LOSS-02', 'Quality / Defect Loss', 'PLT-01', 'LIN-01', 'AST-001', 'Capping Torque Under-specification Rejection', 1.20, 4200, 6800, 'RCA-2026-002', 'PRJ-CI-002', 'Warning', '2026-08-25'),
      ('LOSS-03', 'Scrap / Rework Loss', 'PLT-01', 'LIN-01', 'AST-004', 'Label Wrinkling and Skewed Sleeve Shrinkage', 0.80, 1800, 3100, null, 'PRJ-CI-003', 'Tracked', '2026-08-22'),
      ('LOSS-04', 'Production Loss', 'PLT-01', 'LIN-02', 'AST-002', 'Under-speed Run due to steam fluctuation', 1.50, 5200, 9400, 'RCA-2026-001', 'PRJ-CI-001', 'Critical', '2026-08-27'),
      ('LOSS-05', 'Yield Loss', 'PLT-01', 'LIN-01', 'AST-001', 'Syrup batch overrun during flush', 0.50, 1200, 4100, null, null, 'Tracked', '2026-08-26')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 8. Standards
    await client.query(`
      INSERT INTO ci_standards (id, title, type, version, plant_id, line_id, asset_id, source_project_id, source_rca_id, owner, status, effective_date, review_date, approved_by)
      VALUES
      ('STD-ENG-001', 'SOP-ENG-402: Instrument Air Header Filtration & Dewpoint Monitoring', 'Controlled SOP', 'v2.1', 'PLT-01', 'LIN-02', 'AST-002', 'PRJ-CI-001', 'RCA-2026-001', 'Engineering Quality Committee', 'Active', '2026-08-15', '2027-08-15', 'Sarah Jenkins (Plant Director)'),
      ('STD-ENG-002', 'SOP-CAP-002: Rotary Capper Spindle Rebuild & Loctite 243 Fastener Standard', 'Engineering Spec', 'v1.4', 'PLT-01', 'LIN-01', 'AST-001', 'PRJ-CI-002', 'RCA-2026-002', 'Marcus Vance (Maintenance Lead)', 'Active', '2026-08-28', '2027-08-28', 'Sarah Jenkins (Plant Director)'),
      ('STD-ENG-003', 'HACCP-CCP-01: Thermal Pasteurization Continuous Flow Critical Limit Standard', 'HACCP Limit', 'v3.0', 'PLT-01', 'LIN-02', 'AST-002', 'PRJ-CI-001', 'RCA-2026-001', 'Elena Rostova (QA Manager)', 'Active', '2026-08-01', '2027-08-01', 'QA Governance Board')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 9. Verified Solutions
    await client.query(`
      INSERT INTO ci_verified_solutions (id, asset_id, asset_name, failure_mode, symptom, root_cause, solution_steps, parts_used, source_rca_id, verified_by, verified_date, status)
      VALUES
      ('VSOL-001', 'AST-002', 'HTST Flash Pasteurizer', 'Pneumatic Actuator Slow Divert on Temperature Plunge', 'Divert valve chatter, slow seal response (> 2.4s), CCP warning buzzer.', 'Desiccant particulate fouling in main pneumatic pilot regulator orifice.', '1. Isolate air line and blow down residual pressure. 2. Clean regulator screen with ultrasonic bath. 3. Replace pilot seal ring. 4. Verify 6.0 bar stroke pressure.', 'Pneumatic Regulator Seal Kit (SKU-SP-4402), 0.01um Filter Element', 'RCA-2026-001', 'Marcus Vance (Maintenance Lead)', '2026-08-31', 'Published'),
      ('VSOL-002', 'AST-001', 'Rotary Isobaric Bottle Filler', 'Spindle 4 Capping Slip & Under-torque', 'Loose bottle caps on discharge conveyor; torque inspection < 1.8 Nm.', 'Magnetic clutch set-screw loosened due to high-speed vibration without threadlocker.', '1. Remove spindle guard. 2. Clean fastener threads with isopropanol. 3. Apply 2 drops Loctite 243. 4. Torque to 4.5 Nm with digital torque wrench.', 'Loctite 243 Medium Strength Threadlocker', 'RCA-2026-002', 'Elena Rostova (QA Manager)', '2026-08-29', 'Published')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 10. Capex Projects
    await client.query(`
      INSERT INTO ci_capex_projects (id, name, plant_id, line_id, asset_id, linked_rca_id, linked_project_id, budget, estimated_cost, actual_cost, engineering_justification, status, owner, target_commission_date, dossier_ref, approval_status)
      VALUES
      ('CPX-2026-001', 'Automated Tri-Clamp Steam Modulating Valve Redesign & Dual Redundant Air Header', 'PLT-01', 'LIN-02', 'AST-002', 'RCA-2026-001', 'PRJ-CI-001', 65000, 58000, 34000, 'Permanent machine redesign to eliminate single-point pneumatic regulator failure on critical thermal CCP process.', 'Budget Approved', 'David Kim (Lead CI)', '2026-10-15', 'DOS-ENG-2026-PAST-01', 'Approved by Plant GM'),
      ('CPX-2026-002', 'Line 1 High-Speed Vision Sorting & Ejection System Upgrade', 'PLT-01', 'LIN-01', 'AST-004', null, 'PRJ-CI-003', 45000, 42000, 12000, 'Cognex 3D vision camera upgrade to detect cap micro-cracks at 40,000 BPH.', 'Under Engineering Review', 'Elena Rostova (QA Manager)', '2026-11-01', 'DOS-ENG-2026-VIS-04', 'Pending Capex Board Review')
      ON CONFLICT (id) DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('✅ Successfully seeded baseline CI data into PostgreSQL.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error during CI seeding:', err);
    throw err;
  } finally {
    client.release();
  }
}

seedCI()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
