"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = require("./config/database.js");
async function migrateCI() {
    console.log('--- Starting CI / Engineering Database Migration ---');
    const client = await database_js_1.pool.connect();
    try {
        await client.query('BEGIN');
        // 1. ci_rca_investigations
        await client.query(`
      CREATE TABLE IF NOT EXISTS ci_rca_investigations (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        title VARCHAR(255) NOT NULL,
        asset_id VARCHAR(100) NOT NULL,
        asset_name VARCHAR(255) NOT NULL,
        line_id VARCHAR(100) NOT NULL,
        line_name VARCHAR(255) NOT NULL,
        source_breakdown_id VARCHAR(100),
        source_work_order_id VARCHAR(100),
        severity VARCHAR(50) NOT NULL DEFAULT 'High',
        status VARCHAR(100) NOT NULL DEFAULT 'Open',
        current_phase VARCHAR(100) NOT NULL DEFAULT 'Event',
        problem_statement TEXT NOT NULL,
        lead_investigator VARCHAR(255) NOT NULL,
        team_members JSONB DEFAULT '[]'::jsonb,
        event_date VARCHAR(50) NOT NULL,
        days_active INTEGER DEFAULT 0,
        why_tree JSONB DEFAULT '[]'::jsonb,
        eight_d JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 2. ci_rca_evidence
        await client.query(`
      CREATE TABLE IF NOT EXISTS ci_rca_evidence (
        id VARCHAR(100) PRIMARY KEY,
        rca_id VARCHAR(100) NOT NULL,
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        details TEXT NOT NULL,
        file_url TEXT,
        uploaded_by VARCHAR(255) NOT NULL,
        date VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 3. ci_rca_hypotheses
        await client.query(`
      CREATE TABLE IF NOT EXISTS ci_rca_hypotheses (
        id VARCHAR(100) PRIMARY KEY,
        rca_id VARCHAR(100) NOT NULL,
        statement TEXT NOT NULL,
        test_method TEXT NOT NULL,
        evidence_result TEXT,
        validation_status VARCHAR(100) NOT NULL DEFAULT 'In Progress',
        validated_by VARCHAR(255),
        validated_at VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 4. ci_capa_actions
        await client.query(`
      CREATE TABLE IF NOT EXISTS ci_capa_actions (
        id VARCHAR(100) PRIMARY KEY,
        rca_id VARCHAR(100),
        project_id VARCHAR(100),
        description TEXT NOT NULL,
        action_type VARCHAR(50) NOT NULL DEFAULT 'Corrective',
        owner VARCHAR(255) NOT NULL,
        due_date VARCHAR(50) NOT NULL,
        priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
        status VARCHAR(50) NOT NULL DEFAULT 'Open',
        completion_date VARCHAR(50),
        evidence_notes TEXT,
        effectiveness_result TEXT,
        verified_by VARCHAR(255),
        verified_at VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 5. ci_projects
        await client.query(`
      CREATE TABLE IF NOT EXISTS ci_projects (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL DEFAULT 'Kaizen Event',
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        line_id VARCHAR(100) NOT NULL,
        asset_id VARCHAR(100),
        linked_rca_id VARCHAR(100),
        sponsor VARCHAR(255) NOT NULL,
        owner VARCHAR(255) NOT NULL,
        start_date VARCHAR(50) NOT NULL,
        target_date VARCHAR(50) NOT NULL,
        status VARCHAR(100) NOT NULL DEFAULT 'In Progress',
        progress INTEGER NOT NULL DEFAULT 0,
        baseline_metric VARCHAR(255) NOT NULL,
        target_metric VARCHAR(255) NOT NULL,
        current_metric VARCHAR(255) NOT NULL,
        projected_savings_annual NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        realized_savings_ytd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        benefit_status VARCHAR(100) NOT NULL DEFAULT 'Draft',
        locked_by VARCHAR(255),
        locked_at VARCHAR(50),
        unlock_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 6. ci_losses
        await client.query(`
      CREATE TABLE IF NOT EXISTS ci_losses (
        id VARCHAR(100) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        line_id VARCHAR(100) NOT NULL,
        asset_id VARCHAR(100) NOT NULL,
        event_name VARCHAR(255) NOT NULL,
        hours_lost NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
        units_lost INTEGER NOT NULL DEFAULT 0,
        financial_impact_usd NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        linked_rca_id VARCHAR(100),
        linked_project_id VARCHAR(100),
        trend VARCHAR(50) NOT NULL DEFAULT 'Tracked',
        date VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 7. ci_standards
        await client.query(`
      CREATE TABLE IF NOT EXISTS ci_standards (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL DEFAULT 'Controlled SOP',
        version VARCHAR(50) NOT NULL DEFAULT 'v1.0',
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        line_id VARCHAR(100),
        asset_id VARCHAR(100),
        source_project_id VARCHAR(100),
        source_rca_id VARCHAR(100),
        owner VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        effective_date VARCHAR(50) NOT NULL,
        review_date VARCHAR(50) NOT NULL,
        approved_by VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 8. ci_verified_solutions
        await client.query(`
      CREATE TABLE IF NOT EXISTS ci_verified_solutions (
        id VARCHAR(100) PRIMARY KEY,
        asset_id VARCHAR(100) NOT NULL,
        asset_name VARCHAR(255) NOT NULL,
        failure_mode VARCHAR(255) NOT NULL,
        symptom TEXT NOT NULL,
        root_cause TEXT NOT NULL,
        solution_steps TEXT NOT NULL,
        parts_used VARCHAR(255),
        source_rca_id VARCHAR(100),
        verified_by VARCHAR(255) NOT NULL,
        verified_date VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Published',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 9. ci_capex_projects
        await client.query(`
      CREATE TABLE IF NOT EXISTS ci_capex_projects (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        line_id VARCHAR(100) NOT NULL,
        asset_id VARCHAR(100) NOT NULL,
        linked_rca_id VARCHAR(100),
        linked_project_id VARCHAR(100),
        budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        estimated_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        actual_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        engineering_justification TEXT NOT NULL,
        status VARCHAR(100) NOT NULL DEFAULT 'Budget Approved',
        owner VARCHAR(255) NOT NULL,
        target_commission_date VARCHAR(50) NOT NULL,
        dossier_ref VARCHAR(100) NOT NULL,
        approval_status VARCHAR(100) NOT NULL DEFAULT 'Approved by Plant GM',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        // 10. ci_reliability_records
        await client.query(`
      CREATE TABLE IF NOT EXISTS ci_reliability_records (
        id VARCHAR(100) PRIMARY KEY,
        asset_id VARCHAR(100) NOT NULL,
        asset_name VARCHAR(255) NOT NULL,
        line_id VARCHAR(100) NOT NULL,
        line_name VARCHAR(255) NOT NULL,
        plant_id VARCHAR(100) NOT NULL DEFAULT 'PLT-01',
        failures_count INTEGER NOT NULL DEFAULT 0,
        total_downtime_min INTEGER NOT NULL DEFAULT 0,
        mtbf_hrs INTEGER NOT NULL DEFAULT 0,
        mttr_min INTEGER NOT NULL DEFAULT 0,
        last_failure_date VARCHAR(50) NOT NULL,
        failure_category VARCHAR(100) NOT NULL,
        criticality VARCHAR(50) NOT NULL DEFAULT 'Medium',
        is_bad_actor BOOLEAN NOT NULL DEFAULT FALSE,
        bad_actor_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);
        await client.query('COMMIT');
        console.log('✅ Successfully created all 10 CI tables in PostgreSQL database.');
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error during CI migration:', err);
        throw err;
    }
    finally {
        client.release();
    }
}
migrateCI()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
//# sourceMappingURL=migrate-ci.js.map