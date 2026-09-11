import { z } from "zod";
export declare const paginationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
    plantId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    sortOrder: "asc" | "desc";
    status?: string | undefined;
    search?: string | undefined;
    plantId?: string | undefined;
    sortBy?: string | undefined;
}, {
    status?: string | undefined;
    search?: string | undefined;
    plantId?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export declare function getPaginationOffset(page: number, limit: number): number;
export declare function buildPaginationMeta(total: number, page: number, limit: number): {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};
//# sourceMappingURL=pagination.d.ts.map