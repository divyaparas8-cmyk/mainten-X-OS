"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const cors_js_1 = __importDefault(require("./plugins/cors.js"));
const helmet_js_1 = __importDefault(require("./plugins/helmet.js"));
const jwt_js_1 = __importDefault(require("./plugins/jwt.js"));
const swagger_js_1 = __importDefault(require("./plugins/swagger.js"));
const rateLimit_js_1 = __importDefault(require("./plugins/rateLimit.js"));
const errorHandler_js_1 = require("./plugins/errorHandler.js");
// Domain Routes
const auth_routes_js_1 = require("./modules/auth/auth.routes.js");
const masterData_routes_js_1 = require("./modules/master-data/masterData.routes.js");
const planning_routes_js_1 = require("./modules/planning/planning.routes.js");
const production_routes_js_1 = require("./modules/production/production.routes.js");
const quality_routes_js_1 = require("./modules/quality/quality.routes.js");
const warehouse_routes_js_1 = require("./modules/warehouse/warehouse.routes.js");
const traceability_routes_js_1 = require("./modules/traceability/traceability.routes.js");
const maintenance_routes_js_1 = require("./modules/maintenance/maintenance.routes.js");
const dashboards_routes_js_1 = require("./modules/dashboards/dashboards.routes.js");
const admin_routes_js_1 = require("./modules/admin/admin.routes.js");
const notifications_routes_js_1 = require("./modules/notifications/notifications.routes.js");
const search_routes_js_1 = require("./modules/search/search.routes.js");
const ci_routes_js_1 = require("./modules/ci/ci.routes.js");
const exceptions_routes_js_1 = require("./modules/exceptions/exceptions.routes.js");
const ai_routes_js_1 = require("./modules/ai/ai.routes.js");
async function buildApp() {
    const app = (0, fastify_1.default)({
        logger: {
            level: process.env.LOG_LEVEL || "info",
        },
    });
    // Allow empty or null body on JSON content type without throwing FST_ERR_CTP_EMPTY_JSON_BODY
    app.addContentTypeParser("application/json", { parseAs: "string" }, (_req, body, done) => {
        if (!body || body.trim().length === 0) {
            done(null, undefined);
            return;
        }
        try {
            const json = JSON.parse(body);
            done(null, json);
        }
        catch (err) {
            err.statusCode = 400;
            done(err, undefined);
        }
    });
    // 1. Core Plugins
    await app.register(cors_js_1.default);
    await app.register(helmet_js_1.default);
    await app.register(jwt_js_1.default);
    await app.register(rateLimit_js_1.default);
    await app.register(swagger_js_1.default);
    // 2. Global Error Handler
    app.setErrorHandler(errorHandler_js_1.errorHandler);
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
    await app.register(auth_routes_js_1.authRoutes, { prefix: "/api/v1/auth" });
    await app.register(admin_routes_js_1.adminRoutes, { prefix: "/api/v1/admin" });
    await app.register(masterData_routes_js_1.masterDataRoutes, { prefix: "/api/v1/master-data" });
    await app.register(planning_routes_js_1.planningRoutes, { prefix: "/api/v1/planning" });
    await app.register(production_routes_js_1.productionRoutes, { prefix: "/api/v1/production" });
    await app.register(quality_routes_js_1.qualityRoutes, { prefix: "/api/v1/quality" });
    await app.register(warehouse_routes_js_1.warehouseRoutes, { prefix: "/api/v1/warehouse" });
    await app.register(traceability_routes_js_1.traceabilityRoutes, { prefix: "/api/v1/traceability" });
    await app.register(maintenance_routes_js_1.maintenanceRoutes, { prefix: "/api/v1/maintenance" });
    await app.register(dashboards_routes_js_1.dashboardsRoutes, { prefix: "/api/v1/dashboards" });
    await app.register(notifications_routes_js_1.notificationsRoutes, { prefix: "/api/v1/notifications" });
    await app.register(search_routes_js_1.searchRoutes, { prefix: "/api/v1/search" });
    await app.register(ci_routes_js_1.ciRoutes, { prefix: "/api/v1/ci" });
    await app.register(exceptions_routes_js_1.exceptionsRoutes, { prefix: "/api/v1/exceptions" });
    await app.register(ai_routes_js_1.aiRoutes, { prefix: "/api/v1/ai" });
    return app;
}
//# sourceMappingURL=app.js.map