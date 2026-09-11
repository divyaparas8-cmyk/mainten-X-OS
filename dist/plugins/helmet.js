"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    await fastify.register(helmet_1.default, {
        contentSecurityPolicy: false, // Disabled for Swagger UI compatibility
        crossOriginResourcePolicy: { policy: "cross-origin" },
    });
});
//# sourceMappingURL=helmet.js.map