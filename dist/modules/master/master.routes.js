"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterRoutes = masterRoutes;
const master_controller_js_1 = require("./master.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
const authorize_js_1 = require("../../middleware/authorize.js");
async function masterRoutes(fastify) {
    // All master admin routes are protected by JWT authentication and role authorization
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    fastify.addHook("preHandler", (0, authorize_js_1.authorizeRoles)(["master_admin", "admin", "system_admin", "super_admin"]));
    // 1. Control Center / Dashboard
    fastify.get("/dashboard", master_controller_js_1.masterAdminController.getDashboard.bind(master_controller_js_1.masterAdminController));
    // 2. Companies Management
    fastify.get("/companies", master_controller_js_1.masterAdminController.getCompanies.bind(master_controller_js_1.masterAdminController));
    fastify.post("/companies", master_controller_js_1.masterAdminController.createCompany.bind(master_controller_js_1.masterAdminController));
    fastify.get("/companies/:id", master_controller_js_1.masterAdminController.getCompanyById.bind(master_controller_js_1.masterAdminController));
    fastify.patch("/companies/:id", master_controller_js_1.masterAdminController.updateCompany.bind(master_controller_js_1.masterAdminController));
    fastify.patch("/companies/:id/status", master_controller_js_1.masterAdminController.updateCompanyStatus.bind(master_controller_js_1.masterAdminController));
    fastify.delete("/companies/:id", master_controller_js_1.masterAdminController.deleteCompany.bind(master_controller_js_1.masterAdminController));
    // 3. Company Administrators
    fastify.get("/company-admins", master_controller_js_1.masterAdminController.getCompanyAdmins.bind(master_controller_js_1.masterAdminController));
    fastify.post("/company-admins", master_controller_js_1.masterAdminController.createCompanyAdmin.bind(master_controller_js_1.masterAdminController));
    fastify.patch("/company-admins/:id", master_controller_js_1.masterAdminController.updateCompanyAdmin.bind(master_controller_js_1.masterAdminController));
    fastify.patch("/company-admins/:id/status", master_controller_js_1.masterAdminController.updateAdminStatus.bind(master_controller_js_1.masterAdminController));
    fastify.post("/company-admins/:id/password-reset", master_controller_js_1.masterAdminController.resetAdminPassword.bind(master_controller_js_1.masterAdminController));
    // 4. Plans & Pricing
    fastify.get("/plans", master_controller_js_1.masterAdminController.getPlans.bind(master_controller_js_1.masterAdminController));
    fastify.post("/plans", master_controller_js_1.masterAdminController.createPlan.bind(master_controller_js_1.masterAdminController));
    fastify.patch("/plans/:id", master_controller_js_1.masterAdminController.updatePlan.bind(master_controller_js_1.masterAdminController));
    fastify.patch("/plans/:id/status", master_controller_js_1.masterAdminController.updatePlanStatus.bind(master_controller_js_1.masterAdminController));
    fastify.delete("/plans/:id", master_controller_js_1.masterAdminController.deletePlan.bind(master_controller_js_1.masterAdminController));
    // 5. Subscriptions
    fastify.get("/subscriptions", master_controller_js_1.masterAdminController.getSubscriptions.bind(master_controller_js_1.masterAdminController));
    fastify.post("/subscriptions/:id/extend", master_controller_js_1.masterAdminController.extendSubscription.bind(master_controller_js_1.masterAdminController));
    fastify.post("/subscriptions/:id/cancel", master_controller_js_1.masterAdminController.cancelSubscription.bind(master_controller_js_1.masterAdminController));
    // 6. Payments & Invoicing
    fastify.get("/payments", master_controller_js_1.masterAdminController.getPayments.bind(master_controller_js_1.masterAdminController));
    fastify.patch("/payments/:id/paid", master_controller_js_1.masterAdminController.markPaymentPaid.bind(master_controller_js_1.masterAdminController));
    fastify.get("/payments/:id/invoice", master_controller_js_1.masterAdminController.getInvoiceData.bind(master_controller_js_1.masterAdminController));
    // 7. Modules & Features
    fastify.get("/modules", master_controller_js_1.masterAdminController.getCompanies.bind(master_controller_js_1.masterAdminController));
    fastify.get("/companies/:companyId/modules", master_controller_js_1.masterAdminController.getCompanyModules.bind(master_controller_js_1.masterAdminController));
    fastify.patch("/companies/:companyId/modules/:moduleKey", master_controller_js_1.masterAdminController.toggleCompanyModule.bind(master_controller_js_1.masterAdminController));
    // 8. Global Platform Users
    fastify.get("/platform-users", master_controller_js_1.masterAdminController.getPlatformUsers.bind(master_controller_js_1.masterAdminController));
    fastify.patch("/platform-users/:id/status", master_controller_js_1.masterAdminController.updateUserStatus.bind(master_controller_js_1.masterAdminController));
    fastify.delete("/platform-users/:id", master_controller_js_1.masterAdminController.deleteUser.bind(master_controller_js_1.masterAdminController));
    // 9. Platform Analytics
    fastify.get("/analytics", master_controller_js_1.masterAdminController.getAnalytics.bind(master_controller_js_1.masterAdminController));
    // 10. Activity & Audit Logs
    fastify.get("/audit-logs", master_controller_js_1.masterAdminController.getAuditLogs.bind(master_controller_js_1.masterAdminController));
    fastify.delete("/audit-logs", master_controller_js_1.masterAdminController.clearAllAuditLogs.bind(master_controller_js_1.masterAdminController));
    fastify.delete("/audit-logs/:id", master_controller_js_1.masterAdminController.deleteAuditLog.bind(master_controller_js_1.masterAdminController));
    // 11. Support Tickets
    fastify.get("/support-tickets", master_controller_js_1.masterAdminController.getSupportTickets.bind(master_controller_js_1.masterAdminController));
    fastify.post("/support-tickets", master_controller_js_1.masterAdminController.createSupportTicket.bind(master_controller_js_1.masterAdminController));
    fastify.patch("/support-tickets/:id/status", master_controller_js_1.masterAdminController.updateTicketStatus.bind(master_controller_js_1.masterAdminController));
    fastify.delete("/support-tickets/:id", master_controller_js_1.masterAdminController.deleteSupportTicket.bind(master_controller_js_1.masterAdminController));
    // 12. Platform Settings
    fastify.get("/settings", master_controller_js_1.masterAdminController.getSettings.bind(master_controller_js_1.masterAdminController));
    fastify.put("/settings", master_controller_js_1.masterAdminController.updateSettings.bind(master_controller_js_1.masterAdminController));
}
//# sourceMappingURL=master.routes.js.map