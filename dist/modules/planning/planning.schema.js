"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApsScheduleSchema = exports.runForecastSchema = exports.createCustomerOrderSchema = void 0;
const zod_1 = require("zod");
exports.createCustomerOrderSchema = zod_1.z.object({
    orderNumber: zod_1.z.string().min(2),
    customerName: zod_1.z.string().min(2),
    skuId: zod_1.z.string().uuid(),
    quantity: zod_1.z.coerce.number().positive(),
    priority: zod_1.z.enum(["URGENT", "NORMAL", "LOW"]).default("NORMAL"),
    requestedDate: zod_1.z.string(),
    deliveryAddress: zod_1.z.string().optional(),
});
exports.runForecastSchema = zod_1.z.object({
    skuId: zod_1.z.string().uuid(),
    period: zod_1.z.string().default("2026-W36"),
    alpha: zod_1.z.coerce.number().min(0.01).max(1.0).default(0.25),
    promoUpliftPercent: zod_1.z.coerce.number().default(0),
});
exports.createApsScheduleSchema = zod_1.z.object({
    lineId: zod_1.z.string().uuid(),
    shiftId: zod_1.z.string().uuid().optional(),
    orderId: zod_1.z.string().uuid().optional(),
    skuId: zod_1.z.string().uuid(),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
    quantity: zod_1.z.coerce.number().positive(),
    changeoverMinutes: zod_1.z.coerce.number().default(30),
    cipRequired: zod_1.z.boolean().default(false),
});
//# sourceMappingURL=planning.schema.js.map