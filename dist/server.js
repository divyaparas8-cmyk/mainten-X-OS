"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const env_js_1 = require("./config/env.js");
const database_js_1 = require("./config/database.js");
const migrate_integrations_js_1 = require("./migrate-integrations.js");
const migrate_quality_sanitation_js_1 = require("./db/migrate-quality-sanitation.js");
const migrate_quality_checks_js_1 = require("./db/migrate-quality-checks.js");
const migrate_quality_events_js_1 = require("./db/migrate-quality-events.js");
const migrate_batch_quality_js_1 = require("./db/migrate-batch-quality.js");
const migrate_qa_release_js_1 = require("./db/migrate-qa-release.js");
const migrate_qa_disposition_js_1 = require("./db/migrate-qa-disposition.js");
const migrate_qa_governance_js_1 = require("./db/migrate-qa-governance.js");
const migrate_maintenance_js_1 = require("./db/migrate-maintenance.js");
async function start() {
    const app = await (0, app_js_1.buildApp)();
    // Check database connection
    await (0, database_js_1.checkDatabaseConnection)();
    // Ensure Maintenance DB schema (assets columns, spare_parts, pm_schedules, notifications) are verified
    try {
        await (0, migrate_maintenance_js_1.runMaintenanceMigration)();
    }
    catch (err) {
        console.warn("⚠️ Maintenance auto-migration check warning:", err.message);
    }
    // Ensure third-party & IoT schema migrations (e.g. machine_telemetry, iot_gateways) are applied
    try {
        await (0, migrate_integrations_js_1.migrateIntegrations)();
    }
    catch (err) {
        console.warn("⚠️ Integrations auto-migration check warning:", err.message);
    }
    // Ensure Quality & Sanitation DB tables (preop_checks, sanitation_cip_steps, allergen_audits, line_readiness, cleaning_verifications) are verified
    try {
        await (0, migrate_quality_sanitation_js_1.runQualitySanitationMigration)();
    }
    catch (err) {
        console.warn("⚠️ Quality & Sanitation auto-migration check warning:", err.message);
    }
    // Ensure Quality Checks DB tables (ccp_checks, process_checks, quality_specs) are verified
    try {
        await (0, migrate_quality_checks_js_1.runQualityChecksMigration)();
    }
    catch (err) {
        console.warn("⚠️ Quality Checks auto-migration check warning:", err.message);
    }
    // Ensure Quality Events DB tables (deviations, quality_holds, ncrs, quality_investigations) are verified
    try {
        await (0, migrate_quality_events_js_1.runQualityEventsMigration)();
    }
    catch (err) {
        console.warn("⚠️ Quality Events auto-migration check warning:", err.message);
    }
    // Ensure Batch Quality DB tables (batch_quality_reviews, batch_history, batch_quality_records) are verified
    try {
        await (0, migrate_batch_quality_js_1.runBatchQualityMigration)();
    }
    catch (err) {
        console.warn("⚠️ Batch Quality auto-migration check warning:", err.message);
    }
    // Ensure QA Release DB tables (qa_release_queue, qa_approved_releases, quality_holds) are verified
    try {
        await (0, migrate_qa_release_js_1.runQaReleaseMigration)();
    }
    catch (err) {
        console.warn("⚠️ QA Release auto-migration check warning:", err.message);
    }
    // Ensure QA Disposition DB tables (qa_disposition_records) are verified
    try {
        await (0, migrate_qa_disposition_js_1.runQaDispositionMigration)();
    }
    catch (err) {
        console.warn("⚠️ QA Disposition auto-migration check warning:", err.message);
    }
    // Ensure QA Governance DB tables (capa_records, qa_audit_trail, qa_reports, qa_notifications, qa_profiles) are verified
    try {
        await (0, migrate_qa_governance_js_1.runQaGovernanceMigration)();
    }
    catch (err) {
        console.warn("⚠️ QA Governance auto-migration check warning:", err.message);
    }
    try {
        const address = await app.listen({
            port: env_js_1.env.PORT,
            host: env_js_1.env.HOST,
        });
        console.log(`
  🚀 ==========================================================
  🏭 MAINTENX OS — MANUFACTURING OPERATIONS BACKEND ACTIVE
  📡 Server listening on: ${address}
  📚 OpenAPI Swagger Docs: http://localhost:${env_js_1.env.PORT}/docs
  ❤️ Health Check:        http://localhost:${env_js_1.env.PORT}/health
  ==========================================================
    `);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
    // Graceful Shutdown
    const signals = ["SIGINT", "SIGTERM"];
    for (const signal of signals) {
        process.on(signal, async () => {
            console.log(`\n🛑 Received ${signal}, closing server gracefully...`);
            await app.close();
            process.exit(0);
        });
    }
}
start();
