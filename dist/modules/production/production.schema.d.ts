import { z } from "zod";
export declare const createProductionOrderSchema: z.ZodEffects<z.ZodObject<{
    orderNumber: z.ZodString;
    skuId: z.ZodString;
    lineId: z.ZodString;
    targetQuantity: z.ZodOptional<z.ZodNumber>;
    plannedQuantity: z.ZodOptional<z.ZodNumber>;
    quantity: z.ZodOptional<z.ZodNumber>;
    plannedStart: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    plannedEnd: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    priority: z.ZodDefault<z.ZodEffects<z.ZodEnum<["URGENT", "NORMAL", "LOW"]>, "NORMAL" | "URGENT" | "LOW", unknown>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    skuId: string;
    lineId: string;
    orderNumber: string;
    priority: "NORMAL" | "URGENT" | "LOW";
    plannedStart: string;
    plannedEnd: string;
    quantity?: number | undefined;
    notes?: string | undefined;
    targetQuantity?: number | undefined;
    plannedQuantity?: number | undefined;
}, {
    skuId: string;
    lineId: string;
    orderNumber: string;
    quantity?: number | undefined;
    notes?: string | undefined;
    priority?: unknown;
    targetQuantity?: number | undefined;
    plannedStart?: string | undefined;
    plannedEnd?: string | undefined;
    plannedQuantity?: number | undefined;
}>, {
    targetQuantity: number;
    plannedStart: string;
    plannedEnd: string;
    skuId: string;
    lineId: string;
    orderNumber: string;
    priority: "NORMAL" | "URGENT" | "LOW";
    quantity?: number | undefined;
    notes?: string | undefined;
    plannedQuantity?: number | undefined;
}, {
    skuId: string;
    lineId: string;
    orderNumber: string;
    quantity?: number | undefined;
    notes?: string | undefined;
    priority?: unknown;
    targetQuantity?: number | undefined;
    plannedStart?: string | undefined;
    plannedEnd?: string | undefined;
    plannedQuantity?: number | undefined;
}>;
export type CreateProductionOrderInput = z.infer<typeof createProductionOrderSchema>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEffects<z.ZodEnum<["PLANNED", "SCHEDULED", "RELEASED", "RUNNING", "PAUSED", "COMPLETED", "QA_PENDING", "RELEASED_TO_WAREHOUSE", "CANCELLED"]>, "RUNNING" | "PLANNED" | "RELEASED" | "COMPLETED" | "SCHEDULED" | "PAUSED" | "QA_PENDING" | "RELEASED_TO_WAREHOUSE" | "CANCELLED", unknown>;
}, "strip", z.ZodTypeAny, {
    status: "RUNNING" | "PLANNED" | "RELEASED" | "COMPLETED" | "SCHEDULED" | "PAUSED" | "QA_PENDING" | "RELEASED_TO_WAREHOUSE" | "CANCELLED";
}, {
    status?: unknown;
}>;
export declare const updateBatchStepSchema: z.ZodObject<{
    stepNumber: z.ZodNumber;
    parameters: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    parameters: Record<string, any>;
    stepNumber: number;
    notes?: string | undefined;
}, {
    stepNumber: number;
    parameters?: Record<string, any> | undefined;
    notes?: string | undefined;
}>;
export type UpdateBatchStepInput = z.infer<typeof updateBatchStepSchema>;
export declare const recordOperatorEntrySchema: z.ZodObject<{
    orderId: z.ZodString;
    lineId: z.ZodString;
    shiftCode: z.ZodDefault<z.ZodString>;
    goodUnitsIncrement: z.ZodNumber;
    scrapUnitsIncrement: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    lineId: string;
    shiftCode: string;
    orderId: string;
    goodUnitsIncrement: number;
    scrapUnitsIncrement: number;
}, {
    lineId: string;
    orderId: string;
    goodUnitsIncrement: number;
    shiftCode?: string | undefined;
    scrapUnitsIncrement?: number | undefined;
}>;
export type RecordOperatorEntryInput = z.infer<typeof recordOperatorEntrySchema>;
export declare const logDowntimeSchema: z.ZodObject<{
    lineId: z.ZodString;
    assetId: z.ZodOptional<z.ZodString>;
    orderId: z.ZodOptional<z.ZodString>;
    reasonCode: z.ZodString;
    category: z.ZodDefault<z.ZodString>;
    durationMinutes: z.ZodNumber;
    comments: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    category: string;
    lineId: string;
    reasonCode: string;
    durationMinutes: number;
    comments?: string | undefined;
    orderId?: string | undefined;
    assetId?: string | undefined;
}, {
    lineId: string;
    reasonCode: string;
    durationMinutes: number;
    comments?: string | undefined;
    category?: string | undefined;
    orderId?: string | undefined;
    assetId?: string | undefined;
}>;
export type LogDowntimeInput = z.infer<typeof logDowntimeSchema>;
//# sourceMappingURL=production.schema.d.ts.map