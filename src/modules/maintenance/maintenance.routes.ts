import { FastifyInstance } from "fastify";
import { maintenanceController } from "./maintenance.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function maintenanceRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/work-orders", { schema: { tags: ["Maintenance & CMMS"], summary: "List Work Orders" } }, maintenanceController.getWorkOrders.bind(maintenanceController));
  fastify.post("/work-orders", { schema: { tags: ["Maintenance & CMMS"], summary: "Create Work Order" } }, maintenanceController.createWorkOrder.bind(maintenanceController));
  fastify.put("/work-orders/:id", { schema: { tags: ["Maintenance & CMMS"], summary: "Update Work Order Details" } }, maintenanceController.updateWorkOrder.bind(maintenanceController));
  fastify.patch("/work-orders/:id", { schema: { tags: ["Maintenance & CMMS"], summary: "Update Work Order Details" } }, maintenanceController.updateWorkOrder.bind(maintenanceController));
  fastify.delete("/work-orders/:id", { schema: { tags: ["Maintenance & CMMS"], summary: "Delete Work Order" } }, maintenanceController.deleteWorkOrder.bind(maintenanceController));
  fastify.patch("/work-orders/:id/status", { schema: { tags: ["Maintenance & CMMS"], summary: "Advance Work Order Status" } }, maintenanceController.updateWorkOrderStatus.bind(maintenanceController));

  fastify.get("/breakdowns", { schema: { tags: ["Maintenance & CMMS"], summary: "List Breakdown Records" } }, maintenanceController.getBreakdowns.bind(maintenanceController));
  fastify.post("/breakdowns", { schema: { tags: ["Maintenance & CMMS"], summary: "Report Breakdown" } }, maintenanceController.reportBreakdown.bind(maintenanceController));
  fastify.put("/breakdowns/:id", { schema: { tags: ["Maintenance & CMMS"], summary: "Update Breakdown Details" } }, maintenanceController.updateBreakdown.bind(maintenanceController));
  fastify.patch("/breakdowns/:id", { schema: { tags: ["Maintenance & CMMS"], summary: "Update Breakdown Details" } }, maintenanceController.updateBreakdown.bind(maintenanceController));
  fastify.post("/breakdowns/:id/resolve", { schema: { tags: ["Maintenance & CMMS"], summary: "Resolve Breakdown" } }, maintenanceController.resolveBreakdown.bind(maintenanceController));
  fastify.delete("/breakdowns/:id", { schema: { tags: ["Maintenance & CMMS"], summary: "Delete Breakdown Record" } }, maintenanceController.deleteBreakdown.bind(maintenanceController));
  fastify.get("/history", { schema: { tags: ["Maintenance & CMMS"], summary: "List Maintenance History" } }, maintenanceController.getHistory.bind(maintenanceController));
  fastify.post("/history/:id/export", { schema: { tags: ["Maintenance & CMMS"], summary: "Export History Dossier" } }, maintenanceController.exportHistory.bind(maintenanceController));
  fastify.get("/troubleshooting", { schema: { tags: ["Maintenance & CMMS"], summary: "List Troubleshooting Solutions" } }, maintenanceController.getTroubleshooting.bind(maintenanceController));
  fastify.post("/troubleshooting/step", { schema: { tags: ["Maintenance & CMMS"], summary: "Save Troubleshooting Step Progress" } }, maintenanceController.saveTroubleshootingStep.bind(maintenanceController));
  fastify.post("/troubleshooting/draft", { schema: { tags: ["Maintenance & CMMS"], summary: "Save Troubleshooting Draft" } }, maintenanceController.saveTroubleshootingDraft.bind(maintenanceController));
  fastify.post("/troubleshooting", { schema: { tags: ["Maintenance & CMMS"], summary: "Create Verified Troubleshooting Solution" } }, maintenanceController.saveTroubleshootingSolution.bind(maintenanceController));
  fastify.patch("/assets/:id", { schema: { tags: ["Maintenance & CMMS"], summary: "Update Equipment Asset Master Details" } }, maintenanceController.updateAsset.bind(maintenanceController));

  fastify.get("/pm-schedules", { schema: { tags: ["Maintenance & CMMS"], summary: "List Preventive Maintenance Schedules" } }, maintenanceController.getPMSchedules.bind(maintenanceController));
  fastify.post("/pm-schedules", { schema: { tags: ["Maintenance & CMMS"], summary: "Create PM Schedule" } }, maintenanceController.createPMSchedule.bind(maintenanceController));
  fastify.put("/pm-schedules/:id", { schema: { tags: ["Maintenance & CMMS"], summary: "Update PM Schedule" } }, maintenanceController.updatePMSchedule.bind(maintenanceController));
  fastify.patch("/pm-schedules/:id", { schema: { tags: ["Maintenance & CMMS"], summary: "Update PM Schedule" } }, maintenanceController.updatePMSchedule.bind(maintenanceController));
  fastify.delete("/pm-schedules/:id", { schema: { tags: ["Maintenance & CMMS"], summary: "Delete PM Schedule" } }, maintenanceController.deletePMSchedule.bind(maintenanceController));
  fastify.post("/pm-checklists/execute", { schema: { tags: ["Maintenance & CMMS"], summary: "Execute PM Checklist" } }, maintenanceController.executePMChecklist.bind(maintenanceController));
  fastify.post("/pm-checklists/draft", { schema: { tags: ["Maintenance & CMMS"], summary: "Save PM Checklist Draft" } }, maintenanceController.savePMChecklistDraft.bind(maintenanceController));
  fastify.post("/pm/execute", { schema: { tags: ["Maintenance & CMMS"], summary: "Execute PM" } }, maintenanceController.executePMChecklist.bind(maintenanceController));
  fastify.get("/pm", { schema: { tags: ["Maintenance & CMMS"], summary: "List Preventive Maintenance" } }, maintenanceController.getPM.bind(maintenanceController));
  fastify.get("/calendar", { schema: { tags: ["Maintenance & CMMS"], summary: "List Maintenance Calendar Events" } }, maintenanceController.getCalendar.bind(maintenanceController));
  fastify.get("/notifications", { schema: { tags: ["Maintenance & CMMS"], summary: "List Maintenance Notifications" } }, maintenanceController.getNotifications.bind(maintenanceController));
  fastify.get("/profile", { schema: { tags: ["Maintenance & CMMS"], summary: "Get Maintenance Technician Profile" } }, maintenanceController.getProfile.bind(maintenanceController));
  fastify.post("/work-orders/:id/execution", { schema: { tags: ["Maintenance & CMMS"], summary: "Save Work Order Execution Record" } }, maintenanceController.saveWorkOrderExecution.bind(maintenanceController));
  fastify.patch("/work-orders/:id/execution", { schema: { tags: ["Maintenance & CMMS"], summary: "Update Work Order Execution Record" } }, maintenanceController.saveWorkOrderExecution.bind(maintenanceController));
  fastify.post("/work-orders/:id/parts", { schema: { tags: ["Maintenance & CMMS"], summary: "Issue Spare Part to Work Order" } }, maintenanceController.issueWorkOrderPart.bind(maintenanceController));
  fastify.post("/spare-parts/issue", { schema: { tags: ["Maintenance & CMMS"], summary: "Issue Spare Part" } }, maintenanceController.issueWorkOrderPart.bind(maintenanceController));
  fastify.post("/work-orders/:id/sign-off", { schema: { tags: ["Maintenance & CMMS"], summary: "Supervisor Work Order Sign-Off" } }, maintenanceController.signOffWorkOrder.bind(maintenanceController));
  fastify.post("/work-orders/:id/comments", { schema: { tags: ["Maintenance & CMMS"], summary: "Add Work Order Comment" } }, maintenanceController.addWorkOrderComment.bind(maintenanceController));

  fastify.get("/spare-parts", { schema: { tags: ["Maintenance & CMMS"], summary: "List Spare Parts Inventory" } }, maintenanceController.getSpareParts.bind(maintenanceController));
  fastify.get("/reliability", { schema: { tags: ["Maintenance & CMMS"], summary: "Get Plant MTBF & Reliability Metrics" } }, maintenanceController.getReliabilityMetrics.bind(maintenanceController));
  fastify.get("/reliability/rca", { schema: { tags: ["Maintenance & CMMS"], summary: "List Reliability RCA Investigations" } }, maintenanceController.getRCAInvestigations.bind(maintenanceController));
  fastify.get("/rca/investigations", { schema: { tags: ["Maintenance & CMMS"], summary: "List RCA Investigations" } }, maintenanceController.getRCAInvestigations.bind(maintenanceController));
  fastify.post("/rca/investigations", { schema: { tags: ["Maintenance & CMMS"], summary: "Create RCA Investigation" } }, maintenanceController.createRCAInvestigation.bind(maintenanceController));
  fastify.post("/reliability/export", { schema: { tags: ["Maintenance & CMMS"], summary: "Export Reliability Report" } }, maintenanceController.exportReliabilityReport.bind(maintenanceController));
}
