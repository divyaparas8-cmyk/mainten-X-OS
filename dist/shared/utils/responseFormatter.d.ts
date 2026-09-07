export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}
export declare function formatSuccess<T>(data: T, message?: string, meta?: ApiResponse["meta"]): ApiResponse<T>;
export declare function formatError(message: string, code?: string, details?: any): {
    success: boolean;
    error: {
        details?: any;
        code: string;
        message: string;
    };
};
//# sourceMappingURL=responseFormatter.d.ts.map