"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkOrderStatusSchema = exports.createWorkOrderSchema = void 0;
const zod_1 = require("zod");
exports.createWorkOrderSchema = zod_1.z.object({
    assetId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    type: zod_1.z.enum(["CORRECTIVE", "PREVENTIVE", "EMERGENCY_BREAKDOWN", "CALIBRATION"]).default("CORRECTIVE"),
    priority: zod_1.z.enum(["P1_CRITICAL", "HIGH", "MEDIUM", "LOW"]).default("HIGH"),
    assignedTo: zod_1.z.string().uuid().optional(),
    failureCodeId: zod_1.z.string().uuid().optional(),
    estimatedHours: zod_1.z.coerce.number().default(2.0),
    scheduledDate: zod_1.z.string().optional(),
});
exports.updateWorkOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["OPEN", "ASSIGNED", "IN_PROGRESS", "WAITING_FOR_PARTS", "COMPLETED", "CLOSED"]),
    actualHours: zod_1.z.coerce.number().optional(),
});
//# sourceMappingURL=maintenance.schema.js.map