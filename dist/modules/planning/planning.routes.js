"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planningRoutes = planningRoutes;
const planning_controller_js_1 = require("./planning.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function planningRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    // Demand & Forecast
    fastify.get("/demand/orders", { schema: { tags: ["Planning & Demand"], summary: "List Customer Demand Orders" } }, planning_controller_js_1.planningController.getCustomerOrders.bind(planning_controller_js_1.planningController));
    fastify.post("/demand/orders", { schema: { tags: ["Planning & Demand"], summary: "Create Customer Demand Order" } }, planning_controller_js_1.planningController.createCustomerOrder.bind(planning_controller_js_1.planningController));
    fastify.post("/forecast/run", { schema: { tags: ["Planning & Demand"], summary: "Execute Statistical Forecast Engine" } }, planning_controller_js_1.planningController.runForecast.bind(planning_controller_js_1.planningController));
    fastify.get("/aps/schedules", { schema: { tags: ["Planning & Demand"], summary: "List Multi-Line APS Gantt Schedules" } }, planning_controller_js_1.planningController.getApsSchedules.bind(planning_controller_js_1.planningController));
    fastify.post("/aps/schedules", { schema: { tags: ["Planning & Demand"], summary: "Publish APS Schedule" } }, planning_controller_js_1.planningController.createApsSchedule.bind(planning_controller_js_1.planningController));
    fastify.get("/mrp/net-requirements", { schema: { tags: ["Planning & Demand"], summary: "Calculate MRP Net Requirements & Shortages" } }, planning_controller_js_1.planningController.getMrpExplosion.bind(planning_controller_js_1.planningController));
    fastify.post("/mrp/net-requirements", { schema: { tags: ["Planning & Demand"], summary: "Calculate MRP Net Requirements & Shortages" } }, planning_controller_js_1.planningController.getMrpExplosion.bind(planning_controller_js_1.planningController));
    // Plant Manager Master Production Schedule (MPS)
    fastify.get("/schedule", { schema: { tags: ["Planning & Demand"], summary: "List Master Production Schedules" } }, planning_controller_js_1.planningController.getSchedules.bind(planning_controller_js_1.planningController));
    fastify.post("/schedule", { schema: { tags: ["Planning & Demand"], summary: "Create Master Production Schedule Run" } }, planning_controller_js_1.planningController.createSchedule.bind(planning_controller_js_1.planningController));
    fastify.patch("/schedule/:id/lock", { schema: { tags: ["Planning & Demand"], summary: "Toggle Lock on Schedule Run" } }, planning_controller_js_1.planningController.toggleScheduleLock.bind(planning_controller_js_1.planningController));
    fastify.delete("/schedule/:id", { schema: { tags: ["Planning & Demand"], summary: "Delete Schedule Run" } }, planning_controller_js_1.planningController.deleteSchedule.bind(planning_controller_js_1.planningController));
    // Capacity & Constraints
    fastify.get("/capacity", { schema: { tags: ["Planning & Demand"], summary: "List Line Capacity Utilization" } }, planning_controller_js_1.planningController.getCapacity.bind(planning_controller_js_1.planningController));
    fastify.get("/constraints", { schema: { tags: ["Planning & Demand"], summary: "List Finite Planning Constraints" } }, planning_controller_js_1.planningController.getConstraints.bind(planning_controller_js_1.planningController));
    fastify.post("/constraints", { schema: { tags: ["Planning & Demand"], summary: "Create Planning Constraint" } }, planning_controller_js_1.planningController.createConstraint.bind(planning_controller_js_1.planningController));
    fastify.patch("/constraints/:id/resolve", { schema: { tags: ["Planning & Demand"], summary: "Mark Planning Constraint Resolved" } }, planning_controller_js_1.planningController.resolveConstraint.bind(planning_controller_js_1.planningController));
    fastify.delete("/constraints/:id", { schema: { tags: ["Planning & Demand"], summary: "Delete Planning Constraint" } }, planning_controller_js_1.planningController.deleteConstraint.bind(planning_controller_js_1.planningController));
    // Recovery Simulator
    fastify.post("/recovery/apply", { schema: { tags: ["Planning & Demand"], summary: "Apply Recovery Simulator Scenario" } }, planning_controller_js_1.planningController.applyRecovery.bind(planning_controller_js_1.planningController));
}
//# sourceMappingURL=planning.routes.js.map