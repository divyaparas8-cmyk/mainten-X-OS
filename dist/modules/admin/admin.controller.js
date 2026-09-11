"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const admin_service_js_1 = require("./admin.service.js");
class AdminController {
    async getDashboard(request, reply) {
        const user = request.user;
        const data = await admin_service_js_1.adminService.getDashboardMetrics(user?.tenantId);
        return reply.status(200).send(data);
    }
    async runHealthAudit(request, reply) {
        const user = request.user;
        const auditResult = await admin_service_js_1.adminService.runHealthAudit(user?.tenantId);
        return reply.status(200).send(auditResult);
    }
    async provisionUser(request, reply) {
        const user = request.user;
        const body = request.body;
        const newUser = await admin_service_js_1.adminService.provisionUser(user?.tenantId, body);
        return reply.status(201).send(newUser);
    }
    async getUsers(request, reply) {
        const user = request.user;
        const users = await admin_service_js_1.adminService.getAllUsers(user?.tenantId);
        return reply.status(200).send(users);
    }
    async updateUserStatus(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const { status } = request.body || {};
        const updated = await admin_service_js_1.adminService.updateUserStatus(user?.tenantId, id, status);
        return reply.status(200).send(updated);
    }
    async bulkUpdateUserStatus(request, reply) {
        const user = request.user;
        const { action } = request.body || {};
        const result = await admin_service_js_1.adminService.bulkUpdateUserStatus(user?.tenantId, action);
        return reply.status(200).send(result);
    }
    async getInvitations(request, reply) {
        const user = request.user;
        const invites = await admin_service_js_1.adminService.getInvitations(user?.tenantId);
        return reply.status(200).send(invites);
    }
    async createInvitation(request, reply) {
        const user = request.user;
        const body = request.body;
        const invite = await admin_service_js_1.adminService.createInvitation(user?.tenantId, body);
        return reply.status(201).send(invite);
    }
    async resendInvitation(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const res = await admin_service_js_1.adminService.resendInvitation(user?.tenantId, id);
        return reply.status(200).send(res);
    }
    async deleteInvitation(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const res = await admin_service_js_1.adminService.deleteInvitation(user?.tenantId, id);
        return reply.status(200).send(res);
    }
    async getActivityLogs(request, reply) {
        const user = request.user;
        const { query } = request.query || {};
        const logs = await admin_service_js_1.adminService.getActivityLogs(user?.tenantId, query);
        return reply.status(200).send(logs);
    }
    // Roles & Permissions
    async getRoles(request, reply) {
        const user = request.user;
        const roles = await admin_service_js_1.adminService.getRoles(user?.tenantId);
        return reply.status(200).send(roles);
    }
    async createRole(request, reply) {
        const user = request.user;
        const body = request.body;
        const newRole = await admin_service_js_1.adminService.createRole(user?.tenantId, body);
        return reply.status(201).send(newRole);
    }
    async getPermissionMatrix(request, reply) {
        const user = request.user;
        const matrix = await admin_service_js_1.adminService.getPermissionMatrix(user?.tenantId);
        return reply.status(200).send(matrix);
    }
    async updatePermissionMatrix(request, reply) {
        const user = request.user;
        const body = request.body;
        const result = await admin_service_js_1.adminService.updatePermissionMatrix(user?.tenantId, body);
        return reply.status(200).send(result);
    }
    async testPermissionAccess(request, reply) {
        const body = request.body;
        const result = await admin_service_js_1.adminService.testPermissionAccess(body);
        return reply.status(200).send(result);
    }
    async updateUserRoleMapping(request, reply) {
        const user = request.user;
        const { userId } = request.params;
        const { role } = request.body || {};
        const result = await admin_service_js_1.adminService.updateUserRoleMapping(user?.tenantId, userId, role);
        return reply.status(200).send(result);
    }
    async getApprovalRules(request, reply) {
        const user = request.user;
        const rules = await admin_service_js_1.adminService.getApprovalRules(user?.tenantId);
        return reply.status(200).send(rules);
    }
    async scanDataHealth(request, reply) {
        const user = request.user;
        const result = await admin_service_js_1.adminService.scanDataHealth(user?.tenantId);
        return reply.status(200).send({ success: true, data: result });
    }
    // ── INTEGRATIONS: IOT GATEWAYS ─────────────────────────────────────
    async getIoTGateways(request, reply) {
        const user = request.user;
        const gateways = await admin_service_js_1.adminService.getIoTGateways(user?.tenantId);
        return reply.status(200).send(gateways);
    }
    async createIoTGateway(request, reply) {
        const user = request.user;
        const body = request.body;
        const created = await admin_service_js_1.adminService.createIoTGateway(user?.tenantId, body);
        return reply.status(201).send(created);
    }
    async updateIoTGateway(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const body = request.body;
        const updated = await admin_service_js_1.adminService.updateIoTGateway(user?.tenantId, id, body);
        return reply.status(200).send(updated);
    }
    async deleteIoTGateway(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const result = await admin_service_js_1.adminService.deleteIoTGateway(user?.tenantId, id);
        return reply.status(200).send(result);
    }
    async pingIoTGateways(_request, reply) {
        const result = await admin_service_js_1.adminService.pingIoTGateways();
        return reply.status(200).send(result);
    }
    // ── INTEGRATIONS: ERP CONNECTOR ───────────────────────────────────
    async getERPStatus(request, reply) {
        const user = request.user;
        const status = await admin_service_js_1.adminService.getERPStatus(user?.tenantId);
        return reply.status(200).send(status);
    }
    async syncERP(request, reply) {
        const user = request.user;
        const result = await admin_service_js_1.adminService.syncERP(user?.tenantId);
        return reply.status(200).send(result);
    }
    // ── INTEGRATIONS: BARCODE SYMBOLOGY ───────────────────────────────
    async getBarcodeFormats(request, reply) {
        const user = request.user;
        const formats = await admin_service_js_1.adminService.getBarcodeFormats(user?.tenantId);
        return reply.status(200).send(formats);
    }
    async createBarcodeFormat(request, reply) {
        const user = request.user;
        const body = request.body;
        const created = await admin_service_js_1.adminService.createBarcodeFormat(user?.tenantId, body);
        return reply.status(201).send(created);
    }
    async updateBarcodeFormat(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const body = request.body;
        const updated = await admin_service_js_1.adminService.updateBarcodeFormat(user?.tenantId, id, body);
        return reply.status(200).send(updated);
    }
    async deleteBarcodeFormat(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const result = await admin_service_js_1.adminService.deleteBarcodeFormat(user?.tenantId, id);
        return reply.status(200).send(result);
    }
    // ── INTEGRATIONS: REST API KEYS ───────────────────────────────────
    async getApiKeys(request, reply) {
        const user = request.user;
        const keys = await admin_service_js_1.adminService.getApiKeys(user?.tenantId);
        return reply.status(200).send(keys);
    }
    async createApiKey(request, reply) {
        const user = request.user;
        const body = request.body;
        const created = await admin_service_js_1.adminService.createApiKey(user?.tenantId, body);
        return reply.status(201).send(created);
    }
    async revokeApiKey(request, reply) {
        const user = request.user;
        const { id } = request.params;
        const result = await admin_service_js_1.adminService.revokeApiKey(user?.tenantId, id);
        return reply.status(200).send(result);
    }
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();
//# sourceMappingURL=admin.controller.js.map