import { z } from "zod";

export const createProductionOrderSchema = z.object({
  orderNumber: z.string().min(2),
  skuId: z.string().uuid(),
  lineId: z.string().uuid(),
  targetQuantity: z.coerce.number().positive(),
  plannedStart: z.string(),
  plannedEnd: z.string(),
  priority: z.enum(["URGENT", "NORMAL", "LOW"]).default("NORMAL"),
  notes: z.string().optional(),
});

export type CreateProductionOrderInput = z.infer<typeof createProductionOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PLANNED",
    "SCHEDULED",
    "RELEASED",
    "RUNNING",
    "COMPLETED",
    "QA_PENDING",
    "RELEASED_TO_WAREHOUSE",
    "CANCELLED",
  ]),
});

export const updateBatchStepSchema = z.object({
  stepNumber: z.coerce.number().min(1).max(6),
  parameters: z.record(z.any()).default({}),
  notes: z.string().optional(),
});

export type UpdateBatchStepInput = z.infer<typeof updateBatchStepSchema>;

export const recordOperatorEntrySchema = z.object({
  orderId: z.string().uuid(),
  lineId: z.string().uuid(),
  shiftCode: z.string().default("SHIFT_A"),
  goodUnitsIncrement: z.coerce.number().int().positive(),
  scrapUnitsIncrement: z.coerce.number().int().default(0),
});

export type RecordOperatorEntryInput = z.infer<typeof recordOperatorEntrySchema>;

export const logDowntimeSchema = z.object({
  lineId: z.string().uuid(),
  assetId: z.string().uuid().optional(),
  orderId: z.string().uuid().optional(),
  reasonCode: z.string().min(2),
  category: z.string().default("UNPLANNED_STOPPAGE"),
  durationMinutes: z.coerce.number().int().positive(),
  comments: z.string().optional(),
});

export type LogDowntimeInput = z.infer<typeof logDowntimeSchema>;
