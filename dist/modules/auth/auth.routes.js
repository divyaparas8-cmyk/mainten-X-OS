"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const auth_controller_js_1 = require("./auth.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function authRoutes(fastify) {
    fastify.post("/login", {
        schema: {
            tags: ["Authentication"],
            summary: "User login and JWT token issue",
            description: "Authenticate using email and password to receive JWT session token.",
        },
    }, auth_controller_js_1.authController.login.bind(auth_controller_js_1.authController));
    fastify.get("/me", {
        preHandler: [authenticate_js_1.authenticate],
        schema: {
            tags: ["Authentication"],
            summary: "Get current authenticated user profile",
            security: [{ bearerAuth: [] }],
        },
    }, auth_controller_js_1.authController.me.bind(auth_controller_js_1.authController));
    fastify.post("/sign-off", {
        preHandler: [authenticate_js_1.authenticate],
        schema: {
            tags: ["Authentication"],
            summary: "21 CFR Part 11 Electronic Digital Signature Verification",
            description: "Validates user's secret digital PIN for electronic batch record signing.",
            security: [{ bearerAuth: [] }],
        },
    }, auth_controller_js_1.authController.digitalSignOff.bind(auth_controller_js_1.authController));
    fastify.post("/logout", {
        schema: {
            tags: ["Authentication"],
            summary: "Logout user session",
        },
    }, auth_controller_js_1.authController.logout.bind(auth_controller_js_1.authController));
}
//# sourceMappingURL=auth.routes.js.map