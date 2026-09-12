"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingRoutes = billingRoutes;
const billing_controller_js_1 = require("./billing.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function billingRoutes(fastify) {
    // Public Plans List
    fastify.get("/plans", {
        schema: {
            tags: ["Billing & Subscriptions (Razorpay)"],
            summary: "List Available Subscription Plans",
        },
    }, billing_controller_js_1.billingController.getPlans.bind(billing_controller_js_1.billingController));
    // Webhook endpoint (unauthenticated by JWT, cryptographically verified by HMAC header)
    fastify.post("/webhook", {
        schema: {
            tags: ["Billing & Subscriptions (Razorpay)"],
            summary: "Razorpay Asynchronous Webhook Processor (Idempotent)",
        },
    }, billing_controller_js_1.billingController.handleWebhook.bind(billing_controller_js_1.billingController));
    // Authenticated Endpoints
    fastify.register(async (authScope) => {
        authScope.addHook("preHandler", authenticate_js_1.authenticate);
        authScope.post("/create-order", {
            schema: {
                tags: ["Billing & Subscriptions (Razorpay)"],
                summary: "Create Razorpay Payment Order for Subscription",
            },
        }, billing_controller_js_1.billingController.createOrder.bind(billing_controller_js_1.billingController));
        authScope.post("/verify", {
            schema: {
                tags: ["Billing & Subscriptions (Razorpay)"],
                summary: "Cryptographically Verify Razorpay Payment Signature & Activate Subscription",
            },
        }, billing_controller_js_1.billingController.verifyPayment.bind(billing_controller_js_1.billingController));
        authScope.get("/subscription", {
            schema: {
                tags: ["Billing & Subscriptions (Razorpay)"],
                summary: "Get Current Tenant Subscription Details",
            },
        }, billing_controller_js_1.billingController.getSubscription.bind(billing_controller_js_1.billingController));
    });
}
//# sourceMappingURL=billing.routes.js.map