import { FastifyReply, FastifyRequest } from "fastify";
import { masterAdminService, ActorContext } from "./master.service.js";

function getActor(req: FastifyRequest): ActorContext {
  const user = (req as any).user;
  return {
    userId: user?.userId || user?.id,
    email: user?.email,
    role: user?.role,
    ipAddress: req.ip || (req.headers["x-forwarded-for"] as string) || "127.0.0.1",
    userAgent: req.headers["user-agent"],
  };
}

export class MasterAdminController {
  // 1. Dashboard
  async getDashboard(_req: FastifyRequest, reply: FastifyReply) {
    const data = await masterAdminService.getDashboard();
    return reply.send({ success: true, data });
  }

  // 2. Companies
  async getCompanies(req: FastifyRequest<{ Querystring: { search?: string; status?: string } }>, reply: FastifyReply) {
    const data = await masterAdminService.getCompanies(req.query);
    return reply.send({ success: true, data });
  }

  async getCompanyById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await masterAdminService.getCompanyById(req.params.id);
    return reply.send({ success: true, data });
  }

  async createCompany(req: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.createCompany(req.body as any, actor);
    return reply.status(201).send({ success: true, message: "Company created successfully", data });
  }

  async updateCompany(req: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.updateCompanyDetails(req.params.id, req.body as any, actor);
    return reply.send({ success: true, message: "Company updated successfully", data });
  }

  async updateCompanyStatus(req: FastifyRequest<{ Params: { id: string }; Body: { status: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.updateCompanyStatus(req.params.id, req.body.status, actor);
    return reply.send({ success: true, message: `Company status updated to ${req.body.status}`, data });
  }

  async deleteCompany(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.deleteCompany(req.params.id, actor);
    return reply.send(data);
  }

  // 3. Company Admins
  async getCompanyAdmins(req: FastifyRequest<{ Querystring: { search?: string; status?: string } }>, reply: FastifyReply) {
    const data = await masterAdminService.getCompanyAdmins(req.query);
    return reply.send({ success: true, data });
  }

  async createCompanyAdmin(req: FastifyRequest<{ Body: { name: string; email?: string; company?: string; companyId?: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.createCompanyAdmin(req.body, actor);
    return reply.status(201).send({ success: true, message: "Company administrator created successfully", data });
  }

  async updateCompanyAdmin(req: FastifyRequest<{ Params: { id: string }; Body: { name?: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.updateCompanyAdmin(req.params.id, req.body, actor);
    return reply.send({ success: true, message: "Company administrator updated successfully", data });
  }

  async updateAdminStatus(req: FastifyRequest<{ Params: { id: string }; Body: { status: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.updateAdminStatus(req.params.id, req.body.status, actor);
    return reply.send({ success: true, message: "Admin status updated", data });
  }

  async resetAdminPassword(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.resetAdminPassword(req.params.id, actor);
    return reply.send(data);
  }

  // 4. Plans
  async getPlans(_req: FastifyRequest, reply: FastifyReply) {
    const data = await masterAdminService.getPlans();
    return reply.send({ success: true, data });
  }

  async createPlan(req: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.createPlan(req.body, actor);
    return reply.status(201).send({ success: true, message: "Plan created successfully", data });
  }

  async updatePlan(req: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.updatePlan(req.params.id, req.body, actor);
    return reply.send({ success: true, message: "Plan updated successfully", data });
  }

  async updatePlanStatus(req: FastifyRequest<{ Params: { id: string }; Body: { status: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.updatePlanStatus(req.params.id, req.body.status, actor);
    return reply.send({ success: true, message: `Plan status changed to ${req.body.status}`, data });
  }

  async deletePlan(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.deletePlan(req.params.id, actor);
    return reply.send(data);
  }

  // 5. Subscriptions
  async getSubscriptions(req: FastifyRequest<{ Querystring: { search?: string; plan?: string; status?: string } }>, reply: FastifyReply) {
    const data = await masterAdminService.getSubscriptions(req.query);
    return reply.send({ success: true, data });
  }

  async extendSubscription(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.extendSubscription(req.params.id, actor);
    return reply.send({ success: true, message: "Subscription extended by 1 year", data });
  }

  async cancelSubscription(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.cancelSubscription(req.params.id, actor);
    return reply.send({ success: true, message: "Subscription cancelled and company suspended", data });
  }

  // 6. Payments
  async getPayments(req: FastifyRequest<{ Querystring: { search?: string; status?: string } }>, reply: FastifyReply) {
    const data = await masterAdminService.getPayments(req.query);
    return reply.send({ success: true, data });
  }

  async markPaymentPaid(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.markPaymentPaid(req.params.id, actor);
    return reply.send({ success: true, message: "Payment marked as paid", data });
  }

  async getInvoiceData(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await masterAdminService.getInvoiceData(req.params.id);
    return reply.send({ success: true, data });
  }

  // 7. Modules
  async getCompanyModules(req: FastifyRequest<{ Params: { companyId: string } }>, reply: FastifyReply) {
    const data = await masterAdminService.getCompanyModules(req.params.companyId);
    return reply.send({ success: true, data });
  }

  async toggleCompanyModule(
    req: FastifyRequest<{ Params: { companyId: string; moduleKey: string }; Body?: { isEnabled?: boolean } }>,
    reply: FastifyReply
  ) {
    const actor = getActor(req);
    const data = await masterAdminService.toggleCompanyModule(
      req.params.companyId,
      req.params.moduleKey,
      req.body?.isEnabled,
      actor
    );
    return reply.send({ success: true, message: `Module ${req.params.moduleKey} updated`, data });
  }

  // 8. Platform Users
  async getPlatformUsers(req: FastifyRequest<{ Querystring: { search?: string; status?: string } }>, reply: FastifyReply) {
    const data = await masterAdminService.getPlatformUsers(req.query);
    return reply.send({ success: true, data });
  }

  async updateUserStatus(req: FastifyRequest<{ Params: { id: string }; Body: { status: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.updateUserStatus(req.params.id, req.body.status, actor);
    return reply.send({ success: true, message: "User status updated", data });
  }

  async deleteUser(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.deleteUser(req.params.id, actor);
    return reply.send(data);
  }

  // 9. Analytics
  async getAnalytics(_req: FastifyRequest, reply: FastifyReply) {
    const data = await masterAdminService.getPlatformAnalytics();
    return reply.send({ success: true, data });
  }

  // 10. Audit Logs
  async getAuditLogs(req: FastifyRequest<{ Querystring: { search?: string; event?: string } }>, reply: FastifyReply) {
    const data = await masterAdminService.getAuditLogs(req.query);
    return reply.send({ success: true, data });
  }

  // 11. Support Tickets
  async getSupportTickets(req: FastifyRequest<{ Querystring: { search?: string; status?: string } }>, reply: FastifyReply) {
    const data = await masterAdminService.getSupportTickets(req.query);
    return reply.send({ success: true, data });
  }

  async createSupportTicket(req: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.createSupportTicket(req.body as any, actor);
    return reply.status(201).send({ success: true, message: "Support ticket created", data });
  }

  async updateTicketStatus(
    req: FastifyRequest<{ Params: { id: string }; Body: { status: string; resolution?: string } }>,
    reply: FastifyReply
  ) {
    const actor = getActor(req);
    const data = await masterAdminService.updateTicketStatus(req.params.id, req.body.status, req.body.resolution, actor);
    return reply.send({ success: true, message: "Ticket updated", data });
  }

  async deleteSupportTicket(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.deleteSupportTicket(req.params.id, actor);
    return reply.send(data);
  }

  // 12. Settings
  async getSettings(_req: FastifyRequest, reply: FastifyReply) {
    const data = await masterAdminService.getPlatformSettings();
    return reply.send({ success: true, data });
  }

  async updateSettings(req: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    const actor = getActor(req);
    const data = await masterAdminService.updatePlatformSettings(req.body, actor);
    return reply.send({ success: true, message: "Platform settings saved", data });
  }
}

export const masterAdminController = new MasterAdminController();
