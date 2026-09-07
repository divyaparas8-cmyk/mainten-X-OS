"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessRuleError = exports.ValidationError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(message, statusCode = 400, code = "APP_ERROR", details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(resource = "Resource", message) {
        super(message || `${resource} not found`, 404, "NOT_FOUND");
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized access") {
        super(message, 401, "UNAUTHORIZED");
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = "Forbidden: Insufficient permissions") {
        super(message, 403, "FORBIDDEN");
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends AppError {
    constructor(message = "Conflict: Record already exists", details) {
        super(message, 409, "CONFLICT", details);
    }
}
exports.ConflictError = ConflictError;
class ValidationError extends AppError {
    constructor(message = "Validation failed", details) {
        super(message, 400, "VALIDATION_ERROR", details);
    }
}
exports.ValidationError = ValidationError;
class BusinessRuleError extends AppError {
    constructor(message, details) {
        super(message, 422, "BUSINESS_RULE_VIOLATION", details);
    }
}
exports.BusinessRuleError = BusinessRuleError;
//# sourceMappingURL=AppError.js.map