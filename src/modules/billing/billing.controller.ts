import { FastifyReply, FastifyRequest } from "fastify";
import { billingService } from "./billing.service.js";
import { formatSuccess, formatError } from "../../shared/utils/responseFormatter.js";
import { ValidationError } from "../../shared/errors/AppError.js";

export class BillingController {
  async getPlans(_request: FastifyRequest, reply: FastifyReply) {
    const plans = await billingService.listPlans();
    return reply.send(formatSuccess(plans));
  }

  async createOrder(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const planId = body?.planId;
    const currency = body?.currency || "INR";
    const tenantId = (request.user as any)?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";

    if (!planId) {
      throw new ValidationError("Missing required parameter 'planId'");
    }

    const order = await billingService.createOrder({ planId, tenantId, currency });
    return reply.send(formatSuccess(order, "Razorpay payment order created successfully"));
  }

  async verifyPayment(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const { orderId, paymentId, signature, planId } = body || {};
    const tenantId = (request.user as any)?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";

    if (!orderId || !paymentId || !signature) {
      throw new ValidationError("Missing orderId, paymentId, or signature in verification payload.");
    }

    const result = await billingService.verifyPayment({
      tenantId,
      orderId,
      paymentId,
      signature,
      planId: planId || "standard",
    });

    return reply.send(formatSuccess(result, "Payment successfully verified"));
  }

  async handleWebhook(request: FastifyRequest, reply: FastifyReply) {
    const signature = (request.headers["x-razorpay-signature"] as string) || "";
    const rawBody = typeof request.body === "string" ? request.body : JSON.stringify(request.body || {});
    const payload = typeof request.body === "object" ? request.body : JSON.parse(rawBody || "{}");

    const result = await billingService.processWebhook(rawBody, signature, payload);
    return reply.send(formatSuccess(result));
  }

  async getSubscription(request: FastifyRequest, reply: FastifyReply) {
    const tenantId = (request.user as any)?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
    const subscription = await billingService.getSubscription(tenantId);
    return reply.send(formatSuccess(subscription));
  }
}

export const billingController = new BillingController();
