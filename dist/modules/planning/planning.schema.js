"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShipmentSchema = exports.publishScheduleSchema = exports.validateScheduleSchema = exports.createScheduleVersionSchema = exports.mitigateServiceRiskSchema = exports.updateSafetyStockPolicySchema = exports.expediteShortageSchema = exports.createPurchaseRequisitionSchema = exports.runMrpEngineSchema = exports.updateShipmentStatusSchema = exports.optimizeApsScheduleSchema = exports.splitApsScheduleSchema = exports.rescheduleApsScheduleSchema = exports.createPromotionCampaignSchema = exports.createApsScheduleSchema = exports.updatePromotionSchema = exports.createPromotionSchema = exports.runForecastSchema = exports.updateForecastSchema = exports.createForecastSchema = exports.updateCustomerOrderSchema = exports.createCustomerOrderSchema = void 0;
const zod_1 = require("zod");
const customerOrderBaseSchema = zod_1.z.object({
    orderNumber: zod_1.z.string().optional(),
    customer: zod_1.z.string().optional(),
    customerName: zod_1.z.string().optional(),
    skuId: zod_1.z.string().optional(),
    productCode: zod_1.z.string().optional(),
    productName: zod_1.z.string().optional(),
    quantity: zod_1.z.coerce.number().positive(),
    uom: zod_1.z.string().optional(),
    priority: zod_1.z.preprocess((val) => (typeof val === "string" ? val.toUpperCase().trim() : "NORMAL"), zod_1.z.string().default("NORMAL")),
    requestedDate: zod_1.z.string().optional(),
    requestedShipDate: zod_1.z.string().optional(),
    deliveryAddress: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    plantId: zod_1.z.string().optional(),
    status: zod_1.z.string().default("Open").optional(),
});
exports.createCustomerOrderSchema = customerOrderBaseSchema.refine(data => data.customer || data.customerName, {
    message: "customer or customerName is required",
});
exports.updateCustomerOrderSchema = zod_1.z.object({
    orderNumber: zod_1.z.string().optional(),
    customer: zod_1.z.string().optional(),
    customerName: zod_1.z.string().optional(),
    skuId: zod_1.z.string().optional(),
    productCode: zod_1.z.string().optional(),
    productName: zod_1.z.string().optional(),
    quantity: zod_1.z.coerce.number().positive().optional(),
    uom: zod_1.z.string().optional(),
    priority: zod_1.z.string().optional(),
    requestedDate: zod_1.z.string().optional(),
    requestedShipDate: zod_1.z.string().optional(),
    deliveryAddress: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    plantId: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
});
exports.createForecastSchema = zod_1.z.object({
    period: zod_1.z.string().default("2026-W36"),
    skuId: zod_1.z.string().optional(),
    productCode: zod_1.z.string().optional(),
    productName: zod_1.z.string().optional(),
    historicalDemand: zod_1.z.coerce.number().optional(),
    baselineForecast: zod_1.z.coerce.number().optional(),
    baselineDemand: zod_1.z.coerce.number().optional(),
    overrideQuantity: zod_1.z.coerce.number().default(0),
    finalForecast: zod_1.z.coerce.number().optional(),
    method: zod_1.z.string().optional(),
    modelType: zod_1.z.string().optional(),
    reason: zod_1.z.string().optional(),
    owner: zod_1.z.string().optional(),
    status: zod_1.z.string().default("Submitted"),
    plantId: zod_1.z.string().optional(),
});
exports.updateForecastSchema = zod_1.z.object({
    period: zod_1.z.string().optional(),
    skuId: zod_1.z.string().optional(),
    baselineForecast: zod_1.z.coerce.number().optional(),
    baselineDemand: zod_1.z.coerce.number().optional(),
    overrideQuantity: zod_1.z.coerce.number().optional(),
    finalForecast: zod_1.z.coerce.number().optional(),
    method: zod_1.z.string().optional(),
    reason: zod_1.z.string().optional(),
    owner: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
});
exports.runForecastSchema = zod_1.z.object({
    skuId: zod_1.z.string().optional(),
    period: zod_1.z.string().default("2026-W36"),
    alpha: zod_1.z.coerce.number().min(0.01).max(1.0).default(0.25),
    promoUpliftPercent: zod_1.z.coerce.number().default(0),
    method: zod_1.z.string().optional(),
});
exports.createPromotionSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
    skuId: zod_1.z.string().optional(),
    productCode: zod_1.z.string().optional(),
    productName: zod_1.z.string().optional(),
    upliftPercent: zod_1.z.coerce.number().default(10),
    projectedUnits: zod_1.z.coerce.number().default(5000),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    channel: zod_1.z.string().optional(),
    status: zod_1.z.string().default("ACTIVE"),
});
exports.updatePromotionSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    upliftPercent: zod_1.z.coerce.number().optional(),
    projectedUnits: zod_1.z.coerce.number().optional(),
});
exports.createApsScheduleSchema = zod_1.z.object({
    scheduleId: zod_1.z.string().optional(),
    orderNumber: zod_1.z.string().optional(),
    productionOrderId: zod_1.z.string().optional(),
    lineId: zod_1.z.string().optional(),
    shiftId: zod_1.z.string().optional(),
    orderId: zod_1.z.string().optional(),
    skuId: zod_1.z.string().optional(),
    productCode: zod_1.z.string().optional(),
    productName: zod_1.z.string().optional(),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string().optional(),
    quantity: zod_1.z.coerce.number().positive().optional(),
    targetQuantity: zod_1.z.coerce.number().positive().optional(),
    runRate: zod_1.z.coerce.number().default(500),
    changeoverMinutes: zod_1.z.coerce.number().default(30),
    cipRequired: zod_1.z.boolean().default(false),
});
exports.createPromotionCampaignSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    skuId: zod_1.z.string().min(1),
    upliftPercent: zod_1.z.coerce.number().min(0),
    incrementalUnits: zod_1.z.coerce.number().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    duration: zod_1.z.string().optional(),
    channel: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
});
exports.rescheduleApsScheduleSchema = zod_1.z.object({
    scheduleId: zod_1.z.string().optional(),
    lineId: zod_1.z.string(),
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string().optional(),
    reason: zod_1.z.string().optional(),
});
exports.splitApsScheduleSchema = zod_1.z.object({
    scheduleId: zod_1.z.string().optional(),
    splitCount: zod_1.z.coerce.number().min(2).default(2),
    notes: zod_1.z.string().optional(),
});
exports.optimizeApsScheduleSchema = zod_1.z.object({
    plantId: zod_1.z.string().optional(),
    horizon: zod_1.z.string().default("Week 36"),
    strategy: zod_1.z.string().default("MINIMIZE_CHANGEOVERS"),
});
exports.updateShipmentStatusSchema = zod_1.z.object({
    status: zod_1.z.string(),
});
exports.runMrpEngineSchema = zod_1.z.object({
    period: zod_1.z.string().default("Next 7 Days (W36 - W37)"),
    plantId: zod_1.z.string().optional(),
    productId: zod_1.z.string().default("ALL"),
});
exports.createPurchaseRequisitionSchema = zod_1.z.object({
    skuId: zod_1.z.string().optional(),
    skuCode: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
    quantity: zod_1.z.coerce.number().positive(),
    uom: zod_1.z.string().default("Units"),
    priority: zod_1.z.string().default("Expedite"),
    vendorName: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    plantId: zod_1.z.string().optional(),
});
exports.expediteShortageSchema = zod_1.z.object({
    skuId: zod_1.z.string().optional(),
    skuCode: zod_1.z.string().optional(),
    name: zod_1.z.string().optional(),
    expediteMode: zod_1.z.string().default("Air/Express Freight"),
    leadTimeReductionHours: zod_1.z.coerce.number().default(48),
    vendorName: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.updateSafetyStockPolicySchema = zod_1.z.object({
    skuId: zod_1.z.string().optional(),
    skuCode: zod_1.z.string().optional(),
    safetyStock: zod_1.z.coerce.number().positive(),
    serviceLevelTarget: zod_1.z.coerce.number().default(99.0),
    category: zod_1.z.string().optional(),
});
exports.mitigateServiceRiskSchema = zod_1.z.object({
    riskId: zod_1.z.string(),
    riskTitle: zod_1.z.string().optional(),
    actionProtocol: zod_1.z.string().optional(),
    authorizedBy: zod_1.z.string().default("Elena Rostova (Lead Planner)"),
    notes: zod_1.z.string().optional(),
});
exports.createScheduleVersionSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    reason: zod_1.z.string().optional(),
    createdBy: zod_1.z.string().default("Alexander Vance (Lead Scheduler)"),
    status: zod_1.z.string().default("Draft"),
});
exports.validateScheduleSchema = zod_1.z.object({
    scheduleId: zod_1.z.string().optional(),
    versionId: zod_1.z.string().optional(),
    horizon: zod_1.z.string().default("Week 36"),
});
exports.publishScheduleSchema = zod_1.z.object({
    versionId: zod_1.z.string().min(1, "Version ID is required"),
    publishedBy: zod_1.z.string().default("Alexander Vance (Lead Scheduler)"),
    notes: zod_1.z.string().optional(),
});
exports.createShipmentSchema = zod_1.z.object({
    destination: zod_1.z.string().min(1, "Destination is required"),
    orderRef: zod_1.z.string().optional(),
    carrier: zod_1.z.string().optional(),
    mode: zod_1.z.string().optional(),
    pallets: zod_1.z.coerce.number().default(20),
    units: zod_1.z.string().optional(),
    scheduledDate: zod_1.z.string().optional(),
    dockDoor: zod_1.z.string().optional(),
    status: zod_1.z.string().default("Booked"),
});
//# sourceMappingURL=planning.schema.js.map