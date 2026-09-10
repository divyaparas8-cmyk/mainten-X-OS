import { FastifyInstance } from "fastify";
import { planningController } from "./planning.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function planningRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/demand/orders", { schema: { tags: ["Planning & Demand"], summary: "List Customer Demand Orders" } }, planningController.getCustomerOrders.bind(planningController));
  fastify.post("/demand/orders", { schema: { tags: ["Planning & Demand"], summary: "Create Customer Demand Order" } }, planningController.createCustomerOrder.bind(planningController));
  fastify.put("/demand/orders/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Customer Demand Order" } }, planningController.updateCustomerOrder.bind(planningController));
  fastify.delete("/demand/orders/:id", { schema: { tags: ["Planning & Demand"], summary: "Delete Customer Demand Order" } }, planningController.deleteCustomerOrder.bind(planningController));
  fastify.post("/forecast/run", { schema: { tags: ["Planning & Demand"], summary: "Execute Statistical Forecast Engine" } }, planningController.runForecast.bind(planningController));
  fastify.get("/forecasts", { schema: { tags: ["Planning & Demand"], summary: "List Saved Forecasts from Database" } }, planningController.getForecasts.bind(planningController));
  fastify.get("/aps/schedules", { schema: { tags: ["Planning & Demand"], summary: "List Multi-Line APS Gantt Schedules" } }, planningController.getApsSchedules.bind(planningController));
  fastify.post("/aps/schedules", { schema: { tags: ["Planning & Demand"], summary: "Publish APS Schedule" } }, planningController.createApsSchedule.bind(planningController));
  fastify.get("/mrp/net-requirements", { schema: { tags: ["Planning & Demand"], summary: "Calculate MRP Net Requirements & Shortages" } }, planningController.getMrpExplosion.bind(planningController));
  fastify.post("/mrp/net-requirements", { schema: { tags: ["Planning & Demand"], summary: "Calculate MRP Net Requirements & Shortages" } }, planningController.getMrpExplosion.bind(planningController));
  fastify.get("/promotions", { schema: { tags: ["Planning & Demand"], summary: "List Promotion Campaigns" } }, planningController.getPromotionCampaigns.bind(planningController));
  fastify.post("/promotions", { schema: { tags: ["Planning & Demand"], summary: "Create Promotion Campaign" } }, planningController.createPromotionCampaign.bind(planningController));
  fastify.put("/promotions/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Promotion Campaign" } }, planningController.updatePromotionCampaign.bind(planningController));
  fastify.delete("/promotions/:id", { schema: { tags: ["Planning & Demand"], summary: "Delete Promotion Campaign" } }, planningController.deletePromotionCampaign.bind(planningController));
}
