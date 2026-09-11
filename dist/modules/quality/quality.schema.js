"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLineReadinessSchema = exports.clearAllergenAuditSchema = exports.submitSanitationSchema = exports.submitPreOpSchema = exports.reviewBatchSchema = exports.reviewHoldSchema = exports.reviewNcrSchema = exports.createNcrSchema = exports.completeInvestigationSchema = exports.saveInvestigationFindingSchema = exports.startInvestigationSchema = exports.createDeviationSchema = exports.createQualityHoldSchema = exports.qaBatchReleaseSchema = exports.recordCcpCheckSchema = void 0;
const zod_1 = require("zod");
exports.recordCcpCheckSchema = zod_1.z.object({
    batchId: zod_1.z.string().optional(),
    lineId: zod_1.z.string().optional(),
    ccpCode: zod_1.z.string().min(2), // "CCP-1"
    ccpName: zod_1.z.string().min(2), // "Pasteurizer Thermal Kill Step (≥83.1°C)"
    targetValue: zod_1.z.coerce.number(),
    actualValue: zod_1.z.coerce.number(),
    criticalLimitMin: zod_1.z.coerce.number().optional(),
    criticalLimitMax: zod_1.z.coerce.number().optional(),
    uom: zod_1.z.string().default("°C"),
    notes: zod_1.z.string().optional(),
});
exports.qaBatchReleaseSchema = zod_1.z.object({
    batchId: zod_1.z.string().uuid(),
    disposition: zod_1.z.enum(["RELEASED", "REJECTED", "REWORK", "QUARANTINED"]),
    signaturePin: zod_1.z.string().min(4, "4-digit signature PIN required"),
    comments: zod_1.z.string().optional(),
});
exports.createQualityHoldSchema = zod_1.z.object({
    lotNumber: zod_1.z.string().min(2),
    batchId: zod_1.z.string().optional(),
    reason: zod_1.z.string().min(2),
    severity: zod_1.z.string().default("HIGH"),
});
exports.createDeviationSchema = zod_1.z.object({
    deviationNumber: zod_1.z.string().optional(),
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(3),
    category: zod_1.z.string().default("PROCESS_DEVIATION"),
    severity: zod_1.z.string().default("MAJOR"),
    holdId: zod_1.z.string().optional(),
});
exports.startInvestigationSchema = zod_1.z.object({
    devId: zod_1.z.string().min(2),
    title: zod_1.z.string().optional(),
    assignedTo: zod_1.z.string().optional(),
});
exports.saveInvestigationFindingSchema = zod_1.z.object({
    invId: zod_1.z.string().min(2),
    finding: zod_1.z.string().min(2),
    rootCauseCategory: zod_1.z.string().optional(),
    status: zod_1.z.string().default("IN_PROGRESS"),
});
exports.completeInvestigationSchema = zod_1.z.object({
    invId: zod_1.z.string().min(2),
    devId: zod_1.z.string().optional(),
    summary: zod_1.z.string().optional(),
});
exports.createNcrSchema = zod_1.z.object({
    ncrNumber: zod_1.z.string().optional(),
    part: zod_1.z.string().min(2),
    lotNumber: zod_1.z.string().optional(),
    reason: zod_1.z.string().min(3),
    severity: zod_1.z.string().default("HIGH"),
    disposition: zod_1.z.string().optional(),
});
exports.reviewNcrSchema = zod_1.z.object({
    id: zod_1.z.string().min(2),
    status: zod_1.z.string().optional(),
    disposition: zod_1.z.string().optional(),
    comments: zod_1.z.string().optional(),
});
exports.reviewHoldSchema = zod_1.z.object({
    holdId: zod_1.z.string().min(2),
    action: zod_1.z.enum(["RELEASE", "REWORK", "SCRAP", "REVIEW"]),
    notes: zod_1.z.string().optional(),
});
exports.reviewBatchSchema = zod_1.z.object({
    batchId: zod_1.z.string().min(2),
    comments: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
});
exports.submitPreOpSchema = zod_1.z.object({
    line: zod_1.z.string().default("Line 1 (High-Speed Rotary 580 BPM)"),
    batchRun: zod_1.z.string().default("BAT-2026-0885"),
    officer: zod_1.z.string().default("Dr. Rachel Thorne (QA Lead)"),
    checkpoints: zod_1.z.array(zod_1.z.any()).optional(),
    clearanceStatus: zod_1.z.string().default("CLEARED"),
});
exports.submitSanitationSchema = zod_1.z.object({
    loop: zod_1.z.string().default("CIP Loop 01"),
    protocol: zod_1.z.string().default("5-Step Full Thermal & Chemical CIP Cycle"),
    operator: zod_1.z.string().default("Dr. Rachel Thorne (QA Lead)"),
    steps: zod_1.z.array(zod_1.z.any()).optional(),
    status: zod_1.z.string().default("VERIFIED"),
});
exports.clearAllergenAuditSchema = zod_1.z.object({
    auditId: zod_1.z.number().or(zod_1.z.string()),
    runName: zod_1.z.string().min(2),
    notes: zod_1.z.string().optional(),
});
exports.toggleLineReadinessSchema = zod_1.z.object({
    lineId: zod_1.z.number().or(zod_1.z.string()),
    lineName: zod_1.z.string().min(2),
    status: zod_1.z.string(),
});
//# sourceMappingURL=quality.schema.js.map