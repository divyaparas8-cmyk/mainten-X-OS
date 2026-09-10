import { z } from "zod";

const customerOrderBaseSchema = z.object({
  orderNumber: z.string().optional(),
  customer: z.string().optional(),
  customerName: z.string().optional(),
  skuId: z.string().optional(),
  productCode: z.string().optional(),
  productName: z.string().optional(),
  quantity: z.coerce.number().positive(),
  uom: z.string().optional(),
  priority: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const clean = val.toUpperCase().trim();
        if (clean === "HIGH" || clean === "URGENT") return "URGENT";
        if (clean === "LOW") return "LOW";
        return "NORMAL";
      }
      return val;
    },
    z.enum(["URGENT", "NORMAL", "LOW"]).default("NORMAL")
  ),
  requestedDate: z.string().optional(),
  requestedShipDate: z.string().optional(),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  plantId: z.string().optional(),
  status: z.string().default("Open").optional(),
});

export const createCustomerOrderSchema = customerOrderBaseSchema.refine(data => data.customer || data.customerName, {
  message: "customer or customerName is required",
});

export type CreateCustomerOrderInput = z.infer<typeof customerOrderBaseSchema>;

export const updateCustomerOrderSchema = z.object({
  orderNumber: z.string().optional(),
  customer: z.string().optional(),
  customerName: z.string().optional(),
  skuId: z.string().optional(),
  productCode: z.string().optional(),
  productName: z.string().optional(),
  quantity: z.coerce.number().positive().optional(),
  uom: z.string().optional(),
  priority: z.string().optional(),
  requestedDate: z.string().optional(),
  requestedShipDate: z.string().optional(),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  plantId: z.string().optional(),
  status: z.string().optional(),
});

export type UpdateCustomerOrderInput = z.infer<typeof updateCustomerOrderSchema>;

export const createForecastSchema = z.object({
  period: z.string().default("2026-W36"),
  skuId: z.string().optional(),
  productCode: z.string().optional(),
  productName: z.string().optional(),
  historicalDemand: z.coerce.number().optional(),
  baselineForecast: z.coerce.number().optional(),
  baselineDemand: z.coerce.number().optional(),
  overrideQuantity: z.coerce.number().default(0),
  finalForecast: z.coerce.number().optional(),
  method: z.string().optional(),
  modelType: z.string().optional(),
  reason: z.string().optional(),
  owner: z.string().optional(),
  status: z.string().default("Submitted"),
  plantId: z.string().optional(),
});

export type CreateForecastInput = z.infer<typeof createForecastSchema>;

export const updateForecastSchema = z.object({
  period: z.string().optional(),
  skuId: z.string().optional(),
  baselineForecast: z.coerce.number().optional(),
  baselineDemand: z.coerce.number().optional(),
  overrideQuantity: z.coerce.number().optional(),
  finalForecast: z.coerce.number().optional(),
  method: z.string().optional(),
  reason: z.string().optional(),
  owner: z.string().optional(),
  status: z.string().optional(),
});

export type UpdateForecastInput = z.infer<typeof updateForecastSchema>;

export const runForecastSchema = z.object({
  skuId: z.string().optional(),
  period: z.string().default("2026-W36"),
  alpha: z.coerce.number().min(0.01).max(1.0).default(0.25),
  promoUpliftPercent: z.coerce.number().default(0),
});

export type RunForecastInput = z.infer<typeof runForecastSchema>;

export const createPromotionSchema = z.object({
  title: z.string().optional(),
  name: z.string().optional(),
  skuId: z.string().optional(),
  productCode: z.string().optional(),
  productName: z.string().optional(),
  upliftPercent: z.coerce.number().default(10),
  projectedUnits: z.coerce.number().default(5000),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  channel: z.string().optional(),
  status: z.string().default("ACTIVE"),
});

export type CreatePromotionInput = z.infer<typeof createPromotionSchema>;

export const updatePromotionSchema = z.object({
  title: z.string().optional(),
  status: z.string().optional(),
  upliftPercent: z.coerce.number().optional(),
  projectedUnits: z.coerce.number().optional(),
});

export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>;

export const createApsScheduleSchema = z.object({
  scheduleId: z.string().optional(),
  orderNumber: z.string().optional(),
  productionOrderId: z.string().optional(),
  lineId: z.string().optional(),
  shiftId: z.string().optional(),
  orderId: z.string().optional(),
  skuId: z.string().optional(),
  productCode: z.string().optional(),
  productName: z.string().optional(),
  startTime: z.string(),
  endTime: z.string().optional(),
  quantity: z.coerce.number().positive().optional(),
  targetQuantity: z.coerce.number().positive().optional(),
  runRate: z.coerce.number().default(500),
  changeoverMinutes: z.coerce.number().default(30),
  cipRequired: z.boolean().default(false),
});

export type CreateApsScheduleInput = z.infer<typeof createApsScheduleSchema>;

export const rescheduleApsScheduleSchema = z.object({
  scheduleId: z.string().optional(),
  lineId: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  reason: z.string().optional(),
});

export type RescheduleApsScheduleInput = z.infer<typeof rescheduleApsScheduleSchema>;

export const splitApsScheduleSchema = z.object({
  scheduleId: z.string().optional(),
  splitCount: z.coerce.number().min(2).default(2),
  notes: z.string().optional(),
});

export type SplitApsScheduleInput = z.infer<typeof splitApsScheduleSchema>;

export const optimizeApsScheduleSchema = z.object({
  plantId: z.string().optional(),
  horizon: z.string().default("Week 36"),
  strategy: z.string().default("MINIMIZE_CHANGEOVERS"),
});

export type OptimizeApsScheduleInput = z.infer<typeof optimizeApsScheduleSchema>;


export const updateShipmentStatusSchema = z.object({
  status: z.string(),
});

export type UpdateShipmentStatusInput = z.infer<typeof updateShipmentStatusSchema>;

export const runMrpEngineSchema = z.object({
  period: z.string().default("Next 7 Days (W36 - W37)"),
  plantId: z.string().optional(),
  productId: z.string().default("ALL"),
});

export type RunMrpEngineInput = z.infer<typeof runMrpEngineSchema>;

export const createPurchaseRequisitionSchema = z.object({
  skuId: z.string().optional(),
  skuCode: z.string().optional(),
  name: z.string().optional(),
  quantity: z.coerce.number().positive(),
  uom: z.string().default("Units"),
  priority: z.string().default("Expedite"),
  vendorName: z.string().optional(),
  notes: z.string().optional(),
  plantId: z.string().optional(),
});

export type CreatePurchaseRequisitionInput = z.infer<typeof createPurchaseRequisitionSchema>;

export const expediteShortageSchema = z.object({
  skuId: z.string().optional(),
  skuCode: z.string().optional(),
  name: z.string().optional(),
  expediteMode: z.string().default("Air/Express Freight"),
  leadTimeReductionHours: z.coerce.number().default(48),
  vendorName: z.string().optional(),
  notes: z.string().optional(),
});

export type ExpediteShortageInput = z.infer<typeof expediteShortageSchema>;

export const updateSafetyStockPolicySchema = z.object({
  skuId: z.string().optional(),
  skuCode: z.string().optional(),
  safetyStock: z.coerce.number().positive(),
  serviceLevelTarget: z.coerce.number().default(99.0),
  category: z.string().optional(),
});

export type UpdateSafetyStockPolicyInput = z.infer<typeof updateSafetyStockPolicySchema>;

export const mitigateServiceRiskSchema = z.object({
  riskId: z.string(),
  riskTitle: z.string().optional(),
  actionProtocol: z.string().optional(),
  authorizedBy: z.string().default("Elena Rostova (Lead Planner)"),
  notes: z.string().optional(),
});

export type MitigateServiceRiskInput = z.infer<typeof mitigateServiceRiskSchema>;

export const createScheduleVersionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  reason: z.string().optional(),
  createdBy: z.string().default("Alexander Vance (Lead Scheduler)"),
  status: z.string().default("Draft"),
});

export type CreateScheduleVersionInput = z.infer<typeof createScheduleVersionSchema>;

export const validateScheduleSchema = z.object({
  scheduleId: z.string().optional(),
  versionId: z.string().optional(),
  horizon: z.string().default("Week 36"),
});

export type ValidateScheduleInput = z.infer<typeof validateScheduleSchema>;

export const publishScheduleSchema = z.object({
  versionId: z.string().min(1, "Version ID is required"),
  publishedBy: z.string().default("Alexander Vance (Lead Scheduler)"),
  notes: z.string().optional(),
});

export type PublishScheduleInput = z.infer<typeof publishScheduleSchema>;

export const createShipmentSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  orderRef: z.string().optional(),
  carrier: z.string().optional(),
  mode: z.string().optional(),
  pallets: z.coerce.number().default(20),
  units: z.string().optional(),
  scheduledDate: z.string().optional(),
  dockDoor: z.string().optional(),
  status: z.string().default("Booked"),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;


