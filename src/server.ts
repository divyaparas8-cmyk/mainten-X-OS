import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { checkDatabaseConnection, db } from "./config/database.js";
import { migrateIntegrations } from "./migrate-integrations.js";
import { runDatabaseSeed } from "./db/seed.js";
import { users } from "./db/schema/index.js";

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

  // Auto-seed: if no users exist in database, initialize comprehensive seed
  try {
    const [existingUser] = await db.select({ id: users.id }).from(users).limit(1);
    if (!existingUser) {
      console.log("🌱 No users detected in database. Running auto-seed for all 12 roles & dashboards...");
      await runDatabaseSeed();
      console.log("✅ Auto-seed completed successfully. All dashboards ready.");
    }
  } catch (seedErr: any) {
    console.warn("⚠️ Auto-seed check warning:", seedErr.message);
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
