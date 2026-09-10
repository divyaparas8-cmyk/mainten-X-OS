import { z } from "zod";
export declare const recordCcpCheckSchema: z.ZodObject<{
    batchId: z.ZodOptional<z.ZodString>;
    lineId: z.ZodOptional<z.ZodString>;
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
    targetValue: number;
    ccpCode: string;
    ccpName: string;
    actualValue: number;
    lineId?: string | undefined;
    notes?: string | undefined;
    batchId?: string | undefined;
    criticalLimitMin?: number | undefined;
    criticalLimitMax?: number | undefined;
}, {
    targetValue: number;
    ccpCode: string;
    ccpName: string;
    actualValue: number;
    uom?: string | undefined;
    lineId?: string | undefined;
    notes?: string | undefined;
    batchId?: string | undefined;
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
export declare const createDeviationSchema: z.ZodObject<{
    deviationNumber: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodString;
    category: z.ZodDefault<z.ZodString>;
    severity: z.ZodDefault<z.ZodString>;
    holdId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    category: string;
    severity: string;
    deviationNumber?: string | undefined;
    holdId?: string | undefined;
}, {
    title: string;
    description: string;
    category?: string | undefined;
    severity?: string | undefined;
    deviationNumber?: string | undefined;
    holdId?: string | undefined;
}>;
export type CreateDeviationInput = z.infer<typeof createDeviationSchema>;
export declare const startInvestigationSchema: z.ZodObject<{
    devId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    assignedTo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    devId: string;
    title?: string | undefined;
    assignedTo?: string | undefined;
}, {
    devId: string;
    title?: string | undefined;
    assignedTo?: string | undefined;
}>;
export declare const saveInvestigationFindingSchema: z.ZodObject<{
    invId: z.ZodString;
    finding: z.ZodString;
    rootCauseCategory: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    invId: string;
    finding: string;
    rootCauseCategory?: string | undefined;
}, {
    invId: string;
    finding: string;
    status?: string | undefined;
    rootCauseCategory?: string | undefined;
}>;
export declare const completeInvestigationSchema: z.ZodObject<{
    invId: z.ZodString;
    devId: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    invId: string;
    summary?: string | undefined;
    devId?: string | undefined;
}, {
    invId: string;
    summary?: string | undefined;
    devId?: string | undefined;
}>;
export declare const createNcrSchema: z.ZodObject<{
    ncrNumber: z.ZodOptional<z.ZodString>;
    part: z.ZodString;
    lotNumber: z.ZodOptional<z.ZodString>;
    reason: z.ZodString;
    severity: z.ZodDefault<z.ZodString>;
    disposition: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    severity: string;
    part: string;
    disposition?: string | undefined;
    lotNumber?: string | undefined;
    ncrNumber?: string | undefined;
}, {
    reason: string;
    part: string;
    disposition?: string | undefined;
    lotNumber?: string | undefined;
    severity?: string | undefined;
    ncrNumber?: string | undefined;
}>;
export declare const reviewNcrSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodOptional<z.ZodString>;
    disposition: z.ZodOptional<z.ZodString>;
    comments: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status?: string | undefined;
    comments?: string | undefined;
    disposition?: string | undefined;
}, {
    id: string;
    status?: string | undefined;
    comments?: string | undefined;
    disposition?: string | undefined;
}>;
export declare const reviewHoldSchema: z.ZodObject<{
    holdId: z.ZodString;
    action: z.ZodEnum<["RELEASE", "REWORK", "SCRAP", "REVIEW"]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "REWORK" | "RELEASE" | "SCRAP" | "REVIEW";
    holdId: string;
    notes?: string | undefined;
}, {
    action: "REWORK" | "RELEASE" | "SCRAP" | "REVIEW";
    holdId: string;
    notes?: string | undefined;
}>;
export declare const reviewBatchSchema: z.ZodObject<{
    batchId: z.ZodString;
    comments: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    batchId: string;
    status?: string | undefined;
    comments?: string | undefined;
}, {
    batchId: string;
    status?: string | undefined;
    comments?: string | undefined;
}>;
export declare const submitPreOpSchema: z.ZodObject<{
    line: z.ZodDefault<z.ZodString>;
    batchRun: z.ZodDefault<z.ZodString>;
    officer: z.ZodDefault<z.ZodString>;
    checkpoints: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    clearanceStatus: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    line: string;
    batchRun: string;
    officer: string;
    clearanceStatus: string;
    checkpoints?: any[] | undefined;
}, {
    line?: string | undefined;
    batchRun?: string | undefined;
    officer?: string | undefined;
    checkpoints?: any[] | undefined;
    clearanceStatus?: string | undefined;
}>;
export declare const submitSanitationSchema: z.ZodObject<{
    loop: z.ZodDefault<z.ZodString>;
    protocol: z.ZodDefault<z.ZodString>;
    operator: z.ZodDefault<z.ZodString>;
    steps: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    status: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    operator: string;
    loop: string;
    protocol: string;
    steps?: any[] | undefined;
}, {
    status?: string | undefined;
    operator?: string | undefined;
    steps?: any[] | undefined;
    loop?: string | undefined;
    protocol?: string | undefined;
}>;
export declare const clearAllergenAuditSchema: z.ZodObject<{
    auditId: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    runName: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    auditId: string | number;
    runName: string;
    notes?: string | undefined;
}, {
    auditId: string | number;
    runName: string;
    notes?: string | undefined;
}>;
export declare const toggleLineReadinessSchema: z.ZodObject<{
    lineId: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    lineName: z.ZodString;
    status: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: string;
    lineId: string | number;
    lineName: string;
}, {
    status: string;
    lineId: string | number;
    lineName: string;
}>;
//# sourceMappingURL=quality.schema.d.ts.map