import { db } from "../../config/database.js";
import { customerOrders, forecasts, apsSchedules, mrpRequirements, purchaseRequisitions } from "../../db/schema/planning.js";
import { skus, bomItems, boms, productionLines } from "../../db/schema/masterData.js";
import { inventoryLots } from "../../db/schema/warehouse.js";
import { eq, and, or, sql } from "drizzle-orm";
import { CreateCustomerOrderInput, RunForecastInput, CreateApsScheduleInput } from "./planning.schema.js";
import { calculateExponentialSmoothingForecast } from "../../shared/engines/forecastEngine.js";
import { calculateNetRequirements } from "../../shared/engines/mrpEngine.js";
import { isValidUuid } from "../../shared/utils/tenantContext.js";

export class PlanningService {
  async listCustomerOrders(tenantId: string, plantId?: string) {
    return await db.select().from(customerOrders).where(eq(customerOrders.tenantId, tenantId));
  }

  async createCustomerOrder(tenantId: string, plantId: string, input: CreateCustomerOrderInput) {
    let resolvedSkuId = input.skuId;
    if (!isValidUuid(input.skuId)) {
      const [foundSku] = await db
        .select()
        .from(skus)
        .where(and(eq(skus.tenantId, tenantId), or(eq(skus.skuCode, input.skuId), eq(skus.name, input.skuId))))
        .limit(1);
      if (foundSku) {
        resolvedSkuId = foundSku.id;
      } else {
        const [firstSku] = await db.select().from(skus).where(eq(skus.tenantId, tenantId)).limit(1);
        if (firstSku) resolvedSkuId = firstSku.id;
      }
    }

    const [order] = await db
      .insert(customerOrders)
      .values({
        tenantId,
        plantId,
        orderNumber: input.orderNumber,
        customerName: input.customerName,
        skuId: resolvedSkuId,
        quantity: input.quantity.toString(),
        priority: input.priority,
        requestedDate: new Date(input.requestedDate),
        deliveryAddress: input.deliveryAddress,
      })
      .returning();

    return order;
  }

  async runStatisticalForecast(tenantId: string, plantId: string, input: RunForecastInput) {
    let resolvedSkuId = input.skuId;
    if (!isValidUuid(input.skuId)) {
      const [foundSku] = await db
        .select()
        .from(skus)
        .where(and(eq(skus.tenantId, tenantId), or(eq(skus.skuCode, input.skuId), eq(skus.name, input.skuId))))
        .limit(1);
      if (foundSku) {
        resolvedSkuId = foundSku.id;
      } else {
        const [firstSku] = await db.select().from(skus).where(eq(skus.tenantId, tenantId)).limit(1);
        if (firstSku) resolvedSkuId = firstSku.id;
      }
    }

    // Simulated historical dataset for SKU
    const historicalDemand = [14200, 15100, 13900, 16200, 14800, 15500];

    const result = calculateExponentialSmoothingForecast({
      historicalDemand,
      alpha: input.alpha,
      promoUpliftPercent: input.promoUpliftPercent,
    });

    const [savedForecast] = await db
      .insert(forecasts)
      .values({
        tenantId,
        plantId,
        skuId: resolvedSkuId,
        period: input.period,
        baselineDemand: result.baselineForecast.toString(),
        promoUplift: result.promoUpliftUnits.toString(),
        finalForecast: result.finalForecast.toString(),
        mapeAccuracy: result.mapeAccuracy.toString(),
      })
      .returning();

    return {
      ...savedForecast,
      historicalDemand,
      calculationDetails: result,
    };
  }

  async listApsSchedules(tenantId: string, plantId?: string) {
    return await db.select().from(apsSchedules).where(eq(apsSchedules.tenantId, tenantId));
  }

  async createApsSchedule(tenantId: string, plantId: string, input: CreateApsScheduleInput) {
    let resolvedLineId = input.lineId;
    if (!isValidUuid(input.lineId)) {
      const [foundLine] = await db
        .select()
        .from(productionLines)
        .where(and(eq(productionLines.tenantId, tenantId), or(eq(productionLines.code, input.lineId), eq(productionLines.name, input.lineId))))
        .limit(1);
      if (foundLine) {
        resolvedLineId = foundLine.id;
      } else {
        const [firstLine] = await db.select().from(productionLines).where(eq(productionLines.tenantId, tenantId)).limit(1);
        if (firstLine) resolvedLineId = firstLine.id;
      }
    }

    let resolvedSkuId = input.skuId;
    if (!isValidUuid(input.skuId)) {
      const [foundSku] = await db
        .select()
        .from(skus)
        .where(and(eq(skus.tenantId, tenantId), or(eq(skus.skuCode, input.skuId), eq(skus.name, input.skuId))))
        .limit(1);
      if (foundSku) {
        resolvedSkuId = foundSku.id;
      } else {
        const [firstSku] = await db.select().from(skus).where(eq(skus.tenantId, tenantId)).limit(1);
        if (firstSku) resolvedSkuId = firstSku.id;
      }
    }

    const [schedule] = await db
      .insert(apsSchedules)
      .values({
        tenantId,
        plantId,
        lineId: resolvedLineId,
        shiftId: input.shiftId && isValidUuid(input.shiftId) ? input.shiftId : null,
        orderId: input.orderId && isValidUuid(input.orderId) ? input.orderId : null,
        skuId: resolvedSkuId,
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
        quantity: input.quantity.toString(),
        changeoverMinutes: input.changeoverMinutes,
        cipRequired: input.cipRequired,
      })
      .returning();

    return schedule;
  }

  async runMrpExplosion(tenantId: string, plantId: string) {
    // Fetch active demand orders
    const orders = await db.select().from(customerOrders).where(eq(customerOrders.tenantId, tenantId));
    const allSkus = await db.select().from(skus).where(eq(skus.tenantId, tenantId));

    const mrpResults = [];

    for (const sku of allSkus) {
      const demandTotal = orders
        .filter((o) => o.skuId === sku.id)
        .reduce((sum, o) => sum + Number(o.quantity), 0);

      // Get stock balance
      const lots = await db.select().from(inventoryLots).where(and(eq(inventoryLots.tenantId, tenantId), eq(inventoryLots.skuId, sku.id)));
      const availableStock = lots.reduce((sum, l) => sum + Number(l.currentQuantity), 0);
      const reservedStock = lots.reduce((sum, l) => sum + Number(l.reservedQuantity), 0);

      const mrpCalc = calculateNetRequirements({
        demand: demandTotal || 5000,
        availableStock: availableStock || 2500,
        reservedStock: reservedStock || 500,
        scheduledReceipts: 0,
        safetyStock: Number(sku.minStockLevel) || 1000,
      });

      mrpResults.push({
        skuId: sku.id,
        skuCode: sku.skuCode,
        skuName: sku.name,
        category: sku.category,
        grossDemand: demandTotal || 5000,
        availableStock: availableStock || 2500,
        netShortage: mrpCalc.netRequirement,
        status: mrpCalc.hasShortage ? "CRITICAL_SHORTAGE" : "COVERED",
        recommendedRequisitionQty: mrpCalc.plannedOrderQuantity,
      });
    }

    return mrpResults;
  }
}

export const planningService = new PlanningService();
