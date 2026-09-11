import { FastifyInstance } from "fastify";
import { planningController } from "./planning.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function planningRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // Planning Command Center Dashboard KPI Summary
  fastify.get("/dashboard", { schema: { tags: ["Planning & Demand"], summary: "Planning Command Center Dashboard KPI Summary" } }, planningController.getPlanningDashboardSummary.bind(planningController));
  fastify.get("/summary", { schema: { tags: ["Planning & Demand"], summary: "Planning Command Center Dashboard KPI Summary" } }, planningController.getPlanningDashboardSummary.bind(planningController));

  // Demand & Forecast
  fastify.get("/demand/orders", { schema: { tags: ["Planning & Demand"], summary: "List Customer Demand Orders" } }, planningController.getCustomerOrders.bind(planningController));
  fastify.post("/demand/orders", { schema: { tags: ["Planning & Demand"], summary: "Create Customer Demand Order" } }, planningController.createCustomerOrder.bind(planningController));
  fastify.put("/demand/orders/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Customer Demand Order" } }, planningController.updateCustomerOrder.bind(planningController));
  fastify.patch("/demand/orders/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Customer Demand Order" } }, planningController.updateCustomerOrder.bind(planningController));
  fastify.delete("/demand/orders/:id", { schema: { tags: ["Planning & Demand"], summary: "Delete Customer Demand Order" } }, planningController.deleteCustomerOrder.bind(planningController));

  // Forecasts & Overrides CRUD
  fastify.get("/forecasts", { schema: { tags: ["Planning & Demand"], summary: "List Demand Forecasts & Overrides" } }, planningController.getForecasts.bind(planningController));
  fastify.post("/forecasts", { schema: { tags: ["Planning & Demand"], summary: "Create Demand Forecast Record" } }, planningController.createForecast.bind(planningController));
  fastify.patch("/forecasts/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Forecast / Manager Override" } }, planningController.updateForecast.bind(planningController));
  fastify.delete("/forecasts/:id", { schema: { tags: ["Planning & Demand"], summary: "Delete Forecast Record" } }, planningController.deleteForecast.bind(planningController));

  // Demand History & Accuracy
  fastify.get("/forecast/history", { schema: { tags: ["Planning & Demand"], summary: "List Historical Sales Demand & Model Accuracy" } }, planningController.getDemandHistory.bind(planningController));

  // Commercial Promotions & Uplift
  fastify.get("/forecast/promotions", { schema: { tags: ["Planning & Demand"], summary: "List Commercial Promotions & Uplift Events" } }, planningController.getPromotions.bind(planningController));
  fastify.post("/forecast/promotions", { schema: { tags: ["Planning & Demand"], summary: "Create Commercial Promotion Campaign" } }, planningController.createPromotion.bind(planningController));
  fastify.patch("/forecast/promotions/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Commercial Promotion Status" } }, planningController.updatePromotion.bind(planningController));

  // Shipments Outbound
  fastify.get("/shipments", { schema: { tags: ["Planning & Demand"], summary: "List Outbound Shipments" } }, planningController.getShipments.bind(planningController));
  fastify.post("/shipments", { schema: { tags: ["Planning & Demand"], summary: "Create/Book Outbound Shipment" } }, planningController.createShipment.bind(planningController));
  fastify.patch("/shipments/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Outbound Shipment Status" } }, planningController.updateShipmentStatus.bind(planningController));

  // Forecast Engine & APS & MRP
  fastify.post("/forecast/run", { schema: { tags: ["Planning & Demand"], summary: "Execute Statistical Forecast Engine" } }, planningController.runForecast.bind(planningController));
  fastify.get("/aps/schedules", { schema: { tags: ["Planning & Demand"], summary: "List Multi-Line APS Gantt Schedules" } }, planningController.getApsSchedules.bind(planningController));
  fastify.post("/aps/schedules", { schema: { tags: ["Planning & Demand"], summary: "Publish APS Schedule" } }, planningController.createApsSchedule.bind(planningController));
  fastify.patch("/aps/schedules/:id/reschedule", { schema: { tags: ["Planning & Demand"], summary: "Reschedule APS Order" } }, planningController.rescheduleApsSchedule.bind(planningController));
  fastify.post("/aps/reschedule", { schema: { tags: ["Planning & Demand"], summary: "Reschedule APS Order" } }, planningController.rescheduleApsSchedule.bind(planningController));
  fastify.post("/aps/schedules/:id/split", { schema: { tags: ["Planning & Demand"], summary: "Split APS Order" } }, planningController.splitApsSchedule.bind(planningController));
  fastify.post("/aps/split", { schema: { tags: ["Planning & Demand"], summary: "Split APS Order" } }, planningController.splitApsSchedule.bind(planningController));
  fastify.post("/aps/optimize", { schema: { tags: ["Planning & Demand"], summary: "Optimize APS Schedule Sequence to Minimize Changeovers" } }, planningController.optimizeApsSchedule.bind(planningController));
  fastify.get("/aps/capacity", { schema: { tags: ["Planning & Demand"], summary: "Get APS Finite Work Center Capacity Planning" } }, planningController.getCapacityCalculations.bind(planningController));
  fastify.get("/aps/work-centers", { schema: { tags: ["Planning & Demand"], summary: "Get Work Center Infrastructure & Asset Capabilities" } }, planningController.getWorkCenters.bind(planningController));
  fastify.get("/aps/changeovers", { schema: { tags: ["Planning & Demand"], summary: "Get APS Changeover Matrix & SMED Standardization" } }, planningController.getChangeovers.bind(planningController));
  fastify.post("/aps/changeovers", { schema: { tags: ["Planning & Demand"], summary: "Create APS Changeover Matrix Rule" } }, planningController.createChangeover.bind(planningController));
  fastify.get("/mrp/net-requirements", { schema: { tags: ["Planning & Demand"], summary: "Calculate MRP Net Requirements & Shortages" } }, planningController.getMrpExplosion.bind(planningController));
  fastify.post("/mrp/net-requirements", { schema: { tags: ["Planning & Demand"], summary: "Calculate MRP Net Requirements & Shortages" } }, planningController.getMrpExplosion.bind(planningController));
  fastify.get("/promotions", { schema: { tags: ["Planning & Demand"], summary: "List Promotion Campaigns" } }, planningController.getPromotionCampaigns.bind(planningController));
  fastify.post("/promotions", { schema: { tags: ["Planning & Demand"], summary: "Create Promotion Campaign" } }, planningController.createPromotionCampaign.bind(planningController));
  fastify.put("/promotions/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Promotion Campaign" } }, planningController.updatePromotionCampaign.bind(planningController));
  fastify.delete("/promotions/:id", { schema: { tags: ["Planning & Demand"], summary: "Delete Promotion Campaign" } }, planningController.deletePromotionCampaign.bind(planningController));

  // MRP Engine BOM Explosion
  fastify.post("/mrp/run", { schema: { tags: ["Planning & Demand"], summary: "Execute Multi-Level BOM Explosion MRP Calculation" } }, planningController.runMrpEngine.bind(planningController));
  fastify.post("/mrp/calculate", { schema: { tags: ["Planning & Demand"], summary: "Execute Multi-Level BOM Explosion MRP Calculation" } }, planningController.runMrpEngine.bind(planningController));

  // Purchase Requisitions
  fastify.get("/mrp/requisitions", { schema: { tags: ["Planning & Demand"], summary: "List Purchase Requisitions" } }, planningController.listPurchaseRequisitions.bind(planningController));
  fastify.post("/mrp/requisitions", { schema: { tags: ["Planning & Demand"], summary: "Generate Purchase Requisition from MRP Shortage" } }, planningController.createPurchaseRequisition.bind(planningController));

  // Shortage Expediting
  fastify.get("/mrp/expedited", { schema: { tags: ["Planning & Demand"], summary: "List Expedited Material Shortages" } }, planningController.listExpeditedShortages.bind(planningController));
  fastify.post("/mrp/expedite", { schema: { tags: ["Planning & Demand"], summary: "Expedite Inbound Material Shipment" } }, planningController.expediteShortage.bind(planningController));

  // Safety Stock Policy
  fastify.get("/mrp/safety-stock", { schema: { tags: ["Planning & Demand"], summary: "Get Safety Stock Policies" } }, planningController.listSafetyStock.bind(planningController));
  fastify.patch("/mrp/safety-stock/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Safety Stock Buffer Policy" } }, planningController.updateSafetyStock.bind(planningController));
  fastify.post("/mrp/safety-stock", { schema: { tags: ["Planning & Demand"], summary: "Save Safety Stock Buffer Policy" } }, planningController.updateSafetyStock.bind(planningController));

  // Commercial Service Risks & Mitigation
  fastify.get("/mrp/service-risks", { schema: { tags: ["Planning & Demand"], summary: "List Commercial Service Risks & OTIF Exposure" } }, planningController.listServiceRisks.bind(planningController));
  fastify.post("/mrp/service-risks/:id/mitigate", { schema: { tags: ["Planning & Demand"], summary: "Authorize Service Risk Mitigation Protocol" } }, planningController.mitigateServiceRisk.bind(planningController));
  fastify.post("/mrp/mitigate-risk", { schema: { tags: ["Planning & Demand"], summary: "Authorize Service Risk Mitigation Protocol" } }, planningController.mitigateServiceRisk.bind(planningController));

  // Supply & Demand Reconciliation
  fastify.get("/mrp/supply-demand", { schema: { tags: ["Planning & Demand"], summary: "Get Supply & Demand Balance Sheet" } }, planningController.getSupplyDemandBalance.bind(planningController));

  // Master Schedule Versioning & Baselines
  fastify.get("/aps/versions", { schema: { tags: ["Planning & Demand"], summary: "List Master Schedule Versions & Baselines" } }, planningController.listScheduleVersions.bind(planningController));
  fastify.post("/aps/versions", { schema: { tags: ["Planning & Demand"], summary: "Create New Schedule Version Baseline" } }, planningController.createScheduleVersion.bind(planningController));

  // Schedule Feasibility & Gate Validation
  fastify.get("/aps/validation", { schema: { tags: ["Planning & Demand"], summary: "Validate Production Schedule Feasibility Gates" } }, planningController.validateSchedule.bind(planningController));
  fastify.post("/aps/validate", { schema: { tags: ["Planning & Demand"], summary: "Validate Production Schedule Feasibility Gates" } }, planningController.validateSchedule.bind(planningController));

  // Shop-Floor Publication & HMI Dispatch
  fastify.get("/aps/publish", { schema: { tags: ["Planning & Demand"], summary: "Get Publish Schedule Baseline & Gate Status" } }, planningController.getPublishSchedule.bind(planningController));
  fastify.post("/aps/publish", { schema: { tags: ["Planning & Demand"], summary: "Publish Schedule Baseline & Broadcast to Plant HMIs" } }, planningController.publishSchedule.bind(planningController));

  // AI Planning Copilot & Heuristic Assistant
  fastify.get("/ai-assistant", { schema: { tags: ["Planning & Demand"], summary: "Get AI Assistant Copilot State" } }, planningController.getAiAssistantOverview.bind(planningController));
  fastify.get("/ai/assistant", { schema: { tags: ["Planning & Demand"], summary: "Get AI Assistant Copilot State" } }, planningController.getAiAssistantOverview.bind(planningController));
  fastify.post("/ai-assistant/chat", { schema: { tags: ["Planning & Demand"], summary: "AI Copilot Production Heuristic Chat" } }, planningController.handleAiChat.bind(planningController));
  fastify.post("/ai-assistant/apply", { schema: { tags: ["Planning & Demand"], summary: "Accept & Apply AI Recommendation to Schedule Draft" } }, planningController.applyAiRecommendation.bind(planningController));
  fastify.post("/ai/apply-recommendation", { schema: { tags: ["Planning & Demand"], summary: "Accept & Apply AI Recommendation to Schedule Draft" } }, planningController.applyAiRecommendation.bind(planningController));
  fastify.post("/ai/recommendation/apply", { schema: { tags: ["Planning & Demand"], summary: "Accept & Apply AI Recommendation to Schedule Draft" } }, planningController.applyAiRecommendation.bind(planningController));
  fastify.post("/ai-assistant/simulate", { schema: { tags: ["Planning & Demand"], summary: "Simulate Production Schedule Impact" } }, planningController.simulateAiImpact.bind(planningController));
  fastify.post("/ai/simulate", { schema: { tags: ["Planning & Demand"], summary: "Simulate Production Schedule Impact" } }, planningController.simulateAiImpact.bind(planningController));

  // Material Reservations
  fastify.get("/material-reservation", { schema: { tags: ["Planning & Demand"], summary: "List Material Reservations & Staging" } }, planningController.listMaterialReservations.bind(planningController));
  fastify.get("/material-reservations", { schema: { tags: ["Planning & Demand"], summary: "List Material Reservations & Staging" } }, planningController.listMaterialReservations.bind(planningController));
  fastify.post("/material-reservation", { schema: { tags: ["Planning & Demand"], summary: "Create Material Reservation" } }, planningController.createMaterialReservation.bind(planningController));
  fastify.post("/material-reservations", { schema: { tags: ["Planning & Demand"], summary: "Create Material Reservation" } }, planningController.createMaterialReservation.bind(planningController));
  fastify.post("/material-reservation/stage", { schema: { tags: ["Planning & Demand"], summary: "Stage Material Reservation" } }, planningController.stageMaterialReservation.bind(planningController));
  fastify.post("/material-reservation/:id/stage", { schema: { tags: ["Planning & Demand"], summary: "Stage Material Reservation" } }, planningController.stageMaterialReservation.bind(planningController));
  fastify.post("/material-reservation/release", { schema: { tags: ["Planning & Demand"], summary: "Release Material Reservation" } }, planningController.releaseMaterialReservation.bind(planningController));
  fastify.delete("/material-reservation/:id", { schema: { tags: ["Planning & Demand"], summary: "Release Material Reservation" } }, planningController.releaseMaterialReservation.bind(planningController));
  fastify.post("/material-reservation/recalculate", { schema: { tags: ["Planning & Demand"], summary: "Sync Material Reservations with MRP Engine" } }, planningController.recalculateMaterialReservations.bind(planningController));

  // Planning Reports
  fastify.get("/planning-reports", { schema: { tags: ["Planning & Demand"], summary: "List Planning Reports" } }, planningController.getPlanningReports.bind(planningController));
  fastify.get("/reports", { schema: { tags: ["Planning & Demand"], summary: "List Planning Reports" } }, planningController.getPlanningReports.bind(planningController));

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


