import { FastifyInstance } from "fastify";
import { executiveController } from "./executive.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function executiveRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/dashboard", { schema: { tags: ["Executive"], summary: "Get Executive Dashboard Overview" } }, executiveController.getDashboardSummary.bind(executiveController));
  fastify.post("/dashboard/sync", { schema: { tags: ["Executive"], summary: "Sync Executive Portfolio Data" } }, executiveController.syncDashboardData.bind(executiveController));
  fastify.post("/dashboard/export", { schema: { tags: ["Executive"], summary: "Export Executive Board Summary Report" } }, executiveController.exportBoardReport.bind(executiveController));
  fastify.post("/dashboard/approve-ai", { schema: { tags: ["Executive"], summary: "Approve AI Routing Recommendation" } }, executiveController.approveAiRecommendation.bind(executiveController));

  fastify.get("/enterprise/kpis", { schema: { tags: ["Executive"], summary: "Get Multi-Plant KPIs" } }, executiveController.getMultiPlantKpis.bind(executiveController));
  fastify.post("/enterprise/kpis/audit", { schema: { tags: ["Executive"], summary: "Initiate Plant Performance Audit" } }, executiveController.initiatePlantAudit.bind(executiveController));

  fastify.get("/finance/manufacturing", { schema: { tags: ["Executive"], summary: "Get Manufacturing Cost Intelligence" } }, executiveController.getManufacturingCosts.bind(executiveController));
  fastify.get("/finance/variance", { schema: { tags: ["Executive"], summary: "Get Cost Variance Breakdown" } }, executiveController.getCostVariance.bind(executiveController));
  fastify.post("/finance/variance/validate", { schema: { tags: ["Executive"], summary: "Validate Manufacturing Variance Targets" } }, executiveController.validateVarianceTargets.bind(executiveController));

  fastify.get("/finance/material", { schema: { tags: ["Executive"], summary: "Get Material & Packaging Costs" } }, executiveController.getMaterialCosts.bind(executiveController));
  fastify.post("/finance/material/update-rates", { schema: { tags: ["Executive"], summary: "Update Supply Contract Rates" } }, executiveController.updateContractRates.bind(executiveController));

  fastify.get("/finance/labour", { schema: { tags: ["Executive"], summary: "Get Labour Cost Breakdown" } }, executiveController.getLabourCosts.bind(executiveController));
  fastify.post("/finance/labour/audit", { schema: { tags: ["Executive"], summary: "Audit Labour Allocation" } }, executiveController.auditLabourAllocation.bind(executiveController));

  fastify.get("/finance/machine", { schema: { tags: ["Executive"], summary: "Get Machine & Utility Costs" } }, executiveController.getMachineCosts.bind(executiveController));
  fastify.post("/finance/machine/audit", { schema: { tags: ["Executive"], summary: "Audit Machine Utility Efficiency" } }, executiveController.auditMachineEfficiency.bind(executiveController));

  fastify.get("/finance/scrap", { schema: { tags: ["Executive"], summary: "Get Scrap & Rework Ledger" } }, executiveController.getScrapReworkCosts.bind(executiveController));
  fastify.post("/finance/scrap/audit", { schema: { tags: ["Executive"], summary: "Audit Scrap Event" } }, executiveController.auditScrapEvent.bind(executiveController));

  fastify.get("/finance/ci-savings", { schema: { tags: ["Executive"], summary: "Get Continuous Improvement Savings" } }, executiveController.getCiSavings.bind(executiveController));
  fastify.post("/finance/ci-savings/verify", { schema: { tags: ["Executive"], summary: "Verify CI Project Benefits" } }, executiveController.verifyCiProjectSavings.bind(executiveController));

  fastify.get("/business/trends", { schema: { tags: ["Executive"], summary: "Get Business Trends" } }, executiveController.getBusinessTrends.bind(executiveController));
  fastify.post("/business/trends/simulate", { schema: { tags: ["Executive"], summary: "Run Business Trend Simulation" } }, executiveController.simulateBusinessTrends.bind(executiveController));

  fastify.get("/business/demand", { schema: { tags: ["Executive"], summary: "Get Customer Demand Backlog" } }, executiveController.getCustomerDemand.bind(executiveController));
  fastify.post("/business/demand/sync", { schema: { tags: ["Executive"], summary: "Sync Customer Demand Forecast" } }, executiveController.syncCustomerDemand.bind(executiveController));

  fastify.get("/business/service-level", { schema: { tags: ["Executive"], summary: "Get Customer Service Levels" } }, executiveController.getServiceLevel.bind(executiveController));
  fastify.get("/business/shipments", { schema: { tags: ["Executive"], summary: "Get Shipment Performance" } }, executiveController.getShipmentPerformance.bind(executiveController));

  fastify.get("/risk/risks", { schema: { tags: ["Executive"], summary: "Get Strategic Risks" } }, executiveController.getRisks.bind(executiveController));
  fastify.post("/risk/risks", { schema: { tags: ["Executive"], summary: "Add New Strategic Risk" } }, executiveController.addRisk.bind(executiveController));
  fastify.post("/risk/mitigate", { schema: { tags: ["Executive"], summary: "Mitigate Strategic Risk" } }, executiveController.mitigateRisk.bind(executiveController));

  fastify.get("/risk/opportunities", { schema: { tags: ["Executive"], summary: "Get Strategic Opportunities" } }, executiveController.getOpportunities.bind(executiveController));
  fastify.post("/risk/opportunities/approve", { schema: { tags: ["Executive"], summary: "Authorize Opportunity" } }, executiveController.approveOpportunity.bind(executiveController));

  fastify.get("/ai/briefing", { schema: { tags: ["Executive"], summary: "Get Executive AI Briefing" } }, executiveController.getAiBriefing.bind(executiveController));
  fastify.post("/ai/generate-briefing", { schema: { tags: ["Executive"], summary: "Generate Executive AI Briefing" } }, executiveController.generateAiBriefing.bind(executiveController));

  fastify.get("/reports", { schema: { tags: ["Executive"], summary: "Get Executive Reports List" } }, executiveController.getReports.bind(executiveController));
  fastify.post("/reports/export", { schema: { tags: ["Executive"], summary: "Export Executive Report" } }, executiveController.exportReport.bind(executiveController));

  fastify.get("/notifications", { schema: { tags: ["Executive"], summary: "Get Executive Notifications" } }, executiveController.getNotifications.bind(executiveController));
  fastify.post("/notifications/read", { schema: { tags: ["Executive"], summary: "Mark Notification as Read" } }, executiveController.markNotificationRead.bind(executiveController));
  fastify.post("/notifications/read-all", { schema: { tags: ["Executive"], summary: "Mark All Notifications as Read" } }, executiveController.markAllNotificationsRead.bind(executiveController));
  fastify.post("/notifications/delete", { schema: { tags: ["Executive"], summary: "Delete Notification" } }, executiveController.deleteNotification.bind(executiveController));
  fastify.post("/notifications/clear-all", { schema: { tags: ["Executive"], summary: "Clear All Notifications" } }, executiveController.clearAllNotifications.bind(executiveController));

  fastify.get("/profile", { schema: { tags: ["Executive"], summary: "Get Executive User Profile" } }, executiveController.getProfile.bind(executiveController));
  fastify.put("/profile", { schema: { tags: ["Executive"], summary: "Update Executive User Profile" } }, executiveController.updateProfile.bind(executiveController));
}
