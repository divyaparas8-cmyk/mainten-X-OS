import { FastifyRequest, FastifyReply } from "fastify";
export declare class AdminController {
    getDashboard(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    runHealthAudit(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    provisionUser(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getUsers(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateUserStatus(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    bulkUpdateUserStatus(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getInvitations(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createInvitation(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    resendInvitation(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    deleteInvitation(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getActivityLogs(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getRoles(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createRole(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getPermissionMatrix(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updatePermissionMatrix(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    testPermissionAccess(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateUserRoleMapping(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getApprovalRules(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    scanDataHealth(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getIoTGateways(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createIoTGateway(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateIoTGateway(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    deleteIoTGateway(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    pingIoTGateways(_request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getERPStatus(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    syncERP(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getBarcodeFormats(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createBarcodeFormat(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateBarcodeFormat(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    deleteBarcodeFormat(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getApiKeys(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createApiKey(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    revokeApiKey(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const adminController: AdminController;
//# sourceMappingURL=admin.controller.d.ts.map