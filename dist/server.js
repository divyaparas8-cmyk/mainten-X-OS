"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const env_js_1 = require("./config/env.js");
const database_js_1 = require("./config/database.js");
async function start() {
    const app = await (0, app_js_1.buildApp)();
    // Check database connection
    await (0, database_js_1.checkDatabaseConnection)();
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