import { z } from "zod";

export const createWorkOrderSchema = z.object({
  assetId: z.string().min(1),
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const clean = val.toUpperCase().replace(/[\s-]+/g, "_");
        if (clean.includes("EMERGENCY") || clean.includes("BREAKDOWN")) return "EMERGENCY_BREAKDOWN";
        if (clean.includes("PREVENT")) return "PREVENTIVE";
        if (clean.includes("CALIBRAT")) return "CALIBRATION";
        return "CORRECTIVE";
      }
      return val;
    },
    z.enum(["CORRECTIVE", "PREVENTIVE", "EMERGENCY_BREAKDOWN", "CALIBRATION"]).default("CORRECTIVE")
  ),
  priority: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const clean = val.toUpperCase();
        if (clean.includes("P1") || clean.includes("CRITICAL")) return "P1_CRITICAL";
        if (clean.includes("P2") || clean.includes("HIGH")) return "HIGH";
        if (clean.includes("P3") || clean.includes("MED")) return "MEDIUM";
        if (clean.includes("P4") || clean.includes("LOW")) return "LOW";
        return clean.replace(/[\s-]+/g, "_");
      }
      return val;
    },
    z.enum(["P1_CRITICAL", "HIGH", "MEDIUM", "LOW"]).default("HIGH")
  ),
  assignedTo: z.string().uuid().optional(),
  failureCodeId: z.string().uuid().optional(),
  estimatedHours: z.coerce.number().default(2.0),
  scheduledDate: z.string().optional(),
});

export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;

export const updateWorkOrderStatusSchema = z.object({
  status: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const clean = val.toUpperCase().replace(/[\s-]+/g, "_");
        if (clean.includes("PROGRESS") || clean.includes("INVESTIGAT") || clean.includes("REPAIR")) return "IN_PROGRESS";
        if (clean.includes("PART")) return "WAITING_FOR_PARTS";
        if (clean.includes("COMPLETE") || clean.includes("RESOLVE") || clean.includes("VERIF")) return "COMPLETED";
        if (clean.includes("CLOSE")) return "CLOSED";
        if (clean.includes("ASSIGN")) return "ASSIGNED";
        if (clean.includes("OPEN") || clean.includes("REPORT") || clean.includes("ACKNOW")) return "OPEN";
        return clean;
      }
      return val;
    },
    z.string().min(1).default("OPEN")
  ),
  actualHours: z.coerce.number().optional(),
});

export type UpdateWorkOrderStatusInput = z.infer<typeof updateWorkOrderStatusSchema>;

