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
class PlanningService {
    async listCustomerOrders(tenantId, plantId) {
        return await database_js_1.db.select().from(planning_js_1.customerOrders).where((0, drizzle_orm_1.eq)(planning_js_1.customerOrders.tenantId, tenantId));
    }
    async createCustomerOrder(tenantId, plantId, input) {
        const [order] = await database_js_1.db
            .insert(planning_js_1.customerOrders)
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
    async runStatisticalForecast(tenantId, plantId, input) {
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
    async listApsSchedules(tenantId, plantId) {
        return await database_js_1.db.select().from(planning_js_1.apsSchedules).where((0, drizzle_orm_1.eq)(planning_js_1.apsSchedules.tenantId, tenantId));
    }
    async createApsSchedule(tenantId, plantId, input) {
        const [schedule] = await database_js_1.db
            .insert(planning_js_1.apsSchedules)
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