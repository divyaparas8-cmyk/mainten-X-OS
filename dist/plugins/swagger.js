"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    await fastify.register(swagger_1.default, {
        openapi: {
            info: {
                title: "MaintenX OS — Manufacturing Operations SaaS REST API",
                description: "Production-ready API for MES, APS Planning, QMS (21 CFR Part 11), WMS 360° Traceability, and CMMS Maintenance.",
                version: "1.0.0",
            },
            servers: [
                {
                    url: "http://localhost:4000",
                    description: "Local Development Server",
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                        description: "Enter your JWT token (e.g. from /api/v1/auth/login)",
                    },
                },
            },
            security: [{ bearerAuth: [] }],
        },
    });
    await fastify.register(swagger_ui_1.default, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: true,
        },
        staticCSP: true,
    });
});
//# sourceMappingURL=swagger.js.map