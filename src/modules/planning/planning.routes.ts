import { FastifyInstance } from "fastify";
import { planningController } from "./planning.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function planningRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // Demand & Forecast
  fastify.get("/demand/orders", { schema: { tags: ["Planning & Demand"], summary: "List Customer Demand Orders" } }, planningController.getCustomerOrders.bind(planningController));
  fastify.post("/demand/orders", { schema: { tags: ["Planning & Demand"], summary: "Create Customer Demand Order" } }, planningController.createCustomerOrder.bind(planningController));
  fastify.post("/forecast/run", { schema: { tags: ["Planning & Demand"], summary: "Execute Statistical Forecast Engine" } }, planningController.runForecast.bind(planningController));
  fastify.get("/aps/schedules", { schema: { tags: ["Planning & Demand"], summary: "List Multi-Line APS Gantt Schedules" } }, planningController.getApsSchedules.bind(planningController));
  fastify.post("/aps/schedules", { schema: { tags: ["Planning & Demand"], summary: "Publish APS Schedule" } }, planningController.createApsSchedule.bind(planningController));
  fastify.get("/mrp/net-requirements", { schema: { tags: ["Planning & Demand"], summary: "Calculate MRP Net Requirements & Shortages" } }, planningController.getMrpExplosion.bind(planningController));
  fastify.post("/mrp/net-requirements", { schema: { tags: ["Planning & Demand"], summary: "Calculate MRP Net Requirements & Shortages" } }, planningController.getMrpExplosion.bind(planningController));

  // Plant Manager Master Production Schedule (MPS)
  fastify.get("/schedule", { schema: { tags: ["Planning & Demand"], summary: "List Master Production Schedules" } }, planningController.getSchedules.bind(planningController));
  fastify.post("/schedule", { schema: { tags: ["Planning & Demand"], summary: "Create Master Production Schedule Run" } }, planningController.createSchedule.bind(planningController));
  fastify.patch("/schedule/:id/lock", { schema: { tags: ["Planning & Demand"], summary: "Toggle Lock on Schedule Run" } }, planningController.toggleScheduleLock.bind(planningController));
  fastify.delete("/schedule/:id", { schema: { tags: ["Planning & Demand"], summary: "Delete Schedule Run" } }, planningController.deleteSchedule.bind(planningController));

  // Capacity & Constraints
  fastify.get("/capacity", { schema: { tags: ["Planning & Demand"], summary: "List Line Capacity Utilization" } }, planningController.getCapacity.bind(planningController));
  fastify.get("/constraints", { schema: { tags: ["Planning & Demand"], summary: "List Finite Planning Constraints" } }, planningController.getConstraints.bind(planningController));
  fastify.post("/constraints", { schema: { tags: ["Planning & Demand"], summary: "Create Planning Constraint" } }, planningController.createConstraint.bind(planningController));
  fastify.patch("/constraints/:id/resolve", { schema: { tags: ["Planning & Demand"], summary: "Mark Planning Constraint Resolved" } }, planningController.resolveConstraint.bind(planningController));
  fastify.delete("/constraints/:id", { schema: { tags: ["Planning & Demand"], summary: "Delete Planning Constraint" } }, planningController.deleteConstraint.bind(planningController));

  // Recovery Simulator
  fastify.post("/recovery/apply", { schema: { tags: ["Planning & Demand"], summary: "Apply Recovery Simulator Scenario" } }, planningController.applyRecovery.bind(planningController));
}
