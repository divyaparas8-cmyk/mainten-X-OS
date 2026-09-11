"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("./config/database.js");
async function migratePM() {
    console.log("--- Starting Plant Manager Database Migration ---");
    const client = await database_js_1.pool.connect();
    try {
        await client.query("BEGIN");
        // 1. pm_hb_logs
        await client.query(`
      CREATE TABLE IF NOT EXISTS pm_hb_logs (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        pitch_id VARCHAR(100) NOT NULL,
        hour_window VARCHAR(100) NOT NULL,
        target_units INTEGER NOT NULL,
        actual_units INTEGER NOT NULL,
        delta INTEGER NOT NULL,
        cumulative_delta INTEGER NOT NULL,
        variance_reason TEXT,
        corrective_action TEXT,
        shift_code VARCHAR(50) NOT NULL DEFAULT 'Shift A',
        logged_date VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 2. pm_production_schedules
        await client.query(`
      CREATE TABLE IF NOT EXISTS pm_production_schedules (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        sku_id VARCHAR(100),
        sku_name VARCHAR(255) NOT NULL,
        line_id VARCHAR(100) NOT NULL,
        line_name VARCHAR(255) NOT NULL,
        planned_quantity INTEGER NOT NULL,
        start_time VARCHAR(50) NOT NULL,
        end_time VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Scheduled',
        locked BOOLEAN NOT NULL DEFAULT false,
        attainment_percent NUMERIC(5, 2) DEFAULT 98.50,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 3. pm_capacity_plans
        await client.query(`
      CREATE TABLE IF NOT EXISTS pm_capacity_plans (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        line_id VARCHAR(100) NOT NULL,
        line_name VARCHAR(255) NOT NULL,
        week_code VARCHAR(50) NOT NULL,
        available_hours NUMERIC(8, 2) NOT NULL,
        planned_hours NUMERIC(8, 2) NOT NULL,
        utilization_percent NUMERIC(5, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Optimal',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 4. pm_planning_constraints
        await client.query(`
      CREATE TABLE IF NOT EXISTS pm_planning_constraints (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        constraint_type VARCHAR(100) NOT NULL,
        rule_description TEXT NOT NULL,
        affected_line VARCHAR(100) NOT NULL,
        schedule_impact VARCHAR(255) NOT NULL,
        risk_level VARCHAR(50) NOT NULL DEFAULT 'Medium',
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        resolved_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 5. pm_recovery_plans
        await client.query(`
      CREATE TABLE IF NOT EXISTS pm_recovery_plans (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        scenario_name VARCHAR(255) NOT NULL DEFAULT 'Recovery Scenario',
        speed_boost_percent NUMERIC(5, 2) NOT NULL,
        overtime_hours NUMERIC(5, 2) NOT NULL,
        projected_recovery_units INTEGER NOT NULL,
        feasibility_percent NUMERIC(5, 2) NOT NULL,
        estimated_cost_usd NUMERIC(10, 2) NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 6. pm_shift_handoffs
        await client.query(`
      CREATE TABLE IF NOT EXISTS pm_shift_handoffs (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        shift_from VARCHAR(50) NOT NULL,
        shift_to VARCHAR(50) NOT NULL,
        handed_over_by VARCHAR(255) NOT NULL,
        received_by VARCHAR(255) NOT NULL,
        units_produced INTEGER DEFAULT 0 NOT NULL,
        scrap_units INTEGER DEFAULT 0 NOT NULL,
        notes TEXT NOT NULL,
        signature_status VARCHAR(50) DEFAULT 'Digitally Signed' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 7. pm_machine_telemetry
        await client.query(`
      CREATE TABLE IF NOT EXISTS pm_machine_telemetry (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        machine_code VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        line_id VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'RUNNING',
        speed_bph INTEGER NOT NULL DEFAULT 4200,
        rated_speed_bph INTEGER NOT NULL DEFAULT 4500,
        target_count INTEGER NOT NULL DEFAULT 30000,
        produced_count INTEGER NOT NULL DEFAULT 28400,
        scrap_count INTEGER NOT NULL DEFAULT 210,
        runtime_hours NUMERIC(6, 2) NOT NULL DEFAULT 6.80,
        downtime_minutes INTEGER NOT NULL DEFAULT 18,
        efficiency_percent NUMERIC(5, 2) NOT NULL DEFAULT 94.20,
        current_order VARCHAR(100) DEFAULT 'PO-2026-001',
        operator VARCHAR(255) DEFAULT 'Rajesh Sharma',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 8. pm_exceptions
        await client.query(`
      CREATE TABLE IF NOT EXISTS pm_exceptions (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        title VARCHAR(255) NOT NULL,
        severity VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        asset_or_order VARCHAR(255),
        impact_description TEXT NOT NULL,
        owner VARCHAR(255) NOT NULL DEFAULT 'Unassigned',
        escalation_level VARCHAR(100) NOT NULL DEFAULT 'L1 - Shift Supervisor',
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        resolution_notes TEXT,
        resolved_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        await client.query("COMMIT");
        console.log("✅ Plant Manager Database Migration completed successfully!");
    }
    catch (err) {
        await client.query("ROLLBACK");
        console.error("❌ Migration failed:", err);
        throw err;
    }
    finally {
        client.release();
        await database_js_1.pool.end();
    }
}
migratePM().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=migrate-pm.js.map