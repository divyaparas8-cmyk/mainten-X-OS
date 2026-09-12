"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterAdminController = exports.MasterAdminController = void 0;
const master_service_js_1 = require("./master.service.js");
function getActor(req) {
    const user = req.user;
    return {
        userId: user?.userId || user?.id,
        email: user?.email,
        role: user?.role,
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"],
    };
}
class MasterAdminController {
    // 1. Dashboard
    async getDashboard(_req, reply) {
        const data = await master_service_js_1.masterAdminService.getDashboard();
        return reply.send({ success: true, data });
    }
    // 2. Companies
    async getCompanies(req, reply) {
        const data = await master_service_js_1.masterAdminService.getCompanies(req.query);
        return reply.send({ success: true, data });
    }
    async getCompanyById(req, reply) {
        const data = await master_service_js_1.masterAdminService.getCompanyById(req.params.id);
        return reply.send({ success: true, data });
    }
    async createCompany(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.createCompany(req.body, actor);
        return reply.status(201).send({ success: true, message: "Company created successfully", data });
    }
    async updateCompany(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.updateCompanyDetails(req.params.id, req.body, actor);
        return reply.send({ success: true, message: "Company updated successfully", data });
    }
    async updateCompanyStatus(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.updateCompanyStatus(req.params.id, req.body.status, actor);
        return reply.send({ success: true, message: `Company status updated to ${req.body.status}`, data });
    }
    async deleteCompany(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.deleteCompany(req.params.id, actor);
        return reply.send(data);
    }
    // 3. Company Admins
    async getCompanyAdmins(req, reply) {
        const data = await master_service_js_1.masterAdminService.getCompanyAdmins(req.query);
        return reply.send({ success: true, data });
    }
    async createCompanyAdmin(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.createCompanyAdmin(req.body, actor);
        return reply.status(201).send({ success: true, message: "Company administrator created successfully", data });
    }
    async updateCompanyAdmin(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.updateCompanyAdmin(req.params.id, req.body, actor);
        return reply.send({ success: true, message: "Company administrator updated successfully", data });
    }
    async updateAdminStatus(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.updateAdminStatus(req.params.id, req.body.status, actor);
        return reply.send({ success: true, message: "Admin status updated", data });
    }
    async resetAdminPassword(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.resetAdminPassword(req.params.id, actor);
        return reply.send(data);
    }
    // 4. Plans
    async getPlans(_req, reply) {
        const data = await master_service_js_1.masterAdminService.getPlans();
        return reply.send({ success: true, data });
    }
    async createPlan(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.createPlan(req.body, actor);
        return reply.status(201).send({ success: true, message: "Plan created successfully", data });
    }
    async updatePlan(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.updatePlan(req.params.id, req.body, actor);
        return reply.send({ success: true, message: "Plan updated successfully", data });
    }
    async updatePlanStatus(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.updatePlanStatus(req.params.id, req.body.status, actor);
        return reply.send({ success: true, message: `Plan status changed to ${req.body.status}`, data });
    }
    async deletePlan(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.deletePlan(req.params.id, actor);
        return reply.send(data);
    }
    // 5. Subscriptions
    async getSubscriptions(req, reply) {
        const data = await master_service_js_1.masterAdminService.getSubscriptions(req.query);
        return reply.send({ success: true, data });
    }
    async extendSubscription(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.extendSubscription(req.params.id, actor);
        return reply.send({ success: true, message: "Subscription extended by 1 year", data });
    }
    async cancelSubscription(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.cancelSubscription(req.params.id, actor);
        return reply.send({ success: true, message: "Subscription cancelled and company suspended", data });
    }
    // 6. Payments
    async getPayments(req, reply) {
        const data = await master_service_js_1.masterAdminService.getPayments(req.query);
        return reply.send({ success: true, data });
    }
    async markPaymentPaid(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.markPaymentPaid(req.params.id, actor);
        return reply.send({ success: true, message: "Payment marked as paid", data });
    }
    async getInvoiceData(req, reply) {
        const data = await master_service_js_1.masterAdminService.getInvoiceData(req.params.id);
        return reply.send({ success: true, data });
    }
    // 7. Modules
    async getCompanyModules(req, reply) {
        const data = await master_service_js_1.masterAdminService.getCompanyModules(req.params.companyId);
        return reply.send({ success: true, data });
    }
    async toggleCompanyModule(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.toggleCompanyModule(req.params.companyId, req.params.moduleKey, req.body?.isEnabled, actor);
        return reply.send({ success: true, message: `Module ${req.params.moduleKey} updated`, data });
    }
    // 8. Platform Users
    async getPlatformUsers(req, reply) {
        const data = await master_service_js_1.masterAdminService.getPlatformUsers(req.query);
        return reply.send({ success: true, data });
    }
    async updateUserStatus(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.updateUserStatus(req.params.id, req.body.status, actor);
        return reply.send({ success: true, message: "User status updated", data });
    }
    async deleteUser(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.deleteUser(req.params.id, actor);
        return reply.send(data);
    }
    // 9. Analytics
    async getAnalytics(_req, reply) {
        const data = await master_service_js_1.masterAdminService.getPlatformAnalytics();
        return reply.send({ success: true, data });
    }
    // 10. Audit Logs
    async getAuditLogs(req, reply) {
        const data = await master_service_js_1.masterAdminService.getAuditLogs(req.query);
        return reply.send({ success: true, data });
    }
    async deleteAuditLog(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.deleteAuditLog(req.params.id, actor);
        return reply.send(data);
    }
    // 11. Support Tickets
    async getSupportTickets(req, reply) {
        const data = await master_service_js_1.masterAdminService.getSupportTickets(req.query);
        return reply.send({ success: true, data });
    }
    async createSupportTicket(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.createSupportTicket(req.body, actor);
        return reply.status(201).send({ success: true, message: "Support ticket created", data });
    }
    async updateTicketStatus(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.updateTicketStatus(req.params.id, req.body.status, req.body.resolution, actor);
        return reply.send({ success: true, message: "Ticket updated", data });
    }
    async deleteSupportTicket(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.deleteSupportTicket(req.params.id, actor);
        return reply.send(data);
    }
    // 12. Settings
    async getSettings(_req, reply) {
        const data = await master_service_js_1.masterAdminService.getPlatformSettings();
        return reply.send({ success: true, data });
    }
    async updateSettings(req, reply) {
        const actor = getActor(req);
        const data = await master_service_js_1.masterAdminService.updatePlatformSettings(req.body, actor);
        return reply.send({ success: true, message: "Platform settings saved", data });
    }
}
exports.MasterAdminController = MasterAdminController;
exports.masterAdminController = new MasterAdminController();
//# sourceMappingURL=master.controller.js.map