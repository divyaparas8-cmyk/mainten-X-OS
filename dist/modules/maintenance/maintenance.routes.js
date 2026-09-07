"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceRoutes = maintenanceRoutes;
const maintenance_controller_js_1 = require("./maintenance.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function maintenanceRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    fastify.get("/work-orders", { schema: { tags: ["Maintenance & CMMS"], summary: "List Work Orders" } }, maintenance_controller_js_1.maintenanceController.getWorkOrders.bind(maintenance_controller_js_1.maintenanceController));
    fastify.post("/work-orders", { schema: { tags: ["Maintenance & CMMS"], summary: "Create Work Order" } }, maintenance_controller_js_1.maintenanceController.createWorkOrder.bind(maintenance_controller_js_1.maintenanceController));
    fastify.patch("/work-orders/:id/status", { schema: { tags: ["Maintenance & CMMS"], summary: "Advance Work Order Status" } }, maintenance_controller_js_1.maintenanceController.updateWorkOrderStatus.bind(maintenance_controller_js_1.maintenanceController));
    fastify.get("/pm-schedules", { schema: { tags: ["Maintenance & CMMS"], summary: "List Preventive Maintenance Schedules" } }, maintenance_controller_js_1.maintenanceController.getPMSchedules.bind(maintenance_controller_js_1.maintenanceController));
    fastify.get("/spare-parts", { schema: { tags: ["Maintenance & CMMS"], summary: "List Spare Parts Inventory" } }, maintenance_controller_js_1.maintenanceController.getSpareParts.bind(maintenance_controller_js_1.maintenanceController));
    fastify.get("/reliability", { schema: { tags: ["Maintenance & CMMS"], summary: "Get Plant MTBF & Reliability Metrics" } }, maintenance_controller_js_1.maintenanceController.getReliabilityMetrics.bind(maintenance_controller_js_1.maintenanceController));
}
//# sourceMappingURL=maintenance.routes.js.map