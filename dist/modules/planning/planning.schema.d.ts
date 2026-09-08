import { z } from "zod";
export declare const createCustomerOrderSchema: z.ZodObject<{
    orderNumber: z.ZodString;
    customerName: z.ZodString;
    skuId: z.ZodString;
    quantity: z.ZodNumber;
    priority: z.ZodEffects<z.ZodDefault<z.ZodEnum<["URGENT", "NORMAL", "LOW"]>>, "NORMAL" | "URGENT" | "LOW", unknown>;
    requestedDate: z.ZodString;
    deliveryAddress: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    skuId: string;
    quantity: number;
    orderNumber: string;
    customerName: string;
    priority: "NORMAL" | "URGENT" | "LOW";
    requestedDate: string;
    deliveryAddress?: string | undefined;
}, {
    skuId: string;
    quantity: number;
    orderNumber: string;
    customerName: string;
    requestedDate: string;
    priority?: unknown;
    deliveryAddress?: string | undefined;
}>;
export type CreateCustomerOrderInput = z.infer<typeof createCustomerOrderSchema>;
export declare const runForecastSchema: z.ZodObject<{
    skuId: z.ZodString;
    period: z.ZodDefault<z.ZodString>;
    alpha: z.ZodDefault<z.ZodNumber>;
    promoUpliftPercent: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    skuId: string;
    period: string;
    alpha: number;
    promoUpliftPercent: number;
}, {
    skuId: string;
    period?: string | undefined;
    alpha?: number | undefined;
    promoUpliftPercent?: number | undefined;
}>;
export type RunForecastInput = z.infer<typeof runForecastSchema>;
export declare const createApsScheduleSchema: z.ZodObject<{
    lineId: z.ZodString;
    shiftId: z.ZodOptional<z.ZodString>;
    orderId: z.ZodOptional<z.ZodString>;
    skuId: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    quantity: z.ZodNumber;
    changeoverMinutes: z.ZodDefault<z.ZodNumber>;
    cipRequired: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    skuId: string;
    quantity: number;
    startTime: string;
    endTime: string;
    lineId: string;
    changeoverMinutes: number;
    cipRequired: boolean;
    shiftId?: string | undefined;
    orderId?: string | undefined;
}, {
    skuId: string;
    quantity: number;
    startTime: string;
    endTime: string;
    lineId: string;
    shiftId?: string | undefined;
    orderId?: string | undefined;
    changeoverMinutes?: number | undefined;
    cipRequired?: boolean | undefined;
}>;
export type CreateApsScheduleInput = z.infer<typeof createApsScheduleSchema>;
//# sourceMappingURL=planning.schema.d.ts.map