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
            status: input.status ? input.status.toUpperCase() : "OPEN",
        })
            .returning();
        return order;
    }
    async updateCustomerOrder(tenantId, id, updates) {
        const updateValues = { updatedAt: new Date() };
        if (updates.customerName)
            updateValues.customerName = updates.customerName;
        if (updates.quantity)
            updateValues.quantity = updates.quantity.toString();
        if (updates.priority)
            updateValues.priority = updates.priority;
        if (updates.status)
            updateValues.status = updates.status.toUpperCase();
        if (updates.deliveryAddress !== undefined)
            updateValues.deliveryAddress = updates.deliveryAddress;
        if (updates.requestedDate)
            updateValues.requestedDate = new Date(updates.requestedDate);
        const isUuid = (0, tenantContext_js_1.isValidUuid)(id);
        const condition = isUuid
            ? (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(planning_js_1.customerOrders.tenantId, tenantId), (0, drizzle_orm_1.eq)(planning_js_1.customerOrders.id, id))
            : (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(planning_js_1.customerOrders.tenantId, tenantId), (0, drizzle_orm_1.eq)(planning_js_1.customerOrders.orderNumber, id));
        const [updated] = await database_js_1.db.update(planning_js_1.customerOrders).set(updateValues).where(condition).returning();
        return updated;
    }
    async deleteCustomerOrder(tenantId, id) {
        const isUuid = (0, tenantContext_js_1.isValidUuid)(id);
        const condition = isUuid
            ? (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(planning_js_1.customerOrders.tenantId, tenantId), (0, drizzle_orm_1.eq)(planning_js_1.customerOrders.id, id))
            : (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(planning_js_1.customerOrders.tenantId, tenantId), (0, drizzle_orm_1.eq)(planning_js_1.customerOrders.orderNumber, id));
        return await database_js_1.db.delete(planning_js_1.customerOrders).where(condition);
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
        // Simulated historical dataset for SKU
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
        // Fetch active demand orders
        const orders = await database_js_1.db.select().from(planning_js_1.customerOrders).where((0, drizzle_orm_1.eq)(planning_js_1.customerOrders.tenantId, tenantId));
        const allSkus = await database_js_1.db.select().from(masterData_js_1.skus).where((0, drizzle_orm_1.eq)(masterData_js_1.skus.tenantId, tenantId));
        const mrpResults = [];
        for (const sku of allSkus) {
            const demandTotal = orders
                .filter((o) => o.skuId === sku.id)
                .reduce((sum, o) => sum + Number(o.quantity), 0);
            // Get stock balance
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
}
exports.PlanningService = PlanningService;
exports.planningService = new PlanningService();
//# sourceMappingURL=planning.service.js.map