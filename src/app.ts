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

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
    },
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

  // 4. API v1 Domain Routes
  await app.register(authRoutes, { prefix: "/api/v1/auth" });
  await app.register(adminRoutes, { prefix: "/api/v1/admin" });
  await app.register(masterDataRoutes, { prefix: "/api/v1/master-data" });
  await app.register(planningRoutes, { prefix: "/api/v1/planning" });
  await app.register(productionRoutes, { prefix: "/api/v1/production" });
  await app.register(qualityRoutes, { prefix: "/api/v1/quality" });
  await app.register(warehouseRoutes, { prefix: "/api/v1/warehouse" });
  await app.register(traceabilityRoutes, { prefix: "/api/v1/traceability" });
  await app.register(maintenanceRoutes, { prefix: "/api/v1/maintenance" });
  await app.register(dashboardsRoutes, { prefix: "/api/v1/dashboards" });
  await app.register(notificationsRoutes, { prefix: "/api/v1/notifications" });
  await app.register(searchRoutes, { prefix: "/api/v1/search" });

  return app;
}
