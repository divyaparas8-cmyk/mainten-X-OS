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

  async getActivityLogs(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { query } = (request.query as { query?: string }) || {};
    const logs = await adminService.getActivityLogs(user?.tenantId, query);
    return reply.status(200).send(logs);
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
}

export const adminController = new AdminController();


