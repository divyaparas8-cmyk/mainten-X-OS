import { FastifyReply, FastifyRequest } from "fastify";
export declare class MasterAdminController {
    getDashboard(_req: FastifyRequest, reply: FastifyReply): Promise<never>;
    getCompanies(req: FastifyRequest<{
        Querystring: {
            search?: string;
            status?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getCompanyById(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createCompany(req: FastifyRequest<{
        Body: any;
    }>, reply: FastifyReply): Promise<never>;
    updateCompany(req: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: any;
    }>, reply: FastifyReply): Promise<never>;
    updateCompanyStatus(req: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            status: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteCompany(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getCompanyAdmins(req: FastifyRequest<{
        Querystring: {
            search?: string;
            status?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createCompanyAdmin(req: FastifyRequest<{
        Body: {
            name: string;
            email?: string;
            company?: string;
            companyId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    updateCompanyAdmin(req: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            name?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    updateAdminStatus(req: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            status: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    resetAdminPassword(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getPlans(_req: FastifyRequest, reply: FastifyReply): Promise<never>;
    createPlan(req: FastifyRequest<{
        Body: any;
    }>, reply: FastifyReply): Promise<never>;
    updatePlan(req: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: any;
    }>, reply: FastifyReply): Promise<never>;
    updatePlanStatus(req: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            status: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deletePlan(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getSubscriptions(req: FastifyRequest<{
        Querystring: {
            search?: string;
            plan?: string;
            status?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    extendSubscription(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    cancelSubscription(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getPayments(req: FastifyRequest<{
        Querystring: {
            search?: string;
            status?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    markPaymentPaid(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getInvoiceData(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getCompanyModules(req: FastifyRequest<{
        Params: {
            companyId: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    toggleCompanyModule(req: FastifyRequest<{
        Params: {
            companyId: string;
            moduleKey: string;
        };
        Body?: {
            isEnabled?: boolean;
        };
    }>, reply: FastifyReply): Promise<never>;
    getPlatformUsers(req: FastifyRequest<{
        Querystring: {
            search?: string;
            status?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    updateUserStatus(req: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            status: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteUser(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getAnalytics(_req: FastifyRequest, reply: FastifyReply): Promise<never>;
    getAuditLogs(req: FastifyRequest<{
        Querystring: {
            search?: string;
            event?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteAuditLog(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getSupportTickets(req: FastifyRequest<{
        Querystring: {
            search?: string;
            status?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createSupportTicket(req: FastifyRequest<{
        Body: any;
    }>, reply: FastifyReply): Promise<never>;
    updateTicketStatus(req: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            status: string;
            resolution?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteSupportTicket(req: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getSettings(_req: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateSettings(req: FastifyRequest<{
        Body: any;
    }>, reply: FastifyReply): Promise<never>;
}
export declare const masterAdminController: MasterAdminController;
//# sourceMappingURL=master.controller.d.ts.map