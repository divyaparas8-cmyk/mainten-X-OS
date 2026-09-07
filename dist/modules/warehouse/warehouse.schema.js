"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionSchema = exports.createLotSchema = void 0;
const zod_1 = require("zod");
exports.createLotSchema = zod_1.z.object({
    skuId: zod_1.z.string().uuid(),
    lotNumber: zod_1.z.string().min(2),
    lotType: zod_1.z.enum(["RAW_MATERIAL", "PACKAGING", "FINISHED_GOOD"]),
    supplierName: zod_1.z.string().optional(),
    supplierLotNumber: zod_1.z.string().optional(),
    initialQuantity: zod_1.z.coerce.number().positive(),
    uom: zod_1.z.string().default("Units"),
    locationBinId: zod_1.z.string().uuid().optional(),
    expiryDate: zod_1.z.string().optional(),
});
exports.createTransactionSchema = zod_1.z.object({
    lotId: zod_1.z.string().uuid(),
    type: zod_1.z.enum(["RECEIPT", "TRANSFER", "RESERVATION", "ISSUE", "CONSUMPTION", "ADJUSTMENT", "SHIPMENT"]),
    quantity: zod_1.z.coerce.number(),
    uom: zod_1.z.string().default("Units"),
    fromBinId: zod_1.z.string().uuid().optional(),
    toBinId: zod_1.z.string().uuid().optional(),
    referenceType: zod_1.z.string().optional(),
    referenceId: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
//# sourceMappingURL=warehouse.schema.js.map