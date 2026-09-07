"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const cors_1 = __importDefault(require("@fastify/cors"));
const env_js_1 = require("../config/env.js");
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    const allowedOrigins = env_js_1.env.CORS_ORIGIN.split(",").map((o) => o.trim());
    await fastify.register(cors_1.default, {
        origin: (origin, cb) => {
            // Allow requests with no origin (like mobile apps, curl, server-to-server)
            if (!origin)
                return cb(null, true);
            if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
                return cb(null, true);
            }
            return cb(null, true); // Permissive in dev, configurable for prod
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Tenant-ID", "X-Plant-ID"],
    });
});
//# sourceMappingURL=cors.js.map