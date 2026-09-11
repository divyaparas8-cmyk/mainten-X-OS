import { FastifyInstance } from "fastify";
import { billingController } from "./billing.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function billingRoutes(fastify: FastifyInstance) {
  // Public Plans List
  fastify.get(
    "/plans",
    {
      schema: {
        tags: ["Billing & Subscriptions (Razorpay)"],
        summary: "List Available Subscription Plans",
      },
    },
    billingController.getPlans.bind(billingController)
  );

  // Webhook endpoint (unauthenticated by JWT, cryptographically verified by HMAC header)
  fastify.post(
    "/webhook",
    {
      schema: {
        tags: ["Billing & Subscriptions (Razorpay)"],
        summary: "Razorpay Asynchronous Webhook Processor (Idempotent)",
      },
    },
    billingController.handleWebhook.bind(billingController)
  );

  // Authenticated Endpoints
  fastify.register(async (authScope) => {
    authScope.addHook("preHandler", authenticate);

    authScope.post(
      "/create-order",
      {
        schema: {
          tags: ["Billing & Subscriptions (Razorpay)"],
          summary: "Create Razorpay Payment Order for Subscription",
        },
      },
      billingController.createOrder.bind(billingController)
    );

    authScope.post(
      "/verify",
      {
        schema: {
          tags: ["Billing & Subscriptions (Razorpay)"],
          summary: "Cryptographically Verify Razorpay Payment Signature & Activate Subscription",
        },
      },
      billingController.verifyPayment.bind(billingController)
    );

    authScope.get(
      "/subscription",
      {
        schema: {
          tags: ["Billing & Subscriptions (Razorpay)"],
          summary: "Get Current Tenant Subscription Details",
        },
      },
      billingController.getSubscription.bind(billingController)
    );
  });
}
