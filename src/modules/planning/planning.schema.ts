import { z } from "zod";

export const createCustomerOrderSchema = z.object({
  orderNumber: z.string().min(2),
  customerName: z.string().min(2),
  skuId: z.string().uuid(),
  quantity: z.coerce.number().positive(),
  priority: z.enum(["URGENT", "NORMAL", "LOW"]).default("NORMAL"),
  requestedDate: z.string(),
  deliveryAddress: z.string().optional(),
});

export type CreateCustomerOrderInput = z.infer<typeof createCustomerOrderSchema>;

export const runForecastSchema = z.object({
  skuId: z.string().uuid(),
  period: z.string().default("2026-W36"),
  alpha: z.coerce.number().min(0.01).max(1.0).default(0.25),
  promoUpliftPercent: z.coerce.number().default(0),
});

export type RunForecastInput = z.infer<typeof runForecastSchema>;

export const createApsScheduleSchema = z.object({
  lineId: z.string().uuid(),
  shiftId: z.string().uuid().optional(),
  orderId: z.string().uuid().optional(),
  skuId: z.string().uuid(),
  startTime: z.string(),
  endTime: z.string(),
  quantity: z.coerce.number().positive(),
  changeoverMinutes: z.coerce.number().default(30),
  cipRequired: z.boolean().default(false),
});

export type CreateApsScheduleInput = z.infer<typeof createApsScheduleSchema>;
