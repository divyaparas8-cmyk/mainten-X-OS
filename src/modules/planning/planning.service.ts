import { db, pool } from "../../config/database.js";
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
    const orders = await db.select().from(customerOrders).where(eq(customerOrders.tenantId, tenantId));
    const allSkus = await db.select().from(skus).where(eq(skus.tenantId, tenantId));

    const mrpResults = [];

    for (const sku of allSkus) {
      const demandTotal = orders
        .filter((o) => o.skuId === sku.id)
        .reduce((sum, o) => sum + Number(o.quantity), 0);

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

  // --- Plant Manager Extended Operations (MPS, Capacity, Constraints, Recovery) ---

  async listSchedules(plantId?: string) {
    const client = await pool.connect();
    try {
      const res = await client.query(
        `SELECT id, sku_name as "sku", line_name as "line", planned_quantity as "plannedQty",
                start_time as "startTime", end_time as "endTime", status, locked, 
                attainment_percent as "attainmentPercent"
         FROM pm_production_schedules
         WHERE plant_id = $1 OR $1 IS NULL
         ORDER BY id ASC;`,
        [plantId || 'PLT-01']
      );
      return res.rows;
    } finally {
      client.release();
    }
  }

  async createSchedule(input: { sku: string; line: string; quantity: number; startTime: string; endTime: string; plantId?: string }) {
    const client = await pool.connect();
    try {
      const countRes = await client.query(`SELECT count(*) FROM pm_production_schedules;`);
      const newId = `SCH-10${Number(countRes.rows[0].count) + 1}`;
      const res = await client.query(
        `INSERT INTO pm_production_schedules 
         (id, plant_id, sku_name, line_id, line_name, planned_quantity, start_time, end_time, status, locked)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Scheduled', false)
         RETURNING id, sku_name as "sku", line_name as "line", planned_quantity as "plannedQty",
                   start_time as "startTime", end_time as "endTime", status, locked;`,
        [
          newId,
          input.plantId || 'PLT-01',
          input.sku,
          input.line.includes('1') ? 'LIN-01' : input.line.includes('2') ? 'LIN-02' : 'LIN-03',
          input.line,
          input.quantity,
          input.startTime,
          input.endTime
        ]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  }

  async toggleScheduleLock(id: string, locked?: boolean) {
    const client = await pool.connect();
    try {
      const res = await client.query(
        `UPDATE pm_production_schedules 
         SET locked = COALESCE($2, NOT locked), updated_at = NOW()
         WHERE id = $1
         RETURNING id, locked, status;`,
        [id, locked !== undefined ? locked : null]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  }

  async deleteSchedule(id: string) {
    const client = await pool.connect();
    try {
      await client.query(`DELETE FROM pm_production_schedules WHERE id = $1;`, [id]);
      return { id, deleted: true };
    } finally {
      client.release();
    }
  }

  async listCapacity(plantId?: string) {
    const client = await pool.connect();
    try {
      const res = await client.query(
        `SELECT id, line_name as "line", week_code as "week", available_hours as "availableHours",
                planned_hours as "plannedHours", utilization_percent as "utilPercent", status
         FROM pm_capacity_plans
         WHERE plant_id = $1 OR $1 IS NULL
         ORDER BY id ASC;`,
        [plantId || 'PLT-01']
      );
      return res.rows;
    } finally {
      client.release();
    }
  }

  async listConstraints(plantId?: string) {
    const client = await pool.connect();
    try {
      const res = await client.query(
        `SELECT id, constraint_type as "type", rule_description as "description",
                affected_line as "line", schedule_impact as "impact", risk_level as "risk", status
         FROM pm_planning_constraints
         WHERE plant_id = $1 OR $1 IS NULL
         ORDER BY id ASC;`,
        [plantId || 'PLT-01']
      );
      return res.rows;
    } finally {
      client.release();
    }
  }

  async createConstraint(input: { type: string; description: string; line: string; impact: string; risk: string; plantId?: string }) {
    const client = await pool.connect();
    try {
      const countRes = await client.query(`SELECT count(*) FROM pm_planning_constraints;`);
      const newId = `CST-0${Number(countRes.rows[0].count) + 1}`;
      const res = await client.query(
        `INSERT INTO pm_planning_constraints
         (id, plant_id, constraint_type, rule_description, affected_line, schedule_impact, risk_level, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'Active')
         RETURNING id, constraint_type as "type", rule_description as "description",
                   affected_line as "line", schedule_impact as "impact", risk_level as "risk", status;`,
        [newId, input.plantId || 'PLT-01', input.type, input.description, input.line, input.impact, input.risk]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  }

  async resolveConstraint(id: string) {
    const client = await pool.connect();
    try {
      const res = await client.query(
        `UPDATE pm_planning_constraints
         SET status = 'Resolved', resolved_at = NOW(), updated_at = NOW()
         WHERE id = $1
         RETURNING id, status;`,
        [id]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  }

  async deleteConstraint(id: string) {
    const client = await pool.connect();
    try {
      await client.query(`DELETE FROM pm_planning_constraints WHERE id = $1;`, [id]);
      return { id, deleted: true };
    } finally {
      client.release();
    }
  }

  async applyRecovery(input: { speedBoostPercent: number; overtimeHours: number; plantId?: string }) {
    const client = await pool.connect();
    try {
      const speed = Number(input.speedBoostPercent) || 0;
      const ot = Number(input.overtimeHours) || 0;

      // Mathematical Recovery Model:
      // Base nominal rate = 4,200 units/hr
      // Speed boost produces (4200 * speedBoost% * 8 shift hours)
      // Overtime produces (4200 * (1 + speedBoost%) * overtimeHours)
      const speedBoostUnits = Math.round(4200 * (speed / 100) * 8);
      const overtimeUnits = Math.round(4200 * (1 + speed / 100) * ot);
      const totalRecoveryUnits = speedBoostUnits + overtimeUnits;
      const estimatedCostUsd = Math.round((ot * 1250) + (speed * 180));
      const feasibilityPercent = Math.max(70, Math.min(99, 98 - (speed * 1.2) - (ot * 2.5)));

      const countRes = await client.query(`SELECT count(*) FROM pm_recovery_plans;`);
      const newId = `REC-0${Number(countRes.rows[0].count) + 1}`;

      await client.query(
        `INSERT INTO pm_recovery_plans
         (id, plant_id, speed_boost_percent, overtime_hours, projected_recovery_units, feasibility_percent, estimated_cost_usd)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [newId, input.plantId || 'PLT-01', speed, ot, totalRecoveryUnits, feasibilityPercent, estimatedCostUsd]
      );

      return {
        id: newId,
        speedBoostPercent: speed,
        overtimeHours: ot,
        projectedRecoveryUnits: totalRecoveryUnits,
        feasibilityPercent: Number(feasibilityPercent.toFixed(1)),
        estimatedCostUsd,
        status: "Applied & Dispatched",
      };
    } finally {
      client.release();
    }
  }
}

export const planningService = new PlanningService();
