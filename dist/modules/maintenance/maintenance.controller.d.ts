import { FastifyReply, FastifyRequest } from "fastify";
export declare class MaintenanceController {
    getWorkOrders(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createWorkOrder(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateWorkOrderStatus(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getPMSchedules(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getSpareParts(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getReliabilityMetrics(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const maintenanceController: MaintenanceController;
//# sourceMappingURL=maintenance.controller.d.ts.map