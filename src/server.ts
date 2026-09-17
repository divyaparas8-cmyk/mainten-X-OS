import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { checkDatabaseConnection } from "./config/database.js";
import { migrateIntegrations } from "./migrate-integrations.js";
import { runQualitySanitationMigration } from "./db/migrate-quality-sanitation.js";
import { runQualityChecksMigration } from "./db/migrate-quality-checks.js";
import { runQualityEventsMigration } from "./db/migrate-quality-events.js";
import { runBatchQualityMigration } from "./db/migrate-batch-quality.js";
import { runQaReleaseMigration } from "./db/migrate-qa-release.js";
import { runQaDispositionMigration } from "./db/migrate-qa-disposition.js";
import { runQaGovernanceMigration } from "./db/migrate-qa-governance.js";

async function start() {
  const app = await buildApp();

  // Check database connection
  await checkDatabaseConnection();

  // Ensure third-party & IoT schema migrations (e.g. machine_telemetry, iot_gateways) are applied
  try {
    await migrateIntegrations();
  } catch (err: any) {
    console.warn("⚠️ Integrations auto-migration check warning:", err.message);
  }

  // Ensure Quality & Sanitation DB tables (preop_checks, sanitation_cip_steps, allergen_audits, line_readiness, cleaning_verifications) are verified
  try {
    await runQualitySanitationMigration();
  } catch (err: any) {
    console.warn("⚠️ Quality & Sanitation auto-migration check warning:", err.message);
  }

  // Ensure Quality Checks DB tables (ccp_checks, process_checks, quality_specs) are verified
  try {
    await runQualityChecksMigration();
  } catch (err: any) {
    console.warn("⚠️ Quality Checks auto-migration check warning:", err.message);
  }

  // Ensure Quality Events DB tables (deviations, quality_holds, ncrs, quality_investigations) are verified
  try {
    await runQualityEventsMigration();
  } catch (err: any) {
    console.warn("⚠️ Quality Events auto-migration check warning:", err.message);
  }

  // Ensure Batch Quality DB tables (batch_quality_reviews, batch_history, batch_quality_records) are verified
  try {
    await runBatchQualityMigration();
  } catch (err: any) {
    console.warn("⚠️ Batch Quality auto-migration check warning:", err.message);
  }

  // Ensure QA Release DB tables (qa_release_queue, qa_approved_releases, quality_holds) are verified
  try {
    await runQaReleaseMigration();
  } catch (err: any) {
    console.warn("⚠️ QA Release auto-migration check warning:", err.message);
  }

  // Ensure QA Disposition DB tables (qa_disposition_records) are verified
  try {
    await runQaDispositionMigration();
  } catch (err: any) {
    console.warn("⚠️ QA Disposition auto-migration check warning:", err.message);
  }

  // Ensure QA Governance DB tables (capa_records, qa_audit_trail, qa_reports, qa_notifications, qa_profiles) are verified
  try {
    await runQaGovernanceMigration();
  } catch (err: any) {
    console.warn("⚠️ QA Governance auto-migration check warning:", err.message);
  }

  try {
    const address = await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    console.log(`
  🚀 ==========================================================
  🏭 MAINTENX OS — MANUFACTURING OPERATIONS BACKEND ACTIVE
  📡 Server listening on: ${address}
  📚 OpenAPI Swagger Docs: http://localhost:${env.PORT}/docs
  ❤️ Health Check:        http://localhost:${env.PORT}/health
  ==========================================================
    `);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Graceful Shutdown
  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  for (const signal of signals) {
    process.on(signal, async () => {
      console.log(`\n🛑 Received ${signal}, closing server gracefully...`);
      await app.close();
      process.exit(0);
    });
  }
}

start();
