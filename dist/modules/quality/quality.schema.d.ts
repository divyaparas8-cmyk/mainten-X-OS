import { z } from "zod";
export declare const recordCcpCheckSchema: z.ZodObject<{
    batchId: z.ZodString;
    lineId: z.ZodString;
    ccpCode: z.ZodString;
    ccpName: z.ZodString;
    targetValue: z.ZodNumber;
    actualValue: z.ZodNumber;
    criticalLimitMin: z.ZodOptional<z.ZodNumber>;
    criticalLimitMax: z.ZodOptional<z.ZodNumber>;
    uom: z.ZodDefault<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    uom: string;
    lineId: string;
    targetValue: number;
    batchId: string;
    ccpCode: string;
    ccpName: string;
    actualValue: number;
    notes?: string | undefined;
    criticalLimitMin?: number | undefined;
    criticalLimitMax?: number | undefined;
}, {
    lineId: string;
    targetValue: number;
    batchId: string;
    ccpCode: string;
    ccpName: string;
    actualValue: number;
    uom?: string | undefined;
    notes?: string | undefined;
    criticalLimitMin?: number | undefined;
    criticalLimitMax?: number | undefined;
}>;
export type RecordCcpCheckInput = z.infer<typeof recordCcpCheckSchema>;
export declare const qaBatchReleaseSchema: z.ZodObject<{
    batchId: z.ZodString;
    disposition: z.ZodEnum<["RELEASED", "REJECTED", "REWORK", "QUARANTINED"]>;
    signaturePin: z.ZodString;
    comments: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    batchId: string;
    disposition: "RELEASED" | "REJECTED" | "REWORK" | "QUARANTINED";
    signaturePin: string;
    comments?: string | undefined;
}, {
    batchId: string;
    disposition: "RELEASED" | "REJECTED" | "REWORK" | "QUARANTINED";
    signaturePin: string;
    comments?: string | undefined;
}>;
export type QaBatchReleaseInput = z.infer<typeof qaBatchReleaseSchema>;
export declare const createQualityHoldSchema: z.ZodObject<{
    lotNumber: z.ZodString;
    batchId: z.ZodOptional<z.ZodString>;
    reason: z.ZodString;
    severity: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    lotNumber: string;
    reason: string;
    severity: string;
    batchId?: string | undefined;
}, {
    lotNumber: string;
    reason: string;
    batchId?: string | undefined;
    severity?: string | undefined;
}>;
export type CreateQualityHoldInput = z.infer<typeof createQualityHoldSchema>;
//# sourceMappingURL=quality.schema.d.ts.map