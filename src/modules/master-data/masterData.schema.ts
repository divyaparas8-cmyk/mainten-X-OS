import { z } from "zod";

export const createSkuSchema = z.object({
  skuCode: z.string().min(2),
  name: z.string().min(2),
  category: z.enum(["FINISHED_GOODS", "RAW_MATERIAL", "PACKAGING"]),
  familyId: z.string().uuid().optional(),
  uom: z.string().default("Units"),
  barcode: z.string().optional(),
  standardCost: z.coerce.number().default(0),
  shelfLifeDays: z.coerce.number().default(365),
  minStockLevel: z.coerce.number().default(1000),
  maxStockLevel: z.coerce.number().default(50000),
});

export type CreateSkuInput = z.infer<typeof createSkuSchema>;

export const createBomSchema = z.object({
  skuId: z.string().uuid(),
  version: z.string().default("v1.0"),
  name: z.string().min(2),
  batchSize: z.coerce.number().default(10000),
  batchUom: z.string().default("Units"),
  yieldPercent: z.coerce.number().default(98.5),
  items: z.array(
    z.object({
      componentSkuId: z.string().uuid(),
      quantity: z.coerce.number().positive(),
      uom: z.string(),
      scrapPercentage: z.coerce.number().default(0),
      stage: z.string().default("MIXING"),
    })
  ),
});

export type CreateBomInput = z.infer<typeof createBomSchema>;

export const routingStepSchema = z.object({
  sequence: z.coerce.number().default(10),
  operationCode: z.string().min(1),
  operationName: z.string().min(1),
  workCenterId: z.string().uuid().optional().nullable(),
  stdDurationMin: z.coerce.number().default(15),
  setupDurationMin: z.coerce.number().default(10),
  crewSize: z.coerce.number().default(2),
  isQualityGate: z.boolean().default(false),
  instructions: z.string().optional().nullable(),
});

export const createRoutingSchema = z.object({
  routingCode: z.string().optional().nullable(),
  skuId: z.string().optional().nullable(),
  lineId: z.string().optional().nullable(),
  plantId: z.string().optional().nullable(),
  revision: z.string().default("R1"),
  approvalStatus: z.string().default("Approved"),
  status: z.string().default("Active"),
  stdRunRateBph: z.coerce.number().default(12000),
  setupDurationMin: z.coerce.number().default(45),
  expectedYieldPct: z.coerce.number().default(98.50),
  effectiveFrom: z.string().optional().nullable(),
  effectiveTo: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  steps: z.array(routingStepSchema).optional().default([]),
});

export const updateRoutingSchema = createRoutingSchema.partial();

export type CreateRoutingInput = z.infer<typeof createRoutingSchema>;
export type UpdateRoutingInput = z.infer<typeof updateRoutingSchema>;
export type RoutingStepInput = z.infer<typeof routingStepSchema>;

