"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardsRoutes = dashboardsRoutes;
const dashboards_controller_js_1 = require("./dashboards.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function dashboardsRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    fastify.get("/command-center", { schema: { tags: ["Dashboards & Executive"], summary: "Get Plant Manager Command Center Overview" } }, dashboards_controller_js_1.dashboardsController.getCommandCenter.bind(dashboards_controller_js_1.dashboardsController));
    fastify.get("/kpis", { schema: { tags: ["Dashboards & Executive"], summary: "Get Executive KPI Scorecard" } }, dashboards_controller_js_1.dashboardsController.getKPIs.bind(dashboards_controller_js_1.dashboardsController));
}
//# sourceMappingURL=dashboards.routes.js.map