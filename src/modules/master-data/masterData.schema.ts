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
