import { z } from "zod";
export declare const createWorkOrderSchema: z.ZodObject<{
    assetId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodEffects<z.ZodDefault<z.ZodEnum<["CORRECTIVE", "PREVENTIVE", "EMERGENCY_BREAKDOWN", "CALIBRATION"]>>, "CORRECTIVE" | "PREVENTIVE" | "EMERGENCY_BREAKDOWN" | "CALIBRATION", unknown>;
    priority: z.ZodEffects<z.ZodDefault<z.ZodEnum<["P1_CRITICAL", "HIGH", "MEDIUM", "LOW"]>>, "HIGH" | "LOW" | "P1_CRITICAL" | "MEDIUM", unknown>;
    assignedTo: z.ZodOptional<z.ZodString>;
    failureCodeId: z.ZodOptional<z.ZodString>;
    estimatedHours: z.ZodDefault<z.ZodNumber>;
    scheduledDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "CORRECTIVE" | "PREVENTIVE" | "EMERGENCY_BREAKDOWN" | "CALIBRATION";
    title: string;
    priority: "HIGH" | "LOW" | "P1_CRITICAL" | "MEDIUM";
    assetId: string;
    estimatedHours: number;
    description?: string | undefined;
    scheduledDate?: string | undefined;
    assignedTo?: string | undefined;
    failureCodeId?: string | undefined;
}, {
    title: string;
    assetId: string;
    type?: unknown;
    description?: string | undefined;
    priority?: unknown;
    scheduledDate?: string | undefined;
    assignedTo?: string | undefined;
    failureCodeId?: string | undefined;
    estimatedHours?: number | undefined;
}>;
export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;
export declare const updateWorkOrderStatusSchema: z.ZodObject<{
    status: z.ZodEffects<z.ZodEnum<["OPEN", "ASSIGNED", "IN_PROGRESS", "WAITING_FOR_PARTS", "COMPLETED", "CLOSED"]>, "IN_PROGRESS" | "COMPLETED" | "OPEN" | "ASSIGNED" | "WAITING_FOR_PARTS" | "CLOSED", unknown>;
    actualHours: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "IN_PROGRESS" | "COMPLETED" | "OPEN" | "ASSIGNED" | "WAITING_FOR_PARTS" | "CLOSED";
    actualHours?: number | undefined;
}, {
    status?: unknown;
    actualHours?: number | undefined;
}>;
export type UpdateWorkOrderStatusInput = z.infer<typeof updateWorkOrderStatusSchema>;
//# sourceMappingURL=maintenance.schema.d.ts.map