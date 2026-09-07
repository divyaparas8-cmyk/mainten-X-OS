import { FastifyInstance } from "fastify";
import { maintenanceController } from "./maintenance.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function maintenanceRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/work-orders", { schema: { tags: ["Maintenance & CMMS"], summary: "List Work Orders" } }, maintenanceController.getWorkOrders.bind(maintenanceController));
  fastify.post("/work-orders", { schema: { tags: ["Maintenance & CMMS"], summary: "Create Work Order" } }, maintenanceController.createWorkOrder.bind(maintenanceController));
  fastify.patch("/work-orders/:id/status", { schema: { tags: ["Maintenance & CMMS"], summary: "Advance Work Order Status" } }, maintenanceController.updateWorkOrderStatus.bind(maintenanceController));

  fastify.get("/pm-schedules", { schema: { tags: ["Maintenance & CMMS"], summary: "List Preventive Maintenance Schedules" } }, maintenanceController.getPMSchedules.bind(maintenanceController));
  fastify.get("/spare-parts", { schema: { tags: ["Maintenance & CMMS"], summary: "List Spare Parts Inventory" } }, maintenanceController.getSpareParts.bind(maintenanceController));
  fastify.get("/reliability", { schema: { tags: ["Maintenance & CMMS"], summary: "Get Plant MTBF & Reliability Metrics" } }, maintenanceController.getReliabilityMetrics.bind(maintenanceController));
}
