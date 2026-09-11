"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planningRoutes = planningRoutes;
const planning_controller_js_1 = require("./planning.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function planningRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    // Planning Command Center Dashboard KPI Summary
    fastify.get("/dashboard", { schema: { tags: ["Planning & Demand"], summary: "Planning Command Center Dashboard KPI Summary" } }, planning_controller_js_1.planningController.getPlanningDashboardSummary.bind(planning_controller_js_1.planningController));
    fastify.get("/summary", { schema: { tags: ["Planning & Demand"], summary: "Planning Command Center Dashboard KPI Summary" } }, planning_controller_js_1.planningController.getPlanningDashboardSummary.bind(planning_controller_js_1.planningController));
    // Demand & Forecast
    fastify.get("/demand/orders", { schema: { tags: ["Planning & Demand"], summary: "List Customer Demand Orders" } }, planning_controller_js_1.planningController.getCustomerOrders.bind(planning_controller_js_1.planningController));
    fastify.post("/demand/orders", { schema: { tags: ["Planning & Demand"], summary: "Create Customer Demand Order" } }, planning_controller_js_1.planningController.createCustomerOrder.bind(planning_controller_js_1.planningController));
    fastify.put("/demand/orders/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Customer Demand Order" } }, planning_controller_js_1.planningController.updateCustomerOrder.bind(planning_controller_js_1.planningController));
    fastify.patch("/demand/orders/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Customer Demand Order" } }, planning_controller_js_1.planningController.updateCustomerOrder.bind(planning_controller_js_1.planningController));
    fastify.delete("/demand/orders/:id", { schema: { tags: ["Planning & Demand"], summary: "Delete Customer Demand Order" } }, planning_controller_js_1.planningController.deleteCustomerOrder.bind(planning_controller_js_1.planningController));
    // Forecasts & Overrides CRUD
    fastify.get("/forecasts", { schema: { tags: ["Planning & Demand"], summary: "List Demand Forecasts & Overrides" } }, planning_controller_js_1.planningController.getForecasts.bind(planning_controller_js_1.planningController));
    fastify.post("/forecasts", { schema: { tags: ["Planning & Demand"], summary: "Create Demand Forecast Record" } }, planning_controller_js_1.planningController.createForecast.bind(planning_controller_js_1.planningController));
    fastify.patch("/forecasts/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Forecast / Manager Override" } }, planning_controller_js_1.planningController.updateForecast.bind(planning_controller_js_1.planningController));
    fastify.delete("/forecasts/:id", { schema: { tags: ["Planning & Demand"], summary: "Delete Forecast Record" } }, planning_controller_js_1.planningController.deleteForecast.bind(planning_controller_js_1.planningController));
    // Demand History & Accuracy
    fastify.get("/forecast/history", { schema: { tags: ["Planning & Demand"], summary: "List Historical Sales Demand & Model Accuracy" } }, planning_controller_js_1.planningController.getDemandHistory.bind(planning_controller_js_1.planningController));
    // Commercial Promotions & Uplift
    fastify.get("/forecast/promotions", { schema: { tags: ["Planning & Demand"], summary: "List Commercial Promotions & Uplift Events" } }, planning_controller_js_1.planningController.getPromotions.bind(planning_controller_js_1.planningController));
    fastify.post("/forecast/promotions", { schema: { tags: ["Planning & Demand"], summary: "Create Commercial Promotion Campaign" } }, planning_controller_js_1.planningController.createPromotion.bind(planning_controller_js_1.planningController));
    fastify.patch("/forecast/promotions/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Commercial Promotion Status" } }, planning_controller_js_1.planningController.updatePromotion.bind(planning_controller_js_1.planningController));
    // Shipments Outbound
    fastify.get("/shipments", { schema: { tags: ["Planning & Demand"], summary: "List Outbound Shipments" } }, planning_controller_js_1.planningController.getShipments.bind(planning_controller_js_1.planningController));
    fastify.post("/shipments", { schema: { tags: ["Planning & Demand"], summary: "Create/Book Outbound Shipment" } }, planning_controller_js_1.planningController.createShipment.bind(planning_controller_js_1.planningController));
    fastify.patch("/shipments/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Outbound Shipment Status" } }, planning_controller_js_1.planningController.updateShipmentStatus.bind(planning_controller_js_1.planningController));
    // Forecast Engine & APS & MRP
    fastify.post("/forecast/run", { schema: { tags: ["Planning & Demand"], summary: "Execute Statistical Forecast Engine" } }, planning_controller_js_1.planningController.runForecast.bind(planning_controller_js_1.planningController));
    fastify.get("/aps/schedules", { schema: { tags: ["Planning & Demand"], summary: "List Multi-Line APS Gantt Schedules" } }, planning_controller_js_1.planningController.getApsSchedules.bind(planning_controller_js_1.planningController));
    fastify.post("/aps/schedules", { schema: { tags: ["Planning & Demand"], summary: "Publish APS Schedule" } }, planning_controller_js_1.planningController.createApsSchedule.bind(planning_controller_js_1.planningController));
    fastify.patch("/aps/schedules/:id/reschedule", { schema: { tags: ["Planning & Demand"], summary: "Reschedule APS Order" } }, planning_controller_js_1.planningController.rescheduleApsSchedule.bind(planning_controller_js_1.planningController));
    fastify.post("/aps/reschedule", { schema: { tags: ["Planning & Demand"], summary: "Reschedule APS Order" } }, planning_controller_js_1.planningController.rescheduleApsSchedule.bind(planning_controller_js_1.planningController));
    fastify.post("/aps/schedules/:id/split", { schema: { tags: ["Planning & Demand"], summary: "Split APS Order" } }, planning_controller_js_1.planningController.splitApsSchedule.bind(planning_controller_js_1.planningController));
    fastify.post("/aps/split", { schema: { tags: ["Planning & Demand"], summary: "Split APS Order" } }, planning_controller_js_1.planningController.splitApsSchedule.bind(planning_controller_js_1.planningController));
    fastify.post("/aps/optimize", { schema: { tags: ["Planning & Demand"], summary: "Optimize APS Schedule Sequence to Minimize Changeovers" } }, planning_controller_js_1.planningController.optimizeApsSchedule.bind(planning_controller_js_1.planningController));
    fastify.get("/aps/capacity", { schema: { tags: ["Planning & Demand"], summary: "Get APS Finite Work Center Capacity Planning" } }, planning_controller_js_1.planningController.getCapacityCalculations.bind(planning_controller_js_1.planningController));
    fastify.get("/aps/work-centers", { schema: { tags: ["Planning & Demand"], summary: "Get Work Center Infrastructure & Asset Capabilities" } }, planning_controller_js_1.planningController.getWorkCenters.bind(planning_controller_js_1.planningController));
    fastify.get("/aps/changeovers", { schema: { tags: ["Planning & Demand"], summary: "Get APS Changeover Matrix & SMED Standardization" } }, planning_controller_js_1.planningController.getChangeovers.bind(planning_controller_js_1.planningController));
    fastify.post("/aps/changeovers", { schema: { tags: ["Planning & Demand"], summary: "Create APS Changeover Matrix Rule" } }, planning_controller_js_1.planningController.createChangeover.bind(planning_controller_js_1.planningController));
    fastify.get("/mrp/net-requirements", { schema: { tags: ["Planning & Demand"], summary: "Calculate MRP Net Requirements & Shortages" } }, planning_controller_js_1.planningController.getMrpExplosion.bind(planning_controller_js_1.planningController));
    fastify.post("/mrp/net-requirements", { schema: { tags: ["Planning & Demand"], summary: "Calculate MRP Net Requirements & Shortages" } }, planning_controller_js_1.planningController.getMrpExplosion.bind(planning_controller_js_1.planningController));
    fastify.get("/promotions", { schema: { tags: ["Planning & Demand"], summary: "List Promotion Campaigns" } }, planning_controller_js_1.planningController.getPromotionCampaigns.bind(planning_controller_js_1.planningController));
    fastify.post("/promotions", { schema: { tags: ["Planning & Demand"], summary: "Create Promotion Campaign" } }, planning_controller_js_1.planningController.createPromotionCampaign.bind(planning_controller_js_1.planningController));
    fastify.put("/promotions/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Promotion Campaign" } }, planning_controller_js_1.planningController.updatePromotionCampaign.bind(planning_controller_js_1.planningController));
    fastify.delete("/promotions/:id", { schema: { tags: ["Planning & Demand"], summary: "Delete Promotion Campaign" } }, planning_controller_js_1.planningController.deletePromotionCampaign.bind(planning_controller_js_1.planningController));
    // MRP Engine BOM Explosion
    fastify.post("/mrp/run", { schema: { tags: ["Planning & Demand"], summary: "Execute Multi-Level BOM Explosion MRP Calculation" } }, planning_controller_js_1.planningController.runMrpEngine.bind(planning_controller_js_1.planningController));
    fastify.post("/mrp/calculate", { schema: { tags: ["Planning & Demand"], summary: "Execute Multi-Level BOM Explosion MRP Calculation" } }, planning_controller_js_1.planningController.runMrpEngine.bind(planning_controller_js_1.planningController));
    // Purchase Requisitions
    fastify.get("/mrp/requisitions", { schema: { tags: ["Planning & Demand"], summary: "List Purchase Requisitions" } }, planning_controller_js_1.planningController.listPurchaseRequisitions.bind(planning_controller_js_1.planningController));
    fastify.post("/mrp/requisitions", { schema: { tags: ["Planning & Demand"], summary: "Generate Purchase Requisition from MRP Shortage" } }, planning_controller_js_1.planningController.createPurchaseRequisition.bind(planning_controller_js_1.planningController));
    // Shortage Expediting
    fastify.get("/mrp/expedited", { schema: { tags: ["Planning & Demand"], summary: "List Expedited Material Shortages" } }, planning_controller_js_1.planningController.listExpeditedShortages.bind(planning_controller_js_1.planningController));
    fastify.post("/mrp/expedite", { schema: { tags: ["Planning & Demand"], summary: "Expedite Inbound Material Shipment" } }, planning_controller_js_1.planningController.expediteShortage.bind(planning_controller_js_1.planningController));
    // Safety Stock Policy
    fastify.get("/mrp/safety-stock", { schema: { tags: ["Planning & Demand"], summary: "Get Safety Stock Policies" } }, planning_controller_js_1.planningController.listSafetyStock.bind(planning_controller_js_1.planningController));
    fastify.patch("/mrp/safety-stock/:id", { schema: { tags: ["Planning & Demand"], summary: "Update Safety Stock Buffer Policy" } }, planning_controller_js_1.planningController.updateSafetyStock.bind(planning_controller_js_1.planningController));
    fastify.post("/mrp/safety-stock", { schema: { tags: ["Planning & Demand"], summary: "Save Safety Stock Buffer Policy" } }, planning_controller_js_1.planningController.updateSafetyStock.bind(planning_controller_js_1.planningController));
    // Commercial Service Risks & Mitigation
    fastify.get("/mrp/service-risks", { schema: { tags: ["Planning & Demand"], summary: "List Commercial Service Risks & OTIF Exposure" } }, planning_controller_js_1.planningController.listServiceRisks.bind(planning_controller_js_1.planningController));
    fastify.post("/mrp/service-risks/:id/mitigate", { schema: { tags: ["Planning & Demand"], summary: "Authorize Service Risk Mitigation Protocol" } }, planning_controller_js_1.planningController.mitigateServiceRisk.bind(planning_controller_js_1.planningController));
    fastify.post("/mrp/mitigate-risk", { schema: { tags: ["Planning & Demand"], summary: "Authorize Service Risk Mitigation Protocol" } }, planning_controller_js_1.planningController.mitigateServiceRisk.bind(planning_controller_js_1.planningController));
    // Supply & Demand Reconciliation
    fastify.get("/mrp/supply-demand", { schema: { tags: ["Planning & Demand"], summary: "Get Supply & Demand Balance Sheet" } }, planning_controller_js_1.planningController.getSupplyDemandBalance.bind(planning_controller_js_1.planningController));
    // Master Schedule Versioning & Baselines
    fastify.get("/aps/versions", { schema: { tags: ["Planning & Demand"], summary: "List Master Schedule Versions & Baselines" } }, planning_controller_js_1.planningController.listScheduleVersions.bind(planning_controller_js_1.planningController));
    fastify.post("/aps/versions", { schema: { tags: ["Planning & Demand"], summary: "Create New Schedule Version Baseline" } }, planning_controller_js_1.planningController.createScheduleVersion.bind(planning_controller_js_1.planningController));
    // Schedule Feasibility & Gate Validation
    fastify.get("/aps/validation", { schema: { tags: ["Planning & Demand"], summary: "Validate Production Schedule Feasibility Gates" } }, planning_controller_js_1.planningController.validateSchedule.bind(planning_controller_js_1.planningController));
    fastify.post("/aps/validate", { schema: { tags: ["Planning & Demand"], summary: "Validate Production Schedule Feasibility Gates" } }, planning_controller_js_1.planningController.validateSchedule.bind(planning_controller_js_1.planningController));
    // Shop-Floor Publication & HMI Dispatch
    fastify.get("/aps/publish", { schema: { tags: ["Planning & Demand"], summary: "Get Publish Schedule Baseline & Gate Status" } }, planning_controller_js_1.planningController.getPublishSchedule.bind(planning_controller_js_1.planningController));
    fastify.post("/aps/publish", { schema: { tags: ["Planning & Demand"], summary: "Publish Schedule Baseline & Broadcast to Plant HMIs" } }, planning_controller_js_1.planningController.publishSchedule.bind(planning_controller_js_1.planningController));
    // AI Planning Copilot & Heuristic Assistant
    fastify.get("/ai-assistant", { schema: { tags: ["Planning & Demand"], summary: "Get AI Assistant Copilot State" } }, planning_controller_js_1.planningController.getAiAssistantOverview.bind(planning_controller_js_1.planningController));
    fastify.get("/ai/assistant", { schema: { tags: ["Planning & Demand"], summary: "Get AI Assistant Copilot State" } }, planning_controller_js_1.planningController.getAiAssistantOverview.bind(planning_controller_js_1.planningController));
    fastify.post("/ai-assistant/chat", { schema: { tags: ["Planning & Demand"], summary: "AI Copilot Production Heuristic Chat" } }, planning_controller_js_1.planningController.handleAiChat.bind(planning_controller_js_1.planningController));
    fastify.post("/ai-assistant/apply", { schema: { tags: ["Planning & Demand"], summary: "Accept & Apply AI Recommendation to Schedule Draft" } }, planning_controller_js_1.planningController.applyAiRecommendation.bind(planning_controller_js_1.planningController));
    fastify.post("/ai/apply-recommendation", { schema: { tags: ["Planning & Demand"], summary: "Accept & Apply AI Recommendation to Schedule Draft" } }, planning_controller_js_1.planningController.applyAiRecommendation.bind(planning_controller_js_1.planningController));
    fastify.post("/ai/recommendation/apply", { schema: { tags: ["Planning & Demand"], summary: "Accept & Apply AI Recommendation to Schedule Draft" } }, planning_controller_js_1.planningController.applyAiRecommendation.bind(planning_controller_js_1.planningController));
    fastify.post("/ai-assistant/simulate", { schema: { tags: ["Planning & Demand"], summary: "Simulate Production Schedule Impact" } }, planning_controller_js_1.planningController.simulateAiImpact.bind(planning_controller_js_1.planningController));
    fastify.post("/ai/simulate", { schema: { tags: ["Planning & Demand"], summary: "Simulate Production Schedule Impact" } }, planning_controller_js_1.planningController.simulateAiImpact.bind(planning_controller_js_1.planningController));
    // Material Reservations
    fastify.get("/material-reservation", { schema: { tags: ["Planning & Demand"], summary: "List Material Reservations & Staging" } }, planning_controller_js_1.planningController.listMaterialReservations.bind(planning_controller_js_1.planningController));
    fastify.get("/material-reservations", { schema: { tags: ["Planning & Demand"], summary: "List Material Reservations & Staging" } }, planning_controller_js_1.planningController.listMaterialReservations.bind(planning_controller_js_1.planningController));
    fastify.post("/material-reservation", { schema: { tags: ["Planning & Demand"], summary: "Create Material Reservation" } }, planning_controller_js_1.planningController.createMaterialReservation.bind(planning_controller_js_1.planningController));
    fastify.post("/material-reservations", { schema: { tags: ["Planning & Demand"], summary: "Create Material Reservation" } }, planning_controller_js_1.planningController.createMaterialReservation.bind(planning_controller_js_1.planningController));
    fastify.post("/material-reservation/stage", { schema: { tags: ["Planning & Demand"], summary: "Stage Material Reservation" } }, planning_controller_js_1.planningController.stageMaterialReservation.bind(planning_controller_js_1.planningController));
    fastify.post("/material-reservation/:id/stage", { schema: { tags: ["Planning & Demand"], summary: "Stage Material Reservation" } }, planning_controller_js_1.planningController.stageMaterialReservation.bind(planning_controller_js_1.planningController));
    fastify.post("/material-reservation/release", { schema: { tags: ["Planning & Demand"], summary: "Release Material Reservation" } }, planning_controller_js_1.planningController.releaseMaterialReservation.bind(planning_controller_js_1.planningController));
    fastify.delete("/material-reservation/:id", { schema: { tags: ["Planning & Demand"], summary: "Release Material Reservation" } }, planning_controller_js_1.planningController.releaseMaterialReservation.bind(planning_controller_js_1.planningController));
    fastify.post("/material-reservation/recalculate", { schema: { tags: ["Planning & Demand"], summary: "Sync Material Reservations with MRP Engine" } }, planning_controller_js_1.planningController.recalculateMaterialReservations.bind(planning_controller_js_1.planningController));
    // Planning Reports
    fastify.get("/planning-reports", { schema: { tags: ["Planning & Demand"], summary: "List Planning Reports" } }, planning_controller_js_1.planningController.getPlanningReports.bind(planning_controller_js_1.planningController));
    fastify.get("/reports", { schema: { tags: ["Planning & Demand"], summary: "List Planning Reports" } }, planning_controller_js_1.planningController.getPlanningReports.bind(planning_controller_js_1.planningController));
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