"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoutingSchema = exports.createRoutingSchema = exports.routingStepSchema = exports.createBomSchema = exports.createSkuSchema = void 0;
const zod_1 = require("zod");
exports.createSkuSchema = zod_1.z.object({
    skuCode: zod_1.z.string().min(2),
    name: zod_1.z.string().min(2),
    category: zod_1.z.enum(["FINISHED_GOODS", "RAW_MATERIAL", "PACKAGING"]),
    familyId: zod_1.z.string().uuid().optional(),
    uom: zod_1.z.string().default("Units"),
    barcode: zod_1.z.string().optional(),
    standardCost: zod_1.z.coerce.number().default(0),
    shelfLifeDays: zod_1.z.coerce.number().default(365),
    minStockLevel: zod_1.z.coerce.number().default(1000),
    maxStockLevel: zod_1.z.coerce.number().default(50000),
});
exports.createBomSchema = zod_1.z.object({
    skuId: zod_1.z.string().uuid(),
    version: zod_1.z.string().default("v1.0"),
    name: zod_1.z.string().min(2),
    batchSize: zod_1.z.coerce.number().default(10000),
    batchUom: zod_1.z.string().default("Units"),
    yieldPercent: zod_1.z.coerce.number().default(98.5),
    items: zod_1.z.array(zod_1.z.object({
        componentSkuId: zod_1.z.string().uuid(),
        quantity: zod_1.z.coerce.number().positive(),
        uom: zod_1.z.string(),
        scrapPercentage: zod_1.z.coerce.number().default(0),
        stage: zod_1.z.string().default("MIXING"),
    })),
});
exports.routingStepSchema = zod_1.z.object({
    sequence: zod_1.z.coerce.number().default(10),
    operationCode: zod_1.z.string().min(1),
    operationName: zod_1.z.string().min(1),
    workCenterId: zod_1.z.string().uuid().optional().nullable(),
    stdDurationMin: zod_1.z.coerce.number().default(15),
    setupDurationMin: zod_1.z.coerce.number().default(10),
    crewSize: zod_1.z.coerce.number().default(2),
    isQualityGate: zod_1.z.boolean().default(false),
    instructions: zod_1.z.string().optional().nullable(),
});
exports.createRoutingSchema = zod_1.z.object({
    routingCode: zod_1.z.string().min(2),
    skuId: zod_1.z.string().uuid(),
    lineId: zod_1.z.string().uuid().optional().nullable(),
    plantId: zod_1.z.string().uuid().optional().nullable(),
    revision: zod_1.z.string().default("R1"),
    approvalStatus: zod_1.z.enum(["Draft", "In Review", "Approved", "Obsolete"]).default("Approved"),
    status: zod_1.z.enum(["Active", "Inactive"]).default("Active"),
    stdRunRateBph: zod_1.z.coerce.number().default(12000),
    setupDurationMin: zod_1.z.coerce.number().default(45),
    expectedYieldPct: zod_1.z.coerce.number().default(98.50),
    effectiveFrom: zod_1.z.string().optional().nullable(),
    effectiveTo: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    steps: zod_1.z.array(exports.routingStepSchema).optional().default([]),
});
exports.updateRoutingSchema = exports.createRoutingSchema.partial();
//# sourceMappingURL=masterData.schema.js.map