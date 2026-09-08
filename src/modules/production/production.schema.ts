import { z } from "zod";

export const createProductionOrderSchema = z.object({
  orderNumber: z.string().min(2),
  skuId: z.string().uuid(),
  lineId: z.string().uuid(),
  targetQuantity: z.coerce.number().positive().optional(),
  plannedQuantity: z.coerce.number().positive().optional(),
  quantity: z.coerce.number().positive().optional(),
  plannedStart: z.string().optional().default(() => new Date().toISOString()),
  plannedEnd: z.string().optional().default(() => new Date(Date.now() + 8 * 3600000).toISOString()),
  priority: z.preprocess((val: any) => {
    if (!val) return "NORMAL";
    const upper = String(val).toUpperCase();
    if (upper === "HIGH" || upper === "URGENT") return "URGENT";
    if (upper === "LOW") return "LOW";
    return "NORMAL";
  }, z.enum(["URGENT", "NORMAL", "LOW"])).default("NORMAL"),
  notes: z.string().optional(),
}).transform((data) => ({
  ...data,
  targetQuantity: data.targetQuantity || data.plannedQuantity || data.quantity || 10000,
  plannedStart: data.plannedStart || new Date().toISOString(),
  plannedEnd: data.plannedEnd || new Date(Date.now() + 8 * 3600000).toISOString(),
}));

export type CreateProductionOrderInput = z.infer<typeof createProductionOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.preprocess((val: any) => {
    if (!val) return "RUNNING";
    const s = String(val).toUpperCase().replace(/\s+/g, "_");
    if (s === "IN_PROGRESS" || s === "INPROGRESS" || s === "ACTIVE" || s === "START") return "RUNNING";
    if (s === "COMPLETE" || s === "DONE") return "COMPLETED";
    if (s === "PLAN") return "PLANNED";
    return s;
  }, z.enum([
    "PLANNED",
    "SCHEDULED",
    "RELEASED",
    "RUNNING",
    "COMPLETED",
    "QA_PENDING",
    "RELEASED_TO_WAREHOUSE",
    "CANCELLED",
  ])),
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
