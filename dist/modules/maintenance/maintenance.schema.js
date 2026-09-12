"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkOrderStatusSchema = exports.createWorkOrderSchema = void 0;
const zod_1 = require("zod");
exports.createWorkOrderSchema = zod_1.z.object({
    assetId: zod_1.z.string().optional(),
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    type: zod_1.z.preprocess((val) => {
        if (typeof val === "string") {
            const clean = val.toUpperCase().replace(/[\s-]+/g, "_");
            if (clean.includes("EMERGENCY") || clean.includes("BREAKDOWN"))
                return "EMERGENCY_BREAKDOWN";
            if (clean.includes("PREVENT"))
                return "PREVENTIVE";
            if (clean.includes("CALIBRAT"))
                return "CALIBRATION";
            return "CORRECTIVE";
        }
        return val;
    }, zod_1.z.enum(["CORRECTIVE", "PREVENTIVE", "EMERGENCY_BREAKDOWN", "CALIBRATION"]).default("CORRECTIVE")),
    priority: zod_1.z.preprocess((val) => {
        if (typeof val === "string") {
            const clean = val.toUpperCase();
            if (clean.includes("P1") || clean.includes("CRITICAL"))
                return "P1_CRITICAL";
            if (clean.includes("P2") || clean.includes("HIGH"))
                return "HIGH";
            if (clean.includes("P3") || clean.includes("MED"))
                return "MEDIUM";
            if (clean.includes("P4") || clean.includes("LOW"))
                return "LOW";
            return clean.replace(/[\s-]+/g, "_");
        }
        return val;
    }, zod_1.z.enum(["P1_CRITICAL", "HIGH", "MEDIUM", "LOW"]).default("HIGH")),
    assignedTo: zod_1.z.string().optional().nullable(),
    assignedTechnician: zod_1.z.string().optional().nullable(),
    technician: zod_1.z.string().optional().nullable(),
    failureCodeId: zod_1.z.string().optional().nullable(),
    estimatedHours: zod_1.z.coerce.number().default(2.0),
    scheduledDate: zod_1.z.string().optional().nullable(),
    dueDate: zod_1.z.string().optional().nullable(),
});
exports.updateWorkOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.preprocess((val) => {
        if (typeof val === "string") {
            const clean = val.toUpperCase().replace(/[\s-]+/g, "_");
            if (clean.includes("PROGRESS") || clean.includes("INVESTIGAT") || clean.includes("REPAIR"))
                return "IN_PROGRESS";
            if (clean.includes("PART"))
                return "WAITING_FOR_PARTS";
            if (clean.includes("COMPLETE") || clean.includes("RESOLVE") || clean.includes("VERIF"))
                return "COMPLETED";
            if (clean.includes("CLOSE"))
                return "CLOSED";
            if (clean.includes("ASSIGN"))
                return "ASSIGNED";
            if (clean.includes("OPEN") || clean.includes("REPORT") || clean.includes("ACKNOW"))
                return "OPEN";
            return clean;
        }
        return val;
    }, zod_1.z.string().min(1).default("OPEN")),
    actualHours: zod_1.z.coerce.number().optional(),
});
//# sourceMappingURL=maintenance.schema.js.map