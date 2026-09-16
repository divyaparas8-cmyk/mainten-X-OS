import { FastifyReply, FastifyRequest } from "fastify";
export declare class BillingController {
    getPlans(_request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createOrder(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    verifyPayment(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    handleWebhook(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getSubscription(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const billingController: BillingController;
//# sourceMappingURL=billing.controller.d.ts.map