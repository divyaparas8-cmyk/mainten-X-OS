import { FastifyRequest, FastifyReply } from "fastify";
import { adminService } from "./admin.service.js";

export class AdminController {
  async getDashboard(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const data = await adminService.getDashboardMetrics(user?.tenantId);
    return reply.status(200).send(data);
  }

  async runHealthAudit(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const auditResult = await adminService.runHealthAudit(user?.tenantId);
    return reply.status(200).send(auditResult);
  }

  async provisionUser(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const body = request.body as any;
    const newUser = await adminService.provisionUser(user?.tenantId, body);
    return reply.status(201).send(newUser);
  }

  async getUsers(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const users = await adminService.getAllUsers(user?.tenantId);
    return reply.status(200).send(users);
  }

  async updateUserStatus(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const { status } = (request.body as any) || {};
    const updated = await adminService.updateUserStatus(user?.tenantId, id, status);
    return reply.status(200).send(updated);
  }

  async editUser(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const updated = await adminService.editUser(user?.tenantId, id, body);
    return reply.status(200).send(updated);
  }

  async deleteUser(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.deleteUser(user?.tenantId, id);
    return reply.status(200).send(result);
  }

  async bulkUpdateUserStatus(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { action } = (request.body as any) || {};
    const result = await adminService.bulkUpdateUserStatus(user?.tenantId, action);
    return reply.status(200).send(result);
  }

  async getInvitations(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const invites = await adminService.getInvitations(user?.tenantId);
    return reply.status(200).send(invites);
  }

  async createInvitation(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const body = request.body as any;
    const invite = await adminService.createInvitation(user?.tenantId, body);
    return reply.status(201).send(invite);
  }

  async resendInvitation(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const res = await adminService.resendInvitation(user?.tenantId, id);
    return reply.status(200).send(res);
  }

  async deleteInvitation(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const res = await adminService.deleteInvitation(user?.tenantId, id);
    return reply.status(200).send(res);
  }

  async updateInvitation(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const res = await adminService.updateInvitation(user?.tenantId, id, body);
    return reply.status(200).send(res);
  }

  async getActivityLogs(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { query } = (request.query as { query?: string }) || {};
    const logs = await adminService.getActivityLogs(user?.tenantId, query);
    return reply.status(200).send(logs);
  }

  async createActivityLog(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const body = request.body as any;
    const res = await adminService.createActivityLog(user?.tenantId, body);
    return reply.status(201).send(res);
  }

  async updateActivityLog(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const res = await adminService.updateActivityLog(user?.tenantId, id, body);
    return reply.status(200).send(res);
  }

  async deleteActivityLog(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const res = await adminService.deleteActivityLog(user?.tenantId, id);
    return reply.status(200).send(res);
  }

  // Roles & Permissions
  async getRoles(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const roles = await adminService.getRoles(user?.tenantId);
    return reply.status(200).send(roles);
  }

  async createRole(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const body = request.body as any;
    const newRole = await adminService.createRole(user?.tenantId, body);
    return reply.status(201).send(newRole);
  }

  async updateRole(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const updated = await adminService.updateRole(user?.tenantId, id, body);
    return reply.status(200).send(updated);
  }

  async deleteRole(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.deleteRole(user?.tenantId, id);
    return reply.status(200).send(result);
  }

  async getPermissionMatrix(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const matrix = await adminService.getPermissionMatrix(user?.tenantId);
    return reply.status(200).send(matrix);
  }

  async updatePermissionMatrix(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const body = request.body as any;
    const result = await adminService.updatePermissionMatrix(user?.tenantId, body);
    return reply.status(200).send(result);
  }

  async testPermissionAccess(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const result = await adminService.testPermissionAccess(body);
    return reply.status(200).send(result);
  }

  async updateUserRoleMapping(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { userId } = request.params as { userId: string };
    const { role } = (request.body as any) || {};
    const result = await adminService.updateUserRoleMapping(user?.tenantId, userId, role);
    return reply.status(200).send(result);
  }

  async getApprovalRules(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const rules = await adminService.getApprovalRules(user?.tenantId);
    return reply.status(200).send(rules);
  }

  async createApprovalRule(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const body = request.body as any;
    const created = await adminService.createApprovalRule(user?.tenantId, body);
    return reply.status(201).send(created);
  }

  async updateApprovalRule(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const updated = await adminService.updateApprovalRule(user?.tenantId, id, body);
    return reply.status(200).send(updated);
  }

  async deleteApprovalRule(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.deleteApprovalRule(user?.tenantId, id);
    return reply.status(200).send(result);
  }

  async scanDataHealth(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const result = await adminService.scanDataHealth(user?.tenantId);
    return reply.status(200).send({ success: true, data: result });
  }

  async remediateDataHealth(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const body = request.body as any;
    const result = await adminService.remediateDataHealthItem(user?.tenantId, body);
    return reply.status(200).send(result);
  }

  async deleteDataHealth(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const body = (request.body as any) || {};
    const params = (request.params as any) || {};
    const id = params.id || body.id;
    const category = params.category || body.category;
    const result = await adminService.deleteDataHealthItem(user?.tenantId, { ...body, id, category });
    return reply.status(200).send(result);
  }

  async createDataHealth(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { category } = request.params as { category: string };
    const body = request.body as any;
    const result = await adminService.createDataHealthRecord(user?.tenantId, category, body);
    return reply.status(201).send(result);
  }

  async updateDataHealth(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { category, id } = request.params as { category: string; id: string };
    const body = request.body as any;
    const result = await adminService.updateDataHealthRecord(user?.tenantId, category, id, body);
    return reply.status(200).send(result);
  }

  // ── INTEGRATIONS: IOT GATEWAYS ─────────────────────────────────────
  async getIoTGateways(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const gateways = await adminService.getIoTGateways(user?.tenantId);
    return reply.status(200).send(gateways);
  }

  async createIoTGateway(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const body = request.body as any;
    const created = await adminService.createIoTGateway(user?.tenantId, body);
    return reply.status(201).send(created);
  }

  async updateIoTGateway(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const updated = await adminService.updateIoTGateway(user?.tenantId, id, body);
    return reply.status(200).send(updated);
  }

  async deleteIoTGateway(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.deleteIoTGateway(user?.tenantId, id);
    return reply.status(200).send(result);
  }

  async pingIoTGateways(_request: FastifyRequest, reply: FastifyReply) {
    const result = await adminService.pingIoTGateways();
    return reply.status(200).send(result);
  }

  // ── INTEGRATIONS: ERP CONNECTOR ───────────────────────────────────
  async getERPStatus(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const status = await adminService.getERPStatus(user?.tenantId);
    return reply.status(200).send(status);
  }

  async updateERPConfig(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const body = request.body as any;
    const updated = await adminService.updateERPConfig(user?.tenantId, body);
    return reply.status(200).send(updated);
  }

  async syncERP(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const result = await adminService.syncERP(user?.tenantId);
    return reply.status(200).send(result);
  }

  async getERPEvents(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const events = await adminService.getERPEvents(user?.tenantId);
    return reply.status(200).send(events);
  }

  async deleteERPEvent(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.deleteERPEvent(user?.tenantId, id);
    return reply.status(200).send(result);
  }

  // ── INTEGRATIONS: BARCODE SYMBOLOGY ───────────────────────────────
  async getBarcodeFormats(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const formats = await adminService.getBarcodeFormats(user?.tenantId);
    return reply.status(200).send(formats);
  }

  async createBarcodeFormat(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const body = request.body as any;
    const created = await adminService.createBarcodeFormat(user?.tenantId, body);
    return reply.status(201).send(created);
  }

  async updateBarcodeFormat(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const updated = await adminService.updateBarcodeFormat(user?.tenantId, id, body);
    return reply.status(200).send(updated);
  }

  async deleteBarcodeFormat(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.deleteBarcodeFormat(user?.tenantId, id);
    return reply.status(200).send(result);
  }

  // ── INTEGRATIONS: REST API KEYS ───────────────────────────────────
  async getApiKeys(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const keys = await adminService.getApiKeys(user?.tenantId);
    return reply.status(200).send(keys);
  }

  async createApiKey(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const body = request.body as any;
    const created = await adminService.createApiKey(user?.tenantId, body);
    return reply.status(201).send(created);
  }

  async updateApiKey(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const updated = await adminService.updateApiKey(user?.tenantId, id, body);
    return reply.status(200).send(updated);
  }

  async revokeApiKey(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.revokeApiKey(user?.tenantId, id);
    return reply.status(200).send(result);
  }

  // ── SECURITY POLICIES ──────────────────────────────────────────────
  async getSecurityPolicies(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const policies = await adminService.getSecurityPolicies(user?.tenantId);
    return reply.status(200).send(policies);
  }

  async saveSecurityPolicies(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const result = await adminService.saveSecurityPolicies(user?.tenantId, request.body);
    return reply.status(200).send(result);
  }

  // ── SYSTEM CONFIGURATION ───────────────────────────────────────────
  async getSystemConfig(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const config = await adminService.getSystemConfig(user?.tenantId);
    return reply.status(200).send(config);
  }

  async saveSystemConfig(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const result = await adminService.saveSystemConfig(user?.tenantId, request.body);
    return reply.status(200).send(result);
  }

  // ── AUDIT LOGS ─────────────────────────────────────────────────────
  async getAuditLogs(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { query } = request.query as { query?: string };
    const logs = await adminService.getAuditLogs(user?.tenantId, query);
    return reply.status(200).send(logs);
  }

  async createAuditLog(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const result = await adminService.createAuditLog(user?.tenantId, request.body);
    return reply.status(201).send(result);
  }

  async updateAuditLog(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.updateAuditLog(user?.tenantId, id, request.body);
    return reply.status(200).send(result);
  }

  async deleteAuditLog(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.deleteAuditLog(user?.tenantId, id);
    return reply.status(200).send(result);
  }

  // ── DATA REMEDIATION ───────────────────────────────────────────────
  async getRemediationLog(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const logs = await adminService.getRemediationLog(user?.tenantId);
    return reply.status(200).send(logs);
  }

  async executeRemediationEngine(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const result = await adminService.executeRemediationEngine(user?.tenantId);
    return reply.status(200).send(result);
  }

  async deleteRemediationLog(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.deleteRemediationLog(user?.tenantId, id);
    return reply.status(200).send(result);
  }

  async createRemediationLog(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const result = await adminService.createRemediationLog(user?.tenantId, request.body);
    return reply.status(201).send(result);
  }

  async updateRemediationLog(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.updateRemediationLog(user?.tenantId, id, request.body);
    return reply.status(200).send(result);
  }

  // ── DATA MIGRATION ─────────────────────────────────────────────────
  async getMigrationBatches(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const batches = await adminService.getMigrationBatches(user?.tenantId);
    return reply.status(200).send(batches);
  }

  async createMigrationBatch(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const result = await adminService.createMigrationBatch(user?.tenantId, request.body);
    return reply.status(201).send(result);
  }

  async updateMigrationBatch(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.updateMigrationBatch(user?.tenantId, id, request.body);
    return reply.status(200).send(result);
  }

  async executeMigrationBatch(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const result = await adminService.executeMigrationBatch(user?.tenantId, request.body);
    return reply.status(200).send(result);
  }

  async deleteMigrationBatch(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.deleteMigrationBatch(user?.tenantId, id);
    return reply.status(200).send(result);
  }

  // ── 12. SYSTEM REPORTS ─────────────────────────────────────────────
  async getSystemReports(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const reports = await adminService.getSystemReports(user?.tenantId);
    return reply.status(200).send(reports);
  }

  async getSystemGovernanceReports(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const reports = await adminService.getSystemGovernanceReports(user?.tenantId);
    return reply.status(200).send(reports);
  }

  async createSystemReport(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const result = await adminService.createSystemReport(user?.tenantId, request.body);
    return reply.status(201).send(result);
  }

  async updateSystemReport(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.updateSystemReport(user?.tenantId, id, request.body);
    return reply.status(200).send(result);
  }

  async deleteSystemReport(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as { id: string };
    const result = await adminService.deleteSystemReport(user?.tenantId, id);
    return reply.status(200).send(result);
  }

  async exportSystemReport(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const result = await adminService.exportSystemReport(user?.tenantId);
    return reply.status(200).send(result);
  }
}

export const adminController = new AdminController();




