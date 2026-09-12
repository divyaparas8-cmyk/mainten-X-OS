import { FastifyReply, FastifyRequest } from "fastify";
export declare class MaintenanceController {
    getWorkOrders(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getBreakdowns(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getHistory(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    exportHistory(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    updateAsset(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getTroubleshooting(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    saveTroubleshootingStep(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    saveTroubleshootingDraft(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    saveTroubleshootingSolution(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createWorkOrder(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateWorkOrderStatus(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    updateWorkOrder(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteWorkOrder(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getPMSchedules(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createPMSchedule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updatePMSchedule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    deletePMSchedule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    executePMChecklist(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    savePMChecklistDraft(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getPM(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getCalendar(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getNotifications(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getProfile(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateProfile(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getSpareParts(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getReliabilityMetrics(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getRCAInvestigations(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createRCAInvestigation(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    exportReliabilityReport(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    saveWorkOrderExecution(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    issueWorkOrderPart(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    signOffWorkOrder(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    addWorkOrderComment(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const maintenanceController: MaintenanceController;
//# sourceMappingURL=maintenance.controller.d.ts.map