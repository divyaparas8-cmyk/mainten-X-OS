import { z } from "zod";

export const recordCcpCheckSchema = z.object({
  batchId: z.string().optional(),
  lineId: z.string().optional(),
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
  batchId: z.string().optional(),
  reason: z.string().min(2),
  severity: z.string().default("HIGH"),
});

export type CreateQualityHoldInput = z.infer<typeof createQualityHoldSchema>;

export const createDeviationSchema = z.object({
  deviationNumber: z.string().optional(),
  title: z.string().min(3),
  description: z.string().min(3),
  category: z.string().default("PROCESS_DEVIATION"),
  severity: z.string().default("MAJOR"),
  holdId: z.string().optional(),
});

export type CreateDeviationInput = z.infer<typeof createDeviationSchema>;

export const startInvestigationSchema = z.object({
  devId: z.string().min(2),
  title: z.string().optional(),
  assignedTo: z.string().optional(),
});

export const saveInvestigationFindingSchema = z.object({
  invId: z.string().min(2),
  finding: z.string().min(2),
  rootCauseCategory: z.string().optional(),
  status: z.string().default("IN_PROGRESS"),
});

export const completeInvestigationSchema = z.object({
  invId: z.string().min(2),
  devId: z.string().optional(),
  summary: z.string().optional(),
});

export const createNcrSchema = z.object({
  ncrNumber: z.string().optional(),
  part: z.string().min(2),
  lotNumber: z.string().optional(),
  reason: z.string().min(3),
  severity: z.string().default("HIGH"),
  disposition: z.string().optional(),
});

export const reviewNcrSchema = z.object({
  id: z.string().min(2),
  status: z.string().optional(),
  disposition: z.string().optional(),
  comments: z.string().optional(),
});

export const reviewHoldSchema = z.object({
  holdId: z.string().min(2),
  action: z.enum(["RELEASE", "REWORK", "SCRAP", "REVIEW"]),
  notes: z.string().optional(),
});

export const reviewBatchSchema = z.object({
  batchId: z.string().min(2),
  comments: z.string().optional(),
  status: z.string().optional(),
});

export const submitPreOpSchema = z.object({
  line: z.string().default("Line 1 (High-Speed Rotary 580 BPM)"),
  batchRun: z.string().default("BAT-2026-0885"),
  officer: z.string().default("Dr. Rachel Thorne (QA Lead)"),
  checkpoints: z.array(z.any()).optional(),
  clearanceStatus: z.string().default("CLEARED"),
});

export const submitSanitationSchema = z.object({
  loop: z.string().default("CIP Loop 01"),
  protocol: z.string().default("5-Step Full Thermal & Chemical CIP Cycle"),
  operator: z.string().default("Dr. Rachel Thorne (QA Lead)"),
  steps: z.array(z.any()).optional(),
  status: z.string().default("VERIFIED"),
});

export const clearAllergenAuditSchema = z.object({
  auditId: z.number().or(z.string()),
  runName: z.string().min(2),
  notes: z.string().optional(),
});

export const toggleLineReadinessSchema = z.object({
  lineId: z.number().or(z.string()),
  lineName: z.string().min(2),
  status: z.string(),
});

