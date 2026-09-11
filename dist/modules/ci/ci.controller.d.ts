import { FastifyReply, FastifyRequest } from "fastify";
export declare class CIController {
    getDashboardSummary(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getInvestigations(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getInvestigation(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createInvestigation(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateInvestigation(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    advanceInvestigationPhase(request: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            phase: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteInvestigation(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getRCASummary(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getEvidence(request: FastifyRequest<{
        Querystring: {
            rcaId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createEvidence(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    deleteEvidence(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getHypotheses(request: FastifyRequest<{
        Querystring: {
            rcaId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createHypothesis(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    validateHypothesis(request: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            validationStatus: "Confirmed Root Cause" | "Refuted" | "In Progress";
            evidenceResult?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteHypothesis(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getCapaActions(request: FastifyRequest<{
        Querystring: {
            rcaId?: string;
            projectId?: string;
            actionType?: string;
            status?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createCapaAction(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateCapaStatus(request: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            status: string;
            completionDate?: string;
            evidenceNotes?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    verifyCapaEffectiveness(request: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            effectivenessResult: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteCapaAction(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getLosses(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
            category?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createLoss(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    deleteLoss(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getLossSummary(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getProjects(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getProject(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createProject(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateProject(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteProject(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    verifyAndLockBenefit(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    unlockBenefit(request: FastifyRequest<{
        Params: {
            id: string;
        };
        Body: {
            justification?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getBenefitsSummary(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getStandards(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
            type?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createStandard(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateStandard(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteStandard(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getSolutions(request: FastifyRequest<{
        Querystring: {
            assetId?: string;
            search?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createSolution(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    deleteSolution(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getCapex(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createCapex(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    deleteCapex(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getReliabilityRecords(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
            onlyBadActors?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    launchRcaFromBadActor(request: FastifyRequest<{
        Params: {
            assetId: string;
        };
    }>, reply: FastifyReply): Promise<never>;
}
export declare const ciController: CIController;
//# sourceMappingURL=ci.controller.d.ts.map