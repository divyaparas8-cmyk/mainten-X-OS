"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSuccess = formatSuccess;
exports.formatError = formatError;
function formatSuccess(data, message = "Operation successful", meta) {
    return {
        success: true,
        data,
        message,
        ...(meta ? { meta } : {}),
    };
}
function formatError(message, code = "ERROR", details) {
    return {
        success: false,
        error: {
            code,
            message,
            ...(details ? { details } : {}),
        },
    };
}
//# sourceMappingURL=responseFormatter.js.map