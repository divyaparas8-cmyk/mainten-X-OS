"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionService = exports.ProductionService = void 0;
const database_js_1 = require("../../config/database.js");
const production_js_1 = require("../../db/schema/production.js");
const drizzle_orm_1 = require("drizzle-orm");
const AppError_js_1 = require("../../shared/errors/AppError.js");
class ProductionService {
    async listOrders(tenantId, plantId) {
        return await database_js_1.db.query.productionOrders.findMany({
            where: (0, drizzle_orm_1.eq)(production_js_1.productionOrders.tenantId, tenantId),
            with: {
                sku: true,
                line: true,
                batches: true,
            },
        });
    }
    async createOrder(tenantId, plantId, input) {
        const [order] = await database_js_1.db
            .insert(production_js_1.productionOrders)
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
        const [batch] = await database_js_1.db
            .insert(production_js_1.batches)
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
            await database_js_1.db.insert(production_js_1.batchSteps).values({
                batchId: batch.id,
                stepNumber: i + 1,
                stepName: stepNames[i],
                status: i === 0 ? "IN_PROGRESS" : "PENDING",
            });
        }
        return { order, batch };
    }
    async updateOrderStatus(tenantId, orderId, newStatus) {
        let order;
        const [foundById] = await database_js_1.db.select().from(production_js_1.productionOrders).where((0, drizzle_orm_1.eq)(production_js_1.productionOrders.id, orderId));
        if (foundById) {
            order = foundById;
        }
        else {
            const [foundByNumber] = await database_js_1.db.select().from(production_js_1.productionOrders).where((0, drizzle_orm_1.eq)(production_js_1.productionOrders.orderNumber, orderId));
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
        const [updated] = await database_js_1.db
            .update(production_js_1.productionOrders)
            .set({
            status: newStatus,
            updatedAt: new Date(),
            ...(upperStatus === "RUNNING" && !order.actualStart ? { actualStart: new Date() } : {}),
            ...(upperStatus === "COMPLETED" ? { actualEnd: new Date() } : {}),
        })
            .where((0, drizzle_orm_1.eq)(production_js_1.productionOrders.id, order.id))
            .returning();
        return updated || { id: order.id, status: newStatus, updatedAt: new Date() };
    }
    async listBatches(tenantId) {
        return await database_js_1.db.query.batches.findMany({
            where: (0, drizzle_orm_1.eq)(production_js_1.batches.tenantId, tenantId),
            with: {
                sku: true,
                steps: true,
                ccpChecks: true,
                qaRelease: true,
            },
        });
    }
    async advanceBatchStep(tenantId, batchId, input, userId) {
        const [batch] = await database_js_1.db.select().from(production_js_1.batches).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(production_js_1.batches.tenantId, tenantId), (0, drizzle_orm_1.eq)(production_js_1.batches.id, batchId)));
        if (!batch)
            throw new AppError_js_1.NotFoundError("Batch");
        // Complete current step
        await database_js_1.db
            .update(production_js_1.batchSteps)
            .set({
            status: "COMPLETED",
            parameters: input.parameters,
            notes: input.notes,
            operatorId: userId,
            completedAt: new Date(),
        })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(production_js_1.batchSteps.batchId, batchId), (0, drizzle_orm_1.eq)(production_js_1.batchSteps.stepNumber, input.stepNumber)));
        const nextStep = Math.min(6, input.stepNumber + 1);
        const progress = Math.round((nextStep / 6) * 100);
        const [updatedBatch] = await database_js_1.db
            .update(production_js_1.batches)
            .set({
            currentStep: nextStep,
            progressPercent: progress,
            status: nextStep === 6 ? "QA Pending" : "In Process",
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(production_js_1.batches.id, batchId))
            .returning();
        return updatedBatch;
    }
    async recordOperatorEntry(tenantId, plantId, input, userId) {
        const [log] = await database_js_1.db
            .insert(production_js_1.shiftLogs)
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
        await database_js_1.db
            .update(production_js_1.productionOrders)
            .set({
            producedQuantity: (0, drizzle_orm_1.sql) `${production_js_1.productionOrders.producedQuantity} + ${input.goodUnitsIncrement}`,
            scrapQuantity: (0, drizzle_orm_1.sql) `${production_js_1.productionOrders.scrapQuantity} + ${input.scrapUnitsIncrement}`,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(production_js_1.productionOrders.id, input.orderId));
        return log;
    }
    async logDowntime(tenantId, plantId, input, userId) {
        const [downtime] = await database_js_1.db
            .insert(production_js_1.downtimeLogs)
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
exports.ProductionService = ProductionService;
exports.productionService = new ProductionService();
//# sourceMappingURL=production.service.js.map