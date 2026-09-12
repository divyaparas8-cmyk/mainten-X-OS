"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const env_js_1 = require("./config/env.js");
const database_js_1 = require("./config/database.js");
const migrate_integrations_js_1 = require("./migrate-integrations.js");
const seed_js_1 = require("./db/seed.js");
const index_js_1 = require("./db/schema/index.js");
async function start() {
    const app = await (0, app_js_1.buildApp)();
    // Check database connection
    await (0, database_js_1.checkDatabaseConnection)();
    // Ensure third-party & IoT schema migrations (e.g. machine_telemetry, iot_gateways) are applied
    try {
        await (0, migrate_integrations_js_1.migrateIntegrations)();
    }
    catch (err) {
        console.warn("⚠️ Integrations auto-migration check warning:", err.message);
    }
    // Auto-seed: if no users exist in database, initialize comprehensive seed
    try {
        const [existingUser] = await database_js_1.db.select({ id: index_js_1.users.id }).from(index_js_1.users).limit(1);
        if (!existingUser) {
            console.log("🌱 No users detected in database. Running auto-seed for all 12 roles & dashboards...");
            await (0, seed_js_1.runDatabaseSeed)();
            console.log("✅ Auto-seed completed successfully. All dashboards ready.");
        }
    }
    catch (seedErr) {
        console.warn("⚠️ Auto-seed check warning:", seedErr.message);
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
//# sourceMappingURL=server.js.map