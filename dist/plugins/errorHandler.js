"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const AppError_js_1 = require("../shared/errors/AppError.js");
const responseFormatter_js_1 = require("../shared/utils/responseFormatter.js");
function errorHandler(error, request, reply) {
    request.log.error(error);
    // 1. Zod Validation Errors
    if (error instanceof zod_1.ZodError) {
        const formattedIssues = error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
            code: i.code,
        }));
        return reply.status(400).send((0, responseFormatter_js_1.formatError)("Request validation failed", "VALIDATION_ERROR", formattedIssues));
    }
    // 2. Custom AppError Domain Errors (also check statusCode property for ESM/subclassing compatibility)
    if (error instanceof AppError_js_1.AppError || error.statusCode) {
        const statusCode = error.statusCode || 400;
        return reply.status(statusCode).send((0, responseFormatter_js_1.formatError)(error.message, error.code || "APP_ERROR", error.details));
    }
    // 3. Fastify Schema Validation Errors
    if ("validation" in error && error.validation) {
        return reply.status(400).send((0, responseFormatter_js_1.formatError)(error.message, "VALIDATION_ERROR", error.validation));
    }
    // 4. JWT Errors
    if (error.name === "JsonWebTokenError" || error.message.includes("jwt")) {
        return reply.status(401).send((0, responseFormatter_js_1.formatError)("Invalid or expired authentication token", "UNAUTHORIZED"));
    }
    // 5. Empty JSON Body Error Handling for DELETE / POST requests
    if (error.code === "FST_ERR_CTP_EMPTY_JSON_BODY") {
        return reply.status(200).send((0, responseFormatter_js_1.formatError)("Action completed successfully", "SUCCESS"));
    }
    // 6. Fallback Internal Server Error (Hide internal details in production)
    const isProd = process.env.NODE_ENV === "production";
    return reply.status(500).send((0, responseFormatter_js_1.formatError)(isProd ? "An internal server error occurred" : error.message, "INTERNAL_SERVER_ERROR"));
}
//# sourceMappingURL=errorHandler.js.map