import { z } from "zod";

export const createCustomerOrderSchema = z.object({
  orderNumber: z.string().min(2),
  customerName: z.string().min(2),
  skuId: z.string().min(1),
  quantity: z.coerce.number().positive(),
  priority: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase().trim() : "NORMAL"),
    z.string().default("NORMAL")
  ),
  requestedDate: z.string(),
  deliveryAddress: z.string().optional(),
  status: z.string().optional(),
});

export type CreateCustomerOrderInput = z.infer<typeof createCustomerOrderSchema>;

export const runForecastSchema = z.object({
  skuId: z.string().min(1),
  period: z.string().default("2026-W36"),
  alpha: z.coerce.number().min(0.01).max(1.0).default(0.25),
  promoUpliftPercent: z.coerce.number().default(0),
  method: z.string().optional(),
});

export type RunForecastInput = z.infer<typeof runForecastSchema>;

export const createApsScheduleSchema = z.object({
  lineId: z.string().min(1),
  shiftId: z.string().optional(),
  orderId: z.string().optional(),
  skuId: z.string().min(1),
  startTime: z.string(),
  endTime: z.string(),
  quantity: z.coerce.number().positive(),
  changeoverMinutes: z.coerce.number().default(30),
  cipRequired: z.boolean().default(false),
});

export type CreateApsScheduleInput = z.infer<typeof createApsScheduleSchema>;

export const createPromotionCampaignSchema = z.object({
  name: z.string().min(2),
  skuId: z.string().min(1),
  upliftPercent: z.coerce.number().min(0),
  incrementalUnits: z.coerce.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  duration: z.string().optional(),
  channel: z.string().optional(),
  status: z.string().optional(),
});

export type CreatePromotionCampaignInput = z.infer<typeof createPromotionCampaignSchema>;

