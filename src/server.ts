import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { checkDatabaseConnection } from "./config/database.js";

async function start() {
  const app = await buildApp();

  // Check database connection
  await checkDatabaseConnection();

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
