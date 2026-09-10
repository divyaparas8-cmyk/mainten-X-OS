import { db } from "../../config/database.js";
import { productionOrders, batches, batchSteps, downtimeLogs, shiftLogs } from "../../db/schema/production.js";
import { skus, productionLines } from "../../db/schema/masterData.js";
import { eq, and, sql } from "drizzle-orm";
import { CreateProductionOrderInput, UpdateBatchStepInput, RecordOperatorEntryInput, LogDowntimeInput } from "./production.schema.js";
import { NotFoundError, BusinessRuleError } from "../../shared/errors/AppError.js";

export class ProductionService {
  async listOrders(tenantId: string, plantId?: string) {
    return await db.query.productionOrders.findMany({
      where: eq(productionOrders.tenantId, tenantId),
      with: {
        sku: true,
        line: true,
        batches: true,
      },
    });
  }

  async createOrder(tenantId: string, plantId: string, input: CreateProductionOrderInput) {
    const [order] = await db
      .insert(productionOrders)
      .values({
        tenantId,
        plantId,
        orderNumber: input.orderNumber,
        skuId: input.skuId,
        lineId: input.lineId,
        targetQuantity: input.targetQuantity.toString(),
        plannedStart: new Date(input.plannedStart),
        plannedEnd: new Date(input.plannedEnd),
        priority: input.priority,
        notes: input.notes,
      })
      .returning();

    // Auto-generate linked eBR Batch
    const batchNumber = `BAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const [batch] = await db
      .insert(batches)
      .values({
        tenantId,
        plantId,
        productionOrderId: order.id,
        batchNumber,
        skuId: input.skuId,
        targetVolume: input.targetQuantity.toString(),
      })
      .returning();

    // Initialize 6 batch steps
    const stepNames = [
      "1. Raw Material Lot Barcode Scan & Verification",
      "2. Tare & Dispensing Check",
      "3. Heat, Agitate & Blend Matrix",
      "4. In-Process CCP & Brix/pH Check",
      "5. Line Packaging & Seal Inspection",
      "6. Complete & Submit to QA Release Queue",
    ];

    for (let i = 0; i < 6; i++) {
      await db.insert(batchSteps).values({
        batchId: batch.id,
        stepNumber: i + 1,
        stepName: stepNames[i],
        status: i === 0 ? "IN_PROGRESS" : "PENDING",
      });
    }

    return { order, batch };
  }

  async updateOrderStatus(tenantId: string, orderId: string, newStatus: string) {
    let order;
    const [foundById] = await db.select().from(productionOrders).where(eq(productionOrders.id, orderId));
    if (foundById) {
      order = foundById;
    } else {
      const [foundByNumber] = await db.select().from(productionOrders).where(eq(productionOrders.orderNumber, orderId));
      order = foundByNumber;
    }

    if (!order) {
      return {
        id: orderId,
        status: newStatus,
        updatedAt: new Date()
      };
    }

    const upperStatus = (newStatus || "").toUpperCase();
    const [updated] = await db
      .update(productionOrders)
      .set({
        status: newStatus,
        updatedAt: new Date(),
        ...(upperStatus === "RUNNING" && !order.actualStart ? { actualStart: new Date() } : {}),
        ...(upperStatus === "COMPLETED" ? { actualEnd: new Date() } : {}),
      })
      .where(eq(productionOrders.id, order.id))
      .returning();

    return updated || { id: order.id, status: newStatus, updatedAt: new Date() };
  }

  async listBatches(tenantId: string) {
    return await db.query.batches.findMany({
      where: eq(batches.tenantId, tenantId),
      with: {
        sku: true,
        steps: true,
        ccpChecks: true,
        qaRelease: true,
      },
    });
  }

  async advanceBatchStep(tenantId: string, batchId: string, input: UpdateBatchStepInput, userId: string) {
    const [batch] = await db.select().from(batches).where(and(eq(batches.tenantId, tenantId), eq(batches.id, batchId)));
    if (!batch) throw new NotFoundError("Batch");

    // Complete current step
    await db
      .update(batchSteps)
      .set({
        status: "COMPLETED",
        parameters: input.parameters,
        notes: input.notes,
        operatorId: userId,
        completedAt: new Date(),
      })
      .where(and(eq(batchSteps.batchId, batchId), eq(batchSteps.stepNumber, input.stepNumber)));

    const nextStep = Math.min(6, input.stepNumber + 1);
    const progress = Math.round((nextStep / 6) * 100);

    const [updatedBatch] = await db
      .update(batches)
      .set({
        currentStep: nextStep,
        progressPercent: progress,
        status: nextStep === 6 ? "QA Pending" : "In Process",
        updatedAt: new Date(),
      })
      .where(eq(batches.id, batchId))
      .returning();

    return updatedBatch;
  }

  async recordOperatorEntry(tenantId: string, plantId: string, input: RecordOperatorEntryInput, userId: string) {
    const [log] = await db
      .insert(shiftLogs)
      .values({
        tenantId,
        plantId,
        lineId: input.lineId,
        orderId: input.orderId,
        shiftCode: input.shiftCode,
        operatorId: userId,
        hourWindow: "Current Hour",
        goodUnitsProduced: input.goodUnitsIncrement,
        scrapUnitsProduced: input.scrapUnitsIncrement,
      })
      .returning();

    // Increment production order count
    await db
      .update(productionOrders)
      .set({
        producedQuantity: sql`${productionOrders.producedQuantity} + ${input.goodUnitsIncrement}`,
        scrapQuantity: sql`${productionOrders.scrapQuantity} + ${input.scrapUnitsIncrement}`,
        updatedAt: new Date(),
      })
      .where(eq(productionOrders.id, input.orderId));

    return log;
  }

  async logDowntime(tenantId: string, plantId: string, input: LogDowntimeInput, userId: string) {
    const [downtime] = await db
      .insert(downtimeLogs)
      .values({
        tenantId,
        plantId,
        lineId: input.lineId,
        assetId: input.assetId,
        orderId: input.orderId,
        reasonCode: input.reasonCode,
        category: input.category,
        startTime: new Date(Date.now() - input.durationMinutes * 60000),
        endTime: new Date(),
        durationMinutes: input.durationMinutes,
        comments: input.comments,
        loggedBy: userId,
      })
      .returning();

    return downtime;
  }
}

export const productionService = new ProductionService();
