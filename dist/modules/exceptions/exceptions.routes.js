"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptionsRoutes = exceptionsRoutes;
const exceptions_controller_js_1 = require("./exceptions.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function exceptionsRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    fastify.get("", { schema: { tags: ["Exceptions & Alerts"], summary: "List Exceptions" } }, exceptions_controller_js_1.exceptionsController.getExceptions.bind(exceptions_controller_js_1.exceptionsController));
    fastify.post("", { schema: { tags: ["Exceptions & Alerts"], summary: "Create Exception" } }, exceptions_controller_js_1.exceptionsController.createException.bind(exceptions_controller_js_1.exceptionsController));
    fastify.get("/:id", { schema: { tags: ["Exceptions & Alerts"], summary: "Get Exception Details" } }, exceptions_controller_js_1.exceptionsController.getException.bind(exceptions_controller_js_1.exceptionsController));
    fastify.patch("/:id/assign", { schema: { tags: ["Exceptions & Alerts"], summary: "Assign and Escalate Exception" } }, exceptions_controller_js_1.exceptionsController.assignException.bind(exceptions_controller_js_1.exceptionsController));
    fastify.patch("/:id/resolve", { schema: { tags: ["Exceptions & Alerts"], summary: "Resolve Exception" } }, exceptions_controller_js_1.exceptionsController.resolveException.bind(exceptions_controller_js_1.exceptionsController));
}
//# sourceMappingURL=exceptions.routes.js.map