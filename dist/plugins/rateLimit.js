"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const env_js_1 = require("../config/env.js");
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    await fastify.register(rate_limit_1.default, {
        max: env_js_1.env.RATE_LIMIT_MAX,
        timeWindow: env_js_1.env.RATE_LIMIT_WINDOW_MS,
        allowList: ["127.0.0.1", "localhost"],
    });
});
//# sourceMappingURL=rateLimit.js.map