"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQualityHoldSchema = exports.qaBatchReleaseSchema = exports.recordCcpCheckSchema = void 0;
const zod_1 = require("zod");
exports.recordCcpCheckSchema = zod_1.z.object({
    batchId: zod_1.z.string().uuid(),
    lineId: zod_1.z.string().uuid(),
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
    batchId: zod_1.z.string().uuid().optional(),
    reason: zod_1.z.string().min(2),
    severity: zod_1.z.string().default("HIGH"),
});
//# sourceMappingURL=quality.schema.js.map