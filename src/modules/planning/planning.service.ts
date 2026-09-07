import { db } from "../../config/database.js";
import { customerOrders, forecasts, apsSchedules, mrpRequirements, purchaseRequisitions } from "../../db/schema/planning.js";
import { skus, bomItems, boms } from "../../db/schema/masterData.js";
import { inventoryLots } from "../../db/schema/warehouse.js";
import { eq, and, sql } from "drizzle-orm";
import { CreateCustomerOrderInput, RunForecastInput, CreateApsScheduleInput } from "./planning.schema.js";
import { calculateExponentialSmoothingForecast } from "../../shared/engines/forecastEngine.js";
import { calculateNetRequirements } from "../../shared/engines/mrpEngine.js";

export class PlanningService {
  async listCustomerOrders(tenantId: string, plantId?: string) {
    return await db.select().from(customerOrders).where(eq(customerOrders.tenantId, tenantId));
  }

  async createCustomerOrder(tenantId: string, plantId: string, input: CreateCustomerOrderInput) {
    const [order] = await db
      .insert(customerOrders)
      .values({
        tenantId,
        plantId,
        orderNumber: input.orderNumber,
        customerName: input.customerName,
        skuId: input.skuId,
        quantity: input.quantity.toString(),
        priority: input.priority,
        requestedDate: new Date(input.requestedDate),
        deliveryAddress: input.deliveryAddress,
      })
      .returning();

    return order;
  }

  async runStatisticalForecast(tenantId: string, plantId: string, input: RunForecastInput) {
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
        skuId: input.skuId,
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
    const [schedule] = await db
      .insert(apsSchedules)
      .values({
        tenantId,
        plantId,
        lineId: input.lineId,
        shiftId: input.shiftId,
        orderId: input.orderId,
        skuId: input.skuId,
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
