"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDowntimeSchema = exports.recordOperatorEntrySchema = exports.updateBatchStepSchema = exports.updateOrderStatusSchema = exports.createProductionOrderSchema = void 0;
const zod_1 = require("zod");
exports.createProductionOrderSchema = zod_1.z.object({
    orderNumber: zod_1.z.string().min(2),
    skuId: zod_1.z.string().uuid(),
    lineId: zod_1.z.string().uuid(),
    targetQuantity: zod_1.z.coerce.number().positive().optional(),
    plannedQuantity: zod_1.z.coerce.number().positive().optional(),
    quantity: zod_1.z.coerce.number().positive().optional(),
    plannedStart: zod_1.z.string().optional().default(() => new Date().toISOString()),
    plannedEnd: zod_1.z.string().optional().default(() => new Date(Date.now() + 8 * 3600000).toISOString()),
    priority: zod_1.z.preprocess((val) => {
        if (!val)
            return "NORMAL";
        const upper = String(val).toUpperCase();
        if (upper === "HIGH" || upper === "URGENT")
            return "URGENT";
        if (upper === "LOW")
            return "LOW";
        return "NORMAL";
    }, zod_1.z.enum(["URGENT", "NORMAL", "LOW"])).default("NORMAL"),
    notes: zod_1.z.string().optional(),
}).transform((data) => ({
    ...data,
    targetQuantity: data.targetQuantity || data.plannedQuantity || data.quantity || 10000,
    plannedStart: data.plannedStart || new Date().toISOString(),
    plannedEnd: data.plannedEnd || new Date(Date.now() + 8 * 3600000).toISOString(),
}));
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.preprocess((val) => {
        if (!val)
            return "RUNNING";
        const s = String(val).toUpperCase().replace(/\s+/g, "_");
        if (s === "IN_PROGRESS" || s === "INPROGRESS" || s === "ACTIVE" || s === "START")
            return "RUNNING";
        if (s === "COMPLETE" || s === "DONE")
            return "COMPLETED";
        if (s === "PLAN")
            return "PLANNED";
        if (s === "PAUSE" || s === "PAUSED" || s === "HOLD" || s === "ON_HOLD")
            return "PAUSED";
        return s;
    }, zod_1.z.enum([
        "PLANNED",
        "SCHEDULED",
        "RELEASED",
        "RUNNING",
        "PAUSED",
        "COMPLETED",
        "QA_PENDING",
        "RELEASED_TO_WAREHOUSE",
        "CANCELLED",
    ])),
});
exports.updateBatchStepSchema = zod_1.z.object({
    stepNumber: zod_1.z.coerce.number().min(1).max(6),
    parameters: zod_1.z.record(zod_1.z.any()).default({}),
    notes: zod_1.z.string().optional(),
});
exports.recordOperatorEntrySchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid(),
    lineId: zod_1.z.string().uuid(),
    shiftCode: zod_1.z.string().default("SHIFT_A"),
    goodUnitsIncrement: zod_1.z.coerce.number().int().positive(),
    scrapUnitsIncrement: zod_1.z.coerce.number().int().default(0),
});
exports.logDowntimeSchema = zod_1.z.object({
    lineId: zod_1.z.string().uuid(),
    assetId: zod_1.z.string().uuid().optional(),
    orderId: zod_1.z.string().uuid().optional(),
    reasonCode: zod_1.z.string().min(2),
    category: zod_1.z.string().default("UNPLANNED_STOPPAGE"),
    durationMinutes: zod_1.z.coerce.number().int().positive(),
    comments: zod_1.z.string().optional(),
});
//# sourceMappingURL=production.schema.js.map