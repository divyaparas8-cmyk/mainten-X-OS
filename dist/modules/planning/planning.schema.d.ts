import { z } from "zod";
declare const customerOrderBaseSchema: z.ZodObject<{
    orderNumber: z.ZodOptional<z.ZodString>;
    customer: z.ZodOptional<z.ZodString>;
    customerName: z.ZodOptional<z.ZodString>;
    skuId: z.ZodOptional<z.ZodString>;
    productCode: z.ZodOptional<z.ZodString>;
    productName: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    uom: z.ZodOptional<z.ZodString>;
    priority: z.ZodEffects<z.ZodDefault<z.ZodEnum<["URGENT", "NORMAL", "LOW"]>>, "NORMAL" | "URGENT" | "LOW", unknown>;
    requestedDate: z.ZodOptional<z.ZodString>;
    requestedShipDate: z.ZodOptional<z.ZodString>;
    deliveryAddress: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    plantId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodDefault<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    priority: "NORMAL" | "URGENT" | "LOW";
    status?: string | undefined;
    plantId?: string | undefined;
    uom?: string | undefined;
    skuId?: string | undefined;
    notes?: string | undefined;
    orderNumber?: string | undefined;
    customerName?: string | undefined;
    requestedDate?: string | undefined;
    deliveryAddress?: string | undefined;
    customer?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    requestedShipDate?: string | undefined;
}, {
    quantity: number;
    status?: string | undefined;
    plantId?: string | undefined;
    uom?: string | undefined;
    skuId?: string | undefined;
    notes?: string | undefined;
    orderNumber?: string | undefined;
    customerName?: string | undefined;
    priority?: unknown;
    requestedDate?: string | undefined;
    deliveryAddress?: string | undefined;
    customer?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    requestedShipDate?: string | undefined;
}>;
export declare const createCustomerOrderSchema: z.ZodEffects<z.ZodObject<{
    orderNumber: z.ZodOptional<z.ZodString>;
    customer: z.ZodOptional<z.ZodString>;
    customerName: z.ZodOptional<z.ZodString>;
    skuId: z.ZodOptional<z.ZodString>;
    productCode: z.ZodOptional<z.ZodString>;
    productName: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    uom: z.ZodOptional<z.ZodString>;
    priority: z.ZodEffects<z.ZodDefault<z.ZodEnum<["URGENT", "NORMAL", "LOW"]>>, "NORMAL" | "URGENT" | "LOW", unknown>;
    requestedDate: z.ZodOptional<z.ZodString>;
    requestedShipDate: z.ZodOptional<z.ZodString>;
    deliveryAddress: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    plantId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodDefault<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    priority: "NORMAL" | "URGENT" | "LOW";
    status?: string | undefined;
    plantId?: string | undefined;
    uom?: string | undefined;
    skuId?: string | undefined;
    notes?: string | undefined;
    orderNumber?: string | undefined;
    customerName?: string | undefined;
    requestedDate?: string | undefined;
    deliveryAddress?: string | undefined;
    customer?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    requestedShipDate?: string | undefined;
}, {
    quantity: number;
    status?: string | undefined;
    plantId?: string | undefined;
    uom?: string | undefined;
    skuId?: string | undefined;
    notes?: string | undefined;
    orderNumber?: string | undefined;
    customerName?: string | undefined;
    priority?: unknown;
    requestedDate?: string | undefined;
    deliveryAddress?: string | undefined;
    customer?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    requestedShipDate?: string | undefined;
}>, {
    quantity: number;
    priority: "NORMAL" | "URGENT" | "LOW";
    status?: string | undefined;
    plantId?: string | undefined;
    uom?: string | undefined;
    skuId?: string | undefined;
    notes?: string | undefined;
    orderNumber?: string | undefined;
    customerName?: string | undefined;
    requestedDate?: string | undefined;
    deliveryAddress?: string | undefined;
    customer?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    requestedShipDate?: string | undefined;
}, {
    quantity: number;
    status?: string | undefined;
    plantId?: string | undefined;
    uom?: string | undefined;
    skuId?: string | undefined;
    notes?: string | undefined;
    orderNumber?: string | undefined;
    customerName?: string | undefined;
    priority?: unknown;
    requestedDate?: string | undefined;
    deliveryAddress?: string | undefined;
    customer?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    requestedShipDate?: string | undefined;
}>;
export type CreateCustomerOrderInput = z.infer<typeof customerOrderBaseSchema>;
export declare const updateCustomerOrderSchema: z.ZodObject<{
    orderNumber: z.ZodOptional<z.ZodString>;
    customer: z.ZodOptional<z.ZodString>;
    customerName: z.ZodOptional<z.ZodString>;
    skuId: z.ZodOptional<z.ZodString>;
    productCode: z.ZodOptional<z.ZodString>;
    productName: z.ZodOptional<z.ZodString>;
    quantity: z.ZodOptional<z.ZodNumber>;
    uom: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodString>;
    requestedDate: z.ZodOptional<z.ZodString>;
    requestedShipDate: z.ZodOptional<z.ZodString>;
    deliveryAddress: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    plantId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: string | undefined;
    plantId?: string | undefined;
    uom?: string | undefined;
    skuId?: string | undefined;
    quantity?: number | undefined;
    notes?: string | undefined;
    orderNumber?: string | undefined;
    customerName?: string | undefined;
    priority?: string | undefined;
    requestedDate?: string | undefined;
    deliveryAddress?: string | undefined;
    customer?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    requestedShipDate?: string | undefined;
}, {
    status?: string | undefined;
    plantId?: string | undefined;
    uom?: string | undefined;
    skuId?: string | undefined;
    quantity?: number | undefined;
    notes?: string | undefined;
    orderNumber?: string | undefined;
    customerName?: string | undefined;
    priority?: string | undefined;
    requestedDate?: string | undefined;
    deliveryAddress?: string | undefined;
    customer?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    requestedShipDate?: string | undefined;
}>;
export type UpdateCustomerOrderInput = z.infer<typeof updateCustomerOrderSchema>;
export declare const createForecastSchema: z.ZodObject<{
    period: z.ZodDefault<z.ZodString>;
    skuId: z.ZodOptional<z.ZodString>;
    productCode: z.ZodOptional<z.ZodString>;
    productName: z.ZodOptional<z.ZodString>;
    historicalDemand: z.ZodOptional<z.ZodNumber>;
    baselineForecast: z.ZodOptional<z.ZodNumber>;
    baselineDemand: z.ZodOptional<z.ZodNumber>;
    overrideQuantity: z.ZodDefault<z.ZodNumber>;
    finalForecast: z.ZodOptional<z.ZodNumber>;
    method: z.ZodOptional<z.ZodString>;
    modelType: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
    owner: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodString>;
    plantId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    period: string;
    overrideQuantity: number;
    method?: string | undefined;
    plantId?: string | undefined;
    skuId?: string | undefined;
    baselineDemand?: number | undefined;
    finalForecast?: number | undefined;
    modelType?: string | undefined;
    reason?: string | undefined;
    owner?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    historicalDemand?: number | undefined;
    baselineForecast?: number | undefined;
}, {
    status?: string | undefined;
    method?: string | undefined;
    plantId?: string | undefined;
    skuId?: string | undefined;
    period?: string | undefined;
    baselineDemand?: number | undefined;
    overrideQuantity?: number | undefined;
    finalForecast?: number | undefined;
    modelType?: string | undefined;
    reason?: string | undefined;
    owner?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    historicalDemand?: number | undefined;
    baselineForecast?: number | undefined;
}>;
export type CreateForecastInput = z.infer<typeof createForecastSchema>;
export declare const updateForecastSchema: z.ZodObject<{
    period: z.ZodOptional<z.ZodString>;
    skuId: z.ZodOptional<z.ZodString>;
    baselineForecast: z.ZodOptional<z.ZodNumber>;
    baselineDemand: z.ZodOptional<z.ZodNumber>;
    overrideQuantity: z.ZodOptional<z.ZodNumber>;
    finalForecast: z.ZodOptional<z.ZodNumber>;
    method: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
    owner: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: string | undefined;
    method?: string | undefined;
    skuId?: string | undefined;
    period?: string | undefined;
    baselineDemand?: number | undefined;
    overrideQuantity?: number | undefined;
    finalForecast?: number | undefined;
    reason?: string | undefined;
    owner?: string | undefined;
    baselineForecast?: number | undefined;
}, {
    status?: string | undefined;
    method?: string | undefined;
    skuId?: string | undefined;
    period?: string | undefined;
    baselineDemand?: number | undefined;
    overrideQuantity?: number | undefined;
    finalForecast?: number | undefined;
    reason?: string | undefined;
    owner?: string | undefined;
    baselineForecast?: number | undefined;
}>;
export type UpdateForecastInput = z.infer<typeof updateForecastSchema>;
export declare const runForecastSchema: z.ZodObject<{
    skuId: z.ZodOptional<z.ZodString>;
    period: z.ZodDefault<z.ZodString>;
    alpha: z.ZodDefault<z.ZodNumber>;
    promoUpliftPercent: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    period: string;
    alpha: number;
    promoUpliftPercent: number;
    skuId?: string | undefined;
}, {
    skuId?: string | undefined;
    period?: string | undefined;
    alpha?: number | undefined;
    promoUpliftPercent?: number | undefined;
}>;
export type RunForecastInput = z.infer<typeof runForecastSchema>;
export declare const createPromotionSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    skuId: z.ZodOptional<z.ZodString>;
    productCode: z.ZodOptional<z.ZodString>;
    productName: z.ZodOptional<z.ZodString>;
    upliftPercent: z.ZodDefault<z.ZodNumber>;
    projectedUnits: z.ZodDefault<z.ZodNumber>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    channel: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    upliftPercent: number;
    projectedUnits: number;
    title?: string | undefined;
    name?: string | undefined;
    skuId?: string | undefined;
    startDate?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    endDate?: string | undefined;
    channel?: string | undefined;
}, {
    status?: string | undefined;
    title?: string | undefined;
    name?: string | undefined;
    skuId?: string | undefined;
    startDate?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    upliftPercent?: number | undefined;
    projectedUnits?: number | undefined;
    endDate?: string | undefined;
    channel?: string | undefined;
}>;
export type CreatePromotionInput = z.infer<typeof createPromotionSchema>;
export declare const updatePromotionSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    upliftPercent: z.ZodOptional<z.ZodNumber>;
    projectedUnits: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status?: string | undefined;
    title?: string | undefined;
    upliftPercent?: number | undefined;
    projectedUnits?: number | undefined;
}, {
    status?: string | undefined;
    title?: string | undefined;
    upliftPercent?: number | undefined;
    projectedUnits?: number | undefined;
}>;
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>;
export declare const createApsScheduleSchema: z.ZodObject<{
    scheduleId: z.ZodOptional<z.ZodString>;
    orderNumber: z.ZodOptional<z.ZodString>;
    productionOrderId: z.ZodOptional<z.ZodString>;
    lineId: z.ZodOptional<z.ZodString>;
    shiftId: z.ZodOptional<z.ZodString>;
    orderId: z.ZodOptional<z.ZodString>;
    skuId: z.ZodOptional<z.ZodString>;
    productCode: z.ZodOptional<z.ZodString>;
    productName: z.ZodOptional<z.ZodString>;
    startTime: z.ZodString;
    endTime: z.ZodOptional<z.ZodString>;
    quantity: z.ZodOptional<z.ZodNumber>;
    targetQuantity: z.ZodOptional<z.ZodNumber>;
    runRate: z.ZodDefault<z.ZodNumber>;
    changeoverMinutes: z.ZodDefault<z.ZodNumber>;
    cipRequired: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    startTime: string;
    changeoverMinutes: number;
    cipRequired: boolean;
    runRate: number;
    skuId?: string | undefined;
    quantity?: number | undefined;
    endTime?: string | undefined;
    lineId?: string | undefined;
    orderNumber?: string | undefined;
    shiftId?: string | undefined;
    orderId?: string | undefined;
    targetQuantity?: number | undefined;
    productionOrderId?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    scheduleId?: string | undefined;
}, {
    startTime: string;
    skuId?: string | undefined;
    quantity?: number | undefined;
    endTime?: string | undefined;
    lineId?: string | undefined;
    orderNumber?: string | undefined;
    shiftId?: string | undefined;
    orderId?: string | undefined;
    changeoverMinutes?: number | undefined;
    cipRequired?: boolean | undefined;
    targetQuantity?: number | undefined;
    productionOrderId?: string | undefined;
    productCode?: string | undefined;
    productName?: string | undefined;
    scheduleId?: string | undefined;
    runRate?: number | undefined;
}>;
export type CreateApsScheduleInput = z.infer<typeof createApsScheduleSchema>;
export declare const rescheduleApsScheduleSchema: z.ZodObject<{
    scheduleId: z.ZodOptional<z.ZodString>;
    lineId: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startTime: string;
    lineId: string;
    endTime?: string | undefined;
    reason?: string | undefined;
    scheduleId?: string | undefined;
}, {
    startTime: string;
    lineId: string;
    endTime?: string | undefined;
    reason?: string | undefined;
    scheduleId?: string | undefined;
}>;
export type RescheduleApsScheduleInput = z.infer<typeof rescheduleApsScheduleSchema>;
export declare const splitApsScheduleSchema: z.ZodObject<{
    scheduleId: z.ZodOptional<z.ZodString>;
    splitCount: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    splitCount: number;
    notes?: string | undefined;
    scheduleId?: string | undefined;
}, {
    notes?: string | undefined;
    scheduleId?: string | undefined;
    splitCount?: number | undefined;
}>;
export type SplitApsScheduleInput = z.infer<typeof splitApsScheduleSchema>;
export declare const optimizeApsScheduleSchema: z.ZodObject<{
    plantId: z.ZodOptional<z.ZodString>;
    horizon: z.ZodDefault<z.ZodString>;
    strategy: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    horizon: string;
    strategy: string;
    plantId?: string | undefined;
}, {
    plantId?: string | undefined;
    horizon?: string | undefined;
    strategy?: string | undefined;
}>;
export type OptimizeApsScheduleInput = z.infer<typeof optimizeApsScheduleSchema>;
export declare const updateShipmentStatusSchema: z.ZodObject<{
    status: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: string;
}, {
    status: string;
}>;
export type UpdateShipmentStatusInput = z.infer<typeof updateShipmentStatusSchema>;
export declare const runMrpEngineSchema: z.ZodObject<{
    period: z.ZodDefault<z.ZodString>;
    plantId: z.ZodOptional<z.ZodString>;
    productId: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    period: string;
    productId: string;
    plantId?: string | undefined;
}, {
    plantId?: string | undefined;
    period?: string | undefined;
    productId?: string | undefined;
}>;
export type RunMrpEngineInput = z.infer<typeof runMrpEngineSchema>;
export declare const createPurchaseRequisitionSchema: z.ZodObject<{
    skuId: z.ZodOptional<z.ZodString>;
    skuCode: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    uom: z.ZodDefault<z.ZodString>;
    priority: z.ZodDefault<z.ZodString>;
    vendorName: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    plantId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    uom: string;
    quantity: number;
    priority: string;
    name?: string | undefined;
    plantId?: string | undefined;
    skuCode?: string | undefined;
    skuId?: string | undefined;
    notes?: string | undefined;
    vendorName?: string | undefined;
}, {
    quantity: number;
    name?: string | undefined;
    plantId?: string | undefined;
    skuCode?: string | undefined;
    uom?: string | undefined;
    skuId?: string | undefined;
    notes?: string | undefined;
    priority?: string | undefined;
    vendorName?: string | undefined;
}>;
export type CreatePurchaseRequisitionInput = z.infer<typeof createPurchaseRequisitionSchema>;
export declare const expediteShortageSchema: z.ZodObject<{
    skuId: z.ZodOptional<z.ZodString>;
    skuCode: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    expediteMode: z.ZodDefault<z.ZodString>;
    leadTimeReductionHours: z.ZodDefault<z.ZodNumber>;
    vendorName: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    expediteMode: string;
    leadTimeReductionHours: number;
    name?: string | undefined;
    skuCode?: string | undefined;
    skuId?: string | undefined;
    notes?: string | undefined;
    vendorName?: string | undefined;
}, {
    name?: string | undefined;
    skuCode?: string | undefined;
    skuId?: string | undefined;
    notes?: string | undefined;
    vendorName?: string | undefined;
    expediteMode?: string | undefined;
    leadTimeReductionHours?: number | undefined;
}>;
export type ExpediteShortageInput = z.infer<typeof expediteShortageSchema>;
export declare const updateSafetyStockPolicySchema: z.ZodObject<{
    skuId: z.ZodOptional<z.ZodString>;
    skuCode: z.ZodOptional<z.ZodString>;
    safetyStock: z.ZodNumber;
    serviceLevelTarget: z.ZodDefault<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    safetyStock: number;
    serviceLevelTarget: number;
    skuCode?: string | undefined;
    category?: string | undefined;
    skuId?: string | undefined;
}, {
    safetyStock: number;
    skuCode?: string | undefined;
    category?: string | undefined;
    skuId?: string | undefined;
    serviceLevelTarget?: number | undefined;
}>;
export type UpdateSafetyStockPolicyInput = z.infer<typeof updateSafetyStockPolicySchema>;
export declare const mitigateServiceRiskSchema: z.ZodObject<{
    riskId: z.ZodString;
    riskTitle: z.ZodOptional<z.ZodString>;
    actionProtocol: z.ZodOptional<z.ZodString>;
    authorizedBy: z.ZodDefault<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    riskId: string;
    authorizedBy: string;
    notes?: string | undefined;
    riskTitle?: string | undefined;
    actionProtocol?: string | undefined;
}, {
    riskId: string;
    notes?: string | undefined;
    riskTitle?: string | undefined;
    actionProtocol?: string | undefined;
    authorizedBy?: string | undefined;
}>;
export type MitigateServiceRiskInput = z.infer<typeof mitigateServiceRiskSchema>;
export declare const createScheduleVersionSchema: z.ZodObject<{
    title: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodDefault<z.ZodString>;
    status: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    title: string;
    createdBy: string;
    reason?: string | undefined;
}, {
    title: string;
    status?: string | undefined;
    reason?: string | undefined;
    createdBy?: string | undefined;
}>;
export type CreateScheduleVersionInput = z.infer<typeof createScheduleVersionSchema>;
export declare const validateScheduleSchema: z.ZodObject<{
    scheduleId: z.ZodOptional<z.ZodString>;
    versionId: z.ZodOptional<z.ZodString>;
    horizon: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    horizon: string;
    scheduleId?: string | undefined;
    versionId?: string | undefined;
}, {
    scheduleId?: string | undefined;
    horizon?: string | undefined;
    versionId?: string | undefined;
}>;
export type ValidateScheduleInput = z.infer<typeof validateScheduleSchema>;
export declare const publishScheduleSchema: z.ZodObject<{
    versionId: z.ZodString;
    publishedBy: z.ZodDefault<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    versionId: string;
    publishedBy: string;
    notes?: string | undefined;
}, {
    versionId: string;
    notes?: string | undefined;
    publishedBy?: string | undefined;
}>;
export type PublishScheduleInput = z.infer<typeof publishScheduleSchema>;
export declare const createShipmentSchema: z.ZodObject<{
    destination: z.ZodString;
    orderRef: z.ZodOptional<z.ZodString>;
    carrier: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodString>;
    pallets: z.ZodDefault<z.ZodNumber>;
    units: z.ZodOptional<z.ZodString>;
    scheduledDate: z.ZodOptional<z.ZodString>;
    dockDoor: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    destination: string;
    pallets: number;
    mode?: string | undefined;
    scheduledDate?: string | undefined;
    carrier?: string | undefined;
    orderRef?: string | undefined;
    units?: string | undefined;
    dockDoor?: string | undefined;
}, {
    destination: string;
    status?: string | undefined;
    mode?: string | undefined;
    scheduledDate?: string | undefined;
    carrier?: string | undefined;
    orderRef?: string | undefined;
    pallets?: number | undefined;
    units?: string | undefined;
    dockDoor?: string | undefined;
}>;
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export {};
//# sourceMappingURL=planning.schema.d.ts.map