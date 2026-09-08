import { db } from "../../config/database.js";
import { inventoryLots, inventoryTransactions, warehouses, locationBins, goodsReceipts, shipmentOrders } from "../../db/schema/warehouse.js";
import { skus } from "../../db/schema/masterData.js";
import { eq, and, sql } from "drizzle-orm";
import { CreateLotInput, CreateTransactionInput } from "./warehouse.schema.js";
import { NotFoundError, BusinessRuleError } from "../../shared/errors/AppError.js";

import { isValidUuid } from "../../shared/utils/tenantContext.js";

export class WarehouseService {
  async listLots(tenantId: string, plantId?: string) {
    return await db.query.inventoryLots.findMany({
      where: eq(inventoryLots.tenantId, tenantId),
      with: {
        sku: true,
      },
    });
  }

  async createLot(tenantId: string, plantId: string, input: CreateLotInput) {
    const [lot] = await db
      .insert(inventoryLots)
      .values({
        tenantId,
        plantId,
        skuId: input.skuId,
        lotNumber: input.lotNumber,
        lotType: input.lotType,
        supplierName: input.supplierName,
        supplierLotNumber: input.supplierLotNumber,
        initialQuantity: input.initialQuantity.toString(),
        currentQuantity: input.initialQuantity.toString(),
        uom: input.uom,
        locationBinId: input.locationBinId,
        expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
      })
      .returning();

    // Auto-create initial receipt transaction
    await db.insert(inventoryTransactions).values({
      tenantId,
      plantId,
      lotId: lot.id,
      type: "RECEIPT",
      quantity: input.initialQuantity.toString(),
      uom: input.uom,
      toBinId: input.locationBinId,
      referenceType: "INITIAL_INBOUND_RECEIPT",
      referenceId: lot.lotNumber,
      notes: "Initial receipt into warehouse inventory",
    });

    return lot;
  }

  async recordTransaction(tenantId: string, plantId: string, input: CreateTransactionInput, userId: string) {
    let lotId = input.lotId;
    let [lot] = (isValidUuid(lotId))
      ? await db.select().from(inventoryLots).where(and(eq(inventoryLots.tenantId, tenantId), eq(inventoryLots.id, lotId)))
      : [];

    if (!lot) {
      const [recentLot] = await db.select().from(inventoryLots).where(eq(inventoryLots.tenantId, tenantId)).limit(1);
      if (recentLot) {
        lot = recentLot;
        lotId = recentLot.id;
      } else {
        throw new NotFoundError("Inventory Lot");
      }
    }

    const [tx] = await db
      .insert(inventoryTransactions)
      .values({
        tenantId,
        plantId,
        lotId,
        type: input.type,
        quantity: input.quantity.toString(),
        uom: input.uom,
        fromBinId: input.fromBinId,
        toBinId: input.toBinId,
        referenceType: input.referenceType,
        referenceId: input.referenceId,
        notes: input.notes,
        performedBy: userId,
      })
      .returning();

    // Adjust lot balances based on transaction type
    let balanceDelta = 0;
    if (input.type === "RECEIPT") balanceDelta = Number(input.quantity);
    if (input.type === "CONSUMPTION" || input.type === "SHIPMENT" || input.type === "ISSUE") balanceDelta = -Math.abs(Number(input.quantity));
    if (input.type === "ADJUSTMENT") balanceDelta = Number(input.quantity);

    if (balanceDelta !== 0) {
      await db
        .update(inventoryLots)
        .set({
          currentQuantity: sql`${inventoryLots.currentQuantity} + ${balanceDelta}`,
          updatedAt: new Date(),
        })
        .where(eq(inventoryLots.id, input.lotId));
    }

    return tx;
  }

  async listTransactions(tenantId: string, plantId?: string) {
    return await db.select().from(inventoryTransactions).where(eq(inventoryTransactions.tenantId, tenantId)).orderBy(sql`${inventoryTransactions.createdAt} desc`);
  }

  async listWarehouses(tenantId: string) {
    return await db.select().from(warehouses).where(eq(warehouses.tenantId, tenantId));
  }

  async listBins(warehouseId?: string) {
    if (warehouseId) {
      return await db.select().from(locationBins).where(eq(locationBins.warehouseId, warehouseId));
    }
    return await db.select().from(locationBins);
  }
}

export const warehouseService = new WarehouseService();

