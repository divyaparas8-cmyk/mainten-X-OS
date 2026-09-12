import Fastify, { FastifyInstance } from "fastify";
import corsPlugin from "./plugins/cors.js";
import helmetPlugin from "./plugins/helmet.js";
import jwtPlugin from "./plugins/jwt.js";
import swaggerPlugin from "./plugins/swagger.js";
import rateLimitPlugin from "./plugins/rateLimit.js";
import { errorHandler } from "./plugins/errorHandler.js";

// Domain Routes
import { authRoutes } from "./modules/auth/auth.routes.js";
import { masterDataRoutes } from "./modules/master-data/masterData.routes.js";
import { planningRoutes } from "./modules/planning/planning.routes.js";
import { productionRoutes } from "./modules/production/production.routes.js";
import { qualityRoutes } from "./modules/quality/quality.routes.js";
import { warehouseRoutes } from "./modules/warehouse/warehouse.routes.js";
import { traceabilityRoutes } from "./modules/traceability/traceability.routes.js";
import { maintenanceRoutes } from "./modules/maintenance/maintenance.routes.js";
import { dashboardsRoutes } from "./modules/dashboards/dashboards.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { notificationsRoutes } from "./modules/notifications/notifications.routes.js";
import { searchRoutes } from "./modules/search/search.routes.js";
import { executiveRoutes } from "./modules/executive/executive.routes.js";
import { ciRoutes } from "./modules/ci/ci.routes.js";
import { exceptionsRoutes } from "./modules/exceptions/exceptions.routes.js";
import { aiRoutes } from "./modules/ai/ai.routes.js";
import { billingRoutes } from "./modules/billing/billing.routes.js";
import { iotRoutes } from "./modules/iot/iot.routes.js";
import { masterRoutes } from "./modules/master/master.routes.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
    },
  });

  // Allow empty or null body on JSON content type without throwing FST_ERR_CTP_EMPTY_JSON_BODY
  app.addContentTypeParser("application/json", { parseAs: "string" }, (_req, body: string, done) => {
    if (!body || body.trim().length === 0) {
      done(null, {});
      return;
    }
    try {
      const json = JSON.parse(body);
      done(null, json);
    } catch (err: any) {
      err.statusCode = 400;
      done(err, undefined);
    }
  });

  // 1. Core Plugins
  await app.register(corsPlugin);
  await app.register(helmetPlugin);
  await app.register(jwtPlugin);
  await app.register(rateLimitPlugin);
  await app.register(swaggerPlugin);

  // 2. Global Error Handler
  app.setErrorHandler(errorHandler);

  // 3. Health Check
  app.get("/health", async () => {
    return {
      status: "ok",
      service: "MaintenX OS Backend",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    };
  });

  // 4. API Domain Routes (Supporting both /api/v1 and /api prefixes)
  const apiPrefixes = ["/api/v1", "/api"];
  for (const prefix of apiPrefixes) {
    await app.register(authRoutes, { prefix: `${prefix}/auth` });
    await app.register(adminRoutes, { prefix: `${prefix}/admin` });
    await app.register(masterDataRoutes, { prefix: `${prefix}/master-data` });
    await app.register(planningRoutes, { prefix: `${prefix}/planning` });
    await app.register(planningRoutes, { prefix: `${prefix}/planner` });
    await app.register(planningRoutes, { prefix: prefix });
    await app.register(dashboardsRoutes, { prefix: `${prefix}/plant-manager` });
    await app.register(productionRoutes, { prefix: `${prefix}/production` });
    await app.register(qualityRoutes, { prefix: `${prefix}/quality` });
    await app.register(warehouseRoutes, { prefix: `${prefix}/warehouse` });
    await app.register(traceabilityRoutes, { prefix: `${prefix}/traceability` });
    await app.register(maintenanceRoutes, { prefix: `${prefix}/maintenance` });
    await app.register(dashboardsRoutes, { prefix: `${prefix}/dashboards` });
    await app.register(executiveRoutes, { prefix: `${prefix}/executive` });
    await app.register(executiveRoutes, { prefix: `${prefix}/dashboards/executive` });
    await app.register(notificationsRoutes, { prefix: `${prefix}/notifications` });
    await app.register(searchRoutes, { prefix: `${prefix}/search` });
    await app.register(ciRoutes, { prefix: `${prefix}/ci` });
    await app.register(exceptionsRoutes, { prefix: `${prefix}/exceptions` });
    await app.register(aiRoutes, { prefix: `${prefix}/ai` });
    await app.register(billingRoutes, { prefix: `${prefix}/billing` });
    await app.register(iotRoutes, { prefix: `${prefix}/iot` });
    await app.register(masterRoutes, { prefix: `${prefix}/master` });
  }


  return app;
}
