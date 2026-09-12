import { z } from "zod";
export declare const createWorkOrderSchema: z.ZodObject<{
    assetId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodEffects<z.ZodDefault<z.ZodEnum<["CORRECTIVE", "PREVENTIVE", "EMERGENCY_BREAKDOWN", "CALIBRATION"]>>, "CORRECTIVE" | "PREVENTIVE" | "EMERGENCY_BREAKDOWN" | "CALIBRATION", unknown>;
    priority: z.ZodEffects<z.ZodDefault<z.ZodEnum<["P1_CRITICAL", "HIGH", "MEDIUM", "LOW"]>>, "HIGH" | "LOW" | "P1_CRITICAL" | "MEDIUM", unknown>;
    assignedTo: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    assignedTechnician: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    technician: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    failureCodeId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    estimatedHours: z.ZodDefault<z.ZodNumber>;
    scheduledDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type: "CORRECTIVE" | "PREVENTIVE" | "EMERGENCY_BREAKDOWN" | "CALIBRATION";
    title: string;
    priority: "HIGH" | "LOW" | "P1_CRITICAL" | "MEDIUM";
    estimatedHours: number;
    description?: string | undefined;
    scheduledDate?: string | null | undefined;
    assetId?: string | undefined;
    assignedTo?: string | null | undefined;
    failureCodeId?: string | null | undefined;
    dueDate?: string | null | undefined;
    assignedTechnician?: string | null | undefined;
    technician?: string | null | undefined;
}, {
    title: string;
    type?: unknown;
    description?: string | undefined;
    priority?: unknown;
    scheduledDate?: string | null | undefined;
    assetId?: string | undefined;
    assignedTo?: string | null | undefined;
    failureCodeId?: string | null | undefined;
    estimatedHours?: number | undefined;
    dueDate?: string | null | undefined;
    assignedTechnician?: string | null | undefined;
    technician?: string | null | undefined;
}>;
export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;
export declare const updateWorkOrderStatusSchema: z.ZodObject<{
    status: z.ZodEffects<z.ZodDefault<z.ZodString>, string, unknown>;
    actualHours: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: string;
    actualHours?: number | undefined;
}, {
    status?: unknown;
    actualHours?: number | undefined;
}>;
export type UpdateWorkOrderStatusInput = z.infer<typeof updateWorkOrderStatusSchema>;
//# sourceMappingURL=maintenance.schema.d.ts.map