"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBomSchema = exports.createSkuSchema = void 0;
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
//# sourceMappingURL=masterData.schema.js.map