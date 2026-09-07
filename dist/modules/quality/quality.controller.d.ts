import { FastifyReply, FastifyRequest } from "fastify";
export declare class QualityController {
    getCcpChecks(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    recordCcpCheck(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getQaReleaseQueue(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    authorizeBatchRelease(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getQualityHolds(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createQualityHold(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const qualityController: QualityController;
//# sourceMappingURL=quality.controller.d.ts.map