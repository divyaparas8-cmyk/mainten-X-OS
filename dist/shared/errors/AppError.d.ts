export declare class AppError extends Error {
    statusCode: number;
    code: string;
    details?: any;
    constructor(message: string, statusCode?: number, code?: string, details?: any);
}
export declare class NotFoundError extends AppError {
    constructor(resource?: string, message?: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class ValidationError extends AppError {
    constructor(message?: string, details?: any);
}
export declare class BusinessRuleError extends AppError {
    constructor(message: string, details?: any);
}
//# sourceMappingURL=AppError.d.ts.map