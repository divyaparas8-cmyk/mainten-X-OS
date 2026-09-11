import { FastifyReply, FastifyRequest } from "fastify";
import { maintenanceService } from "./maintenance.service.js";
import { createWorkOrderSchema, updateWorkOrderStatusSchema } from "./maintenance.schema.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

import { resolvePlantId } from "../../shared/utils/tenantContext.js";

export class MaintenanceController {
  async getWorkOrders(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await maintenanceService.listWorkOrders(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data));
  }

  async getBreakdowns(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await maintenanceService.listBreakdowns(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data));
  }

  async getHistory(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await maintenanceService.listHistory(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data));
  }

  async exportHistory(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await maintenanceService.exportHistoryDossier(request.user.tenantId, request.params.id);
    return reply.send(formatSuccess(data, `History dossier exported successfully for ${request.params.id}`));
  }

  async updateAsset(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await maintenanceService.updateAsset(request.user.tenantId, request.params.id, request.body);
    return reply.send(formatSuccess(data, `Asset ${request.params.id} updated successfully`));
  }

  async getTroubleshooting(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.listTroubleshooting(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async saveTroubleshootingStep(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.saveTroubleshootingStep(request.user.tenantId, request.body);
    return reply.send(formatSuccess(data, "Troubleshooting step recorded"));
  }

  async saveTroubleshootingDraft(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.saveTroubleshootingDraft(request.user.tenantId, request.body);
    return reply.send(formatSuccess(data, "Troubleshooting draft saved"));
  }

  async saveTroubleshootingSolution(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.saveTroubleshootingSolution(request.user.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Troubleshooting solution saved successfully"));
  }

  async createWorkOrder(request: FastifyRequest, reply: FastifyReply) {
    const input = createWorkOrderSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await maintenanceService.createWorkOrder(request.user.tenantId, plantId, input, request.user.userId);
    return reply.status(201).send(formatSuccess(data, "Maintenance Work Order created"));
  }

  async updateWorkOrderStatus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const input = updateWorkOrderStatusSchema.parse(request.body);
    const data = await maintenanceService.updateWorkOrderStatus(request.user.tenantId, request.params.id, input);
    return reply.send(formatSuccess(data, `Work Order status updated to ${input.status}`));
  }

  async getPMSchedules(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.listPMSchedules(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createPMSchedule(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { title: string; assetId?: string; frequency?: string; assignedTo?: string; dueDate?: string };
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await maintenanceService.createPMSchedule(request.user.tenantId, plantId, body);
    return reply.status(201).send(formatSuccess(data, "PM Schedule created successfully"));
  }

  async executePMChecklist(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.executePMChecklist(request.user.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "PM Checklist executed & signed off successfully"));
  }

  async savePMChecklistDraft(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.savePMChecklistDraft(request.user.tenantId, request.body);
    return reply.send(formatSuccess(data, "PM Checklist draft saved successfully"));
  }

  async getPM(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.listPM(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getCalendar(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.listCalendar(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getNotifications(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.listNotifications(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.listProfile(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.updateProfile(request.user.tenantId, request.body);
    return reply.send(formatSuccess(data, "Profile updated successfully"));
  }

  async getSpareParts(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.listSpareParts(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getReliabilityMetrics(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.getReliabilityMetrics(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async getRCAInvestigations(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.getRCAInvestigations(request.user.tenantId);
    return reply.send(formatSuccess(data, "RCA investigations fetched successfully"));
  }

  async createRCAInvestigation(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.createRCAInvestigation(request.user.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "RCA investigation created successfully"));
  }

  async exportReliabilityReport(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.exportReliabilityReport(request.user.tenantId);
    return reply.send(formatSuccess(data, "Reliability analytics report exported successfully"));
  }

  async saveWorkOrderExecution(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await maintenanceService.saveWorkOrderExecution(request.user.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Repair actions and verification test results saved successfully"));
  }

  async issueWorkOrderPart(request: FastifyRequest, reply: FastifyReply) {
    const { id } = (request.params || {}) as { id?: string };
    const body = (request.body || {}) as any;
    const data = await maintenanceService.issueWorkOrderPart(request.user.tenantId, { workOrderId: id, ...body });
    return reply.status(201).send(formatSuccess(data, "Spare part issued successfully to work order"));
  }

  async signOffWorkOrder(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await maintenanceService.signOffWorkOrder(request.user.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Work order verified and signed off successfully"));
  }

  async addWorkOrderComment(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await maintenanceService.addWorkOrderComment(request.user.tenantId, id, request.body);
    return reply.status(201).send(formatSuccess(data, "Comment logged to work order activity trail"));
  }
}

export const maintenanceController = new MaintenanceController();
