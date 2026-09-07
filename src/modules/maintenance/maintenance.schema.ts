import { z } from "zod";

export const createWorkOrderSchema = z.object({
  assetId: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(["CORRECTIVE", "PREVENTIVE", "EMERGENCY_BREAKDOWN", "CALIBRATION"]).default("CORRECTIVE"),
  priority: z.enum(["P1_CRITICAL", "HIGH", "MEDIUM", "LOW"]).default("HIGH"),
  assignedTo: z.string().uuid().optional(),
  failureCodeId: z.string().uuid().optional(),
  estimatedHours: z.coerce.number().default(2.0),
  scheduledDate: z.string().optional(),
});

export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;

export const updateWorkOrderStatusSchema = z.object({
  status: z.enum(["OPEN", "ASSIGNED", "IN_PROGRESS", "WAITING_FOR_PARTS", "COMPLETED", "CLOSED"]),
  actualHours: z.coerce.number().optional(),
});

export type UpdateWorkOrderStatusInput = z.infer<typeof updateWorkOrderStatusSchema>;
