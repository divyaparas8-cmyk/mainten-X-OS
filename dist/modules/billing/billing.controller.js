"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingController = exports.BillingController = void 0;
const billing_service_js_1 = require("./billing.service.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const AppError_js_1 = require("../../shared/errors/AppError.js");
class BillingController {
    async getPlans(_request, reply) {
        const plans = await billing_service_js_1.billingService.listPlans();
        return reply.send((0, responseFormatter_js_1.formatSuccess)(plans));
    }
    async createOrder(request, reply) {
        const body = request.body;
        const planId = body?.planId;
        const currency = body?.currency || "INR";
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        if (!planId) {
            throw new AppError_js_1.ValidationError("Missing required parameter 'planId'");
        }
        const order = await billing_service_js_1.billingService.createOrder({ planId, tenantId, currency });
        return reply.send((0, responseFormatter_js_1.formatSuccess)(order, "Razorpay payment order created successfully"));
    }
    async verifyPayment(request, reply) {
        const body = request.body;
        const { orderId, paymentId, signature, planId } = body || {};
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        if (!orderId || !paymentId || !signature) {
            throw new AppError_js_1.ValidationError("Missing orderId, paymentId, or signature in verification payload.");
        }
        const result = await billing_service_js_1.billingService.verifyPayment({
            tenantId,
            orderId,
            paymentId,
            signature,
            planId: planId || "standard",
        });
        return reply.send((0, responseFormatter_js_1.formatSuccess)(result, "Payment successfully verified"));
    }
    async handleWebhook(request, reply) {
        const signature = request.headers["x-razorpay-signature"] || "";
        const rawBody = typeof request.body === "string" ? request.body : JSON.stringify(request.body || {});
        const payload = typeof request.body === "object" ? request.body : JSON.parse(rawBody || "{}");
        const result = await billing_service_js_1.billingService.processWebhook(rawBody, signature, payload);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(result));
    }
    async getSubscription(request, reply) {
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const subscription = await billing_service_js_1.billingService.getSubscription(tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(subscription));
    }
}
exports.BillingController = BillingController;
exports.billingController = new BillingController();
//# sourceMappingURL=billing.controller.js.map