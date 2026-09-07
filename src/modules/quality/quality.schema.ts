import { z } from "zod";

export const recordCcpCheckSchema = z.object({
  batchId: z.string().uuid(),
  lineId: z.string().uuid(),
  ccpCode: z.string().min(2), // "CCP-1"
  ccpName: z.string().min(2), // "Pasteurizer Thermal Kill Step (≥83.1°C)"
  targetValue: z.coerce.number(),
  actualValue: z.coerce.number(),
  criticalLimitMin: z.coerce.number().optional(),
  criticalLimitMax: z.coerce.number().optional(),
  uom: z.string().default("°C"),
  notes: z.string().optional(),
});

export type RecordCcpCheckInput = z.infer<typeof recordCcpCheckSchema>;

export const qaBatchReleaseSchema = z.object({
  batchId: z.string().uuid(),
  disposition: z.enum(["RELEASED", "REJECTED", "REWORK", "QUARANTINED"]),
  signaturePin: z.string().min(4, "4-digit signature PIN required"),
  comments: z.string().optional(),
});

export type QaBatchReleaseInput = z.infer<typeof qaBatchReleaseSchema>;

export const createQualityHoldSchema = z.object({
  lotNumber: z.string().min(2),
  batchId: z.string().uuid().optional(),
  reason: z.string().min(2),
  severity: z.string().default("HIGH"),
});

export type CreateQualityHoldInput = z.infer<typeof createQualityHoldSchema>;
