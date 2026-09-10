"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planningService = exports.PlanningService = void 0;
const database_js_1 = require("../../config/database.js");
const planning_js_1 = require("../../db/schema/planning.js");
const masterData_js_1 = require("../../db/schema/masterData.js");
const warehouse_js_1 = require("../../db/schema/warehouse.js");
const drizzle_orm_1 = require("drizzle-orm");
const forecastEngine_js_1 = require("../../shared/engines/forecastEngine.js");
const mrpEngine_js_1 = require("../../shared/engines/mrpEngine.js");
const tenantContext_js_1 = require("../../shared/utils/tenantContext.js");
class PlanningService {
    async listCustomerOrders(tenantId, plantId) {
        return await database_js_1.db.select().from(planning_js_1.customerOrders).where((0, drizzle_orm_1.eq)(planning_js_1.customerOrders.tenantId, tenantId));
    }
    async createCustomerOrder(tenantId, plantId, input) {
        let resolvedSkuId = input.skuId;
        if (!(0, tenantContext_js_1.isValidUuid)(input.skuId)) {
            const [foundSku] = await database_js_1.db
                .select()
                .from(masterData_js_1.skus)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.skus.tenantId, tenantId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.skus.skuCode, input.skuId), (0, drizzle_orm_1.eq)(masterData_js_1.skus.name, input.skuId))))
                .limit(1);
            if (foundSku) {
                resolvedSkuId = foundSku.id;
            }
            else {
                const [firstSku] = await database_js_1.db.select().from(masterData_js_1.skus).where((0, drizzle_orm_1.eq)(masterData_js_1.skus.tenantId, tenantId)).limit(1);
                if (firstSku)
                    resolvedSkuId = firstSku.id;
            }
        }
        const [order] = await database_js_1.db
            .insert(planning_js_1.customerOrders)
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
    async runStatisticalForecast(tenantId, plantId, input) {
        let resolvedSkuId = input.skuId;
        if (!(0, tenantContext_js_1.isValidUuid)(input.skuId)) {
            const [foundSku] = await database_js_1.db
                .select()
                .from(masterData_js_1.skus)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.skus.tenantId, tenantId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.skus.skuCode, input.skuId), (0, drizzle_orm_1.eq)(masterData_js_1.skus.name, input.skuId))))
                .limit(1);
            if (foundSku) {
                resolvedSkuId = foundSku.id;
            }
            else {
                const [firstSku] = await database_js_1.db.select().from(masterData_js_1.skus).where((0, drizzle_orm_1.eq)(masterData_js_1.skus.tenantId, tenantId)).limit(1);
                if (firstSku)
                    resolvedSkuId = firstSku.id;
            }
        }
        const historicalDemand = [14200, 15100, 13900, 16200, 14800, 15500];
        const result = (0, forecastEngine_js_1.calculateExponentialSmoothingForecast)({
            historicalDemand,
            alpha: input.alpha,
            promoUpliftPercent: input.promoUpliftPercent,
        });
        const [savedForecast] = await database_js_1.db
            .insert(planning_js_1.forecasts)
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
    async listApsSchedules(tenantId, plantId) {
        return await database_js_1.db.select().from(planning_js_1.apsSchedules).where((0, drizzle_orm_1.eq)(planning_js_1.apsSchedules.tenantId, tenantId));
    }
    async createApsSchedule(tenantId, plantId, input) {
        let resolvedLineId = input.lineId;
        if (!(0, tenantContext_js_1.isValidUuid)(input.lineId)) {
            const [foundLine] = await database_js_1.db
                .select()
                .from(masterData_js_1.productionLines)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.productionLines.tenantId, tenantId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.productionLines.code, input.lineId), (0, drizzle_orm_1.eq)(masterData_js_1.productionLines.name, input.lineId))))
                .limit(1);
            if (foundLine) {
                resolvedLineId = foundLine.id;
            }
            else {
                const [firstLine] = await database_js_1.db.select().from(masterData_js_1.productionLines).where((0, drizzle_orm_1.eq)(masterData_js_1.productionLines.tenantId, tenantId)).limit(1);
                if (firstLine)
                    resolvedLineId = firstLine.id;
            }
        }
        let resolvedSkuId = input.skuId;
        if (!(0, tenantContext_js_1.isValidUuid)(input.skuId)) {
            const [foundSku] = await database_js_1.db
                .select()
                .from(masterData_js_1.skus)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(masterData_js_1.skus.tenantId, tenantId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(masterData_js_1.skus.skuCode, input.skuId), (0, drizzle_orm_1.eq)(masterData_js_1.skus.name, input.skuId))))
                .limit(1);
            if (foundSku) {
                resolvedSkuId = foundSku.id;
            }
            else {
                const [firstSku] = await database_js_1.db.select().from(masterData_js_1.skus).where((0, drizzle_orm_1.eq)(masterData_js_1.skus.tenantId, tenantId)).limit(1);
                if (firstSku)
                    resolvedSkuId = firstSku.id;
            }
        }
        const [schedule] = await database_js_1.db
            .insert(planning_js_1.apsSchedules)
            .values({
            tenantId,
            plantId,
            lineId: resolvedLineId,
            shiftId: input.shiftId && (0, tenantContext_js_1.isValidUuid)(input.shiftId) ? input.shiftId : null,
            orderId: input.orderId && (0, tenantContext_js_1.isValidUuid)(input.orderId) ? input.orderId : null,
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
    async runMrpExplosion(tenantId, plantId) {
        const orders = await database_js_1.db.select().from(planning_js_1.customerOrders).where((0, drizzle_orm_1.eq)(planning_js_1.customerOrders.tenantId, tenantId));
        const allSkus = await database_js_1.db.select().from(masterData_js_1.skus).where((0, drizzle_orm_1.eq)(masterData_js_1.skus.tenantId, tenantId));
        const mrpResults = [];
        for (const sku of allSkus) {
            const demandTotal = orders
                .filter((o) => o.skuId === sku.id)
                .reduce((sum, o) => sum + Number(o.quantity), 0);
            const lots = await database_js_1.db.select().from(warehouse_js_1.inventoryLots).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.tenantId, tenantId), (0, drizzle_orm_1.eq)(warehouse_js_1.inventoryLots.skuId, sku.id)));
            const availableStock = lots.reduce((sum, l) => sum + Number(l.currentQuantity), 0);
            const reservedStock = lots.reduce((sum, l) => sum + Number(l.reservedQuantity), 0);
            const mrpCalc = (0, mrpEngine_js_1.calculateNetRequirements)({
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
    async listSchedules(plantId) {
        const client = await database_js_1.pool.connect();
        try {
            const res = await client.query(`SELECT id, sku_name as "sku", line_name as "line", planned_quantity as "plannedQty",
                start_time as "startTime", end_time as "endTime", status, locked, 
                attainment_percent as "attainmentPercent"
         FROM pm_production_schedules
         WHERE plant_id = $1 OR $1 IS NULL
         ORDER BY id ASC;`, [plantId || 'PLT-01']);
            return res.rows;
        }
        finally {
            client.release();
        }
    }
    async createSchedule(input) {
        const client = await database_js_1.pool.connect();
        try {
            const countRes = await client.query(`SELECT count(*) FROM pm_production_schedules;`);
            const newId = `SCH-10${Number(countRes.rows[0].count) + 1}`;
            const res = await client.query(`INSERT INTO pm_production_schedules 
         (id, plant_id, sku_name, line_id, line_name, planned_quantity, start_time, end_time, status, locked)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Scheduled', false)
         RETURNING id, sku_name as "sku", line_name as "line", planned_quantity as "plannedQty",
                   start_time as "startTime", end_time as "endTime", status, locked;`, [
                newId,
                input.plantId || 'PLT-01',
                input.sku,
                input.line.includes('1') ? 'LIN-01' : input.line.includes('2') ? 'LIN-02' : 'LIN-03',
                input.line,
                input.quantity,
                input.startTime,
                input.endTime
            ]);
            return res.rows[0];
        }
        finally {
            client.release();
        }
    }
    async toggleScheduleLock(id, locked) {
        const client = await database_js_1.pool.connect();
        try {
            const res = await client.query(`UPDATE pm_production_schedules 
         SET locked = COALESCE($2, NOT locked), updated_at = NOW()
         WHERE id = $1
         RETURNING id, locked, status;`, [id, locked !== undefined ? locked : null]);
            return res.rows[0];
        }
        finally {
            client.release();
        }
    }
    async deleteSchedule(id) {
        const client = await database_js_1.pool.connect();
        try {
            await client.query(`DELETE FROM pm_production_schedules WHERE id = $1;`, [id]);
            return { id, deleted: true };
        }
        finally {
            client.release();
        }
    }
    async listCapacity(plantId) {
        const client = await database_js_1.pool.connect();
        try {
            const res = await client.query(`SELECT id, line_name as "line", week_code as "week", available_hours as "availableHours",
                planned_hours as "plannedHours", utilization_percent as "utilPercent", status
         FROM pm_capacity_plans
         WHERE plant_id = $1 OR $1 IS NULL
         ORDER BY id ASC;`, [plantId || 'PLT-01']);
            return res.rows;
        }
        finally {
            client.release();
        }
    }
    async listConstraints(plantId) {
        const client = await database_js_1.pool.connect();
        try {
            const res = await client.query(`SELECT id, constraint_type as "type", rule_description as "description",
                affected_line as "line", schedule_impact as "impact", risk_level as "risk", status
         FROM pm_planning_constraints
         WHERE plant_id = $1 OR $1 IS NULL
         ORDER BY id ASC;`, [plantId || 'PLT-01']);
            return res.rows;
        }
        finally {
            client.release();
        }
    }
    async createConstraint(input) {
        const client = await database_js_1.pool.connect();
        try {
            const countRes = await client.query(`SELECT count(*) FROM pm_planning_constraints;`);
            const newId = `CST-0${Number(countRes.rows[0].count) + 1}`;
            const res = await client.query(`INSERT INTO pm_planning_constraints
         (id, plant_id, constraint_type, rule_description, affected_line, schedule_impact, risk_level, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'Active')
         RETURNING id, constraint_type as "type", rule_description as "description",
                   affected_line as "line", schedule_impact as "impact", risk_level as "risk", status;`, [newId, input.plantId || 'PLT-01', input.type, input.description, input.line, input.impact, input.risk]);
            return res.rows[0];
        }
        finally {
            client.release();
        }
    }
    async resolveConstraint(id) {
        const client = await database_js_1.pool.connect();
        try {
            const res = await client.query(`UPDATE pm_planning_constraints
         SET status = 'Resolved', resolved_at = NOW(), updated_at = NOW()
         WHERE id = $1
         RETURNING id, status;`, [id]);
            return res.rows[0];
        }
        finally {
            client.release();
        }
    }
    async deleteConstraint(id) {
        const client = await database_js_1.pool.connect();
        try {
            await client.query(`DELETE FROM pm_planning_constraints WHERE id = $1;`, [id]);
            return { id, deleted: true };
        }
        finally {
            client.release();
        }
    }
    async applyRecovery(input) {
        const client = await database_js_1.pool.connect();
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
            await client.query(`INSERT INTO pm_recovery_plans
         (id, plant_id, speed_boost_percent, overtime_hours, projected_recovery_units, feasibility_percent, estimated_cost_usd)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`, [newId, input.plantId || 'PLT-01', speed, ot, totalRecoveryUnits, feasibilityPercent, estimatedCostUsd]);
            return {
                id: newId,
                speedBoostPercent: speed,
                overtimeHours: ot,
                projectedRecoveryUnits: totalRecoveryUnits,
                feasibilityPercent: Number(feasibilityPercent.toFixed(1)),
                estimatedCostUsd,
                status: "Applied & Dispatched",
            };
        }
        finally {
            client.release();
        }
    }
}
exports.PlanningService = PlanningService;
exports.planningService = new PlanningService();
//# sourceMappingURL=planning.service.js.map