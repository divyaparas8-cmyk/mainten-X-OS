import { z } from "zod";

export const createLotSchema = z.object({
  skuId: z.string().uuid(),
  lotNumber: z.string().min(2),
  lotType: z.enum(["RAW_MATERIAL", "PACKAGING", "FINISHED_GOOD"]),
  supplierName: z.string().optional(),
  supplierLotNumber: z.string().optional(),
  initialQuantity: z.coerce.number().positive(),
  uom: z.string().default("Units"),
  locationBinId: z.string().uuid().optional(),
  expiryDate: z.string().optional(),
});

export type CreateLotInput = z.infer<typeof createLotSchema>;

export const createTransactionSchema = z.object({
  lotId: z.string().uuid(),
  type: z.enum(["RECEIPT", "TRANSFER", "RESERVATION", "ISSUE", "CONSUMPTION", "ADJUSTMENT", "SHIPMENT"]),
  quantity: z.coerce.number(),
  uom: z.string().default("Units"),
  fromBinId: z.string().uuid().optional(),
  toBinId: z.string().uuid().optional(),
  referenceType: z.string().optional(),
  referenceId: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
