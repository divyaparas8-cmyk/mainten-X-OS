"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planningRoutes = planningRoutes;
const planning_controller_js_1 = require("./planning.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function planningRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    fastify.get("/demand/orders", { schema: { tags: ["Planning & Demand"], summary: "List Customer Demand Orders" } }, planning_controller_js_1.planningController.getCustomerOrders.bind(planning_controller_js_1.planningController));
    fastify.post("/demand/orders", { schema: { tags: ["Planning & Demand"], summary: "Create Customer Demand Order" } }, planning_controller_js_1.planningController.createCustomerOrder.bind(planning_controller_js_1.planningController));
    fastify.post("/forecast/run", { schema: { tags: ["Planning & Demand"], summary: "Execute Statistical Forecast Engine" } }, planning_controller_js_1.planningController.runForecast.bind(planning_controller_js_1.planningController));
    fastify.get("/aps/schedules", { schema: { tags: ["Planning & Demand"], summary: "List Multi-Line APS Gantt Schedules" } }, planning_controller_js_1.planningController.getApsSchedules.bind(planning_controller_js_1.planningController));
    fastify.post("/aps/schedules", { schema: { tags: ["Planning & Demand"], summary: "Publish APS Schedule" } }, planning_controller_js_1.planningController.createApsSchedule.bind(planning_controller_js_1.planningController));
    fastify.get("/mrp/net-requirements", { schema: { tags: ["Planning & Demand"], summary: "Calculate MRP Net Requirements & Shortages" } }, planning_controller_js_1.planningController.getMrpExplosion.bind(planning_controller_js_1.planningController));
}
//# sourceMappingURL=planning.routes.js.map