import { FastifyInstance } from "fastify";
import { masterAdminController } from "./master.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorizeRoles } from "../../middleware/authorize.js";

export async function masterRoutes(fastify: FastifyInstance) {
  // All master admin routes are protected by JWT authentication and role authorization
  fastify.addHook("preHandler", authenticate);
  fastify.addHook("preHandler", authorizeRoles(["master_admin"]));

  // 1. Control Center / Dashboard
  fastify.get("/dashboard", masterAdminController.getDashboard.bind(masterAdminController));

  // 2. Companies Management
  fastify.get("/companies", masterAdminController.getCompanies.bind(masterAdminController));
  fastify.post("/companies", masterAdminController.createCompany.bind(masterAdminController));
  fastify.get("/companies/:id", masterAdminController.getCompanyById.bind(masterAdminController));
  fastify.patch("/companies/:id", masterAdminController.updateCompany.bind(masterAdminController));
  fastify.patch("/companies/:id/status", masterAdminController.updateCompanyStatus.bind(masterAdminController));
  fastify.delete("/companies/:id", masterAdminController.deleteCompany.bind(masterAdminController));

  // 3. Company Administrators
  fastify.get("/company-admins", masterAdminController.getCompanyAdmins.bind(masterAdminController));
  fastify.post("/company-admins", masterAdminController.createCompanyAdmin.bind(masterAdminController));
  fastify.patch("/company-admins/:id", masterAdminController.updateCompanyAdmin.bind(masterAdminController));
  fastify.patch("/company-admins/:id/status", masterAdminController.updateAdminStatus.bind(masterAdminController));
  fastify.post("/company-admins/:id/password-reset", masterAdminController.resetAdminPassword.bind(masterAdminController));

  // 4. Plans & Pricing
  fastify.get("/plans", masterAdminController.getPlans.bind(masterAdminController));
  fastify.post("/plans", masterAdminController.createPlan.bind(masterAdminController));
  fastify.patch("/plans/:id", masterAdminController.updatePlan.bind(masterAdminController));
  fastify.patch("/plans/:id/status", masterAdminController.updatePlanStatus.bind(masterAdminController));
  fastify.delete("/plans/:id", masterAdminController.deletePlan.bind(masterAdminController));

  // 5. Subscriptions
  fastify.get("/subscriptions", masterAdminController.getSubscriptions.bind(masterAdminController));
  fastify.post("/subscriptions/:id/extend", masterAdminController.extendSubscription.bind(masterAdminController));
  fastify.post("/subscriptions/:id/cancel", masterAdminController.cancelSubscription.bind(masterAdminController));

  // 6. Payments & Invoicing
  fastify.get("/payments", masterAdminController.getPayments.bind(masterAdminController));
  fastify.patch("/payments/:id/paid", masterAdminController.markPaymentPaid.bind(masterAdminController));
  fastify.get("/payments/:id/invoice", masterAdminController.getInvoiceData.bind(masterAdminController));

  // 7. Modules & Features
  fastify.get("/modules", masterAdminController.getCompanies.bind(masterAdminController));
  fastify.get("/companies/:companyId/modules", masterAdminController.getCompanyModules.bind(masterAdminController));
  fastify.patch("/companies/:companyId/modules/:moduleKey", masterAdminController.toggleCompanyModule.bind(masterAdminController));

  // 8. Global Platform Users
  fastify.get("/platform-users", masterAdminController.getPlatformUsers.bind(masterAdminController));
  fastify.patch("/platform-users/:id/status", masterAdminController.updateUserStatus.bind(masterAdminController));
  fastify.delete("/platform-users/:id", masterAdminController.deleteUser.bind(masterAdminController));

  // 9. Platform Analytics
  fastify.get("/analytics", masterAdminController.getAnalytics.bind(masterAdminController));

  // 10. Activity & Audit Logs
  fastify.get("/audit-logs", masterAdminController.getAuditLogs.bind(masterAdminController));

  // 11. Support Tickets
  fastify.get("/support-tickets", masterAdminController.getSupportTickets.bind(masterAdminController));
  fastify.post("/support-tickets", masterAdminController.createSupportTicket.bind(masterAdminController));
  fastify.patch("/support-tickets/:id/status", masterAdminController.updateTicketStatus.bind(masterAdminController));
  fastify.delete("/support-tickets/:id", masterAdminController.deleteSupportTicket.bind(masterAdminController));

  // 12. Platform Settings
  fastify.get("/settings", masterAdminController.getSettings.bind(masterAdminController));
  fastify.put("/settings", masterAdminController.updateSettings.bind(masterAdminController));
}
