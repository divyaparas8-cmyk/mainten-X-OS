import { FastifyReply, FastifyRequest } from "fastify";
export declare class PlanningController {
    getCustomerOrders(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createCustomerOrder(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateCustomerOrder(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteCustomerOrder(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getForecasts(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createForecast(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateForecast(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteForecast(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getDemandHistory(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getPromotions(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createPromotion(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updatePromotion(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getShipments(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createShipment(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateShipmentStatus(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    runForecast(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getApsSchedules(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createApsSchedule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    rescheduleApsSchedule(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    splitApsSchedule(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    optimizeApsSchedule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getCapacityCalculations(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getWorkCenters(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getChangeovers(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createChangeover(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getMrpExplosion(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    runMrpEngine(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createPurchaseRequisition(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    listPurchaseRequisitions(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    expediteShortage(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    listExpeditedShortages(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateSafetyStock(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    listSafetyStock(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    listServiceRisks(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    mitigateServiceRisk(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getSupplyDemandBalance(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    listScheduleVersions(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createScheduleVersion(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    validateSchedule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getPublishSchedule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    publishSchedule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    handleAiChat(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    applyAiRecommendation(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    simulateAiImpact(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getAiAssistantOverview(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    listMaterialReservations(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createMaterialReservation(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    stageMaterialReservation(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    releaseMaterialReservation(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    recalculateMaterialReservations(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getPlanningReports(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getPlanningDashboardSummary(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getSchedules(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createSchedule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    toggleScheduleLock(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    deleteSchedule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getCapacity(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getConstraints(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createConstraint(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    resolveConstraint(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    deleteConstraint(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    applyRecovery(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const planningController: PlanningController;
//# sourceMappingURL=planning.controller.d.ts.map