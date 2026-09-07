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
}

export const adminController = new AdminController();
